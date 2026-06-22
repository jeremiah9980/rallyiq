'use client'

import { useState } from 'react'
import { useStore, uid, Game, GameStats } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  opp: '',
  loc: '',
  type: 'regular' as Game['type'],
  us: '',
  them: '',
  notes: '',
}

export default function SeasonTrackerPage() {
  const { store, update } = useStore()
  const { toast } = useToast()
  const { games, players, settings } = store

  const [form, setForm] = useState(EMPTY_FORM)
  const [addOpen, setAddOpen] = useState(false)
  const [statsModal, setStatsModal] = useState<Game | null>(null)
  const [editingStats, setEditingStats] = useState<Record<string, GameStats>>({})

  /* ---- computed ---- */
  const w = games.filter(g => g.res === 'W').length
  const l = games.filter(g => g.res === 'L').length
  const t = games.filter(g => g.res === 'T').length
  const rs = games.reduce((s, g) => s + (g.us || 0), 0)
  const ra = games.reduce((s, g) => s + (g.them || 0), 0)
  const totalAB = players.reduce((s, p) => s + (p.stats?.ab || 0), 0)
  const totalH = players.reduce((s, p) => s + (p.stats?.h || 0), 0)
  const avgStr = totalAB > 0 ? (totalH / totalAB).toFixed(3).replace(/^0/, '') : '.000'

  const sorted = [...games].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const chartData = sorted.map((g, i) => {
    const slice = sorted.slice(0, i + 1)
    return {
      game: i + 1,
      wins: slice.filter(x => x.res === 'W').length,
      losses: slice.filter(x => x.res === 'L').length,
      diff: slice.reduce((s, x) => s + (x.us || 0) - (x.them || 0), 0),
    }
  })

  /* ---- handlers ---- */
  function submitGame() {
    const usScore = parseInt(form.us)
    const themScore = parseInt(form.them)
    if (!form.opp.trim()) { toast('Enter opponent name', 'warn'); return }
    if (!form.date) { toast('Enter date', 'warn'); return }
    if (isNaN(usScore) || isNaN(themScore)) { toast('Enter valid scores', 'warn'); return }
    const res: Game['res'] = usScore > themScore ? 'W' : usScore < themScore ? 'L' : 'T'
    const g: Game = {
      id: uid(),
      date: form.date,
      opp: form.opp.trim(),
      loc: form.loc.trim(),
      type: form.type,
      us: usScore,
      them: themScore,
      res,
      notes: form.notes.trim(),
      stats: {},
    }
    update(prev => ({ ...prev, games: [g, ...prev.games] }))
    setForm(EMPTY_FORM)
    setAddOpen(false)
    toast(`Game added — ${res === 'W' ? 'Win!' : res === 'L' ? 'Loss.' : 'Tie.'}`, res === 'W' ? 'success' : 'warn')
  }

  function deleteGame(id: string) {
    if (!confirm('Delete this game?')) return
    update(prev => ({ ...prev, games: prev.games.filter(g => g.id !== id) }))
    toast('Game deleted')
  }

  function openStats(game: Game) {
    const initial: Record<string, GameStats> = {}
    for (const p of players) {
      initial[p.id] = game.stats?.[p.id] ?? { ab: 0, h: 0, rbi: 0, r: 0, bb: 0, k: 0, hr: 0 }
    }
    setEditingStats(initial)
    setStatsModal(game)
  }

  function saveStats() {
    if (!statsModal) return
    update(prev => ({
      ...prev,
      games: prev.games.map(g => g.id === statsModal.id ? { ...g, stats: editingStats } : g),
    }))
    setStatsModal(null)
    toast('Stats saved', 'success')
  }

  function setPlayerStat(playerId: string, field: keyof GameStats, val: string) {
    const num = parseInt(val) || 0
    setEditingStats(prev => ({ ...prev, [playerId]: { ...prev[playerId], [field]: num } }))
  }

  const badgeColor = (res: string) =>
    res === 'W' ? 'var(--green)' : res === 'L' ? 'var(--red)' : 'var(--text3)'

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Season Tracker</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        {settings.teamName}{settings.season ? ' — ' + settings.season : ''}
      </p>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { num: w, lbl: 'Wins', accent: true },
          { num: l, lbl: 'Losses' },
          { num: t, lbl: 'Ties' },
          { num: rs, lbl: 'Runs Scored' },
          { num: ra, lbl: 'Runs Allowed' },
          { num: avgStr, lbl: 'Team AVG' },
        ].map(({ num, lbl, accent }) => (
          <div
            key={lbl}
            style={{
              background: accent ? 'linear-gradient(180deg, var(--bg2), rgba(192,57,43,.07))' : 'var(--bg2)',
              border: `1px solid ${accent ? 'var(--red)' : 'var(--border)'}`,
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: accent ? 'var(--red3)' : 'var(--text)', lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 4 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Add game */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setAddOpen(o => !o)}
          style={{
            background: 'var(--red)',
            color: '#fff',
            padding: '9px 18px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            marginBottom: addOpen ? 14 : 0,
          }}
        >
          {addOpen ? '✕ Cancel' : '+ Add Game'}
        </button>

        {addOpen && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { label: 'Date', key: 'date', type: 'date' },
              { label: 'Opponent', key: 'opp', type: 'text', placeholder: 'e.g. Firecrackers' },
              { label: 'Location', key: 'loc', type: 'text', placeholder: 'e.g. Home' },
              { label: 'Our Score', key: 'us', type: 'number', placeholder: '0' },
              { label: 'Their Score', key: 'them', type: 'number', placeholder: '0' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(form as Record<string, string>)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as Game['type'] }))}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="regular">Regular</option>
                <option value="tournament">Tournament</option>
                <option value="scrimmage">Scrimmage</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Notes</label>
              <input
                type="text"
                placeholder="Optional notes..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button
                onClick={submitGame}
                style={{ background: 'var(--red)', color: '#fff', padding: '9px 22px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Save Game
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Game log */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 15, color: 'var(--text)' }}>Game Log</h3>
        {games.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '28px 20px', background: 'var(--bg)', border: '1px dashed var(--bg4)', borderRadius: 8 }}>
            No games yet. Add your first game above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {games.map(g => (
              <div
                key={g.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto auto auto',
                  gap: 12,
                  alignItems: 'center',
                  background: 'var(--bg)',
                  border: '1px solid var(--bg4)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    background: badgeColor(g.res),
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    minWidth: 24,
                    textAlign: 'center',
                  }}
                >
                  {g.res}
                </span>
                <span>
                  <strong style={{ color: 'var(--text)' }}>{g.opp}</strong>
                  {g.loc && <span style={{ color: 'var(--text3)', marginLeft: 6, fontSize: 12 }}>{g.loc}</span>}
                  {g.type !== 'regular' && (
                    <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '1px 5px', borderRadius: 3, fontSize: 10, marginLeft: 6 }}>
                      {g.type}
                    </span>
                  )}
                </span>
                <span style={{ color: 'var(--text2)', fontSize: 12 }}>{g.date}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{g.us}–{g.them}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => openStats(g)}
                    style={{ background: 'var(--bg4)', border: 'none', color: 'var(--text2)', padding: '4px 8px', borderRadius: 5, fontSize: 11, cursor: 'pointer' }}
                  >
                    Stats
                  </button>
                  <button
                    onClick={() => deleteGame(g.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 14, cursor: 'pointer', padding: '2px 4px' }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Win/Loss trend chart */}
      {chartData.length > 1 && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 15, color: 'var(--text)' }}>Season Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg4)" />
              <XAxis dataKey="game" tick={{ fill: 'var(--text3)', fontSize: 11 }} label={{ value: 'Game #', position: 'insideBottom', fill: 'var(--text3)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
              <Line type="monotone" dataKey="wins" stroke="#27ae60" strokeWidth={2} dot={false} name="Wins" />
              <Line type="monotone" dataKey="losses" stroke="var(--red)" strokeWidth={2} dot={false} name="Losses" />
              <Line type="monotone" dataKey="diff" stroke="#3498db" strokeWidth={1.5} dot={false} name="Run Diff" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Per-player game stats modal */}
      {statsModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
          onClick={e => { if (e.target === e.currentTarget) setStatsModal(null) }}
        >
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, width: '100%', maxWidth: 700, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: 'var(--text)' }}>Game Stats</h3>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
                  vs {statsModal.opp} — {statsModal.date} — {statsModal.us}–{statsModal.them}
                </div>
              </div>
              <button
                onClick={() => setStatsModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {players.length === 0 ? (
              <div style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                No players in roster. Add players first.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Player', 'AB', 'H', 'RBI', 'R', 'BB', 'K', 'HR'].map(h => (
                      <th key={h} style={{ padding: '6px 8px', textAlign: h === 'Player' ? 'left' : 'center', color: 'var(--text2)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map(p => {
                    const ps = editingStats[p.id] ?? { ab: 0, h: 0, rbi: 0, r: 0, bb: 0, k: 0, hr: 0 }
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--bg4)' }}>
                        <td style={{ padding: '8px 8px', color: 'var(--text)', fontWeight: 500 }}>
                          {p.name}
                          {p.jersey && <span style={{ color: 'var(--text3)', marginLeft: 4, fontSize: 11 }}>#{p.jersey}</span>}
                        </td>
                        {(['ab', 'h', 'rbi', 'r', 'bb', 'k', 'hr'] as (keyof GameStats)[]).map(field => (
                          <td key={field} style={{ padding: '6px 4px', textAlign: 'center' }}>
                            <input
                              type="number"
                              min={0}
                              value={ps[field]}
                              onChange={e => setPlayerStat(p.id, field, e.target.value)}
                              style={{
                                width: 44,
                                background: 'var(--bg)',
                                border: '1px solid var(--bg4)',
                                color: 'var(--text)',
                                padding: '4px 6px',
                                borderRadius: 5,
                                fontSize: 13,
                                textAlign: 'center',
                                outline: 'none',
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button
                onClick={saveStats}
                style={{ background: 'var(--red)', color: '#fff', padding: '9px 22px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Save Stats
              </button>
              <button
                onClick={() => setStatsModal(null)}
                style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '9px 16px', borderRadius: 7, fontSize: 13, border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
