'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative flex h-full w-64">
            <Sidebar />
            <button
              className="absolute right-2 top-2 rounded-lg p-1 text-gray-400"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={cn('flex flex-1 flex-col overflow-hidden')}>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
