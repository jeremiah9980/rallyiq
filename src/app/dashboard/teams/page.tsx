'use client'

import { useStore } from '@/lib/store'
import Link from 'next/link'

export default function TeamsPage() {
  const { store } = useStore()
  const { games, players, settings } = store

  const w = games.filter(g => g.res === 'W').length
  const l = games.filter(g => g.res === 'L').length
  const t = games.filter(g => g.res === 'T').length

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Teams</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 20 }}>
        Manage your team and season data
      </p>

      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{settings.teamName || 'My Team'}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
              {settings.season || 'Current Season'} · {players.length} players
            </div>
          </div>
          <span
            style={{
              background: 'rgba(39,174,96,.15)',
              color: '#27ae60',
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            ACTIVE
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10, marginBottom: 18 }}>
          {[
            { num: `${w}–${l}${t ? '–' + t : ''}`, lbl: 'Record' },
            { num: games.length, lbl: 'Games' },
            { num: players.length, lbl: 'Players' },
            { num: games.reduce((s, g) => s + (g.us || 0), 0), lbl: 'Runs' },
          ].map(({ num, lbl }) => (
            <div key={lbl} style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: 4 }}>{lbl}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { href: '/dashboard/teams/t1', label: 'Season Tracker' },
            { href: '/dashboard/teams/t1/roster', label: 'Roster' },
            { href: '/dashboard/teams/t1/tournaments', label: 'Tournaments' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                background: 'var(--bg4)',
                color: 'var(--text)',
                padding: '8px 16px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid var(--border)',
                transition: 'background .15s',
              }}
            >
              {label} →
            </Link>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
        Multi-team support coming soon. Use Settings to update your team name and season.
      </div>
    </div>
  )
}
