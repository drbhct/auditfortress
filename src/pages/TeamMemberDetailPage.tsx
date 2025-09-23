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
import { OrganizationLayout } from '@/components/layout/OrganizationLayout'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { MetricsCard } from '@/components/ui/MetricsCard'
import { usePermissions } from '@/hooks/usePermissions'
import { cn } from '@/utils/cn'

// Mock team member data - in real app this would come from API
const mockMember = {
  id: '1',
  first_name: 'Sarah',
  last_name: 'Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 987-6543',
  job_title: 'Compliance Analyst',
  department: 'Risk Management',
  status: 'active',
  created_at: '2023-03-10T10:00:00Z',
  last_login_at: '2024-01-15T16:20:00Z',
  login_count: 89,
  user_roles: [{ role: { name: 'compliance_officer' } }]
}

// Mock activity data
const mockActivity = [
  { id: 1, action: 'Completed document review', timestamp: '2024-01-15T16:20:00Z', details: 'Data Processing Agreement' },
  { id: 2, action: 'Updated compliance checklist', timestamp: '2024-01-15T10:30:00Z', details: 'Q1 2024 Audit Preparation' },
  { id: 3, action: 'Attended training session', timestamp: '2024-01-14T14:00:00Z', details: 'GDPR Updates Workshop' },
  { id: 4, action: 'Created policy document', timestamp: '2024-01-13T11:45:00Z', details: 'Remote Work Security Policy' },
  { id: 5, action: 'Submitted compliance report', timestamp: '2024-01-12T15:30:00Z', details: 'Monthly Risk Assessment' },
]

const mockMetrics = {
  documentsReviewed: 24,
  tasksCompleted: 18,
  complianceScore: 98,
  lastActivity: '1 hour ago'
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

function getRoleInfo(userRoles: any) {
  const role = userRoles?.[0]?.role?.name || 'member'
  
  switch (role) {
    case 'owner':
      return { name: 'Account Owner', color: 'bg-blue-100 text-blue-800' }
    case 'compliance_officer':
      return { name: 'Compliance Officer', color: 'bg-green-100 text-green-800' }
    case 'admin':
      return { name: 'Admin', color: 'bg-purple-100 text-purple-800' }
    default:
      return { name: 'Team Member', color: 'bg-gray-100 text-gray-800' }
  }
}

const TeamMemberDetailPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'permissions'>('overview')
  const { isAccountOwner } = usePermissions()

  // In real app, fetch member data based on memberId
  const member = mockMember
  const roleInfo = getRoleInfo(member.user_roles)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'permissions', label: 'Permissions' },
  ]

  return (
    <OrganizationLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <AppButton
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={() => navigate('/team')}
            >
              Back to Team
            </AppButton>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {member.first_name} {member.last_name}
              </h1>
              <p className="text-gray-600">{member.email}</p>
            </div>
          </div>
          {isAccountOwner && (
            <div className="flex space-x-3">
              <AppButton variant="outline">
                Reset Password
              </AppButton>
              <AppButton>
                Edit Member
              </AppButton>
              <AppButton variant="danger">
                Remove Member
              </AppButton>
            </div>
          )}
        </div>

        {/* Member Summary Card */}
        <AppCard className="mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {roleInfo.name === 'Account Owner' ? (
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
                    roleInfo.color
                  )}>
                    {roleInfo.name}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium capitalize',
                    getStatusColor(member.status)
                  )}>
                    {member.status}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
                  <p className="text-sm text-gray-900">{member.department || 'Not specified'}</p>
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
                title="Documents Reviewed"
                value={mockMetrics.documentsReviewed}
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
                title="Compliance Score"
                value={`${mockMetrics.complianceScore}%`}
                icon={ShieldCheckIcon}
                iconColor="text-purple-600"
              />
              <MetricsCard
                title="Total Logins"
                value={member.login_count}
                icon={KeyIcon}
                iconColor="text-orange-600"
              />
            </div>

            {/* Member Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AppCard>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Full Name</p>
                        <p className="text-sm text-gray-600">{member.first_name} {member.last_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{member.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Job Title</p>
                        <p className="text-sm text-gray-600">{member.job_title || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Department</p>
                        <p className="text-sm text-gray-600">{member.department || 'Not specified'}</p>
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
                        <p className="text-sm font-medium text-gray-900">Joined Team</p>
                        <p className="text-sm text-gray-600">
                          {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Login</p>
                        <p className="text-sm text-gray-600">
                          {member.last_login_at 
                            ? new Date(member.last_login_at).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Logins</p>
                        <p className="text-sm text-gray-600">{member.login_count}</p>
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Team Member Permissions</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Organization Access</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Dashboard Access</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Document Access</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Compliance Module</span>
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
                        <span className={cn(
                          'text-xs px-2 py-1 rounded',
                          roleInfo.name === 'Account Owner' || roleInfo.name === 'Compliance Officer'
                            ? 'text-green-600 bg-green-100'
                            : 'text-red-600 bg-red-100'
                        )}>
                          {roleInfo.name === 'Account Owner' || roleInfo.name === 'Compliance Officer' 
                            ? 'Enabled' 
                            : 'Disabled'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {(roleInfo.name === 'Account Owner' || roleInfo.name === 'Compliance Officer') && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Administrative</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Team Management</span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Analytics Access</span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Settings Management</span>
                          <span className={cn(
                            'text-xs px-2 py-1 rounded',
                            roleInfo.name === 'Account Owner'
                              ? 'text-green-600 bg-green-100'
                              : 'text-red-600 bg-red-100'
                          )}>
                            {roleInfo.name === 'Account Owner' ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AppCard>
          </div>
        )}
      </div>
    </OrganizationLayout>
  )
}

export default TeamMemberDetailPage
