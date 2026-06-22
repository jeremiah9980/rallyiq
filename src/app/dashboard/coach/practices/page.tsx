'use client'

import { useState } from 'react'
import { useStore, uid, Plan } from '@/lib/store'
import { useStream } from '@/hooks/useStream'
import { useToast } from '@/components/ui/Toast'

const PLAYER_MARKER = '---PLAYER-VERSION---'

function renderMarkdown(text: string): string {
  try {
    if (typeof window !== 'undefined' && (window as typeof window & { marked?: { parse: (s: string) => string } }).marked) {
      return (window as typeof window & { marked: { parse: (s: string) => string } }).marked.parse(text)
    }
  } catch {}
  return text.replace(/\n/g, '<br/>')
}

export default function PracticePlannerPage() {
  const { store, update } = useStore()
  const { streamClaude } = useStream(store.apiKey)
  const { toast } = useToast()

  const [age, setAge] = useState(store.settings.defaultAge || '10U')
  const [dur, setDur] = useState('90 minutes')
  const [players, setPlayers] = useState('9–12')
  const [focus, setFocus] = useState('Hitting mechanics')
  const [coaches, setCoaches] = useState('')
  const [notes, setNotes] = useState('')

  const [coachHtml, setCoachHtml] = useState('')
  const [playerHtml, setPlayerHtml] = useState('')
  const [coachRaw, setCoachRaw] = useState('')
  const [playerRaw, setPlayerRaw] = useState('')
  const [view, setView] = useState<'coach' | 'player'>('coach')
  const [generating, setGenerating] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [outTitle, setOutTitle] = useState('')
  const [viewModal, setViewModal] = useState<Plan | null>(null)
  const [modalView, setModalView] = useState<'coach' | 'player'>('coach')

  async function genPractice() {
    if (!store.apiKey) { toast('Set your API key first', 'warn'); return }
    setGenerating(true)
    setShowOutput(true)
    setCoachHtml('<span class="cursor"></span>')
    setPlayerHtml('')
    setView('coach')
    const title = `${age} · ${focus} · ${dur}`
    setOutTitle(title)

    const coachList = coaches ? coaches.split(',').map(c => c.trim()).filter(Boolean) : []
    const coachLine = coachList.length
      ? 'Assistant coaches available: ' + coachList.join(', ') + ' — assign each to specific stations and rotations'
      : 'No assistant coaches — head coach runs all stations alone, design accordingly'

    const sys = `You are an experienced travel softball coach who creates practice plans in TWO synchronized versions: one for the COACHING STAFF and one for PLAYERS to review BEFORE practice.\n\nOutput BOTH versions in a single response, separated by EXACTLY this marker on its own line: ${PLAYER_MARKER}\n\nCOACH VERSION (before the marker):\nAudience: Head coach + assistant coaches reviewing the night before practice.\nFormat with markdown. Structure: # Coach Plan, ## Overview (goals, equipment list, setup notes), then Time Block 1 (Warmup), Time Block 2 (Skill block), Time Block 3 (Team segment), Time Block 4 (Cool-down). For each block include: coach assignment by name, drill name and structure, reps/timing, 2-3 coaching cues, what to watch for.\nEnd with Coach takeaways: 3 reinforcement points and what to follow up on next practice.\n\nPLAYER VERSION (after the marker):\nAudience: Players (age-appropriate for ${age}) reviewing on their phone the night before. Direct, motivating tone. Talk to the player.\nFormat with markdown. Structure: # Practice Prep, ## What we are working on, ## What to bring (checklist), ## How to mentally prep, ## The plan (time blocks with player-perspective descriptions), ## Your focus today, ## After practice.\n\nKeep the player version friendly and energizing. No coach-speak. Speak to a ${age} athlete.`

    const userPrompt = `Generate the dual-version practice plan now.\n\nTeam: ${age} travel softball, ${players} players, ${dur} practice\nFocus: ${focus}\n${coachLine}${notes ? '\nAdditional context: ' + notes : ''}\n\nOutput COACH version first, then "${PLAYER_MARKER}" on its own line, then PLAYER version.`

    await streamClaude({
      system: sys,
      max_tokens: 6000,
      messages: [{ role: 'user', content: userPrompt }],
      onText: (_, full) => {
        const idx = full.indexOf(PLAYER_MARKER)
        if (idx >= 0) {
          setCoachHtml(renderMarkdown(full.slice(0, idx).trim()))
          setPlayerHtml(renderMarkdown(full.slice(idx + PLAYER_MARKER.length).trim()) + '<span class="cursor"></span>')
        } else {
          setCoachHtml(renderMarkdown(full) + '<span class="cursor"></span>')
        }
      },
      onDone: (full) => {
        const idx = full.indexOf(PLAYER_MARKER)
        const c = idx >= 0 ? full.slice(0, idx).trim() : full
        const p = idx >= 0 ? full.slice(idx + PLAYER_MARKER.length).trim() : ''
        setCoachRaw(c)
        setPlayerRaw(p)
        setCoachHtml(renderMarkdown(c))
        setPlayerHtml(p ? renderMarkdown(p) : '<div style="text-align:center;color:var(--text2);padding:20px">Player version not generated.</div>')
        setGenerating(false)
        toast('Both versions ready')
      },
      onError: (e) => {
        setCoachHtml('<span style="color:var(--red3)">⚠ ' + e.message + '</span>')
        setGenerating(false)
      },
    })
  }

  function savePlan() {
    if (!coachRaw) { toast('Generate a plan first', 'warn'); return }
    const plan: Plan = {
      id: uid(),
      title: outTitle,
      coachContent: coachRaw,
      playerContent: playerRaw,
      age, dur, players, focus, coaches, notes,
      created: Date.now(),
    }
    update((prev) => ({ ...prev, plans: [plan, ...prev.plans] }))
    toast('Plan saved (both versions)')
  }

  function copyPlan() {
    const txt = view === 'player' ? playerRaw : coachRaw
    if (!txt) return
    navigator.clipboard.writeText(txt).then(() => toast('Copied ' + view + ' version'))
  }

  function printPlan() {
    const txt = view === 'player' ? playerRaw : coachRaw
    if (!txt) return
    const label = view === 'player' ? 'Player Prep' : 'Coach Plan'
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<html><head><title>${label}</title><style>body{font-family:sans-serif;max-width:780px;margin:30px auto;padding:20px;line-height:1.6;color:#222}h1,h2,h3{color:#0f1f3d}h3{color:#c0392b}@media print{body{margin:0}}</style></head><body>${renderMarkdown(txt)}</body></html>`)
    w.document.close()
    w.print()
  }

  function deletePlan(id: string) {
    if (!confirm('Delete this plan?')) return
    update((prev) => ({ ...prev, plans: prev.plans.filter(p => p.id !== id) }))
    toast('Plan deleted', 'warn')
  }

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Practice plans</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        Dual-version output — coaches get assignments &amp; cues, players get a pre-practice prep doc
      </p>

      {/* Generator form */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, color: 'var(--text)', marginBottom: 14 }}>New practice plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>Age group</label>
            <select value={age} onChange={e => setAge(e.target.value)} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14 }}>
              {['8U','10U','12U','14U','16U','18U'].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>Duration</label>
            <select value={dur} onChange={e => setDur(e.target.value)} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14 }}>
              <option>60 minutes</option><option>90 minutes</option><option>2 hours</option><option>2.5 hours</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>Player count</label>
            <select value={players} onChange={e => setPlayers(e.target.value)} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14 }}>
              <option>6–8</option><option>9–12</option><option>13–15</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>Focus area</label>
            <select value={focus} onChange={e => setFocus(e.target.value)} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14 }}>
              <option>Hitting mechanics</option><option>Pitching fundamentals</option><option>Fielding &amp; defense</option>
              <option>Baserunning</option><option>Catching</option><option>Game situations</option>
              <option>Conditioning &amp; athleticism</option><option>Pre-tournament prep</option><option>Full team practice</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>Assistant coaches</label>
          <input type="text" value={coaches} onChange={e => setCoaches(e.target.value)} placeholder="e.g. Coach Mike, Coach Sarah" style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14, outline: 'none' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, color: 'var(--text2)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>Additional context</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Tournament Saturday, indoor only, specific players to work with..." style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14, outline: 'none', resize: 'vertical' }} />
        </div>
        <button
          onClick={genPractice}
          disabled={generating}
          style={{ background: generating ? 'var(--bg4)' : 'var(--red)', color: '#fff', padding: '10px 18px', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {generating ? '⏳ Generating both versions...' : '⚡ Generate dual plan'}
        </button>
      </div>

      {/* Output */}
      {showOutput && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text)' }}>{outTitle || 'Practice plan'}</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 7, overflow: 'hidden' }}>
                {(['coach', 'player'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{ padding: '7px 14px', fontSize: 12, fontWeight: 500, background: view === v ? 'var(--red)' : 'transparent', color: view === v ? '#fff' : 'var(--text2)', border: 'none', cursor: 'pointer', borderRight: v === 'coach' ? '1px solid var(--bg4)' : 'none' }}
                  >
                    {v === 'coach' ? '📋 Coach' : '🏃 Player'}
                  </button>
                ))}
              </div>
              <button onClick={savePlan} style={{ background: 'transparent', border: '1px solid var(--bg4)', color: 'var(--text2)', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>💾 Save</button>
              <button onClick={copyPlan} style={{ background: 'transparent', border: '1px solid var(--bg4)', color: 'var(--text2)', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>📋 Copy</button>
              <button onClick={printPlan} style={{ background: 'transparent', border: '1px solid var(--bg4)', color: 'var(--text2)', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>🖨️ Print</button>
            </div>
          </div>
          {view === 'coach' ? (
            <div className="output" dangerouslySetInnerHTML={{ __html: coachHtml || '<span style="color:var(--text2);font-style:italic">Output will appear here.</span>' }} />
          ) : (
            <div className="output" dangerouslySetInnerHTML={{ __html: playerHtml || '<span style="color:var(--text2);font-style:italic">Player version will appear after generation.</span>' }} />
          )}
        </div>
      )}

      {/* Library */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text)' }}>Saved plans ({store.plans.length})</h3>
        </div>
        {store.plans.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '30px 20px', background: 'var(--bg)', border: '1px dashed var(--bg4)', borderRadius: 8 }}>
            No saved plans yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {store.plans.map(p => (
              <div
                key={p.id}
                onClick={() => { setViewModal(p); setModalView('coach') }}
                style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 8, padding: 14, cursor: 'pointer', transition: 'all .15s' }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14, marginBottom: 4 }}>
                  {p.title}
                  {p.playerContent && <span style={{ background: 'var(--red)', color: '#fff', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 500, marginLeft: 6 }}>DUAL</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                  {p.dur} · {new Date(p.created).toLocaleDateString()}
                </div>
                <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {(p.coachContent || '').slice(0, 180)}...
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bg4)' }}>
                  <button onClick={e => { e.stopPropagation(); setViewModal(p); setModalView('coach') }} style={{ background: 'transparent', border: '1px solid var(--bg4)', color: 'var(--text2)', padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>View</button>
                  <button onClick={e => { e.stopPropagation(); deletePlan(p.id) }} style={{ background: 'var(--bg3)', border: '1px solid var(--red)', color: 'var(--red3)', padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View modal */}
      {viewModal && (
        <div className="modal-bg" style={{ animation: 'fadeIn .15s' }} onClick={() => setViewModal(null)}>
          <div className="modal" style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
            <h2>{viewModal.title}</h2>
            <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 16 }}>
              {viewModal.dur} · {viewModal.players} players · {new Date(viewModal.created).toLocaleDateString()}
            </p>
            {viewModal.playerContent && (
              <div style={{ display: 'flex', background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 7, overflow: 'hidden', marginBottom: 14, width: 'fit-content' }}>
                {(['coach', 'player'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setModalView(v)}
                    style={{ padding: '7px 14px', fontSize: 12, fontWeight: 500, background: modalView === v ? 'var(--red)' : 'transparent', color: modalView === v ? '#fff' : 'var(--text2)', border: 'none', cursor: 'pointer', borderRight: v === 'coach' ? '1px solid var(--bg4)' : 'none' }}
                  >
                    {v === 'coach' ? 'Coach' : 'Player'}
                  </button>
                ))}
              </div>
            )}
            <div className="output" dangerouslySetInnerHTML={{ __html: renderMarkdown(modalView === 'player' && viewModal.playerContent ? viewModal.playerContent : viewModal.coachContent) }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
              <button onClick={() => setViewModal(null)} style={{ background: 'transparent', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '10px 18px', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
