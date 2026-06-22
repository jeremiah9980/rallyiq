'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import { useStore, uid, Player } from '@/lib/store'
import { parseRosterPaste, ParsedPlayer } from '@/lib/ncsImport'
import { RefreshCw, CheckCircle, ArrowLeft, Search, ClipboardPaste, Trash2, Download, Loader2, MapPin } from 'lucide-react'
import Link from 'next/link'

interface NcsTeamResult {
  id: string
  name: string
  division: string
  location: string
  record: string
  url: string
}

interface NcsSeason {
  id: string
  label: string
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY',
]

export default function NCSPage() {
  const { store, update } = useStore()
  const { toast } = useToast()

  const [teamQuery, setTeamQuery] = useState('')
  const [state, setState] = useState('')
  const [seasonId, setSeasonId] = useState('')
  const [seasons, setSeasons] = useState<NcsSeason[]>([])

  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<NcsTeamResult[] | null>(null)
  const [loadingRosterId, setLoadingRosterId] = useState<string | null>(null)

  const [showPaste, setShowPaste] = useState(false)
  const [pasteText, setPasteText] = useState('')

  const [parsed, setParsed] = useState<ParsedPlayer[] | null>(null)
  const [importSource, setImportSource] = useState<string>('')
  const [lastSync, setLastSync] = useState<string | null>(null)

  async function searchTeams() {
    if (!teamQuery.trim() && !state) {
      toast('Enter a team name or pick a state to search NCS', 'warn')
      return
    }
    setSearching(true)
    setResults(null)
    try {
      const params = new URLSearchParams()
      if (teamQuery.trim()) params.set('teamName', teamQuery.trim())
      if (state) params.set('state', state)
      if (seasonId) params.set('seasonId', seasonId)
      const res = await fetch(`/api/integrations/ncs/search?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'NCS search failed', 'error')
        return
      }
      if (Array.isArray(data.seasons) && data.seasons.length > 0) setSeasons(data.seasons)
      setResults(data.teams || [])
      if ((data.teams || []).length === 0) {
        toast('No teams found on NCS for that search — try a different name or state', 'warn')
      } else {
        toast(`Found ${data.teams.length} team${data.teams.length === 1 ? '' : 's'} on NCS`)
      }
    } catch {
      toast('Could not reach NCS. Please try again.', 'error')
    } finally {
      setSearching(false)
    }
  }

  async function importFromTeam(team: NcsTeamResult) {
    setLoadingRosterId(team.id)
    try {
      const res = await fetch(`/api/integrations/ncs/roster?teamId=${encodeURIComponent(team.id)}`)
      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'Could not load that roster from NCS', 'error')
        return
      }
      const players: ParsedPlayer[] = data.players || []
      if (players.length === 0) {
        toast(data.error || 'No players found on that NCS roster', 'warn')
        return
      }
      setParsed(players)
      setImportSource(team.name)
      toast(`Loaded ${players.length} player${players.length === 1 ? '' : 's'} from ${team.name} — review below before importing`)
    } catch {
      toast('Could not reach NCS. Please try again.', 'error')
    } finally {
      setLoadingRosterId(null)
    }
  }

  function parsePaste() {
    const rows = parseRosterPaste(pasteText)
    if (rows.length === 0) {
      toast('No players found in that paste — check the format and try again', 'warn')
      return
    }
    setParsed(rows)
    setImportSource('pasted roster')
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

    const note = importSource && importSource !== 'pasted roster'
      ? `Imported from NCS — ${importSource}`
      : 'Imported from NCS'

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
        notes: note,
      })
    }

    if (toAdd.length === 0) {
      toast('All of those players are already on your roster', 'warn')
      return
    }

    update((prev) => ({ ...prev, players: [...prev.players, ...toAdd] }))
    setLastSync(new Date().toLocaleString())
    setParsed(null)
    setImportSource('')
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

        {/* Search NCS + Import Roster */}
        <Card>
          <CardHeader>
            <CardTitle>Import Roster from NCS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Search the NCS Fastpitch portal for your team and import its roster directly — no copy/paste required.
            </p>

            <div className="space-y-4">
              {/* Step 1: search */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Step 1 — Search the NCS portal for your team
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Team name, e.g. Texas Venom"
                    value={teamQuery}
                    onChange={(e) => setTeamQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') searchTeams() }}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                  >
                    <option value="">All states</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {seasons.length > 0 && (
                    <select
                      value={seasonId}
                      onChange={(e) => setSeasonId(e.target.value)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="">Current season</option>
                      {seasons.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  )}
                  <Button size="sm" onClick={searchTeams} disabled={searching}>
                    {searching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Search NCS
                  </Button>
                </div>
              </div>

              {/* Step 2: results */}
              {results && results.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                    Step 2 — Pick your team ({results.length} found)
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {['Team', 'Division', 'Location', 'W-L-T', ''].map((h) => (
                            <th key={h} className="text-left font-medium text-gray-500 px-3 py-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((team) => (
                          <tr key={team.id} className="border-b border-gray-100 last:border-0">
                            <td className="px-3 py-2 font-medium text-gray-900">
                              <a href={team.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                                {team.name}
                              </a>
                            </td>
                            <td className="px-3 py-2 text-gray-600">{team.division}</td>
                            <td className="px-3 py-2 text-gray-600">
                              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-400" />{team.location}</span>
                            </td>
                            <td className="px-3 py-2 text-gray-600">{team.record}</td>
                            <td className="px-3 py-2 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => importFromTeam(team)}
                                disabled={loadingRosterId !== null}
                              >
                                {loadingRosterId === team.id
                                  ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  : <Download className="h-4 w-4 mr-2" />}
                                Import Roster
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Manual paste fallback */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPaste((v) => !v)}
                  className="text-xs font-medium text-gray-500 hover:text-primary"
                >
                  {showPaste ? '▾' : '▸'} Can&apos;t find your team? Paste the roster table manually
                </button>
                {showPaste && (
                  <div className="mt-2">
                    <textarea
                      placeholder={'Paste roster here, e.g.\nName\tJersey\tPos\tBats\tThrows\tGrad\nEmma Torres\t12\tSS\tR\tR\t2027'}
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary font-mono"
                    />
                    <Button size="sm" variant="outline" className="mt-2" onClick={parsePaste} disabled={!pasteText.trim()}>
                      <ClipboardPaste className="h-4 w-4 mr-2" />Parse Pasted Roster
                    </Button>
                  </div>
                )}
              </div>

              {/* Step 3: preview + confirm */}
              {parsed && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                    Step 3 — Review before importing ({parsed.length} player{parsed.length === 1 ? '' : 's'}
                    {importSource && importSource !== 'pasted roster' ? ` from ${importSource}` : ''})
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
                    <Button variant="outline" size="sm" onClick={() => { setParsed(null); setImportSource('') }}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
