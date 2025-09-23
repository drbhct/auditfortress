import { supabase } from '@/lib/supabaseClient'
import type { Tables } from '@/types/supabase'

export interface SuperAdminDashboardMetrics {
  users: {
    total: number
    active: number
    thisMonth: number
    lastMonth: number
    change: number
    byStatus: Record<string, number>
  }
  organizations: {
    total: number
    active: number
    thisMonth: number
    lastMonth: number
    change: number
    byType: Record<string, number>
    byStatus: Record<string, number>
  }
  templates: {
    total: number
    published: number
    thisMonth: number
    lastMonth: number
    change: number
    byCategory: Record<string, number>
  }
  system: {
    uptime: number
    responseTime: number
    errorRate: number
    activeUsers: number
  }
}

export interface UserActivityData {
  date: string
  newUsers: number
  activeUsers: number
  totalLogins: number
}

export interface RevenueData {
  date: string
  revenue: number
  subscriptions: number
  churn: number
}

export interface OrganizationGrowthData {
  date: string
  newOrganizations: number
  totalOrganizations: number
  activeOrganizations: number
}

export interface SystemHealthData {
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
  responseTime: number
}

class SuperAdminService {
  /**
   * Get comprehensive dashboard metrics
   */
  async getDashboardMetrics(): Promise<SuperAdminDashboardMetrics> {
    try {
      const [usersData, organizationsData, templatesData, systemData] = await Promise.all([
        this.getUserMetrics(),
        this.getOrganizationMetrics(),
        this.getTemplateMetrics(),
        this.getSystemMetrics()
      ])

      return {
        users: usersData,
        organizations: organizationsData,
        templates: templatesData,
        system: systemData
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error)
      throw error
    }
  }

  /**
   * Get user metrics
   */
  private async getUserMetrics() {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('status, created_at, last_login_at')

    if (error) throw new Error(error.message)

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const metrics = (users || []).reduce(
      (acc, user) => {
        acc.total++
        acc.byStatus[user.status || 'pending'] = (acc.byStatus[user.status || 'pending'] || 0) + 1

        if (user.status === 'active') {
          acc.active++
        }

        const createdAt = new Date(user.created_at || '')
        if (createdAt >= thisMonthStart) {
          acc.thisMonth++
        } else if (createdAt >= lastMonthStart && createdAt <= lastMonthEnd) {
          acc.lastMonth++
        }

        return acc
      },
      {
        total: 0,
        active: 0,
        thisMonth: 0,
        lastMonth: 0,
        change: 0,
        byStatus: {} as Record<string, number>
      }
    )

    metrics.change = metrics.lastMonth > 0 ? 
      ((metrics.thisMonth - metrics.lastMonth) / metrics.lastMonth) * 100 : 
      metrics.thisMonth > 0 ? 100 : 0

    return metrics
  }

  /**
   * Get organization metrics
   */
  private async getOrganizationMetrics() {
    const { data: organizations, error } = await supabase
      .from('organizations')
      .select('status, type, created_at')

    if (error) throw new Error(error.message)

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const metrics = (organizations || []).reduce(
      (acc, org) => {
        acc.total++
        acc.byStatus[org.status || 'trial'] = (acc.byStatus[org.status || 'trial'] || 0) + 1
        acc.byType[org.type] = (acc.byType[org.type] || 0) + 1

        if (org.status === 'active') {
          acc.active++
        }

        const createdAt = new Date(org.created_at || '')
        if (createdAt >= thisMonthStart) {
          acc.thisMonth++
        } else if (createdAt >= lastMonthStart && createdAt <= lastMonthEnd) {
          acc.lastMonth++
        }

        return acc
      },
      {
        total: 0,
        active: 0,
        thisMonth: 0,
        lastMonth: 0,
        change: 0,
        byType: {} as Record<string, number>,
        byStatus: {} as Record<string, number>
      }
    )

    metrics.change = metrics.lastMonth > 0 ? 
      ((metrics.thisMonth - metrics.lastMonth) / metrics.lastMonth) * 100 : 
      metrics.thisMonth > 0 ? 100 : 0

    return metrics
  }

