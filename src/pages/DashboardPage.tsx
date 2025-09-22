import React from 'react'
import { AppButton } from '@/components/ui/AppButton'
import { useAuth } from '@/hooks/useAuth'
import { usePermissions } from '@/hooks/usePermissions'

export const DashboardPage: React.FC = () => {
  const { userDisplayName, logout, profile, organization } = useAuth()
  const { isSuperAdmin, isAccountOwner, canManageTemplates } = usePermissions()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to AuditFortress</h1>
              <p className="text-gray-600">Hello, {userDisplayName}!</p>
            </div>
            <AppButton onClick={handleLogout} variant="outline">
              Sign Out
            </AppButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {profile?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {profile?.status}
                  </p>
                  {organization && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Organization:</span> {organization.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Role Info Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Your Roles</h3>
                <div className="mt-4 space-y-2">
                  {isSuperAdmin && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      SuperAdmin
                    </span>
                  )}
                  {isAccountOwner && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Account Owner
                    </span>
                  )}
                  {canManageTemplates && (
                    <p className="text-sm text-green-600">✓ Can manage templates</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                <div className="mt-4 space-y-3">
                  <AppButton size="sm" className="w-full">
                    View Documents
                  </AppButton>
                  {canManageTemplates && (
                    <AppButton size="sm" variant="outline" className="w-full">
                      Manage Templates
                    </AppButton>
                  )}
                  {isSuperAdmin && (
                    <AppButton size="sm" variant="secondary" className="w-full">
                      SuperAdmin Panel
                    </AppButton>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info (remove in production) */}
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(
                {
                  isSuperAdmin,
                  isAccountOwner,
                  canManageTemplates,
                  organizationStatus: organization?.status,
                  organizationType: organization?.type,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
