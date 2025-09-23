import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAllUsers } from '@/hooks/useSuperAdmin'
import { cn } from '@/utils/cn'

// Filter options
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'locked', label: 'Locked' },
]

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'locked':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const GlobalUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [organizationFilter, setOrganizationFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Build filters object
  const filters = {
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    organization: organizationFilter || undefined,
  }

  // Fetch users with real data
  const { data: usersData, isLoading, error } = useAllUsers(currentPage, 12, filters)
  const users = usersData?.data || []
  const totalPages = usersData?.totalPages || 1

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setOrganizationFilter('')
    setCurrentPage(1)
  }

  // Show error state
  if (error) {
    return (
      <SuperAdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">Error loading users</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Global Users</h1>
            <p className="text-gray-600">Manage users across all organizations</p>
          </div>
          <AppButton
            leftIcon={<PlusIcon className="h-5 w-5" />}
          >
            Invite User
          </AppButton>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <AppInput
                placeholder="Search users..."
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
            <AppButton
              variant="outline"
              onClick={clearFilters}
              leftIcon={<FunnelIcon className="h-4 w-4" />}
            >
              Clear
            </AppButton>
          </div>
        </div>

        {/* Users Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters' 
                : 'No users are currently registered in the system.'}
            </p>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-blue-50 hover:shadow-sm transition-all duration-200 cursor-pointer transform hover:scale-[1.01]"
                      onClick={() => window.location.href = `/superadmin/users/${user.id}`}
                    >
                      {/* User Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {user.is_superadmin ? (
                              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                            ) : (
                              <UserIcon className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Organization Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.organizations ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.organizations.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.organizations.organization_type}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No organization</span>
                        )}
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          user.is_superadmin 
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        )}>
                          {user.is_superadmin ? 'SuperAdmin' : 'Team Member'}
                        </span>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(user.status || 'active')
                        )}>
                          {user.status || 'Active'}
                        </span>
                      </td>

                      {/* Activity Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          <div>
                            Created: {new Date(user.created_at || '').toLocaleDateString()}
                          </div>
                          {user.last_login_at && (
                            <div>
                              Last login: {new Date(user.last_login_at).toLocaleDateString()}
                            </div>
                          )}
                          {user.login_count !== null && (
                            <div>
                              Logins: {user.login_count || 0}
                            </div>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
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

export default GlobalUsersPage