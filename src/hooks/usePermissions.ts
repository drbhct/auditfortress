import React from 'react'
import { useAuth } from './useAuth'
import { useDevRole } from './useDevRole'
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
  const { isDevMode, overrides, devRole } = useDevRole()

  // Debug logging (disabled)
  // React.useEffect(() => {
  //   console.log('🔧 usePermissions debug:', {
  //     isDevMode,
  //     devRole,
  //     overrides,
  //     realIsSuperAdmin: isSuperAdmin(profile)
  //   })
  // }, [isDevMode, devRole, overrides, profile])

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

  // Computed permission checks with dev mode overrides
  const permissions = {
    // Document permissions
    canReadDocuments: isDevMode ? overrides.canCreateFromTemplate || true : checkPermission(PERMISSIONS.READ_DOCUMENTS),
    canWriteDocuments: isDevMode ? overrides.canCreateFromTemplate || true : checkPermission(PERMISSIONS.WRITE_DOCUMENTS),
    canDeleteDocuments: isDevMode ? overrides.canCreateFromTemplate || false : checkPermission(PERMISSIONS.DELETE_DOCUMENTS),

    // Template permissions
    canManageTemplates: isDevMode ? false : checkPermission(PERMISSIONS.MANAGE_TEMPLATES),
    canCreateTemplates: isDevMode ? false : checkPermission(PERMISSIONS.CREATE_TEMPLATES),
    canEditTemplates: isDevMode ? false : checkPermission(PERMISSIONS.EDIT_TEMPLATES),
    canDeleteTemplates: isDevMode ? false : checkPermission(PERMISSIONS.DELETE_TEMPLATES),

    // User management permissions
    canManageUsers: isDevMode ? overrides.canManageTeam || false : checkPermission(PERMISSIONS.MANAGE_USERS),
    canInviteUsers: isDevMode ? overrides.canManageTeam || false : checkPermission(PERMISSIONS.INVITE_USERS),
    canEditUsers: isDevMode ? overrides.canManageTeam || false : checkPermission(PERMISSIONS.EDIT_USERS),
    canDeleteUsers: isDevMode ? overrides.canManageTeam || false : checkPermission(PERMISSIONS.DELETE_USERS),

    // Organization permissions
    canManageOrganization: isDevMode ? overrides.canManageSettings || false : checkPermission(PERMISSIONS.MANAGE_ORGANIZATION),
    canEditOrganization: isDevMode ? overrides.canManageSettings || false : checkPermission(PERMISSIONS.EDIT_ORGANIZATION),
    canViewOrganizationAnalytics: isDevMode ? overrides.canViewAnalytics || false : checkPermission(PERMISSIONS.VIEW_ORGANIZATION_ANALYTICS),

    // Analytics permissions
    canViewAnalytics: isDevMode ? overrides.canViewAnalytics || false : checkPermission(PERMISSIONS.VIEW_ANALYTICS),
    canViewSystemAnalytics: isDevMode ? false : checkPermission(PERMISSIONS.VIEW_SYSTEM_ANALYTICS),

    // System permissions (always false in dev mode when testing org users)
    canManageSystem: isDevMode ? false : checkPermission(PERMISSIONS.MANAGE_SYSTEM),
    canManageSystemSettings: isDevMode ? false : checkPermission(PERMISSIONS.MANAGE_SYSTEM_SETTINGS),
    canManageFeatureFlags: isDevMode ? false : checkPermission(PERMISSIONS.MANAGE_FEATURE_FLAGS),
    canViewSystemLogs: isDevMode ? false : checkPermission(PERMISSIONS.VIEW_SYSTEM_LOGS),

    // SuperAdmin permissions (with dev mode override support)
    isSuperAdmin: isDevMode ? (overrides.isSuperAdmin || false) : (checkPermission(PERMISSIONS.SUPERADMIN_ALL) || isSuperAdmin(profile)),
  }

  // Role checks with dev mode overrides
  const roleChecks = {
    isSuperAdmin: isDevMode ? (overrides.isSuperAdmin || false) : (checkRole(ROLES.SUPERADMIN) || isSuperAdmin(profile)),
    isAccountOwner: isDevMode ? overrides.isAccountOwner : checkRole(ROLES.ACCOUNT_OWNER),
    isComplianceOfficer: isDevMode ? overrides.isComplianceOfficer : checkRole(ROLES.COMPLIANCE_OFFICER),
    isTeamMember: isDevMode ? overrides.isTeamMember : checkRole(ROLES.TEAM_MEMBER),
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
