import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Trophy, DollarSign, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const teams = [
  { id: 't1', name: 'U16 Girls Varsity', sport: 'Soccer', ageGroup: 'U16', season: 'Spring 2025', players: 18, wins: 8, losses: 2, ties: 1, coach: 'Coach Rivera', budget: 18000, spent: 12500, status: 'active' },
  { id: 't2', name: 'U14 Boys Elite', sport: 'Soccer', ageGroup: 'U14', season: 'Spring 2025', players: 15, wins: 6, losses: 4, ties: 0, coach: 'Coach Smith', budget: 14000, spent: 9800, status: 'active' },
  { id: 't3', name: 'U18 Boys Premier', sport: 'Soccer', ageGroup: 'U18', season: 'Spring 2025', players: 22, wins: 11, losses: 1, ties: 2, coach: 'Coach Rivera', budget: 22000, spent: 15200, status: 'active' },
  { id: 't4', name: 'U12 Girls Development', sport: 'Soccer', ageGroup: 'U12', season: 'Spring 2025', players: 14, wins: 4, losses: 5, ties: 2, coach: 'Coach Lee', budget: 10000, spent: 7600, status: 'active' },
  { id: 't5', name: 'U10 Boys Recreational', sport: 'Soccer', ageGroup: 'U10', season: 'Spring 2025', players: 12, wins: 3, losses: 5, ties: 1, coach: 'Coach Brown', budget: 6000, spent: 4200, status: 'active' },
  { id: 't6', name: 'U16 Boys Academy', sport: 'Soccer', ageGroup: 'U16', season: 'Spring 2025', players: 20, wins: 7, losses: 3, ties: 1, coach: 'Coach Davis', budget: 20000, spent: 13800, status: 'active' },
]

export default function OrgTeamsPage() {
  return (
    <div>
      <Header title="All Teams" subtitle="Organization-wide team management" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500"><span className="font-bold text-gray-900">{teams.length}</span> teams</p>
          <Button><Plus className="h-4 w-4 mr-2" />Create Team</Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Team', 'Age Group', 'Players', 'Record', 'Coach', 'Budget', 'Spent', 'Status'].map((h) => (
                  <th key={h} className="text-left font-medium text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900">{t.name}</td>
                  <td className="px-4 py-3 text-gray-600">{t.ageGroup}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-gray-400" />{t.players}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">{t.wins}-{t.losses}-{t.ties}</td>
                  <td className="px-4 py-3 text-gray-500">{t.coach}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(t.budget)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${t.spent / t.budget > 0.8 ? 'text-orange-500' : 'text-green-600'}`}>
                      {formatCurrency(t.spent)}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge variant="success">{t.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
