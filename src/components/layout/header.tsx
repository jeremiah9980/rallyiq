'use client'

import { useTheme } from '@/lib/theme'
import { Store } from '@/lib/store'

interface Props {
  store: Store
  onOpenKey: () => void
  onOpenSettings: () => void
}

export function Header({ store, onOpenKey, onOpenSettings }: Props) {
  const { theme, toggleTheme } = useTheme()
  const { teamName, season } = store.settings
  const teamLabel = teamName + (season ? ' · ' + season : '')
  const hasKey = !!store.apiKey

  return (
    <header
      style={{
        background: 'var(--bg2)',
        borderBottom: '3px solid var(--red)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '-0.3px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text)',
        }}
      >
        ⚡ Rally<span style={{ color: 'var(--red3)' }}>IQ</span>
      </div>

      <div
        style={{
          color: 'var(--text2)',
          fontSize: 13,
          paddingLeft: 12,
          borderLeft: '1px solid var(--bg4)',
          marginLeft: 4,
        }}
      >
        {teamLabel || 'Setting up…'}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            background: 'transparent',
            border: '1px solid var(--bg4)',
            color: 'var(--text2)',
            padding: '7px 12px',
            borderRadius: 6,
            fontSize: 14,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            transition: 'all .15s',
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button
          onClick={onOpenSettings}
          style={{
            background: 'transparent',
            border: '1px solid var(--bg4)',
            color: 'var(--text2)',
            padding: '7px 12px',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          ⚙️ Settings
        </button>

        <button
          onClick={onOpenKey}
          style={{
            background: 'transparent',
            border: hasKey ? '1px solid var(--green)' : '1px solid var(--bg4)',
            color: hasKey ? 'var(--green)' : 'var(--text2)',
            padding: '7px 12px',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {hasKey ? '✓ Key set' : '🔑 Set Key'}
        </button>
      </div>
    </header>
  )
}
