'use client'

import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Video, School, ArrowLeft, Share2, Download, Link2 } from 'lucide-react'
import Link from 'next/link'
import { useStore, calcStats, fmt } from '@/lib/store'

export default function ProfileDetailPage() {
  const { playerId } = useParams<{ playerId: string }>()
  const { store } = useStore()
  const { players, games } = store

  const player = players.find((p) => p.id === playerId)

  if (!player) {
    return (
      <div className="p-6">
        <Link href="/dashboard/profiles">
          <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        </Link>
        <p className="text-gray-500 mt-4">Player not found.</p>
      </div>
    )
  }

  const ss = calcStats(player.id, games)

  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/profiles">
            <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          </Link>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-2" />Share</Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
          </div>
        </div>

        {/* Hero */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6 flex-wrap">
              <Avatar name={player.name} size="xl" />
              <div className="flex-1 min-w-48">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
                  {player.jersey && <Badge variant="outline">#{player.jersey}</Badge>}
                  {player.gcId ? (
                    <Badge variant="success"><Link2 className="h-3.5 w-3.5 mr-1" />GameChanger Linked</Badge>
                  ) : (
                    <Badge variant="warning">Not linked to GameChanger</Badge>
                  )}
                </div>
                <p className="text-gray-500 mt-1">{player.pos || 'No position'}{player.grad ? ` · Class of ${player.grad}` : ''}</p>
                {player.notes && <p className="text-sm text-gray-600 mt-3 max-w-xl">{player.notes}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Bats', value: player.bats || '—' },
                  { label: 'Throws', value: player.throws || '—' },
                  { label: 'Games', value: ss.g },
                  { label: 'AVG', value: fmt(ss.avg) },
                  { label: 'OPS', value: fmt(ss.ops) },
                  { label: 'HR', value: ss.hr },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-gray-50 px-3 py-2 text-center">
                    <div className="font-bold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Stats */}
          <Card>
            <CardHeader><CardTitle>Season Stats</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {[
                  { label: 'AB', value: ss.ab },
                  { label: 'H', value: ss.h },
                  { label: 'AVG', value: fmt(ss.avg) },
                  { label: 'RBI', value: ss.rbi },
                  { label: 'R', value: ss.r },
                  { label: 'HR', value: ss.hr },
                  { label: 'BB', value: ss.bb },
                  { label: 'K', value: ss.k },
                  { label: 'SB', value: ss.sb },
                  { label: 'OBP', value: fmt(ss.obp) },
                  { label: 'SLG', value: fmt(ss.slg) },
                  { label: 'OPS', value: fmt(ss.ops) },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-gray-50 px-2 py-2 text-center">
                    <div className="font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
              {ss.g === 0 && (
                <p className="text-xs text-gray-400 mt-3">No games recorded yet — import stats from GameChanger or add a game manually.</p>
              )}
            </CardContent>
          </Card>

          {/* Videos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Video Highlights</CardTitle>
                <Link href={`/dashboard/profiles/${player.id}/videos`}>
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative aspect-video rounded-lg bg-gray-900 overflow-hidden cursor-pointer group">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute bottom-1 right-1 text-xs text-gray-400">2:3{i}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recruiting */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recruiting</CardTitle>
                <Link href={`/dashboard/profiles/${player.id}/recruiting`}>
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { school: 'Stanford University', div: 'D1', status: 'contacted' },
                  { school: 'UCLA', div: 'D1', status: 'interested' },
                  { school: 'UC Santa Barbara', div: 'D1', status: 'visited' },
                ].map((r) => (
                  <div key={r.school} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                    <School className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{r.school}</p>
                      <p className="text-xs text-gray-500">{r.div}</p>
                    </div>
                    <Badge variant={r.status === 'visited' ? 'success' : r.status === 'contacted' ? 'info' : 'outline'}>
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
