import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Upload, Video, Clock, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const videos = [
  { id: 'v1', title: 'Spring Tournament Goals Compilation', duration: '3:24', views: 847, tags: ['goals', 'tournament'], date: 'Jun 5, 2025', thumbnail: null },
  { id: 'v2', title: 'Dribbling Skills Showcase', duration: '2:15', views: 312, tags: ['technical', 'dribbling'], date: 'May 28, 2025', thumbnail: null },
  { id: 'v3', title: 'Season Highlights 2025', duration: '5:47', views: 1243, tags: ['highlights', 'season'], date: 'May 20, 2025', thumbnail: null },
  { id: 'v4', title: 'Recruiting Reel - Class of 2026', duration: '4:02', views: 2156, tags: ['recruiting', 'highlights'], date: 'May 10, 2025', thumbnail: null },
]

export default function VideosPage() {
  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/profiles/p1">
            <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          </Link>
          <Button className="ml-auto"><Upload className="h-4 w-4 mr-2" />Upload Video</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <Card key={v.id} className="overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer group">
              <div className="relative aspect-video bg-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <Play className="h-7 w-7 text-white fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white flex items-center gap-1">
                  <Clock className="h-3 w-3" />{v.duration}
                </div>
                <div className="absolute top-2 right-2 flex flex-wrap gap-1">
                  {v.tags.slice(0, 1).map((t) => (
                    <Badge key={t} className="text-xs bg-black/60 text-white border-0">{t}</Badge>
                  ))}
                </div>
              </div>
              <CardContent className="pt-3 pb-4">
                <h3 className="font-semibold text-gray-900 text-sm">{v.title}</h3>
                <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{v.views.toLocaleString()} views</span>
                  <span>{v.date}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {v.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
