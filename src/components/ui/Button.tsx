import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
          variant === 'secondary' && 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500',
          variant === 'outline' && 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
          variant === 'ghost' && 'text-zinc-600 hover:bg-zinc-100 focus:ring-zinc-500',
          variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-5 py-2.5 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
