'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send, Eye, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const posts = [
  { platform: 'Instagram', content: '🏆 Big win! U16 Girls 3-1 vs Eastside FC! Sophia with a hat trick! #RallyIQ #Soccer', likes: 142, comments: 23, views: 890, time: '2h ago', status: 'published' },
  { platform: 'Instagram', content: '⚽ Practice highlights from today\'s session. The girls are looking sharp heading into tournament week!', likes: 87, comments: 12, views: 432, time: '1d ago', status: 'published' },
  { platform: 'Twitter', content: 'Match day! U14 Boys vs Westfield FC — 1 PM kick off at Field A. Come cheer them on! 🙌', likes: 34, comments: 5, views: 210, time: '2d ago', status: 'scheduled' },
]

const platforms = [
  { name: 'Instagram', status: 'connected', followers: 1240, icon: '📸' },
  { name: 'Twitter/X', status: 'disconnected', followers: 0, icon: '🐦' },
  { name: 'Facebook', status: 'disconnected', followers: 0, icon: '📘' },
]

export default function SocialPage() {
  const [draft, setDraft] = useState('')
  const [platform, setPlatform] = useState('Instagram')

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <Link href="/dashboard/integrations"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>

        <div className="grid gap-4 sm:grid-cols-3">
          {platforms.map((p) => (
            <Card key={p.name}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <Badge variant={p.status === 'connected' ? 'success' : 'outline'} className="text-xs">{p.status}</Badge>
                  </div>
                  {p.followers > 0 && <span className="text-sm font-bold text-primary">{p.followers}</span>}
                </div>
                <Button variant={p.status === 'connected' ? 'outline' : 'default'} size="sm" className="w-full mt-3">
                  {p.status === 'connected' ? 'Manage' : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Create Post</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-none" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option>Instagram</option>
                <option>Twitter/X</option>
                <option>Facebook</option>
              </select>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                rows={4}
                placeholder="What's happening with your team?"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <Button variant="outline">Schedule</Button>
                <Button><Send className="h-4 w-4 mr-2" />Post Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Posts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((p, i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{p.platform}</Badge>
                    <Badge variant={p.status === 'published' ? 'success' : 'warning'} className="text-xs">{p.status}</Badge>
                    <span className="text-xs text-gray-400 ml-auto">{p.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{p.content}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{p.views}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{p.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{p.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
