import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, TrendingDown, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const reports = [
  { period: 'Q2 2025', revenue: 42500, expenses: 31200, donations: 18250, sponsorships: 15000 },
  { period: 'Q1 2025', revenue: 38900, expenses: 29800, donations: 12000, sponsorships: 12000 },
  { period: 'Q4 2024', revenue: 35200, expenses: 27500, donations: 8500, sponsorships: 10000 },
  { period: 'Q3 2024', revenue: 31800, expenses: 25100, donations: 7200, sponsorships: 9500 },
]

const byTeam = [
  { team: 'U18 Boys Premier', revenue: 15200, expenses: 11800 },
  { team: 'U16 Girls Varsity', revenue: 12500, expenses: 9200 },
  { team: 'U16 Boys Academy', revenue: 13800, expenses: 10500 },
  { team: 'U14 Boys Elite', revenue: 9800, expenses: 7600 },
  { team: 'U12 Girls Development', revenue: 7600, expenses: 6100 },
]

export default function FinancialsPage() {
  const latest = reports[0]
  const profit = latest.revenue - latest.expenses

  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export PDF</Button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="Q2 Revenue" value={formatCurrency(latest.revenue)} change="+9.3% vs Q1" changeType="positive" icon={TrendingUp} iconColor="bg-green-500" />
          <StatCard title="Q2 Expenses" value={formatCurrency(latest.expenses)} change="+4.7% vs Q1" changeType="negative" icon={TrendingDown} iconColor="bg-red-500" />
          <StatCard title="Donations" value={formatCurrency(latest.donations)} change="+52% vs Q1" changeType="positive" icon={DollarSign} iconColor="bg-blue-500" />
          <StatCard title="Net Profit" value={formatCurrency(profit)} change="Healthy margin" changeType="positive" icon={DollarSign} iconColor="bg-green-600" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Quarterly Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-100">
                    <tr>
                      {['Period', 'Revenue', 'Expenses', 'Donations', 'Sponsorships', 'Net'].map((h) => (
                        <th key={h} className="text-left font-medium text-gray-500 pb-2 pr-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.period} className="border-b border-gray-50">
                        <td className="py-2.5 pr-3 font-medium text-gray-900">{r.period}</td>
                        <td className="py-2.5 pr-3 text-green-600">{formatCurrency(r.revenue)}</td>
                        <td className="py-2.5 pr-3 text-red-500">{formatCurrency(r.expenses)}</td>
                        <td className="py-2.5 pr-3 text-blue-600">{formatCurrency(r.donations)}</td>
                        <td className="py-2.5 pr-3 text-purple-600">{formatCurrency(r.sponsorships)}</td>
                        <td className="py-2.5 font-bold text-gray-900">{formatCurrency(r.revenue - r.expenses)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Revenue by Team</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {byTeam.map((t) => (
                  <div key={t.team}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">{t.team}</span>
                      <span className="text-green-600 font-medium">{formatCurrency(t.revenue)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${(t.revenue / 16000) * 100}%` }} />
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">Expenses: {formatCurrency(t.expenses)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
