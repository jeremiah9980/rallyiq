'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Avatar } from '@/components/ui/avatar'
import { Plus, Search, Filter } from 'lucide-react'

const notes = [
  { id: 1, player: 'Sophia Martinez', team: 'U16 Girls', content: 'Excellent footwork improvement this week. First touch is notably cleaner. Ready for tournament starter role.', category: 'technical', date: 'Jun 5, 2025', coach: 'Coach Rivera' },
  { id: 2, player: 'Liam Chen', team: 'U18 Boys', content: 'Needs work on defensive positioning when the ball is on the far side. Schedule 1-on-1 session to address tracking runs.', category: 'tactical', date: 'Jun 4, 2025', coach: 'Coach Rivera' },
  { id: 3, player: 'Emma Davis', team: 'U16 Girls', content: 'Mental toughness under pressure showing great signs. Responded well to adversity in last week\'s scrimmage. Keep encouraging.', category: 'mental', date: 'Jun 3, 2025', coach: 'Coach Smith' },
  { id: 4, player: 'Noah Williams', team: 'U14 Boys', content: 'Sprint pace has improved noticeably. Needs to channel energy into positional discipline during attacking phases.', category: 'physical', date: 'Jun 2, 2025', coach: 'Coach Rivera' },
  { id: 5, player: 'Aisha Patel', team: 'U16 Girls', content: 'Shot distribution on goal kicks inconsistent. Work on non-dominant foot. Otherwise commanding in goal.', category: 'technical', date: 'Jun 1, 2025', coach: 'Coach Smith' },
  { id: 6, player: 'Mia Johnson', team: 'U16 Girls', content: 'Great teammate, always encouraging others. Leadership potential. Consider captain for next season.', category: 'leadership', date: 'May 30, 2025', coach: 'Coach Rivera' },
]

const categoryColors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'danger'> = {
  technical: 'default', tactical: 'warning', mental: 'info', physical: 'success', leadership: 'danger',
}

export default function NotesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ player: '', content: '', category: 'technical' })

  const filtered = notes.filter((n) => {
    const matchSearch = n.player.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || n.category === category
    return matchSearch && matchCat
  })

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search notes or players..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-40">
            <option value="all">All Categories</option>
            <option value="technical">Technical</option>
            <option value="tactical">Tactical</option>
            <option value="mental">Mental</option>
            <option value="physical">Physical</option>
            <option value="leadership">Leadership</option>
          </Select>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Note
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n) => (
            <Card key={n.id} className="hover:shadow-card-hover transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={n.player} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{n.player}</p>
                    <p className="text-xs text-gray-500">{n.team}</p>
                  </div>
                  <Badge variant={categoryColors[n.category] || 'default'}>{n.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{n.content}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>{n.coach}</span>
                  <span>{n.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Filter className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            No notes found matching your filters.
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Player Note">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Player Name</label>
            <Input placeholder="Search for player..." value={form.player} onChange={(e) => setForm({ ...form, player: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="technical">Technical</option>
              <option value="tactical">Tactical</option>
              <option value="mental">Mental</option>
              <option value="physical">Physical</option>
              <option value="leadership">Leadership</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Note</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={4}
              placeholder="Write your observation..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Save Note</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
