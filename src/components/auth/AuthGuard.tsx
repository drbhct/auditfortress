import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'
import type { Permission } from '@/types'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requirePermissions?: Permission[]
  requireRoles?: string[]
  requireSuperAdmin?: boolean
  fallback?: React.ReactNode
  redirectTo?: string
}

/**
 * AuthGuard component for protecting routes and components
 * Handles authentication and authorization checks
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requirePermissions = [],
  requireRoles = [],
  requireSuperAdmin = false,
  fallback,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth()
  const { hasPermission, hasAnyRole } = usePermissions()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check SuperAdmin requirement
  if (requireSuperAdmin && !isSuperAdmin) {
    if (fallback) {
      return <>{fallback}</>
    }
    // Redirect non-superadmins to their appropriate dashboard
    return <Navigate to="/dashboard" replace />
  }

  // Check permission requirements
  if (requirePermissions.length > 0) {
    const hasRequiredPermissions = requirePermissions.some(permission => hasPermission(permission))

    if (!hasRequiredPermissions) {
      if (fallback) {
        return <>{fallback}</>
      }
      return <Navigate to="/unauthorized" replace />
    }
  }

  // Check role requirements
  if (requireRoles.length > 0) {
    const hasRequiredRoles = hasAnyRole(requireRoles)

    if (!hasRequiredRoles) {
      if (fallback) {
        return <>{fallback}</>
      }
      return <Navigate to="/unauthorized" replace />
    }
  }

  // All checks passed, render children
  return <>{children}</>
}

/**
 * Higher-order component version of AuthGuard
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  guardProps: Omit<AuthGuardProps, 'children'>,
) {
  function WrappedComponent(props: P) {
    return (
      <AuthGuard {...guardProps}>
        <Component {...props} />
      </AuthGuard>
    )
  }

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Specialized guards for common use cases
 */
export const SuperAdminGuard: React.FC<{
  children: React.ReactNode
  fallback?: React.ReactNode
}> = ({ children, fallback }) => (
  <AuthGuard requireSuperAdmin fallback={fallback}>
    {children}
  </AuthGuard>
)

export const PermissionGuard: React.FC<{
  children: React.ReactNode
  permissions: Permission[]
  fallback?: React.ReactNode
}> = ({ children, permissions, fallback }) => (
  <AuthGuard requirePermissions={permissions} fallback={fallback}>
    {children}
  </AuthGuard>
)

export const RoleGuard: React.FC<{
  children: React.ReactNode
  roles: string[]
  fallback?: React.ReactNode
}> = ({ children, roles, fallback }) => (
  <AuthGuard requireRoles={roles} fallback={fallback}>
    {children}
  </AuthGuard>
)
