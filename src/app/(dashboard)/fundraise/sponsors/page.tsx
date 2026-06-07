import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Mail, Globe, Plus, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const sponsors = [
  { id: 's1', name: 'Riverside Sports Medicine', tier: 'platinum', amount: 10000, logo: null, website: 'rsmed.com', contact: 'Dr. John Smith', email: 'jsmith@rsmed.com', active: true },
  { id: 's2', name: 'Valley Auto Group', tier: 'gold', amount: 5000, logo: null, website: 'valleyauto.com', contact: 'Sarah Johnson', email: 'sjohnson@valleyauto.com', active: true },
  { id: 's3', name: 'TechBridge Solutions', tier: 'gold', amount: 5000, logo: null, website: 'techbridge.io', contact: 'Mike Chen', email: 'mchen@techbridge.io', active: true },
  { id: 's4', name: 'Downtown Diner', tier: 'silver', amount: 2500, logo: null, website: null, contact: 'Lisa Park', email: 'lisa@downtowndiner.com', active: true },
  { id: 's5', name: 'Eastside Printing', tier: 'silver', amount: 2000, logo: null, website: 'eastsideprint.com', contact: 'Tom Davis', email: 'tdavis@eastsideprint.com', active: true },
  { id: 's6', name: 'Premier Insurance', tier: 'bronze', amount: 1000, logo: null, website: null, contact: 'Amy Wilson', email: 'awilson@premier.com', active: false },
]

const tierConfig = {
  platinum: { color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  gold: { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  silver: { color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-400' },
  bronze: { color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-400' },
}

export default function SponsorsPage() {
  const total = sponsors.filter((s) => s.active).reduce((sum, s) => sum + s.amount, 0)

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm text-gray-500">
            {Object.entries(tierConfig).map(([tier]) => (
              <span key={tier} className="capitalize">{sponsors.filter((s) => s.tier === tier && s.active).length} {tier}</span>
            ))}
          </div>
          <Button><Plus className="h-4 w-4 mr-2" />Add Sponsor</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((s) => {
            const cfg = tierConfig[s.tier as keyof typeof tierConfig]
            return (
              <Card key={s.id} className={`${!s.active ? 'opacity-60' : ''} hover:shadow-card-hover transition-shadow`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                      <Building2 className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{s.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${cfg.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {s.tier}
                        </span>
                        {!s.active && <Badge variant="outline">Inactive</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-bold text-green-600">{formatCurrency(s.amount)}</span>
                    <span className="text-xs text-gray-400">/ year</span>
                  </div>
                  <div className="space-y-1.5 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><span className="truncate">{s.email}</span></div>
                    {s.website && <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /><span>{s.website}</span></div>}
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
