'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useStream } from '@/hooks/useStream'
import { useToast } from '@/components/ui/Toast'

type ConnStatus = 'disconnected' | 'connecting' | 'connected'

interface PlatformState {
  gc: ConnStatus
  band: ConnStatus
  ncs: ConnStatus
}

interface Settings {
  gcAutoSync: boolean
  bandNotify: boolean
  bandScheduleSync: boolean
  ncsAlerts: boolean
  autoBackup: boolean
}

interface ComposeState {
  platform: 'band' | 'gc' | 'ncs'
  msgType: string
  body: string
}

const PLATFORMS = {
  gc: { label: 'GameChanger', icon: '⚾', desc: 'Live scores, pitch-by-pitch data, video clips, and player stat exports.', color: '#00c853', bgColor: 'rgba(0,200,83,.12)', accent: 'rgba(0,200,83,.25)' },
  band: { label: 'Band', icon: '📣', desc: 'Team communication, schedule posts, announcements, and parent/player messaging.', color: '#ff6b35', bgColor: 'rgba(255,107,53,.12)', accent: 'rgba(255,107,53,.25)' },
  ncs: { label: 'NCS Fastpitch', icon: '🏆', desc: 'Tournament finder, rankings, team registration, and Central Texas event schedules.', color: '#42a5f5', bgColor: 'rgba(66,165,245,.12)', accent: 'rgba(66,165,245,.25)' },
}

const NCS_TOURNAMENTS = [
  { id: 'n1', name: 'Lone Star Summer Slam', location: 'Round Rock, TX', dates: ['Jun', '14–15'], teams: 48, division: '10U Gold', registered: false },
  { id: 'n2', name: 'Texas Pride Classic', location: 'Pflugerville, TX', dates: ['Jun', '21–22'], teams: 36, division: '10U Silver', registered: false },
  { id: 'n3', name: 'Capital City Cup', location: 'Austin, TX', dates: ['Jul', '5–6'], teams: 52, division: '10U Gold', registered: false },
  { id: 'n4', name: 'Dog Days Invitational', location: 'Georgetown, TX', dates: ['Jul', '19–20'], teams: 28, division: '10U', registered: false },
]

const ACTIVITY_LOG = [
  { time: '2:14 PM', msg: 'NCS tournament data refreshed', src: 'ncs' },
  { time: '11:32 AM', msg: 'Synced 3 players to Band group', src: 'band' },
  { time: 'Yesterday', msg: 'Game result posted to Band', src: 'band' },
  { time: 'Yesterday', msg: 'Practice reminder scheduled', src: 'sys' },
  { time: 'Jun 5', msg: 'NCS ranking update for 10U', src: 'ncs' },
]

