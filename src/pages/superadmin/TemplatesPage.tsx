import {
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { cn } from '@/utils/cn'

// Mock data - will be replaced with real Supabase data
const mockTemplates = [
  {
    id: '1',
    name: 'HIPAA Risk Assessment',
    category: 'Healthcare',
    type: 'Risk Assessment',
    description: 'Comprehensive HIPAA compliance risk assessment template',
    version: '2.1',
    status: 'published',
    usageCount: 1247,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-01',
    createdBy: 'AuditFortress Team',
  },
  {
    id: '2',
    name: 'SOC 2 Type II Audit',
    category: 'Security',
    type: 'Audit Template',
    description: 'SOC 2 Type II compliance audit checklist and procedures',
    version: '1.8',
    status: 'published',
    usageCount: 892,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-28',
    createdBy: 'Security Team',
  },
  {
    id: '3',
    name: 'EMR System Assessment',
    category: 'Healthcare',
    type: 'System Assessment',
    description: 'Electronic Medical Records system evaluation template',
    version: '1.0',
    status: 'draft',
    usageCount: 0,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-08',
    createdBy: 'Product Team',
  },
  {
    id: '4',
    name: 'Data Privacy Impact Assessment',
    category: 'Privacy',
    type: 'Impact Assessment',
    description: 'GDPR and CCPA compliance privacy impact assessment',
    version: '3.2',
    status: 'published',
    usageCount: 567,
    createdAt: '2023-11-20',
    updatedAt: '2024-01-15',
    createdBy: 'Legal Team',
  },
]

const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800',
  deprecated: 'bg-red-100 text-red-800',
}

const categoryColors = {
  Healthcare: 'bg-blue-100 text-blue-800',
  Security: 'bg-purple-100 text-purple-800',
  Privacy: 'bg-emerald-100 text-emerald-800',
  Compliance: 'bg-orange-100 text-orange-800',
}

export const TemplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Templates</h1>
              <p className="text-gray-600">Manage system templates and audit frameworks</p>
            </div>
            <div className="flex space-x-3">
              <AppButton
                variant="secondary"
                size="md"
                icon={<ArrowDownTrayIcon className="h-4 w-4" />}
              >
                Import
              </AppButton>
              <AppButton variant="primary" size="md" icon={<PlusIcon className="h-4 w-4" />}>
                Create Template
              </AppButton>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="deprecated">Deprecated</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Security">Security</option>
              <option value="Privacy">Privacy</option>
              <option value="Compliance">Compliance</option>
            </select>

            <AppButton variant="secondary" size="md" icon={<FunnelIcon className="h-4 w-4" />}>
              Filters
            </AppButton>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <AppCard key={template.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <DocumentTextIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                </div>
              </div>

              {/* Template Meta */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900">{template.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Version:</span>
                  <span className="text-gray-900">v{template.version}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Usage:</span>
                  <span className="text-gray-900">{template.usageCount.toLocaleString()}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={cn(
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    statusColors[template.status as keyof typeof statusColors]
                  )}
                >
                  {template.status}
                </span>
                <span
                  className={cn(
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    categoryColors[template.category as keyof typeof categoryColors]
                  )}
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {template.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">Updated {template.updatedAt}</div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </AppCard>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <AppCard className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first template'}
            </p>
            {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
              <AppButton variant="primary" size="md" icon={<PlusIcon className="h-4 w-4" />}>
                Create Template
              </AppButton>
            )}
          </AppCard>
        )}
      </div>
    </SuperAdminLayout>
  )
}
