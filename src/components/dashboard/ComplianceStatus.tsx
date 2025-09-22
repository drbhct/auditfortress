import React from 'react'
import { AppCard } from '@/components/ui/AppCard'
import { AppButton } from '@/components/ui/AppButton'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

export interface ComplianceItem {
  id: string
  title: string
  description: string
  status: 'compliant' | 'non_compliant' | 'pending' | 'warning'
  lastChecked: string
  nextReview: string
  progress?: number
  requirements?: string[]
  issues?: string[]
}

interface ComplianceStatusProps {
  items: ComplianceItem[]
  overallScore: number
  isLoading?: boolean
  onViewDetails?: (itemId: string) => void
  onViewAll?: () => void
}

const statusConfig = {
  compliant: {
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Compliant',
  },
  non_compliant: {
    icon: XCircleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Non-Compliant',
  },
  pending: {
    icon: ClockIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: 'Pending',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'Warning',
  },
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const getScoreBgColor = (score: number) => {
  if (score >= 90) return 'bg-green-100'
  if (score >= 70) return 'bg-yellow-100'
  return 'bg-red-100'
}

export const ComplianceStatus: React.FC<ComplianceStatusProps> = ({
  items,
  overallScore,
  isLoading = false,
  onViewDetails,
  onViewAll,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusCounts = () => {
    return items.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  }

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return (
      <AppCard>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppCard>
    )
  }

  return (
    <AppCard>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Compliance Status</h3>
          </div>
          {onViewAll && (
            <AppButton
              variant="outline"
              size="sm"
              onClick={onViewAll}
              className="flex items-center gap-1"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </AppButton>
          )}
        </div>

        {/* Overall Score */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Compliance Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getScoreBgColor(overallScore)}`}
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = statusCounts[status] || 0
            const Icon = config.icon

            return (
              <div
                key={status}
                className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <div>
                    <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Compliance Items */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No compliance items</h3>
              <p className="mt-1 text-sm text-gray-500">
                Compliance tracking will appear here once configured.
              </p>
            </div>
          ) : (
            items.slice(0, 5).map(item => {
              const config = statusConfig[item.status]
              const Icon = config.icon

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => onViewDetails?.(item.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Last checked: {formatDate(item.lastChecked)}</span>
                          <span>Next review: {formatDate(item.nextReview)}</span>
                        </div>
                        {item.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{item.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${config.bgColor}`}
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}
                      >
                        {config.label}
                      </span>
                      {onViewDetails && <ArrowRightIcon className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </AppCard>
  )
}

// Mock data generator for testing
export const generateMockComplianceItems = (): ComplianceItem[] => [
  {
    id: '1',
    title: 'HIPAA Privacy Policy',
    description: 'Patient privacy protection compliance',
    status: 'compliant',
    lastChecked: '2024-01-15',
    nextReview: '2024-04-15',
    progress: 100,
    requirements: ['Privacy notice posted', 'Patient consent forms', 'Access controls implemented'],
  },
  {
    id: '2',
    title: 'Data Breach Response Plan',
    description: 'Incident response procedures',
    status: 'pending',
    lastChecked: '2024-01-10',
    nextReview: '2024-02-10',
    progress: 75,
    requirements: ['Response team assigned', 'Notification procedures', 'Recovery plan'],
  },
  {
    id: '3',
    title: 'Security Risk Assessment',
    description: 'Annual security evaluation',
    status: 'warning',
    lastChecked: '2023-12-01',
    nextReview: '2024-03-01',
    progress: 60,
    requirements: ['Vulnerability scan', 'Penetration testing', 'Remediation plan'],
    issues: ['Outdated security patches', 'Missing encryption on mobile devices'],
  },
  {
    id: '4',
    title: 'Employee Training Records',
    description: 'HIPAA training completion tracking',
    status: 'non_compliant',
    lastChecked: '2024-01-05',
    nextReview: '2024-01-20',
    progress: 30,
    requirements: ['Annual training completed', 'Certification records', 'Refresher training'],
    issues: ['5 employees missing training', '2 expired certifications'],
  },
]
