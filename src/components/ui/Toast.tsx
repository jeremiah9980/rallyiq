'use client'

import { createContext, useContext, useCallback, useState, ReactNode } from 'react'

type ToastKind = 'success' | 'error' | 'warn'

interface ToastItem {
  id: number
  msg: string
  kind: ToastKind
}

interface ToastContextValue {
  toast: (msg: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

let counter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((msg: string, kind: ToastKind = 'success') => {
    const id = ++counter
    setToasts((prev) => [...prev, { id, msg, kind }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div id="toast-root">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.kind === 'error' ? 'error' : t.kind === 'warn' ? 'warn' : ''}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
