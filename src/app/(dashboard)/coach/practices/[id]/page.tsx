import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Clock, MapPin, Users, Star, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const practiceData = {
  id: 'p1',
  title: 'Passing & Possession Drill',
  team: 'U16 Girls',
  date: 'June 5, 2025',
  duration: 90,
  location: 'Field A',
  objectives: 'Improve first touch and ball control. Maintain possession under defensive pressure. Work on triangles and combination play.',
  notes: 'Great energy from the team. Sophia showed exceptional movement off the ball. Need to revisit Emma\'s positioning during the rondo.',
  rating: 4,
  status: 'completed',
  drills: [
    { name: 'Warm-up Rondo', duration: 15, focus: 'Passing, movement' },
    { name: '4v2 Possession', duration: 20, focus: 'Decision making, pressure' },
    { name: 'Transition Drill', duration: 25, focus: 'Quick transitions, spacing' },
    { name: 'Small-sided Game', duration: 20, focus: 'Applying concepts' },
    { name: 'Cooldown & Stretch', duration: 10, focus: 'Recovery' },
  ],
  attendance: [
    { name: 'Sophia Martinez', present: true },
    { name: 'Emma Davis', present: true },
    { name: 'Aisha Patel', present: true },
    { name: 'Mia Johnson', present: false },
    { name: 'Chloe Brown', present: true },
    { name: 'Lily Wilson', present: true },
    { name: 'Grace Lee', present: true },
    { name: 'Zoe Garcia', present: false },
  ],
}

export default function PracticeDetailPage() {
  return (
    <div>
      <Header title={practiceData.title} subtitle={`${practiceData.team} · ${practiceData.date}`} />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/coach/practices">
            <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          </Link>
          <Badge variant="success">{practiceData.status}</Badge>
          <Badge variant="outline">{practiceData.team}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm"><Clock className="h-4 w-4" />Duration</div>
            <p className="mt-1 text-2xl font-bold text-gray-900">{practiceData.duration} min</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm"><MapPin className="h-4 w-4" />Location</div>
            <p className="mt-1 text-2xl font-bold text-gray-900">{practiceData.location}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm"><Users className="h-4 w-4" />Attendance</div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {practiceData.attendance.filter((a) => a.present).length}/{practiceData.attendance.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm"><Star className="h-4 w-4" />Rating</div>
            <div className="mt-1 flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < practiceData.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Session Plan</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {practiceData.drills.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{d.name}</p>
                      <p className="text-xs text-gray-500">{d.focus}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{d.duration}m</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Objectives</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">{practiceData.objectives}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Coach Notes</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">{practiceData.notes}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Attendance</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {practiceData.attendance.map((a) => (
                <div key={a.name} className={`flex items-center gap-2 rounded-lg p-2 ${a.present ? 'bg-green-50' : 'bg-red-50'}`}>
                  {a.present
                    ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />}
                  <span className="text-sm text-gray-700 truncate">{a.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
