import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Plus, Trophy, Dumbbell, Star } from 'lucide-react'

const schedule = [
  { id: 1, type: 'game', title: 'vs. Eastside FC', date: 'Jun 1, 2025', time: '2:00 PM', location: 'Home - Field A', result: 'W 3-1', status: 'completed' },
  { id: 2, type: 'practice', title: 'Passing & Possession Drill', date: 'Jun 3, 2025', time: '4:00 PM', location: 'Field A', result: null, status: 'completed' },
  { id: 3, type: 'game', title: 'vs. Northside SC', date: 'Jun 5, 2025', time: '11:00 AM', location: 'Away - Northside Complex', result: 'W 2-0', status: 'completed' },
  { id: 4, type: 'practice', title: 'Set Pieces & Corners', date: 'Jun 6, 2025', time: '4:30 PM', location: 'Field B', result: null, status: 'completed' },
  { id: 5, type: 'game', title: 'vs. Westfield FC', date: 'Jun 8, 2025', time: '1:00 PM', location: 'Home - Field A', result: null, status: 'upcoming' },
  { id: 6, type: 'practice', title: 'Attacking Transitions', date: 'Jun 10, 2025', time: '4:00 PM', location: 'Field A', result: null, status: 'upcoming' },
  { id: 7, type: 'tournament', title: 'Spring Invitational', date: 'Jun 14, 2025', time: 'All Day', location: 'Regional Sports Complex', result: null, status: 'upcoming' },
]

const typeConfig = {
  game: { icon: Star, color: 'bg-green-100 text-green-600', label: 'Game' },
  practice: { icon: Dumbbell, color: 'bg-blue-100 text-blue-600', label: 'Practice' },
  tournament: { icon: Trophy, color: 'bg-yellow-100 text-yellow-600', label: 'Tournament' },
}

export default function SchedulePage() {
  const upcoming = schedule.filter((s) => s.status === 'upcoming')
  const completed = schedule.filter((s) => s.status === 'completed')

  return (
    <div>
      <Header title="Team Schedule" subtitle="U16 Girls Varsity" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm">
            <span><span className="font-bold text-gray-900">{upcoming.length}</span> <span className="text-gray-500">upcoming</span></span>
            <span><span className="font-bold text-gray-900">{completed.length}</span> <span className="text-gray-500">completed</span></span>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />Add Event</Button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming</h2>
            <div className="space-y-3">
              {upcoming.map((ev) => {
                const config = typeConfig[ev.type as keyof typeof typeConfig]
                const Icon = config.icon
                return (
                  <Card key={ev.id} className="border-l-4 border-l-primary hover:shadow-card-hover transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.color} flex-shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{ev.title}</h3>
                            <Badge variant="info">{config.label}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{ev.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{ev.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{ev.location}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Completed</h2>
            <div className="space-y-3">
              {completed.map((ev) => {
                const config = typeConfig[ev.type as keyof typeof typeConfig]
                const Icon = config.icon
                return (
                  <Card key={ev.id} className="opacity-75">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400 flex-shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-gray-700">{ev.title}</h3>
                            {ev.result && (
                              <Badge variant={ev.result.startsWith('W') ? 'success' : ev.result.startsWith('L') ? 'danger' : 'warning'}>
                                {ev.result}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{ev.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{ev.location}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
