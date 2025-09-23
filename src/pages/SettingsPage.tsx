import React from 'react'
import { OrganizationLayout } from '@/components/layout/OrganizationLayout'
import { AppCard } from '@/components/ui/AppCard'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'

const SettingsPage: React.FC = () => {
  return (
    <OrganizationLayout>
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your application settings</p>
      </div>

      <AppCard>
        <div className="p-8 text-center">
          <Cog6ToothIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Application Settings</h3>
          <p className="mt-1 text-gray-500">
            This page will contain application settings and configuration options.
          </p>
        </div>
      </AppCard>
      </div>
    </OrganizationLayout>
  )
}

export default SettingsPage
