'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Upload, Download, Sparkles, Clock, Eye, Video, ArrowLeft, Scissors } from 'lucide-react'
import Link from 'next/link'

const clips = [
  { id: 'vc1', title: 'U16 Girls - Sophia Hat Trick vs Eastside', duration: '4:22', views: 1243, status: 'ready', aiEdited: true, date: 'Jun 5, 2025' },
  { id: 'vc2', title: 'Tournament Highlight Reel - May 2025', duration: '6:47', views: 892, status: 'ready', aiEdited: true, date: 'May 30, 2025' },
  { id: 'vc3', title: 'U18 Boys - Championship Win Goals', duration: '3:15', views: 567, status: 'processing', aiEdited: false, date: 'May 28, 2025' },
  { id: 'vc4', title: 'U14 Boys vs Northside Full Game', duration: '90:00', views: 234, status: 'ready', aiEdited: false, date: 'May 25, 2025' },
  { id: 'vc5', title: 'Season Skills Compilation 2025', duration: '8:30', views: 3421, status: 'ready', aiEdited: true, date: 'May 20, 2025' },
]

export default function VideoHighlightsPage() {
  const [downloading, setDownloading] = useState(false)

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <Link href="/dashboard/integrations"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>

        {/* AI Feature Banner */}
        <div className="rounded-xl bg-gradient-to-r from-primary to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-lg font-bold">AI Video Editing</h2>
            <Badge className="bg-white/20 text-white border-0">Beta</Badge>
          </div>
          <p className="text-white/80 mb-4">Upload raw game footage and our AI will automatically detect key moments, create highlight reels, and add transitions and music.</p>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              <Upload className="h-4 w-4 mr-2" />Upload Raw Footage
            </Button>
            <Button className="bg-accent hover:bg-accent-600">
              <Sparkles className="h-4 w-4 mr-2" />Auto-Generate Highlights
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Clips', value: clips.length },
            { label: 'AI Edited', value: clips.filter((c) => c.aiEdited).length },
            { label: 'Total Views', value: clips.reduce((s, c) => s + c.views, 0).toLocaleString() },
            { label: 'Processing', value: clips.filter((c) => c.status === 'processing').length },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Video Library</CardTitle>
              <Button size="sm"><Upload className="h-4 w-4 mr-2" />Upload</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clips.map((clip) => (
                <div key={clip.id} className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-card-hover transition-shadow">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-900 group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {clip.status === 'processing' ? (
                        <div className="text-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto mb-1" />
                          <span className="text-white text-xs">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                          <Play className="h-6 w-6 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    {clip.aiEdited && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-xs text-white">
                        <Sparkles className="h-3 w-3" />AI Edited
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white flex items-center gap-1">
                      <Clock className="h-3 w-3" />{clip.duration}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1">{clip.title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{clip.views.toLocaleString()}</span>
                      <span>{clip.date}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Download className="h-3.5 w-3.5 mr-1" />Download
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Scissors className="h-3.5 w-3.5 mr-1" />Edit
                      </Button>
                    </div>
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
