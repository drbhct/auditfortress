import React, { useState } from 'react'
import {
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppInput } from '@/components/ui/AppInput'
import { cn } from '@/utils/cn'

interface GeneratedPolicy {
  id: string
  templateId: string
  title: string
  content: string
  variables: Record<string, string>
  generatedAt: string
  generatedBy: string
  templateName?: string
  templateCategory?: string
}

interface PolicyListProps {
  policies: GeneratedPolicy[]
  isLoading?: boolean
  onView?: (policy: GeneratedPolicy) => void
  onEdit?: (policy: GeneratedPolicy) => void
  onDelete?: (policy: GeneratedPolicy) => void
  onPrint?: (policy: GeneratedPolicy) => void
  onDownload?: (policy: GeneratedPolicy) => void
  className?: string
}

export function PolicyList({
  policies,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onDownload,
  className,
}: PolicyListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter policies based on search and status
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch =
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.templateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.templateCategory?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (policy: GeneratedPolicy) => {
    // For now, all policies are considered "active"
    return 'bg-green-100 text-green-800'
  }

  const getStatusLabel = (policy: GeneratedPolicy) => {
    return 'Active'
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(3)].map((_, i) => (
          <AppCard key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </AppCard>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <AppInput
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Policies List */}
      {filteredPolicies.length === 0 ? (
        <AppCard className="p-12 text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Generate your first policy from a template'}
          </p>
        </AppCard>
      ) : (
        <div className="space-y-4">
          {filteredPolicies.map(policy => (
            <AppCard key={policy.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{policy.title}</h3>
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        getStatusColor(policy)
                      )}
                    >
                      {getStatusLabel(policy)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <TagIcon className="h-4 w-4" />
                      <span>{policy.templateName || 'Unknown Template'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(policy.generatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{policy.generatedBy}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="line-clamp-2">
                      {policy.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                    </p>
                  </div>

                  {Object.keys(policy.variables).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(policy.variables)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {key}: {value}
                          </span>
                        ))}
                      {Object.keys(policy.variables).length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          +{Object.keys(policy.variables).length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {onView && (
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => onView(policy)}
                      className="flex items-center gap-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View
                    </AppButton>
                  )}

                  {onEdit && (
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(policy)}
                      className="flex items-center gap-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </AppButton>
                  )}

                  {onPrint && (
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => onPrint(policy)}
                      className="flex items-center gap-1"
                    >
                      <PrinterIcon className="h-4 w-4" />
                    </AppButton>
                  )}

                  {onDownload && (
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(policy)}
                      className="flex items-center gap-1"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                    </AppButton>
                  )}

                  {onDelete && (
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(policy)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </AppButton>
                  )}
                </div>
              </div>
            </AppCard>
          ))}
        </div>
      )}
    </div>
  )
}
