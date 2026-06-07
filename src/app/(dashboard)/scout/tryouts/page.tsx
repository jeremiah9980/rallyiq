'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Users, Plus, CheckCircle, XCircle, Clock, Star } from 'lucide-react'

const candidates = [
  { id: 'tc1', name: 'Alex Rivera', position: 'Forward', age: 15, rating: 9, notes: 'Explosive pace, natural finisher. Strong recommendation.', status: 'invited', date: 'Jun 1, 2025' },
  { id: 'tc2', name: 'Jordan Kim', position: 'Midfielder', age: 14, rating: 8, notes: 'Excellent vision. Needs to improve physically but huge upside.', status: 'pending', date: 'Jun 2, 2025' },
  { id: 'tc3', name: 'Casey Brown', position: 'Defender', age: 15, rating: 7, notes: 'Solid positional awareness. Passing needs development.', status: 'pending', date: 'Jun 2, 2025' },
  { id: 'tc4', name: 'Morgan Lee', position: 'Goalkeeper', age: 14, rating: 8, notes: 'Great reflexes, calm under pressure. Perfect backup GK candidate.', status: 'accepted', date: 'May 28, 2025' },
  { id: 'tc5', name: 'Riley Torres', position: 'Forward', age: 15, rating: 5, notes: 'Not ready for this level. Recommend lower age group.', status: 'rejected', date: 'May 25, 2025' },
  { id: 'tc6', name: 'Taylor Wright', position: 'Midfielder', age: 14, rating: 7, notes: 'Good work rate, needs technical polish.', status: 'pending', date: 'Jun 3, 2025' },
]

const statusConfig = {
  invited: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'info' as const },
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', badge: 'warning' as const },
  accepted: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', badge: 'success' as const },
  rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', badge: 'danger' as const },
}

export default function TryoutsPage() {
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? candidates : candidates.filter((c) => c.status === filter)

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {['all', 'pending', 'invited', 'accepted', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  filter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Button className="ml-auto" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Candidate
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const cfg = statusConfig[c.status as keyof typeof statusConfig]
            const Icon = cfg.icon
            return (
              <Card key={c.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={c.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{c.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{c.position} · Age {c.age}</p>
                    </div>
                    <Badge variant={cfg.badge}>{c.status}</Badge>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i < c.rating ? 'bg-primary' : 'bg-gray-100'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-bold text-primary">{c.rating}/10</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{c.notes}</p>
                  <p className="text-xs text-gray-400 mb-3">Evaluated: {c.date}</p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-green-600 border-green-200 hover:bg-green-50">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />Accept
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-red-500 border-red-200 hover:bg-red-50">
                      <XCircle className="h-3.5 w-3.5 mr-1" />Pass
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Tryout Candidate">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1"><label className="text-sm font-medium">Name</label><Input placeholder="Full name" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Position</label><Select><option>Forward</option><option>Midfielder</option><option>Defender</option><option>Goalkeeper</option></Select></div>
            <div className="space-y-1"><label className="text-sm font-medium">Age</label><Input type="number" placeholder="15" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Rating (1-10)</label><Input type="number" min="1" max="10" placeholder="7" /></div>
          </div>
          <div className="space-y-1"><label className="text-sm font-medium">Notes</label><textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none" rows={3} placeholder="Evaluation notes..." /></div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Add Candidate</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
