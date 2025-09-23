import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
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

// Utility functions
const getStatusBadgeColor = (status: DocumentStatus) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'in_review':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending_approval':
      return 'bg-orange-100 text-orange-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'published':
      return 'bg-blue-100 text-blue-800'
    case 'archived':
      return 'bg-gray-100 text-gray-600'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

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
  const [showFilters, setShowFilters] = useState(false)
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null)

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionMenuId) {
        setOpenActionMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openActionMenuId])

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
        </div>

        {/* Loading Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
              </div>
            </div>
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

        {onCreateNew && (
          <AppButton onClick={onCreateNew} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            New Document
          </AppButton>
        )}
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

      {/* Documents Table */}
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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Updated</div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredAndSortedDocuments.map((document) => (
              <div
                key={document.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => onView?.(document)}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Title */}
                  <div className="col-span-6">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {document.title}
                        </h3>
                        {document.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {document.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        getStatusBadgeColor(document.status)
                      )}
                    >
                      {document.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Updated */}
                  <div className="col-span-3">
                    <span className="text-sm text-gray-500">
                      {formatDate(document.updatedAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenActionMenuId(
                            openActionMenuId === document.id ? null : document.id
                          )
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>

                      {/* Action Menu */}
                      {openActionMenuId === document.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div className="py-1">
                            {onView && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onView(document)
                                  setOpenActionMenuId(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <EyeIcon className="h-4 w-4 mr-3" />
                                View
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEdit(document)
                                  setOpenActionMenuId(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <PencilIcon className="h-4 w-4 mr-3" />
                                Edit
                              </button>
                            )}
                            {onShare && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onShare(document)
                                  setOpenActionMenuId(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <ShareIcon className="h-4 w-4 mr-3" />
                                Share
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDelete(document)
                                  setOpenActionMenuId(null)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4 mr-3" />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
