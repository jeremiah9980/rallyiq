import { Header } from '@/components/layout/header'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dumbbell, FileText, Star, Clock, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const recentPractices = [
  { id: 1, title: 'Passing & Possession Drill', team: 'U16 Girls', date: 'Jun 5', duration: 90, attendees: 18, rating: 4 },
  { id: 2, title: 'Defensive Shape Work', team: 'U14 Boys', date: 'Jun 4', duration: 75, attendees: 14, rating: 5 },
  { id: 3, title: 'Set Pieces & Corners', team: 'U18 Boys', date: 'Jun 3', duration: 60, attendees: 20, rating: 4 },
]

const recentNotes = [
  { player: 'Sophia Martinez', content: 'Excellent footwork improvement. Ready for tournament starter role.', category: 'technical', date: 'Jun 5' },
  { player: 'Liam Chen', content: 'Needs work on defensive positioning. Schedule 1-on-1 session.', category: 'tactical', date: 'Jun 4' },
  { player: 'Emma Davis', content: 'Mental toughness under pressure showing great signs. Keep encouraging.', category: 'mental', date: 'Jun 3' },
]

export default function CoachPage() {
  return (
    <div>
      <Header title="RallyIQ Coach" subtitle="Your coaching dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Practices This Month" value="12" change="3 this week" changeType="positive" icon={Dumbbell} iconColor="bg-blue-500" />
          <StatCard title="Player Notes" value="47" change="+8 this week" changeType="positive" icon={FileText} iconColor="bg-purple-500" />
          <StatCard title="Dev Summaries" value="18" change="Q2 complete" changeType="neutral" icon={Star} iconColor="bg-yellow-500" />
          <StatCard title="Avg Practice Duration" value="78 min" change="On target" changeType="neutral" icon={Clock} iconColor="bg-green-500" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Practices</CardTitle>
                <Link href="/dashboard/coach/practices">
                  <Button variant="ghost" size="sm">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPractices.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                      <Dumbbell className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                      <p className="text-xs text-gray-500">{p.team} · {p.date} · {p.duration}min · {p.attendees} players</p>
                    </div>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: p.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/coach/practices">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  New Practice Plan
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Player Notes</CardTitle>
                <Link href="/dashboard/coach/notes">
                  <Button variant="ghost" size="sm">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotes.map((n) => (
                  <div key={n.player} className="rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name={n.player} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{n.player}</p>
                        <p className="text-xs text-gray-400">{n.date}</p>
                      </div>
                      <Badge variant={n.category === 'technical' ? 'default' : n.category === 'mental' ? 'info' : 'warning'}>
                        {n.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{n.content}</p>
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
