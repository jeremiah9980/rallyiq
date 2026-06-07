'use client'

import { useState, useEffect, useCallback } from 'react'

const STORE_KEY = 'rallyiq-v1'

export interface Player {
  id: string
  name: string
  jersey: string
  pos: string
  bats: string
  throws: string
  notes: string
  grad?: string
  parent?: string
  email?: string
  phone?: string
  stats?: {
    ab: number; h: number; rbi: number; r: number; bb: number; k: number; hr: number; avg: number
  }
}

export interface GameStats {
  ab?: number
  h?: number
  d?: number
  t?: number
  hr?: number
  rbi?: number
  r?: number
  bb?: number
  k?: number
  sb?: number
}

export interface Game {
  id: string
  date: string
  opp: string
  loc: string
  type: 'regular' | 'tournament' | 'scrimmage'
  res: 'W' | 'L' | 'T'
  us: number
  them: number
  notes: string
  stats: Record<string, GameStats>
  playerStats?: Record<string, GameStats>
}

export interface Plan {
  id: string
  title: string
  coachContent: string
  playerContent: string
  age: string
  dur: string
  players: string
  focus: string
  coaches: string
  notes: string
  created: number
}

export interface Research {
  id: string
  content: string
  topic: string
  age: string
  level: string
  category: string
  created: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface Thread {
  id: string
  title: string
  messages: ChatMessage[]
  created: number
}

export interface TournGame {
  id: string
  day: number
  gameNum: number
  time: string
  arrive: string
  opp: string
  field: string
  uniform: string
  notes: string
}

export interface Tournament {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  format: string
  uniformPrimary: string
  uniformAlt: string
  parkingInfo: string
  foodPlan: string
  notes: string
  games: TournGame[]
  coachContent: string
  parentContent: string
  created: number
}

export interface Contribution {
  id: string
  date: string
  playerId: string | null
  amount: number
  donor: string
  method: string
}

export interface FundTask {
  id: string
  title: string
  assignee: string
  dueDate: string
  done: boolean
  created: number
}

export interface Fundraiser {
  id: string
  name: string
  type: string
  goal: number
  startDate: string
  endDate: string
  coordinator: string
  perPlayerGoal: number
  location: string
  description: string
  status: 'planning' | 'active' | 'complete'
  contributions: Contribution[]
  tasks: FundTask[]
  coordContent: string
  familyContent: string
  created: number
}

export interface Store {
  apiKey: string
  rememberKey: boolean
  settings: {
    teamName: string
    defaultAge: string
    season: string
  }
  players: Player[]
  games: Game[]
  plans: Plan[]
  research: Research[]
  threads: Thread[]
  activeThreadId: string | null
  tournaments: Tournament[]
  fundraisers: Fundraiser[]
}

const DEFAULT_STORE: Store = {
  apiKey: '',
  rememberKey: true,
  settings: {
    teamName: 'Cortinas 10U',
    defaultAge: '10U',
    season: 'Spring 2026',
  },
  players: [
    { id: 'p1', name: 'Kassidy Cargill', jersey: '21', pos: 'CF', bats: 'R', throws: 'R', notes: '' },
    { id: 'p2', name: 'Avery Thompson', jersey: '3', pos: '1B', bats: 'L', throws: 'R', notes: '' },
    { id: 'p3', name: 'Sofia Martinez', jersey: '7', pos: 'SS', bats: 'R', throws: 'R', notes: '' },
  ],
  games: [],
  plans: [],
  research: [],
  threads: [],
  activeThreadId: null,
  tournaments: [],
  fundraisers: [],
}

let memoryOnly = false

function loadRaw(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_STORE, ...parsed }
    }
  } catch {
    memoryOnly = true
  }
  return { ...DEFAULT_STORE }
}

function saveRaw(data: Store) {
  if (memoryOnly) return
  try {
    const toSave = { ...data }
    if (!data.rememberKey) toSave.apiKey = ''
    localStorage.setItem(STORE_KEY, JSON.stringify(toSave))
  } catch {
    memoryOnly = true
  }
}

export function saveStore(data: Store) {
  saveRaw(data)
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function calcStats(playerId: string, games: Game[]) {
  let ab = 0, h = 0, d = 0, t = 0, hr = 0, rbi = 0, r = 0, bb = 0, k = 0, sb = 0, g = 0
  for (const game of games) {
    const s = game.stats[playerId]
    if (!s) continue
    g++
    ab += s.ab || 0
    h += s.h || 0
    d += s.d || 0
    t += s.t || 0
    hr += s.hr || 0
    rbi += s.rbi || 0
    r += s.r || 0
    bb += s.bb || 0
    k += s.k || 0
    sb += s.sb || 0
  }
  const singles = h - d - t - hr
  const avg = ab ? h / ab : 0
  const obp = (ab + bb) ? (h + bb) / (ab + bb) : 0
  const slg = ab ? (singles + 2 * d + 3 * t + 4 * hr) / ab : 0
  const ops = obp + slg
  return { g, ab, h, d, t, hr, rbi, r, bb, k, sb, avg, obp, slg, ops }
}

export function fmt(n: number): string {
  return n.toFixed(3).replace(/^0\./, '.')
}

export function fundraisedTotal(f: Fundraiser): number {
  let s = 0
  for (const c of (f.contributions || [])) s += c.amount || 0
  return s
}

export function useStore() {
  const [store, setStore] = useState<Store>(() => {
    if (typeof window === 'undefined') return { ...DEFAULT_STORE }
    return loadRaw()
  })

  const update = useCallback((updater: (prev: Store) => Store) => {
    setStore((prev) => {
      const next = updater(prev)
      saveRaw(next)
      return next
    })
  }, [])

  return { store, update }
}
