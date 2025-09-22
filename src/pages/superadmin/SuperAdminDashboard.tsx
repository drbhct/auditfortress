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
import { MetricsCard } from '@/components/superadmin/MetricsCard'
import { 
  OrganizationGrowthChart, 
  SystemHealthMonitor, 
  UserActivityAnalytics,
  RevenueAnalytics,
  PlatformUsageStats
} from '@/components/charts'

// Mock data matching your screenshot
const metricsData = {
  totalOrganizations: {
    value: 1247,
    change: { value: '12%', type: 'increase' as const },
  },
  activeUsers: {
    value: 8934,
    change: { value: '8%', type: 'increase' as const },
  },
  documentsGenerated: {
    value: 15623,
    change: { value: '23%', type: 'increase' as const },
  },
  monthlyRevenue: {
    value: '$89,450',
    change: { value: '15%', type: 'increase' as const },
  },
}

// Mock chart data for Organization Growth
const organizationGrowthData = [
  { month: 'Jan', value: 95 },
  { month: 'Feb', value: 112 },
  { month: 'Mar', value: 128 },
  { month: 'Apr', value: 145 },
  { month: 'May', value: 163 },
  { month: 'Jun', value: 184 },
  { month: 'Jul', value: 208 },
  { month: 'Aug', value: 235 },
  { month: 'Sep', value: 267 },
  { month: 'Oct', value: 301 },
  { month: 'Nov', value: 342 },
  { month: 'Dec', value: 389 },
]

// Organization types data
const organizationTypes = [
  { type: 'Healthcare Facilities', count: 723, percentage: 58, color: 'bg-blue-500' },
  { type: 'EMR Software', count: 349, percentage: 28, color: 'bg-green-500' },
  { type: 'Third-party Services', count: 175, percentage: 14, color: 'bg-purple-500' },
]

export const SuperAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'analytics', label: 'User Analytics', icon: UserGroupIcon },
    { id: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon },
    { id: 'usage', label: 'Platform Usage', icon: DocumentTextIcon },
    { id: 'system', label: 'System Health', icon: CpuChipIcon },
  ]

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">SuperAdmin Dashboard</h1>
              <p className="text-gray-600">AuditFortress Platform Overview</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>Last updated: {currentTime}</span>
              <button className="ml-2 p-1 hover:bg-gray-100 rounded">
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Organizations"
            value={metricsData.totalOrganizations.value}
            change={metricsData.totalOrganizations.change}
            icon={<BuildingOfficeIcon className="h-6 w-6" />}
            iconColor="blue"
          />
          <MetricsCard
            title="Active Users"
            value={metricsData.activeUsers.value}
            change={metricsData.activeUsers.change}
            icon={<UsersIcon className="h-6 w-6" />}
            iconColor="green"
          />
          <MetricsCard
            title="Documents Generated"
            value={metricsData.documentsGenerated.value}
            change={metricsData.documentsGenerated.change}
            icon={<DocumentTextIcon className="h-6 w-6" />}
            iconColor="purple"
          />
          <MetricsCard
            title="Monthly Revenue"
            value={metricsData.monthlyRevenue.value}
            change={metricsData.monthlyRevenue.change}
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            iconColor="emerald"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <OrganizationGrowthChart />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <UserActivityAnalytics />
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <RevenueAnalytics />
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                <PlatformUsageStats />
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <SystemHealthMonitor />
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  )
}
