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
import { cn } from '@/utils/cn'

// Mock data - will be replaced with real Supabase data
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@generalhospital.com',
    organization: 'General Hospital',
    role: 'Account Owner',
    status: 'active',
    lastLogin: '2024-03-10 14:30',
    createdAt: '2024-01-15',
    isSuperAdmin: false,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@medtech.com',
    organization: 'MedTech Solutions',
    role: 'Compliance Officer',
    status: 'active',
    lastLogin: '2024-03-09 09:15',
    createdAt: '2024-02-01',
    isSuperAdmin: false,
  },
  {
    id: '3',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@auditfortress.com',
    organization: 'AuditFortress',
    role: 'SuperAdmin',
    status: 'active',
    lastLogin: '2024-03-10 16:45',
    createdAt: '2023-12-01',
    isSuperAdmin: true,
  },
  {
    id: '4',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.j@healthcare-analytics.com',
    organization: 'Healthcare Analytics Inc',
    role: 'Team Member',
    status: 'pending',
    lastLogin: null,
    createdAt: '2024-03-05',
    isSuperAdmin: false,
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-red-100 text-red-800',
  suspended: 'bg-gray-100 text-gray-800',
}

const roleColors = {
  SuperAdmin: 'bg-red-100 text-red-800',
  'Account Owner': 'bg-purple-100 text-purple-800',
  'Compliance Officer': 'bg-blue-100 text-blue-800',
  'Team Member': 'bg-gray-100 text-gray-800',
}

export const GlobalUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Global Users</h1>
              <p className="text-gray-600">Manage all users across the platform</p>
            </div>
            <AppButton variant="primary" size="md" icon={<PlusIcon className="h-4 w-4" />}>
              Invite User
            </AppButton>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
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
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Account Owner">Account Owner</option>
              <option value="Compliance Officer">Compliance Officer</option>
              <option value="Team Member">Team Member</option>
            </select>

            <AppButton variant="secondary" size="md" icon={<FunnelIcon className="h-4 w-4" />}>
              Filters
            </AppButton>
          </div>
        </div>

        {/* Users Table */}
        <AppCard padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
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
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div
                            className={cn(
                              'h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium',
                              user.isSuperAdmin ? 'bg-red-500' : 'bg-primary-500',
                            )}
                          >
                            {user.isSuperAdmin ? (
                              <ShieldCheckIcon className="h-5 w-5" />
                            ) : (
                              getUserInitials(user.firstName, user.lastName)
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            {user.isSuperAdmin && (
                              <ShieldCheckIcon className="h-4 w-4 text-red-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {user.organization}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          roleColors[user.role as keyof typeof roleColors]
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          statusColors[user.status as keyof typeof statusColors]
                        )}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin || 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
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
              <span className="font-medium">{filteredUsers.length}</span> of{' '}
              <span className="font-medium">{mockUsers.length}</span> results
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
      </div>
    </SuperAdminLayout>
  )
}
