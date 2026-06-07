'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { label: '📊 Dashboard', href: '/dashboard', exact: true },
  {
    label: '💬 Coach AI',
    href: '/dashboard/coach',
    children: [
      { label: 'AI Chat', href: '/dashboard/coach' },
      { label: 'Practice Planner', href: '/dashboard/coach/practices' },
    ],
  },
  {
    label: '🏆 Teams',
    href: '/dashboard/teams',
    children: [
      { label: 'All Teams', href: '/dashboard/teams' },
    ],
  },
  {
    label: '👤 Profiles',
    href: '/dashboard/profiles',
    children: [
      { label: 'Athletes', href: '/dashboard/profiles' },
    ],
  },
  {
    label: '💰 Fundraise',
    href: '/dashboard/fundraise',
    children: [
      { label: 'Overview', href: '/dashboard/fundraise' },
    ],
  },
  {
    label: '🔍 Drill Library',
    href: '/dashboard/scout',
    children: [
      { label: 'Drill Library', href: '/dashboard/scout' },
    ],
  },
  {
    label: '🏢 Org',
    href: '/dashboard/org',
    children: [
      { label: 'Overview', href: '/dashboard/org' },
    ],
  },
  {
    label: '🔗 Integrations',
    href: '/dashboard/integrations',
    children: [
      { label: 'Hub', href: '/dashboard/integrations' },
    ],
  },
]

interface SidebarProps {
  teamName?: string
}

export function Sidebar({ teamName }: SidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<string[]>([
    '/dashboard/coach', '/dashboard/teams', '/dashboard/fundraise',
  ])

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
    <aside
      style={{
        width: 240,
        minWidth: 240,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          ⚡ Rally<span style={{ color: 'var(--red3)' }}>IQ</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: '.3px' }}>
          Run the team. Not the chaos.
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 8px',
          scrollbarWidth: 'thin',
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          const open = expanded.includes(item.href)

          if (!item.children) {
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 2,
                  color: active ? '#fff' : 'var(--text2)',
                  background: active ? 'var(--red)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all .15s',
                }}
              >
                {item.label}
              </Link>
            )
          }

          return (
            <div key={item.href} style={{ marginBottom: 2 }}>
              <button
                onClick={() => toggle(item.href)}
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  color: active ? 'var(--text)' : 'var(--text2)',
                  transition: 'all .15s',
                  textAlign: 'left',
                }}
              >
                <span style={{ flex: 1 }}>{item.label}</span>
                <span
                  style={{
                    fontSize: 10,
                    transition: 'transform .15s',
                    transform: open ? 'rotate(90deg)' : 'rotate(0)',
                    opacity: 0.5,
                  }}
                >
                  ▶
                </span>
              </button>
              {open && (
                <div
                  style={{
                    marginLeft: 20,
                    paddingLeft: 12,
                    borderLeft: '1px solid var(--border)',
                    marginTop: 2,
                    marginBottom: 4,
                  }}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      style={{
                        display: 'block',
                        padding: '6px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        marginBottom: 1,
                        color: pathname === child.href ? 'var(--text)' : 'var(--text3)',
                        fontWeight: pathname === child.href ? 600 : 400,
                        textDecoration: 'none',
                        transition: 'color .15s',
                      }}
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

      {/* Bottom */}
      <div
        style={{
          padding: 16,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          JC
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Coach Cargill</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{teamName || 'Cortinas 10U'}</div>
        </div>
      </div>
    </aside>
  )
}
