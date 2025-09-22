import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { AppButton } from '@/components/ui/AppButton'
import { AppSelect } from '@/components/ui/AppSelect'
import { cn } from '@/utils/cn'

interface ChartData {
  month: string
  organizations: number
  activeUsers: number
  revenue: number
}

interface OrganizationTypeData {
  name: string
  value: number
  color: string
}

interface OrganizationGrowthChartProps {
  className?: string
}

// Mock data - replace with real Supabase data later
const mockGrowthData: ChartData[] = [
  { month: 'Jan', organizations: 12, activeUsers: 145, revenue: 12500 },
  { month: 'Feb', organizations: 18, activeUsers: 198, revenue: 18900 },
  { month: 'Mar', organizations: 25, activeUsers: 267, revenue: 25400 },
  { month: 'Apr', organizations: 32, activeUsers: 334, revenue: 32800 },
  { month: 'May', organizations: 41, activeUsers: 423, revenue: 41200 },
  { month: 'Jun', organizations: 48, activeUsers: 512, revenue: 48600 },
  { month: 'Jul', organizations: 56, activeUsers: 598, revenue: 56700 },
  { month: 'Aug', organizations: 63, activeUsers: 687, revenue: 63400 },
  { month: 'Sep', organizations: 72, activeUsers: 789, revenue: 72100 },
  { month: 'Oct', organizations: 81, activeUsers: 876, revenue: 81500 },
  { month: 'Nov', organizations: 89, activeUsers: 945, revenue: 89800 },
  { month: 'Dec', organizations: 95, activeUsers: 1023, revenue: 95200 },
]

const mockOrganizationTypes: OrganizationTypeData[] = [
  { name: 'Healthcare', value: 35, color: '#3B82F6' },
  { name: 'Financial', value: 28, color: '#10B981' },
  { name: 'Technology', value: 18, color: '#F59E0B' },
  { name: 'Manufacturing', value: 12, color: '#EF4444' },
  { name: 'Other', value: 7, color: '#8B5CF6' },
]

const chartTypes = [
  { value: 'line', label: 'Line Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'pie', label: 'Organization Types' },
]

const timeRanges = [
  { value: '3m', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '12m', label: 'Last 12 Months' },
  { value: 'all', label: 'All Time' },
]

const metrics = [
  { value: 'organizations', label: 'Organizations', color: '#3B82F6' },
  { value: 'activeUsers', label: 'Active Users', color: '#10B981' },
  { value: 'revenue', label: 'Revenue ($)', color: '#F59E0B' },
]

export function OrganizationGrowthChart({ className }: OrganizationGrowthChartProps) {
  const [chartType, setChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('12m')
  const [selectedMetrics, setSelectedMetrics] = useState(['organizations', 'activeUsers'])

  const getFilteredData = () => {
    const monthsToShow = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '12m' ? 12 : 12
    return mockGrowthData.slice(-monthsToShow)
  }

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'revenue') {
      return [`$${value.toLocaleString()}`, 'Revenue']
    }
    return [value.toLocaleString(), name === 'organizations' ? 'Organizations' : 'Active Users']
  }

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={getFilteredData()}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="month" 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={formatTooltipValue}
          labelClassName="text-gray-900 font-medium"
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend />
        {selectedMetrics.includes('organizations') && (
          <Line
            type="monotone"
            dataKey="organizations"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            name="Organizations"
          />
        )}
        {selectedMetrics.includes('activeUsers') && (
          <Line
            type="monotone"
            dataKey="activeUsers"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            name="Active Users"
          />
        )}
        {selectedMetrics.includes('revenue') && (
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
            name="Revenue ($)"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={getFilteredData()}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="month" 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={formatTooltipValue}
          labelClassName="text-gray-900 font-medium"
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend />
        {selectedMetrics.includes('organizations') && (
          <Bar
            dataKey="organizations"
            fill="#3B82F6"
            name="Organizations"
            radius={[4, 4, 0, 0]}
          />
        )}
        {selectedMetrics.includes('activeUsers') && (
          <Bar
            dataKey="activeUsers"
            fill="#10B981"
            name="Active Users"
            radius={[4, 4, 0, 0]}
          />
        )}
        {selectedMetrics.includes('revenue') && (
          <Bar
            dataKey="revenue"
            fill="#F59E0B"
            name="Revenue ($)"
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={mockOrganizationTypes}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {mockOrganizationTypes.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [value, 'Organizations']}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return renderBarChart()
      case 'pie':
        return renderPieChart()
      default:
        return renderLineChart()
    }
  }

  const handleMetricToggle = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric))
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Organization Growth Analytics</h3>
          <p className="text-sm text-gray-600 mt-1">
            Track organization growth, user activity, and revenue trends
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
          
          {chartType !== 'pie' && (
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

      {/* Metric Selection (only for line/bar charts) */}
      {chartType !== 'pie' && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Select Metrics:</p>
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {mockGrowthData[mockGrowthData.length - 1]?.organizations || 0}
          </p>
          <p className="text-sm text-gray-600">Total Organizations</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {mockGrowthData[mockGrowthData.length - 1]?.activeUsers.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">
            ${mockGrowthData[mockGrowthData.length - 1]?.revenue.toLocaleString() || 0}
          </p>
          <p className="text-sm text-gray-600">Monthly Revenue</p>
        </div>
      </div>
    </div>
  )
}
