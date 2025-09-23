import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard, SuperAdminGuard } from '@/components/auth/AuthGuard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FullScreenLayout } from '@/components/layout'
import { useAuth } from '@/hooks/useAuth'

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('@/pages/LoginPage'))
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'))
const DocumentsPage = React.lazy(() => import('@/pages/DocumentsPage'))
const TeamPage = React.lazy(() => import('@/pages/TeamPage'))
const CompliancePage = React.lazy(() => import('@/pages/CompliancePage'))
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'))
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'))
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'))

// SuperAdmin pages
import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard'
import OrganizationsPage from '@/pages/superadmin/OrganizationsPage'
import GlobalUsersPage from '@/pages/superadmin/GlobalUsersPage'
import UserDetailPage from '@/pages/superadmin/UserDetailPage'
import TemplatesPage from '@/pages/superadmin/TemplatesPageNew'
import TeamMemberDetailPage from '@/pages/TeamMemberDetailPage'
// import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard'
// const SuperAdminDashboard = React.lazy(() => import('@/pages/superadmin/SuperAdminDashboard'))
// const OrganizationsPage = React.lazy(() => import('@/pages/superadmin/OrganizationsPage'))
// const GlobalUsersPage = React.lazy(() => import('@/pages/superadmin/GlobalUsersPage'))
// const TemplatesPage = React.lazy(() => import('@/pages/superadmin/TemplatesPage'))

// Loading component
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-gray-600">Loading page...</p>
    </div>
  </div>
)

// Smart redirect component that routes based on user role
const SmartRedirect: React.FC = () => {
  const { isAuthenticated, isSuperAdmin, profile, isLoading } = useAuth()

  // Wait for loading to complete before making routing decisions
  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Wait for profile to be loaded before checking SuperAdmin status
  if (!profile) {
    return <PageLoader />
  }

  if (isSuperAdmin) {
    return <Navigate to="/superadmin" replace />
  }

  return <Navigate to="/dashboard" replace />
}

// Route configuration
export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <FullScreenLayout>
              <LoginPage />
            </FullScreenLayout>
          }
        />

        {/* SuperAdmin routes */}
        <Route
          path="/superadmin"
          element={
            <SuperAdminGuard>
              <SuperAdminDashboard />
            </SuperAdminGuard>
          }
        />
        <Route
          path="/superadmin/organizations"
          element={
            <SuperAdminGuard>
              <OrganizationsPage />
            </SuperAdminGuard>
          }
        />
        <Route
          path="/superadmin/users"
          element={
            <SuperAdminGuard>
              <GlobalUsersPage />
            </SuperAdminGuard>
          }
        />
        <Route
          path="/superadmin/users/:userId"
          element={
            <SuperAdminGuard>
              <UserDetailPage />
            </SuperAdminGuard>
          }
        />
        <Route
          path="/superadmin/templates"
          element={
            <SuperAdminGuard>
              <TemplatesPage />
            </SuperAdminGuard>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/documents"
          element={
            <AuthGuard>
              <DocumentsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/team"
          element={
            <AuthGuard>
              <TeamPage />
            </AuthGuard>
          }
        />
        <Route
          path="/team/:memberId"
          element={
            <AuthGuard>
              <TeamMemberDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/compliance"
          element={
            <AuthGuard>
              <CompliancePage />
            </AuthGuard>
          }
        />
        <Route
          path="/analytics"
          element={
            <AuthGuard>
              <AnalyticsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <SettingsPage />
            </AuthGuard>
          }
        />

        {/* Default redirect - SuperAdmins go to SuperAdmin dashboard, others to regular dashboard */}
        <Route path="/" element={<SmartRedirect />} />

        {/* Catch all - redirect based on user role */}
        <Route path="*" element={<SmartRedirect />} />
      </Routes>
    </Suspense>
  )
}

// Route definitions types
interface BaseRoute {
  path: string
  label: string
}

interface AuthRoute extends BaseRoute {
  requiresAuth: true
}

interface SuperAdminRoute extends BaseRoute {
  requiresSuperAdmin: true
}

interface PublicRoute extends BaseRoute {
  requiresAuth: false
}

type RouteDefinition = AuthRoute | SuperAdminRoute | PublicRoute

// Route definitions for navigation
export const routeDefinitions: Record<string, RouteDefinition> = {
  // Public routes
  login: {
    path: '/login',
    label: 'Login',
    requiresAuth: false,
  },

  // Protected routes
  dashboard: {
    path: '/dashboard',
    label: 'Dashboard',
    requiresAuth: true,
  },
  documents: {
    path: '/documents',
    label: 'Documents',
    requiresAuth: true,
  },
  compliance: {
    path: '/compliance',
    label: 'Compliance',
    requiresAuth: true,
  },
  analytics: {
    path: '/analytics',
    label: 'Analytics',
    requiresAuth: true,
  },
  profile: {
    path: '/profile',
    label: 'Profile',
    requiresAuth: true,
  },
  settings: {
    path: '/settings',
    label: 'Settings',
    requiresAuth: true,
  },

  // SuperAdmin routes
  superadmin: {
    path: '/superadmin',
    label: 'SuperAdmin',
    requiresSuperAdmin: true,
  },
  superadminOrganizations: {
    path: '/superadmin/organizations',
    label: 'Organizations',
    requiresSuperAdmin: true,
  },
  superadminUsers: {
    path: '/superadmin/users',
    label: 'Global Users',
    requiresSuperAdmin: true,
  },
  superadminTemplates: {
    path: '/superadmin/templates',
    label: 'Templates',
    requiresSuperAdmin: true,
  },
}

// Helper function to check if a route is accessible
export const isRouteAccessible = (
  route: keyof typeof routeDefinitions,
  userRole: string,
  isAuthenticated: boolean
): boolean => {
  const routeDef = routeDefinitions[route]

  if ('requiresSuperAdmin' in routeDef && routeDef.requiresSuperAdmin && userRole !== 'superadmin') {
    return false
  }

  if ('requiresAuth' in routeDef && routeDef.requiresAuth && !isAuthenticated) {
    return false
  }

  return true
}

// Helper function to get accessible routes for a user
export const getAccessibleRoutes = (userRole: string, isAuthenticated: boolean) => {
  return Object.entries(routeDefinitions).filter(([key]) =>
    isRouteAccessible(key as keyof typeof routeDefinitions, userRole, isAuthenticated)
  )
}
