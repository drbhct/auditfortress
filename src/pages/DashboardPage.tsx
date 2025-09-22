import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/ui/AppButton'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'
import { useAnalytics } from '@/hooks/useAnalytics'
import {
  StatsCard,
  DocumentStatsCard,
  UserStatsCard,
  ComplianceStatsCard,
  PendingTasksStatsCard,
  AlertsStatsCard,
  ActivityTimeline,
  QuickActions,
  getDefaultQuickActions,
  ComplianceStatus,
  generateMockComplianceItems,
} from '@/components/dashboard'
import {
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { userDisplayName, logout, profile, organization } = useAuth()
  const { isSuperAdmin, isAccountOwner, canManageTemplates } = usePermissions()
  const {
    metrics,
    isLoadingMetrics,
    metricsError,
    activities,
    isLoadingActivities,
    activitiesError,
    refreshAll,
  } = useAnalytics()

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshAll()
    setIsRefreshing(false)
  }

  const handleViewDocuments = () => {
    navigate('/documents')
  }

  const handleManageTemplates = () => {
    navigate('/superadmin/templates')
  }

  const handleSuperAdminPanel = () => {
    navigate('/superadmin')
  }

  const handleViewAnalytics = () => {
    // TODO: Navigate to analytics page
    console.log('Navigate to analytics page')
  }

  const handleViewAllActivity = () => {
    // TODO: Navigate to activity page
    console.log('Navigate to activity page')
  }

  const handleComplianceDetails = (itemId: string) => {
    // TODO: Navigate to compliance details
    console.log('Navigate to compliance details:', itemId)
  }

  const handleViewAllCompliance = () => {
    // TODO: Navigate to compliance page
    console.log('Navigate to compliance page')
  }

  // Get user role for quick actions
  const getUserRole = () => {
    if (isSuperAdmin) return 'superadmin'
    if (isAccountOwner) return 'account_owner'
    return 'user'
  }

  const quickActions = getDefaultQuickActions(getUserRole()).map(action => ({
    ...action,
    onClick: () => {
      switch (action.id) {
        case 'create-document':
        case 'view-documents':
          handleViewDocuments()
          break
        case 'manage-templates':
          handleManageTemplates()
          break
        case 'view-analytics':
          handleViewAnalytics()
          break
        case 'system-settings':
        case 'organization-settings':
          // TODO: Navigate to settings
          console.log('Navigate to settings')
          break
        default:
          action.onClick()
      }
    },
  }))

  const complianceItems = generateMockComplianceItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userDisplayName}!</p>
            </div>
            <div className="flex items-center space-x-3">
              <AppButton
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </AppButton>
              <AppButton onClick={handleLogout} variant="outline">
                Sign Out
              </AppButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Error States */}
          {(metricsError || activitiesError) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {metricsError && <p>Metrics: {metricsError}</p>}
                    {activitiesError && <p>Activities: {activitiesError}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingMetrics ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : metrics ? (
              <>
                <DocumentStatsCard
                  count={metrics.documents.total}
                  change={{
                    value: metrics.documents.change,
                    type: metrics.documents.change >= 0 ? 'increase' : 'decrease',
                    period: 'vs last month',
                  }}
                  onClick={handleViewDocuments}
                />
                <UserStatsCard
                  count={metrics.users.total}
                  change={{
                    value: metrics.users.change,
                    type: metrics.users.change >= 0 ? 'increase' : 'decrease',
                    period: 'this month',
                  }}
                />
                <ComplianceStatsCard
                  percentage={metrics.compliance.overallScore}
                  change={{
                    value: metrics.compliance.change,
                    type: metrics.compliance.change >= 0 ? 'increase' : 'decrease',
                    period: 'vs last month',
                  }}
                  onClick={handleViewAllCompliance}
                />
                <PendingTasksStatsCard
                  count={metrics.compliance.pendingItems + metrics.compliance.warningItems}
                  onClick={() => console.log('View pending tasks')}
                />
              </>
            ) : null}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Activity and Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <ActivityTimeline
                activities={activities}
                isLoading={isLoadingActivities}
                onViewAll={handleViewAllActivity}
                maxItems={8}
              />

              <QuickActions
                actions={quickActions}
                title="Quick Actions"
                description="Common tasks and shortcuts"
                columns={2}
              />
            </div>

            {/* Right Column - Compliance Status */}
            <div className="space-y-6">
              <ComplianceStatus
                items={complianceItems}
                overallScore={metrics?.compliance.overallScore || 87}
                onViewDetails={handleComplianceDetails}
                onViewAll={handleViewAllCompliance}
              />
            </div>
          </div>

          {/* Additional Stats for SuperAdmin */}
          {isSuperAdmin && metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="System Uptime"
                value={`${metrics.performance?.uptime || 99.9}%`}
                icon={CheckCircleIcon}
                color="green"
                description="Last 30 days"
              />
              <StatsCard
                title="Average Load Time"
                value={`${metrics.performance?.averageLoadTime || 1.2}s`}
                icon={ClockIcon}
                color="blue"
                description="Page load performance"
              />
              <StatsCard
                title="Error Rate"
                value={`${metrics.performance?.errorRate || 0.1}%`}
                icon={ExclamationTriangleIcon}
                color={
                  metrics.performance?.errorRate && metrics.performance.errorRate > 1
                    ? 'red'
                    : 'green'
                }
                description="System errors"
              />
            </div>
          )}

          {/* Debug Info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 bg-gray-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Debug Info:</h4>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(
                  {
                    isSuperAdmin,
                    isAccountOwner,
                    canManageTemplates,
                    organizationStatus: organization?.status,
                    organizationType: organization?.type,
                    metricsLoaded: !!metrics,
                    activitiesLoaded: activities.length > 0,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
