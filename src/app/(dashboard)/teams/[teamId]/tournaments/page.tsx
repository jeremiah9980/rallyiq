import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, MapPin, Calendar, Plus } from 'lucide-react'

const tournaments = [
  {
    id: 't1',
    name: 'Spring Invitational 2025',
    location: 'Regional Sports Complex',
    startDate: 'Jun 14, 2025',
    endDate: 'Jun 16, 2025',
    division: 'U16 Elite',
    placement: null,
    status: 'upcoming',
    games: [],
  },
  {
    id: 't2',
    name: 'Mid-Season Classic',
    location: 'Northside Athletic Park',
    startDate: 'Apr 5, 2025',
    endDate: 'Apr 6, 2025',
    division: 'U16 Elite',
    placement: '1st Place',
    status: 'completed',
    games: [
      { round: 'Group A', opponent: 'Eastside FC', ourScore: 3, theirScore: 0, result: 'W' },
      { round: 'Group A', opponent: 'Riverside United', ourScore: 2, theirScore: 1, result: 'W' },
      { round: 'Semifinal', opponent: 'Valley SC', ourScore: 1, theirScore: 0, result: 'W' },
      { round: 'Final', opponent: 'Northside SC', ourScore: 2, theirScore: 1, result: 'W' },
    ],
  },
  {
    id: 't3',
    name: 'Winter Cup',
    location: 'Downtown Soccer Center',
    startDate: 'Feb 15, 2025',
    endDate: 'Feb 16, 2025',
    division: 'U16 Elite',
    placement: '3rd Place',
    status: 'completed',
    games: [
      { round: 'Group A', opponent: 'Blue Thunder FC', ourScore: 2, theirScore: 2, result: 'D' },
      { round: 'Group A', opponent: 'Eagles SC', ourScore: 3, theirScore: 1, result: 'W' },
      { round: 'Semifinal', opponent: 'Metro United', ourScore: 0, theirScore: 1, result: 'L' },
      { round: '3rd Place', opponent: 'Stars FC', ourScore: 2, theirScore: 0, result: 'W' },
    ],
  },
]

export default function TournamentsPage() {
  return (
    <div>
      <Header title="Tournaments" subtitle="U16 Girls Varsity" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span><span className="font-bold text-gray-900">2</span> completed</span>
            <span><span className="font-bold text-gray-900">1</span> upcoming</span>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />Add Tournament</Button>
        </div>

        <div className="space-y-6">
          {tournaments.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${t.status === 'completed' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                      <Trophy className={`h-6 w-6 ${t.status === 'completed' ? 'text-yellow-500' : 'text-blue-500'}`} />
                    </div>
                    <div>
                      <CardTitle>{t.name}</CardTitle>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{t.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{t.startDate} – {t.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.placement && (
                      <Badge variant="warning" className="text-sm px-3 py-1">{t.placement}</Badge>
                    )}
                    <Badge variant={t.status === 'upcoming' ? 'info' : 'success'}>{t.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              {t.games.length > 0 && (
                <CardContent>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Match Results</h4>
                  <div className="space-y-2">
                    {t.games.map((g, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-lg bg-gray-50 px-4 py-2.5">
                        <span className="text-xs font-medium text-gray-400 w-20 flex-shrink-0">{g.round}</span>
                        <span className="flex-1 text-sm text-gray-700">vs. {g.opponent}</span>
                        <span className="text-sm font-mono text-gray-600">{g.ourScore} – {g.theirScore}</span>
                        <Badge
                          variant={g.result === 'W' ? 'success' : g.result === 'L' ? 'danger' : 'warning'}
                          className="w-8 justify-center"
                        >
                          {g.result}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
