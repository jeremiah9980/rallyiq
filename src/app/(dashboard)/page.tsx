'use client'

import { useStore, fundraisedTotal } from '@/lib/store'
import Link from 'next/link'

export default function DashboardPage() {
  const { store } = useStore()
  const { games, players, plans, fundraisers, settings } = store

  let w = 0, l = 0, t = 0, rs = 0, ra = 0
  for (const g of games) {
    if (g.res === 'W') w++
    else if (g.res === 'L') l++
    else t++
    rs += g.us || 0
    ra += g.them || 0
  }
  const total = games.length
  const winPct = total ? Math.round(w / total * 100) + '%' : '—'

  const sorted = [...games].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  let streakCount = 0, streakKind = ''
  if (sorted.length) {
    const last = sorted[sorted.length - 1].res
    streakKind = last
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].res === last) streakCount++
      else break
    }
  }

  let totalRaised = 0
  for (const f of fundraisers) totalRaised += fundraisedTotal(f)
  const activeFund = fundraisers.filter(f => f.status === 'active').length
  const diff = rs - ra
  const recent = games.slice(0, 5)
  const latestPlan = plans[0]

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Team dashboard</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        {settings.teamName}{settings.season ? ' — ' + settings.season : ''}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20 }}>
        <StatTile accent num={`${w}–${l}${t ? '–' + t : ''}`} lbl="Record" sub={total ? total + ' games' : 'No games yet'} />
        <StatTile num={winPct} lbl="Win %" sub={total ? `${w} of ${total}` : 'Add a game to start'} />
        <StatTile
          num={streakCount ? streakKind + streakCount : '—'}
          lbl="Streak"
          sub={streakCount ? (streakKind === 'W' ? 'Heating up' : streakKind === 'L' ? 'Bounce back' : 'Tied up') : '—'}
        />
        <StatTile num={total ? (diff >= 0 ? '+' : '') + diff : '—'} lbl="Run diff" sub={total ? `${rs} scored / ${ra} allowed` : '—'} />
        <StatTile num={'$' + totalRaised.toFixed(0)} lbl="Raised" sub={fundraisers.length ? `${activeFund} active, ${fundraisers.length} total` : 'No fundraisers'} />
        <StatTile
          num={String(players.length)}
          lbl="Roster"
          sub={players.length ? players.slice(0, 3).map(p => p.name.split(' ')[0]).join(', ') + (players.length > 3 ? ', +' + (players.length - 3) : '') : 'Add players'}
        />
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text)' }}>Recent games</h3>
          <Link href="/dashboard/teams" style={{ color: 'var(--text2)', fontSize: 12, border: '1px solid var(--bg4)', padding: '5px 10px', borderRadius: 6, textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '30px 20px', background: 'var(--bg)', border: '1px dashed var(--bg4)', borderRadius: 8 }}>
            No games yet. Head to Teams to log one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map((g) => (
              <div key={g.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 12, alignItems: 'center', background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
                <span className={`badge ${g.res.toLowerCase()}`}>{g.res}</span>
                <span>
                  <strong style={{ color: 'var(--text)' }}>{g.opp}</strong>
                  <span style={{ color: 'var(--text2)', marginLeft: 6 }}>{g.loc}</span>
                </span>
                <span style={{ color: 'var(--text2)', fontSize: 12 }}>{g.date}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{g.us}–{g.them}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text)' }}>Most recent practice plan</h3>
          <Link href="/dashboard/coach/practices" style={{ color: 'var(--text2)', fontSize: 12, border: '1px solid var(--bg4)', padding: '5px 10px', borderRadius: 6, textDecoration: 'none' }}>
            Generator →
          </Link>
        </div>
        {!latestPlan ? (
          <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '30px 20px', background: 'var(--bg)', border: '1px dashed var(--bg4)', borderRadius: 8 }}>
            No saved plans yet.
          </div>
        ) : (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>
              {latestPlan.title}
              {latestPlan.playerContent && (
                <span style={{ background: 'var(--red)', color: '#fff', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 500, marginLeft: 6 }}>DUAL</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>
              {latestPlan.dur} · {new Date(latestPlan.created).toLocaleDateString()}
            </div>
            <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.5 }}>
              {(latestPlan.coachContent || '').slice(0, 250)}...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatTile({ num, lbl, sub, accent }: { num: string; lbl: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      background: accent ? 'linear-gradient(180deg, var(--bg2), rgba(192,57,43,.05))' : 'var(--bg2)',
      border: accent ? '1px solid var(--red)' : '1px solid var(--border)',
      borderRadius: 10,
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: accent ? 'var(--red3)' : 'var(--text)', lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.6px' }}>{lbl}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}