  /**
   * Get template metrics
   */
  private async getTemplateMetrics() {
    const { data: templates, error } = await supabase
      .from('system_templates')
      .select('category, status, created_at')

    if (error) throw new Error(error.message)

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const metrics = (templates || []).reduce(
      (acc, template) => {
        acc.total++
        acc.byCategory[template.category] = (acc.byCategory[template.category] || 0) + 1

        if (template.status === 'active') {
          acc.published++
        }

        const createdAt = new Date(template.created_at || '')
        if (createdAt >= thisMonthStart) {
          acc.thisMonth++
        } else if (createdAt >= lastMonthStart && createdAt <= lastMonthEnd) {
          acc.lastMonth++
        }

        return acc
      },
      {
        total: 0,
        published: 0,
        thisMonth: 0,
        lastMonth: 0,
        change: 0,
        byCategory: {} as Record<string, number>
      }
    )

    metrics.change = metrics.lastMonth > 0 ? 
      ((metrics.thisMonth - metrics.lastMonth) / metrics.lastMonth) * 100 : 
      metrics.thisMonth > 0 ? 100 : 0

    return metrics
  }

  /**
   * Get system metrics (mock data for now)
   */
  private async getSystemMetrics() {
    // TODO: Implement real system metrics collection
    return {
      uptime: 99.9,
      responseTime: 245,
      errorRate: 0.1,
      activeUsers: 1247
    }
  }

  /**
   * Get user activity analytics data
   */
  async getUserActivityData(days = 30): Promise<UserActivityData[]> {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('created_at, last_login_at')

      const { data: activityLogs, error: activityError } = await supabase
        .from('activity_logs')
        .select('created_at, action')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

      if (profilesError) throw new Error(profilesError.message)
      if (activityError) throw new Error(activityError.message)

      // Generate data for the last N days
      const data: UserActivityData[] = []
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23, 59, 59, 999)

        const newUsers = (profiles || []).filter(p => {
          const createdAt = new Date(p.created_at || '')
          return createdAt >= dayStart && createdAt <= dayEnd
        }).length

        const totalLogins = (activityLogs || []).filter(log => {
          const logDate = new Date(log.created_at || '')
          return logDate >= dayStart && logDate <= dayEnd && log.action === 'login'
        }).length

        // Mock active users calculation
        const activeUsers = Math.floor(newUsers * 0.7 + totalLogins * 0.3)

