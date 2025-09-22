import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard, SuperAdminGuard } from '@/components/auth/AuthGuard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { LoginPage, DashboardPage, SuperAdminDashboard } from '@/pages'
import { GlobalUsersPage } from '@/pages/superadmin/GlobalUsersPage'
import { OrganizationsPage } from '@/pages/superadmin/OrganizationsPage'
import { TemplatesPage } from '@/pages/superadmin/TemplatesPage'
import { initializeAuth, useAuthStore } from '@/stores/authStore'

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Smart redirect component that routes based on user role
const SmartRedirect: React.FC = () => {
  const { isAuthenticated, isSuperAdmin, profile, isLoading } = useAuth()

  // Wait for loading to complete before making routing decisions
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Wait for profile to be loaded before checking SuperAdmin status
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isSuperAdmin) {
    return <Navigate to="/superadmin" replace />
  }

  return <Navigate to="/dashboard" replace />
}

// App content component (separated to use hooks)
const AppContent: React.FC = () => {
  const { isLoading } = useAuth()

  // Show loading screen while initializing auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading AuditFortress...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

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

      {/* Default redirect - SuperAdmins go to SuperAdmin dashboard, others to regular dashboard */}
      <Route path="/" element={<SmartRedirect />} />

      {/* Catch all - redirect based on user role */}
      <Route path="*" element={<SmartRedirect />} />
    </Routes>
  )
}

function App() {
  useEffect(() => {
    // Initialize authentication on app start
    const initAuth = async () => {
      try {
        await initializeAuth()
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // Force stop loading after 10 seconds to prevent infinite loading
        setTimeout(() => {
          useAuthStore.getState().setLoading(false)
        }, 10000)
      }
    }

    initAuth()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
