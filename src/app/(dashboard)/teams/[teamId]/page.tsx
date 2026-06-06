import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Users, Calendar, Trophy, MessageSquare, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const teamId = 't1'

const team = {
  id: teamId,
  name: 'U16 Girls Varsity',
  sport: 'Soccer',
  ageGroup: 'U16',
  season: 'Spring 2025',
  coach: 'Coach Rivera',
  record: { wins: 8, losses: 2, ties: 1 },
  nextGame: 'Sat Jun 8 vs. Westfield FC',
  players: [
    { name: 'Sophia Martinez', position: 'Forward', number: '10', status: 'active' },
    { name: 'Aisha Patel', position: 'Goalkeeper', number: '1', status: 'active' },
    { name: 'Emma Davis', position: 'Midfielder', number: '8', status: 'active' },
    { name: 'Mia Johnson', position: 'Defender', number: '4', status: 'active' },
    { name: 'Chloe Brown', position: 'Forward', number: '11', status: 'active' },
    { name: 'Lily Wilson', position: 'Midfielder', number: '6', status: 'injured' },
  ],
}

export default function TeamDetailPage() {
  return (
    <div>
      <Header title={team.name} subtitle={`${team.sport} · ${team.ageGroup} · ${team.season}`} />
      <div className="p-6 space-y-6">
        {/* Quick nav */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Roster', href: `/dashboard/teams/${teamId}/roster`, icon: Users },
            { label: 'Schedule', href: `/dashboard/teams/${teamId}/schedule`, icon: Calendar },
            { label: 'Tournaments', href: `/dashboard/teams/${teamId}/tournaments`, icon: Trophy },
            { label: 'Communications', href: `/dashboard/teams/${teamId}/communications`, icon: MessageSquare },
          ].map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button variant="outline" size="sm">
                <Icon className="h-4 w-4 mr-2" />{label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Record */}
        <div className="grid grid-cols-3 gap-4 max-w-sm">
          <div className="rounded-xl border bg-green-50 p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{team.record.wins}</div>
            <div className="text-sm text-gray-500">Wins</div>
          </div>
          <div className="rounded-xl border bg-red-50 p-4 text-center">
            <div className="text-3xl font-bold text-red-500">{team.record.losses}</div>
            <div className="text-sm text-gray-500">Losses</div>
          </div>
          <div className="rounded-xl border bg-gray-50 p-4 text-center">
            <div className="text-3xl font-bold text-gray-600">{team.record.ties}</div>
            <div className="text-sm text-gray-500">Ties</div>
          </div>
        </div>

        {/* Roster preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Roster ({team.players.length})</CardTitle>
              <Link href={`/dashboard/teams/${teamId}/roster`}>
                <Button variant="ghost" size="sm">Full Roster <ChevronRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 pb-2">#</th>
                    <th className="text-left font-medium text-gray-500 pb-2">Player</th>
                    <th className="text-left font-medium text-gray-500 pb-2">Position</th>
                    <th className="text-left font-medium text-gray-500 pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((p) => (
                    <tr key={p.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-mono text-gray-400">{p.number}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar name={p.name} size="sm" />
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-2 text-gray-600">{p.position}</td>
                      <td className="py-2">
                        <Badge variant={p.status === 'active' ? 'success' : 'warning'}>{p.status}</Badge>
                      </td>
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
