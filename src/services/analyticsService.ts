import type {
  ApiResponse,
  Document,
  Organization,
  PolicyTemplate,
  ActivityItem,
  ComplianceItem,
} from '@/types'

// Mock analytics data
const mockAnalytics = {
  documents: {
    total: 156,
    thisMonth: 23,
    lastMonth: 18,
    byStatus: {
      draft: 45,
      in_review: 23,
      approved: 67,
      published: 21,
    },
    byCategory: {
      'HIPAA Privacy': 45,
      'Security Policies': 32,
      'Training Materials': 28,
      'Breach Procedures': 23,
      Other: 28,
    },
  },
  users: {
    total: 24,
    active: 18,
    inactive: 6,
    newThisMonth: 3,
  },
  compliance: {
    overallScore: 87,
    compliantItems: 12,
    nonCompliantItems: 2,
    pendingItems: 5,
    warningItems: 1,
  },
  activity: [
    {
      id: '1',
      type: 'document' as const,
      title: 'New document created',
      description: 'HIPAA Privacy Policy v2.1 was created',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      user: {
        name: 'Sarah Johnson',
        avatar: undefined,
      },
      status: 'completed' as const,
      action: {
        label: 'View Document',
        onClick: () => console.log('View document'),
      },
    },
    {
      id: '2',
      type: 'compliance' as const,
      title: 'Compliance check completed',
      description: 'Monthly HIPAA compliance review passed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      user: {
        name: 'Mike Chen',
        avatar: undefined,
      },
      status: 'completed' as const,
    },
    {
      id: '3',
      type: 'user' as const,
      title: 'New team member added',
      description: 'John Smith joined the organization',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      user: {
        name: 'Admin User',
        avatar: undefined,
      },
      status: 'completed' as const,
    },
    {
      id: '4',
      type: 'alert' as const,
      title: 'Security alert',
      description: 'Unusual login activity detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      status: 'warning' as const,
      action: {
        label: 'Review Alert',
        onClick: () => console.log('Review alert'),
      },
    },
    {
      id: '5',
      type: 'document' as const,
      title: 'Document approved',
      description: 'Data Breach Response Plan was approved',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      user: {
        name: 'Lisa Rodriguez',
        avatar: undefined,
      },
      status: 'completed' as const,
    },
  ],
}

export interface DashboardMetrics {
  documents: {
    total: number
    thisMonth: number
    lastMonth: number
    change: number
    byStatus: Record<string, number>
    byCategory: Record<string, number>
  }
  users: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
    change: number
  }
  compliance: {
    overallScore: number
    compliantItems: number
    nonCompliantItems: number
    pendingItems: number
    warningItems: number
    change: number
  }
  performance: {
    averageLoadTime: number
    uptime: number
    errorRate: number
  }
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

export class AnalyticsService {
  // Get dashboard metrics
  static async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const metrics: DashboardMetrics = {
        documents: {
          ...mockAnalytics.documents,
          change: Math.round(
            ((mockAnalytics.documents.thisMonth - mockAnalytics.documents.lastMonth) /
              mockAnalytics.documents.lastMonth) *
              100
          ),
        },
        users: {
          ...mockAnalytics.users,
          change: Math.round((mockAnalytics.users.newThisMonth / mockAnalytics.users.total) * 100),
        },
        compliance: {
          ...mockAnalytics.compliance,
          change: 5, // Mock change
        },
        performance: {
          averageLoadTime: 1.2,
          uptime: 99.9,
          errorRate: 0.1,
        },
      }

      return {
        success: true,
        data: metrics,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard metrics',
      }
    }
  }

  // Get document analytics
  static async getDocumentAnalytics(): Promise<
    ApiResponse<{
      total: number
      createdThisMonth: number
      byStatus: Record<string, number>
      byCategory: Record<string, number>
      recentActivity: ActivityItem[]
    }>
  > {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      return {
        success: true,
        data: {
          total: mockAnalytics.documents.total,
          createdThisMonth: mockAnalytics.documents.thisMonth,
          byStatus: mockAnalytics.documents.byStatus,
          byCategory: mockAnalytics.documents.byCategory,
          recentActivity: mockAnalytics.activity.filter(a => a.type === 'document'),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch document analytics',
      }
    }
  }

  // Get user analytics
  static async getUserAnalytics(): Promise<
    ApiResponse<{
      total: number
      active: number
      inactive: number
      newThisMonth: number
      byRole: Record<string, number>
      recentActivity: ActivityItem[]
    }>
  > {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      return {
        success: true,
        data: {
          total: mockAnalytics.users.total,
          active: mockAnalytics.users.active,
          inactive: mockAnalytics.users.inactive,
          newThisMonth: mockAnalytics.users.newThisMonth,
          byRole: {
            superadmin: 1,
            account_owner: 2,
            admin: 3,
            user: 18,
          },
          recentActivity: mockAnalytics.activity.filter(a => a.type === 'user'),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user analytics',
      }
    }
  }

  // Get compliance analytics
  static async getComplianceAnalytics(): Promise<
    ApiResponse<{
      overallScore: number
      compliantItems: number
      nonCompliantItems: number
      pendingItems: number
      warningItems: number
      trend: Array<{
        date: string
        score: number
      }>
      recentActivity: ActivityItem[]
    }>
  > {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      return {
        success: true,
        data: {
          ...mockAnalytics.compliance,
          trend: [
            { date: '2024-01-01', score: 82 },
            { date: '2024-01-15', score: 85 },
            { date: '2024-02-01', score: 87 },
            { date: '2024-02-15', score: 87 },
          ],
          recentActivity: mockAnalytics.activity.filter(a => a.type === 'compliance'),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch compliance analytics',
      }
    }
  }

  // Get activity timeline
  static async getActivityTimeline(limit: number = 10): Promise<ApiResponse<ActivityItem[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))

      return {
        success: true,
        data: mockAnalytics.activity.slice(0, limit),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch activity timeline',
      }
    }
  }

  // Get chart data for document trends
  static async getDocumentTrendsChart(): Promise<ApiResponse<ChartData>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))

      const chartData: ChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Documents Created',
            data: [12, 19, 15, 25, 22, 23],
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
          },
          {
            label: 'Documents Published',
            data: [8, 15, 12, 20, 18, 21],
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
          },
        ],
      }

      return {
        success: true,
        data: chartData,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch document trends chart',
      }
    }
  }

  // Get chart data for compliance trends
  static async getComplianceTrendsChart(): Promise<ApiResponse<ChartData>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))

      const chartData: ChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Compliance Score',
            data: [82, 85, 87, 87, 89, 87],
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderColor: 'rgba(139, 92, 246, 1)',
            borderWidth: 2,
          },
        ],
      }

      return {
        success: true,
        data: chartData,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch compliance trends chart',
      }
    }
  }

  // Get performance metrics
  static async getPerformanceMetrics(): Promise<
    ApiResponse<{
      averageLoadTime: number
      uptime: number
      errorRate: number
      responseTime: number
      throughput: number
    }>
  > {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))

      return {
        success: true,
        data: {
          averageLoadTime: 1.2,
          uptime: 99.9,
          errorRate: 0.1,
          responseTime: 150,
          throughput: 1250,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch performance metrics',
      }
    }
  }
}
