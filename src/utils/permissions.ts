import type { Permission, Role, Profile } from '@/types'

/**
 * Permission constants for the application
 */
export const PERMISSIONS = {
  // Document permissions
  READ_DOCUMENTS: 'read:documents',
  WRITE_DOCUMENTS: 'write:documents',
  DELETE_DOCUMENTS: 'delete:documents',

  // Template permissions
  MANAGE_TEMPLATES: 'manage:templates',
  CREATE_TEMPLATES: 'create:templates',
  EDIT_TEMPLATES: 'edit:templates',
  DELETE_TEMPLATES: 'delete:templates',

  // User management permissions
  MANAGE_USERS: 'manage:users',
  INVITE_USERS: 'invite:users',
  EDIT_USERS: 'edit:users',
  DELETE_USERS: 'delete:users',

  // Organization permissions
  MANAGE_ORGANIZATION: 'manage:organization',
  EDIT_ORGANIZATION: 'edit:organization',
  VIEW_ORGANIZATION_ANALYTICS: 'view:organization_analytics',

  // Analytics permissions
  VIEW_ANALYTICS: 'view:analytics',
  VIEW_SYSTEM_ANALYTICS: 'view:system_analytics',

  // System permissions
  MANAGE_SYSTEM: 'manage:system',
  MANAGE_SYSTEM_SETTINGS: 'manage:system_settings',
  MANAGE_FEATURE_FLAGS: 'manage:feature_flags',
  VIEW_SYSTEM_LOGS: 'view:system_logs',

  // SuperAdmin permissions
  SUPERADMIN_ALL: 'superadmin:all',
} as const

/**
 * Role constants
 */
export const ROLES = {
  SUPERADMIN: 'SuperAdmin',
  ACCOUNT_OWNER: 'Account Owner',
  COMPLIANCE_OFFICER: 'Compliance Officer',
  TEAM_MEMBER: 'Team Member',
} as const

/**
 * Default role permissions mapping
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.SUPERADMIN]: [PERMISSIONS.SUPERADMIN_ALL],

  [ROLES.ACCOUNT_OWNER]: [
    PERMISSIONS.READ_DOCUMENTS,
    PERMISSIONS.WRITE_DOCUMENTS,
    PERMISSIONS.DELETE_DOCUMENTS,
    PERMISSIONS.MANAGE_TEMPLATES,
    PERMISSIONS.CREATE_TEMPLATES,
    PERMISSIONS.EDIT_TEMPLATES,
    PERMISSIONS.DELETE_TEMPLATES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.INVITE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.MANAGE_ORGANIZATION,
    PERMISSIONS.EDIT_ORGANIZATION,
    PERMISSIONS.VIEW_ORGANIZATION_ANALYTICS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  [ROLES.COMPLIANCE_OFFICER]: [
    PERMISSIONS.READ_DOCUMENTS,
    PERMISSIONS.WRITE_DOCUMENTS,
    PERMISSIONS.DELETE_DOCUMENTS,
    PERMISSIONS.MANAGE_TEMPLATES,
    PERMISSIONS.CREATE_TEMPLATES,
    PERMISSIONS.EDIT_TEMPLATES,
    PERMISSIONS.INVITE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  [ROLES.TEAM_MEMBER]: [PERMISSIONS.READ_DOCUMENTS, PERMISSIONS.WRITE_DOCUMENTS],
}

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (
  permission: Permission,
  profile: Profile | null,
  roles: Role[] = [],
): boolean => {
  // SuperAdmins have all permissions
  if (profile?.is_superadmin) {
    return true
  }

  // Check if any of the user's roles have the required permission
  return roles.some(role => {
    const permissions = (role.permissions as Permission[]) || []
    return permissions.includes(permission) || permissions.includes(PERMISSIONS.SUPERADMIN_ALL)
  })
}

/**
 * Check if a user has a specific role
 */
export const hasRole = (roleName: string, roles: Role[] = []): boolean => {
  return roles.some(role => role.name === roleName)
}

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (roleNames: string[], roles: Role[] = []): boolean => {
  return roleNames.some(roleName => hasRole(roleName, roles))
}

/**
 * Check if a user has all of the specified roles
 */
export const hasAllRoles = (roleNames: string[], roles: Role[] = []): boolean => {
  return roleNames.every(roleName => hasRole(roleName, roles))
}

/**
 * Get all permissions for a user based on their roles
 */
export const getUserPermissions = (profile: Profile | null, roles: Role[] = []): Permission[] => {
  // SuperAdmins have all permissions
  if (profile?.is_superadmin) {
    return Object.values(PERMISSIONS)
  }

  // Collect all permissions from user's roles
  const permissions = new Set<Permission>()

  roles.forEach(role => {
    const rolePermissions = (role.permissions as Permission[]) || []
    rolePermissions.forEach(permission => permissions.add(permission))
  })

  return Array.from(permissions)
}

/**
 * Check if a user can access a specific route
 */
export const canAccessRoute = (
  route: string,
  profile: Profile | null,
  roles: Role[] = [],
): boolean => {
  // Define route permissions
  const routePermissions: Record<string, Permission[]> = {
    '/superadmin': [PERMISSIONS.SUPERADMIN_ALL],
    '/superadmin/dashboard': [PERMISSIONS.SUPERADMIN_ALL],
    '/superadmin/organizations': [PERMISSIONS.SUPERADMIN_ALL],
    '/superadmin/templates': [PERMISSIONS.SUPERADMIN_ALL],
    '/superadmin/users': [PERMISSIONS.SUPERADMIN_ALL],
    '/superadmin/analytics': [PERMISSIONS.SUPERADMIN_ALL],
    '/superadmin/settings': [PERMISSIONS.SUPERADMIN_ALL],

    '/dashboard': [PERMISSIONS.READ_DOCUMENTS],
    '/documents': [PERMISSIONS.READ_DOCUMENTS],
    '/templates': [PERMISSIONS.READ_DOCUMENTS],
    '/users': [PERMISSIONS.MANAGE_USERS],
    '/organization': [PERMISSIONS.MANAGE_ORGANIZATION],
    '/analytics': [PERMISSIONS.VIEW_ANALYTICS],
  }

  const requiredPermissions = routePermissions[route]

  // If no specific permissions required, allow access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }

  // Check if user has any of the required permissions
  return requiredPermissions.some(permission => hasPermission(permission, profile, roles))
}

/**
 * Get the highest role level for a user (for UI display purposes)
 */
export const getHighestRole = (roles: Role[] = []): string | null => {
  const roleHierarchy = [
    ROLES.SUPERADMIN,
    ROLES.ACCOUNT_OWNER,
    ROLES.COMPLIANCE_OFFICER,
    ROLES.TEAM_MEMBER,
  ]

  for (const role of roleHierarchy) {
    if (hasRole(role, roles)) {
      return role
    }
  }

  return null
}

/**
 * Check if a user is a SuperAdmin
 */
export const isSuperAdmin = (profile: Profile | null): boolean => {
  return profile?.is_superadmin || false
}

/**
 * Check if a user belongs to an organization
 */
export const hasOrganization = (profile: Profile | null): boolean => {
  return !!profile?.organization_id
}
