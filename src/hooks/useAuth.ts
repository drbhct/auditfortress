import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/types'

/**
 * Custom hook for authentication functionality
 * Provides access to auth state and actions
 */
export const useAuth = () => {
  const {
    // State
    user,
    profile,
    organization,
    roles,
    isLoading,
    isAuthenticated,
    isSuperAdmin,

    // Actions
    signIn,
    signOut,
    signUp,
    updateProfile,
    refreshUserData,
    hasPermission,
    hasRole,
  } = useAuthStore()

  // Computed values
  const userDisplayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : user?.email || 'Unknown User'

  const userInitials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
      : (profile?.email || user?.email || 'U')[0].toUpperCase()

  const isAccountOwner = hasRole('Account Owner')
  const isComplianceOfficer = hasRole('Compliance Officer')
  const isTeamMember = hasRole('Team Member')

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
