import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  TemplateIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

interface SidebarItem {
  id: string
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
  requiresSuperAdmin?: boolean
  requiresAccountOwner?: boolean
  badge?: string
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
    requiresAuth: true,
  },
  {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    icon: DocumentTextIcon,
    requiresAuth: true,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    path: '/compliance',
    icon: ShieldCheckIcon,
    requiresAuth: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: ChartBarIcon,
    requiresAuth: true,
  },
  {
    id: 'superadmin',
    label: 'SuperAdmin',
    path: '/superadmin',
    icon: Cog6ToothIcon,
    requiresSuperAdmin: true,
    children: [
      {
        id: 'superadmin-dashboard',
        label: 'Dashboard',
        path: '/superadmin',
        icon: HomeIcon,
        requiresSuperAdmin: true,
      },
      {
        id: 'superadmin-organizations',
        label: 'Organizations',
        path: '/superadmin/organizations',
        icon: BuildingOfficeIcon,
        requiresSuperAdmin: true,
      },
      {
        id: 'superadmin-users',
        label: 'Global Users',
        path: '/superadmin/users',
        icon: UsersIcon,
        requiresSuperAdmin: true,
      },
      {
        id: 'superadmin-templates',
        label: 'Templates',
        path: '/superadmin/templates',
        icon: TemplateIcon,
        requiresSuperAdmin: true,
      },
    ],
  },
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const location = useLocation()
  const { userDisplayName, logout, profile } = useAuth()
  const { isSuperAdmin, isAccountOwner } = usePermissions()

  const handleLogout = async () => {
    await logout()
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const isActivePath = (path: string) => {
    if (path === '/superadmin') {
      return location.pathname === '/superadmin'
    }
    return location.pathname.startsWith(path)
  }

  const filteredSidebarItems = sidebarItems.filter(item => {
    if (item.requiresSuperAdmin && !isSuperAdmin) return false
    if (item.requiresAccountOwner && !isAccountOwner) return false
    if (item.requiresAuth && !profile) return false
    return true
  })

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold">AuditFortress</span>
            </div>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredSidebarItems.map(item => (
            <div key={item.id}>
              <div className="flex items-center">
                <Link
                  to={item.path}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
                {item.children && !isCollapsed && (
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="ml-2 p-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <ChevronRightIcon
                      className={`h-4 w-4 transition-transform ${
                        expandedItems.includes(item.id) ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Children */}
              {item.children && !isCollapsed && expandedItems.includes(item.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map(child => (
                    <Link
                      key={child.id}
                      to={child.path}
                      className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActivePath(child.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <child.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="ml-3">{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-700">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userDisplayName}</p>
                <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
