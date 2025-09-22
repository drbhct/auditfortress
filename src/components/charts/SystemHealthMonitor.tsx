import React, { useState, useEffect } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

interface SystemMetric {
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
  responseTime: number
}

interface ServiceStatus {
  name: string
  status: 'healthy' | 'warning' | 'error' | 'maintenance'
  uptime: string
  lastCheck: string
  responseTime: number
  description: string
}

interface SystemHealthMonitorProps {
  className?: string
}

// Mock real-time data - replace with actual system monitoring
const generateMockMetrics = (): SystemMetric[] => {
  const now = new Date()
  const data: SystemMetric[] = []
  
  for (let i = 29; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60000) // Every minute for last 30 minutes
    data.push({
      timestamp: timestamp.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      cpuUsage: Math.random() * 30 + 20, // 20-50%
      memoryUsage: Math.random() * 20 + 60, // 60-80%
      diskUsage: Math.random() * 10 + 45, // 45-55%
      activeConnections: Math.floor(Math.random() * 50 + 100), // 100-150
      responseTime: Math.random() * 50 + 100, // 100-150ms
    })
  }
  
  return data
}

const mockServices: ServiceStatus[] = [
  {
    name: 'API Server',
    status: 'healthy',
    uptime: '99.9%',
    lastCheck: '2 minutes ago',
    responseTime: 120,
    description: 'Main application API',
  },
  {
    name: 'Database',
    status: 'healthy',
    uptime: '99.8%',
    lastCheck: '1 minute ago',
    responseTime: 45,
    description: 'Supabase PostgreSQL',
  },
  {
    name: 'Authentication',
    status: 'warning',
    uptime: '98.5%',
    lastCheck: '3 minutes ago',
    responseTime: 250,
    description: 'Supabase Auth service',
  },
  {
    name: 'File Storage',
    status: 'healthy',
    uptime: '99.7%',
    lastCheck: '1 minute ago',
    responseTime: 180,
    description: 'Supabase Storage',
  },
  {
    name: 'Email Service',
    status: 'maintenance',
    uptime: '95.2%',
    lastCheck: '10 minutes ago',
    responseTime: 0,
    description: 'Email notifications',
  },
]

const getStatusIcon = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'healthy':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    case 'warning':
      return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
    case 'error':
      return <XCircleIcon className="w-5 h-5 text-red-500" />
    case 'maintenance':
      return <ClockIcon className="w-5 h-5 text-blue-500" />
    default:
      return <CheckCircleIcon className="w-5 h-5 text-gray-400" />
  }
}

const getStatusColor = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'healthy':
      return 'text-green-700 bg-green-50 border-green-200'
    case 'warning':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'error':
      return 'text-red-700 bg-red-50 border-red-200'
    case 'maintenance':
      return 'text-blue-700 bg-blue-50 border-blue-200'
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200'
  }
}

export function SystemHealthMonitor({ className }: SystemHealthMonitorProps) {
  const [metrics, setMetrics] = useState<SystemMetric[]>(generateMockMetrics())
  const [isRealTime, setIsRealTime] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return

    const interval = setInterval(() => {
      setMetrics(prevMetrics => {
        const newMetrics = [...prevMetrics.slice(1)]
        const now = new Date()
        newMetrics.push({
          timestamp: now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          cpuUsage: Math.random() * 30 + 20,
          memoryUsage: Math.random() * 20 + 60,
          diskUsage: Math.random() * 10 + 45,
          activeConnections: Math.floor(Math.random() * 50 + 100),
          responseTime: Math.random() * 50 + 100,
        })
        return newMetrics
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isRealTime])

  const currentMetrics = metrics[metrics.length - 1]

  return (
    <div className={cn('space-y-6', className)}>
      {/* System Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">System Health Overview</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time system performance metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
              isRealTime ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-50'
            )}>
              <div className={cn(
                'w-2 h-2 rounded-full',
                isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              )} />
              {isRealTime ? 'Live' : 'Paused'}
            </div>
            
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              {isRealTime ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        {/* Current Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">CPU Usage</p>
                <p className="text-2xl font-bold text-blue-900">
                  {currentMetrics?.cpuUsage.toFixed(1)}%
                </p>
              </div>
              <CpuChipIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Memory Usage</p>
                <p className="text-2xl font-bold text-green-900">
                  {currentMetrics?.memoryUsage.toFixed(1)}%
                </p>
              </div>
              <CircleStackIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Disk Usage</p>
                <p className="text-2xl font-bold text-amber-900">
                  {currentMetrics?.diskUsage.toFixed(1)}%
                </p>
              </div>
              <ServerIcon className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Active Connections</p>
                <p className="text-2xl font-bold text-purple-900">
                  {currentMetrics?.activeConnections}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {currentMetrics?.activeConnections}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="timestamp" 
                className="text-xs text-gray-600"
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                className="text-xs text-gray-600"
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}${name.includes('Usage') ? '%' : name.includes('Time') ? 'ms' : ''}`,
                  name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                ]}
                labelClassName="text-gray-900 font-medium"
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="cpuUsage"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                name="CPU Usage"
              />
              <Area
                type="monotone"
                dataKey="memoryUsage"
                stackId="2"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                name="Memory Usage"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
        
        <div className="space-y-4">
          {mockServices.map((service, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border',
                getStatusColor(service.status)
              )}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm opacity-75">{service.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-medium">Uptime:</span> {service.uptime}
                  </div>
                  <div>
                    <span className="font-medium">Response:</span> {service.responseTime}ms
                  </div>
                  <div className="text-xs opacity-75">
                    {service.lastCheck}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
