import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: LucideIcon
  iconColor?: string
  className?: string
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor, className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-6 shadow-card', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {Icon && (
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconColor || 'bg-primary-50')}>
            <Icon className={cn('h-5 w-5', iconColor ? 'text-white' : 'text-primary')} />
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className={cn('mt-1 text-sm', {
            'text-green-600': changeType === 'positive',
            'text-red-600': changeType === 'negative',
            'text-gray-500': changeType === 'neutral',
          })}>
            {change}
          </p>
        )}
      </div>
    </div>
  )
}
