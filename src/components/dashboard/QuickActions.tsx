import React from 'react'
import { AppCard } from '@/components/ui/AppCard'
import { AppButton } from '@/components/ui/AppButton'
import {
  DocumentTextIcon,
  PlusIcon,
  TemplateIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  DocumentArrowUpIcon,
  ShareIcon,
  BellIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo'
  onClick: () => void
  disabled?: boolean
  badge?: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  description?: string
  columns?: 2 | 3 | 4
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  green: 'bg-green-50 text-green-600 hover:bg-green-100',
  purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
  red: 'bg-red-50 text-red-600 hover:bg-red-100',
  indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
}

const gridClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title = 'Quick Actions',
  description = 'Common tasks and shortcuts',
  columns = 3,
}) => {
  return (
    <AppCard>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>

        <div className={`grid ${gridClasses[columns]} gap-4`}>
          {actions.map(action => (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`relative group p-4 rounded-lg border border-gray-200 text-left transition-all duration-200 ${
                action.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-gray-300 hover:shadow-md'
              } ${colorClasses[action.color]}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{action.title}</p>
                    {action.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppCard>
  )
}

// Predefined quick action sets for different user roles
export const getDefaultQuickActions = (userRole: string): QuickAction[] => {
  const baseActions: QuickAction[] = [
    {
      id: 'create-document',
      title: 'Create Document',
      description: 'Start a new document from template',
      icon: DocumentTextIcon,
      color: 'blue',
      onClick: () => console.log('Create document clicked'),
    },
    {
      id: 'view-documents',
      title: 'View Documents',
      description: 'Browse all documents',
      icon: DocumentTextIcon,
      color: 'green',
      onClick: () => console.log('View documents clicked'),
    },
    {
      id: 'upload-document',
      title: 'Upload Document',
      description: 'Import existing document',
      icon: DocumentArrowUpIcon,
      color: 'purple',
      onClick: () => console.log('Upload document clicked'),
    },
  ]

  if (userRole === 'superadmin') {
    return [
      ...baseActions,
      {
        id: 'manage-templates',
        title: 'Manage Templates',
        description: 'Create and edit templates',
        icon: TemplateIcon,
        color: 'indigo',
        onClick: () => console.log('Manage templates clicked'),
      },
      {
        id: 'manage-users',
        title: 'Manage Users',
        description: 'User administration',
        icon: UsersIcon,
        color: 'yellow',
        onClick: () => console.log('Manage users clicked'),
      },
      {
        id: 'view-analytics',
        title: 'View Analytics',
        description: 'System analytics and reports',
        icon: ChartBarIcon,
        color: 'purple',
        onClick: () => console.log('View analytics clicked'),
      },
      {
        id: 'system-settings',
        title: 'System Settings',
        description: 'Configure system settings',
        icon: CogIcon,
        color: 'red',
        onClick: () => console.log('System settings clicked'),
      },
    ]
  }

  if (userRole === 'account_owner') {
    return [
      ...baseActions,
      {
        id: 'team-management',
        title: 'Team Management',
        description: 'Manage team members',
        icon: UsersIcon,
        color: 'indigo',
        onClick: () => console.log('Team management clicked'),
      },
      {
        id: 'compliance-dashboard',
        title: 'Compliance Dashboard',
        description: 'View compliance status',
        icon: ChartBarIcon,
        color: 'green',
        onClick: () => console.log('Compliance dashboard clicked'),
      },
      {
        id: 'organization-settings',
        title: 'Organization Settings',
        description: 'Configure organization',
        icon: CogIcon,
        color: 'yellow',
        onClick: () => console.log('Organization settings clicked'),
      },
    ]
  }

  return [
    ...baseActions,
    {
      id: 'share-document',
      title: 'Share Document',
      description: 'Share with team members',
      icon: ShareIcon,
      color: 'purple',
      onClick: () => console.log('Share document clicked'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View notifications',
      icon: BellIcon,
      color: 'yellow',
      onClick: () => console.log('Notifications clicked'),
    },
    {
      id: 'help-support',
      title: 'Help & Support',
      description: 'Get help and support',
      icon: QuestionMarkCircleIcon,
      color: 'indigo',
      onClick: () => console.log('Help & support clicked'),
    },
  ]
}

// Quick action for creating new documents with template selection
export const CreateDocumentQuickAction: React.FC<{
  onTemplateSelect: (templateId: string) => void
  onBlankDocument: () => void
  onImportDocument: () => void
}> = ({ onTemplateSelect, onBlankDocument, onImportDocument }) => {
  const actions: QuickAction[] = [
    {
      id: 'blank-document',
      title: 'Blank Document',
      description: 'Start with a blank document',
      icon: DocumentTextIcon,
      color: 'blue',
      onClick: onBlankDocument,
    },
    {
      id: 'from-template',
      title: 'From Template',
      description: 'Choose from available templates',
      icon: TemplateIcon,
      color: 'green',
      onClick: () => console.log('Template selection modal'),
    },
    {
      id: 'import-document',
      title: 'Import Document',
      description: 'Upload existing document',
      icon: DocumentArrowUpIcon,
      color: 'purple',
      onClick: onImportDocument,
    },
  ]

  return <QuickActions actions={actions} title="Create New Document" />
}
