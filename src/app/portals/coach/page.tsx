import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Dumbbell, Users, FileText, Bell, Zap, Plus, Calendar } from 'lucide-react'

export default function CoachPortalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">RallyIQ</span>
          <Badge variant="warning" className="ml-2">Coach Portal</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400"><Bell className="h-5 w-5" /></Button>
          <Avatar name="Coach Rivera" size="sm" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-primary p-6 text-white">
          <p className="text-blue-200 text-sm">Good morning</p>
          <h1 className="text-2xl font-bold">Coach Rivera</h1>
          <p className="text-blue-200">Head Coach · U16 Girls Varsity & U18 Boys Premier</p>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="bg-white/10 rounded-lg px-3 py-1">Practice today at 4 PM</span>
            <span className="bg-white/10 rounded-lg px-3 py-1">Game Saturday</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'My Teams', value: '2', icon: Users },
            { label: 'Players', value: '40', icon: Users },
            { label: 'This Week', value: '3', icon: Calendar },
            { label: 'Notes Today', value: '5', icon: FileText },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="rounded-xl border bg-white p-4 text-center">
                <Icon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5 text-blue-500" />Today&apos;s Practice</CardTitle>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Plan</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="font-semibold text-gray-900">Attacking Transitions</p>
                <p className="text-sm text-gray-500 mt-1">U16 Girls · 4:00 PM · Field A · 90 min</p>
                <p className="text-sm text-gray-600 mt-2">Counter-attack drills, finishing runs, set piece work</p>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {['Warm-up Rondo (15m)', 'Counter Attack Drill (25m)', 'Small-sided Game (35m)', 'Cooldown (15m)'].map((drill) => (
                  <div key={drill} className="flex items-center gap-2 text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {drill}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-purple-500" />Quick Note</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <select className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm">
                  <option>Select player...</option>
                  <option>Sophia Martinez</option>
                  <option>Emma Davis</option>
                  <option>Aisha Patel</option>
                </select>
                <select className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm">
                  <option>Category: Technical</option>
                  <option>Category: Tactical</option>
                  <option>Category: Mental</option>
                  <option>Category: Physical</option>
                </select>
                <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" rows={4} placeholder="Add coaching note..." />
                <Button className="w-full">Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
