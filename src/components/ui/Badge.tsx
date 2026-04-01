import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning'
  className?: string
}

export default function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'primary' && 'bg-primary-100 text-primary-800',
        variant === 'secondary' && 'bg-zinc-100 text-zinc-800',
        variant === 'outline' && 'border border-zinc-300 text-zinc-600',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'warning' && 'bg-amber-100 text-amber-800',
        className
      )}
    >
      {children}
    </span>
  )
}
