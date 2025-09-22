import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard, SuperAdminGuard } from '@/components/auth/AuthGuard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MainLayout, DashboardLayout, SidebarLayout, FullScreenLayout } from '@/components/layout'
import { useAuth } from '@/hooks/useAuth'

// Lazy load pages for better performance
const LoginPage = React.lazy(() =>
  import('@/pages/LoginPage').then(module => ({ default: module.LoginPage }))
)
const DashboardPage = React.lazy(() =>
  import('@/pages/DashboardPage').then(module => ({ default: module.DashboardPage }))
)
const DocumentsPage = React.lazy(() =>
  import('@/pages/DocumentsPage').then(module => ({ default: module.DocumentsPage }))
)
const CompliancePage = React.lazy(() =>
  import('@/pages/CompliancePage').then(module => ({ default: module.CompliancePage }))
)
const AnalyticsPage = React.lazy(() =>
  import('@/pages/AnalyticsPage').then(module => ({ default: module.AnalyticsPage }))
)
const ProfilePage = React.lazy(() =>
  import('@/pages/ProfilePage').then(module => ({ default: module.ProfilePage }))
)
const SettingsPage = React.lazy(() =>
  import('@/pages/SettingsPage').then(module => ({ default: module.SettingsPage }))
)

// SuperAdmin pages
const SuperAdminDashboard = React.lazy(() =>
  import('@/pages/superadmin/SuperAdminDashboard').then(module => ({
    default: module.SuperAdminDashboard,
  }))
)
const OrganizationsPage = React.lazy(() =>
  import('@/pages/superadmin/OrganizationsPage').then(module => ({
    default: module.OrganizationsPage,
  }))
)
const GlobalUsersPage = React.lazy(() =>
  import('@/pages/superadmin/GlobalUsersPage').then(module => ({ default: module.GlobalUsersPage }))
)
const TemplatesPage = React.lazy(() =>
  import('@/pages/superadmin/TemplatesPage').then(module => ({ default: module.TemplatesPage }))
)

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
              <SidebarLayout>
                <SuperAdminDashboard />
              </SidebarLayout>
            </SuperAdminGuard>
          }
        />
        <Route
          path="/superadmin/organizations"
          element={
            <SuperAdminGuard>
              <SidebarLayout>
                <OrganizationsPage />
              </SidebarLayout>
            </SuperAdminGuard>
          }
        />
        <Route
          path="/superadmin/users"
          element={
            <SuperAdminGuard>
              <SidebarLayout>
                <GlobalUsersPage />
              </SidebarLayout>
            </SuperAdminGuard>
          }
        />
        <Route
          path="/superadmin/templates"
          element={
            <SuperAdminGuard>
              <SidebarLayout>
                <TemplatesPage />
              </SidebarLayout>
            </SuperAdminGuard>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/documents"
          element={
            <AuthGuard>
              <MainLayout showSidebar={true}>
                <DocumentsPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/compliance"
          element={
            <AuthGuard>
              <MainLayout showSidebar={true}>
                <CompliancePage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/analytics"
          element={
            <AuthGuard>
              <MainLayout showSidebar={true}>
                <AnalyticsPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <MainLayout showSidebar={true}>
                <ProfilePage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <MainLayout showSidebar={true}>
                <SettingsPage />
              </MainLayout>
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

// Route definitions for navigation
export const routeDefinitions = {
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

  if (routeDef.requiresSuperAdmin && userRole !== 'superadmin') {
    return false
  }

  if (routeDef.requiresAuth && !isAuthenticated) {
    return false
  }

  return true
}

// Helper function to get accessible routes for a user
export const getAccessibleRoutes = (userRole: string, isAuthenticated: boolean) => {
  return Object.entries(routeDefinitions).filter(([key, route]) =>
    isRouteAccessible(key as keyof typeof routeDefinitions, userRole, isAuthenticated)
  )
}
