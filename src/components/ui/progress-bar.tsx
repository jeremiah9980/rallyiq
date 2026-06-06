import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showLabel?: boolean
}

export function ProgressBar({ value, max = 100, className, barClassName, showLabel }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className={cn('h-2 rounded-full bg-primary transition-all', barClassName)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-gray-500 text-right">{percent}%</p>
      )}
    </div>
  )
}
