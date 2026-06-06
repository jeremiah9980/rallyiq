import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Trophy, Calendar, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const teams = [
  { id: 't1', name: 'U16 Girls Varsity', sport: 'Soccer', ageGroup: 'U16', season: 'Spring 2025', players: 18, wins: 8, losses: 2, ties: 1, coach: 'Coach Rivera', status: 'active' },
  { id: 't2', name: 'U14 Boys Elite', sport: 'Soccer', ageGroup: 'U14', season: 'Spring 2025', players: 15, wins: 6, losses: 4, ties: 0, coach: 'Coach Smith', status: 'active' },
  { id: 't3', name: 'U18 Boys Premier', sport: 'Soccer', ageGroup: 'U18', season: 'Spring 2025', players: 22, wins: 11, losses: 1, ties: 2, coach: 'Coach Rivera', status: 'active' },
  { id: 't4', name: 'U12 Girls Development', sport: 'Soccer', ageGroup: 'U12', season: 'Spring 2025', players: 14, wins: 4, losses: 5, ties: 2, coach: 'Coach Lee', status: 'active' },
  { id: 't5', name: 'U10 Boys Recreational', sport: 'Soccer', ageGroup: 'U10', season: 'Spring 2025', players: 12, wins: 3, losses: 5, ties: 1, coach: 'Coach Brown', status: 'active' },
  { id: 't6', name: 'U16 Boys Academy', sport: 'Soccer', ageGroup: 'U16', season: 'Spring 2025', players: 20, wins: 7, losses: 3, ties: 1, coach: 'Coach Davis', status: 'active' },
]

const sportColors: Record<string, string> = {
  Soccer: 'bg-green-500',
  Basketball: 'bg-orange-500',
  Baseball: 'bg-blue-500',
}

export default function TeamsPage() {
  return (
    <div>
      <Header title="RallyIQ Teams" subtitle="All active teams in your organization" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{teams.length}</span> active teams
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />Create Team
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-card-hover transition-shadow overflow-hidden">
              <div className={`h-1.5 ${sportColors[team.sport] || 'bg-gray-400'}`} />
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.ageGroup} · {team.season}</p>
                  </div>
                  <Badge variant="success">{team.status}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="rounded-lg bg-green-50 p-2">
                    <div className="text-xl font-bold text-green-600">{team.wins}</div>
                    <div className="text-xs text-gray-500">Wins</div>
                  </div>
                  <div className="rounded-lg bg-red-50 p-2">
                    <div className="text-xl font-bold text-red-500">{team.losses}</div>
                    <div className="text-xs text-gray-500">Losses</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <div className="text-xl font-bold text-gray-600">{team.ties}</div>
                    <div className="text-xs text-gray-500">Ties</div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{team.players} players</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy className="h-4 w-4 text-gray-400" />
                    <span>{team.coach}</span>
                  </div>
                </div>

                <Link href={`/dashboard/teams/${team.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Team <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
