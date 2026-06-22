'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Mail, MessageSquare, Bell, Plus, Send } from 'lucide-react'

const messages = [
  { id: 1, subject: 'Tournament Registration Confirmed', body: 'Great news! We are officially registered for the Spring Invitational on June 14-16. Please confirm availability by June 10th.', type: 'email', sentBy: 'Coach Rivera', sentAt: 'Jun 3, 2025', recipients: 'All Players & Parents' },
  { id: 2, subject: 'Practice Time Change - Jun 6', body: 'Please note: Thursday\'s practice has been moved to 5:00 PM instead of 4:00 PM due to field availability.', type: 'sms', sentBy: 'Coach Rivera', sentAt: 'Jun 2, 2025', recipients: 'All Parents' },
  { id: 3, subject: 'Game Recap - Northside Win!', body: 'Amazing performance today! Final score 2-0. Sophia with 2 goals, Aisha with a clean sheet. Full highlights coming soon.', type: 'notification', sentBy: 'Coach Rivera', sentAt: 'Jun 5, 2025', recipients: 'All Players & Parents' },
  { id: 4, subject: 'Uniform Pickup Reminder', body: 'New team uniforms are ready for pickup at the equipment room. Please pick up before Saturday\'s game.', type: 'email', sentBy: 'Team Admin', sentAt: 'May 30, 2025', recipients: 'All Players' },
]

const typeConfig = {
  email: { icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Email' },
  sms: { icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50', label: 'SMS' },
  notification: { icon: Bell, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Push' },
}

export default function CommunicationsPage() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ subject: '', body: '', type: 'email', recipients: 'all' })

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{messages.length} messages sent this season</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />New Message
          </Button>
        </div>

        <div className="space-y-4">
          {messages.map((m) => {
            const config = typeConfig[m.type as keyof typeof typeConfig]
            const Icon = config.icon
            return (
              <Card key={m.id} className="hover:shadow-card-hover transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg} flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900">{m.subject}</h3>
                        <Badge variant="outline">{config.label}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{m.body}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>By {m.sentBy}</span>
                        <span>{m.sentAt}</span>
                        <span>→ {m.recipients}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Message" className="max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <select className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-none" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="notification">Push Notification</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Recipients</label>
              <select className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-none" value={form.recipients} onChange={(e) => setForm({ ...form, recipients: e.target.value })}>
                <option value="all">All Players & Parents</option>
                <option value="parents">Parents Only</option>
                <option value="players">Players Only</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Subject</label>
            <Input placeholder="Message subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={5}
              placeholder="Write your message..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>
              <Send className="h-4 w-4 mr-2" />Send Message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
