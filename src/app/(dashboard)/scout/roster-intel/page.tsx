import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { FileText, Plus, Filter, Star } from 'lucide-react'

const reports = [
  { id: 'r1', subject: 'U16 Girls Mid-Season Depth Analysis', content: 'Strong top-6 but depth drops significantly after the starting lineup. Consider bringing up 2 players from U14s for tournament depth.', priority: 'high', tags: ['depth', 'u16-girls'], date: 'Jun 4, 2025', author: 'Coach Rivera' },
  { id: 'r2', subject: 'Goalkeeper Position Review', content: 'Aisha Patel performing at elite level. Backup GK needs significant development. Recommend identifying external talent for summer tryouts.', priority: 'high', tags: ['goalkeeper', 'position-review'], date: 'Jun 2, 2025', author: 'Coach Smith' },
  { id: 'r3', subject: 'U18 Boys Attacking Options', content: '3 viable options for striker role. Liam Chen capable of contributing from deep. All three forwards need work on finishing under pressure.', priority: 'medium', tags: ['attacking', 'u18-boys'], date: 'May 28, 2025', author: 'Coach Rivera' },
  { id: 'r4', subject: 'Speed & Fitness Rankings', content: 'Annual fitness testing complete. Top 5 fastest players identified. Cross-team speed comparison shows we rank in 75th percentile for our region.', priority: 'low', tags: ['fitness', 'analytics'], date: 'May 20, 2025', author: 'Trainer Wilson' },
]

export default function RosterIntelPage() {
  return (
    <div>
      <Header title="Roster Intelligence" subtitle="In-depth analysis of your roster" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filter</Button>
          <Button><Plus className="h-4 w-4 mr-2" />New Report</Button>
        </div>

        <div className="grid gap-4">
          {reports.map((r) => (
            <Card key={r.id} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
                    r.priority === 'high' ? 'bg-red-50' : r.priority === 'medium' ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}>
                    <FileText className={`h-5 w-5 ${
                      r.priority === 'high' ? 'text-red-500' : r.priority === 'medium' ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900">{r.subject}</h3>
                      <Badge variant={r.priority === 'high' ? 'danger' : r.priority === 'medium' ? 'warning' : 'outline'}>
                        {r.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">{r.content}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {r.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                      <span className="text-xs text-gray-400 ml-auto">{r.author} · {r.date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
