'use client'

import { useState } from 'react'
import { useStore, uid, Player } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'UT', 'Other']
const BATS = ['R', 'L', 'S']
const THROWS = ['R', 'L']

const EMPTY_FORM = {
  name: '',
  jersey: '',
  pos: '',
  bats: 'R',
  throws: 'R',
  grad: '',
  parent: '',
  email: '',
  phone: '',
  notes: '',
}

export default function RosterPage() {
  const { store, update } = useStore()
  const { toast } = useToast()
  const { players, games, settings } = store

  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [statsModal, setStatsModal] = useState<Player | null>(null)
  const [search, setSearch] = useState('')

  function addPlayer() {
    if (!form.name.trim()) { toast('Enter player name', 'warn'); return }
    const p: Player = {
      id: uid(),
      name: form.name.trim(),
      jersey: form.jersey.trim(),
      pos: form.pos,
      bats: form.bats as Player['bats'],
      throws: form.throws as Player['throws'],
      grad: form.grad,
      parent: form.parent.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
      stats: { ab: 0, h: 0, rbi: 0, r: 0, bb: 0, k: 0, hr: 0, avg: 0 },
    }
    update(prev => ({ ...prev, players: [...prev.players, p] }))
    setForm(EMPTY_FORM)
    setAddOpen(false)
    toast('Player added', 'success')
  }

  function deletePlayer(id: string) {
    if (!confirm('Remove this player from the roster?')) return
    update(prev => ({ ...prev, players: prev.players.filter(p => p.id !== id) }))
    toast('Player removed')
  }

  function calcPlayerSeasonStats(playerId: string) {
    let ab = 0, h = 0, rbi = 0, r = 0, bb = 0, k = 0, hr = 0
    for (const g of games) {
      const ps = g.stats?.[playerId]
      if (ps) {
        ab += ps.ab || 0; h += ps.h || 0; rbi += ps.rbi || 0
        r += ps.r || 0; bb += ps.bb || 0; k += ps.k || 0; hr += ps.hr || 0
      }
    }
    const avg = ab > 0 ? (h / ab) : 0
    return { ab, h, rbi, r, bb, k, hr, avg }
  }

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.pos || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.jersey || '').includes(search)
  )

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Roster</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        {settings.teamName} · {players.length} players
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 180,
            background: 'var(--bg2)', border: '1px solid var(--bg4)',
            color: 'var(--text)', padding: '8px 12px', borderRadius: 7, fontSize: 13, outline: 'none',
          }}
        />
        <button
          onClick={() => setAddOpen(o => !o)}
          style={{ background: 'var(--red)', color: '#fff', padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          {addOpen ? '✕ Cancel' : '+ Add Player'}
        </button>
      </div>

      {/* Add player form */}
      {addOpen && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { label: 'Name *', key: 'name', placeholder: 'Full name' },
            { label: 'Jersey #', key: 'jersey', placeholder: '21' },
            { label: 'Grad Year', key: 'grad', placeholder: '2027' },
            { label: 'Parent Name', key: 'parent', placeholder: 'Parent name' },
            { label: 'Email', key: 'email', placeholder: 'email@example.com' },
            { label: 'Phone', key: 'phone', placeholder: '(555) 123-4567' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={(form as Record<string, string>)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Position</label>
            <select
              value={form.pos}
              onChange={e => setForm(f => ({ ...f, pos: e.target.value }))}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="">Select...</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Bats</label>
            <select
              value={form.bats}
              onChange={e => setForm(f => ({ ...f, bats: e.target.value }))}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            >
              {BATS.map(b => <option key={b} value={b}>{b === 'R' ? 'Right' : b === 'L' ? 'Left' : 'Switch'}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Throws</label>
            <select
              value={form.throws}
              onChange={e => setForm(f => ({ ...f, throws: e.target.value }))}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            >
              {THROWS.map(t => <option key={t} value={t}>{t === 'R' ? 'Right' : 'Left'}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Notes</label>
            <input
              type="text"
              placeholder="Any notes..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button onClick={addPlayer} style={{ background: 'var(--red)', color: '#fff', padding: '9px 22px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Save Player
            </button>
          </div>
        </div>
      )}

      {/* Player cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '40px 20px', background: 'var(--bg2)', border: '1px dashed var(--bg4)', borderRadius: 12 }}>
          {players.length === 0 ? 'No players yet. Add your first player above.' : 'No players match your search.'}
        </div>
      ) : (
        <>
          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
            {filtered.map(p => {
              const ss = calcPlayerSeasonStats(p.id)
              return (
                <div key={p.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'var(--red)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, flexShrink: 0,
                    }}>
                      {p.jersey || p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                        {p.pos || 'No position'}{p.jersey ? ` · #${p.jersey}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.bats && <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '1px 6px', borderRadius: 3, fontSize: 10 }}>Bats {p.bats}</span>}
                    {p.throws && <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '1px 6px', borderRadius: 3, fontSize: 10 }}>Throws {p.throws}</span>}
                    {p.grad && <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '1px 6px', borderRadius: 3, fontSize: 10 }}>{p.grad}</span>}
                  </div>
                  {ss.ab > 0 && (
                    <div style={{ display: 'flex', gap: 12, background: 'var(--bg)', borderRadius: 6, padding: '6px 10px', fontSize: 12 }}>
                      <span style={{ color: 'var(--text2)' }}>AVG <strong style={{ color: 'var(--text)' }}>{ss.ab > 0 ? (ss.h / ss.ab).toFixed(3).replace(/^0/, '') : '.000'}</strong></span>
                      <span style={{ color: 'var(--text2)' }}>RBI <strong style={{ color: 'var(--text)' }}>{ss.rbi}</strong></span>
                      <span style={{ color: 'var(--text2)' }}>HR <strong style={{ color: 'var(--text)' }}>{ss.hr}</strong></span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button
                      onClick={() => setStatsModal(p)}
                      style={{ flex: 1, background: 'var(--bg4)', border: 'none', color: 'var(--text2)', padding: '6px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
                    >
                      Stats
                    </button>
                    <button
                      onClick={() => deletePlayer(p.id)}
                      style={{ background: 'none', border: '1px solid var(--bg4)', color: 'var(--text3)', padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Batting stats table */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, overflowX: 'auto' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, color: 'var(--text)' }}>Season Batting Stats</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
              <thead>
                <tr>
                  {['#', 'Player', 'POS', 'G', 'AB', 'H', 'AVG', 'RBI', 'R', 'BB', 'K', 'HR'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', textAlign: h === 'Player' ? 'left' : 'center', color: 'var(--text2)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const ss = calcPlayerSeasonStats(p.id)
                  const gamesPlayed = games.filter(g => g.stats?.[p.id]).length
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--bg4)' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text3)', fontSize: 12 }}>{p.jersey || '—'}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--text)', fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text2)' }}>{p.pos || '—'}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text2)' }}>{gamesPlayed}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text)' }}>{ss.ab}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text)' }}>{ss.h}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: 'var(--text)' }}>
                        {ss.ab > 0 ? (ss.h / ss.ab).toFixed(3).replace(/^0/, '') : '.000'}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text)' }}>{ss.rbi}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text)' }}>{ss.r}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text)' }}>{ss.bb}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text)' }}>{ss.k}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text)' }}>{ss.hr}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Stats modal */}
      {statsModal && (() => {
        const ss = calcPlayerSeasonStats(statsModal.id)
        const gamesPlayed = games.filter(g => g.stats?.[statsModal.id]).length
        return (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={e => { if (e.target === e.currentTarget) setStatsModal(null) }}
          >
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, width: '100%', maxWidth: 480 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, color: 'var(--text)' }}>{statsModal.name}</h3>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                    {statsModal.pos || 'No position'}{statsModal.jersey ? ` · #${statsModal.jersey}` : ''}
                  </div>
                </div>
                <button onClick={() => setStatsModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 22, cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { lbl: 'Games', val: gamesPlayed },
                  { lbl: 'AB', val: ss.ab },
                  { lbl: 'Hits', val: ss.h },
                  { lbl: 'AVG', val: ss.ab > 0 ? (ss.h / ss.ab).toFixed(3).replace(/^0/, '') : '.000' },
                  { lbl: 'RBI', val: ss.rbi },
                  { lbl: 'Runs', val: ss.r },
                  { lbl: 'BB', val: ss.bb },
                  { lbl: 'K', val: ss.k },
                  { lbl: 'HR', val: ss.hr },
                ].map(({ lbl, val }) => (
                  <div key={lbl} style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: 3 }}>{lbl}</div>
                  </div>
                ))}
              </div>
              {statsModal.parent && (
                <div style={{ fontSize: 12, color: 'var(--text3)', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  Parent: {statsModal.parent}{statsModal.email ? ` · ${statsModal.email}` : ''}{statsModal.phone ? ` · ${statsModal.phone}` : ''}
                </div>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
