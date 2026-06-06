import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Star, GraduationCap, Video, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'

const athletes = [
  { id: 'p1', name: 'Sophia Martinez', team: 'U16 Girls', position: 'Forward', grade: '11', gpa: 3.6, rating: 9.2, gradYear: 2026, highlights: 4, recruiting: 3, achievements: ['Top Scorer', 'MVP Spring 2025'] },
  { id: 'p2', name: 'Liam Chen', team: 'U18 Boys', position: 'Midfielder', grade: '12', gpa: 3.9, rating: 8.9, gradYear: 2025, highlights: 7, recruiting: 5, achievements: ['Captain', 'Academic All-State'] },
  { id: 'p3', name: 'Aisha Patel', team: 'U16 Girls', position: 'Goalkeeper', grade: '10', gpa: 3.8, rating: 8.7, gradYear: 2027, highlights: 3, recruiting: 1, achievements: ['Golden Glove'] },
  { id: 'p4', name: 'Noah Williams', team: 'U14 Boys', position: 'Defender', grade: '9', gpa: 3.5, rating: 8.5, gradYear: 2028, highlights: 2, recruiting: 0, achievements: ['Best Defender'] },
  { id: 'p5', name: 'Emma Davis', team: 'U16 Girls', position: 'Midfielder', grade: '11', gpa: 3.9, rating: 8.2, gradYear: 2026, highlights: 2, recruiting: 2, achievements: ['Academic Athlete'] },
  { id: 'p6', name: 'Mia Johnson', team: 'U16 Girls', position: 'Defender', grade: '12', gpa: 3.4, rating: 7.9, gradYear: 2025, highlights: 1, recruiting: 1, achievements: [] },
]

export default function ProfilesPage() {
  return (
    <div>
      <Header title="RallyIQ Profiles" subtitle="Athlete profiles, highlights, and recruiting" />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input className="flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm focus:border-primary focus:outline-none" placeholder="Search athletes..." />
          </div>
          <select className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-none">
            <option>All Teams</option>
            <option>U16 Girls</option>
            <option>U18 Boys</option>
            <option>U14 Boys</option>
          </select>
          <select className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-none">
            <option>All Positions</option>
            <option>Forward</option>
            <option>Midfielder</option>
            <option>Defender</option>
            <option>Goalkeeper</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {athletes.map((a) => (
            <Card key={a.id} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar name={a.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{a.name}</h3>
                    <p className="text-sm text-gray-500">{a.position} · {a.team}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                      <span className="text-sm font-bold text-primary">{a.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Grade {a.grade}</Badge>
                    <p className="text-xs text-gray-400 mt-1">Class of {a.gradYear}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center text-sm">
                  <div className="rounded-lg bg-gray-50 p-2">
                    <div className="font-bold text-gray-900">{a.gpa}</div>
                    <div className="text-xs text-gray-500">GPA</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2">
                    <div className="font-bold text-blue-600">{a.highlights}</div>
                    <div className="text-xs text-gray-500">Videos</div>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-2">
                    <div className="font-bold text-purple-600">{a.recruiting}</div>
                    <div className="text-xs text-gray-500">Schools</div>
                  </div>
                </div>

                {a.achievements.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {a.achievements.map((ach) => (
                      <Badge key={ach} variant="warning" className="text-xs">{ach}</Badge>
                    ))}
                  </div>
                )}

                <Link href={`/dashboard/profiles/${a.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
