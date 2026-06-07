'use client'

import { useState } from 'react'
import { useStore, uid, Fundraiser, Contribution, FundTask, fundraisedTotal } from '@/lib/store'
import { useStream } from '@/hooks/useStream'
import { useToast } from '@/components/ui/Toast'

const FUND_MARKER = '---FAMILY-VERSION---'

const EMPTY_FORM = {
  name: '',
  type: 'general',
  goal: '',
  startDate: '',
  endDate: '',
  coordinator: '',
  perPlayerGoal: '',
  location: '',
  description: '',
}

export default function FundraisePage() {
  const { store, update } = useStore()
  const { streamClaude } = useStream(store.apiKey)
  const { toast } = useToast()
  const { fundraisers, players, settings } = store

  const [tab, setTab] = useState<'overview' | 'add' | 'detail'>('overview')
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'coord' | 'family'>('coord')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')

  // Contribution form
  const [contribForm, setContribForm] = useState({ donor: '', amount: '', method: 'cash', playerId: '' })
  // Task form
  const [taskForm, setTaskForm] = useState({ title: '', assignee: '', dueDate: '' })

  const selected = fundraisers.find(f => f.id === selectedId) ?? null

  const totalRaised = fundraisers.reduce((s, f) => s + fundraisedTotal(f), 0)
  const activeCount = fundraisers.filter(f => f.status === 'active').length
  const totalGoal = fundraisers.reduce((s, f) => s + (f.goal || 0), 0)

  function createFundraiser() {
    if (!form.name.trim()) { toast('Enter fundraiser name', 'warn'); return }
    const f: Fundraiser = {
      id: uid(),
      name: form.name.trim(),
      type: form.type,
      goal: parseFloat(form.goal) || 0,
      startDate: form.startDate,
      endDate: form.endDate,
      coordinator: form.coordinator.trim(),
      perPlayerGoal: parseFloat(form.perPlayerGoal) || 0,
      location: form.location.trim(),
      description: form.description.trim(),
      status: 'active',
      contributions: [],
      tasks: [],
      coordContent: '',
      familyContent: '',
      created: Date.now(),
    }
    update(prev => ({ ...prev, fundraisers: [f, ...prev.fundraisers] }))
    setForm(EMPTY_FORM)
    setSelectedId(f.id)
    setTab('detail')
    toast('Fundraiser created!', 'success')
  }

  function deleteFundraiser(id: string) {
    if (!confirm('Delete this fundraiser?')) return
    update(prev => ({ ...prev, fundraisers: prev.fundraisers.filter(f => f.id !== id) }))
    if (selectedId === id) { setSelectedId(null); setTab('overview') }
    toast('Fundraiser deleted')
  }

  function updateStatus(id: string, status: Fundraiser['status']) {
    update(prev => ({
      ...prev,
      fundraisers: prev.fundraisers.map(f => f.id === id ? { ...f, status } : f),
    }))
  }

  function addContribution() {
    if (!contribForm.donor.trim()) { toast('Enter donor name', 'warn'); return }
    const amount = parseFloat(contribForm.amount)
    if (isNaN(amount) || amount <= 0) { toast('Enter valid amount', 'warn'); return }
    if (!selectedId) return
    const c: Contribution = {
      id: uid(),
      date: new Date().toISOString().slice(0, 10),
      playerId: contribForm.playerId || null,
      amount,
      donor: contribForm.donor.trim(),
      method: contribForm.method,
    }
    update(prev => ({
      ...prev,
      fundraisers: prev.fundraisers.map(f =>
        f.id === selectedId ? { ...f, contributions: [c, ...f.contributions] } : f
      ),
    }))
    setContribForm({ donor: '', amount: '', method: 'cash', playerId: '' })
    toast(`$${amount.toFixed(2)} recorded`, 'success')
  }

  function deleteContrib(contribId: string) {
    if (!selectedId) return
    update(prev => ({
      ...prev,
      fundraisers: prev.fundraisers.map(f =>
        f.id === selectedId ? { ...f, contributions: f.contributions.filter(c => c.id !== contribId) } : f
      ),
    }))
  }

  function addTask() {
    if (!taskForm.title.trim()) { toast('Enter task title', 'warn'); return }
    if (!selectedId) return
    const t: FundTask = {
      id: uid(),
      title: taskForm.title.trim(),
      assignee: taskForm.assignee.trim(),
      dueDate: taskForm.dueDate,
      done: false,
      created: Date.now(),
    }
    update(prev => ({
      ...prev,
      fundraisers: prev.fundraisers.map(f =>
        f.id === selectedId ? { ...f, tasks: [...f.tasks, t] } : f
      ),
    }))
    setTaskForm({ title: '', assignee: '', dueDate: '' })
  }

  function toggleTask(taskId: string) {
    if (!selectedId) return
    update(prev => ({
      ...prev,
      fundraisers: prev.fundraisers.map(f =>
        f.id === selectedId
          ? { ...f, tasks: f.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }
          : f
      ),
    }))
  }

  function deleteTask(taskId: string) {
    if (!selectedId) return
    update(prev => ({
      ...prev,
      fundraisers: prev.fundraisers.map(f =>
        f.id === selectedId ? { ...f, tasks: f.tasks.filter(t => t.id !== taskId) } : f
      ),
    }))
  }

  async function generatePlans() {
    if (!store.apiKey) { toast('Set your API key first', 'warn'); return }
    if (!selected) return
    setStreaming(true)
    setStreamingText('')

    const system = `You are a youth sports fundraising expert. Generate two detailed plans separated by exactly "${FUND_MARKER}":
1. COORDINATOR PLAN: Detailed operational plan with timeline, volunteer assignments, logistics, tracking, follow-up sequences, payment processing
2. FAMILY/PLAYER PLAN: Simple friendly communication with player goals, how to participate, share links, talking points for donors, motivation

Format both with markdown. Be specific and actionable.`

    const raised = fundraisedTotal(selected)
    const progress = selected.goal > 0 ? Math.round(raised / selected.goal * 100) : 0
    const rosterList = players.map(p => p.name).join(', ')

    const prompt = `Create fundraising plans for:

**${selected.name}**
Type: ${selected.type}
Goal: $${selected.goal}${selected.perPlayerGoal ? ` (per-player: $${selected.perPlayerGoal})` : ''}
Raised so far: $${raised.toFixed(2)} (${progress}%)
Dates: ${selected.startDate || 'TBD'}${selected.endDate ? ' – ' + selected.endDate : ''}
Coordinator: ${selected.coordinator || 'TBD'}
Location: ${selected.location || 'N/A'}
Team: ${settings.teamName} (${settings.defaultAge})
Roster: ${rosterList || 'TBD'}
Description: ${selected.description || 'None'}
Tasks assigned: ${selected.tasks.length}`

    await streamClaude({
      system,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
      onText: (_, full) => setStreamingText(full),
      onDone: (full) => {
        setStreaming(false)
        setStreamingText('')
        const idx = full.indexOf(FUND_MARKER)
        const coordContent = idx >= 0 ? full.slice(0, idx).trim() : full
        const familyContent = idx >= 0 ? full.slice(idx + FUND_MARKER.length).trim() : ''
        update(prev => ({
          ...prev,
          fundraisers: prev.fundraisers.map(f =>
            f.id === selectedId ? { ...f, coordContent, familyContent } : f
          ),
        }))
        toast('Plans generated!', 'success')
      },
      onError: (e) => {
        setStreaming(false)
        setStreamingText('')
        toast('Error: ' + e.message, 'error')
      },
    })
  }

  function renderMarkdown(text: string) {
    try {
      if (typeof window !== 'undefined' && (window as typeof window & { marked?: { parse: (s: string) => string } }).marked) {
        return (window as typeof window & { marked: { parse: (s: string) => string } }).marked.parse(text)
      }
    } catch { /* noop */ }
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
  }

  const pct = (raised: number, goal: number) => goal > 0 ? Math.min(100, Math.round(raised / goal * 100)) : 0

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
      <h1 style={{ color: 'var(--text)', fontSize: 22, marginBottom: 4 }}>Fundraising</h1>
      <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 18 }}>
        Track campaigns, contributions, and generate AI-powered coordinator + family plans
      </p>

      {/* Summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { num: '$' + totalRaised.toFixed(0), lbl: 'Total Raised', accent: true },
          { num: '$' + totalGoal.toFixed(0), lbl: 'Total Goal' },
          { num: activeCount, lbl: 'Active' },
          { num: fundraisers.length, lbl: 'All Time' },
        ].map(({ num, lbl, accent }) => (
          <div key={lbl} style={{
            background: accent ? 'linear-gradient(180deg, var(--bg2), rgba(192,57,43,.07))' : 'var(--bg2)',
            border: `1px solid ${accent ? 'var(--red)' : 'var(--border)'}`,
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: accent ? 'var(--red3)' : 'var(--text)', lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.6px', marginTop: 4 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {tabBtn('overview', 'Overview')}
        {tabBtn('add', '+ New')}
        {selected && tabBtn('detail', selected.name.slice(0, 20) + (selected.name.length > 20 ? '…' : ''))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fundraisers.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, padding: '40px 20px', background: 'var(--bg2)', border: '1px dashed var(--bg4)', borderRadius: 12 }}>
              No fundraisers yet. Click "+ New" to create one.
            </div>
          ) : (
            fundraisers.map(f => {
              const raised = fundraisedTotal(f)
              const p = pct(raised, f.goal)
              return (
                <div key={f.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{f.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                        {f.type} · {f.contributions.length} contributions · {f.tasks.filter(t => !t.done).length} open tasks
                      </div>
                    </div>
                    <span style={{
                      background: f.status === 'active' ? 'rgba(39,174,96,.15)' : f.status === 'complete' ? 'rgba(52,152,219,.15)' : 'var(--bg4)',
                      color: f.status === 'active' ? '#27ae60' : f.status === 'complete' ? '#3498db' : 'var(--text3)',
                      padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                    }}>
                      {f.status}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => { setSelectedId(f.id); setTab('detail') }}
                        style={{ background: 'var(--bg4)', border: 'none', color: 'var(--text)', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
                      >
                        Manage →
                      </button>
                      <button
                        onClick={() => deleteFundraiser(f.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 16, cursor: 'pointer', padding: '4px 6px' }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  {f.goal > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
                        <span>${raised.toFixed(0)} raised</span>
                        <span>${f.goal.toFixed(0)} goal ({p}%)</span>
                      </div>
                      <div style={{ background: 'var(--bg4)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                        <div style={{ background: p >= 100 ? '#27ae60' : 'var(--red)', height: '100%', width: p + '%', borderRadius: 4, transition: 'width .4s' }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Add form */}
      {tab === 'add' && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { label: 'Fundraiser Name *', key: 'name', placeholder: 'Spring Equipment Fund' },
            { label: 'Coordinator', key: 'coordinator', placeholder: 'Your name' },
            { label: 'Goal ($)', key: 'goal', placeholder: '2000' },
            { label: 'Per-Player Goal ($)', key: 'perPlayerGoal', placeholder: '200' },
            { label: 'Start Date', key: 'startDate', type: 'date' },
            { label: 'End Date', key: 'endDate', type: 'date' },
            { label: 'Location', key: 'location', placeholder: 'Where it happens (if applicable)' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>{label}</label>
              <input
                type={type || 'text'}
                placeholder={placeholder}
                value={(form as Record<string, string>)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Type</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            >
              {['general', 'bake-sale', 'car-wash', 'auction', 'raffle', 'crowdfunding', 'other'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea
              placeholder="What is this fundraiser for?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button onClick={createFundraiser} style={{ background: 'var(--red)', color: '#fff', padding: '9px 22px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              Create Fundraiser
            </button>
          </div>
        </div>
      )}

      {/* Detail */}
      {tab === 'detail' && selected && (() => {
        const raised = fundraisedTotal(selected)
        const p = pct(raised, selected.goal)
        return (
          <div>
            {/* Header */}
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>{selected.name}</h2>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>
                    {selected.type} · {selected.coordinator ? 'Coordinator: ' + selected.coordinator : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    value={selected.status}
                    onChange={e => updateStatus(selected.id, e.target.value as Fundraiser['status'])}
                    style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '6px 10px', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="complete">Complete</option>
                  </select>
                  <button
                    onClick={generatePlans}
                    disabled={streaming}
                    style={{
                      background: streaming ? 'var(--bg4)' : 'var(--red)', color: '#fff',
                      padding: '8px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                      border: 'none', cursor: streaming ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {streaming ? '⏳ Generating...' : '✨ Generate Plans'}
                  </button>
                </div>
              </div>
              {selected.goal > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text)', marginBottom: 6 }}>
                    <span>${raised.toFixed(2)} raised</span>
                    <span style={{ color: 'var(--text2)' }}>${selected.goal.toFixed(0)} goal · {p}%</span>
                  </div>
                  <div style={{ background: 'var(--bg4)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                    <div style={{ background: p >= 100 ? '#27ae60' : 'var(--red)', height: '100%', width: p + '%', borderRadius: 6, transition: 'width .5s' }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {/* Contributions */}
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text)' }}>Contributions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder="Donor name"
                    value={contribForm.donor}
                    onChange={e => setContribForm(f => ({ ...f, donor: e.target.value }))}
                    style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '7px 10px', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={contribForm.amount}
                    onChange={e => setContribForm(f => ({ ...f, amount: e.target.value }))}
                    style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '7px 10px', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  />
                  <select
                    value={contribForm.method}
                    onChange={e => setContribForm(f => ({ ...f, method: e.target.value }))}
                    style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '7px 10px', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  >
                    {['cash', 'venmo', 'zelle', 'check', 'card', 'other'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={contribForm.playerId}
                    onChange={e => setContribForm(f => ({ ...f, playerId: e.target.value }))}
                    style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '7px 10px', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  >
                    <option value="">No player</option>
                    {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <button onClick={addContribution} style={{ background: 'var(--red)', color: '#fff', padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', marginBottom: 12 }}>
                  Record
                </button>
                <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {selected.contributions.length === 0 ? (
                    <div style={{ color: 'var(--text3)', fontSize: 12 }}>No contributions yet.</div>
                  ) : (
                    selected.contributions.map(c => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', borderRadius: 6, padding: '6px 10px', fontSize: 12 }}>
                        <span style={{ color: 'var(--text)' }}>{c.donor}</span>
                        <span style={{ color: '#27ae60', fontWeight: 600 }}>${c.amount.toFixed(2)}</span>
                        <span style={{ color: 'var(--text3)' }}>{c.method}</span>
                        <button onClick={() => deleteContrib(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 13, padding: '0 4px' }}>×</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Tasks */}
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text)' }}>Tasks</h3>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input
                    type="text"
                    placeholder="Task..."
                    value={taskForm.title}
                    onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                    style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '7px 10px', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  />
                  <button onClick={addTask} style={{ background: 'var(--red)', color: '#fff', padding: '7px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>+</button>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder="Assignee"
                    value={taskForm.assignee}
                    onChange={e => setTaskForm(f => ({ ...f, assignee: e.target.value }))}
                    style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '7px 10px', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  />
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                    style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '7px 8px', borderRadius: 6, fontSize: 12, outline: 'none' }}
                  />
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {selected.tasks.length === 0 ? (
                    <div style={{ color: 'var(--text3)', fontSize: 12 }}>No tasks yet.</div>
                  ) : (
                    selected.tasks.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', borderRadius: 6, padding: '6px 10px' }}>
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggleTask(t.id)}
                          style={{ cursor: 'pointer', accentColor: 'var(--red)' }}
                        />
                        <span style={{ flex: 1, fontSize: 12, color: t.done ? 'var(--text3)' : 'var(--text)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
                        {t.assignee && <span style={{ fontSize: 11, color: 'var(--text3)' }}>{t.assignee}</span>}
                        {t.dueDate && <span style={{ fontSize: 11, color: 'var(--text3)' }}>{t.dueDate}</span>}
                        <button onClick={() => deleteTask(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 13, padding: '0 2px' }}>×</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* AI Plans */}
            {(streaming || selected.coordContent || selected.familyContent) && (
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 15, color: 'var(--text)' }}>Fundraising Plans</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[{ v: 'coord', label: 'Coordinator' }, { v: 'family', label: 'Family' }].map(({ v, label }) => (
                      <button
                        key={v}
                        onClick={() => setViewMode(v as 'coord' | 'family')}
                        style={{
                          padding: '5px 12px', borderRadius: 6, fontSize: 12, border: 'none', cursor: 'pointer',
                          background: viewMode === v ? 'var(--red)' : 'var(--bg4)',
                          color: viewMode === v ? '#fff' : 'var(--text2)',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="output">
                  {streaming ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) + '<span class="cursor"></span>' }} />
                  ) : viewMode === 'coord' ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.coordContent) }} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.familyContent) }} />
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
