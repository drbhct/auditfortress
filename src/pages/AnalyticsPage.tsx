import React from 'react'
import { OrganizationLayout } from '@/components/layout/OrganizationLayout'
import { AppCard } from '@/components/ui/AppCard'
import { ChartBarIcon } from '@heroicons/react/24/outline'

const AnalyticsPage: React.FC = () => {
  return (
    <OrganizationLayout>
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">View detailed analytics and reports</p>
      </div>

      <AppCard>
        <div className="p-8 text-center">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Analytics Dashboard</h3>
          <p className="mt-1 text-gray-500">
            This page will contain detailed analytics and reporting features.
          </p>
        </div>
      </AppCard>
      </div>
    </OrganizationLayout>
  )
}

export default AnalyticsPage
