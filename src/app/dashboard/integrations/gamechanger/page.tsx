'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import { useStore, uid, Game, GameStats } from '@/lib/store'
import {
  parseGCTeamUrl, parseGCRoster, matchRosterToPlayers, parseGCBoxScore, matchStatRowToPlayer,
  RosterMatch, GCStatRow,
} from '@/lib/gcImport'
import { RefreshCw, CheckCircle, AlertTriangle, ArrowLeft, Link2, ClipboardPaste } from 'lucide-react'
import Link from 'next/link'

export default function GameChangerPage() {
  const { store, update } = useStore()
  const { toast } = useToast()
  const { players, games, settings } = store

  const [teamUrl, setTeamUrl] = useState(settings.gcTeamUrl || 'https://web.gc.com/teams/JvVk31CbOa0N/2026-fall-texas-venom-12u')
  const [rosterPaste, setRosterPaste] = useState('')
  const [rosterMatches, setRosterMatches] = useState<RosterMatch[] | null>(null)
  const [manualPick, setManualPick] = useState<Record<number, string>>({})

  const [opponent, setOpponent] = useState('')
  const [gameDate, setGameDate] = useState('')
  const [result, setResult] = useState<Game['res']>('W')
  const [usScore, setUsScore] = useState('')
  const [themScore, setThemScore] = useState('')
  const [statsPaste, setStatsPaste] = useState('')
  const [statRows, setStatRows] = useState<GCStatRow[] | null>(null)

  const verified = !!settings.gcVerified
  const gcPlayerCount = players.filter((p) => p.gcId).length

  function verifyTeam() {
    const { teamId, valid } = parseGCTeamUrl(teamUrl)
    if (!valid) {
      toast('That doesn\'t look like a web.gc.com team URL — copy it from your browser address bar on the team page', 'warn')
      return
    }
    window.open(teamUrl, '_blank', 'noopener,noreferrer')
    update((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        gcTeamUrl: teamUrl,
        gcTeamId: teamId,
        gcVerified: true,
        gcLastVerified: new Date().toLocaleString(),
      },
    }))
    toast(`Verified access to GameChanger team ${teamId} — opened the team page in a new tab`, 'success')
  }

  function parseRoster() {
    const rows = parseGCRoster(rosterPaste)
    if (rows.length === 0) {
      toast('No players found in that paste — check the format and try again', 'warn')
      return
    }
    setRosterMatches(matchRosterToPlayers(rows, players))
    setManualPick({})
    toast(`Found ${rows.length} player${rows.length === 1 ? '' : 's'} — review the matches below`)
  }

  function updateMatchField(i: number, field: 'gcId' | 'name' | 'jersey' | 'pos', value: string) {
    setRosterMatches((prev) => {
      if (!prev) return prev
      const next = [...prev]
      next[i] = { ...next[i], row: { ...next[i].row, [field]: value } }
      return next
    })
  }

  function saveGcIds() {
    if (!rosterMatches) return
    let assigned = 0
    let skipped = 0
    update((prev) => {
      const nextPlayers = [...prev.players]
      rosterMatches.forEach((m, i) => {
        const targetId = m.player?.id || manualPick[i]
        const gcId = m.row.gcId.trim()
        if (!targetId || !gcId) { skipped++; return }
        const idx = nextPlayers.findIndex((p) => p.id === targetId)
        if (idx === -1) { skipped++; return }
        nextPlayers[idx] = { ...nextPlayers[idx], gcId }
        assigned++
      })
      return { ...prev, players: nextPlayers }
    })
    if (assigned === 0) {
      toast('No GameChanger IDs were assigned — match each player and enter an ID', 'warn')
      return
    }
    toast(`Linked ${assigned} player${assigned === 1 ? '' : 's'} to GameChanger${skipped ? ` (${skipped} skipped — no match or ID)` : ''}`, 'success')
    setRosterMatches(null)
    setRosterPaste('')
  }

  function parseStats() {
    const rows = parseGCBoxScore(statsPaste)
    if (rows.length === 0) {
      toast('No stat lines found in that paste — check the format and try again', 'warn')
      return
    }
    setStatRows(rows)
    toast(`Found stat lines for ${rows.length} player${rows.length === 1 ? '' : 's'} — review before importing`)
  }

  function updateStatField(i: number, field: keyof GCStatRow, value: string) {
    setStatRows((prev) => {
      if (!prev) return prev
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  function importStats() {
    if (!statRows || statRows.length === 0) return
    if (!opponent.trim()) { toast('Enter the opponent name for this game', 'warn'); return }

    const stats: Record<string, GameStats> = {}
    let matched = 0
    let unmatched = 0

    for (const row of statRows) {
      const player = matchStatRowToPlayer(row, players)
      if (!player) { unmatched++; continue }
      matched++
      stats[player.id] = {
        ab: Number(row.ab) || 0,
        h: Number(row.h) || 0,
        d: Number(row.d) || 0,
        t: Number(row.t) || 0,
        hr: Number(row.hr) || 0,
        rbi: Number(row.rbi) || 0,
        r: Number(row.r) || 0,
        bb: Number(row.bb) || 0,
        k: Number(row.k) || 0,
        sb: Number(row.sb) || 0,
      }
    }

    if (matched === 0) {
      toast('None of those stat lines matched a player on your roster — link GameChanger IDs first', 'warn')
      return
    }

    const game: Game = {
      id: uid(),
      date: gameDate || new Date().toISOString().slice(0, 10),
      opp: opponent.trim(),
      loc: '',
      type: 'regular',
      res: result,
      us: Number(usScore) || 0,
      them: Number(themScore) || 0,
      notes: 'Imported from GameChanger',
      stats,
      source: 'gc',
    }

    update((prev) => ({ ...prev, games: [...prev.games, game], settings: { ...prev.settings, gcLastSync: new Date().toLocaleString() } }))
    setStatRows(null)
    setStatsPaste('')
    setOpponent('')
    setGameDate('')
    setResult('W')
    setUsScore('')
    setThemScore('')
    toast(
      `Imported stats for ${matched} player${matched === 1 ? '' : 's'}${unmatched ? ` (${unmatched} unmatched — link their GameChanger ID first)` : ''}`,
      'success'
    )
  }

  const gcGames = games.filter((g) => g.source === 'gc')

  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/integrations"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          {verified ? (
            <Badge variant="success"><CheckCircle className="h-3.5 w-3.5 mr-1" />Access Verified</Badge>
          ) : (
            <Badge variant="warning"><AlertTriangle className="h-3.5 w-3.5 mr-1" />Not Verified</Badge>
          )}
          <span className="text-sm text-gray-500">
            {settings.gcLastSync ? `Last stats sync: ${settings.gcLastSync}` : 'No stats imported yet'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md">
          <div className="rounded-xl border bg-white p-4 text-center"><div className="text-2xl font-bold text-primary">{gcPlayerCount}</div><div className="text-xs text-gray-500">Players Linked</div></div>
          <div className="rounded-xl border bg-white p-4 text-center"><div className="text-2xl font-bold text-gray-900">{players.length}</div><div className="text-xs text-gray-500">Roster Total</div></div>
          <div className="rounded-xl border bg-white p-4 text-center"><div className="text-2xl font-bold text-green-600">{gcGames.length}</div><div className="text-xs text-gray-500">Games Synced</div></div>
        </div>

        {/* Step 1: verify access */}
        <Card>
          <CardHeader><CardTitle>Step 1 — Verify Team Access</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              GameChanger doesn&apos;t expose a developer API, so RallyIQ verifies access by confirming your team&apos;s
              GameChanger page link, then importing roster and stats by paste — same as the NCS integration.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://web.gc.com/teams/..."
                value={teamUrl}
                onChange={(e) => setTeamUrl(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary font-mono"
              />
              <Button size="sm" onClick={verifyTeam}>
                <Link2 className="h-4 w-4 mr-2" />Verify & Open Team
              </Button>
            </div>
            {verified && (
              <p className="text-xs text-gray-500 mt-2">
                Team ID <code className="bg-gray-100 px-1 py-0.5 rounded">{settings.gcTeamId}</code> verified {settings.gcLastVerified}.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Step 2: cross-reference roster */}
        <Card>
          <CardHeader><CardTitle>Step 2 — Cross-Reference Roster & Collect GameChanger IDs</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              On the GameChanger team roster page, copy the roster table and paste it below. RallyIQ matches each row
              to a player on your RallyIQ roster by name (falling back to jersey number) so it can save their
              GameChanger player ID for stat syncing.
            </p>
            <textarea
              placeholder={'Paste roster here, e.g.\nName\tJersey\tPosition\tPlayer ID\nKassidy Cargill\t21\tCF\tGC-48213'}
              value={rosterPaste}
              onChange={(e) => setRosterPaste(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary font-mono"
            />
            <Button size="sm" className="mt-2" onClick={parseRoster} disabled={!rosterPaste.trim()}>
              <ClipboardPaste className="h-4 w-4 mr-2" />Parse Roster
            </Button>

            {rosterMatches && (
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Review matches ({rosterMatches.length})
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['GC Name', 'Jersey', 'GameChanger ID', 'Matched Player', ''].map((h) => (
                          <th key={h} className="text-left font-medium text-gray-500 px-3 py-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rosterMatches.map((m, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="px-2 py-1.5">
                            <input
                              value={m.row.name}
                              onChange={(e) => updateMatchField(i, 'name', e.target.value)}
                              className="w-full rounded border border-transparent px-2 py-1 text-sm hover:border-gray-200 focus:border-primary outline-none"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input
                              value={m.row.jersey}
                              onChange={(e) => updateMatchField(i, 'jersey', e.target.value)}
                              className="w-full rounded border border-transparent px-2 py-1 text-sm hover:border-gray-200 focus:border-primary outline-none"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <input
                              value={m.row.gcId}
                              onChange={(e) => updateMatchField(i, 'gcId', e.target.value)}
                              placeholder="GC player ID"
                              className="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:border-primary outline-none"
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            {m.player ? (
                              <span className="text-gray-700">{m.player.name}</span>
                            ) : (
                              <select
                                value={manualPick[i] || ''}
                                onChange={(e) => setManualPick((prev) => ({ ...prev, [i]: e.target.value }))}
                                className="w-full rounded border border-gray-200 px-2 py-1 text-sm outline-none"
                              >
                                <option value="">No match — pick player...</option>
                                {players.map((p) => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-right">
                            {m.player ? (
                              <Badge variant="success">{m.matchType === 'name' ? 'Name match' : 'Jersey match'}</Badge>
                            ) : (
                              <Badge variant="warning">No match</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={saveGcIds}>
                    <RefreshCw className="h-4 w-4 mr-2" />Save GameChanger IDs
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setRosterMatches(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: import stats */}
        <Card>
          <CardHeader><CardTitle>Step 3 — Import Game Stats</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Copy a box score / player stats table from a completed game in GameChanger and paste it below. Stats
              are matched to players by their linked GameChanger ID (or by name/jersey if not yet linked) and added
              to the Season Tracker — the same data shown in Roster and Athlete Profiles.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3 max-w-lg">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Opponent</label>
                <input
                  type="text"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="e.g. Eastside FC"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Date</label>
                <input
                  type="date"
                  value={gameDate}
                  onChange={(e) => setGameDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Result</label>
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value as Game['res'])}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="W">Win</option>
                  <option value="L">Loss</option>
                  <option value="T">Tie</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">Our Score</label>
                  <input
                    type="number"
                    value={usScore}
                    onChange={(e) => setUsScore(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">Their Score</label>
                  <input
                    type="number"
                    value={themScore}
                    onChange={(e) => setThemScore(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <textarea
              placeholder={'Paste box score here, e.g.\nName\tID\tAB\tH\t2B\t3B\tHR\tRBI\tR\tBB\tK\tSB\nKassidy Cargill\tGC-48213\t3\t2\t1\t0\t0\t2\t1\t0\t0\t1'}
              value={statsPaste}
              onChange={(e) => setStatsPaste(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary font-mono"
            />
            <Button size="sm" className="mt-2" onClick={parseStats} disabled={!statsPaste.trim()}>
              <ClipboardPaste className="h-4 w-4 mr-2" />Parse Stats
            </Button>

            {statRows && (
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Review before importing ({statRows.length})
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Name', 'GC ID', 'AB', 'H', '2B', '3B', 'HR', 'RBI', 'R', 'BB', 'K', 'SB', 'Match'].map((h) => (
                          <th key={h} className="text-left font-medium text-gray-500 px-2 py-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {statRows.map((row, i) => {
                        const player = matchStatRowToPlayer(row, players)
                        return (
                          <tr key={i} className="border-b border-gray-100 last:border-0">
                            {(['name', 'gcId', 'ab', 'h', 'd', 't', 'hr', 'rbi', 'r', 'bb', 'k', 'sb'] as const).map((field) => (
                              <td key={field} className="px-1.5 py-1.5">
                                <input
                                  value={row[field]}
                                  onChange={(e) => updateStatField(i, field, e.target.value)}
                                  className="w-full rounded border border-transparent px-1.5 py-1 text-sm hover:border-gray-200 focus:border-primary outline-none"
                                />
                              </td>
                            ))}
                            <td className="px-2 py-1.5">
                              {player ? <Badge variant="success">{player.name}</Badge> : <Badge variant="warning">No match</Badge>}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={importStats}>
                    <RefreshCw className="h-4 w-4 mr-2" />Import Stats to Season
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setStatRows(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {gcGames.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Recent GameChanger-Synced Games</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gcGames.slice().reverse().map((g) => (
                  <div key={g.id} className="rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">vs. {g.opp}</span>
                        <span className="text-sm text-gray-500 ml-2">{g.date}</span>
                      </div>
                      <span className="text-xs text-gray-400">{Object.keys(g.stats).length} player line{Object.keys(g.stats).length === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
