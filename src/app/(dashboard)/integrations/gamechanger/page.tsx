import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const syncedGames = [
  { date: 'Jun 5', opponent: 'Northside SC', score: '2-0', result: 'W', stats: { shots: 14, passes: 287, possession: 62 } },
  { date: 'Jun 1', opponent: 'Eastside FC', score: '3-1', result: 'W', stats: { shots: 18, passes: 312, possession: 58 } },
  { date: 'May 25', opponent: 'Valley SC', score: '1-1', result: 'D', stats: { shots: 10, passes: 265, possession: 54 } },
]

export default function GameChangerPage() {
  return (
    <div>
      <Header title="GameChanger Integration" subtitle="Synced game data and statistics" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/integrations"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          <Badge variant="success" className="ml-2"><CheckCircle className="h-3.5 w-3.5 mr-1" />Connected</Badge>
          <span className="text-sm text-gray-500">Last sync: 5 min ago</span>
          <Button variant="outline" size="sm" className="ml-auto"><RefreshCw className="h-4 w-4 mr-2" />Sync Now</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md">
          <div className="rounded-xl border bg-white p-4 text-center"><div className="text-2xl font-bold text-green-600">8</div><div className="text-xs text-gray-500">Wins Synced</div></div>
          <div className="rounded-xl border bg-white p-4 text-center"><div className="text-2xl font-bold text-gray-900">22</div><div className="text-xs text-gray-500">Games Total</div></div>
          <div className="rounded-xl border bg-white p-4 text-center"><div className="text-2xl font-bold text-primary">68%</div><div className="text-xs text-gray-500">Win Rate</div></div>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Synced Games</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {syncedGames.map((g) => (
                <div key={g.date + g.opponent} className="rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">vs. {g.opponent}</span>
                      <span className="text-sm text-gray-500 ml-2">{g.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900">{g.score}</span>
                      <Badge variant={g.result === 'W' ? 'success' : g.result === 'L' ? 'danger' : 'warning'}>{g.result}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm text-gray-500">
                    <span>Shots: <strong className="text-gray-900">{g.stats.shots}</strong></span>
                    <span>Passes: <strong className="text-gray-900">{g.stats.passes}</strong></span>
                    <span>Possession: <strong className="text-gray-900">{g.stats.possession}%</strong></span>
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
