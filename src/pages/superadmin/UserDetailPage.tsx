import {
  ArrowLeftIcon,
  UserIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { MetricsCard } from '@/components/ui/MetricsCard'
import { cn } from '@/utils/cn'

// Mock user data - in real app this would come from API
const mockUser = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  job_title: 'Compliance Manager',
  is_superadmin: false,
  status: 'active',
  created_at: '2023-01-15T10:00:00Z',
  last_login_at: '2024-01-15T14:30:00Z',
  login_count: 45,
  organizations: {
    name: 'Acme Corporation',
    organization_type: 'Technology'
  }
}

// Mock activity data
const mockActivity = [
  { id: 1, action: 'Logged in', timestamp: '2024-01-15T14:30:00Z', details: 'From Chrome on macOS' },
  { id: 2, action: 'Updated profile', timestamp: '2024-01-14T09:15:00Z', details: 'Changed job title' },
  { id: 3, action: 'Created document', timestamp: '2024-01-13T16:45:00Z', details: 'Privacy Policy v2.1' },
  { id: 4, action: 'Completed training', timestamp: '2024-01-12T11:20:00Z', details: 'Data Protection Module' },
  { id: 5, action: 'Assigned task', timestamp: '2024-01-11T13:10:00Z', details: 'Review compliance checklist' },
]

const mockMetrics = {
  documentsCreated: 12,
  tasksCompleted: 8,
  loginStreak: 15,
  lastActivity: '2 hours ago'
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'permissions'>('overview')

  // In real app, fetch user data based on userId
  const user = mockUser

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'permissions', label: 'Permissions' },
  ]

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <AppButton
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={() => navigate('/superadmin/users')}
            >
              Back to Users
            </AppButton>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <AppButton variant="outline">
              Reset Password
            </AppButton>
            <AppButton>
              Edit User
            </AppButton>
          </div>
        </div>

        {/* User Summary Card */}
        <AppCard className="mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {user.is_superadmin ? (
                  <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
                ) : (
                  <UserIcon className="h-10 w-10 text-blue-600" />
                )}
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium',
                    user.is_superadmin 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  )}>
                    {user.is_superadmin ? 'SuperAdmin' : 'Team Member'}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium capitalize',
                    getStatusColor(user.status)
                  )}>
                    {user.status}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Organization</h3>
                  <p className="text-sm text-gray-900">{user.organizations?.name || 'No organization'}</p>
                  {user.organizations?.organization_type && (
                    <p className="text-xs text-gray-500">{user.organizations.organization_type}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Last Active</h3>
                  <p className="text-sm text-gray-900">{mockMetrics.lastActivity}</p>
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricsCard
                title="Documents Created"
                value={mockMetrics.documentsCreated}
                icon={DocumentTextIcon}
                iconColor="text-blue-600"
              />
              <MetricsCard
                title="Tasks Completed"
                value={mockMetrics.tasksCompleted}
                icon={ChartBarIcon}
                iconColor="text-green-600"
              />
              <MetricsCard
                title="Login Streak"
                value={`${mockMetrics.loginStreak} days`}
                icon={ClockIcon}
                iconColor="text-purple-600"
              />
              <MetricsCard
                title="Total Logins"
                value={user.login_count}
                icon={KeyIcon}
                iconColor="text-orange-600"
              />
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AppCard>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Full Name</p>
                        <p className="text-sm text-gray-600">{user.first_name} {user.last_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Job Title</p>
                        <p className="text-sm text-gray-600">{user.job_title || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AppCard>

              <AppCard>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Account Created</p>
                        <p className="text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Login</p>
                        <p className="text-sm text-gray-600">
                          {user.last_login_at 
                            ? new Date(user.last_login_at).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Logins</p>
                        <p className="text-sm text-gray-600">{user.login_count}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AppCard>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <AppCard>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <ClockIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AppCard>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="space-y-4">
            <AppCard>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Permissions</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">System Access</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Login Access</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Dashboard Access</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Document Permissions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Create Documents</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Edit Documents</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Delete Documents</span>
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Disabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AppCard>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}

export default UserDetailPage
