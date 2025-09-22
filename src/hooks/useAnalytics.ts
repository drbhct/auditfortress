import { useState, useEffect } from 'react'
import { AnalyticsService } from '@/services/analyticsService'
import type { DashboardMetrics, ChartData, ActivityItem, ComplianceItem } from '@/types'

export interface UseAnalyticsReturn {
  // Dashboard metrics
  metrics: DashboardMetrics | null
  isLoadingMetrics: boolean
  metricsError: string | null

  // Activity timeline
  activities: ActivityItem[]
  isLoadingActivities: boolean
  activitiesError: string | null

  // Chart data
  documentTrendsChart: ChartData | null
  complianceTrendsChart: ChartData | null
  isLoadingCharts: boolean
  chartsError: string | null

  // Performance metrics
  performance: {
    averageLoadTime: number
    uptime: number
    errorRate: number
    responseTime: number
    throughput: number
  } | null
  isLoadingPerformance: boolean
  performanceError: string | null

  // Actions
  refreshMetrics: () => Promise<void>
  refreshActivities: () => Promise<void>
  refreshCharts: () => Promise<void>
  refreshPerformance: () => Promise<void>
  refreshAll: () => Promise<void>
}

export const useAnalytics = (): UseAnalyticsReturn => {
  // State for dashboard metrics
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false)
  const [metricsError, setMetricsError] = useState<string | null>(null)

  // State for activity timeline
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)
  const [activitiesError, setActivitiesError] = useState<string | null>(null)

  // State for chart data
  const [documentTrendsChart, setDocumentTrendsChart] = useState<ChartData | null>(null)
  const [complianceTrendsChart, setComplianceTrendsChart] = useState<ChartData | null>(null)
  const [isLoadingCharts, setIsLoadingCharts] = useState(false)
  const [chartsError, setChartsError] = useState<string | null>(null)

  // State for performance metrics
  const [performance, setPerformance] = useState<{
    averageLoadTime: number
    uptime: number
    errorRate: number
    responseTime: number
    throughput: number
  } | null>(null)
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false)
  const [performanceError, setPerformanceError] = useState<string | null>(null)

  // Load dashboard metrics
  const loadMetrics = async () => {
    setIsLoadingMetrics(true)
    setMetricsError(null)

    try {
      const response = await AnalyticsService.getDashboardMetrics()
      if (response.success && response.data) {
        setMetrics(response.data)
      } else {
        setMetricsError(response.error || 'Failed to load metrics')
      }
    } catch (error) {
      setMetricsError(error instanceof Error ? error.message : 'Failed to load metrics')
    } finally {
      setIsLoadingMetrics(false)
    }
  }

  // Load activity timeline
  const loadActivities = async () => {
    setIsLoadingActivities(true)
    setActivitiesError(null)

    try {
      const response = await AnalyticsService.getActivityTimeline(20)
      if (response.success && response.data) {
        setActivities(response.data)
      } else {
        setActivitiesError(response.error || 'Failed to load activities')
      }
    } catch (error) {
      setActivitiesError(error instanceof Error ? error.message : 'Failed to load activities')
    } finally {
      setIsLoadingActivities(false)
    }
  }

  // Load chart data
  const loadCharts = async () => {
    setIsLoadingCharts(true)
    setChartsError(null)

    try {
      const [documentResponse, complianceResponse] = await Promise.all([
        AnalyticsService.getDocumentTrendsChart(),
        AnalyticsService.getComplianceTrendsChart(),
      ])

      if (documentResponse.success && documentResponse.data) {
        setDocumentTrendsChart(documentResponse.data)
      }

      if (complianceResponse.success && complianceResponse.data) {
        setComplianceTrendsChart(complianceResponse.data)
      }

      if (!documentResponse.success || !complianceResponse.success) {
        setChartsError('Failed to load some chart data')
      }
    } catch (error) {
      setChartsError(error instanceof Error ? error.message : 'Failed to load charts')
    } finally {
      setIsLoadingCharts(false)
    }
  }

  // Load performance metrics
  const loadPerformance = async () => {
    setIsLoadingPerformance(true)
    setPerformanceError(null)

    try {
      const response = await AnalyticsService.getPerformanceMetrics()
      if (response.success && response.data) {
        setPerformance(response.data)
      } else {
        setPerformanceError(response.error || 'Failed to load performance metrics')
      }
    } catch (error) {
      setPerformanceError(
        error instanceof Error ? error.message : 'Failed to load performance metrics'
      )
    } finally {
      setIsLoadingPerformance(false)
    }
  }

  // Refresh functions
  const refreshMetrics = async () => {
    await loadMetrics()
  }

  const refreshActivities = async () => {
    await loadActivities()
  }

  const refreshCharts = async () => {
    await loadCharts()
  }

  const refreshPerformance = async () => {
    await loadPerformance()
  }

  const refreshAll = async () => {
    await Promise.all([loadMetrics(), loadActivities(), loadCharts(), loadPerformance()])
  }

  // Load data on mount
  useEffect(() => {
    refreshAll()
  }, [])

  return {
    // Dashboard metrics
    metrics,
    isLoadingMetrics,
    metricsError,

    // Activity timeline
    activities,
    isLoadingActivities,
    activitiesError,

    // Chart data
    documentTrendsChart,
    complianceTrendsChart,
    isLoadingCharts,
    chartsError,

    // Performance metrics
    performance,
    isLoadingPerformance,
    performanceError,

    // Actions
    refreshMetrics,
    refreshActivities,
    refreshCharts,
    refreshPerformance,
    refreshAll,
  }
}

// Hook for specific analytics sections
export const useDocumentAnalytics = () => {
  const [analytics, setAnalytics] = useState<{
    total: number
    createdThisMonth: number
    byStatus: Record<string, number>
    byCategory: Record<string, number>
    recentActivity: ActivityItem[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await AnalyticsService.getDocumentAnalytics()
      if (response.success && response.data) {
        setAnalytics(response.data)
      } else {
        setError(response.error || 'Failed to load document analytics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document analytics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  return { analytics, isLoading, error, refresh: loadAnalytics }
}

export const useComplianceAnalytics = () => {
  const [analytics, setAnalytics] = useState<{
    overallScore: number
    compliantItems: number
    nonCompliantItems: number
    pendingItems: number
    warningItems: number
    trend: Array<{ date: string; score: number }>
    recentActivity: ActivityItem[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAnalytics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await AnalyticsService.getComplianceAnalytics()
      if (response.success && response.data) {
        setAnalytics(response.data)
      } else {
        setError(response.error || 'Failed to load compliance analytics')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load compliance analytics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  return { analytics, isLoading, error, refresh: loadAnalytics }
}
