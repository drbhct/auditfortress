import React, { useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppSelect } from '@/components/ui/AppSelect'
import { cn } from '@/utils/cn'

interface RevenueData {
  month: string
  totalRevenue: number
  subscriptionRevenue: number
  oneTimeRevenue: number
  mrr: number
  arr: number
  churn: number
  newCustomers: number
  upgrades: number
  downgrades: number
}

interface SubscriptionTier {
  name: string
  price: number
  subscribers: number
  revenue: number
  growth: number
  color: string
}

interface RevenueMetric {
  label: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
}

interface RevenueAnalyticsProps {
  className?: string
}

// Mock revenue data - replace with real Supabase data
const mockRevenueData: RevenueData[] = [
  {
    month: 'Jan 2024',
    totalRevenue: 125000,
    subscriptionRevenue: 98000,
    oneTimeRevenue: 27000,
    mrr: 98000,
    arr: 1176000,
    churn: 2.1,
    newCustomers: 45,
    upgrades: 12,
    downgrades: 3,
  },
  {
    month: 'Feb 2024',
    totalRevenue: 142000,
    subscriptionRevenue: 112000,
    oneTimeRevenue: 30000,
    mrr: 112000,
    arr: 1344000,
    churn: 1.8,
    newCustomers: 52,
    upgrades: 18,
    downgrades: 2,
  },
  {
    month: 'Mar 2024',
    totalRevenue: 158000,
    subscriptionRevenue: 125000,
    oneTimeRevenue: 33000,
    mrr: 125000,
    arr: 1500000,
    churn: 1.5,
    newCustomers: 61,
    upgrades: 22,
    downgrades: 4,
  },
  {
    month: 'Apr 2024',
    totalRevenue: 175000,
    subscriptionRevenue: 138000,
    oneTimeRevenue: 37000,
    mrr: 138000,
    arr: 1656000,
    churn: 1.9,
    newCustomers: 58,
    upgrades: 15,
    downgrades: 5,
  },
  {
    month: 'May 2024',
    totalRevenue: 192000,
    subscriptionRevenue: 152000,
    oneTimeRevenue: 40000,
    mrr: 152000,
    arr: 1824000,
    churn: 1.3,
    newCustomers: 67,
    upgrades: 28,
    downgrades: 3,
  },
  {
    month: 'Jun 2024',
    totalRevenue: 208000,
    subscriptionRevenue: 165000,
    oneTimeRevenue: 43000,
    mrr: 165000,
    arr: 1980000,
    churn: 1.7,
    newCustomers: 72,
    upgrades: 31,
    downgrades: 6,
  },
]

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Starter',
    price: 49,
    subscribers: 234,
    revenue: 11466,
    growth: 12.5,
    color: '#10B981',
  },
  {
    name: 'Professional',
    price: 149,
    subscribers: 187,
    revenue: 27863,
    growth: 18.7,
    color: '#3B82F6',
  },
  {
    name: 'Enterprise',
    price: 399,
    subscribers: 89,
    revenue: 35511,
    growth: 25.3,
    color: '#8B5CF6',
  },
  {
    name: 'Custom',
    price: 999,
    subscribers: 23,
    revenue: 22977,
    growth: 31.2,
    color: '#F59E0B',
  },
]

