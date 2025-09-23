import React, { useState, useEffect } from 'react'

export interface DevRole {
  id: string
  name: string
  email: string
  role: string
  roleType: 'superadmin' | 'account_owner' | 'compliance_officer' | 'team_member'
}

/**
 * Hook to manage development role switching
 * This allows developers to test different user permissions without logging in/out
 */
export const useDevRole = () => {
  const [devRole, setDevRole] = useState<DevRole | null>(null)

  useEffect(() => {
    // Load saved role from localStorage
    const loadSavedRole = () => {
      const savedRole = localStorage.getItem('dev-user-role')
      if (savedRole) {
        try {
          const role = JSON.parse(savedRole)
          setDevRole(role)
        } catch (error) {
          console.warn('Failed to load saved dev role:', error)
        }
      }
    }

    // Listen for role changes from RoleSwitcher
    const handleRoleChange = (event: CustomEvent) => {
      console.log('🔧 useDevRole received role change:', event.detail.devUser)
      const devUser = event.detail.devUser
      setDevRole(devUser)
      
      // If devUser is null (reset), clear localStorage
      if (devUser === null) {
        localStorage.removeItem('dev-user-role')
        console.log('🔧 useDevRole: Cleared dev role (reset to original)')
      } else {
        localStorage.setItem('dev-user-role', JSON.stringify(devUser))
        console.log('🔧 useDevRole: Set dev role:', devUser.roleType)
      }
    }

    loadSavedRole()
    window.addEventListener('dev-role-changed', handleRoleChange as EventListener)

    return () => {
      window.removeEventListener('dev-role-changed', handleRoleChange as EventListener)
    }
  }, [])

  // Dev mode is active when we have a role selected in development
  const isDevMode = process.env.NODE_ENV === 'development' && devRole !== null
  
  const overrides = isDevMode ? {
    // When SuperAdmin is selected, use real permissions (no overrides)
    isSuperAdmin: devRole?.roleType === 'superadmin',
    isAccountOwner: devRole?.roleType === 'account_owner',
    isComplianceOfficer: devRole?.roleType === 'compliance_officer', 
    isTeamMember: devRole?.roleType === 'team_member',
    canCreateFromTemplate: devRole?.roleType === 'superadmin' || devRole?.roleType === 'account_owner' || devRole?.roleType === 'compliance_officer',
    // Add more permission overrides as needed
    canManageTeam: devRole?.roleType === 'superadmin' || devRole?.roleType === 'account_owner',
    canManageSettings: devRole?.roleType === 'superadmin' || devRole?.roleType === 'account_owner',
    canViewAnalytics: devRole?.roleType === 'superadmin' || devRole?.roleType === 'account_owner' || devRole?.roleType === 'compliance_officer',
  } : {}

  // Debug logging (temporarily disabled)
  // React.useEffect(() => {
  //   console.log('🔧 useDevRole state:', {
  //     devRole: devRole?.roleType || 'none',
  //     isDevMode,
  //     overrides
  //   })
  // }, [devRole, isDevMode])

  return {
    devRole,
    isDevMode,
    overrides,
  }
}
