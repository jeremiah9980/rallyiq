import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, Trophy, TrendingUp, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const standings = [
  { rank: 1, team: 'Eastside FC', wins: 9, losses: 2, points: 28 },
  { rank: 2, team: 'Riverside SC (Us)', wins: 8, losses: 2, points: 25, us: true },
  { rank: 3, team: 'Metro United', wins: 8, losses: 3, points: 24 },
  { rank: 4, team: 'Northside SC', wins: 7, losses: 4, points: 21 },
  { rank: 5, team: 'Valley SC', wins: 6, losses: 5, points: 18 },
]

export default function NCSPage() {
  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/integrations"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          <Badge variant="success"><CheckCircle className="h-3.5 w-3.5 mr-1" />Connected</Badge>
          <span className="text-sm text-gray-500">Last sync: 2h ago</span>
          <Button variant="outline" size="sm" className="ml-auto"><RefreshCw className="h-4 w-4 mr-2" />Sync</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-sm">
          <div className="rounded-xl border bg-white p-4 text-center">
            <div className="text-2xl font-bold text-primary">#2</div>
            <div className="text-xs text-gray-500">Regional Rank</div>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center">
            <div className="text-2xl font-bold text-green-600">25</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
          <div className="rounded-xl border bg-white p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">Top 5</div>
            <div className="text-xs text-gray-500">Division</div>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>U16 Elite Division Standings</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    {['Rank', 'Team', 'W', 'L', 'Pts'].map((h) => (
                      <th key={h} className="text-left font-medium text-gray-500 pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s) => (
                    <tr key={s.team} className={`border-b border-gray-50 ${s.us ? 'bg-primary-50' : ''}`}>
                      <td className="py-2.5 pr-4 font-bold text-gray-700">#{s.rank}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`font-medium ${s.us ? 'text-primary' : 'text-gray-900'}`}>{s.team}</span>
                        {s.us && <Badge variant="default" className="ml-2 text-xs">Us</Badge>}
                      </td>
                      <td className="py-2.5 pr-4 text-green-600 font-medium">{s.wins}</td>
                      <td className="py-2.5 pr-4 text-red-500">{s.losses}</td>
                      <td className="py-2.5 font-bold text-gray-900">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
