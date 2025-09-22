import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAuth } from '@/hooks/useAuth'
import { useKeyboardShortcuts } from '@/hooks/useNavigation'
import { AppRoutes } from '@/routes'
import { initializeAuth, useAuthStore } from '@/stores/authStore'
import { initializeSecurity } from '@/utils/security'

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// App content component (separated to use hooks)
const AppContent: React.FC = () => {
  const { isLoading } = useAuth()

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

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

  return <AppRoutes />
}

function App() {
  useEffect(() => {
    // Initialize security features
    initializeSecurity()

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
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}

export default App
