'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import Link from 'next/link'

export default function ProfilesPage() {
  const { store } = useStore()
  const { players, games, settings } = store
  const [search, setSearch] = useState('')

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.pos || '').toLowerCase().includes(search.toLowerCase())
  )

  function calcStats(playerId: string) {
    let ab = 0, h = 0, rbi = 0, hr = 0
    for (const g of games) {
      const ps = g.stats?.[playerId]
      if (ps) { ab += ps.ab || 0; h += ps.h || 0; rbi += ps.rbi || 0; hr += ps.hr || 0 }
    }
    return { ab, h, rbi, hr, avg: ab > 0 ? (h / ab).toFixed(3).replace(/^0/, '') : '.000' }
  }

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Athletes</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        {settings.teamName} · {players.length} players
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Search athletes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, background: 'var(--bg2)', border: '1px solid var(--bg4)',
            color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none',
          }}
        />
        <Link
          href="/dashboard/teams/t1/roster"
          style={{ background: 'var(--red)', color: '#fff', padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
        >
          Manage Roster →
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '40px 20px', background: 'var(--bg2)', border: '1px dashed var(--bg4)', borderRadius: 12 }}>
          {players.length === 0
            ? 'No players yet. Add players in the Roster page.'
            : 'No players match your search.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {filtered.map(p => {
            const ss = calcStats(p.id)
            return (
              <Link key={p.id} href={`/dashboard/profiles/${p.id}`} style={{ display: 'block', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--red), var(--red3))',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, flexShrink: 0,
                  }}>
                    {p.jersey ? `#${p.jersey}` : p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>
                      {p.pos || 'No position'}{p.grad ? ` · Class of ${p.grad}` : ''}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  {p.bats && <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '2px 7px', borderRadius: 3, fontSize: 10 }}>Bats {p.bats}</span>}
                  {p.throws && <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '2px 7px', borderRadius: 3, fontSize: 10 }}>Throws {p.throws}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {[
                    { lbl: 'AVG', val: ss.avg },
                    { lbl: 'AB', val: ss.ab },
                    { lbl: 'RBI', val: ss.rbi },
                    { lbl: 'HR', val: ss.hr },
                  ].map(({ lbl, val }) => (
                    <div key={lbl} style={{ background: 'var(--bg)', borderRadius: 6, padding: '6px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{val}</div>
                      <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.4px' }}>{lbl}</div>
                    </div>
                  ))}
                </div>

                {p.parent && (
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)', borderTop: '1px solid var(--bg4)', paddingTop: 8 }}>
                    Parent: {p.parent}{p.email ? ` · ${p.email}` : ''}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
