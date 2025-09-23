import React from 'react'
import { cn } from '@/utils/cn'

interface MetricsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center text-sm">
              {change.type !== 'neutral' && (
                <svg
                  className={cn(
                    'h-4 w-4 mr-1',
                    change.type === 'increase' ? 'text-green-500' : 'text-red-500'
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {change.type === 'increase' ? (
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              )}
              <span
                className={cn(
                  'font-medium',
                  change.type === 'increase' ? 'text-green-600' : 
                  change.type === 'decrease' ? 'text-red-600' : 
                  'text-gray-600'
                )}
              >
                {change.value}
              </span>
              {change.type !== 'neutral' && (
                <span className="text-gray-500 ml-1">from last month</span>
              )}
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </div>
  )
}
