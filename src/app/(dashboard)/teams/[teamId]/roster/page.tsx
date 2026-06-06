'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Modal } from '@/components/ui/modal'
import { Plus, Search, Download, Mail } from 'lucide-react'

const players = [
  { number: '1', name: 'Aisha Patel', position: 'Goalkeeper', grade: '10', gpa: 3.8, height: "5'7\"", weight: '135 lbs', status: 'active', parent: 'Priya Patel' },
  { number: '4', name: 'Mia Johnson', position: 'Defender', grade: '11', gpa: 3.5, height: "5'5\"", weight: '128 lbs', status: 'active', parent: 'Lisa Johnson' },
  { number: '5', name: 'Grace Lee', position: 'Defender', grade: '10', gpa: 4.0, height: "5'6\"", weight: '130 lbs', status: 'active', parent: 'Susan Lee' },
  { number: '6', name: 'Lily Wilson', position: 'Midfielder', grade: '11', gpa: 3.2, height: "5'4\"", weight: '122 lbs', status: 'injured', parent: 'Tom Wilson' },
  { number: '7', name: 'Zoe Garcia', position: 'Midfielder', grade: '10', gpa: 3.7, height: "5'5\"", weight: '125 lbs', status: 'active', parent: 'Maria Garcia' },
  { number: '8', name: 'Emma Davis', position: 'Midfielder', grade: '11', gpa: 3.9, height: "5'6\"", weight: '127 lbs', status: 'active', parent: 'John Davis' },
  { number: '9', name: 'Chloe Brown', position: 'Forward', grade: '12', gpa: 3.4, height: "5'4\"", weight: '120 lbs', status: 'active', parent: 'Karen Brown' },
  { number: '10', name: 'Sophia Martinez', position: 'Forward', grade: '11', gpa: 3.6, height: "5'5\"", weight: '122 lbs', status: 'active', parent: 'Carlos Martinez' },
  { number: '11', name: 'Ava Thompson', position: 'Forward', grade: '10', gpa: 3.8, height: "5'3\"", weight: '118 lbs', status: 'active', parent: 'Dan Thompson' },
]

export default function RosterPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [sortKey, setSortKey] = useState<'number' | 'name' | 'position'>('number')

  const filtered = players
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.position.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a[sortKey].localeCompare(b[sortKey]))

  return (
    <div>
      <Header title="Team Roster" subtitle="U16 Girls Varsity" />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search players..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="outline" size="sm"><Mail className="h-4 w-4 mr-2" />Email All</Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Player
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      { key: 'number', label: '#' },
                      { key: 'name', label: 'Player' },
                      { key: 'position', label: 'Position' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="text-left font-medium text-gray-500 px-4 py-3 cursor-pointer hover:text-gray-900"
                        onClick={() => setSortKey(col.key as typeof sortKey)}
                      >
                        {col.label} {sortKey === col.key && '↑'}
                      </th>
                    ))}
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Grade</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">GPA</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Height / Weight</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">Parent</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-500">{p.number}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={p.name} size="sm" />
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.position}</td>
                      <td className="px-4 py-3 text-gray-600">{p.grade}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${p.gpa >= 3.5 ? 'text-green-600' : p.gpa >= 3.0 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {p.gpa}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.height} / {p.weight}</td>
                      <td className="px-4 py-3">
                        <Badge variant={p.status === 'active' ? 'success' : 'warning'}>{p.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.parent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Player">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-sm font-medium">Full Name</label><Input placeholder="Player name" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Jersey #</label><Input placeholder="#" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Position</label><Input placeholder="Forward, Midfielder..." /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Grade</label><Input placeholder="9-12" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Parent Name</label><Input placeholder="Parent / Guardian" /></div>
            <div className="space-y-1"><label className="text-sm font-medium">Parent Email</label><Input type="email" placeholder="parent@email.com" /></div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Add to Roster</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
