'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { DollarSign, Users, Clock, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

const campaigns = [
  { id: 'c1', title: 'Spring Season Equipment Fund', description: 'New jerseys, training equipment, and ball replacements for the spring season.', goal: 15000, raised: 11250, donors: 47, daysLeft: 14, status: 'active', startDate: 'May 1, 2025', endDate: 'Jun 20, 2025' },
  { id: 'c2', title: 'Tournament Travel Fund', description: 'Cover travel expenses for 3 out-of-state tournaments including the State Championship.', goal: 8000, raised: 6200, donors: 28, daysLeft: 21, status: 'active', startDate: 'May 15, 2025', endDate: 'Jun 27, 2025' },
  { id: 'c3', title: 'Field Improvement Project', description: 'New lighting, turf maintenance, and bleacher upgrades for the main field.', goal: 25000, raised: 18900, donors: 92, daysLeft: 45, status: 'active', startDate: 'Apr 1, 2025', endDate: 'Jul 20, 2025' },
  { id: 'c4', title: 'Winter Warm-Up Fund', description: 'Indoor training facility rental for winter months.', goal: 5000, raised: 5000, donors: 34, daysLeft: 0, status: 'completed', startDate: 'Dec 1, 2024', endDate: 'Jan 15, 2025' },
]

export default function CampaignsPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="font-bold text-gray-900">{campaigns.filter((c) => c.status === 'active').length}</span> active campaigns
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />New Campaign
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((c) => (
            <Card key={c.id} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  <Badge variant={c.status === 'active' ? 'success' : 'outline'}>{c.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 mb-4">{c.description}</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-bold text-gray-900">{formatCurrency(c.raised)}</span>
                    <span className="text-gray-400">of {formatCurrency(c.goal)}</span>
                  </div>
                  <ProgressBar value={c.raised} max={c.goal} barClassName={c.status === 'completed' ? 'bg-green-500' : undefined} />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />{c.donors} donors</span>
                  {c.status === 'active' && (
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{c.daysLeft} days left</span>
                  )}
                </div>
                <Link href={`/dashboard/fundraise/campaigns/${c.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Campaign">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Campaign Title</label>
            <Input placeholder="e.g. Summer Equipment Fund" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" rows={3} placeholder="What are you raising money for?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Goal Amount</label>
              <Input type="number" placeholder="10000" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Launch Campaign</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
