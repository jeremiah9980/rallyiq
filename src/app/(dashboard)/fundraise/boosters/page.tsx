import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Heart, Mail, Plus, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const boosters = [
  { name: 'Mike & Karen Johnson', totalGiven: 3500, donations: 7, teams: ['U16 Girls'], lastGift: 'Jun 4', member: true, vip: true },
  { name: 'The Chen Family', totalGiven: 2800, donations: 5, teams: ['U18 Boys'], lastGift: 'May 28', member: true, vip: true },
  { name: 'Robert Williams', totalGiven: 1200, donations: 4, teams: ['Multiple'], lastGift: 'Jun 1', member: true, vip: false },
  { name: 'Jennifer & Tom Park', totalGiven: 950, donations: 6, teams: ['U16 Girls'], lastGift: 'May 30', member: true, vip: false },
  { name: 'Lisa Martinez', totalGiven: 750, donations: 3, teams: ['U14 Boys'], lastGift: 'May 15', member: false, vip: false },
  { name: 'David Thompson', totalGiven: 600, donations: 2, teams: ['Multiple'], lastGift: 'Apr 22', member: false, vip: false },
]

export default function BoostersPage() {
  return (
    <div>
      <Header title="Boosters" subtitle="Recurring supporters and major donors" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{boosters.length}</div>
              <div className="text-xs text-gray-500">Total Boosters</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              <div className="text-2xl font-bold text-primary">{formatCurrency(boosters.reduce((s, b) => s + b.totalGiven, 0))}</div>
              <div className="text-xs text-gray-500">Total Contributed</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
              <div className="text-2xl font-bold text-yellow-500">{boosters.filter((b) => b.vip).length}</div>
              <div className="text-xs text-gray-500">VIP Members</div>
            </div>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />Add Booster</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boosters.map((b) => (
            <Card key={b.name} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={b.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{b.name}</h3>
                      {b.vip && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {b.member && <Badge variant="default" className="text-xs">Club Member</Badge>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="rounded-lg bg-green-50 p-2 text-center">
                    <div className="font-bold text-green-600">{formatCurrency(b.totalGiven)}</div>
                    <div className="text-xs text-gray-500">Total Given</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2 text-center">
                    <div className="font-bold text-blue-600">{b.donations}</div>
                    <div className="text-xs text-gray-500">Donations</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Teams: {b.teams.join(', ')}</div>
                  <div>Last gift: {b.lastGift}</div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Mail className="h-3.5 w-3.5 mr-2" />Send Thank You
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
