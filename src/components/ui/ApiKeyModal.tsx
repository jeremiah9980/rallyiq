'use client'

import { useState } from 'react'
import { Store, saveStore } from '@/lib/store'
import { useToast } from '@/components/ui/Toast'

interface Props {
  store: Store
  onUpdate: (updater: (prev: Store) => Store) => void
  onClose: () => void
}

export function ApiKeyModal({ store, onUpdate, onClose }: Props) {
  const [key, setKey] = useState(store.apiKey)
  const [remember, setRemember] = useState(store.rememberKey)
  const { toast } = useToast()

  function save() {
    if (!key.startsWith('sk-')) {
      toast("That doesn't look like an Anthropic key", 'error')
      return
    }
    onUpdate((prev) => ({ ...prev, apiKey: key, rememberKey: remember }))
    toast('API key saved')
    onClose()
  }

  return (
    <div className="modal-bg" style={{ animation: 'fadeIn .15s' }}>
      <div className="modal">
        <h2>Anthropic API key</h2>
        <p className="modal-text">
          Stored in your browser&apos;s localStorage. Never sent anywhere except api.anthropic.com.
          Get one at{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">
            console.anthropic.com
          </a>
          .
        </p>
        <div style={{ marginBottom: 12 }}>
          <label>API Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
            onKeyDown={(e) => e.key === 'Enter' && save()}
            style={{ background: 'var(--bg)', border: '1px solid var(--bg4)', color: 'var(--text)', padding: '9px 12px', borderRadius: 7, fontSize: 14, width: '100%', outline: 'none' }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', letterSpacing: 0, fontSize: 13, color: 'var(--text)', fontWeight: 400 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            style={{ width: 'auto' }}
          />
          Remember in this browser
        </label>
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
