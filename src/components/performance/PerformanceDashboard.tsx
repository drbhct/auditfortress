import React, { useState, useEffect, useMemo } from 'react'
import { AppCard } from '@/components/ui/AppCard'
import {
  getPerformanceMetrics,
  getPerformanceSummary,
  clearPerformanceMetrics,
  getMemoryUsage,
  getBundleSize,
} from '@/hooks/usePerformance'

interface PerformanceDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState(getPerformanceMetrics())
  const [summary, setSummary] = useState(getPerformanceSummary())
  const [memoryUsage, setMemoryUsage] = useState(getMemoryUsage())
  const [bundleSize, setBundleSize] = useState(getBundleSize())
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  // Update metrics every second
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setMetrics(getPerformanceMetrics())
        setSummary(getPerformanceSummary())
        setMemoryUsage(getMemoryUsage())
        setBundleSize(getBundleSize())
      }, 1000)

      setRefreshInterval(interval)

      return () => {
        clearInterval(interval)
        setRefreshInterval(null)
      }
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [refreshInterval])

  // Performance insights
  const insights = useMemo(() => {
    if (!summary) return []

    const insights = []

    // Render performance insights
    if (summary.averageRenderTime > 16) {
      insights.push({
        type: 'warning',
        message: `Average render time is ${summary.averageRenderTime.toFixed(2)}ms (target: <16ms)`,
        suggestion: 'Consider using React.memo or useMemo for expensive components',
      })
    }

    if (summary.maxRenderTime > 100) {
      insights.push({
        type: 'error',
        message: `Maximum render time is ${summary.maxRenderTime.toFixed(2)}ms (target: <100ms)`,
        suggestion: 'Investigate components with slow renders and optimize them',
      })
    }

    // Memory insights
    if (memoryUsage) {
      const memoryUsageMB = memoryUsage.used / 1024 / 1024
      if (memoryUsageMB > 50) {
        insights.push({
          type: 'warning',
          message: `Memory usage is ${memoryUsageMB.toFixed(2)}MB (target: <50MB)`,
          suggestion: 'Check for memory leaks and optimize object creation',
        })
      }
    }

    // Bundle size insights
    const bundleSizeMB = bundleSize / 1024 / 1024
    if (bundleSizeMB > 0.5) {
      insights.push({
        type: 'info',
        message: `Bundle size is ${bundleSizeMB.toFixed(2)}MB (target: <500KB)`,
        suggestion: 'Consider code splitting and removing unused dependencies',
      })
    }

    return insights
  }, [summary, memoryUsage, bundleSize])

  // Clear metrics
  const handleClearMetrics = () => {
    clearPerformanceMetrics()
    setMetrics([])
    setSummary(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Performance Dashboard</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Render Performance */}
              <AppCard>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Render Performance</h3>
                  {summary ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Renders:</span>
                        <span className="text-sm font-medium">{summary.totalRenders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Time:</span>
                        <span
                          className={`text-sm font-medium ${
                            summary.averageRenderTime > 16 ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {summary.averageRenderTime.toFixed(2)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max Time:</span>
                        <span
                          className={`text-sm font-medium ${
                            summary.maxRenderTime > 100 ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {summary.maxRenderTime.toFixed(2)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Min Time:</span>
                        <span className="text-sm font-medium text-green-600">
                          {summary.minRenderTime.toFixed(2)}ms
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No render data available</p>
                  )}
                </div>
              </AppCard>

              {/* Memory Usage */}
              <AppCard>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Memory Usage</h3>
                  {memoryUsage ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Used:</span>
                        <span
                          className={`text-sm font-medium ${
                            memoryUsage.used / 1024 / 1024 > 50 ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {(memoryUsage.used / 1024 / 1024).toFixed(2)}MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total:</span>
                        <span className="text-sm font-medium">
                          {(memoryUsage.total / 1024 / 1024).toFixed(2)}MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Limit:</span>
                        <span className="text-sm font-medium">
                          {(memoryUsage.limit / 1024 / 1024).toFixed(2)}MB
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(memoryUsage.used / memoryUsage.limit) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Memory data not available</p>
                  )}
                </div>
              </AppCard>

              {/* Bundle Size */}
              <AppCard>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Bundle Size</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Size:</span>
                      <span
                        className={`text-sm font-medium ${
                          bundleSize / 1024 > 500 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {(bundleSize / 1024).toFixed(2)}KB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Target:</span>
                      <span className="text-sm font-medium text-gray-600">&lt; 500KB</span>
                    </div>
                  </div>
                </div>
              </AppCard>

              {/* Recent Renders */}
              <AppCard className="md:col-span-2 lg:col-span-3">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Renders</h3>
                  {metrics.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {metrics
                        .slice(-10)
                        .reverse()
                        .map((metric, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                          >
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {metric.componentName}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(metric.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span
                                className={`text-sm font-medium ${
                                  metric.renderTime > 16 ? 'text-red-600' : 'text-green-600'
                                }`}
                              >
                                {metric.renderTime.toFixed(2)}ms
                              </span>
                              <span className="text-xs text-gray-500">
                                {(metric.memoryUsage / 1024 / 1024).toFixed(2)}MB
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No render data available</p>
                  )}
                </div>
              </AppCard>

              {/* Performance Insights */}
              {insights.length > 0 && (
                <AppCard className="md:col-span-2 lg:col-span-3">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
                    <div className="space-y-3">
                      {insights.map((insight, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            insight.type === 'error'
                              ? 'bg-red-50 border border-red-200'
                              : insight.type === 'warning'
                                ? 'bg-yellow-50 border border-yellow-200'
                                : 'bg-blue-50 border border-blue-200'
                          }`}
                        >
                          <div className="flex items-start">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                                insight.type === 'error'
                                  ? 'bg-red-500'
                                  : insight.type === 'warning'
                                    ? 'bg-yellow-500'
                                    : 'bg-blue-500'
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{insight.message}</p>
                              <p className="text-xs text-gray-600 mt-1">{insight.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AppCard>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleClearMetrics}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Metrics
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
