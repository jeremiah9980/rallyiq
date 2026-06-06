'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plug, Check, RefreshCw, Settings, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const integrations = [
  { id: 'gamechanger', name: 'GameChanger', description: 'Sync scores, stats, and game results automatically', status: 'connected', lastSync: '5 min ago', logo: '🏆', href: '/dashboard/integrations/gamechanger' },
  { id: 'band', name: 'Band', description: 'Import team communications and announcements', status: 'connected', lastSync: '1 hour ago', logo: '📣', href: '/dashboard/integrations/band' },
  { id: 'ncs', name: 'National Club Soccer', description: 'NCS rankings, standings, and tournament brackets', status: 'connected', lastSync: '2 hours ago', logo: '⚽', href: '/dashboard/integrations/ncs' },
  { id: 'instagram', name: 'Instagram', description: 'Auto-post highlights and team updates', status: 'connected', lastSync: '30 min ago', logo: '📸', href: '/dashboard/integrations/social' },
  { id: 'twitter', name: 'Twitter/X', description: 'Share game results and announcements', status: 'disconnected', lastSync: null, logo: '🐦', href: '/dashboard/integrations/social' },
  { id: 'facebook', name: 'Facebook', description: 'Team page management and event posts', status: 'disconnected', lastSync: null, logo: '📘', href: '/dashboard/integrations/social' },
  { id: 'branding', name: 'Branding Templates', description: 'Manage team colors, fonts, and design assets', status: 'active', lastSync: null, logo: '🎨', href: '/dashboard/integrations/branding' },
  { id: 'video', name: 'Video Highlight AI', description: 'Auto-download and edit game footage with AI', status: 'active', lastSync: '1 day ago', logo: '🎬', href: '/dashboard/integrations/video-highlights' },
]

export default function IntegrationsPage() {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.status]))
  )

  function toggle(id: string) {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'disconnected' ? 'connected' : 'disconnected',
    }))
  }

  const connected = Object.values(statuses).filter((s) => s !== 'disconnected').length

  return (
    <div>
      <Header title="RallyIQ Integrations" subtitle={`${connected} of ${integrations.length} connected`} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 max-w-xs">
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <div className="text-3xl font-bold text-primary">{connected}</div>
            <div className="text-sm text-gray-500">Connected</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <div className="text-3xl font-bold text-gray-400">{integrations.length - connected}</div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integ) => {
            const status = statuses[integ.id]
            const isOn = status !== 'disconnected'
            return (
              <Card key={integ.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl flex-shrink-0">
                      {integ.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{integ.name}</h3>
                        <Badge variant={isOn ? 'success' : 'outline'} className="text-xs">
                          {isOn ? status : 'off'}
                        </Badge>
                      </div>
                      {integ.lastSync && isOn && (
                        <p className="text-xs text-gray-400 mt-0.5">Synced {integ.lastSync}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{integ.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant={isOn ? 'outline' : 'default'}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggle(integ.id)}
                    >
                      {isOn ? 'Disconnect' : 'Connect'}
                    </Button>
                    {isOn && (
                      <Link href={integ.href}>
                        <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
