import { Header } from '@/components/layout/header'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Users, Dumbbell, Trophy, DollarSign, TrendingUp, Calendar, Bell, Star } from 'lucide-react'

const stats = [
  { title: 'Active Teams', value: '8', change: '+2 this season', changeType: 'positive' as const, icon: Users, iconColor: 'bg-blue-500' },
  { title: 'Total Players', value: '142', change: '+14 from last season', changeType: 'positive' as const, icon: Users, iconColor: 'bg-green-500' },
  { title: 'Practices This Month', value: '24', change: 'On track', changeType: 'neutral' as const, icon: Dumbbell, iconColor: 'bg-purple-500' },
  { title: 'Tournament Wins', value: '6', change: '75% win rate', changeType: 'positive' as const, icon: Trophy, iconColor: 'bg-yellow-500' },
  { title: 'Funds Raised', value: '$48,250', change: '+$8,100 this month', changeType: 'positive' as const, icon: DollarSign, iconColor: 'bg-accent' },
  { title: 'Scout Reports', value: '31', change: '12 pending review', changeType: 'neutral' as const, icon: TrendingUp, iconColor: 'bg-indigo-500' },
]

const recentActivity = [
  { type: 'practice', text: 'U16 Girls practice completed — 18 attendees', time: '2h ago', icon: Dumbbell },
  { type: 'game', text: 'U14 Boys won 3-1 vs Eastside FC', time: '1d ago', icon: Trophy },
  { type: 'donation', text: 'New donation: $500 from Mike Johnson', time: '2d ago', icon: DollarSign },
  { type: 'player', text: 'New tryout candidate added: Alex Rivera', time: '3d ago', icon: Star },
  { type: 'schedule', text: 'State Tournament registered — June 14-16', time: '4d ago', icon: Calendar },
]

const upcomingEvents = [
  { title: 'U16 Girls Practice', date: 'Today, 4:00 PM', type: 'practice', team: 'U16 Girls' },
  { title: 'U14 Boys vs Westfield', date: 'Sat, Jun 8', type: 'game', team: 'U14 Boys' },
  { title: 'Spring Tournament', date: 'Jun 14–16', type: 'tournament', team: 'Multiple' },
  { title: 'Team Fundraiser Deadline', date: 'Jun 20', type: 'fundraise', team: 'All Teams' },
]

const topPlayers = [
  { name: 'Sophia Martinez', team: 'U16 Girls', position: 'Forward', rating: 9.2 },
  { name: 'Liam Chen', team: 'U18 Boys', position: 'Midfielder', rating: 8.9 },
  { name: 'Aisha Patel', team: 'U16 Girls', position: 'Goalkeeper', rating: 8.7 },
  { name: 'Noah Williams', team: 'U14 Boys', position: 'Defender', rating: 8.5 },
]

export default function DashboardPage() {
  return (
    <div>
      <Header title="Organization Dashboard" subtitle="Riverside Soccer Club — Season 2025" />
      <div className="p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((s) => (
            <StatCard key={s.title} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Upcoming Events */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Events</CardTitle>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((ev) => (
                  <div key={ev.title} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                    <div className={`mt-0.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                      ev.type === 'practice' ? 'bg-blue-500' :
                      ev.type === 'game' ? 'bg-green-500' :
                      ev.type === 'tournament' ? 'bg-yellow-500' : 'bg-accent'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ev.title}</p>
                      <p className="text-xs text-gray-500">{ev.date}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{ev.team}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((a) => {
                  const Icon = a.icon
                  return (
                    <div key={a.text} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">{a.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Players */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Performers</CardTitle>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPlayers.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="w-5 text-sm font-bold text-gray-400">#{i + 1}</span>
                    <Avatar name={p.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.team} · {p.position}</p>
                    </div>
                    <div className="text-sm font-bold text-primary">{p.rating}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product cards */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Modules</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'RallyIQ Coach', desc: 'Practice plans, player notes, development tracking', color: 'from-blue-500 to-blue-600', href: '/dashboard/coach', stat: '8 practices this week' },
              { name: 'RallyIQ Teams', desc: 'Roster management, schedules, tournaments', color: 'from-green-500 to-green-600', href: '/dashboard/teams', stat: '8 active teams' },
              { name: 'RallyIQ Profiles', desc: 'Athlete pages, video reels, recruiting snapshots', color: 'from-purple-500 to-purple-600', href: '/dashboard/profiles', stat: '142 athlete profiles' },
              { name: 'RallyIQ Fundraise', desc: 'Campaigns, sponsors, donor management', color: 'from-yellow-500 to-orange-500', href: '/dashboard/fundraise', stat: '$48,250 raised' },
              { name: 'RallyIQ Scout', desc: 'Competitor monitoring, tryout pipeline', color: 'from-red-500 to-red-600', href: '/dashboard/scout', stat: '31 scout reports' },
              { name: 'RallyIQ Org', desc: 'Multi-team dashboard, financial reports', color: 'from-indigo-500 to-indigo-600', href: '/dashboard/org', stat: '3 org reports' },
              { name: 'RallyIQ Integrations', desc: 'Band, GameChanger, social media, video AI', color: 'from-orange-500 to-orange-600', href: '/dashboard/integrations', stat: '5 connected' },
            ].map((mod) => (
              <a
                key={mod.name}
                href={mod.href}
                className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className={`h-2 bg-gradient-to-r ${mod.color}`} />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{mod.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{mod.desc}</p>
                  <p className="mt-3 text-xs font-medium text-gray-400">{mod.stat}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
