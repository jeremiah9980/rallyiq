'use client'

import { useState, useRef, useEffect } from 'react'
import { useStore, uid, Thread } from '@/lib/store'
import { useStream } from '@/hooks/useStream'
import { useToast } from '@/components/ui/Toast'

function renderMarkdown(text: string): string {
  try {
    if (typeof window !== 'undefined' && (window as typeof window & { marked?: { parse: (s: string) => string } }).marked) {
      return (window as typeof window & { marked: { parse: (s: string) => string } }).marked.parse(text)
    }
  } catch {}
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
}

const COACH_SYS = 'You are a knowledgeable travel softball coach and player development expert with deep experience in youth athletics. Practical, specific, actionable advice. Format with markdown. When asked about a skill, include drills and coaching cues. Keep responses focused.'

export default function CoachAIPage() {
  const { store, update } = useStore()
  const { streamClaude } = useStream(store.apiKey)
  const { toast } = useToast()
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const msgsRef = useRef<HTMLDivElement>(null)

  const activeThread = store.threads.find(t => t.id === store.activeThreadId)

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [activeThread?.messages, streamingText])

  function newThread() {
    const t: Thread = { id: uid(), title: 'New chat', messages: [], created: Date.now() }
    update((prev) => ({
      ...prev,
      threads: [t, ...prev.threads],
      activeThreadId: t.id,
    }))
  }

  function selectThread(id: string) {
    update((prev) => ({ ...prev, activeThreadId: id }))
  }

  function deleteThread(id: string) {
    if (!confirm('Delete this conversation?')) return
    update((prev) => ({
      ...prev,
      threads: prev.threads.filter(t => t.id !== id),
      activeThreadId: prev.activeThreadId === id ? (prev.threads.find(t => t.id !== id)?.id ?? null) : prev.activeThreadId,
    }))
  }

  async function sendChat() {
    if (!store.apiKey) {
      toast('Set your API key first', 'warn')
      return
    }
    const text = input.trim()
    if (!text) return
    setInput('')

    let threadId = store.activeThreadId
    if (!threadId) {
      const t: Thread = { id: uid(), title: text.slice(0, 40) + (text.length > 40 ? '...' : ''), messages: [], created: Date.now() }
      update((prev) => ({ ...prev, threads: [t, ...prev.threads], activeThreadId: t.id }))
      threadId = t.id
    }

    update((prev) => {
      const threads = prev.threads.map(t => {
        if (t.id !== threadId) return t
        const updated = { ...t, messages: [...t.messages, { role: 'user' as const, content: text }] }
        if (updated.title === 'New chat') updated.title = text.slice(0, 40) + (text.length > 40 ? '...' : '')
        return updated
      })
      return { ...prev, threads }
    })

    setStreaming(true)
    setStreamingText('')

    const currentThread = store.threads.find(t => t.id === threadId)
    const messages = [...(currentThread?.messages || []), { role: 'user' as const, content: text }]

    await streamClaude({
      system: COACH_SYS,
      max_tokens: 1500,
      messages,
      onText: (_, full) => setStreamingText(full),
      onDone: (full) => {
        setStreaming(false)
        setStreamingText('')
        update((prev) => ({
          ...prev,
          threads: prev.threads.map(t => {
            if (t.id !== threadId) return t
            return { ...t, messages: [...t.messages, { role: 'user' as const, content: text }, { role: 'assistant' as const, content: full }] }
          }),
        }))
      },
      onError: (e) => {
        setStreaming(false)
        setStreamingText('')
        toast('Error: ' + e.message, 'error')
      },
    })
  }

  return (
    <div>
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Coach AI</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        Ask anything — mechanics, drills, strategy, parent dynamics, player development
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14, minHeight: 500 }}>
        {/* Thread sidebar */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          <button
            onClick={newThread}
            style={{ background: 'var(--red)', color: '#fff', padding: '8px 12px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', marginBottom: 6 }}
          >
            + New chat
          </button>
          {store.threads.length === 0 ? (
            <div style={{ color: 'var(--text3)', fontSize: 12, padding: 8, textAlign: 'center' }}>No chats yet</div>
          ) : (
            store.threads.map(t => (
              <div
                key={t.id}
                onClick={() => selectThread(t.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 7,
                  background: t.id === store.activeThreadId ? 'var(--red)' : 'var(--bg)',
                  border: `1px solid ${t.id === store.activeThreadId ? 'var(--red)' : 'var(--bg4)'}`,
                  cursor: 'pointer',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: t.id === store.activeThreadId ? '#fff' : 'var(--text)',
                }}
              >
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteThread(t.id) }}
                  style={{ opacity: 0.5, fontSize: 14, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Chat main */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div
            ref={msgsRef}
            style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 400, maxHeight: '60vh' }}
          >
            {!activeThread ? (
              <div className="msg assistant">
                Hi Coach! Click <strong>+ New chat</strong> to start a conversation.
              </div>
            ) : activeThread.messages.length === 0 ? (
              <div className="msg assistant">What can I help you with, Coach?</div>
            ) : (
              <>
                {activeThread.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`msg ${m.role}`}
                    dangerouslySetInnerHTML={{ __html: m.role === 'assistant' ? renderMarkdown(m.content) : m.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') }}
                  />
                ))}
                {streaming && (
                  <div
                    className="msg assistant"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) + '<span class="cursor"></span>' }}
                  />
                )}
              </>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--bg4)', padding: 12, display: 'flex', gap: 8, background: 'var(--bg2)' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !streaming && sendChat()}
              placeholder="Ask a coaching question..."
              disabled={streaming}
              style={{
                flex: 1,
                background: 'var(--bg)',
                border: '1px solid var(--bg4)',
                color: 'var(--text)',
                padding: '9px 12px',
                borderRadius: 7,
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              onClick={sendChat}
              disabled={streaming}
              style={{
                background: streaming ? 'var(--bg4)' : 'var(--red)',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: 7,
                fontSize: 14,
                fontWeight: 600,
                cursor: streaming ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
