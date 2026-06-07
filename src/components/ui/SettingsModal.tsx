'use client'

import { useState, useRef } from 'react'
import { Store, saveStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

interface Props {
  store: Store
  onUpdate: (updater: (prev: Store) => Store) => void
  onClose: () => void
}

export function SettingsModal({ store, onUpdate, onClose }: Props) {
  const [teamName, setTeamName] = useState(store.settings.teamName)
  const [defaultAge, setDefaultAge] = useState(store.settings.defaultAge)
  const [season, setSeason] = useState(store.settings.season)
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  function save() {
    onUpdate((prev) => ({
      ...prev,
      settings: {
        teamName: teamName.trim() || 'My Team',
        defaultAge,
        season: season.trim(),
      },
    }))
    toast('Settings saved')
    onClose()
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'rallyiq-' + new Date().toISOString().slice(0, 10) + '.json'
    a.click()
    toast('Exported')
  }

  function importData(file: File | null) {
    if (!file) return
    const r = new FileReader()
    r.onload = () => {
      try {
        const d = JSON.parse(r.result as string)
        if (!d.players || !d.games) throw new Error('Invalid file')
        onUpdate((prev) => ({ ...prev, ...d }))
        toast('Imported successfully')
        onClose()
      } catch (e: unknown) {
        toast('Import failed: ' + (e instanceof Error ? e.message : 'unknown'), 'error')
      }
    }
    r.readAsText(file)
  }

  function resetAll() {
    if (!confirm('Delete ALL data? This cannot be undone.')) return
    onUpdate((prev) => ({
      apiKey: prev.apiKey,
      rememberKey: prev.rememberKey,
      settings: { teamName: 'My Team', defaultAge: '10U', season: 'Spring 2026' },
      players: [],
      games: [],
      plans: [],
      research: [],
      threads: [],
      activeThreadId: null,
      tournaments: [],
      fundraisers: [],
    }))
    toast('All data reset', 'warn')
    onClose()
  }

  return (
    <div className="modal-bg" style={{ animation: 'fadeIn .15s' }}>
      <div className="modal">
        <h2>Settings</h2>
        <p className="modal-text">Team info, defaults, and data management.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label>Team name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="My Team"
              style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14, width: '100%', outline: 'none' }}
            />
          </div>
          <div>
            <label>Default age group</label>
            <select
              value={defaultAge}
              onChange={(e) => setDefaultAge(e.target.value)}
              style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14, width: '100%', outline: 'none' }}
            >
              {['8U','10U','12U','14U','16U','18U'].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Season label</label>
          <input
            type="text"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="Spring 2026"
            style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14, width: '100%', outline: 'none' }}
          />
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--bg4)', marginBottom: 18 }} />
        <h3 style={{ marginBottom: 8, fontSize: 15 }}>Data</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={exportData}
            style={{ background: 'transparent', border: '1px solid var(--bg4)', color: 'var(--text2)', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
          >
            ↓ Export JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ background: 'transparent', border: '1px solid var(--bg4)', color: 'var(--text2)', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
          >
            ↑ Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => importData(e.target.files?.[0] ?? null)}
          />
          <button
            onClick={resetAll}
            style={{ background: 'var(--bg3)', border: '1px solid var(--red)', color: 'var(--red3)', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}
          >
            🗑 Reset all data
          </button>
        </div>
        <div className="modal-actions">
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '10px 18px', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{ background: 'var(--red)', color: '#fff', padding: '10px 18px', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
