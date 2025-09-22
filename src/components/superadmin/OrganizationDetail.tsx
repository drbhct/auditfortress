import React, { useState } from 'react'
import {
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  ChartBarIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppInput } from '@/components/ui/AppInput'
import { cn } from '@/utils/cn'

// Mock data types - will be replaced with real Supabase types
interface OrganizationMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'pending'
  lastActive: string
  avatar?: string
}

interface BillingInfo {
  subscription: {
    plan: string
    status: 'active' | 'trial' | 'expired' | 'cancelled'
    currentPeriodStart: string
    currentPeriodEnd: string
    amount: number
    currency: string
  }
  paymentMethod: {
    type: 'card' | 'bank' | 'paypal'
    last4: string
    brand: string
    expiryMonth: number
    expiryYear: number
  }
  usage: {
    documentsGenerated: number
    storageUsed: number
    storageLimit: number
    apiCalls: number
    apiLimit: number
  }
  invoices: Array<{
    id: string
    date: string
    amount: number
    status: 'paid' | 'pending' | 'failed'
    downloadUrl: string
  }>
}

interface ActivityLog {
  id: string
  action: string
  description: string
  user: string
  timestamp: string
  type: 'info' | 'warning' | 'error' | 'success'
}

interface OrganizationDetailProps {
  organizationId: string
  onClose?: () => void
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

// Mock data
const mockOrganization = {
  id: '1',
  name: 'General Hospital',
  type: 'Healthcare Facility',
  status: 'active',
  description:
    'A leading healthcare facility providing comprehensive medical services to the community.',
  website: 'https://generalhospital.com',
  address: {
    street: '123 Medical Center Drive',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    country: 'United States',
  },
  contact: {
    phone: '+1 (555) 123-4567',
    email: 'admin@generalhospital.com',
  },
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-03-10T14:22:00Z',
  settings: {
    timezone: 'America/Chicago',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },
}

const mockMembers: OrganizationMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@generalhospital.com',
    role: 'Account Owner',
    department: 'Administration',
    status: 'active',
    lastActive: '2024-03-10T14:22:00Z',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@generalhospital.com',
    role: 'Compliance Manager',
    department: 'Compliance',
    status: 'active',
    lastActive: '2024-03-10T12:15:00Z',
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@generalhospital.com',
    role: 'Document Manager',
    department: 'IT',
    status: 'active',
    lastActive: '2024-03-09T16:45:00Z',
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john.smith@generalhospital.com',
    role: 'User',
    department: 'HR',
    status: 'pending',
    lastActive: '2024-03-08T09:30:00Z',
  },
]

const mockBilling: BillingInfo = {
  subscription: {
    plan: 'Pro',
    status: 'active',
    currentPeriodStart: '2024-03-01T00:00:00Z',
    currentPeriodEnd: '2024-03-31T23:59:59Z',
    amount: 299.99,
    currency: 'USD',
  },
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
  },
  usage: {
    documentsGenerated: 1234,
    storageUsed: 2.5,
    storageLimit: 100,
    apiCalls: 15420,
    apiLimit: 100000,
  },
  invoices: [
    {
      id: 'inv_001',
      date: '2024-03-01T00:00:00Z',
      amount: 299.99,
      status: 'paid',
      downloadUrl: '#',
    },
    {
      id: 'inv_002',
      date: '2024-02-01T00:00:00Z',
      amount: 299.99,
      status: 'paid',
      downloadUrl: '#',
    },
  ],
}

const mockActivity: ActivityLog[] = [
  {
    id: '1',
    action: 'Document Created',
    description: 'HIPAA Privacy Policy document was created',
    user: 'Dr. Sarah Johnson',
    timestamp: '2024-03-10T14:22:00Z',
    type: 'info',
  },
  {
    id: '2',
    action: 'User Invited',
    description: 'John Smith was invited to join the organization',
    user: 'Dr. Sarah Johnson',
    timestamp: '2024-03-08T09:30:00Z',
    type: 'info',
  },
  {
    id: '3',
    action: 'Template Updated',
    description: 'Data Breach Response template was updated',
    user: 'Michael Chen',
    timestamp: '2024-03-07T16:15:00Z',
    type: 'info',
  },
  {
    id: '4',
    action: 'Payment Failed',
    description: 'Payment method expired, please update billing information',
    user: 'System',
    timestamp: '2024-03-05T10:00:00Z',
    type: 'warning',
  },
]

