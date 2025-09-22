import React from 'react'
import { cn } from '@/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-screen-2xl',
  full: 'max-w-full',
}

const paddingClasses = {
  none: '',
  sm: 'px-4 sm:px-6',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12',
  xl: 'px-8 sm:px-12 lg:px-16',
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  padding = 'md',
  className,
}) => {
  return (
    <div className={cn('mx-auto w-full', sizeClasses[size], paddingClasses[padding], className)}>
      {children}
    </div>
  )
}
