import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { ArrowLeft, Share2, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

const campaign = {
  id: 'c1', title: 'Spring Season Equipment Fund',
  description: 'New jerseys, training equipment, and ball replacements for the spring season. Help us give our players the best tools to succeed.',
  goal: 15000, raised: 11250, donors: 47, daysLeft: 14, status: 'active',
}

const donations = [
  { name: 'Mike Johnson', amount: 500, message: 'Go team!', date: 'Jun 4', anonymous: false },
  { name: 'Sarah Chen', amount: 250, message: 'Great kids, great program.', date: 'Jun 3', anonymous: false },
  { name: 'Anonymous', amount: 1000, message: '', date: 'Jun 2', anonymous: true },
  { name: 'Robert Williams', amount: 150, message: 'Happy to support!', date: 'Jun 1', anonymous: false },
  { name: 'Jennifer Park', amount: 75, message: 'For the girls\' team', date: 'May 30', anonymous: false },
  { name: 'Anonymous', amount: 200, message: '', date: 'May 28', anonymous: true },
]

export default function CampaignDetailPage() {
  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/fundraise/campaigns">
            <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          </Link>
          <Button variant="outline" size="sm" className="ml-auto"><Share2 className="h-4 w-4 mr-2" />Share</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{campaign.title}</h2>
              <Badge variant="success">{campaign.status}</Badge>
            </div>
            <p className="text-gray-600 mb-6">{campaign.description}</p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(campaign.raised)}</span>
                <span className="text-gray-500">of {formatCurrency(campaign.goal)} goal</span>
              </div>
              <ProgressBar value={campaign.raised} max={campaign.goal} className="mb-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold text-primary">{Math.round((campaign.raised / campaign.goal) * 100)}%</p><p className="text-sm text-gray-500">funded</p></div>
              <div><p className="text-2xl font-bold text-primary">{campaign.donors}</p><p className="text-sm text-gray-500">donors</p></div>
              <div><p className="text-2xl font-bold text-primary">{campaign.daysLeft}</p><p className="text-sm text-gray-500">days left</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Donors ({donations.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donations.map((d, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg bg-gray-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary flex-shrink-0">
                    {d.anonymous ? '?' : d.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{d.name}</p>
                    {d.message && <p className="text-xs text-gray-500 italic">&quot;{d.message}&quot;</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(d.amount)}</p>
                    <p className="text-xs text-gray-400">{d.date}</p>
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
