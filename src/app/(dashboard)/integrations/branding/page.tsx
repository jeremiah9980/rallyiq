'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Download, Save, Palette, Type, Image } from 'lucide-react'
import Link from 'next/link'

const templates = [
  { id: 't1', name: 'Game Day Announcement', type: 'social', preview: '⚽ MATCH DAY', lastUsed: 'Jun 5' },
  { id: 't2', name: 'Win Celebration', type: 'social', preview: '🏆 WE WON!', lastUsed: 'Jun 3' },
  { id: 't3', name: 'Practice Notice', type: 'notification', preview: '📣 PRACTICE', lastUsed: 'Jun 2' },
  { id: 't4', name: 'Tournament Bracket', type: 'print', preview: '📊 BRACKET', lastUsed: 'May 28' },
]

export default function BrandingPage() {
  const [primaryColor, setPrimaryColor] = useState('#1a56db')
  const [accentColor, setAccentColor] = useState('#ff6b35')
  const [fontFamily, setFontFamily] = useState('Inter')

  return (
    <div>
      <Header title="Branding Editor" subtitle="Manage team design assets and templates" />
      <div className="p-6 space-y-6">
        <Link href="/dashboard/integrations"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Color & Font Controls */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-purple-500" />Colors & Typography</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-10 w-12 rounded cursor-pointer" />
                    <Input value={accentColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Font Family</label>
                  <select className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Montserrat</option>
                    <option>Oswald</option>
                    <option>Impact</option>
                  </select>
                </div>

                {/* Preview */}
                <div className="rounded-xl p-4 text-white text-center" style={{ backgroundColor: primaryColor }}>
                  <p className="text-xs opacity-70 mb-1">Preview</p>
                  <p className="text-lg font-bold" style={{ fontFamily }}>Riverside SC</p>
                  <div className="mt-2 rounded-lg px-3 py-1 text-sm font-medium inline-block" style={{ backgroundColor: accentColor }}>Game Day</div>
                </div>

                <Button className="w-full"><Save className="h-4 w-4 mr-2" />Save Branding</Button>
              </div>
            </CardContent>
          </Card>

          {/* Logo */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Image className="h-5 w-5 text-blue-500" />Logo & Assets</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-50/30 transition-colors">
                  <Image className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Drop logo here</p>
                  <p className="text-xs text-gray-400">PNG, SVG up to 5MB</p>
                  <Button variant="outline" size="sm" className="mt-3">Browse Files</Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Primary', 'White', 'Dark'].map((variant) => (
                    <div key={variant} className={`rounded-lg aspect-square flex items-center justify-center text-xs font-medium ${
                      variant === 'Primary' ? 'bg-primary text-white' :
                      variant === 'White' ? 'border border-gray-200 bg-white text-gray-600' :
                      'bg-gray-900 text-white'
                    }`}>
                      {variant}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full"><Download className="h-4 w-4 mr-2" />Download Brand Kit</Button>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Type className="h-5 w-5 text-green-500" />Templates</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templates.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-gray-200 text-lg flex-shrink-0">
                      {t.preview.split(' ')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{t.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">{t.type}</Badge>
                        <span className="text-xs text-gray-400">Used {t.lastUsed}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">Edit</Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">+ New Template</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
