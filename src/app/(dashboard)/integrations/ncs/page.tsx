'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import { useStore, uid, Player } from '@/lib/store'
import { parseRosterPaste, ParsedPlayer } from '@/lib/ncsImport'
import { RefreshCw, CheckCircle, ArrowLeft, Search, ClipboardPaste, Trash2 } from 'lucide-react'
import Link from 'next/link'

const standings = [
  { rank: 1, team: 'Eastside FC', wins: 9, losses: 2, points: 28 },
  { rank: 2, team: 'Riverside SC (Us)', wins: 8, losses: 2, points: 25, us: true },
  { rank: 3, team: 'Metro United', wins: 8, losses: 3, points: 24 },
  { rank: 4, team: 'Northside SC', wins: 7, losses: 4, points: 21 },
  { rank: 5, team: 'Valley SC', wins: 6, losses: 5, points: 18 },
]

export default function NCSPage() {
  const { store, update } = useStore()
  const { toast } = useToast()

  const [teamQuery, setTeamQuery] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [parsed, setParsed] = useState<ParsedPlayer[] | null>(null)
  const [lastSync, setLastSync] = useState<string | null>(null)

  function findTeam() {
    if (!teamQuery.trim()) {
      toast('Enter a team name to search', 'warn')
      return
    }
    window.open('https://www.ncsfastpitch.com/', '_blank', 'noopener,noreferrer')
    toast('Opened NCS Fastpitch — search for your team, open its roster page, then copy the roster table')
  }

  function parsePaste() {
    const rows = parseRosterPaste(pasteText)
    if (rows.length === 0) {
      toast('No players found in that paste — check the format and try again', 'warn')
      return
    }
    setParsed(rows)
    toast(`Found ${rows.length} player${rows.length === 1 ? '' : 's'} — review below before importing`)
  }

  function updateParsedRow(i: number, field: keyof ParsedPlayer, value: string) {
    setParsed((prev) => {
      if (!prev) return prev
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  function removeParsedRow(i: number) {
    setParsed((prev) => (prev ? prev.filter((_, idx) => idx !== i) : prev))
  }

  function importPlayers() {
    if (!parsed || parsed.length === 0) return

    const existingNames = new Set(store.players.map((p) => p.name.trim().toLowerCase()))
    const toAdd: Player[] = []
    let skipped = 0

    for (const row of parsed) {
      const name = row.name.trim()
      if (!name) continue
      if (existingNames.has(name.toLowerCase())) {
        skipped++
        continue
      }
      existingNames.add(name.toLowerCase())
      toAdd.push({
        id: uid(),
        name,
        jersey: row.jersey.trim(),
        pos: row.pos.trim().toUpperCase(),
        bats: row.bats.trim().toUpperCase() || 'R',
        throws: row.throws.trim().toUpperCase() || 'R',
        grad: row.grad.trim(),
        notes: 'Imported from NCS',
      })
    }

    if (toAdd.length === 0) {
      toast('All of those players are already on your roster', 'warn')
      return
    }

    update((prev) => ({ ...prev, players: [...prev.players, ...toAdd] }))
    setLastSync(new Date().toLocaleString())
    setParsed(null)
    setPasteText('')
    toast(
      `Imported ${toAdd.length} player${toAdd.length === 1 ? '' : 's'} to your roster${
        skipped ? ` (${skipped} duplicate${skipped === 1 ? '' : 's'} skipped)` : ''
      }`
    )
  }

  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/integrations"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          <Badge variant="success"><CheckCircle className="h-3.5 w-3.5 mr-1" />Connected</Badge>
          <span className="text-sm text-gray-500">
            {lastSync ? `Last roster import: ${lastSync}` : 'No roster imported yet'}
          </span>
        </div>

        {/* Find Team + Import Roster */}
        <Card>
          <CardHeader>
            <CardTitle>Import Roster from NCS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              NCS Fastpitch doesn&apos;t offer a connected API, so rosters are imported by copying the
              roster table from your team&apos;s NCS page and pasting it here.
            </p>

            <div className="space-y-4">
              {/* Step 1: find team */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Step 1 — Find your team in the NCS portal
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Team name, e.g. Riverside SC 14U"
                    value={teamQuery}
                    onChange={(e) => setTeamQuery(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <Button variant="outline" size="sm" onClick={findTeam}>
                    <Search className="h-4 w-4 mr-2" />Open NCS
                  </Button>
                </div>
              </div>

              {/* Step 2: paste roster */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Step 2 — Paste the roster table from the NCS team page
                </div>
                <textarea
                  placeholder={'Paste roster here, e.g.\nName\tJersey\tPos\tBats\tThrows\tGrad\nEmma Torres\t12\tSS\tR\tR\t2027'}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary font-mono"
                />
                <Button size="sm" className="mt-2" onClick={parsePaste} disabled={!pasteText.trim()}>
                  <ClipboardPaste className="h-4 w-4 mr-2" />Parse Roster
                </Button>
              </div>

              {/* Step 3: preview + confirm */}
              {parsed && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                    Step 3 — Review before importing ({parsed.length} player{parsed.length === 1 ? '' : 's'})
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {['Name', '#', 'Pos', 'Bats', 'Throws', 'Grad', ''].map((h) => (
                            <th key={h} className="text-left font-medium text-gray-500 px-3 py-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-0">
                            {(['name', 'jersey', 'pos', 'bats', 'throws', 'grad'] as const).map((field) => (
                              <td key={field} className="px-2 py-1.5">
                                <input
                                  value={row[field]}
                                  onChange={(e) => updateParsedRow(i, field, e.target.value)}
                                  className="w-full rounded border border-transparent px-2 py-1 text-sm hover:border-gray-200 focus:border-primary outline-none"
                                />
                              </td>
                            ))}
                            <td className="px-2 py-1.5 text-right">
                              <button
                                onClick={() => removeParsedRow(i)}
                                className="text-gray-400 hover:text-red-500"
                                aria-label="Remove row"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={importPlayers} disabled={parsed.length === 0}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Import {parsed.length} Player{parsed.length === 1 ? '' : 's'} to Roster
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setParsed(null)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 max-w-sm">
          <div className="rounded-xl border bg-white p-4 text-center">
            <div className="text-2xl font-bold text-primary">#2</div>
            <div className="text-xs text-gray-500">Regional Rank</div>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center">
            <div className="text-2xl font-bold text-green-600">25</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">Top 5</div>
            <div className="text-xs text-gray-500">Division</div>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>U16 Elite Division Standings</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    {['Rank', 'Team', 'W', 'L', 'Pts'].map((h) => (
                      <th key={h} className="text-left font-medium text-gray-500 pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s) => (
                    <tr key={s.team} className={`border-b border-gray-50 ${s.us ? 'bg-primary-50' : ''}`}>
                      <td className="py-2.5 pr-4 font-bold text-gray-700">#{s.rank}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`font-medium ${s.us ? 'text-primary' : 'text-gray-900'}`}>{s.team}</span>
                        {s.us && <Badge variant="default" className="ml-2 text-xs">Us</Badge>}
                      </td>
                      <td className="py-2.5 pr-4 text-green-600 font-medium">{s.wins}</td>
                      <td className="py-2.5 pr-4 text-red-500">{s.losses}</td>
                      <td className="py-2.5 font-bold text-gray-900">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
