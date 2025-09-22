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
import { CalendarIcon, FunnelIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppSelect } from '@/components/ui/AppSelect'
import { cn } from '@/utils/cn'

interface ActivityData {
  date: string
  logins: number
  documentViews: number
  templatesCreated: number
  tasksCompleted: number
  activeUsers: number
}

interface UserSegment {
  name: string
  value: number
  color: string
  growth: number
}

interface TopActivity {
  action: string
  count: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

interface UserActivityAnalyticsProps {
  className?: string
}

// Mock data - replace with real Supabase analytics
const mockActivityData: ActivityData[] = [
  { date: '2024-01-01', logins: 245, documentViews: 1240, templatesCreated: 45, tasksCompleted: 189, activeUsers: 156 },
  { date: '2024-01-02', logins: 298, documentViews: 1456, templatesCreated: 52, tasksCompleted: 234, activeUsers: 189 },
  { date: '2024-01-03', logins: 267, documentViews: 1389, templatesCreated: 38, tasksCompleted: 198, activeUsers: 167 },
  { date: '2024-01-04', logins: 312, documentViews: 1567, templatesCreated: 61, tasksCompleted: 267, activeUsers: 201 },
  { date: '2024-01-05', logins: 289, documentViews: 1423, templatesCreated: 47, tasksCompleted: 223, activeUsers: 178 },
  { date: '2024-01-06', logins: 198, documentViews: 987, templatesCreated: 29, tasksCompleted: 145, activeUsers: 134 },
  { date: '2024-01-07', logins: 156, documentViews: 789, templatesCreated: 23, tasksCompleted: 112, activeUsers: 98 },
]

const mockUserSegments: UserSegment[] = [
  { name: 'Super Admins', value: 12, color: '#EF4444', growth: 8.3 },
  { name: 'Org Admins', value: 89, color: '#F59E0B', growth: 12.5 },
  { name: 'Managers', value: 234, color: '#10B981', growth: 15.2 },
  { name: 'Users', value: 567, color: '#3B82F6', growth: 22.1 },
  { name: 'Viewers', value: 123, color: '#8B5CF6', growth: -5.4 },
]

const mockTopActivities: TopActivity[] = [
  { action: 'Document Views', count: 8945, percentage: 34.2, trend: 'up' },
  { action: 'Template Creation', count: 1234, percentage: 18.7, trend: 'up' },
  { action: 'Task Completion', count: 2156, percentage: 16.4, trend: 'stable' },
  { action: 'User Logins', count: 1876, percentage: 14.3, trend: 'up' },
  { action: 'Report Generation', count: 987, percentage: 9.2, trend: 'down' },
  { action: 'Settings Changes', count: 456, percentage: 7.2, trend: 'stable' },
]

const dateRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' },
]

const chartTypes = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'segments', label: 'User Segments' },
]

const activityMetrics = [
  { value: 'logins', label: 'Logins', color: '#3B82F6' },
  { value: 'documentViews', label: 'Document Views', color: '#10B981' },
  { value: 'templatesCreated', label: 'Templates Created', color: '#F59E0B' },
  { value: 'tasksCompleted', label: 'Tasks Completed', color: '#EF4444' },
  { value: 'activeUsers', label: 'Active Users', color: '#8B5CF6' },
]

export function UserActivityAnalytics({ className }: UserActivityAnalyticsProps) {
  const [dateRange, setDateRange] = useState('7d')
  const [chartType, setChartType] = useState('bar')
  const [selectedMetrics, setSelectedMetrics] = useState(['logins', 'documentViews', 'activeUsers'])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTooltipValue = (value: number, name: string) => {
    const metric = activityMetrics.find(m => m.value === name)
    return [value.toLocaleString(), metric?.label || name]
  }

  const getTrendIcon = (trend: TopActivity['trend']) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↗</span>
      case 'down':
        return <span className="text-red-500">↘</span>
      default:
        return <span className="text-gray-500">→</span>
    }
  }

  const handleMetricToggle = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric))
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={mockActivityData}>
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
          const metricConfig = activityMetrics.find(m => m.value === metric)
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
      <LineChart data={mockActivityData}>
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
          const metricConfig = activityMetrics.find(m => m.value === metric)
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

  const renderUserSegments = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={mockUserSegments}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {mockUserSegments.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [value, 'Users']}
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
        <h4 className="font-medium text-gray-900">User Segment Growth</h4>
        {mockUserSegments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: segment.color }}
              />
              <span className="font-medium">{segment.name}</span>
              <span className="text-gray-600">({segment.value})</span>
            </div>
            <div className={cn(
              'text-sm font-medium',
              segment.growth > 0 ? 'text-green-600' : segment.growth < 0 ? 'text-red-600' : 'text-gray-600'
            )}>
              {segment.growth > 0 ? '+' : ''}{segment.growth}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart()
      case 'segments':
        return renderUserSegments()
      default:
        return renderBarChart()
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Analytics Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">User Activity Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">
              Track user engagement and activity patterns
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
            
            <AppSelect
              options={dateRanges}
              value={dateRange}
              onChange={setDateRange}
              placeholder="Date Range"
              className="w-full sm:w-40"
            />
          </div>
        </div>

        {/* Metric Selection (only for bar/line charts) */}
        {chartType !== 'segments' && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Select Metrics:</p>
            <div className="flex flex-wrap gap-2">
              {activityMetrics.map((metric) => (
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

      {/* Top Activities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Top Activities</h3>
        </div>
        
        <div className="space-y-3">
          {mockTopActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{activity.action}</h4>
                  <p className="text-sm text-gray-600">{activity.count.toLocaleString()} actions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">of total</div>
                </div>
                <div className="text-lg">
                  {getTrendIcon(activity.trend)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Active Users</p>
              <p className="text-2xl font-bold text-gray-900">1,025</p>
              <p className="text-sm text-green-600">+12.5% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Average Sessions</p>
              <p className="text-2xl font-bold text-gray-900">2.4</p>
              <p className="text-sm text-green-600">+8.2% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">78.5%</p>
              <p className="text-sm text-red-600">-2.1% from last week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
