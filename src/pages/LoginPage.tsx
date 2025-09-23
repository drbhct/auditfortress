import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { useAuth } from '@/hooks/useAuth'

// Smart redirect component for login page
const LoginRedirect: React.FC = () => {
  const { isAuthenticated, isSuperAdmin, profile, isLoading } = useAuth()

  // Wait for loading to complete
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If not authenticated, don't redirect
  if (!isAuthenticated) {
    return null
  }

  // Wait for profile to be loaded before checking SuperAdmin status
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect based on user role
  if (isSuperAdmin) {
    return <Navigate to="/superadmin" replace />
  } else {
    return <Navigate to="/dashboard" replace />
  }
}

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)

  // Show redirect logic if authenticated
  if (isAuthenticated) {
    return <LoginRedirect />
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isSignUp ? (
          <SignUpForm
            onSuccess={() => {
              // Switch back to login after successful signup
              setIsSignUp(false)
            }}
            onSignInClick={() => setIsSignUp(false)}
          />
        ) : (
          <LoginForm
            onSuccess={() => {
              // Navigation will be handled by the auth state change
            }}
            onSignUpClick={() => setIsSignUp(true)}
          />
        )}
      </div>
    </div>
  )
}

export default LoginPage
