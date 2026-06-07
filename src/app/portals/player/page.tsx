import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Calendar, Video, TrendingUp, Star, Zap, Bell } from 'lucide-react'

export default function PlayerPortalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">RallyIQ</span>
          <Badge variant="success" className="ml-2">Player Portal</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400"><Bell className="h-5 w-5" /></Button>
          <Avatar name="Sophia Martinez" size="sm" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="rounded-xl gradient-primary p-6 text-white">
          <div className="flex items-center gap-4">
            <Avatar name="Sophia Martinez" size="xl" />
            <div>
              <p className="text-primary-200 text-sm">Player Dashboard</p>
              <h1 className="text-2xl font-bold">Sophia Martinez</h1>
              <p className="text-primary-200">Forward · #10 · U16 Girls Varsity</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
                <span className="font-bold">9.2</span>
                <span className="text-primary-200 text-sm ml-1">Player Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Goals', value: '18' },
            { label: 'Assists', value: '9' },
            { label: 'Games', value: '22' },
            { label: 'GPA', value: '3.6' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-white p-4 text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-500" />My Schedule</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {[
                  { title: 'Practice - Field A', date: 'Today, 4:00 PM', type: 'practice' },
                  { title: 'Game vs Westfield', date: 'Sat Jun 8', type: 'game' },
                  { title: 'Spring Tournament', date: 'Jun 14-16', type: 'tournament' },
                ].map((ev) => (
                  <div key={ev.title} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                    <div className={`h-2 w-2 rounded-full ${ev.type === 'game' ? 'bg-green-500' : ev.type === 'tournament' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{ev.title}</span>
                      <p className="text-xs text-gray-500">{ev.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" />Development</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-xs font-semibold text-green-600 uppercase mb-1">Coach Note</p>
                  <p className="text-sm text-gray-700">&quot;Excellent footwork improvement. Ready for tournament starter role.&quot;</p>
                </div>
                <div className="space-y-2">
                  {[
                    { skill: 'First Touch', score: 90 },
                    { skill: 'Finishing', score: 78 },
                    { skill: 'Positioning', score: 85 },
                  ].map((s) => (
                    <div key={s.skill}>
                      <div className="flex justify-between text-sm mb-0.5">
                        <span className="text-gray-600">{s.skill}</span>
                        <span className="font-medium">{s.score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100">
                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Video className="h-5 w-5 text-purple-500" />My Highlights</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-video rounded-lg bg-gray-900 cursor-pointer group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                      <span className="text-white text-xl">▶</span>
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 text-xs text-gray-400">2:3{i}</div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">View All Highlights</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
