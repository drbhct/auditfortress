import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppSelect } from '@/components/ui/AppSelect'
import { AppModal } from '@/components/ui/AppModal'
import { cn } from '@/utils/cn'

interface UsageData {
  date: string
  documentViews: number
  documentCreations: number
  templateUsage: number
  userSessions: number
  apiCalls: number
  downloads: number
  shares: number
  searchQueries: number
}

interface FeatureUsage {
  feature: string
  usage: number
  users: number
  growth: number
  category: string
  color: string
}

interface DrillDownData {
  name: string
  value: number
  children?: DrillDownData[]
  color?: string
}

interface PlatformUsageStatsProps {
  className?: string
}

// Mock usage data - replace with real analytics
const mockUsageData: UsageData[] = [
  {
    date: '2024-01-01',
    documentViews: 2450,
    documentCreations: 189,
    templateUsage: 567,
    userSessions: 1234,
    apiCalls: 8900,
    downloads: 345,
    shares: 123,
    searchQueries: 890,
  },
  {
    date: '2024-01-02',
    documentViews: 2890,
    documentCreations: 234,
    templateUsage: 678,
    userSessions: 1456,
    apiCalls: 9800,
    downloads: 412,
    shares: 156,
    searchQueries: 1023,
  },
  {
    date: '2024-01-03',
    documentViews: 2678,
    documentCreations: 198,
    templateUsage: 623,
    userSessions: 1345,
    apiCalls: 9200,
    downloads: 378,
    shares: 134,
    searchQueries: 945,
  },
  {
    date: '2024-01-04',
    documentViews: 3120,
    documentCreations: 267,
    templateUsage: 734,
    userSessions: 1567,
    apiCalls: 10500,
    downloads: 456,
    shares: 189,
    searchQueries: 1156,
  },
  {
    date: '2024-01-05',
    documentViews: 2945,
    documentCreations: 223,
    templateUsage: 689,
    userSessions: 1423,
    apiCalls: 9900,
    downloads: 423,
    shares: 167,
    searchQueries: 1034,
  },
  {
    date: '2024-01-06',
    documentViews: 2234,
    documentCreations: 156,
    templateUsage: 456,
    userSessions: 1123,
    apiCalls: 7800,
    downloads: 289,
    shares: 98,
    searchQueries: 723,
  },
  {
    date: '2024-01-07',
    documentViews: 1890,
    documentCreations: 123,
    templateUsage: 378,
    userSessions: 945,
    apiCalls: 6700,
    downloads: 234,
    shares: 76,
    searchQueries: 567,
  },
]

const featureUsageData: FeatureUsage[] = [
  {
    feature: 'Document Viewer',
    usage: 15420,
    users: 892,
    growth: 12.5,
    category: 'Core',
    color: '#3B82F6',
  },
  {
    feature: 'Template Builder',
    usage: 8934,
    users: 567,
    growth: 18.7,
    category: 'Creation',
    color: '#10B981',
  },
  {
    feature: 'Collaboration Tools',
    usage: 6723,
    users: 423,
    growth: 25.3,
    category: 'Social',
    color: '#F59E0B',
  },
  {
    feature: 'API Integration',
    usage: 12456,
    users: 234,
    growth: 31.2,
    category: 'Technical',
    color: '#8B5CF6',
  },
  {
    feature: 'Mobile App',
    usage: 4567,
    users: 345,
    growth: 8.9,
    category: 'Mobile',
    color: '#EF4444',
  },
  {
    feature: 'Analytics Dashboard',
    usage: 3456,
    users: 189,
    growth: 15.6,
    category: 'Analytics',
    color: '#06B6D4',
  },
]

const drillDownData: DrillDownData[] = [
  {
    name: 'Document Management',
    value: 45,
    color: '#3B82F6',
    children: [
      { name: 'View Documents', value: 18, color: '#60A5FA' },
      { name: 'Create Documents', value: 12, color: '#93C5FD' },
      { name: 'Edit Documents', value: 8, color: '#BFDBFE' },
      { name: 'Delete Documents', value: 4, color: '#DBEAFE' },
      { name: 'Share Documents', value: 3, color: '#EFF6FF' },
    ],
  },
  {
    name: 'Template System',
    value: 28,
    color: '#10B981',
    children: [
      { name: 'Use Templates', value: 15, color: '#34D399' },
      { name: 'Create Templates', value: 8, color: '#6EE7B7' },
      { name: 'Edit Templates', value: 3, color: '#9CA3AF' },
      { name: 'Import Templates', value: 2, color: '#D1FAE5' },
    ],
  },
  {
    name: 'User Management',
    value: 15,
    color: '#F59E0B',
    children: [
      { name: 'User Login', value: 8, color: '#FBBF24' },
      { name: 'Profile Updates', value: 4, color: '#FCD34D' },
      { name: 'Settings', value: 2, color: '#FDE68A' },
      { name: 'Permissions', value: 1, color: '#FEF3C7' },
    ],
  },
  {
    name: 'System Features',
    value: 12,
    color: '#8B5CF6',
    children: [
      { name: 'Search', value: 5, color: '#A78BFA' },
      { name: 'Notifications', value: 3, color: '#C4B5FD' },
      { name: 'Exports', value: 2, color: '#DDD6FE' },
      { name: 'Integrations', value: 2, color: '#EDE9FE' },
    ],
  },
]

