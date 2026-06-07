'use client'

import { useState } from 'react'
import { useStore, uid, Tournament, TournGame } from '@/lib/store'
import { useStream } from '@/hooks/useStream'
import { useToast } from '@/components/ui/Toast'

const TOURN_MARKER = '---PARENT-VERSION---'

const EMPTY_FORM = {
  name: '',
  location: '',
  startDate: '',
  endDate: '',
  format: 'pool',
  uniformPrimary: '',
  uniformAlt: '',
  parkingInfo: '',
  foodPlan: '',
  notes: '',
}

const EMPTY_GAME: Omit<TournGame, 'id'> = {
  day: 1,
  gameNum: 1,
  time: '',
  arrive: '',
  opp: '',
  field: '',
  uniform: '',
  notes: '',
}

export default function TournamentsPage() {
  const { store, update } = useStore()
  const { streamClaude } = useStream(store.apiKey)
  const { toast } = useToast()
  const { tournaments, players, settings } = store

  const [tab, setTab] = useState<'list' | 'add' | 'detail'>('list')
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'coach' | 'parent'>('coach')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [addGameForm, setAddGameForm] = useState({ ...EMPTY_GAME })
  const [showAddGame, setShowAddGame] = useState(false)

  const selected = tournaments.find(t => t.id === selectedId) ?? null

  function saveTournament() {
    if (!form.name.trim()) { toast('Enter tournament name', 'warn'); return }
    if (!form.startDate) { toast('Enter start date', 'warn'); return }
    const t: Tournament = {
      id: uid(),
      name: form.name.trim(),
      location: form.location.trim(),
      startDate: form.startDate,
      endDate: form.endDate || form.startDate,
      format: form.format,
      uniformPrimary: form.uniformPrimary.trim(),
      uniformAlt: form.uniformAlt.trim(),
      parkingInfo: form.parkingInfo.trim(),
      foodPlan: form.foodPlan.trim(),
      notes: form.notes.trim(),
      games: [],
      coachContent: '',
      parentContent: '',
      created: Date.now(),
    }
    update(prev => ({ ...prev, tournaments: [t, ...prev.tournaments] }))
    setForm(EMPTY_FORM)
    setSelectedId(t.id)
    setTab('detail')
    toast('Tournament created', 'success')
  }

  function deleteTournament(id: string) {
    if (!confirm('Delete this tournament?')) return
    update(prev => ({ ...prev, tournaments: prev.tournaments.filter(t => t.id !== id) }))
    if (selectedId === id) { setSelectedId(null); setTab('list') }
    toast('Tournament deleted')
  }

  function addGame() {
    if (!addGameForm.opp.trim()) { toast('Enter opponent', 'warn'); return }
    if (!selectedId) return
    const g: TournGame = { ...addGameForm, id: uid() }
    update(prev => ({
      ...prev,
      tournaments: prev.tournaments.map(t =>
        t.id === selectedId ? { ...t, games: [...t.games, g].sort((a, b) => a.day - b.day || a.gameNum - b.gameNum) } : t
      ),
    }))
    setAddGameForm({ ...EMPTY_GAME })
    setShowAddGame(false)
    toast('Game added', 'success')
  }

  function deleteGame(gameId: string) {
    if (!selectedId) return
    update(prev => ({
      ...prev,
      tournaments: prev.tournaments.map(t =>
        t.id === selectedId ? { ...t, games: t.games.filter(g => g.id !== gameId) } : t
      ),
    }))
  }

  async function generateItinerary() {
    if (!store.apiKey) { toast('Set your API key first', 'warn'); return }
    if (!selected) return
    setStreaming(true)
    setStreamingText('')

    const system = `You are a travel softball tournament coordinator. Create comprehensive dual itineraries.
Generate TWO versions separated by exactly "${TOURN_MARKER}":
1. COACH VERSION: Detailed strategic itinerary with lineup considerations, warmup protocols, field assessment, matchup notes, in-game adjustments
2. PARENT/FAMILY VERSION: Simple friendly itinerary with times, locations, what to bring, food options, parking, photo opportunities

Format both with markdown headers. Be practical and specific.`

    const rosterList = players.map(p => `${p.name} (#${p.jersey || '?'}, ${p.pos || 'P'})`).join(', ')
    const gameList = selected.games.map(g => `Day ${g.day} Game ${g.gameNum}: ${g.time || '?'} vs ${g.opp}${g.field ? ' @ ' + g.field : ''}${g.uniform ? ' — ' + g.uniform + ' uniforms' : ''}`).join('\n')

    const prompt = `Create a complete tournament itinerary for:

**${selected.name}**
Location: ${selected.location || 'TBD'}
Dates: ${selected.startDate}${selected.endDate !== selected.startDate ? ' – ' + selected.endDate : ''}
Format: ${selected.format}
Team: ${settings.teamName} (${settings.defaultAge})
Roster: ${rosterList || 'See team roster'}

Games:
${gameList || 'Games TBD'}

Uniform: Primary: ${selected.uniformPrimary || 'TBD'}, Alt: ${selected.uniformAlt || 'TBD'}
Parking: ${selected.parkingInfo || 'TBD'}
Food plan: ${selected.foodPlan || 'TBD'}
Notes: ${selected.notes || 'None'}`

    let fullText = ''
    await streamClaude({
      system,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      onText: (_, full) => { fullText = full; setStreamingText(full) },
      onDone: (full) => {
        setStreaming(false)
        setStreamingText('')
        const idx = full.indexOf(TOURN_MARKER)
        const coachContent = idx >= 0 ? full.slice(0, idx).trim() : full
        const parentContent = idx >= 0 ? full.slice(idx + TOURN_MARKER.length).trim() : ''
        update(prev => ({
          ...prev,
          tournaments: prev.tournaments.map(t =>
            t.id === selectedId ? { ...t, coachContent, parentContent } : t
          ),
        }))
        toast('Itinerary generated!', 'success')
      },
      onError: (e) => {
        setStreaming(false)
        setStreamingText('')
        toast('Error: ' + e.message, 'error')
      },
    })
  }

  function renderMarkdown(text: string) {
    try {
      if (typeof window !== 'undefined' && (window as typeof window & { marked?: { parse: (s: string) => string } }).marked) {
        return (window as typeof window & { marked: { parse: (s: string) => string } }).marked.parse(text)
      }
    } catch { /* noop */ }
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
  }

  const tabBtn = (t: typeof tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      style={{
        padding: '8px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
        background: tab === t ? 'var(--red)' : 'var(--bg4)',
        color: tab === t ? '#fff' : 'var(--text2)',
      }}
    >
      {label}
    </button>
  )

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Tournaments</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        Manage tournaments and generate dual coach/parent itineraries
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {tabBtn('list', `All (${tournaments.length})`)}
        {tabBtn('add', '+ New Tournament')}
        {selected && tabBtn('detail', selected.name.slice(0, 20) + (selected.name.length > 20 ? '…' : ''))}
      </div>

      {/* List tab */}
      {tab === 'list' && (
        <div>
          {tournaments.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '40px 20px', background: 'var(--bg2)', border: '1px dashed var(--bg4)', borderRadius: 12 }}>
              No tournaments yet. Click "+ New Tournament" to add one.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tournaments.map(t => (
                <div
                  key={t.id}
                  style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                      {t.location || 'Location TBD'} · {t.startDate}{t.endDate !== t.startDate ? ' – ' + t.endDate : ''} · {t.games.length} games
                    </div>
                  </div>
                  {(t.coachContent || t.parentContent) && (
                    <span style={{ background: 'rgba(39,174,96,.15)', color: '#27ae60', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>PLANNED</span>
                  )}
                  <button
                    onClick={() => { setSelectedId(t.id); setTab('detail') }}
                    style={{ background: 'var(--bg4)', border: 'none', color: 'var(--text)', padding: '7px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer' }}
                  >
                    Open →
                  </button>
                  <button
                    onClick={() => deleteTournament(t.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 16, cursor: 'pointer', padding: '4px 6px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add tab */}
      {tab === 'add' && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { label: 'Tournament Name *', key: 'name', placeholder: 'Spring Invitational 2026' },
            { label: 'Location', key: 'location', placeholder: 'City, State' },
            { label: 'Start Date', key: 'startDate', type: 'date' },
            { label: 'End Date', key: 'endDate', type: 'date' },
            { label: 'Primary Uniform', key: 'uniformPrimary', placeholder: 'e.g. Black top, white pants' },
            { label: 'Alt Uniform', key: 'uniformAlt', placeholder: 'e.g. White top, black pants' },
            { label: 'Parking Info', key: 'parkingInfo', placeholder: 'Lot A, GPS: ...' },
            { label: 'Food Plan', key: 'foodPlan', placeholder: 'Coolers ok, snack bar available' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>{label}</label>
              <input
                type={type || 'text'}
                placeholder={placeholder}
                value={(form as Record<string, string>)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Format</label>
            <select
              value={form.format}
              onChange={e => setForm(f => ({ ...f, format: e.target.value }))}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            >
              {['pool', 'bracket', 'pool+bracket', 'round-robin', 'other'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Notes</label>
            <input
              type="text"
              placeholder="Any other details..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button onClick={saveTournament} style={{ background: 'var(--red)', color: '#fff', padding: '9px 22px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Create Tournament
            </button>
          </div>
        </div>
      )}

      {/* Detail tab */}
      {tab === 'detail' && selected && (
        <div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>{selected.name}</h2>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>
                  {selected.location || 'Location TBD'} · {selected.startDate}{selected.endDate !== selected.startDate ? ' – ' + selected.endDate : ''} · {selected.format}
                </div>
              </div>
              <button
                onClick={generateItinerary}
                disabled={streaming}
                style={{
                  background: streaming ? 'var(--bg4)' : 'var(--red)', color: '#fff',
                  padding: '9px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                  border: 'none', cursor: streaming ? 'not-allowed' : 'pointer',
                }}
              >
                {streaming ? '⏳ Generating...' : '✨ Generate Itinerary'}
              </button>
            </div>

            {/* Game schedule */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 14, color: 'var(--text)' }}>Game Schedule</h3>
                <button
                  onClick={() => setShowAddGame(o => !o)}
                  style={{ background: 'var(--bg4)', border: 'none', color: 'var(--text2)', padding: '5px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
                >
                  {showAddGame ? 'Cancel' : '+ Add Game'}
                </button>
              </div>
              {showAddGame && (
                <div style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 8, padding: 14, marginBottom: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                  {[
                    { label: 'Day', key: 'day', type: 'number' },
                    { label: 'Game #', key: 'gameNum', type: 'number' },
                    { label: 'Time', key: 'time', placeholder: '9:00 AM' },
                    { label: 'Arrive By', key: 'arrive', placeholder: '8:30 AM' },
                    { label: 'Opponent *', key: 'opp', placeholder: 'Team name' },
                    { label: 'Field', key: 'field', placeholder: 'Field 3' },
                    { label: 'Uniform', key: 'uniform', placeholder: 'Black top' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.3px', display: 'block', marginBottom: 3 }}>{label}</label>
                      <input
                        type={type || 'text'}
                        placeholder={placeholder}
                        value={String((addGameForm as Record<string, string | number>)[key])}
                        onChange={e => setAddGameForm(f => ({ ...f, [key]: type === 'number' ? (parseInt(e.target.value) || 1) : e.target.value }))}
                        style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '6px 8px', borderRadius: 6, fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-end' }}>
                    <button onClick={addGame} style={{ background: 'var(--red)', color: '#fff', padding: '7px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                      Add
                    </button>
                  </div>
                </div>
              )}
              {selected.games.length === 0 ? (
                <div style={{ color: 'var(--text3)', fontSize: 12, padding: '12px 0' }}>No games added yet.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['Day', 'Time', 'Arrive', 'Opponent', 'Field', 'Uniform', ''].map(h => (
                        <th key={h} style={{ padding: '5px 8px', textAlign: 'left', color: 'var(--text3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.3px', borderBottom: '1px solid var(--bg4)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.games.map(g => (
                      <tr key={g.id} style={{ borderBottom: '1px solid var(--bg4)' }}>
                        <td style={{ padding: '6px 8px', color: 'var(--text2)' }}>D{g.day}G{g.gameNum}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--text)' }}>{g.time || '—'}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--text2)' }}>{g.arrive || '—'}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--text)', fontWeight: 500 }}>{g.opp}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--text2)' }}>{g.field || '—'}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--text2)' }}>{g.uniform || '—'}</td>
                        <td style={{ padding: '4px 6px' }}>
                          <button onClick={() => deleteGame(g.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 13 }}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Itinerary output */}
          {(streaming || selected.coachContent || selected.parentContent) && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text)' }}>Tournament Itinerary</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ v: 'coach', label: 'Coach View' }, { v: 'parent', label: 'Parent View' }].map(({ v, label }) => (
                    <button
                      key={v}
                      onClick={() => setViewMode(v as 'coach' | 'parent')}
                      style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 12, border: 'none', cursor: 'pointer',
                        background: viewMode === v ? 'var(--red)' : 'var(--bg4)',
                        color: viewMode === v ? '#fff' : 'var(--text2)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="output">
                {streaming ? (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) + '<span class="cursor"></span>' }} />
                ) : viewMode === 'coach' ? (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.coachContent) }} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.parentContent) }} />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
