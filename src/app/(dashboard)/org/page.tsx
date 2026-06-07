'use client'

import { useStore, fundraisedTotal } from '@/lib/store'
import Link from 'next/link'

export default function OrgPage() {
  const { store } = useStore()
  const { players, games, fundraisers, plans, research, settings } = store

  const w = games.filter(g => g.res === 'W').length
  const l = games.filter(g => g.res === 'L').length
  const totalRaised = fundraisers.reduce((s, f) => s + fundraisedTotal(f), 0)
  const totalGoal = fundraisers.reduce((s, f) => s + (f.goal || 0), 0)

  const sections = [
    {
      title: 'Team',
      href: '/dashboard/teams',
      stats: [
        { num: `${w}–${l}`, lbl: 'Record' },
        { num: games.length, lbl: 'Games' },
        { num: players.length, lbl: 'Players' },
      ],
      description: `${settings.teamName} — ${settings.season || 'Current Season'}`,
    },
    {
      title: 'Fundraising',
      href: '/dashboard/fundraise',
      stats: [
        { num: '$' + totalRaised.toFixed(0), lbl: 'Raised' },
        { num: '$' + totalGoal.toFixed(0), lbl: 'Goal' },
        { num: fundraisers.filter(f => f.status === 'active').length, lbl: 'Active' },
      ],
      description: `${fundraisers.length} campaign${fundraisers.length !== 1 ? 's' : ''} total`,
    },
    {
      title: 'Coach AI',
      href: '/dashboard/coach',
      stats: [
        { num: plans.length, lbl: 'Plans' },
        { num: research.length, lbl: 'Drills' },
        { num: store.threads.length, lbl: 'Chats' },
      ],
      description: 'AI-powered coaching tools',
    },
  ]

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Organization</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 20 }}>
        Overview of your {settings.teamName} organization
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {sections.map(section => (
          <div key={section.title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: 'var(--text)' }}>{section.title}</h3>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{section.description}</div>
              </div>
              <Link
                href={section.href}
                style={{ color: 'var(--text2)', fontSize: 12, border: '1px solid var(--bg4)', padding: '5px 10px', borderRadius: 6, textDecoration: 'none' }}
              >
                View →
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {section.stats.map(({ num, lbl }) => (
                <div key={lbl} style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: 3 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, color: 'var(--text)' }}>Quick Links</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { href: '/dashboard/teams/t1', label: 'Season Tracker' },
            { href: '/dashboard/teams/t1/roster', label: 'Roster' },
            { href: '/dashboard/teams/t1/tournaments', label: 'Tournaments' },
            { href: '/dashboard/coach/practices', label: 'Practice Planner' },
            { href: '/dashboard/fundraise', label: 'Fundraising' },
            { href: '/dashboard/scout', label: 'Drill Library' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                background: 'var(--bg)', border: '1px solid var(--bg4)',
                color: 'var(--text)', padding: '8px 14px', borderRadius: 8,
                fontSize: 13, textDecoration: 'none', fontWeight: 500,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
