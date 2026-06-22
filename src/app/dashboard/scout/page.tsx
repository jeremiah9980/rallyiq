'use client'

import { useState } from 'react'
import { useStore, uid, Research } from '@/lib/store'
import { useStream } from '@/hooks/useStream'
import { useToast } from '@/components/ui/Toast'

const CATEGORIES = ['hitting', 'pitching', 'fielding', 'baserunning', 'catching', 'conditioning', 'mental', 'warmup', 'other']
const LEVELS = ['beginner', 'intermediate', 'advanced', 'all']

export default function DrillLibraryPage() {
  const { store, update } = useStore()
  const { streamClaude } = useStream(store.apiKey)
  const { toast } = useToast()
  const { research, settings } = store

  const [tab, setTab] = useState<'research' | 'library'>('research')
  const [topic, setTopic] = useState('')
  const [age, setAge] = useState(settings.defaultAge || '10U')
  const [level, setLevel] = useState('intermediate')
  const [category, setCategory] = useState('hitting')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [savedText, setSavedText] = useState('')
  const [viewItem, setViewItem] = useState<Research | null>(null)
  const [filterCat, setFilterCat] = useState('all')

  const filtered = filterCat === 'all' ? research : research.filter(r => r.category === filterCat)

  async function generateDrills() {
    if (!store.apiKey) { toast('Set your API key first', 'warn'); return }
    if (!topic.trim()) { toast('Enter a topic or skill', 'warn'); return }
    setStreaming(true)
    setStreamingText('')
    setSavedText('')

    const system = `You are an expert softball coach and drill designer. Create comprehensive, structured drill content with:
- Clear drill names and objectives
- Setup instructions (equipment, players, space needed)
- Step-by-step execution
- Coaching cues and common mistakes to avoid
- Progressions and regressions
- Age-appropriate modifications
Format with markdown headers and bullet points. Be practical and specific.`

    const prompt = `Create a comprehensive drill guide for: **${topic}**

Age group: ${age}
Skill level: ${level}
Category: ${category}
Team: ${settings.teamName}

Include:
1. 3-5 specific drills with clear progression
2. Setup diagrams described in text
3. Coaching cues for each drill
4. How to run it in a team practice setting
5. Common errors and how to correct them`

    await streamClaude({
      system,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      onText: (_, full) => { setStreamingText(full) },
      onDone: (full) => {
        setStreaming(false)
        setSavedText(full)
        setStreamingText('')
        toast('Drill guide generated!', 'success')
      },
      onError: (e) => {
        setStreaming(false)
        setStreamingText('')
        toast('Error: ' + e.message, 'error')
      },
    })
  }

  function saveToLibrary() {
    if (!savedText) return
    const r: Research = {
      id: uid(),
      content: savedText,
      topic: topic.trim(),
      age,
      level,
      category,
      created: Date.now(),
    }
    update(prev => ({ ...prev, research: [r, ...prev.research] }))
    toast('Saved to library!', 'success')
  }

  function deleteItem(id: string) {
    if (!confirm('Delete this drill guide?')) return
    update(prev => ({ ...prev, research: prev.research.filter(r => r.id !== id) }))
    if (viewItem?.id === id) setViewItem(null)
    toast('Deleted')
  }

  function renderMarkdown(text: string) {
    try {
      if (typeof window !== 'undefined' && (window as typeof window & { marked?: { parse: (s: string) => string } }).marked) {
        return (window as typeof window & { marked: { parse: (s: string) => string } }).marked.parse(text)
      }
    } catch { /* noop */ }
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
  }

  const tabBtn = (t: typeof tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      style={{
        padding: '8px 16px', borderRadius: 7, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
        background: tab === t ? 'var(--red)' : 'var(--bg4)',
        color: tab === t ? '#fff' : 'var(--text2)',
      }}
    >
      {label}
    </button>
  )

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Drill Library</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        Generate AI-powered drill guides and build your personal library
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {tabBtn('research', 'Generate Drills')}
        {tabBtn('library', `Saved Library (${research.length})`)}
      </div>

      {/* Research / Generate tab */}
      {tab === 'research' && (
        <div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Topic / Skill *</label>
                <input
                  type="text"
                  placeholder="e.g. hitting off-speed pitches, quick release from catcher, base stealing..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !streaming && generateDrills()}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Age Group</label>
                <select
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                >
                  {['8U', '10U', '12U', '14U', '16U', '18U'].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Level</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                >
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={generateDrills}
              disabled={streaming}
              style={{
                background: streaming ? 'var(--bg4)' : 'var(--red)', color: '#fff',
                padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                border: 'none', cursor: streaming ? 'not-allowed' : 'pointer',
              }}
            >
              {streaming ? '⏳ Generating drills...' : '✨ Generate Drill Guide'}
            </button>
          </div>

          {(streaming || savedText) && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text)' }}>
                  {topic || 'Drill Guide'}
                  {!streaming && <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 8 }}>{age} · {level} · {category}</span>}
                </h3>
                {!streaming && savedText && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={saveToLibrary}
                      style={{ background: 'var(--red)', color: '#fff', padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}
                    >
                      Save to Library
                    </button>
                    <button
                      onClick={() => navigator.clipboard?.writeText(savedText).then(() => toast('Copied!', 'success'))}
                      style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '7px 12px', borderRadius: 6, fontSize: 12, border: 'none', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
              <div className="output">
                {streaming ? (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) + '<span class="cursor"></span>' }} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(savedText) }} />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Library tab */}
      {tab === 'library' && (
        <div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {['all', ...CATEGORIES].map(c => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                style={{
                  padding: '5px 12px', borderRadius: 20, fontSize: 12, border: 'none', cursor: 'pointer',
                  background: filterCat === c ? 'var(--red)' : 'var(--bg4)',
                  color: filterCat === c ? '#fff' : 'var(--text2)',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '40px 20px', background: 'var(--bg2)', border: '1px dashed var(--bg4)', borderRadius: 12 }}>
              {research.length === 0
                ? 'No saved drills yet. Generate and save from the "Generate Drills" tab.'
                : 'No drills match this filter.'}
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, marginBottom: viewItem ? 16 : 0 }}>
                {filtered.map(r => (
                  <div
                    key={r.id}
                    style={{
                      background: viewItem?.id === r.id ? 'var(--bg)' : 'var(--bg2)',
                      border: `1px solid ${viewItem?.id === r.id ? 'var(--red)' : 'var(--border)'}`,
                      borderRadius: 10, padding: 14, cursor: 'pointer',
                    }}
                    onClick={() => setViewItem(viewItem?.id === r.id ? null : r)}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{r.topic}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '1px 7px', borderRadius: 3, fontSize: 10 }}>{r.category}</span>
                      <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '1px 7px', borderRadius: 3, fontSize: 10 }}>{r.age}</span>
                      <span style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '1px 7px', borderRadius: 3, fontSize: 10 }}>{r.level}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(r.created).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>

              {viewItem && (
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, color: 'var(--text)' }}>{viewItem.topic}</h3>
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                        {viewItem.age} · {viewItem.level} · {viewItem.category}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => navigator.clipboard?.writeText(viewItem.content).then(() => toast('Copied!', 'success'))}
                        style={{ background: 'var(--bg4)', color: 'var(--text2)', padding: '6px 12px', borderRadius: 6, fontSize: 12, border: 'none', cursor: 'pointer' }}
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => deleteItem(viewItem.id)}
                        style={{ background: 'none', border: '1px solid var(--bg4)', color: 'var(--text3)', padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setViewItem(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 18, cursor: 'pointer', padding: '4px 6px' }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="output">
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(viewItem.content) }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