const chartTypes = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'features', label: 'Feature Usage' },
  { value: 'drilldown', label: 'Usage Breakdown' },
]

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
]

const usageMetrics = [
  { value: 'documentViews', label: 'Document Views', color: '#3B82F6', icon: EyeIcon },
  { value: 'documentCreations', label: 'Document Creations', color: '#10B981', icon: PencilIcon },
  { value: 'templateUsage', label: 'Template Usage', color: '#F59E0B', icon: DocumentTextIcon },
  { value: 'userSessions', label: 'User Sessions', color: '#8B5CF6', icon: UserGroupIcon },
  { value: 'apiCalls', label: 'API Calls', color: '#EF4444', icon: ChartBarIcon },
  { value: 'downloads', label: 'Downloads', color: '#06B6D4', icon: ArrowDownTrayIcon },
]

export function PlatformUsageStats({ className }: PlatformUsageStatsProps) {
  const [chartType, setChartType] = useState('bar')
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetrics, setSelectedMetrics] = useState(['documentViews', 'userSessions', 'templateUsage'])
  const [drillDownModal, setDrillDownModal] = useState<DrillDownData | null>(null)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTooltipValue = (value: number, name: string) => {
    const metric = usageMetrics.find(m => m.value === name)
    return [value.toLocaleString(), metric?.label || name]
  }

  const handleMetricToggle = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric))
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  const handleDrillDown = (data: DrillDownData) => {
    setDrillDownModal(data)
  }

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={mockUsageData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={formatTooltipValue}
          labelFormatter={(label) => formatDate(label)}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend />
        {selectedMetrics.map((metric) => {
          const metricConfig = usageMetrics.find(m => m.value === metric)
          return (
            <Bar
              key={metric}
              dataKey={metric}
              fill={metricConfig?.color}
              name={metricConfig?.label}
              radius={[2, 2, 0, 0]}
            />
          )
        })}
      </BarChart>
    </ResponsiveContainer>
  )

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={mockUsageData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={formatTooltipValue}
          labelFormatter={(label) => formatDate(label)}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend />
        {selectedMetrics.map((metric) => {
          const metricConfig = usageMetrics.find(m => m.value === metric)
          return (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={metricConfig?.color}
              strokeWidth={3}
              dot={{ fill: metricConfig?.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: metricConfig?.color, strokeWidth: 2 }}
              name={metricConfig?.label}
            />
          )
        })}
      </LineChart>
    </ResponsiveContainer>
  )

  const renderFeatureUsage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={featureUsageData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="usage"
            >
              {featureUsageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), 'Usage']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Feature Performance</h4>
          {featureUsageData.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: feature.color }}
                  />
                  <span className="font-medium">{feature.feature}</span>
                  <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                    {feature.category}
                  </span>
                </div>
                <div className={cn(
                  'text-sm font-medium',
                  feature.growth > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  +{feature.growth}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Usage:</span>
                  <span className="ml-2 font-medium">{feature.usage.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Users:</span>
                  <span className="ml-2 font-medium">{feature.users}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDrillDown = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {drillDownData.map((category, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDrillDown(category)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {category.value}%
            </div>
            <div className="text-sm text-gray-600">
              Click to drill down
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Usage Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={drillDownData}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={150}
              className="text-sm text-gray-600"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Usage']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#3B82F6"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart()
      case 'features':
        return renderFeatureUsage()
      case 'drilldown':
        return renderDrillDown()
      default:
        return renderBarChart()
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {usageMetrics.map((metric, index) => {
          const Icon = metric.icon
          const currentValue = mockUsageData[mockUsageData.length - 1]?.[metric.value as keyof UsageData] || 0
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {typeof currentValue === 'number' ? currentValue.toLocaleString() : currentValue}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Platform Usage Statistics</h3>
            <p className="text-sm text-gray-600 mt-1">
              Analyze feature usage patterns and user behavior
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <AppSelect
              options={chartTypes}
              value={chartType}
              onChange={setChartType}
              placeholder="Chart Type"
              className="w-full sm:w-40"
            />
            
            {!['features', 'drilldown'].includes(chartType) && (
              <AppSelect
                options={timeRanges}
                value={timeRange}
                onChange={setTimeRange}
                placeholder="Time Range"
                className="w-full sm:w-40"
              />
            )}
          </div>
        </div>

        {/* Metric Selection (only for bar/line charts) */}
        {!['features', 'drilldown'].includes(chartType) && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Select Metrics:</p>
            <div className="flex flex-wrap gap-2">
              {usageMetrics.map((metric) => (
                <AppButton
                  key={metric.value}
                  variant={selectedMetrics.includes(metric.value) ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleMetricToggle(metric.value)}
                  className="text-xs"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: metric.color }}
                  />
                  {metric.label}
                </AppButton>
              ))}
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="w-full">
          {renderChart()}
        </div>
      </div>

      {/* Drill Down Modal */}
      <AppModal
        isOpen={!!drillDownModal}
        onClose={() => setDrillDownModal(null)}
        title={`${drillDownModal?.name} Breakdown`}
        size="lg"
      >
        {drillDownModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {drillDownModal.children?.map((child, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: child.color }}
                    />
                    <span className="font-medium">{child.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{child.value}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={drillDownModal.children}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Usage']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={drillDownModal.color}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </AppModal>
    </div>
  )
}