export default function IntegrationsPage() {
  const { store } = useStore()
  const { streamClaude } = useStream(store.apiKey)
  const { toast } = useToast()
  const { players, games, settings } = store

  const [tab, setTab] = useState<'hub' | 'gc' | 'band' | 'ncs' | 'composer' | 'roster' | 'settings'>('hub')
  const [platforms, setPlatforms] = useState<PlatformState>({ gc: 'disconnected', band: 'disconnected', ncs: 'disconnected' })
  const [platformSettings, setPlatformSettings] = useState<Settings>({ gcAutoSync: true, bandNotify: true, bandScheduleSync: false, ncsAlerts: true, autoBackup: false })
  const [compose, setCompose] = useState<ComposeState>({ platform: 'band', msgType: 'announcement', body: '' })
  const [briefing, setBriefing] = useState('')
  const [streamingBriefing, setStreamingBriefing] = useState(false)
  const [ncsSearch, setNcsSearch] = useState('')
  const [ncsTourn, setNcsTourn] = useState(NCS_TOURNAMENTS)
  const [gcSearch, setGcSearch] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiStreaming, setAiStreaming] = useState(false)

  function connect(p: keyof PlatformState) {
    setPlatforms(prev => ({ ...prev, [p]: 'connecting' }))
    setTimeout(() => {
      setPlatforms(prev => ({ ...prev, [p]: 'connected' }))
      toast(`${PLATFORMS[p].label} connected!`, 'success')
    }, 1200)
  }

  function disconnect(p: keyof PlatformState) {
    setPlatforms(prev => ({ ...prev, [p]: 'disconnected' }))
    toast(`${PLATFORMS[p].label} disconnected`)
  }

  async function generateBriefing() {
    if (!store.apiKey) { toast('Set your API key first', 'warn'); return }
    setStreamingBriefing(true)
    setBriefing('')
    const connected = Object.entries(platforms).filter(([, v]) => v === 'connected').map(([k]) => PLATFORMS[k as keyof typeof PLATFORMS].label)
    const w = games.filter(g => g.res === 'W').length
    const l = games.filter(g => g.res === 'L').length
    const prompt = `Give a brief integration status briefing for ${settings.teamName} (${settings.defaultAge}):
- Connected platforms: ${connected.length > 0 ? connected.join(', ') : 'None yet'}
- Record: ${w}–${l} in ${games.length} games
- Roster: ${players.length} players

Provide 3–4 actionable insights about what to do with these integrations this week. Be specific and concise. Use bullet points.`
    await streamClaude({
      system: 'You are a sports team management assistant. Give concise, practical advice.',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
      onText: (_, full) => setBriefing(full),
      onDone: (full) => { setStreamingBriefing(false); setBriefing(full) },
      onError: (e) => { setStreamingBriefing(false); toast('Error: ' + e.message, 'error') },
    })
  }

  async function generateMessage() {
    if (!store.apiKey) { toast('Set your API key first', 'warn'); return }
    setAiStreaming(true)
    setAiResponse('')
    const prompt = `Write a ${compose.msgType} message for ${settings.teamName} (${settings.defaultAge}) to post on ${PLATFORMS[compose.platform].label}.
Context: ${compose.body || 'General team update'}
Keep it friendly, brief, and appropriate for parents and players. Use emojis sparingly.`
    await streamClaude({
      system: 'You are a youth sports team communication expert. Write clear, friendly team messages.',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
      onText: (_, full) => setAiResponse(full),
      onDone: (full) => { setAiStreaming(false); setAiResponse(full) },
      onError: (e) => { setAiStreaming(false); toast('Error: ' + e.message, 'error') },
    })
  }

  function useAiText() {
    setCompose(prev => ({ ...prev, body: aiResponse }))
    setAiResponse('')
    toast('Message copied to composer', 'success')
  }

  function sendMessage() {
    if (!compose.body.trim()) { toast('Write a message first', 'warn'); return }
    if (platforms[compose.platform] !== 'connected') {
      toast(`Connect ${PLATFORMS[compose.platform].label} first`, 'warn'); return
    }
    toast(`Message sent via ${PLATFORMS[compose.platform].label}!`, 'success')
    setCompose(prev => ({ ...prev, body: '' }))
    setAiResponse('')
  }

  function registerTournament(id: string) {
    setNcsTourn(prev => prev.map(t => t.id === id ? { ...t, registered: !t.registered } : t))
    const t = ncsTourn.find(x => x.id === id)
    toast(t?.registered ? 'Registration cancelled' : `Registered for ${t?.name}!`, 'success')
  }

  const filteredTournaments = ncsTourn.filter(t =>
    t.name.toLowerCase().includes(ncsSearch.toLowerCase()) ||
    t.location.toLowerCase().includes(ncsSearch.toLowerCase())
  )

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(gcSearch.toLowerCase()) || (p.jersey || '').includes(gcSearch)
  )

  const connectedCount = Object.values(platforms).filter(v => v === 'connected').length

  const TABS = [
    { id: 'hub', label: '🔗 Hub' },
    { id: 'gc', label: '⚾ GameChanger' },
    { id: 'band', label: '📣 Band' },
    { id: 'ncs', label: '🏆 NCS Fastpitch' },
    { id: 'composer', label: '✉️ Compose' },
    { id: 'roster', label: '👥 Roster Sync' },
    { id: 'settings', label: '⚙️ Settings' },
  ] as const

  function PlatformCard({ pid }: { pid: keyof PlatformState }) {
    const p = PLATFORMS[pid]
    const s = platforms[pid]
    return (
      <div style={{ background: 'var(--bg)', border: `1px solid ${s === 'connected' ? p.accent : 'var(--border)'}`, borderRadius: 14, padding: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: p.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 10 }}>
          {p.icon}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{p.label}</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: s === 'connected' ? p.color : s === 'connecting' ? '#ffab00' : 'var(--text3)', display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: 'var(--text2)' }}>
            {s === 'connected' ? 'Connected' : s === 'connecting' ? 'Connecting...' : 'Not connected'}
          </span>
        </div>
        <button
          onClick={() => s === 'connected' ? disconnect(pid) : s !== 'connecting' ? connect(pid) : undefined}
          disabled={s === 'connecting'}
          style={{
            width: '100%', padding: '9px', borderRadius: 8,
            border: `1px solid ${s === 'connected' ? 'rgba(0,0,0,.15)' : p.accent}`,
            background: s === 'connected' ? p.bgColor : 'transparent',
            color: s === 'connected' ? p.color : p.color,
            fontSize: 13, fontWeight: 500, cursor: s === 'connecting' ? 'not-allowed' : 'pointer',
          }}
        >
          {s === 'connected' ? `✓ Connected — Disconnect` : s === 'connecting' ? 'Connecting...' : `Connect ${p.label} →`}
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Integrations Hub</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 14 }}>
        Band, GameChanger, and NCS Fastpitch — connected in one place
      </p>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 20, overflowX: 'auto' }}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '12px 16px', fontSize: 13, fontWeight: 500, border: 'none', background: 'none', cursor: 'pointer',
              color: tab === id ? 'var(--text)' : 'var(--text2)',
              borderBottom: `2px solid ${tab === id ? 'var(--red)' : 'transparent'}`,
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* HUB */}
      {tab === 'hub' && (
        <div>
          <div style={{ background: 'linear-gradient(135deg, rgba(192,57,43,.1), rgba(52,152,219,.08))', border: '1px solid rgba(192,57,43,.25)', borderRadius: 14, padding: 18, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(192,57,43,.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🤖</div>
            <div style={{ flex: 1, fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text)' }}>Integration Hub</strong> — {connectedCount} of 3 platforms connected. Band, GameChanger, and NCS in one place.
            </div>
            <button
              onClick={generateBriefing}
              disabled={streamingBriefing}
              style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(192,57,43,.4)', background: 'rgba(192,57,43,.1)', color: 'var(--red3)', fontSize: 12, fontWeight: 500, cursor: streamingBriefing ? 'not-allowed' : 'pointer' }}
            >
              {streamingBriefing ? '⏳' : '✨ Briefing'}
            </button>
          </div>

          {briefing && (
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(192,57,43,.2)', borderRadius: 10, padding: 14, fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 16, whiteSpace: 'pre-wrap' }}>
              {briefing}{streamingBriefing && <span className="cursor" />}
            </div>
          )}

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>Platform Status</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
            {(['gc', 'band', 'ncs'] as const).map(pid => <PlatformCard key={pid} pid={pid} />)}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>Recent Activity</div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '4px 16px' }}>
            {ACTIVITY_LOG.map((entry, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < ACTIVITY_LOG.length - 1 ? '1px solid var(--bg4)' : 'none', fontSize: 12 }}>
                <span style={{ color: 'var(--text3)', minWidth: 70 }}>{entry.time}</span>
                <span style={{ flex: 1, color: 'var(--text2)' }}>{entry.msg}</span>
                <span style={{
                  padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                  background: entry.src === 'gc' ? 'rgba(0,200,83,.12)' : entry.src === 'band' ? 'rgba(255,107,53,.12)' : entry.src === 'ncs' ? 'rgba(66,165,245,.12)' : 'rgba(255,255,255,.07)',
                  color: entry.src === 'gc' ? '#00c853' : entry.src === 'band' ? '#ff6b35' : entry.src === 'ncs' ? '#42a5f5' : 'var(--text2)',
                }}>
                  {entry.src.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAMECHANGER */}
      {tab === 'gc' && (
        <div>
          <PlatformCard pid="gc" />
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10, marginTop: 16 }}>Roster Sync Preview</div>
            <input
              type="text"
              placeholder="Search players..."
              value={gcSearch}
              onChange={e => setGcSearch(e.target.value)}
              style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
            />
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '4px 16px' }}>
              {(gcSearch ? filteredPlayers : players).length === 0 ? (
                <div style={{ color: 'var(--text3)', fontSize: 12, padding: '14px 0', textAlign: 'center' }}>No players. Add players in Roster.</div>
              ) : (
                (gcSearch ? filteredPlayers : players).map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < players.length - 1 ? '1px solid var(--bg4)' : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text2)', flexShrink: 0 }}>
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{p.jersey ? '#' + p.jersey : '—'}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{p.pos || '—'}</span>
                    <span style={{ fontSize: 12 }}>{platforms.gc === 'connected' ? '✅' : '⚪'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          {platforms.gc !== 'connected' && (
            <div style={{ background: 'rgba(0,200,83,.06)', border: '1px dashed rgba(0,200,83,.2)', borderRadius: 10, padding: 14, fontSize: 12, color: 'var(--text2)', marginTop: 14, lineHeight: 1.6 }}>
              Connect GameChanger above to sync stats automatically after each game.
            </div>
          )}
        </div>
      )}

      {/* BAND */}
      {tab === 'band' && (
        <div>
          <PlatformCard pid="band" />
          <div style={{ marginTop: 16, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text)' }}>Quick Post to Band</h3>
            <textarea
              placeholder="Type your message here... or use the Compose tab for AI-generated content."
              rows={4}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '10px 12px', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box', marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['📅 Practice reminder', '🏆 Game result', '📢 Announcement', '🎉 Team news'].map(t => (
                <button key={t} style={{ background: 'var(--bg4)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '5px 10px', borderRadius: 20, fontSize: 12, cursor: 'pointer' }}>{t}</button>
              ))}
            </div>
            <button
              onClick={() => {
                if (platforms.band !== 'connected') { toast('Connect Band first', 'warn'); return }
                toast('Posted to Band!', 'success')
              }}
              style={{ marginTop: 12, background: platforms.band === 'connected' ? '#ff6b35' : 'var(--bg4)', color: '#fff', padding: '9px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              {platforms.band === 'connected' ? 'Post to Band' : 'Connect Band to Post'}
            </button>
          </div>
        </div>
      )}

      {/* NCS */}
      {tab === 'ncs' && (
        <div>
          <PlatformCard pid="ncs" />
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--text3)' }}>Upcoming Tournaments</div>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{settings.defaultAge} · Central Texas</span>
            </div>
            <input
              type="text"
              placeholder="Search tournaments..."
              value={ncsSearch}
              onChange={e => setNcsSearch(e.target.value)}
              style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredTournaments.map(t => (
                <div key={t.id} style={{ background: 'var(--bg2)', border: `1px solid ${t.registered ? 'rgba(66,165,245,.4)' : 'var(--border)'}`, borderRadius: 12, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(66,165,245,.1)', border: '1px solid rgba(66,165,245,.2)', borderRadius: 10, padding: '8px 10px', textAlign: 'center', minWidth: 52, flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#42a5f5', letterSpacing: '.5px' }}>{t.dates[0]}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{t.dates[1]}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                      📍 {t.location} · {t.teams} teams · {t.division}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    {t.registered && (
                      <span style={{ background: 'rgba(66,165,245,.15)', color: '#42a5f5', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>REGISTERED</span>
                    )}
                    <button
                      onClick={() => registerTournament(t.id)}
                      style={{
                        padding: '5px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                        border: t.registered ? '1px solid rgba(255,82,82,.3)' : '1px solid rgba(66,165,245,.3)',
                        background: t.registered ? 'rgba(255,82,82,.07)' : 'rgba(66,165,245,.07)',
                        color: t.registered ? '#ff5252' : '#42a5f5',
                      }}
                    >
                      {t.registered ? 'Cancel' : 'Register'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPOSER */}
      {tab === 'composer' && (
        <div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {(['band', 'gc', 'ncs'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setCompose(prev => ({ ...prev, platform: p }))}
                  style={{
                    flex: 1, padding: '12px 8px', fontSize: 12, fontWeight: 500,
                    background: compose.platform === p ? 'rgba(255,255,255,.04)' : 'none',
                    color: compose.platform === p ? 'var(--text)' : 'var(--text2)',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: PLATFORMS[p].color, display: 'inline-block' }} />
                  {PLATFORMS[p].label}
                </button>
              ))}
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                {['announcement', 'schedule', 'game result', 'reminder', 'fundraiser'].map(type => (
                  <button
                    key={type}
                    onClick={() => setCompose(prev => ({ ...prev, msgType: type }))}
                    style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                      border: `1px solid ${compose.msgType === type ? 'var(--red)' : 'var(--border)'}`,
                      background: compose.msgType === type ? 'rgba(192,57,43,.1)' : 'none',
                      color: compose.msgType === type ? 'var(--red3)' : 'var(--text2)',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <textarea
                value={compose.body}
                onChange={e => setCompose(prev => ({ ...prev, body: e.target.value }))}
                placeholder={`Write your ${compose.msgType} for ${PLATFORMS[compose.platform].label}...`}
                rows={5}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '12px', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', lineHeight: 1.5, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={generateMessage}
                disabled={aiStreaming}
                style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(192,57,43,.4)', background: 'rgba(192,57,43,.1)', color: 'var(--red3)', fontSize: 12, fontWeight: 500, cursor: aiStreaming ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
              >
                {aiStreaming ? '⏳' : '✨'} AI Generate
              </button>
              <button
                onClick={sendMessage}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: PLATFORMS[compose.platform].color, color: compose.platform === 'band' ? '#fff' : '#000', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Send via {PLATFORMS[compose.platform].label}
              </button>
            </div>
          </div>

          {(aiResponse || aiStreaming) && (
            <div style={{ background: 'var(--bg2)', border: '1px solid rgba(192,57,43,.2)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>AI Suggestion</div>
                {!aiStreaming && aiResponse && (
                  <button onClick={useAiText} style={{ background: 'var(--red)', color: '#fff', padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    Use This →
                  </button>
                )}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {aiResponse}{aiStreaming && <span className="cursor" />}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ROSTER SYNC */}
      {tab === 'roster' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              { num: players.length, lbl: 'Total Players' },
              { num: Object.values(platforms).filter(v => v === 'connected').length, lbl: 'Platforms' },
              { num: platforms.gc === 'connected' ? players.length : 0, lbl: 'GC Synced' },
              { num: platforms.band === 'connected' ? players.length : 0, lbl: 'Band Synced' },
            ].map(({ num, lbl }) => (
              <div key={lbl} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{num}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: 3 }}>{lbl}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 14, color: 'var(--text)' }}>Roster</h3>
              <button
                onClick={() => toast('Roster sync started...', 'success')}
                style={{ background: 'var(--red)', color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Sync All
              </button>
            </div>
            {players.length === 0 ? (
              <div style={{ color: 'var(--text3)', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
                No players. Add players in the Roster page.
              </div>
            ) : (
              players.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < players.length - 1 ? '1px solid var(--bg4)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text2)', flexShrink: 0 }}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>#{p.jersey || '?'}</span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <span title="GameChanger">{platforms.gc === 'connected' ? '⚾' : '○'}</span>
                    <span title="Band">{platforms.band === 'connected' ? '📣' : '○'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {tab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'gcAutoSync', label: 'Auto-sync GameChanger stats', sub: 'Update player stats after each game' },
            { key: 'bandNotify', label: 'Band notifications', sub: 'Send game reminders to Band group' },
            { key: 'bandScheduleSync', label: 'Band schedule sync', sub: 'Sync practice/game schedule to Band calendar' },
            { key: 'ncsAlerts', label: 'NCS tournament alerts', sub: 'Notify when new tournaments are posted for your age group' },
            { key: 'autoBackup', label: 'Auto backup data', sub: 'Daily backup of all team data' },
          ].map(({ key, label, sub }) => (
            <div key={key} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, color: 'var(--text)' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{sub}</div>
              </div>
              <button
                onClick={() => setPlatformSettings(prev => ({ ...prev, [key]: !prev[key as keyof Settings] }))}
                style={{
                  width: 36, height: 20, borderRadius: 10,
                  background: platformSettings[key as keyof Settings] ? 'rgba(192,57,43,.3)' : 'var(--bg4)',
                  border: `1px solid ${platformSettings[key as keyof Settings] ? 'var(--red)' : 'var(--bg4)'}`,
                  cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background .2s',
                }}
              >
                <span style={{
                  position: 'absolute', top: 2, left: platformSettings[key as keyof Settings] ? 18 : 2,
                  width: 14, height: 14, borderRadius: '50%',
                  background: platformSettings[key as keyof Settings] ? 'var(--red3)' : 'var(--text3)',
                  transition: 'left .2s, background .2s',
                }} />
              </button>
            </div>
          ))}

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text)' }}>Connected Platforms</h3>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {(['gc', 'band', 'ncs'] as const).map(pid => (
                <div key={pid} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8,
                  background: 'var(--bg)', border: `1px solid ${platforms[pid] === 'connected' ? PLATFORMS[pid].accent : 'var(--bg4)'}`,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: platforms[pid] === 'connected' ? PLATFORMS[pid].color : 'var(--text3)', display: 'inline-block' }} />
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{PLATFORMS[pid].label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{platforms[pid]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
