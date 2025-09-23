import {
  HomeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserCircleIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'
import { cn } from '@/utils/cn'
import { NotificationCenter } from '@/components/notifications'
import { RoleSwitcher } from '@/components/dev'

interface OrganizationLayoutProps {
  children: React.ReactNode
}

// Navigation items for organization users
const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/documents', label: 'Documents', icon: DocumentTextIcon },
  { path: '/team', label: 'Team', icon: UserGroupIcon, requiresOwnerOrCompliance: true },
  { path: '/compliance', label: 'Compliance', icon: ShieldCheckIcon },
  { path: '/analytics', label: 'Analytics', icon: ChartBarIcon },
  { path: '/profile', label: 'Profile', icon: UserCircleIcon },
  { path: '/settings', label: 'Settings', icon: Cog6ToothIcon, requiresAccountOwner: true },
]

export const OrganizationLayout: React.FC<OrganizationLayoutProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, profile, organization } = useAuth()
  const { isAccountOwner, isComplianceOfficer } = usePermissions()

  // Compute page title based on route
  const getPageTitle = () => {
    const item = navigationItems.find(i => i.path === location.pathname)
    if (item) return item.label

    // Handle specific pages
    if (location.pathname.startsWith('/documents/')) {
      return 'Document Details'
    }

    return 'Dashboard'
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  // Filter navigation items based on permissions
  const visibleNavigationItems = navigationItems.filter(item => {
    if (item.requiresAccountOwner && !isAccountOwner) {
      return false
    }
    if (item.requiresOwnerOrCompliance && !isAccountOwner && !isComplianceOfficer) {
      return false
    }
    return true
  })

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Dark Sidebar - matching SuperAdmin style */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900">
        {/* Organization Logo/Title */}
        <div className="flex items-center h-16 px-6 bg-gray-800">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
            <span className="text-white text-sm font-medium">
              {organization?.name?.charAt(0)?.toUpperCase() || 'O'}
            </span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">{organization?.name || 'Organization'}</h1>
            <p className="text-gray-400 text-xs">
              {organization?.type?.replace('_', ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'Healthcare'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {visibleNavigationItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors',
                  isActive && 'bg-gray-800 text-white border-l-4 border-blue-500'
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full text-left text-gray-400 hover:text-white text-sm flex items-center"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="ml-64">
        {/* Top bar - matching SuperAdmin style */}
        <div className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button onClick={handleGoBack} className="text-gray-400 hover:text-gray-600 mr-4">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">{getPageTitle()}</h2>
          </div>

          {/* Center - Role Switcher */}
          <div className="flex-1 flex justify-center">
            <RoleSwitcher />
          </div>

          <div className="flex items-center space-x-4">
            {/* Environment indicator */}
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              DEVELOPMENT
            </span>

            {/* Notifications */}
            <NotificationCenter />

            {/* Settings */}
            <button className="text-gray-400 hover:text-gray-600">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
