import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { TrendingUp, Star, Target, CheckCircle, Plus } from 'lucide-react'

const summaries = [
  {
    player: 'Sophia Martinez', team: 'U16 Girls', period: 'Q2 2025', rating: 9,
    summary: 'Outstanding quarter. Sophia has shown tremendous growth in all areas. Her technical skills are now among the best in the age group.',
    strengths: ['First touch', 'Dribbling under pressure', 'Work rate', 'Leadership on field'],
    improvements: ['Right-foot finishing', 'Aerial duels'],
    goals: 'Earn starting spot in state tournament, improve shooting accuracy to 60%',
    trend: 'up',
  },
  {
    player: 'Liam Chen', team: 'U18 Boys', period: 'Q2 2025', rating: 8,
    summary: 'Strong quarter with noticeable tactical improvement. Liam has become more disciplined in his defensive work but still needs attention to positioning.',
    strengths: ['Passing range', 'Vision', 'Set piece delivery'],
    improvements: ['Defensive tracking', 'Aerial duels', 'Consistency'],
    goals: 'Maintain GPA above 3.5, improve defensive ratings, get noticed by D1 scouts',
    trend: 'up',
  },
  {
    player: 'Emma Davis', team: 'U16 Girls', period: 'Q2 2025', rating: 7,
    summary: 'Solid quarter with areas of growth. Mental resilience has been the standout improvement. Technical work needs continued focus.',
    strengths: ['Mental toughness', 'Team communication', 'Recovery runs'],
    improvements: ['First touch', 'Decision speed', 'Crossing accuracy'],
    goals: 'Earn consistent starting role, complete technical improvement plan',
    trend: 'stable',
  },
  {
    player: 'Noah Williams', team: 'U14 Boys', period: 'Q2 2025', rating: 8,
    summary: 'Exceptional physical development this quarter. Speed and stamina have improved dramatically. Now needs to match physical growth with tactical awareness.',
    strengths: ['Pace', 'Stamina', 'Defensive heading'],
    improvements: ['Ball distribution', 'Positional awareness', 'Confidence on ball'],
    goals: 'Develop comfortable ball-playing style, earn team captain consideration',
    trend: 'up',
  },
]

export default function DevelopmentPage() {
  return (
    <div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-none">
              <option>Q2 2025</option>
              <option>Q1 2025</option>
              <option>Q4 2024</option>
            </select>
            <select className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-none">
              <option>All Teams</option>
              <option>U16 Girls</option>
              <option>U18 Boys</option>
              <option>U14 Boys</option>
            </select>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />New Summary
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {summaries.map((s) => (
            <Card key={s.player} className="hover:shadow-card-hover transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar name={s.player} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle>{s.player}</CardTitle>
                      <Badge variant="outline">{s.period}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{s.team}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-primary">{s.rating}</div>
                    <div className="text-xs text-gray-400">/ 10</div>
                    {s.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mt-1" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{s.summary}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-green-600 uppercase mb-2">
                      <CheckCircle className="h-3.5 w-3.5" />Strengths
                    </div>
                    <ul className="space-y-1">
                      {s.strengths.map((str) => (
                        <li key={str} className="flex items-center gap-1.5 text-sm text-gray-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-400 flex-shrink-0" />
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 uppercase mb-2">
                      <Star className="h-3.5 w-3.5" />Improve
                    </div>
                    <ul className="space-y-1">
                      {s.improvements.map((imp) => (
                        <li key={imp} className="flex items-center gap-1.5 text-sm text-gray-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 uppercase mb-1">
                    <Target className="h-3.5 w-3.5" />Goals
                  </div>
                  <p className="text-sm text-blue-700">{s.goals}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
