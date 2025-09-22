import React from 'react'
import { cn } from '@/utils/cn'

interface FlexProps {
  children: React.ReactNode
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: {
    sm?: Partial<Pick<FlexProps, 'direction' | 'justify' | 'align' | 'wrap'>>
    md?: Partial<Pick<FlexProps, 'direction' | 'justify' | 'align' | 'wrap'>>
    lg?: Partial<Pick<FlexProps, 'direction' | 'justify' | 'align' | 'wrap'>>
    xl?: Partial<Pick<FlexProps, 'direction' | 'justify' | 'align' | 'wrap'>>
  }
  className?: string
}

const directionClasses = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
}

const justifyClasses = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const alignClasses = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
}

const wrapClasses = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const responsiveClasses = {
  sm: {
    direction: {
      row: 'sm:flex-row',
      col: 'sm:flex-col',
      'row-reverse': 'sm:flex-row-reverse',
      'col-reverse': 'sm:flex-col-reverse',
    },
    justify: {
      start: 'sm:justify-start',
      end: 'sm:justify-end',
      center: 'sm:justify-center',
      between: 'sm:justify-between',
      around: 'sm:justify-around',
      evenly: 'sm:justify-evenly',
    },
    align: {
      start: 'sm:items-start',
      end: 'sm:items-end',
      center: 'sm:items-center',
      baseline: 'sm:items-baseline',
      stretch: 'sm:items-stretch',
    },
    wrap: {
      wrap: 'sm:flex-wrap',
      nowrap: 'sm:flex-nowrap',
      'wrap-reverse': 'sm:flex-wrap-reverse',
    },
  },
  md: {
    direction: {
      row: 'md:flex-row',
      col: 'md:flex-col',
      'row-reverse': 'md:flex-row-reverse',
      'col-reverse': 'md:flex-col-reverse',
    },
    justify: {
      start: 'md:justify-start',
      end: 'md:justify-end',
      center: 'md:justify-center',
      between: 'md:justify-between',
      around: 'md:justify-around',
      evenly: 'md:justify-evenly',
    },
    align: {
      start: 'md:items-start',
      end: 'md:items-end',
      center: 'md:items-center',
      baseline: 'md:items-baseline',
      stretch: 'md:items-stretch',
    },
    wrap: {
      wrap: 'md:flex-wrap',
      nowrap: 'md:flex-nowrap',
      'wrap-reverse': 'md:flex-wrap-reverse',
    },
  },
  lg: {
    direction: {
      row: 'lg:flex-row',
      col: 'lg:flex-col',
      'row-reverse': 'lg:flex-row-reverse',
      'col-reverse': 'lg:flex-col-reverse',
    },
    justify: {
      start: 'lg:justify-start',
      end: 'lg:justify-end',
      center: 'lg:justify-center',
      between: 'lg:justify-between',
      around: 'lg:justify-around',
      evenly: 'lg:justify-evenly',
    },
    align: {
      start: 'lg:items-start',
      end: 'lg:items-end',
      center: 'lg:items-center',
      baseline: 'lg:items-baseline',
      stretch: 'lg:items-stretch',
    },
    wrap: {
      wrap: 'lg:flex-wrap',
      nowrap: 'lg:flex-nowrap',
      'wrap-reverse': 'lg:flex-wrap-reverse',
    },
  },
  xl: {
    direction: {
      row: 'xl:flex-row',
      col: 'xl:flex-col',
      'row-reverse': 'xl:flex-row-reverse',
      'col-reverse': 'xl:flex-col-reverse',
    },
    justify: {
      start: 'xl:justify-start',
      end: 'xl:justify-end',
      center: 'xl:justify-center',
      between: 'xl:justify-between',
      around: 'xl:justify-around',
      evenly: 'xl:justify-evenly',
    },
    align: {
      start: 'xl:items-start',
      end: 'xl:items-end',
      center: 'xl:items-center',
      baseline: 'xl:items-baseline',
      stretch: 'xl:items-stretch',
    },
    wrap: {
      wrap: 'xl:flex-wrap',
      nowrap: 'xl:flex-nowrap',
      'wrap-reverse': 'xl:flex-wrap-reverse',
    },
  },
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = 'nowrap',
  gap = 'none',
  responsive,
  className,
}) => {
  const getResponsiveClasses = () => {
    if (!responsive) return ''

    return Object.entries(responsive)
      .flatMap(([breakpoint, props]) =>
        Object.entries(props).map(
          ([prop, value]) =>
            responsiveClasses[breakpoint as keyof typeof responsiveClasses][
              prop as keyof typeof props
            ][value as any]
        ),
      )
      .join(' ')
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        wrapClasses[wrap],
        gapClasses[gap],
        getResponsiveClasses(),
        className
      )}
    >
      {children}
    </div>
  )
}

// Flex item component for specific flex properties
interface FlexItemProps {
  children: React.ReactNode
  grow?: boolean | number
  shrink?: boolean | number
  basis?: 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4'
  className?: string
}

const basisClasses = {
  auto: 'basis-auto',
  full: 'basis-full',
  '1/2': 'basis-1/2',
  '1/3': 'basis-1/3',
  '2/3': 'basis-2/3',
  '1/4': 'basis-1/4',
  '3/4': 'basis-3/4',
}

export const FlexItem: React.FC<FlexItemProps> = ({
  children,
  grow,
  shrink,
  basis = 'auto',
  className,
}) => {
  const getGrowClass = () => {
    if (grow === true) return 'flex-grow'
    if (grow === false) return 'flex-grow-0'
    if (typeof grow === 'number') return `flex-grow-${grow}`
    return ''
  }

  const getShrinkClass = () => {
    if (shrink === true) return 'flex-shrink'
    if (shrink === false) return 'flex-shrink-0'
    if (typeof shrink === 'number') return `flex-shrink-${shrink}`
    return ''
  }

  return (
    <div className={cn(getGrowClass(), getShrinkClass(), basisClasses[basis], className)}>
      {children}
    </div>
  )
}
