import React from 'react'
import { OrganizationLayout } from '@/components/layout/OrganizationLayout'
import { AppCard } from '@/components/ui/AppCard'
import { UserCircleIcon } from '@heroicons/react/24/outline'

const ProfilePage: React.FC = () => {
  return (
    <OrganizationLayout>
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your profile and account settings</p>
      </div>

      <AppCard>
        <div className="p-8 text-center">
          <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">User Profile</h3>
          <p className="mt-1 text-gray-500">
            This page will contain user profile management features.
          </p>
        </div>
      </AppCard>
      </div>
    </OrganizationLayout>
  )
}

export default ProfilePage
