'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Dumbbell,
  Users,
  UserCircle,
  DollarSign,
  Binoculars,
  Building2,
  Plug,
  ChevronDown,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'RallyIQ Coach',
    href: '/dashboard/coach',
    icon: Dumbbell,
    color: 'text-blue-500',
    children: [
      { label: 'Overview', href: '/dashboard/coach' },
      { label: 'Practice Planner', href: '/dashboard/coach/practices' },
      { label: 'Player Notes', href: '/dashboard/coach/notes' },
      { label: 'Development', href: '/dashboard/coach/development' },
    ],
  },
  {
    label: 'RallyIQ Teams',
    href: '/dashboard/teams',
    icon: Users,
    color: 'text-green-500',
    children: [
      { label: 'All Teams', href: '/dashboard/teams' },
    ],
  },
  {
    label: 'RallyIQ Profiles',
    href: '/dashboard/profiles',
    icon: UserCircle,
    color: 'text-purple-500',
    children: [
      { label: 'Athletes', href: '/dashboard/profiles' },
    ],
  },
  {
    label: 'RallyIQ Fundraise',
    href: '/dashboard/fundraise',
    icon: DollarSign,
    color: 'text-yellow-500',
    children: [
      { label: 'Dashboard', href: '/dashboard/fundraise' },
      { label: 'Campaigns', href: '/dashboard/fundraise/campaigns' },
      { label: 'Sponsors', href: '/dashboard/fundraise/sponsors' },
      { label: 'Boosters', href: '/dashboard/fundraise/boosters' },
    ],
  },
  {
    label: 'RallyIQ Scout',
    href: '/dashboard/scout',
    icon: Binoculars,
    color: 'text-red-500',
    children: [
      { label: 'Overview', href: '/dashboard/scout' },
      { label: 'Roster Intel', href: '/dashboard/scout/roster-intel' },
      { label: 'Competitors', href: '/dashboard/scout/competitors' },
      { label: 'Tryouts', href: '/dashboard/scout/tryouts' },
    ],
  },
  {
    label: 'RallyIQ Org',
    href: '/dashboard/org',
    icon: Building2,
    color: 'text-indigo-500',
    children: [
      { label: 'Dashboard', href: '/dashboard/org' },
      { label: 'Teams', href: '/dashboard/org/teams' },
      { label: 'Financials', href: '/dashboard/org/financials' },
      { label: 'Sponsors', href: '/dashboard/org/sponsors' },
    ],
  },
  {
    label: 'RallyIQ Integrations',
    href: '/dashboard/integrations',
    icon: Plug,
    color: 'text-orange-500',
    children: [
      { label: 'Hub', href: '/dashboard/integrations' },
      { label: 'GameChanger', href: '/dashboard/integrations/gamechanger' },
      { label: 'Band', href: '/dashboard/integrations/band' },
      { label: 'NCS', href: '/dashboard/integrations/ncs' },
      { label: 'Social Media', href: '/dashboard/integrations/social' },
      { label: 'Branding', href: '/dashboard/integrations/branding' },
      { label: 'Video Highlights', href: '/dashboard/integrations/video-highlights' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string[]>([])

  function toggle(href: string) {
    setExpanded((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    )
  }

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-dark">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">RallyIQ</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          const open = expanded.includes(item.href)

          if (!item.children) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          }

          return (
            <div key={item.href}>
              <button
                onClick={() => toggle(item.href)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                )}
              >
                <Icon className={cn('h-5 w-5', active ? 'text-white' : item.color)} />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
                />
              </button>
              {open && (
                <div className="ml-8 mt-1 space-y-1 border-l border-gray-700 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'block rounded-lg px-2 py-1.5 text-sm transition-colors',
                        pathname === child.href
                          ? 'text-white font-medium'
                          : 'text-gray-500 hover:text-gray-300',
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            JC
          </div>
          <div>
            <p className="text-sm font-medium text-white">Jeremiah C.</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
