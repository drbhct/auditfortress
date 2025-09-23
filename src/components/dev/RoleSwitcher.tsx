import React, { useState } from 'react'
import {
  ChevronUpDownIcon,
  UserIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { CommandLineIcon as CrownIcon } from '@heroicons/react/24/outline' // Using CommandLineIcon as crown substitute
import { useAuth } from '@/hooks/useAuth'
import { DevUserService } from '@/services/devUserService'
import { cn } from '@/utils/cn'

interface DevUser {
  id: string
  name: string
  email: string
  role: string
  roleType: 'superadmin' | 'account_owner' | 'compliance_officer' | 'team_member'
  icon: React.ComponentType<{ className?: string }>
  description: string
  profileId?: string
}

// Real database users for testing
const REAL_TEST_USERS: DevUser[] = [
  {
    id: 'real-superadmin',
    profileId: 'bd81df73-1ef6-4e71-9ef5-5b5ddd94ebcb',
    name: 'Test User (SuperAdmin)',
    email: 'testuser.auditfortress@gmail.com',
    role: 'SuperAdmin',
    roleType: 'superadmin',
    icon: ShieldCheckIcon,
    description: 'Full system access, can manage all organizations and templates'
  },
  {
    id: 'real-account-owner',
    profileId: '5b48afeb-a131-4b27-a7a5-f7baa8a94d59',
    name: 'Test Admin',
    email: 'testadmin@auditfortress.dev',
    role: 'Account Owner',
    roleType: 'account_owner',
    icon: CrownIcon,
    description: 'Full organization access, can manage team and settings'
  },
  {
    id: 'real-compliance-officer',
    profileId: '2a84b3d8-1c81-4627-90d5-a41231e96452',
    name: 'Test Compliance',
    email: 'testcompliance@auditfortress.dev',
    role: 'Compliance Officer',
    roleType: 'compliance_officer',
    icon: ShieldCheckIcon,
    description: 'Can create documents from templates, manage compliance'
  },
  {
    id: 'real-team-member',
    profileId: '60e2a4b2-0804-48a8-8254-09951e189ba1',
    name: 'Test Member',
    email: 'testmember@auditfortress.dev',
    role: 'Team Member', 
    roleType: 'team_member',
    icon: UsersIcon,
    description: 'Basic access, can create blank documents only'
  }
]

const getDevUsers = (profile: any): DevUser[] => REAL_TEST_USERS

export const RoleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { profile, originalProfile, isImpersonating, isOriginalSuperAdmin } = useAuth()
  
  const DEV_USERS = getDevUsers(profile)
  const [currentDevUser, setCurrentDevUser] = useState<DevUser>(DEV_USERS[0]) // Default to SuperAdmin
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Debug logging (disabled for cleaner experience)
  // React.useEffect(() => {
  //   console.log('🔧 RoleSwitcher mounted, current user:', currentDevUser)
  //   console.log('🔧 NODE_ENV:', process.env.NODE_ENV)
  // }, [])

  // React.useEffect(() => {
  //   console.log('🔧 RoleSwitcher dropdown state changed to:', isOpen)
  // }, [isOpen])

  // Only show in development - Debug: always show for now
  // if (process.env.NODE_ENV === 'production') {
  //   return null
  // }

  const handleUserSwitch = (devUser: DevUser) => {
    console.log(`🔄 Dev Mode: Switching to ${devUser.role} (${devUser.name})`, { devUser })
    
    setCurrentDevUser(devUser)
    setIsOpen(false)
    
    // Store in localStorage for persistence across page reloads
    localStorage.setItem('dev-user-role', JSON.stringify(devUser))
    
    // Dispatch role change event for permissions (only once)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('dev-role-changed', { 
        detail: { devUser } 
      }))
    }, 0)
    
    // Switch to the real database user if profileId exists
    if (devUser.profileId) {
      DevUserService.switchToUser(devUser.profileId)
    } else {
      DevUserService.clearImpersonation()
    }
    
    // Navigate to appropriate dashboard based on user type
    setTimeout(() => {
      if (devUser.roleType === 'superadmin') {
        window.location.href = '/superadmin'
      } else {
        // For all organization users (owner, compliance, member), go to dashboard
        window.location.href = '/dashboard'
      }
    }, 100)
  }

  // Load saved role on mount and when profile changes
  React.useEffect(() => {
    const savedRole = localStorage.getItem('dev-user-role')
    if (savedRole) {
      try {
        const devUser = JSON.parse(savedRole)
        // Find the corresponding user in the current DEV_USERS (profile might have changed)
        const matchingUser = DEV_USERS.find(u => u.id === devUser.id)
        if (matchingUser) {
          setCurrentDevUser(matchingUser)
        } else {
          // Default to SuperAdmin if saved role not found
          setCurrentDevUser(DEV_USERS[0])
        }
      } catch (error) {
        console.warn('Failed to load saved dev role:', error)
        setCurrentDevUser(DEV_USERS[0])
      }
    } else {
      // Default to SuperAdmin
      setCurrentDevUser(DEV_USERS[0])
    }
  }, [profile])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const CurrentIcon = currentDevUser.icon

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dev Mode Badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <span className={cn(
          "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border",
          isImpersonating 
            ? "bg-red-100 text-red-800 border-red-200" 
            : "bg-yellow-100 text-yellow-800 border-yellow-200"
        )}>
          {isImpersonating ? "IMPERSONATING" : "DEV"}
        </span>
      </div>

      {/* User Button - Compact for header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center text-left hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors border border-gray-200"
      >
        <div className="flex-shrink-0 relative">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <CurrentIcon className="h-4 w-4 text-gray-600" />
          </div>
        </div>
        <div className="ml-2 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">
            {currentDevUser.name}
          </p>
        </div>
        <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Switch Role (Dev Mode)
            </p>
            {isImpersonating && originalProfile && (
              <p className="text-xs text-gray-600 mt-1">
                Originally: {originalProfile.first_name} {originalProfile.last_name} ({originalProfile.email})
              </p>
            )}
          </div>
          
          {DEV_USERS.map((devUser) => {
            const Icon = devUser.icon
            const isActive = currentDevUser.id === devUser.id
            
            return (
              <button
                key={devUser.id}
                onClick={() => handleUserSwitch(devUser)}
                className={cn(
                  'w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors',
                  isActive && 'bg-blue-50 border-r-2 border-blue-500'
                )}
              >
                <div className="flex items-start">
                  <Icon className={cn(
                    'h-5 w-5 mt-0.5 flex-shrink-0',
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  )} />
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        isActive ? 'text-blue-900' : 'text-gray-900'
                      )}>
                        {devUser.name}
                      </p>
                      {isActive && (
                        <span className="ml-2 text-xs text-blue-600">✓</span>
                      )}
                    </div>
                    <p className={cn(
                      'text-xs truncate',
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    )}>
                      {devUser.role}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {devUser.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
          
          {/* Quick return to SuperAdmin when impersonating */}
          {isImpersonating && isOriginalSuperAdmin && (
            <div className="border-t border-yellow-200 pt-2 mt-2 bg-yellow-50">
              <button
              onClick={() => {
                console.log('🔄 Return to SuperAdmin clicked')
                
                // Clear all dev mode state to return to original SuperAdmin
                setCurrentDevUser(null)
                setIsOpen(false)
                localStorage.removeItem('dev-user-role')
                localStorage.removeItem('dev-impersonated-user-id')
                
                // Clear dev role override
                window.dispatchEvent(new CustomEvent('dev-role-changed', { 
                  detail: { devUser: null } 
                }))
                
                // Clear impersonation
                DevUserService.clearImpersonation()
                
                console.log('🔄 Cleared all dev state, navigating to SuperAdmin...')
                
                // Navigate to SuperAdmin dashboard
                window.location.href = '/superadmin'
              }}
                className="w-full px-3 py-2 text-left hover:bg-yellow-100 transition-colors text-yellow-700 text-sm font-medium"
              >
                ⬅️ Return to SuperAdmin
              </button>
            </div>
          )}

          {/* Reset button */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <button
              onClick={() => {
                console.log('🔄 Reset to Original User clicked')
                
                // Clear all dev mode state
                setCurrentDevUser(null)
                setIsOpen(false)
                localStorage.removeItem('dev-user-role')
                localStorage.removeItem('dev-impersonated-user-id')
                
                // Clear dev role override
                window.dispatchEvent(new CustomEvent('dev-role-changed', { 
                  detail: { devUser: null } 
                }))
                
                // Clear impersonation
                DevUserService.clearImpersonation()
                
                console.log('🔄 Cleared all dev state, navigating to SuperAdmin...')
                
                // Navigate to SuperAdmin dashboard instead of reloading
                window.location.href = '/superadmin'
              }}
              className="w-full px-3 py-2 text-left hover:bg-red-50 transition-colors text-red-600 text-sm font-medium"
            >
              🔄 Reset to Original User
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
