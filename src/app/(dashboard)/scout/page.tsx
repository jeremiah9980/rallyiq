import { Header } from '@/components/layout/header'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Binoculars, Users, FileText, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const recentReports = [
  { id: 'r1', subject: 'Eastside FC Scouting Report', priority: 'high', tags: ['opponent', 'tournament'], date: 'Jun 4' },
  { id: 'r2', subject: 'Valley SC Formation Analysis', priority: 'medium', tags: ['opponent', 'tactics'], date: 'Jun 2' },
  { id: 'r3', subject: 'Ryan Thompson - Tryout Eval', priority: 'high', tags: ['tryout', 'forward'], date: 'Jun 1' },
]

const topCandidates = [
  { name: 'Alex Rivera', position: 'Forward', age: 15, rating: 9, status: 'invited' },
  { name: 'Jordan Kim', position: 'Midfielder', age: 14, rating: 8, status: 'pending' },
  { name: 'Casey Brown', position: 'Defender', age: 15, rating: 7, status: 'pending' },
]

export default function ScoutPage() {
  return (
    <div>
      <Header title="RallyIQ Scout" subtitle="Roster intelligence and competitor monitoring" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Scout Reports" value="31" change="5 this week" changeType="positive" icon={FileText} iconColor="bg-red-500" />
          <StatCard title="Competitors Tracked" value="14" change="2 new additions" changeType="neutral" icon={Binoculars} iconColor="bg-orange-500" />
          <StatCard title="Tryout Candidates" value="23" change="8 pending eval" changeType="neutral" icon={Users} iconColor="bg-blue-500" />
          <StatCard title="Accepted This Cycle" value="3" change="From 12 evaluated" changeType="positive" icon={TrendingUp} iconColor="bg-green-500" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Scout Reports</CardTitle>
                <Link href="/dashboard/scout/roster-intel">
                  <Button variant="ghost" size="sm">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                    <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${r.priority === 'high' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{r.subject}</p>
                      <div className="flex gap-1 mt-1">
                        {r.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Tryout Candidates</CardTitle>
                <Link href="/dashboard/scout/tryouts">
                  <Button variant="ghost" size="sm">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCandidates.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-lg bg-gray-50 p-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.position} · Age {c.age}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{c.rating}/10</div>
                      <Badge variant={c.status === 'invited' ? 'success' : 'outline'} className="text-xs">{c.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: 'Roster Intelligence', desc: 'Deep dives on your own player data', href: '/dashboard/scout/roster-intel', icon: FileText, color: 'text-red-500' },
            { title: 'Competitors', desc: 'Track opponent teams & tendencies', href: '/dashboard/scout/competitors', icon: Binoculars, color: 'text-orange-500' },
            { title: 'Tryout Pipeline', desc: 'Manage and evaluate candidates', href: '/dashboard/scout/tryouts', icon: Users, color: 'text-blue-500' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
                  <Icon className={`h-8 w-8 mb-3 ${item.color}`} />
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
