import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { OrganizationLayout } from '@/components/layout/OrganizationLayout'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { usePermissions } from '@/hooks/usePermissions'
import { cn } from '@/utils/cn'

// Mock data for team members - in real app this would come from API
const mockTeamMembers = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@workingtest.org',
    job_title: 'Account Owner',
    department: 'Administration',
    phone: '+1 (555) 123-4567',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
    last_login_at: '2024-01-20T14:22:00Z',
    login_count: 45,
    user_roles: [{ role: { name: 'owner' } }],
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@workingtest.org',
    job_title: 'Compliance Officer',
    department: 'Compliance',
    phone: '+1 (555) 234-5678',
    status: 'active',
    created_at: '2024-01-16T09:15:00Z',
    last_login_at: '2024-01-20T11:45:00Z',
    login_count: 32,
    user_roles: [{ role: { name: 'admin' } }],
  },
  {
    id: '3',
    first_name: 'Mike',
    last_name: 'Davis',
    email: 'mike.davis@workingtest.org',
    job_title: 'Team Member',
    department: 'Operations',
    phone: '+1 (555) 345-6789',
    status: 'active',
    created_at: '2024-01-18T13:20:00Z',
    last_login_at: '2024-01-19T16:30:00Z',
    login_count: 18,
    user_roles: [{ role: { name: 'member' } }],
  },
  {
    id: '4',
    first_name: 'Emily',
    last_name: 'Wilson',
    email: 'emily.wilson@workingtest.org',
    job_title: 'Team Member',
    department: 'Quality Assurance',
    phone: '+1 (555) 456-7890',
    status: 'pending',
    created_at: '2024-01-19T08:45:00Z',
    last_login_at: null,
    login_count: 0,
    user_roles: [{ role: { name: 'member' } }],
  },
]

// Filter options
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'locked', label: 'Locked' },
]

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'owner', label: 'Account Owner' },
  { value: 'admin', label: 'Compliance Officer' },
  { value: 'member', label: 'Team Member' },
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

// Helper function to get role color and display name
const getRoleInfo = (userRoles: any[]) => {
  const role = userRoles?.[0]?.role?.name || 'member'
  switch (role) {
    case 'owner':
      return { name: 'Account Owner', color: 'bg-purple-100 text-purple-800' }
    case 'admin':
      return { name: 'Compliance Officer', color: 'bg-blue-100 text-blue-800' }
    case 'member':
      return { name: 'Team Member', color: 'bg-gray-100 text-gray-800' }
    default:
      return { name: 'Team Member', color: 'bg-gray-100 text-gray-800' }
  }
}

const TeamPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { isAccountOwner, isComplianceOfficer } = usePermissions()

  // Check if user has permission to access this page
  const canAccessTeam = isAccountOwner || isComplianceOfficer

  // Filter team members based on search and filters
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = 
      member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.job_title?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || member.status === statusFilter
    const matchesRole = !roleFilter || member.user_roles?.[0]?.role?.name === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setRoleFilter('')
  }

  if (!canAccessTeam) {
    return (
      <OrganizationLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Access Restricted</h3>
            <p className="mt-1 text-sm text-gray-500">
              Only Account Owners and Compliance Officers can access the team management page.
            </p>
          </div>
        </div>
      </OrganizationLayout>
    )
  }

  return (
    <OrganizationLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600">Manage your organization's team members</p>
          </div>
          {isAccountOwner && (
            <AppButton
              leftIcon={<PlusIcon className="h-5 w-5" />}
            >
              Invite Member
            </AppButton>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <AppInput
                placeholder="Search team members..."
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
                options={roleOptions}
                value={roleFilter}
                onChange={setRoleFilter}
                placeholder="Role"
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

        {/* Team Members Table */}
        {isLoading ? (
          <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
            <div className="divide-y divide-gray-200">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No team members found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || roleFilter
                ? 'Try adjusting your search terms or filters'
                : 'No team members are currently in your organization.'}
            </p>
          </div>
        ) : (
          /* Team Members Table */
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
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
                {filteredMembers.map((member) => {
                  const roleInfo = getRoleInfo(member.user_roles)
                  
                  return (
                    <tr 
                      key={member.id} 
                      className="hover:bg-blue-50 hover:shadow-sm transition-all duration-200 cursor-pointer transform hover:scale-[1.01]"
                      onClick={() => window.location.href = `/team/${member.id}`}
                    >
                      {/* Member Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {roleInfo.name === 'Account Owner' ? (
                              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                            ) : (
                              <UserIcon className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.job_title || 'No title'}
                            </div>
                            {member.department && (
                              <div className="text-xs text-gray-400">
                                {member.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          roleInfo.color
                        )}>
                          {roleInfo.name}
                        </span>
                      </td>

                      {/* Contact Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="text-sm text-gray-500">
                            {member.phone}
                          </div>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          getStatusColor(member.status)
                        )}>
                          {member.status}
                        </span>
                      </td>

                      {/* Activity Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          <div>
                            Joined: {new Date(member.created_at).toLocaleDateString()}
                          </div>
                          {member.last_login_at ? (
                            <div>
                              Last login: {new Date(member.last_login_at).toLocaleDateString()}
                            </div>
                          ) : (
                            <div>Never logged in</div>
                          )}
                          <div>
                            Logins: {member.login_count}
                          </div>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </OrganizationLayout>
  )
}

export default TeamPage
