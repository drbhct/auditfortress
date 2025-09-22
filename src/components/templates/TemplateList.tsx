import React, { useState, useMemo } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { TemplateCard } from './TemplateCard'
import { cn } from '@/utils/cn'
import type { TemplateWithCategory, TemplateCategory } from '@/types'

interface TemplateListProps {
  templates: TemplateWithCategory[]
  categories: TemplateCategory[]
  isLoading?: boolean
  onView?: (template: TemplateWithCategory) => void
  onEdit?: (template: TemplateWithCategory) => void
  onDelete?: (template: TemplateWithCategory) => void
  onGeneratePolicy?: (template: TemplateWithCategory) => void
  onCreateNew?: () => void
  className?: string
}

type StatusFilter = 'all' | 'draft' | 'published' | 'archived'

export function TemplateList({
  templates,
  categories,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onGeneratePolicy,
  onCreateNew,
  className,
}: TemplateListProps) {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === 'all' || template.categoryId === selectedCategory

      // Status filter
      const matchesStatus = selectedStatus === 'all' || template.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [templates, searchQuery, selectedCategory, selectedStatus])

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedStatus('all')
  }

  // Get category options for select
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(category => ({
      value: category.id,
      label: category.name,
    })),
  ]

  // Get status options for select
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
          <p className="text-gray-600">
            {filteredTemplates.length} of {templates.length} templates
          </p>
        </div>

        {onCreateNew && (
          <AppButton onClick={onCreateNew} className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            New Template
          </AppButton>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <AppInput
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <AppButton
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
          </AppButton>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <AppButton
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear
              </AppButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <AppSelect
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  options={categoryOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <AppSelect
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as StatusFilter)}
                  options={statusOptions}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating a new template'}
          </p>
          {onCreateNew && (
            <div className="mt-6">
              <AppButton onClick={onCreateNew}>
                <PlusIcon className="h-5 w-5 mr-2" />
                New Template
              </AppButton>
            </div>
          )}
        </div>
      )}

      {/* Templates Grid */}
      {!isLoading && filteredTemplates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onGeneratePolicy={onGeneratePolicy}
            />
          ))}
        </div>
      )}
    </div>
  )
}
