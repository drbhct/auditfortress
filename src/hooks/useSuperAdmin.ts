import { useQuery, useQueryClient } from '@tanstack/react-query'
import { superAdminService } from '@/services/superAdminService'

export const SUPERADMIN_QUERY_KEYS = {
  all: ['superadmin'] as const,
  dashboard: () => [...SUPERADMIN_QUERY_KEYS.all, 'dashboard'] as const,
  metrics: () => [...SUPERADMIN_QUERY_KEYS.dashboard(), 'metrics'] as const,
  userActivity: (days: number) => [...SUPERADMIN_QUERY_KEYS.dashboard(), 'userActivity', days] as const,
  organizationGrowth: (days: number) => [...SUPERADMIN_QUERY_KEYS.dashboard(), 'organizationGrowth', days] as const,
  revenue: (days: number) => [...SUPERADMIN_QUERY_KEYS.dashboard(), 'revenue', days] as const,
  systemHealth: () => [...SUPERADMIN_QUERY_KEYS.dashboard(), 'systemHealth'] as const,
  users: () => [...SUPERADMIN_QUERY_KEYS.all, 'users'] as const,
  usersList: (page: number, limit: number, filters: any) => 
    [...SUPERADMIN_QUERY_KEYS.users(), 'list', { page, limit, filters }] as const,
  organizations: () => [...SUPERADMIN_QUERY_KEYS.all, 'organizations'] as const,
  organizationsList: (page: number, limit: number, filters: any) => 
    [...SUPERADMIN_QUERY_KEYS.organizations(), 'list', { page, limit, filters }] as const,
  activityLogs: () => [...SUPERADMIN_QUERY_KEYS.all, 'activityLogs'] as const,
  activityLogsList: (page: number, limit: number, filters: any) => 
    [...SUPERADMIN_QUERY_KEYS.activityLogs(), 'list', { page, limit, filters }] as const,
}

/**
 * Hook for fetching dashboard metrics
 */
export function useDashboardMetrics() {
  return useQuery({
    queryKey: SUPERADMIN_QUERY_KEYS.metrics(),
    queryFn: () => superAdminService.getDashboardMetrics(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

/**
 * Hook for fetching user activity data
 */
export function useUserActivityData(days = 30) {
  return useQuery({
    queryKey: SUPERADMIN_QUERY_KEYS.userActivity(days),
    queryFn: () => superAdminService.getUserActivityData(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for fetching organization growth data
 */
export function useOrganizationGrowthData(days = 30) {
  return useQuery({
    queryKey: SUPERADMIN_QUERY_KEYS.organizationGrowth(days),
    queryFn: () => superAdminService.getOrganizationGrowthData(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for fetching revenue data
 */
export function useRevenueData(days = 30) {
  return useQuery({
    queryKey: SUPERADMIN_QUERY_KEYS.revenue(days),
    queryFn: () => superAdminService.getRevenueData(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for fetching system health data
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: SUPERADMIN_QUERY_KEYS.systemHealth(),
    queryFn: () => superAdminService.getSystemHealth(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  })
}

/**
 * Hook for fetching all users with pagination and filtering
 */
export function useAllUsers(
  page = 1,
  limit = 10,
  filters: { status?: string; search?: string; organization?: string } = {}
) {
  return useQuery({
    queryKey: SUPERADMIN_QUERY_KEYS.usersList(page, limit, filters),
    queryFn: () => superAdminService.getAllUsers(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new page
  })
}

/**
 * Hook for fetching all organizations with pagination and filtering
 */
export function useAllOrganizations(
  page = 1,
  limit = 10,
  filters: { status?: string; type?: string; search?: string } = {}
) {
  return useQuery({
    queryKey: SUPERADMIN_QUERY_KEYS.organizationsList(page, limit, filters),
    queryFn: () => superAdminService.getAllOrganizations(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new page
  })
}

/**
 * Hook for fetching activity logs with pagination and filtering
 */
export function useActivityLogs(
  page = 1,
  limit = 20,
  filters: {
    user_id?: string
    organization_id?: string
    action?: string
    entity_type?: string
  } = {}
) {
  return useQuery({
    queryKey: SUPERADMIN_QUERY_KEYS.activityLogsList(page, limit, filters),
    queryFn: () => superAdminService.getActivityLogs(page, limit, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true, // Keep previous data while fetching new page
  })
}

/**
 * Hook for refreshing dashboard data
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: SUPERADMIN_QUERY_KEYS.dashboard() })
  }
}
