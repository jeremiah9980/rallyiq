export interface ParsedPlayer {
  name: string
  jersey: string
  pos: string
  bats: string
  throws: string
  grad: string
}

const POSITIONS = new Set(['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'OF', 'UT', 'IF', 'DP'])

const HEADER_KEYWORDS: Record<string, keyof ParsedPlayer> = {
  name: 'name',
  player: 'name',
  '#': 'jersey',
  no: 'jersey',
  number: 'jersey',
  jersey: 'jersey',
  pos: 'pos',
  position: 'pos',
  bats: 'bats',
  throws: 'throws',
  grad: 'grad',
  class: 'grad',
  year: 'grad',
  gradyear: 'grad',
}

function splitLine(line: string): string[] {
  if (line.includes('\t')) return line.split('\t')
  if (line.includes(',')) return line.split(',')
  return line.split(/\s{2,}/)
}

/**
 * Parses a roster table copied/pasted from an external site (e.g. NCS team page)
 * into structured player rows. Supports tab-, comma-, or multi-space-delimited
 * tables with or without a header row, falling back to positional heuristics
 * (jersey number, known position codes, grad year) when no header is present.
 */
export function parseRosterPaste(raw: string): ParsedPlayer[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const headerCells = splitLine(lines[0]).map((c) => c.trim().toLowerCase())
  const colMap: Partial<Record<keyof ParsedPlayer, number>> = {}
  headerCells.forEach((cell, i) => {
    const key = HEADER_KEYWORDS[cell]
    if (key && colMap[key] === undefined) colMap[key] = i
  })
  const hasHeader = Object.keys(colMap).length > 0
  const dataLines = hasHeader ? lines.slice(1) : lines

  const players: ParsedPlayer[] = []

  for (const line of dataLines) {
    const cells = splitLine(line).map((c) => c.trim()).filter((c) => c.length > 0)
    if (cells.length === 0) continue

    let player: ParsedPlayer = { name: '', jersey: '', pos: '', bats: '', throws: '', grad: '' }

    if (hasHeader) {
      player = {
        name: colMap.name !== undefined ? cells[colMap.name] || '' : '',
        jersey: colMap.jersey !== undefined ? cells[colMap.jersey] || '' : '',
        pos: colMap.pos !== undefined ? cells[colMap.pos] || '' : '',
        bats: colMap.bats !== undefined ? cells[colMap.bats] || '' : '',
        throws: colMap.throws !== undefined ? cells[colMap.throws] || '' : '',
        grad: colMap.grad !== undefined ? cells[colMap.grad] || '' : '',
      }
    } else {
      const remaining = [...cells]

      const numIdx = remaining.findIndex((c) => /^#?\d{1,3}$/.test(c))
      if (numIdx !== -1) {
        player.jersey = remaining[numIdx].replace('#', '')
        remaining.splice(numIdx, 1)
      }

      const posIdx = remaining.findIndex((c) => POSITIONS.has(c.toUpperCase()))
      if (posIdx !== -1) {
        player.pos = remaining[posIdx].toUpperCase()
        remaining.splice(posIdx, 1)
      }

      const gradIdx = remaining.findIndex((c) => /^20\d{2}$/.test(c))
      if (gradIdx !== -1) {
        player.grad = remaining[gradIdx]
        remaining.splice(gradIdx, 1)
      }

      player.name = remaining.join(' ').trim()
    }

    if (player.name) players.push(player)
  }

  return players
}
