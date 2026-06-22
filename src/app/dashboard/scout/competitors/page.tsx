import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Binoculars, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const competitors = [
  { id: 'c1', name: 'Eastside FC', sport: 'Soccer', division: 'U16 Elite', wins: 9, losses: 2, notes: 'Strong high press, pacey forwards. Weak on set pieces.', lastScouted: 'Jun 1, 2025', threat: 'high' },
  { id: 'c2', name: 'Northside SC', sport: 'Soccer', division: 'U16 Elite', wins: 7, losses: 4, notes: 'Physical team, long ball game. Poor under pressure in midfield.', lastScouted: 'May 28, 2025', threat: 'medium' },
  { id: 'c3', name: 'Valley SC', sport: 'Soccer', division: 'U16 Elite', wins: 6, losses: 5, notes: 'Technical possession team. Very slow transitions after losing ball.', lastScouted: 'May 20, 2025', threat: 'medium' },
  { id: 'c4', name: 'Westfield FC', sport: 'Soccer', division: 'U16 Elite', wins: 4, losses: 7, notes: 'Rebuilding season. Young squad with potential. Not a major threat this year.', lastScouted: 'May 10, 2025', threat: 'low' },
  { id: 'c5', name: 'Metro United', sport: 'Soccer', division: 'U16 Elite', wins: 8, losses: 3, notes: 'Elite GK. Dangerous counter-attacks. Must control possession vs. them.', lastScouted: 'Apr 30, 2025', threat: 'high' },
]

export default function CompetitorsPage() {
  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm text-gray-500">
            <span><span className="font-bold text-red-500">{competitors.filter((c) => c.threat === 'high').length}</span> high threat</span>
            <span><span className="font-bold text-yellow-500">{competitors.filter((c) => c.threat === 'medium').length}</span> medium</span>
            <span><span className="font-bold text-green-500">{competitors.filter((c) => c.threat === 'low').length}</span> low</span>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />Add Competitor</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((c) => (
            <Card key={c.id} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <p className="text-sm text-gray-500">{c.division}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {c.threat === 'high' && <TrendingUp className="h-4 w-4 text-red-500" />}
                    {c.threat === 'medium' && <Minus className="h-4 w-4 text-yellow-500" />}
                    {c.threat === 'low' && <TrendingDown className="h-4 w-4 text-green-500" />}
                    <Badge variant={c.threat === 'high' ? 'danger' : c.threat === 'medium' ? 'warning' : 'success'}>
                      {c.threat}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-center text-sm">
                  <div className="rounded-lg bg-green-50 p-2">
                    <div className="font-bold text-green-600">{c.wins}</div>
                    <div className="text-xs text-gray-500">Wins</div>
                  </div>
                  <div className="rounded-lg bg-red-50 p-2">
                    <div className="font-bold text-red-500">{c.losses}</div>
                    <div className="text-xs text-gray-500">Losses</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">{c.notes}</p>
                <p className="text-xs text-gray-400">Last scouted: {c.lastScouted}</p>

                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Binoculars className="h-4 w-4 mr-2" />Add Scout Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
