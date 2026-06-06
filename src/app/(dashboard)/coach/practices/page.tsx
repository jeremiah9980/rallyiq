'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Plus, Dumbbell, Clock, Users, MapPin, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const practices = [
  {
    id: 'p1', title: 'Passing & Possession Drill', team: 'U16 Girls', date: '2025-06-05', duration: 90,
    location: 'Field A', attendees: 18, objectives: 'Improve first touch, maintain possession under pressure',
    rating: 4, status: 'completed',
  },
  {
    id: 'p2', title: 'Defensive Shape Work', team: 'U14 Boys', date: '2025-06-04', duration: 75,
    location: 'Field B', attendees: 14, objectives: 'Backline coordination, pressing triggers',
    rating: 5, status: 'completed',
  },
  {
    id: 'p3', title: 'Set Pieces & Corners', team: 'U18 Boys', date: '2025-06-03', duration: 60,
    location: 'Field A', attendees: 20, objectives: 'Corner routines, free kick variations',
    rating: 4, status: 'completed',
  },
  {
    id: 'p4', title: 'Attacking Transitions', team: 'U16 Girls', date: '2025-06-08', duration: 90,
    location: 'Field A', attendees: 0, objectives: 'Counter-attack drills, finishing runs',
    rating: 0, status: 'upcoming',
  },
  {
    id: 'p5', title: 'Goalkeeper Training', team: 'U14 Boys', date: '2025-06-09', duration: 60,
    location: 'Field C', attendees: 0, objectives: 'Shot-stopping, distribution, communication',
    rating: 0, status: 'upcoming',
  },
]

export default function PracticesPage() {
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ title: '', team: 'U16 Girls', date: '', duration: '90', location: '', objectives: '' })

  const filtered = filter === 'all' ? practices : practices.filter((p) => p.status === filter)

  return (
    <div>
      <Header title="Practice Planner" subtitle="Plan and track all team practices" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-40">
              <option value="all">All Practices</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Practice
          </Button>
        </div>

        <div className="grid gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
                    <Dumbbell className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{p.title}</h3>
                      <Badge variant={p.status === 'upcoming' ? 'info' : 'success'}>
                        {p.status}
                      </Badge>
                      <Badge variant="outline">{p.team}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{p.objectives}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{p.duration} min</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{p.location}</span>
                      {p.status === 'completed' && (
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" />{p.attendees} players</span>
                      )}
                      <span className="text-gray-400">{new Date(p.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.status === 'completed' && p.rating > 0 && (
                      <div className="flex text-yellow-400">
                        {Array.from({ length: p.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    )}
                    <Link href={`/dashboard/coach/practices/${p.id}`}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Practice Plan">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Practice Title</label>
            <Input placeholder="e.g. Passing & Possession" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Team</label>
              <Select value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}>
                <option>U16 Girls</option><option>U14 Boys</option><option>U18 Boys</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Duration (min)</label>
              <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="Field A" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Objectives</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="Practice goals and focus areas..."
              value={form.objectives}
              onChange={(e) => setForm({ ...form, objectives: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Create Practice</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
