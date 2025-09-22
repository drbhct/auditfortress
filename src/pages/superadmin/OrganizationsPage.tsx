import {
  MagnifyingGlassIcon,
  PlusIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { OrganizationDetail } from '@/components/superadmin/OrganizationDetail'
import { cn } from '@/utils/cn'

// Mock data - will be replaced with real Supabase data
const mockOrganizations = [
  {
    id: '1',
    name: 'General Hospital',
    type: 'Healthcare Facility',
    status: 'active',
    userCount: 45,
    documentCount: 1234,
    createdAt: '2024-01-15',
    lastActivity: '2024-03-10',
    subscription: 'Pro',
  },
  {
    id: '2',
    name: 'MedTech Solutions',
    type: 'EMR Software',
    status: 'active',
    userCount: 12,
    documentCount: 567,
    createdAt: '2024-02-20',
    lastActivity: '2024-03-09',
    subscription: 'Enterprise',
  },
  {
    id: '3',
    name: 'Healthcare Analytics Inc',
    type: 'Third-party Service',
    status: 'trial',
    userCount: 8,
    documentCount: 89,
    createdAt: '2024-03-01',
    lastActivity: '2024-03-08',
    subscription: 'Trial',
  },
  {
    id: '4',
    name: 'Regional Medical Center',
    type: 'Healthcare Facility',
    status: 'inactive',
    userCount: 23,
    documentCount: 890,
    createdAt: '2023-11-10',
    lastActivity: '2024-02-15',
    subscription: 'Basic',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  trial: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-red-100 text-red-800',
  suspended: 'bg-gray-100 text-gray-800',
}

const subscriptionColors = {
  Trial: 'bg-blue-100 text-blue-800',
  Basic: 'bg-gray-100 text-gray-800',
  Pro: 'bg-purple-100 text-purple-800',
  Enterprise: 'bg-emerald-100 text-emerald-800',
}

export const OrganizationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null)
  const [isViewingDetail, setIsViewingDetail] = useState(false)

  const filteredOrganizations = mockOrganizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter
    const matchesType = typeFilter === 'all' || org.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewOrganization = (organizationId: string) => {
    setSelectedOrganizationId(organizationId)
    setIsViewingDetail(true)
  }

  const handleCloseDetail = () => {
    setIsViewingDetail(false)
    setSelectedOrganizationId(null)
  }

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Organizations</h1>
              <p className="text-gray-600">Manage all organizations on the platform</p>
            </div>
            <AppButton variant="primary" size="md" icon={<PlusIcon className="h-4 w-4" />}>
              Add Organization
            </AppButton>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Healthcare Facility">Healthcare Facility</option>
              <option value="EMR Software">EMR Software</option>
              <option value="Third-party Service">Third-party Service</option>
            </select>

            <AppButton variant="secondary" size="md" icon={<FunnelIcon className="h-4 w-4" />}>
              Filters
            </AppButton>
          </div>
        </div>

        {/* Organizations Table */}
        <AppCard padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizations.map(org => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <BuildingOfficeIcon className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{org.name}</div>
                          <div className="text-sm text-gray-500">Created {org.createdAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{org.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          statusColors[org.status as keyof typeof statusColors]
                        )}
                      >
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {org.userCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {org.documentCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          subscriptionColors[org.subscription as keyof typeof subscriptionColors]
                        )}
                      >
                        {org.subscription}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {org.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <AppButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrganization(org.id)}
                          className="flex items-center gap-1"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View
                        </AppButton>
                        <button className="text-gray-400 hover:text-gray-600">
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredOrganizations.length}</span> of{' '}
              <span className="font-medium">{mockOrganizations.length}</span> results
            </div>
            <div className="flex space-x-2">
              <AppButton variant="secondary" size="sm" disabled>
                Previous
              </AppButton>
              <AppButton variant="secondary" size="sm" disabled>
                Next
              </AppButton>
            </div>
          </div>
        </AppCard>

        {/* Organization Detail Modal */}
        {isViewingDetail && selectedOrganizationId && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleCloseDetail}
              />

              {/* Modal */}
              <div className="relative w-full max-w-7xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <OrganizationDetail
                  organizationId={selectedOrganizationId}
                  onClose={handleCloseDetail}
                  onEdit={() => console.log('Edit organization')}
                  onDelete={() => console.log('Delete organization')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}
