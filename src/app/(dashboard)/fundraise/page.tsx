import { Header } from '@/components/layout/header'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { DollarSign, Users, TrendingUp, Heart, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

const campaigns = [
  { id: 'c1', title: 'Spring Season Equipment Fund', goal: 15000, raised: 11250, donors: 47, daysLeft: 14, status: 'active' },
  { id: 'c2', title: 'Tournament Travel Fund', goal: 8000, raised: 6200, donors: 28, daysLeft: 21, status: 'active' },
  { id: 'c3', title: 'Field Improvement Project', goal: 25000, raised: 18900, donors: 92, daysLeft: 45, status: 'active' },
]

const recentDonors = [
  { name: 'Mike Johnson', amount: 500, campaign: 'Equipment Fund', date: 'Jun 4' },
  { name: 'Sarah Chen', amount: 250, campaign: 'Tournament Travel', date: 'Jun 3' },
  { name: 'Anonymous', amount: 1000, campaign: 'Field Improvement', date: 'Jun 2' },
  { name: 'Robert Williams', amount: 150, campaign: 'Equipment Fund', date: 'Jun 1' },
]

export default function FundraisePage() {
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0)
  const totalGoal = campaigns.reduce((sum, c) => sum + c.goal, 0)

  return (
    <div>
      <Header title="RallyIQ Fundraise" subtitle="Campaigns, donors, and sponsor management" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Total Raised" value={formatCurrency(totalRaised)} change={`of ${formatCurrency(totalGoal)} goal`} changeType="positive" icon={DollarSign} iconColor="bg-green-500" />
          <StatCard title="Active Campaigns" value={campaigns.length} change="Running now" changeType="neutral" icon={TrendingUp} iconColor="bg-blue-500" />
          <StatCard title="Total Donors" value="167" change="+23 this month" changeType="positive" icon={Users} iconColor="bg-purple-500" />
          <StatCard title="Active Sponsors" value="12" change="$42,000 committed" changeType="positive" icon={Heart} iconColor="bg-accent" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Campaigns</CardTitle>
                  <Link href="/dashboard/fundraise/campaigns">
                    <Button variant="ghost" size="sm">View all <ChevronRight className="h-4 w-4 ml-1" /></Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {campaigns.map((c) => (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{c.title}</h4>
                          <p className="text-xs text-gray-500">{c.donors} donors · {c.daysLeft} days left</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(c.raised)}</p>
                          <p className="text-xs text-gray-400">of {formatCurrency(c.goal)}</p>
                        </div>
                      </div>
                      <ProgressBar value={c.raised} max={c.goal} showLabel />
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/fundraise/campaigns">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />New Campaign
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Donors</CardTitle>
                <Heart className="h-5 w-5 text-pink-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDonors.map((d) => (
                  <div key={d.name + d.date} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-xs font-bold text-pink-500">
                      {d.name === 'Anonymous' ? '?' : d.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{d.name}</p>
                      <p className="text-xs text-gray-400 truncate">{d.campaign}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{formatCurrency(d.amount)}</p>
                      <p className="text-xs text-gray-400">{d.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