export const OrganizationDetail: React.FC<OrganizationDetailProps> = ({
  organizationId,
  onClose,
  onEdit,
  onDelete,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'members' | 'billing' | 'activity' | 'settings'
  >('overview')
  const [isEditing, setIsEditing] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800',
      pending: 'bg-blue-100 text-blue-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getActivityIcon = (type: string) => {
    const icons = {
      info: <CheckCircleIcon className="h-4 w-4 text-blue-500" />,
      warning: <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />,
      error: <XCircleIcon className="h-4 w-4 text-red-500" />,
      success: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
    }
    return (
      icons[type as keyof typeof icons] || <CheckCircleIcon className="h-4 w-4 text-gray-500" />
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BuildingOfficeIcon },
    { id: 'members', label: 'Members', icon: UsersIcon },
    { id: 'billing', label: 'Billing', icon: CurrencyDollarIcon },
    { id: 'activity', label: 'Activity', icon: ClockIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mockOrganization.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">{mockOrganization.type}</span>
              <span
                className={cn(
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  getStatusColor(mockOrganization.status)
                )}
              >
                {mockOrganization.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            {isEditing ? 'Cancel Edit' : 'Edit'}
          </AppButton>
          <AppButton
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </AppButton>
          {onClose && (
            <AppButton variant="outline" size="sm" onClick={onClose}>
              Close
            </AppButton>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organization Info */}
            <AppCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  {isEditing ? (
                    <AppInput type="text" defaultValue={mockOrganization.name} className="w-full" />
                  ) : (
                    <p className="text-sm text-gray-900">{mockOrganization.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      defaultValue={mockOrganization.description}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{mockOrganization.description}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  {isEditing ? (
                    <AppInput
                      type="url"
                      defaultValue={mockOrganization.website}
                      className="w-full"
                    />
                  ) : (
                    <a
                      href={mockOrganization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {mockOrganization.website}
                    </a>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  {isEditing ? (
                    <AppInput
                      type="email"
                      defaultValue={mockOrganization.contact.email}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{mockOrganization.contact.email}</p>
                  )}
                </div>
              </div>
            </AppCard>

            {/* Quick Stats */}
            <AppCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockMembers.length}</div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1,234</div>
                  <div className="text-sm text-gray-500">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">45</div>
                  <div className="text-sm text-gray-500">Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">98%</div>
                  <div className="text-sm text-gray-500">Compliance</div>
                </div>
              </div>
            </AppCard>

            {/* Address */}
            <AppCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-900">{mockOrganization.address.street}</p>
                <p className="text-sm text-gray-900">
                  {mockOrganization.address.city}, {mockOrganization.address.state}{' '}
                  {mockOrganization.address.zipCode}
                </p>
                <p className="text-sm text-gray-900">{mockOrganization.address.country}</p>
              </div>
            </AppCard>

            {/* System Info */}
            <AppCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created:</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(mockOrganization.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last Updated:</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(mockOrganization.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Timezone:</span>
                  <span className="text-sm text-gray-900">
                    {mockOrganization.settings.timezone}
                  </span>
                </div>
              </div>
            </AppCard>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Organization Members</h3>
              <AppButton className="flex items-center gap-2">
                <UserPlusIcon className="h-4 w-4" />
                Invite Member
              </AppButton>
            </div>

            <AppCard padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockMembers.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {member.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{member.role}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{member.department}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                              getStatusColor(member.status)
                            )}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(member.lastActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <AppButton variant="outline" size="sm">
                            Edit
                          </AppButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AppCard>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Billing & Subscription</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscription Info */}
              <AppCard className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Plan:</span>
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        'bg-purple-100 text-purple-800'
                      )}
                    >
                      {mockBilling.subscription.plan}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getStatusColor(mockBilling.subscription.status)
                      )}
                    >
                      {mockBilling.subscription.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Amount:</span>
                    <span className="text-sm text-gray-900">
                      {formatCurrency(
                        mockBilling.subscription.amount,
                        mockBilling.subscription.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Billing Period:</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(mockBilling.subscription.currentPeriodStart)} -{' '}
                      {formatDate(mockBilling.subscription.currentPeriodEnd)}
                    </span>
                  </div>
                </div>
              </AppCard>

              {/* Payment Method */}
              <AppCard className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-12 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-800">VISA</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        •••• •••• •••• {mockBilling.paymentMethod.last4}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expires {mockBilling.paymentMethod.expiryMonth}/
                        {mockBilling.paymentMethod.expiryYear}
                      </div>
                    </div>
                  </div>
                  <AppButton variant="outline" size="sm">
                    Update Payment Method
                  </AppButton>
                </div>
              </AppCard>

              {/* Usage Stats */}
              <AppCard className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Documents Generated</span>
                      <span className="text-gray-900">
                        {mockBilling.usage.documentsGenerated.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Storage Used</span>
                      <span className="text-gray-900">
                        {mockBilling.usage.storageUsed} GB / {mockBilling.usage.storageLimit} GB
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: '2.5%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">API Calls</span>
                      <span className="text-gray-900">
                        {mockBilling.usage.apiCalls.toLocaleString()} /{' '}
                        {mockBilling.usage.apiLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: '15%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </AppCard>

              {/* Recent Invoices */}
              <AppCard className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h4>
                <div className="space-y-3">
                  {mockBilling.invoices.map(invoice => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Invoice #{invoice.id}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(invoice.date)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">
                          {formatCurrency(invoice.amount, mockBilling.subscription.currency)}
                        </span>
                        <span
                          className={cn(
                            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {invoice.status}
                        </span>
                        <AppButton variant="outline" size="sm">
                          Download
                        </AppButton>
                      </div>
                    </div>
                  ))}
                </div>
              </AppCard>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>

            <AppCard padding="none">
              <div className="divide-y divide-gray-200">
                {mockActivity.map(activity => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AppCard>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Organization Settings</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AppCard className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="America/Chicago">America/Chicago</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="America/Los_Angeles">America/Los_Angeles</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Format
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </AppCard>

              <AppCard className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Notification Preferences
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Email Notifications</div>
                      <div className="text-xs text-gray-500">Receive notifications via email</div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={mockOrganization.settings.notifications.email}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">SMS Notifications</div>
                      <div className="text-xs text-gray-500">Receive notifications via SMS</div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={mockOrganization.settings.notifications.sms}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Push Notifications</div>
                      <div className="text-xs text-gray-500">Receive push notifications</div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={mockOrganization.settings.notifications.push}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </AppCard>
            </div>

            <div className="flex items-center justify-end gap-3">
              <AppButton variant="outline">Cancel</AppButton>
              <AppButton>Save Changes</AppButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
