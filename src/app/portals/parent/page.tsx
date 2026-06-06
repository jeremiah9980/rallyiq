import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Calendar, MessageSquare, DollarSign, Bell, Zap } from 'lucide-react'

const upcomingEvents = [
  { title: 'Practice - Field A', date: 'Today, 4:00 PM', type: 'practice' },
  { title: 'Game vs Westfield FC', date: 'Sat Jun 8, 1:00 PM', type: 'game' },
  { title: 'Spring Tournament', date: 'Jun 14-16', type: 'tournament' },
]

const messages = [
  { from: 'Coach Rivera', subject: 'Tournament Registration', time: '2h ago', unread: true },
  { from: 'Team Admin', subject: 'Uniform Pickup Reminder', time: '1d ago', unread: false },
]

export default function ParentPortalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">RallyIQ</span>
          <Badge variant="info" className="ml-2">Parent Portal</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400"><Bell className="h-5 w-5" /></Button>
          <Avatar name="Karen Brown" size="sm" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Welcome */}
        <div className="rounded-xl bg-primary p-6 text-white">
          <p className="text-primary-200 text-sm">Welcome back</p>
          <h1 className="text-2xl font-bold">Karen Brown</h1>
          <p className="text-primary-200 mt-1">Parent of <strong className="text-white">Chloe Brown</strong> · U16 Girls Varsity</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Player card */}
          <Card>
            <CardHeader><CardTitle>Chloe Brown</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name="Chloe Brown" size="lg" />
                <div>
                  <p className="font-medium text-gray-900">Forward · #11</p>
                  <p className="text-sm text-gray-500">U16 Girls Varsity</p>
                  <Badge variant="success" className="mt-1">Active</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-center">
                <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold">3.4</div><div className="text-xs text-gray-500">GPA</div></div>
                <div className="rounded-lg bg-gray-50 p-2"><div className="font-bold">18</div><div className="text-xs text-gray-500">Games</div></div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-500" />Upcoming</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingEvents.map((ev) => (
                  <div key={ev.title} className="flex items-start gap-2 text-sm">
                    <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                      ev.type === 'game' ? 'bg-green-500' : ev.type === 'tournament' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{ev.title}</p>
                      <p className="text-xs text-gray-500">{ev.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-green-500" />Messages</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.subject} className={`rounded-lg p-2.5 cursor-pointer ${m.unread ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                    <p className="font-medium text-gray-900 text-sm">{m.from}</p>
                    <p className="text-sm text-gray-600 truncate">{m.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fundraise CTA */}
        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <DollarSign className="h-8 w-8 text-accent flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Spring Equipment Fund</h3>
                <p className="text-sm text-gray-500">75% funded · 14 days left · Goal: $15,000</p>
              </div>
              <Button variant="accent">Donate</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
