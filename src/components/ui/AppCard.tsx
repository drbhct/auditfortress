import React from 'react'
import { cn } from '@/utils/cn'

interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  header,
  footer,
  padding = 'md',
  shadow = 'md',
  className,
  ...props
}) => {
  return (
    <div
      className={cn('bg-white rounded-lg border border-gray-200', shadowClasses[shadow], className)}
      {...props}
    >
      {header && <div className="px-6 py-4 border-b border-gray-200">{header}</div>}

      <div className={cn(paddingClasses[padding])}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">{footer}</div>
      )}
    </div>
  )
}
