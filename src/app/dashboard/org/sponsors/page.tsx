import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, DollarSign, Plus, ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const sponsors = [
  { name: 'Riverside Sports Medicine', tier: 'platinum', amount: 10000, teams: 'All Teams', renewal: 'Jan 2026', status: 'active' },
  { name: 'Valley Auto Group', tier: 'gold', amount: 5000, teams: 'U18 Boys', renewal: 'Mar 2026', status: 'active' },
  { name: 'TechBridge Solutions', tier: 'gold', amount: 5000, teams: 'U16 Girls', renewal: 'Feb 2026', status: 'active' },
  { name: 'Downtown Diner', tier: 'silver', amount: 2500, teams: 'U14 Boys', renewal: 'Dec 2025', status: 'active' },
  { name: 'Eastside Printing', tier: 'silver', amount: 2000, teams: 'All Teams', renewal: 'Nov 2025', status: 'at-risk' },
  { name: 'Premier Insurance', tier: 'bronze', amount: 1000, teams: 'U12 Girls', renewal: 'Oct 2025', status: 'expired' },
]

const tierColors: Record<string, string> = {
  platinum: 'border-l-gray-400',
  gold: 'border-l-yellow-400',
  silver: 'border-l-blue-400',
  bronze: 'border-l-orange-400',
}

export default function OrgSponsorsPage() {
  const total = sponsors.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.amount, 0)

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-3 text-sm">
            {['platinum', 'gold', 'silver', 'bronze'].map((tier) => (
              <div key={tier} className="capitalize text-gray-500">
                <span className="font-bold text-gray-900">{sponsors.filter((s) => s.tier === tier).length}</span> {tier}
              </div>
            ))}
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />Add Sponsor</Button>
        </div>

        <div className="grid gap-3">
          {sponsors.map((s) => (
            <div
              key={s.name}
              className={`flex items-center gap-4 rounded-xl border-l-4 border border-gray-200 bg-white p-4 ${tierColors[s.tier] || ''}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Building2 className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <Badge variant="outline" className="capitalize text-xs">{s.tier}</Badge>
                  <Badge variant={s.status === 'active' ? 'success' : s.status === 'at-risk' ? 'warning' : 'danger'} className="text-xs">
                    {s.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">Teams: {s.teams} · Renewal: {s.renewal}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{formatCurrency(s.amount)}</p>
                <p className="text-xs text-gray-400">/ year</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
