import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Star, GraduationCap, Video, School, ArrowLeft, Share2, Download } from 'lucide-react'
import Link from 'next/link'

const athlete = {
  id: 'p1',
  name: 'Sophia Martinez',
  team: 'U16 Girls Varsity',
  position: 'Forward',
  number: '10',
  grade: '11',
  gpa: 3.6,
  graduationYear: 2026,
  height: "5'5\"",
  weight: '122 lbs',
  rating: 9.2,
  bio: 'Dynamic forward with exceptional speed and technical ability. Two-time team MVP with outstanding work rate and natural goal-scoring instinct.',
  achievements: ['Top Scorer Spring 2025', 'Team MVP 2x', 'Spring Invitational All-Tournament'],
  stats: { goals: 18, assists: 9, gamesPlayed: 22, shotsOnTarget: 48, passingAccuracy: 84 },
  videos: 4,
  recruitingSchools: 3,
  collegeInterest: 'Division I Soccer',
}

export default function ProfileDetailPage() {
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
              <Avatar name={athlete.name} size="xl" />
              <div className="flex-1 min-w-48">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-900">{athlete.name}</h2>
                  <Badge variant="outline">#{athlete.number}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-bold text-primary">{athlete.rating}</span>
                  </div>
                </div>
                <p className="text-gray-500 mt-1">{athlete.position} · {athlete.team}</p>
                <p className="text-sm text-gray-600 mt-3 max-w-xl">{athlete.bio}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {athlete.achievements.map((a) => (
                    <Badge key={a} variant="warning">{a}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Grade', value: athlete.grade },
                  { label: 'GPA', value: athlete.gpa },
                  { label: 'Class', value: athlete.graduationYear },
                  { label: 'Height', value: athlete.height },
                  { label: 'Weight', value: athlete.weight },
                  { label: 'Goals', value: athlete.stats.goals },
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
              <div className="space-y-3">
                {[
                  { label: 'Goals', value: athlete.stats.goals, max: 30 },
                  { label: 'Assists', value: athlete.stats.assists, max: 20 },
                  { label: 'Games Played', value: athlete.stats.gamesPlayed, max: 25 },
                  { label: 'Shots on Target', value: athlete.stats.shotsOnTarget, max: 80 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{s.label}</span>
                      <span className="font-bold text-gray-900">{s.value}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(s.value / s.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Videos */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Video Highlights</CardTitle>
                <Link href={`/dashboard/profiles/${athlete.id}/videos`}>
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
                <Link href={`/dashboard/profiles/${athlete.id}/recruiting`}>
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-1">College Interest</p>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-gray-800">{athlete.collegeInterest}</span>
                </div>
              </div>
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
