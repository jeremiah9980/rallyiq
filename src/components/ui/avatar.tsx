import { cn } from '@/lib/utils'

interface AvatarProps {
  name: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const colors = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
]

function getColor(name: string): string {
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

export function Avatar({ name, imageUrl, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold text-white',
        sizeClasses[size],
        getColor(name),
        className,
      )}
    >
      {getInitials(name)}
    </div>
  )
}
