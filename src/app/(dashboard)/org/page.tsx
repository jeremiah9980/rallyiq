import { Header } from '@/components/layout/header'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Users, DollarSign, TrendingUp, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

const teams = [
  { name: 'U16 Girls Varsity', players: 18, record: '8-2-1', revenue: 12500, coach: 'Coach Rivera' },
  { name: 'U14 Boys Elite', players: 15, record: '6-4-0', revenue: 9800, coach: 'Coach Smith' },
  { name: 'U18 Boys Premier', players: 22, record: '11-1-2', revenue: 15200, coach: 'Coach Rivera' },
  { name: 'U12 Girls Development', players: 14, record: '4-5-2', revenue: 7600, coach: 'Coach Lee' },
]

export default function OrgPage() {
  return (
    <div>
      <Header title="RallyIQ Org" subtitle="Riverside Soccer Club — Multi-team dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Total Teams" value="8" change="4 displayed" changeType="neutral" icon={Building2} iconColor="bg-indigo-500" />
          <StatCard title="Total Athletes" value="142" change="+14 from last season" changeType="positive" icon={Users} iconColor="bg-blue-500" />
          <StatCard title="YTD Revenue" value={formatCurrency(89450)} change="+12% vs last year" changeType="positive" icon={DollarSign} iconColor="bg-green-500" />
          <StatCard title="Overall Win Rate" value="68%" change="Above target" changeType="positive" icon={TrendingUp} iconColor="bg-yellow-500" />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Overview</CardTitle>
              <Link href="/dashboard/org/teams">
                <Button variant="ghost" size="sm">All Teams <ChevronRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 pb-2">Team</th>
                    <th className="text-left font-medium text-gray-500 pb-2">Players</th>
                    <th className="text-left font-medium text-gray-500 pb-2">Record</th>
                    <th className="text-left font-medium text-gray-500 pb-2">Revenue</th>
                    <th className="text-left font-medium text-gray-500 pb-2">Coach</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((t) => (
                    <tr key={t.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">{t.name}</td>
                      <td className="py-3 text-gray-600">{t.players}</td>
                      <td className="py-3"><span className="font-mono text-gray-700">{t.record}</span></td>
                      <td className="py-3 text-green-600 font-medium">{formatCurrency(t.revenue)}</td>
                      <td className="py-3 text-gray-500">{t.coach}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: 'Teams Management', href: '/dashboard/org/teams', desc: 'View all teams, coaches, rosters' },
            { title: 'Financial Reports', href: '/dashboard/org/financials', desc: 'Revenue, expenses, budgets' },
            { title: 'Sponsor Portal', href: '/dashboard/org/sponsors', desc: 'Org-level sponsor relationships' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto text-primary">
                  View <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
