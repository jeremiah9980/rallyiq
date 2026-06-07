'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ToastProvider } from '@/components/ui/Toast'
import { ThemeProvider } from '@/lib/theme'
import { ApiKeyModal } from '@/components/ui/ApiKeyModal'
import { SettingsModal } from '@/components/ui/SettingsModal'
import { useStore } from '@/lib/store'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { store, update } = useStore()
  const [showKey, setShowKey] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      <Sidebar teamName={store.settings.teamName} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header
          store={store}
          onOpenKey={() => setShowKey(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
        <main style={{ flex: 1, overflowY: 'auto', padding: 20, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {showKey && (
        <ApiKeyModal
          store={store}
          onUpdate={update}
          onClose={() => setShowKey(false)}
        />
      )}
      {showSettings && (
        <SettingsModal
          store={store}
          onUpdate={update}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DashboardContent>{children}</DashboardContent>
      </ToastProvider>
    </ThemeProvider>
  )
}
