import {
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CpuChipIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { MetricsCard } from '@/components/ui/MetricsCard'
import { 
  OrganizationGrowthChart, 
  SystemHealthMonitor, 
  UserActivityAnalytics,
  RevenueAnalytics,
  PlatformUsageStats
} from '@/components/charts'
import { 
  useDashboardMetrics,
  useUserActivityData,
  useOrganizationGrowthData,
  useRevenueData,
  useSystemHealth,
  useRefreshDashboard
} from '@/hooks/useSuperAdmin'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AppButton } from '@/components/ui/AppButton'

// Helper function to format change percentage
const formatChange = (change: number): { value: string; type: 'increase' | 'decrease' | 'neutral' } => {
  if (change > 0) return { value: `+${change.toFixed(1)}%`, type: 'increase' }
  if (change < 0) return { value: `${change.toFixed(1)}%`, type: 'decrease' }
  return { value: '0%', type: 'neutral' }
}

const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Data hooks
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics()
  const { data: userActivityData } = useUserActivityData(30)
  const { data: organizationGrowthData } = useOrganizationGrowthData(30)
  const { data: revenueData } = useRevenueData(30)
  const { data: systemHealthData } = useSystemHealth()
  const refreshDashboard = useRefreshDashboard()

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const handleRefresh = () => {
    refreshDashboard()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'analytics', label: 'User Analytics', icon: UserGroupIcon },
    { id: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon },
    { id: 'usage', label: 'Platform Usage', icon: DocumentTextIcon },
    { id: 'system', label: 'System Health', icon: CpuChipIcon },
  ]

  // Show loading state
  if (metricsLoading) {
    return (
      <SuperAdminLayout>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </SuperAdminLayout>
    )
  }

  // Show error state
  if (metricsError) {
    return (
      <SuperAdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">Error loading dashboard data</div>
            <div className="text-gray-500 text-sm">{metricsError.message}</div>
            <AppButton
              onClick={handleRefresh}
              className="mt-4"
              leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            >
              Try Again
            </AppButton>
          </div>
        </div>
      </SuperAdminLayout>
    )
  }

  // Format metrics data for MetricsCard
  const metricsData = metrics ? {
    totalOrganizations: {
      value: metrics.organizations.total,
      change: formatChange(metrics.organizations.change),
    },
    activeUsers: {
      value: metrics.users.active,
      change: formatChange(metrics.users.change),
    },
    templatesPublished: {
      value: metrics.templates.published,
      change: formatChange(metrics.templates.change),
    },
    systemUptime: {
      value: `${metrics.system.uptime}%`,
      change: { value: `${metrics.system.responseTime}ms avg`, type: 'neutral' as const },
    },
  } : null

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
            <p className="text-gray-600">Last updated: {currentTime}</p>
          </div>
          <AppButton
            onClick={handleRefresh}
            variant="outline"
            leftIcon={<ArrowPathIcon className="h-4 w-4" />}
          >
            Refresh
          </AppButton>
        </div>

        {/* Metrics Cards */}
        {metricsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Organizations"
              value={metricsData.totalOrganizations.value}
              change={metricsData.totalOrganizations.change}
              icon={BuildingOfficeIcon}
              iconColor="text-blue-600"
            />
            <MetricsCard
              title="Active Users"
              value={metricsData.activeUsers.value}
              change={metricsData.activeUsers.change}
              icon={UsersIcon}
              iconColor="text-green-600"
            />
            <MetricsCard
              title="Templates Published"
              value={metricsData.templatesPublished.value}
              change={metricsData.templatesPublished.change}
              icon={DocumentTextIcon}
              iconColor="text-purple-600"
            />
            <MetricsCard
              title="System Uptime"
              value={metricsData.systemUptime.value}
              change={metricsData.systemUptime.change}
              icon={CpuChipIcon}
              iconColor="text-emerald-600"
            />
          </div>
        )}

        {/* Tabbed Analytics Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <OrganizationGrowthChart data={organizationGrowthData} />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <UserActivityAnalytics data={userActivityData} />
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <RevenueAnalytics data={revenueData} />
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                <PlatformUsageStats />
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <SystemHealthMonitor data={systemHealthData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  )
}

export default SuperAdminDashboard