        data.push({
          date: dateStr,
          newUsers,
          activeUsers,
          totalLogins
        })
      }

      return data
    } catch (error) {
      console.error('Error fetching user activity data:', error)
      throw error
    }
  }

  /**
   * Get organization growth data
   */
  async getOrganizationGrowthData(days = 30): Promise<OrganizationGrowthData[]> {
    try {
      const { data: organizations, error } = await supabase
        .from('organizations')
        .select('created_at, status')

      if (error) throw new Error(error.message)

      const data: OrganizationGrowthData[] = []
      let runningTotal = 0

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const dayStart = new Date(date)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(date)
        dayEnd.setHours(23, 59, 59, 999)

        const newOrganizations = (organizations || []).filter(org => {
          const createdAt = new Date(org.created_at || '')
          return createdAt >= dayStart && createdAt <= dayEnd
        }).length

        runningTotal += newOrganizations

        const activeOrganizations = (organizations || []).filter(org => {
          const createdAt = new Date(org.created_at || '')
          return createdAt <= dayEnd && org.status === 'active'
        }).length

        data.push({
          date: dateStr,
          newOrganizations,
          totalOrganizations: runningTotal,
          activeOrganizations
        })
      }

      return data
    } catch (error) {
      console.error('Error fetching organization growth data:', error)
      throw error
    }
  }

  /**
   * Get revenue data (mock for now)
   */
  async getRevenueData(days = 30): Promise<RevenueData[]> {
    // TODO: Implement real revenue tracking
    const data: RevenueData[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // Mock revenue data
      const baseRevenue = 50000 + Math.random() * 10000
      const subscriptions = Math.floor(20 + Math.random() * 30)
      const churn = Math.floor(Math.random() * 5)

      data.push({
        date: dateStr,
        revenue: Math.floor(baseRevenue),
        subscriptions,
        churn
      })
    }

    return data
  }

  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(page = 1, limit = 10, filters: { 
    status?: string
    search?: string
    organization?: string
  } = {}) {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          organizations(name, type, status)
        `)

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.organization) {
        query = query.eq('organization_id', filters.organization)
      }

      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      // Add pagination
      const offset = (page - 1) * limit
      const { data, error, count } = await query
        .range(offset, offset + limit - 1)

      if (error) throw new Error(error.message)

      return {
        data: data || [],
        count: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  /**
   * Get all organizations with pagination and filtering
   */
  async getAllOrganizations(page = 1, limit = 10, filters: {
    status?: string
    type?: string
    search?: string
  } = {}) {
    try {
      let query = supabase
        .from('organizations')
        .select(`
          *,
          profiles(count)
        `)

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.type) {
        query = query.eq('type', filters.type)
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      // Add pagination
      const offset = (page - 1) * limit
      const { data, error, count } = await query
        .range(offset, offset + limit - 1)

      if (error) throw new Error(error.message)

      return {
        data: data || [],
        count: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      throw error
    }
  }

  /**
   * Get system activity logs
   */
  async getActivityLogs(page = 1, limit = 20, filters: {
    user_id?: string
    organization_id?: string
    action?: string
    entity_type?: string
  } = {}) {
    try {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          profiles(first_name, last_name, email),
          organizations(name)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id)
      }

      if (filters.organization_id) {
        query = query.eq('organization_id', filters.organization_id)
      }

      if (filters.action) {
        query = query.eq('action', filters.action)
      }

      if (filters.entity_type) {
        query = query.eq('entity_type', filters.entity_type)
      }

      // Add pagination
      const offset = (page - 1) * limit
      const { data, error, count } = await query
        .range(offset, offset + limit - 1)

      if (error) throw new Error(error.message)

      return {
        data: data || [],
        count: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      throw error
    }
  }

  /**
   * Get system health metrics
   */
  async getSystemHealth(): Promise<SystemHealthData[]> {
    try {
      // Get system metrics from the last 24 hours
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true })

      if (error) throw new Error(error.message)

      // Transform metrics data
      const healthData: SystemHealthData[] = (data || []).map(metric => ({
        timestamp: metric.recorded_at || new Date().toISOString(),
        cpuUsage: metric.metric_type === 'cpu_usage' ? Number(metric.value) : 0,
        memoryUsage: metric.metric_type === 'memory_usage' ? Number(metric.value) : 0,
        diskUsage: metric.metric_type === 'disk_usage' ? Number(metric.value) : 0,
        activeConnections: metric.metric_type === 'active_connections' ? Number(metric.value) : 0,
        responseTime: metric.metric_type === 'response_time' ? Number(metric.value) : 0
      }))

      // If no data, return mock data
      if (healthData.length === 0) {
        const mockData: SystemHealthData[] = []
        for (let i = 24; i >= 0; i--) {
          const timestamp = new Date(Date.now() - i * 60 * 60 * 1000)
          mockData.push({
            timestamp: timestamp.toISOString(),
            cpuUsage: 30 + Math.random() * 40,
            memoryUsage: 60 + Math.random() * 20,
            diskUsage: 45 + Math.random() * 10,
            activeConnections: 100 + Math.floor(Math.random() * 50),
            responseTime: 200 + Math.random() * 100
          })
        }
        return mockData
      }

      return healthData
    } catch (error) {
      console.error('Error fetching system health:', error)
      throw error
    }
  }
}

export const superAdminService = new SuperAdminService()
