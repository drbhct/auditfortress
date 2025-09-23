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
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { OrganizationDetail } from '@/components/superadmin/OrganizationDetail'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAllOrganizations } from '@/hooks/useSuperAdmin'
import { cn } from '@/utils/cn'

// Filter options
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'cancelled', label: 'Cancelled' },
]

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'healthcare_facility', label: 'Healthcare Facility' },
  { value: 'emr_software', label: 'EMR Software' },
  { value: 'third_party_services', label: 'Third Party Services' },
]

// Helper function to format organization type for display
const formatOrganizationType = (type: string) => {
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'trial':
      return 'bg-blue-100 text-blue-800'
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const OrganizationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null)
  const [isViewingDetail, setIsViewingDetail] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Build filters object
  const filters = {
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  }

  // Fetch organizations with real data
  const { data: organizationsData, isLoading, error } = useAllOrganizations(currentPage, 12, filters)
  const organizations = organizationsData?.data || []
  const totalPages = organizationsData?.totalPages || 1

  const handleViewOrganization = (organizationId: string) => {
    setSelectedOrganizationId(organizationId)
    setIsViewingDetail(true)
  }

  const handleBackToList = () => {
    setIsViewingDetail(false)
    setSelectedOrganizationId(null)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setTypeFilter('')
    setCurrentPage(1)
  }

  // Find selected organization
  const selectedOrganization = selectedOrganizationId 
    ? organizations.find(org => org.id === selectedOrganizationId)
    : null

  // Show detail view
  if (isViewingDetail && selectedOrganization) {
    return (
      <SuperAdminLayout>
        <OrganizationDetail
          organization={selectedOrganization}
          onBack={handleBackToList}
        />
      </SuperAdminLayout>
    )
  }

  // Show error state
  if (error) {
    return (
      <SuperAdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">Error loading organizations</div>
            <div className="text-gray-500 text-sm">{error.message}</div>
          </div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
            <p className="text-gray-600">Manage and monitor all organizations</p>
          </div>
          <AppButton
            leftIcon={<PlusIcon className="h-5 w-5" />}
          >
            Add Organization
          </AppButton>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <AppInput
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <div className="min-w-[160px]">
              <AppSelect
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Status"
              />
            </div>
            <div className="min-w-[160px]">
              <AppSelect
                options={typeOptions}
                value={typeFilter}
                onChange={setTypeFilter}
                placeholder="Type"
              />
            </div>
            <AppButton
              variant="outline"
              onClick={clearFilters}
              leftIcon={<FunnelIcon className="h-4 w-4" />}
            >
              Clear
            </AppButton>
          </div>
        </div>

        {/* Organizations Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters' 
                : 'Get started by adding your first organization.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {organizations.map((org) => (
                <AppCard key={org.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {org.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getStatusColor(org.status || 'active')
                          )}>
                            {org.status || 'Active'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewOrganization(org.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Organization Type */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {formatOrganizationType(org.type)}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          Users
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {org.profiles?.length || 0}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          Documents
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          0 {/* TODO: Add document count when available */}
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="text-xs text-gray-500">
                      <div>Created: {new Date(org.created_at || '').toLocaleDateString()}</div>
                      <div>Updated: {new Date(org.updated_at || '').toLocaleDateString()}</div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <AppButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrganization(org.id)}
                        className="w-full"
                        leftIcon={<EyeIcon className="h-4 w-4" />}
                      >
                        View Details
                      </AppButton>
                    </div>
                  </div>
                </AppCard>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </AppButton>
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </AppButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </SuperAdminLayout>
  )
}

export default OrganizationsPage