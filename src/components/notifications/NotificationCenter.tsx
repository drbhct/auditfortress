import React, { useState, useEffect } from 'react'
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppModal } from '@/components/ui/AppModal'
import { cn } from '@/utils/cn'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
}

interface NotificationCenterProps {
  className?: string
}

// Mock notifications - replace with real-time data from Supabase
const generateMockNotifications = (): Notification[] => [
  {
    id: '1',
    type: 'critical' as any,
    title: 'System Alert',
    message: 'High CPU usage detected on server cluster. Immediate attention required.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    priority: 'critical',
    category: 'System',
    actionUrl: '/system/health',
    actionLabel: 'View Details',
  },
  {
    id: '2',
    type: 'success',
    title: 'New Organization Registered',
    message: 'Healthcare Solutions Inc. has successfully completed registration.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    priority: 'medium',
    category: 'Organizations',
    actionUrl: '/organizations/view/123',
    actionLabel: 'View Organization',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Storage Limit Warning',
    message: 'Organization "TechCorp" is approaching their storage limit (85% used).',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    priority: 'high',
    category: 'Storage',
    actionUrl: '/organizations/storage/456',
    actionLabel: 'Manage Storage',
  },
  {
    id: '4',
    type: 'info',
    title: 'Scheduled Maintenance',
    message: 'System maintenance scheduled for tonight at 2:00 AM EST (4 hours).',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    read: true,
    priority: 'medium',
    category: 'Maintenance',
  },
  {
    id: '5',
    type: 'error',
    title: 'API Rate Limit Exceeded',
    message: 'Organization "DataFlow Ltd" has exceeded their API rate limit.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: true,
    priority: 'high',
    category: 'API',
    actionUrl: '/organizations/api/789',
    actionLabel: 'Adjust Limits',
  },
  {
    id: '6',
    type: 'success',
    title: 'Backup Completed',
    message: 'Daily database backup completed successfully.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    priority: 'low',
    category: 'Backup',
  },
  {
    id: '7',
    type: 'warning',
    title: 'Failed Login Attempts',
    message: 'Multiple failed login attempts detected for admin@techcorp.com.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true,
    priority: 'high',
    category: 'Security',
    actionUrl: '/security/logs',
    actionLabel: 'View Logs',
  },
]

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    case 'warning':
      return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
    case 'error':
      return <XCircleIcon className="w-5 h-5 text-red-500" />
    case 'system':
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
    default:
      return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
  }
}

const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'critical':
      return 'border-l-red-600 bg-red-50'
    case 'high':
      return 'border-l-amber-500 bg-amber-50'
    case 'medium':
      return 'border-l-blue-500 bg-blue-50'
    default:
      return 'border-l-gray-400 bg-gray-50'
  }
}

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(generateMockNotifications())
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all')
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['success', 'warning', 'error', 'info'][Math.floor(Math.random() * 4)] as any,
          title: 'New System Event',
          message: 'A new event has occurred in the system.',
          timestamp: new Date(),
          read: false,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          category: 'System',
        }
        
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read
      case 'critical':
        return notification.priority === 'critical'
      default:
        return true
    }
  })

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setSelectedNotification(notification)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {criticalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-2 h-2 animate-pulse" />
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'critical', label: 'Critical', count: criticalCount },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                    filter === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-3 border-b border-gray-200">
              <AppButton
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="w-full"
              >
                Mark All as Read
              </AppButton>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4',
                      !notification.read ? 'bg-blue-50' : 'bg-white',
                      getPriorityColor(notification.priority)
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={cn(
                              'text-sm font-medium',
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            )}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                                {notification.category}
                              </span>
                              {notification.priority === 'critical' && (
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                                  Critical
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => {
                setIsOpen(false)
                // Navigate to full notifications page
              }}
              className="w-full"
            >
              View All Notifications
            </AppButton>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      <AppModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        title={selectedNotification?.title || ''}
        size="md"
      >
        {selectedNotification && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getNotificationIcon(selectedNotification.type)}
              <div>
                <p className="font-medium text-gray-900">{selectedNotification.category}</p>
                <p className="text-sm text-gray-600">
                  {formatTimeAgo(selectedNotification.timestamp)}
                </p>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p>{selectedNotification.message}</p>
            </div>
            
            {selectedNotification.metadata && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Details</h4>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(selectedNotification.metadata, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              {selectedNotification.actionUrl && selectedNotification.actionLabel && (
                <AppButton
                  variant="primary"
                  onClick={() => {
                    // Navigate to action URL
                    setSelectedNotification(null)
                  }}
                >
                  {selectedNotification.actionLabel}
                </AppButton>
              )}
              <AppButton
                variant="outline"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </AppButton>
            </div>
          </div>
        )}
      </AppModal>
    </div>
  )
}
