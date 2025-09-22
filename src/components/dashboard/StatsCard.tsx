import React from 'react'
import { AppCard } from '@/components/ui/AppCard'
import {
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'

export interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon?: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo'
  description?: string
  onClick?: () => void
}

const colorClasses = {
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  red: 'bg-red-500 text-white',
  purple: 'bg-purple-500 text-white',
  indigo: 'bg-indigo-500 text-white',
}

const changeColorClasses = {
  increase: 'text-green-600',
  decrease: 'text-red-600',
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon = ChartBarIcon,
  color = 'blue',
  description,
  onClick,
}) => {
  return (
    <AppCard
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${onClick ? 'hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${changeColorClasses[change.type]}`}
                  >
                    {change.type === 'increase' ? (
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {change.type === 'increase' ? 'Increased' : 'Decreased'} by
                    </span>
                    {Math.abs(change.value)}%
                    <span className="ml-1 text-gray-500">{change.period}</span>
                  </div>
                )}
              </dd>
              {description && <dd className="mt-1 text-sm text-gray-600">{description}</dd>}
            </dl>
          </div>
        </div>
      </div>
    </AppCard>
  )
}

// Predefined stats cards for common metrics
export const DocumentStatsCard: React.FC<{
  count: number
  change?: StatsCardProps['change']
  onClick?: () => void
}> = ({ count, change, onClick }) => (
  <StatsCard
    title="Total Documents"
    value={count}
    change={change}
    icon={DocumentTextIcon}
    color="blue"
    description="Documents in your organization"
    onClick={onClick}
  />
)

export const UserStatsCard: React.FC<{
  count: number
  change?: StatsCardProps['change']
  onClick?: () => void
}> = ({ count, change, onClick }) => (
  <StatsCard
    title="Team Members"
    value={count}
    change={change}
    icon={UsersIcon}
    color="green"
    description="Active team members"
    onClick={onClick}
  />
)

export const ComplianceStatsCard: React.FC<{
  percentage: number
  change?: StatsCardProps['change']
  onClick?: () => void
}> = ({ percentage, change, onClick }) => (
  <StatsCard
    title="Compliance Score"
    value={`${percentage}%`}
    change={change}
    icon={CheckCircleIcon}
    color={percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red'}
    description="Overall compliance rating"
    onClick={onClick}
  />
)

export const PendingTasksStatsCard: React.FC<{
  count: number
  change?: StatsCardProps['change']
  onClick?: () => void
}> = ({ count, change, onClick }) => (
  <StatsCard
    title="Pending Tasks"
    value={count}
    change={change}
    icon={ClockIcon}
    color={count > 10 ? 'red' : count > 5 ? 'yellow' : 'green'}
    description="Tasks requiring attention"
    onClick={onClick}
  />
)

export const AlertsStatsCard: React.FC<{
  count: number
  change?: StatsCardProps['change']
  onClick?: () => void
}> = ({ count, change, onClick }) => (
  <StatsCard
    title="Active Alerts"
    value={count}
    change={change}
    icon={ExclamationTriangleIcon}
    color={count > 0 ? 'red' : 'green'}
    description="System alerts and notifications"
    onClick={onClick}
  />
)
