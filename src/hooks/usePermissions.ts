import { useAuth } from './useAuth'
import type { Permission } from '@/types'
import {
  hasPermission,
  hasRole,
  hasAnyRole,
  hasAllRoles,
  getUserPermissions,
  canAccessRoute,
  getHighestRole,
  isSuperAdmin,
  hasOrganization,
  PERMISSIONS,
  ROLES,
} from '@/utils/permissions'

/**
 * Custom hook for permission checking
 * Provides convenient methods to check user permissions and roles
 */
export const usePermissions = () => {
  const { profile, roles } = useAuth()

  // Permission checking methods
  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(permission, profile, roles)
  }

  const checkRole = (roleName: string): boolean => {
    return hasRole(roleName, roles)
  }

  const checkAnyRole = (roleNames: string[]): boolean => {
    return hasAnyRole(roleNames, roles)
  }

  const checkAllRoles = (roleNames: string[]): boolean => {
    return hasAllRoles(roleNames, roles)
  }

  const checkRouteAccess = (route: string): boolean => {
    return canAccessRoute(route, profile, roles)
  }

  // Computed permission checks
  const permissions = {
    // Document permissions
    canReadDocuments: checkPermission(PERMISSIONS.READ_DOCUMENTS),
    canWriteDocuments: checkPermission(PERMISSIONS.WRITE_DOCUMENTS),
    canDeleteDocuments: checkPermission(PERMISSIONS.DELETE_DOCUMENTS),

    // Template permissions
    canManageTemplates: checkPermission(PERMISSIONS.MANAGE_TEMPLATES),
    canCreateTemplates: checkPermission(PERMISSIONS.CREATE_TEMPLATES),
    canEditTemplates: checkPermission(PERMISSIONS.EDIT_TEMPLATES),
    canDeleteTemplates: checkPermission(PERMISSIONS.DELETE_TEMPLATES),

    // User management permissions
    canManageUsers: checkPermission(PERMISSIONS.MANAGE_USERS),
    canInviteUsers: checkPermission(PERMISSIONS.INVITE_USERS),
    canEditUsers: checkPermission(PERMISSIONS.EDIT_USERS),
    canDeleteUsers: checkPermission(PERMISSIONS.DELETE_USERS),

    // Organization permissions
    canManageOrganization: checkPermission(PERMISSIONS.MANAGE_ORGANIZATION),
    canEditOrganization: checkPermission(PERMISSIONS.EDIT_ORGANIZATION),
    canViewOrganizationAnalytics: checkPermission(PERMISSIONS.VIEW_ORGANIZATION_ANALYTICS),

    // Analytics permissions
    canViewAnalytics: checkPermission(PERMISSIONS.VIEW_ANALYTICS),
    canViewSystemAnalytics: checkPermission(PERMISSIONS.VIEW_SYSTEM_ANALYTICS),

    // System permissions
    canManageSystem: checkPermission(PERMISSIONS.MANAGE_SYSTEM),
    canManageSystemSettings: checkPermission(PERMISSIONS.MANAGE_SYSTEM_SETTINGS),
    canManageFeatureFlags: checkPermission(PERMISSIONS.MANAGE_FEATURE_FLAGS),
    canViewSystemLogs: checkPermission(PERMISSIONS.VIEW_SYSTEM_LOGS),

    // SuperAdmin permissions
    isSuperAdmin: checkPermission(PERMISSIONS.SUPERADMIN_ALL) || isSuperAdmin(profile),
  }

  // Role checks
  const roleChecks = {
    isSuperAdmin: checkRole(ROLES.SUPERADMIN) || isSuperAdmin(profile),
    isAccountOwner: checkRole(ROLES.ACCOUNT_OWNER),
    isComplianceOfficer: checkRole(ROLES.COMPLIANCE_OFFICER),
    isTeamMember: checkRole(ROLES.TEAM_MEMBER),
  }

  // Route access checks
  const routeAccess = {
    canAccessSuperAdmin: checkRouteAccess('/superadmin'),
    canAccessDashboard: checkRouteAccess('/dashboard'),
    canAccessDocuments: checkRouteAccess('/documents'),
    canAccessTemplates: checkRouteAccess('/templates'),
    canAccessUsers: checkRouteAccess('/users'),
    canAccessOrganization: checkRouteAccess('/organization'),
    canAccessAnalytics: checkRouteAccess('/analytics'),
  }

  // Utility methods
  const allPermissions = getUserPermissions(profile, roles)
  const highestRole = getHighestRole(roles)
  const hasOrgAccess = hasOrganization(profile)

  return {
    // Permission checking methods
    hasPermission: checkPermission,
    hasRole: checkRole,
    hasAnyRole: checkAnyRole,
    hasAllRoles: checkAllRoles,
    canAccessRoute: checkRouteAccess,

    // Computed permissions
    ...permissions,

    // Role checks
    ...roleChecks,

    // Route access
    ...routeAccess,

    // Utility data
    allPermissions,
    highestRole,
    hasOrganization: hasOrgAccess,

    // Constants for reference
    PERMISSIONS,
    ROLES,
  }
}
