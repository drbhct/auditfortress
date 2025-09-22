import React from 'react'
import { AppCard } from '@/components/ui/AppCard'
import {
  DocumentTextIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

export interface ActivityItem {
  id: string
  type: 'document' | 'user' | 'system' | 'compliance' | 'alert'
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  status?: 'completed' | 'pending' | 'failed' | 'warning'
  action?: {
    label: string
    onClick: () => void
  }
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  isLoading?: boolean
  onViewAll?: () => void
  maxItems?: number
}

const activityIcons = {
  document: DocumentTextIcon,
  user: UserIcon,
  system: CheckCircleIcon,
  compliance: CheckCircleIcon,
  alert: ExclamationTriangleIcon,
}

const statusColors = {
  completed: 'text-green-600',
  pending: 'text-yellow-600',
  failed: 'text-red-600',
  warning: 'text-orange-600',
}

const typeColors = {
  document: 'bg-blue-100 text-blue-600',
  user: 'bg-green-100 text-green-600',
  system: 'bg-gray-100 text-gray-600',
  compliance: 'bg-purple-100 text-purple-600',
  alert: 'bg-red-100 text-red-600',
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  isLoading = false,
  onViewAll,
  maxItems = 10,
}) => {
  const displayActivities = activities.slice(0, maxItems)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <AppCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppCard>
    )
  }

  return (
    <AppCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500">
              Activity will appear here as you and your team work.
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {displayActivities.map((activity, activityIdx) => {
                const Icon = activityIcons[activity.type]
                const isLast = activityIdx === displayActivities.length - 1

                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {!isLast && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${typeColors[activity.type]}`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500">
                                  {formatTimestamp(activity.timestamp)}
                                </p>
                                {activity.status && (
                                  <span
                                    className={`text-xs font-medium ${statusColors[activity.status]}`}
                                  >
                                    {activity.status}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                            {activity.user && (
                              <div className="flex items-center mt-2">
                                <div className="flex-shrink-0">
                                  {activity.user.avatar ? (
                                    <img
                                      className="h-5 w-5 rounded-full"
                                      src={activity.user.avatar}
                                      alt={activity.user.name}
                                    />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
                                      <UserIcon className="h-3 w-3 text-gray-600" />
                                    </div>
                                  )}
                                </div>
                                <p className="ml-2 text-xs text-gray-500">
                                  by {activity.user.name}
                                </p>
                              </div>
                            )}
                            {activity.action && (
                              <div className="mt-2">
                                <button
                                  onClick={activity.action.onClick}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {activity.action.label}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </AppCard>
  )
}
