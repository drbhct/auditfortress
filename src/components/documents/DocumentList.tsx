import React, { useState, useMemo } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { DocumentCard } from './DocumentCard'
import { cn } from '@/utils/cn'
import type { Document, DocumentStatus, DocumentPriority, ConfidentialityLevel } from '@/types'

interface DocumentListProps {
  documents: Document[]
  isLoading?: boolean
  onView?: (document: Document) => void
  onEdit?: (document: Document) => void
  onDelete?: (document: Document) => void
  onShare?: (document: Document) => void
  onCreateNew?: () => void
  className?: string
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In Review' },
  { value: 'pending_approval', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
  { value: 'rejected', label: 'Rejected' },
]

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

const confidentialityOptions = [
  { value: 'all', label: 'All Confidentiality' },
  { value: 'public', label: 'Public' },
  { value: 'internal', label: 'Internal' },
  { value: 'confidential', label: 'Confidential' },
  { value: 'restricted', label: 'Restricted' },
]

const sortOptions = [
  { value: 'created_desc', label: 'Newest First' },
  { value: 'created_asc', label: 'Oldest First' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'updated_asc', label: 'Least Recently Updated' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
  { value: 'priority_desc', label: 'Priority High-Low' },
  { value: 'priority_asc', label: 'Priority Low-High' },
]

export function DocumentList({
  documents,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onShare,
  onCreateNew,
  className,
}: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [confidentialityFilter, setConfidentialityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated_desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || doc.metadata.priority === priorityFilter
      const matchesConfidentiality =
        confidentialityFilter === 'all' || doc.metadata.confidentiality === confidentialityFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesConfidentiality
    })

    // Sort documents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'created_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'updated_desc':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'updated_asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'title_asc':
          return a.title.localeCompare(b.title)
        case 'title_desc':
          return b.title.localeCompare(a.title)
        case 'priority_desc':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.metadata.priority] - priorityOrder[a.metadata.priority]
        case 'priority_asc':
          const priorityOrderAsc = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrderAsc[a.metadata.priority] - priorityOrderAsc[b.metadata.priority]
        default:
          return 0
      }
    })

    return filtered
  }, [documents, searchTerm, statusFilter, priorityFilter, confidentialityFilter, sortBy])

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPriorityFilter('all')
    setConfidentialityFilter('all')
    setSortBy('updated_desc')
  }

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    confidentialityFilter !== 'all'

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Loading Header */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Loading Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
          <p className="text-gray-600">
            {filteredAndSortedDocuments.length} of {documents.length} documents
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-l-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-r-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {onCreateNew && (
            <AppButton onClick={onCreateNew} className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              New Document
            </AppButton>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <AppInput
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <AppButton
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn('flex items-center gap-2', showFilters && 'bg-blue-50 text-blue-700')}
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {
                    [searchTerm, statusFilter, priorityFilter, confidentialityFilter].filter(
                      f => f && f !== 'all'
                    ).length
                  }
                </span>
              )}
            </AppButton>

            {hasActiveFilters && (
              <AppButton
                variant="outline"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear
              </AppButton>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <AppSelect
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                options={statusOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <AppSelect
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                options={priorityOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confidentiality
              </label>
              <AppSelect
                value={confidentialityFilter}
                onChange={e => setConfidentialityFilter(e.target.value)}
                options={confidentialityOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <AppSelect
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                options={sortOptions}
              />
            </div>
          </div>
        )}
      </div>

      {/* Documents Grid/List */}
      {filteredAndSortedDocuments.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500 mb-6">
            {hasActiveFilters
              ? 'Try adjusting your search terms or filters'
              : 'Get started by creating your first document'}
          </p>
          {onCreateNew && (
            <AppButton onClick={onCreateNew} className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Document
            </AppButton>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'gap-6',
            viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
          )}
        >
          {filteredAndSortedDocuments.map(document => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onShare={onShare}
              className={viewMode === 'list' ? 'flex-row' : ''}
            />
          ))}
        </div>
      )}
    </div>
  )
}
