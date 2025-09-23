import React from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useDevRole } from './useDevRole'
import { DevUserService } from '@/services/devUserService'
import type { LoginCredentials } from '@/types'

/**
 * Custom hook for authentication functionality
 * Provides access to auth state and actions
 */
export const useAuth = () => {
  const {
    // State
    user,
    profile: originalProfile,
    organization: originalOrganization,
    roles: originalRoles,
    isLoading,
    isAuthenticated,
    isSuperAdmin: authStoreSuperAdmin,

    // Actions
    signIn,
    signOut,
    signUp,
    updateProfile,
    refreshUserData,
    hasPermission,
    hasRole,
  } = useAuthStore()

  // Dev role overrides and impersonation
  const { isDevMode, overrides } = useDevRole()
  const [impersonatedProfile, setImpersonatedProfile] = React.useState<any>(null)
  
  // Check for user impersonation in dev mode
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleUserSwitch = async (event: CustomEvent) => {
        const profileId = event.detail.profileId
        if (profileId) {
          try {
            const profile = await DevUserService.getUserProfile(profileId)
            if (profile) {
              setImpersonatedProfile(profile)
              console.log('🔄 Impersonating user:', profile.email)
            } else {
              console.warn('🔧 Profile not found, clearing impersonation')
              setImpersonatedProfile(null)
            }
          } catch (error) {
            console.warn('🔧 Failed to load impersonated profile:', error)
            // Set a minimal profile object so role switching still works
            setImpersonatedProfile({ 
              id: profileId, 
              email: 'loading...', 
              organization: null 
            })
          }
        } else {
          setImpersonatedProfile(null)
          console.log('🔄 Cleared impersonation')
        }
      }

      const checkCurrentImpersonation = async () => {
        try {
          const impersonatedId = DevUserService.getCurrentImpersonatedUserId()
          if (impersonatedId) {
            const profile = await DevUserService.getUserProfile(impersonatedId)
            if (profile) {
              setImpersonatedProfile(profile)
            } else {
              // Clear invalid impersonation
              DevUserService.clearImpersonation()
            }
          }
        } catch (error) {
          console.warn('Failed to check impersonation:', error)
          // Clear impersonation on error to prevent loops
          DevUserService.clearImpersonation()
        }
      }

      checkCurrentImpersonation()
      window.addEventListener('dev-user-switched', handleUserSwitch as EventListener)

      return () => {
        window.removeEventListener('dev-user-switched', handleUserSwitch as EventListener)
      }
    }
  }, [])

  // Use impersonated profile in dev mode, or original profile
  const profile = (process.env.NODE_ENV === 'development' && impersonatedProfile) ? impersonatedProfile : originalProfile
  const organization = (process.env.NODE_ENV === 'development' && impersonatedProfile?.organization) ? impersonatedProfile.organization : originalOrganization
  const roles = originalRoles // TODO: Could also impersonate roles if needed
  
  // Override isSuperAdmin when in dev mode, BUT remember original SuperAdmin status
  const isOriginalSuperAdmin = authStoreSuperAdmin
  const isSuperAdmin = isDevMode ? (overrides.isSuperAdmin || false) : authStoreSuperAdmin
  
  // Debug logging to trace the issue (temporarily disabled)
  // React.useEffect(() => {
  //   console.log('🔧 useAuth Debug:', {
  //     isDevMode,
  //     authStoreSuperAdmin,
  //     overriddenSuperAdmin: isSuperAdmin,
  //     overrides,
  //     impersonatedProfile: impersonatedProfile?.email,
  //     currentPath: window.location.pathname
  //   })
  // }, [isDevMode, isSuperAdmin, authStoreSuperAdmin, overrides, impersonatedProfile])
  
  // Helper to check if we're impersonating (useful for UI)
  const isImpersonating = process.env.NODE_ENV === 'development' && impersonatedProfile !== null

  // Debug logging for dev mode (disabled for clean experience)
  // React.useEffect(() => {
  //   console.log('🔧 useAuth state:', {
  //     isDevMode,
  //     authStoreSuperAdmin,
  //     overriddenSuperAdmin: isSuperAdmin,
  //     overrides,
  //     impersonatedProfile: impersonatedProfile?.email,
  //     currentPath: window.location.pathname
  //   })
  // }, [isDevMode, isSuperAdmin, authStoreSuperAdmin, overrides, impersonatedProfile])

  // Computed values
  const userDisplayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : user?.email || 'Unknown User'

  const userInitials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
      : (profile?.email || user?.email || 'U')[0].toUpperCase()

  const isAccountOwner = isDevMode ? (overrides.isAccountOwner || false) : hasRole('Account Owner')
  const isComplianceOfficer = isDevMode ? (overrides.isComplianceOfficer || false) : hasRole('Compliance Officer')
  const isTeamMember = isDevMode ? (overrides.isTeamMember || false) : hasRole('Team Member')

  // Authentication methods
  const login = async (credentials: LoginCredentials) => {
    return await signIn(credentials)
  }

  const logout = async () => {
    await signOut()
  }

  const register = async (
    credentials: LoginCredentials & { firstName: string; lastName: string }
  ) => {
    return await signUp(credentials)
  }

  // Permission helpers
  const canManageDocuments = hasPermission('write:documents') || hasPermission('manage:templates')
  const canManageUsers = hasPermission('manage:users')
  const canManageOrganization = hasPermission('manage:organization')
  const canViewAnalytics = hasPermission('view:analytics')
  const canManageSystem = hasPermission('manage:system')

  // Organization helpers
  const isOrganizationActive = organization?.status === 'active'
  const isOrganizationTrial = organization?.status === 'trial'
  const organizationType = organization?.type

  return {
    // State
    user,
    profile,
    organization,
    roles,
    isLoading,
    isAuthenticated,
    isSuperAdmin,

    // Dev mode helpers
    isOriginalSuperAdmin,
    isImpersonating,
    originalProfile,

    // Computed values
    userDisplayName,
    userInitials,

    // Role checks
    isAccountOwner,
    isComplianceOfficer,
    isTeamMember,

    // Permission checks
    canManageDocuments,
    canManageUsers,
    canManageOrganization,
    canViewAnalytics,
    canManageSystem,

    // Organization info
    isOrganizationActive,
    isOrganizationTrial,
    organizationType,

    // Actions
    login,
    logout,
    register,
    updateProfile,
    refreshUserData,
    hasPermission,
    hasRole,
  }
}