const chartTypes = [
  { value: 'area', label: 'Area Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'tiers', label: 'Subscription Tiers' },
]

const timeRanges = [
  { value: '6m', label: 'Last 6 Months' },
  { value: '12m', label: 'Last 12 Months' },
  { value: '24m', label: 'Last 24 Months' },
  { value: 'ytd', label: 'Year to Date' },
]

const revenueMetrics = [
  { value: 'totalRevenue', label: 'Total Revenue', color: '#3B82F6' },
  { value: 'subscriptionRevenue', label: 'Subscription Revenue', color: '#10B981' },
  { value: 'oneTimeRevenue', label: 'One-time Revenue', color: '#F59E0B' },
  { value: 'mrr', label: 'Monthly Recurring Revenue', color: '#8B5CF6' },
]

export function RevenueAnalytics({ className }: RevenueAnalyticsProps) {
  const [chartType, setChartType] = useState('area')
  const [timeRange, setTimeRange] = useState('6m')
  const [selectedMetrics, setSelectedMetrics] = useState(['totalRevenue', 'subscriptionRevenue'])

  const currentData = mockRevenueData[mockRevenueData.length - 1]

  const keyMetrics: RevenueMetric[] = [
    {
      label: 'Monthly Recurring Revenue',
      value: `$${currentData.mrr.toLocaleString()}`,
      change: 15.2,
      trend: 'up',
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
    },
    {
      label: 'Annual Recurring Revenue',
      value: `$${currentData.arr.toLocaleString()}`,
      change: 18.5,
      trend: 'up',
      icon: <ArrowTrendingUpIcon className="w-6 h-6" />,
    },
    {
      label: 'Customer Churn Rate',
      value: `${currentData.churn}%`,
      change: -0.3,
      trend: 'down',
      icon: <UserGroupIcon className="w-6 h-6" />,
    },
    {
      label: 'Average Revenue Per User',
      value: '$247',
      change: 8.7,
      trend: 'up',
      icon: <CreditCardIcon className="w-6 h-6" />,
    },
  ]

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`

  const formatTooltipValue = (value: number, name: string) => {
    const metric = revenueMetrics.find(m => m.value === name)
    return [formatCurrency(value), metric?.label || name]
  }

  const handleMetricToggle = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric))
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={mockRevenueData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="month" 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
          tickFormatter={formatCurrency}
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
        {selectedMetrics.map((metric) => {
          const metricConfig = revenueMetrics.find(m => m.value === metric)
          return (
            <Area
              key={metric}
              type="monotone"
              dataKey={metric}
              stackId="1"
              stroke={metricConfig?.color}
              fill={metricConfig?.color}
              fillOpacity={0.3}
              name={metricConfig?.label}
            />
          )
        })}
      </AreaChart>
    </ResponsiveContainer>
  )

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={mockRevenueData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="month" 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
          tickFormatter={formatCurrency}
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
        {selectedMetrics.map((metric) => {
          const metricConfig = revenueMetrics.find(m => m.value === metric)
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

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={mockRevenueData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="month" 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-sm text-gray-600"
          tick={{ fontSize: 12 }}
          tickFormatter={formatCurrency}
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
        {selectedMetrics.map((metric) => {
          const metricConfig = revenueMetrics.find(m => m.value === metric)
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

  const renderSubscriptionTiers = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={subscriptionTiers}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="revenue"
          >
            {subscriptionTiers.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Subscription Tier Performance</h4>
        {subscriptionTiers.map((tier, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: tier.color }}
                />
                <span className="font-medium">{tier.name}</span>
                <span className="text-sm text-gray-600">${tier.price}/mo</span>
              </div>
              <div className={cn(
                'text-sm font-medium',
                tier.growth > 0 ? 'text-green-600' : 'text-red-600'
              )}>
                +{tier.growth}%
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Subscribers:</span>
                <span className="ml-2 font-medium">{tier.subscribers}</span>
              </div>
              <div>
                <span className="text-gray-600">Revenue:</span>
                <span className="ml-2 font-medium">${tier.revenue.toLocaleString()}</span>
              </div>
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
      case 'bar':
        return renderBarChart()
      case 'tiers':
        return renderSubscriptionTiers()
      default:
        return renderAreaChart()
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="text-blue-600">
                    {metric.icon}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              )}>
                {metric.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4" />
                ) : metric.trend === 'down' ? (
                  <ArrowTrendingDownIcon className="w-4 h-4" />
                ) : (
                  <ArrowPathIcon className="w-4 h-4" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">
              Track revenue trends and subscription performance
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
            
            {chartType !== 'tiers' && (
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

        {/* Metric Selection (only for area/line/bar charts) */}
        {chartType !== 'tiers' && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Select Metrics:</p>
            <div className="flex flex-wrap gap-2">
              {revenueMetrics.map((metric) => (
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

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Acquisition</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-800">New Customers</span>
              <span className="text-2xl font-bold text-green-900">{currentData.newCustomers}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-800">Upgrades</span>
              <span className="text-2xl font-bold text-blue-900">{currentData.upgrades}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-800">Downgrades</span>
              <span className="text-2xl font-bold text-red-900">{currentData.downgrades}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Composition</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subscription Revenue</span>
              <span className="font-bold text-gray-900">
                ${currentData.subscriptionRevenue.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ 
                  width: `${(currentData.subscriptionRevenue / currentData.totalRevenue) * 100}%` 
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">One-time Revenue</span>
              <span className="font-bold text-gray-900">
                ${currentData.oneTimeRevenue.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${(currentData.oneTimeRevenue / currentData.totalRevenue) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
