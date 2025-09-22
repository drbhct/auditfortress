import {
  ShieldCheckIcon,
  Squares2X2Icon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChartBarIcon,
  CpuChipIcon,
  ServerIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import { NotificationCenter } from '@/components/notifications'

interface SuperAdminLayoutProps {
  children: React.ReactNode
}

// Navigation items matching the Vue version exactly
const navigationItems = [
  { path: '/superadmin', label: 'Dashboard', icon: Squares2X2Icon },
  { path: '/superadmin/organizations', label: 'Organizations', icon: BuildingOfficeIcon },
  { path: '/superadmin/users', label: 'Global Users', icon: UsersIcon },
  { path: '/superadmin/templates', label: 'Templates', icon: DocumentTextIcon },
  { path: '/documents', label: 'Documents', icon: DocumentTextIcon },
  { path: '/superadmin/billing', label: 'Billing', icon: CreditCardIcon },
  { path: '/superadmin/analytics', label: 'Analytics', icon: ChartBarIcon },
  { path: '/superadmin/ai', label: 'AI Management', icon: CpuChipIcon },
  { path: '/superadmin/system', label: 'System', icon: ServerIcon },
  { path: '/superadmin/support', label: 'Support', icon: QuestionMarkCircleIcon },
  { path: '/superadmin/settings', label: 'Settings', icon: Cog6ToothIcon },
]

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, profile } = useAuth()

  // Compute page title based on route (matching Vue logic)
  const getPageTitle = () => {
    const item = navigationItems.find(i => i.path === location.pathname)
    if (item) return item.label

    // Handle organization detail pages
    if (location.pathname.startsWith('/superadmin/organizations/')) {
      return 'Organization Details'
    }

    return 'SuperAdmin'
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="superadmin-layout min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900">
        {/* Logo/Title */}
        <div className="flex items-center h-16 px-6 bg-gray-800">
          <ShieldCheckIcon className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-white font-bold text-lg">AuditFortress</h1>
            <p className="text-gray-400 text-xs">SuperAdmin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {navigationItems.map(item => {
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
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-white text-sm font-medium">SuperAdmin</p>
              <p className="text-gray-400 text-xs">{profile?.email || 'admin@auditfortress.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full text-left text-gray-400 hover:text-white text-sm flex items-center"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="ml-64">
        {/* Top bar */}
        <div className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button onClick={handleGoBack} className="text-gray-400 hover:text-gray-600 mr-4">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">{getPageTitle()}</h2>
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
