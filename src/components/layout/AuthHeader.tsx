import {
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppButton } from '@/components/ui/AppButton'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

interface AuthHeaderProps {
  showSearch?: boolean
  showNotifications?: boolean
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
  className?: string
}

interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: string
  read: boolean
  actionUrl?: string
}

// Mock notifications - will be replaced with real data
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Organization Registered',
    message: 'Regional Medical Center has joined the platform',
    type: 'success',
    timestamp: '2 minutes ago',
    read: false,
    actionUrl: '/superadmin/organizations',
  },
  {
    id: '2',
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight at 2:00 AM EST',
    type: 'warning',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Document Approved',
    message: 'HIPAA Risk Assessment has been approved',
    type: 'info',
    timestamp: '3 hours ago',
    read: true,
  },
]

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  showSearch = true,
  showNotifications = true,
  onMenuToggle,
  isMobileMenuOpen = false,
  className,
}) => {
  const { profile, userDisplayName, userInitials, logout, isSuperAdmin } = useAuth()
  const location = useLocation()

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
  }

  const unreadNotifications = mockNotifications.filter(n => !n.read)

  const getNotificationIcon = (type: NotificationItem['type']) => {
    const iconClasses = 'h-4 w-4'
    switch (type) {
      case 'success':
        return <div className={cn(iconClasses, 'bg-green-500 rounded-full')} />
      case 'warning':
        return <div className={cn(iconClasses, 'bg-yellow-500 rounded-full')} />
      case 'error':
        return <div className={cn(iconClasses, 'bg-red-500 rounded-full')} />
      default:
        return <div className={cn(iconClasses, 'bg-blue-500 rounded-full')} />
    }
  }

  return (
    <header className={cn('bg-white shadow-sm border-b border-gray-200', className)}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and search */}
          <div className="flex items-center flex-1">
            {/* Mobile menu button */}
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            )}

            {/* Search */}
            {showSearch && (
              <div className="flex-1 max-w-lg ml-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right side - Notifications, Settings, User menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {showNotifications && (
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 relative"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No notifications
                        </div>
                      ) : (
                        mockNotifications.map(notification => (
                          <div
                            key={notification.id}
                            className={cn(
                              'p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer',
                              !notification.read && 'bg-blue-50',
                            )}
                            onClick={() => {
                              if (notification.actionUrl) {
                                // Navigate to action URL
                                setIsNotificationsOpen(false)
                              }
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.timestamp}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {mockNotifications.length > 0 && (
                      <div className="p-4 border-t border-gray-200">
                        <button className="text-sm text-primary-600 hover:text-primary-500">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </Link>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
                      isSuperAdmin ? 'bg-red-500' : 'bg-primary-500'
                    )}
                  >
                    {isSuperAdmin ? <ShieldCheckIcon className="h-5 w-5" /> : userInitials}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 flex items-center">
                      {userDisplayName}
                      {isSuperAdmin && <ShieldCheckIcon className="h-4 w-4 text-red-500 ml-1" />}
                    </p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                  </div>
                </div>
              </button>

              {/* User menu dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{userDisplayName}</p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                    {isSuperAdmin && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                        SuperAdmin
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Your Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3" />
                      Settings
                    </Link>

                    {isSuperAdmin && (
                      <Link
                        to="/superadmin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShieldCheckIcon className="h-4 w-4 mr-3" />
                        SuperAdmin Portal
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
