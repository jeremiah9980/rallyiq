import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, MessageSquare, ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

const bands = [
  { name: 'U16 Girls Varsity', members: 21, lastPost: '2 hours ago', posts: 47 },
  { name: 'U14 Boys Elite', members: 18, lastPost: '1 day ago', posts: 32 },
  { name: 'U18 Boys Premier', members: 25, lastPost: '3 hours ago', posts: 58 },
]

const recentPosts = [
  { author: 'Coach Rivera', content: 'Practice tomorrow is at 4:30 PM (moved 30 min later due to field maintenance). See everyone there!', band: 'U16 Girls', time: '2h ago' },
  { author: 'Coach Rivera', content: 'Tournament registration confirmed. Please make sure uniforms are clean and ready for Saturday.', band: 'U18 Boys', time: '3h ago' },
  { author: 'Team Admin', content: 'Reminder: annual registration fees are due by June 15th.', band: 'All Teams', time: '1d ago' },
]

export default function BandPage() {
  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/integrations"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          <Badge variant="success"><CheckCircle className="h-3.5 w-3.5 mr-1" />Connected</Badge>
          <span className="text-sm text-gray-500">3 bands synced</span>
          <Button variant="outline" size="sm" className="ml-auto"><RefreshCw className="h-4 w-4 mr-2" />Sync Now</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {bands.map((b) => (
            <Card key={b.name}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                    <MessageSquare className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{b.name}</p>
                    <p className="text-xs text-gray-500">Last post: {b.lastPost}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1 text-gray-600"><Users className="h-3.5 w-3.5" />{b.members}</span>
                  <span className="text-gray-600">{b.posts} posts</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Posts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((p, i) => (
                <div key={i} className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{p.author}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{p.band}</Badge>
                      <span className="text-xs text-gray-400">{p.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{p.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
