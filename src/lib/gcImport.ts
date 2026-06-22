import { Player } from '@/lib/store'

export interface GCRosterRow {
  name: string
  jersey: string
  pos: string
  gcId: string
}

export interface GCStatRow {
  name: string
  jersey: string
  ab: string
  h: string
  d: string
  t: string
  hr: string
  rbi: string
  r: string
  bb: string
  k: string
  sb: string
}

export type MatchType = 'name' | 'jersey' | 'none'

export interface RosterMatch {
  row: GCRosterRow
  player: Player | null
  matchType: MatchType
}

const TEAM_URL_RE = /web\.gc\.com\/teams\/([A-Za-z0-9_-]+)/

export function parseGCTeamUrl(url: string): { teamId: string; valid: boolean } {
  const m = url.trim().match(TEAM_URL_RE)
  return { teamId: m ? m[1] : '', valid: !!m }
}

function splitLine(line: string): string[] {
  if (line.includes('\t')) return line.split('\t')
  if (line.includes(',')) return line.split(',')
  return line.split(/\s{2,}/)
}

const ROSTER_HEADER_KEYWORDS: Record<string, keyof GCRosterRow> = {
  name: 'name', player: 'name', 'player name': 'name',
  '#': 'jersey', no: 'jersey', number: 'jersey', jersey: 'jersey', jerseynumber: 'jersey',
  pos: 'pos', position: 'pos',
  id: 'gcId', playerid: 'gcId', 'gc id': 'gcId', gcid: 'gcId', 'player id': 'gcId',
}

export function parseGCRoster(raw: string): GCRosterRow[] {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return []

  const headerCells = splitLine(lines[0]).map((c) => c.trim().toLowerCase())
  const colMap: Partial<Record<keyof GCRosterRow, number>> = {}
  headerCells.forEach((cell, i) => {
    const key = ROSTER_HEADER_KEYWORDS[cell]
    if (key && colMap[key] === undefined) colMap[key] = i
  })
  const hasHeader = Object.keys(colMap).length > 0
  const dataLines = hasHeader ? lines.slice(1) : lines

  const rows: GCRosterRow[] = []
  for (const line of dataLines) {
    const cells = splitLine(line).map((c) => c.trim())
    if (cells.every((c) => !c)) continue

    const row: GCRosterRow = {
      name: hasHeader && colMap.name !== undefined ? cells[colMap.name] || '' : cells[0] || '',
      jersey: hasHeader && colMap.jersey !== undefined ? cells[colMap.jersey] || '' : '',
      pos: hasHeader && colMap.pos !== undefined ? cells[colMap.pos] || '' : '',
      gcId: hasHeader && colMap.gcId !== undefined ? cells[colMap.gcId] || '' : '',
    }
    if (row.name) rows.push(row)
  }
  return rows
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function matchRosterToPlayers(rows: GCRosterRow[], players: Player[]): RosterMatch[] {
  return rows.map((row) => {
    const rowName = normalizeName(row.name)
    let player = players.find((p) => normalizeName(p.name) === rowName) || null
    let matchType: MatchType = player ? 'name' : 'none'

    if (!player && row.jersey) {
      player = players.find((p) => p.jersey && p.jersey.trim() === row.jersey.trim()) || null
      if (player) matchType = 'jersey'
    }

    return { row, player, matchType }
  })
}

const STAT_HEADER_KEYWORDS: Record<string, keyof GCStatRow> = {
  name: 'name', player: 'name', 'player name': 'name',
  '#': 'jersey', no: 'jersey', number: 'jersey', jersey: 'jersey',
  ab: 'ab', h: 'h', hits: 'h', '2b': 'd', double: 'd', doubles: 'd',
  '3b': 't', triple: 't', triples: 't', hr: 'hr', hrs: 'hr', 'home runs': 'hr',
  rbi: 'rbi', rbis: 'rbi', r: 'r', runs: 'r', bb: 'bb', walks: 'bb',
  k: 'k', so: 'k', strikeouts: 'k', sb: 'sb', 'stolen bases': 'sb',
}

export function parseGCBoxScore(raw: string): GCStatRow[] {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return []

  const headerCells = splitLine(lines[0]).map((c) => c.trim().toLowerCase())
  const colMap: Partial<Record<keyof GCStatRow, number>> = {}
  headerCells.forEach((cell, i) => {
    const key = STAT_HEADER_KEYWORDS[cell]
    if (key && colMap[key] === undefined) colMap[key] = i
  })
  const hasHeader = colMap.name !== undefined
  const dataLines = hasHeader ? lines.slice(1) : lines

  const rows: GCStatRow[] = []
  for (const line of dataLines) {
    const cells = splitLine(line).map((c) => c.trim())
    if (cells.every((c) => !c)) continue

    const get = (key: keyof GCStatRow) => (colMap[key] !== undefined ? cells[colMap[key] as number] || '0' : '0')

    const row: GCStatRow = {
      name: colMap.name !== undefined ? cells[colMap.name] || '' : cells[0] || '',
      jersey: get('jersey'),
      ab: get('ab'),
      h: get('h'),
      d: get('d'),
      t: get('t'),
      hr: get('hr'),
      rbi: get('rbi'),
      r: get('r'),
      bb: get('bb'),
      k: get('k'),
      sb: get('sb'),
    }
    if (row.name) rows.push(row)
  }
  return rows
}

export function matchStatRowToPlayer(row: GCStatRow, players: Player[]): Player | null {
  const rowName = normalizeName(row.name)
  let player = players.find((p) => p.gcId && normalizeName(p.name) === rowName) || null
  if (!player) player = players.find((p) => normalizeName(p.name) === rowName) || null
  if (!player && row.jersey) {
    player = players.find((p) => p.jersey && p.jersey.trim() === row.jersey.trim()) || null
  }
  return player
}
