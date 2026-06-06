import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { School, Plus, Mail, Phone, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const snapshots = [
  { id: 's1', college: 'Stanford University', division: 'Division I', status: 'visited', contactName: 'Coach Johnson', contactDate: 'May 20, 2025', notes: 'Campus visit completed. Very interested. Awaiting official offer.' },
  { id: 's2', college: 'UCLA Bruins', division: 'Division I', status: 'contacted', contactName: 'Coach Williams', contactDate: 'Apr 15, 2025', notes: 'Initial contact via email. Sent highlight reel. Waiting for response.' },
  { id: 's3', college: 'UC Santa Barbara', division: 'Division I', status: 'interested', contactName: 'Coach Lee', contactDate: 'Mar 30, 2025', notes: 'Expressed interest at tournament. Requested academic transcripts.' },
  { id: 's4', college: 'University of Portland', division: 'Division I', status: 'contacted', contactName: 'Coach Rivera', contactDate: 'Mar 10, 2025', notes: 'Strong fit for style of play. Follow up next month.' },
]

const statusConfig: Record<string, { variant: 'success' | 'info' | 'warning' | 'outline', label: string }> = {
  visited: { variant: 'success', label: 'Visited' },
  contacted: { variant: 'info', label: 'Contacted' },
  interested: { variant: 'warning', label: 'Interested' },
  committed: { variant: 'success', label: 'Committed' },
}

export default function RecruitingPage() {
  return (
    <div>
      <Header title="Recruiting Snapshot" subtitle="Sophia Martinez · Class of 2026" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/profiles/p1">
            <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          </Link>
          <Button className="ml-auto"><Plus className="h-4 w-4 mr-2" />Add School</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {snapshots.map((s) => {
            const cfg = statusConfig[s.status] || statusConfig.interested
            return (
              <Card key={s.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                      <School className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{s.college}</h3>
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{s.division}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{s.notes}</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{s.contactName}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />Last contact: {s.contactDate}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
