import React, { memo, useMemo, useCallback, useState } from 'react'
import { DocumentCard } from '@/components/documents/DocumentCard'
import { usePerformance } from '@/hooks/usePerformance'
import { debounce, createMemoizedSelector } from '@/utils/performance'
import type { Document } from '@/types'

interface OptimizedDocumentListProps {
  documents: Document[]
  onDocumentClick: (document: Document) => void
  onDocumentEdit: (document: Document) => void
  onDocumentDelete: (document: Document) => void
  searchQuery?: string
  statusFilter?: string
  priorityFilter?: string
  className?: string
}

// Memoized document card component
const MemoizedDocumentCard = memo(DocumentCard, (prevProps, nextProps) => {
  return (
    prevProps.document.id === nextProps.document.id &&
    prevProps.document.updatedAt === nextProps.document.updatedAt &&
    prevProps.document.status === nextProps.document.status
  )
})

// Memoized selector for filtered documents
const selectFilteredDocuments = createMemoizedSelector(
  (state: {
    documents: Document[]
    searchQuery: string
    statusFilter: string
    priorityFilter: string
  }) => {
    const { documents, searchQuery, statusFilter, priorityFilter } = state

    return documents.filter(doc => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          doc.title.toLowerCase().includes(query) ||
          doc.content.toLowerCase().includes(query) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query))

        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter && doc.status !== statusFilter) {
        return false
      }

      // Priority filter
      if (priorityFilter && doc.priority !== priorityFilter) {
        return false
      }

      return true
    })
  },
  (a, b) => a.length === b.length && a.every((doc, index) => doc.id === b[index].id)
)

export const OptimizedDocumentList: React.FC<OptimizedDocumentListProps> = memo(
  ({
    documents,
    onDocumentClick,
    onDocumentEdit,
    onDocumentDelete,
    searchQuery = '',
    statusFilter = '',
    priorityFilter = '',
    className = '',
  }) => {
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

    // Performance monitoring
    usePerformance('OptimizedDocumentList', {
      enableLogging: process.env.NODE_ENV === 'development',
      logThreshold: 16,
    })

    // Debounced search
    const debouncedSearch = useMemo(
      () =>
        debounce((query: string) => {
          setLocalSearchQuery(query)
        }, 300),
      []
    )

    // Memoized filtered documents
    const filteredDocuments = useMemo(() => {
      return selectFilteredDocuments({
        documents,
        searchQuery: localSearchQuery,
        statusFilter,
        priorityFilter,
      })
    }, [documents, localSearchQuery, statusFilter, priorityFilter])

    // Memoized callbacks
    const handleDocumentClick = useCallback(
      (document: Document) => {
        onDocumentClick(document)
      },
      [onDocumentClick]
    )

    const handleDocumentEdit = useCallback(
      (document: Document) => {
        onDocumentEdit(document)
      },
      [onDocumentEdit]
    )

    const handleDocumentDelete = useCallback(
      (document: Document) => {
        onDocumentDelete(document)
      },
      [onDocumentDelete]
    )

    // Memoized document cards
    const documentCards = useMemo(() => {
      return filteredDocuments.map(document => (
        <MemoizedDocumentCard
          key={document.id}
          document={document}
          onClick={handleDocumentClick}
          onEdit={handleDocumentEdit}
          onDelete={handleDocumentDelete}
        />
      ))
    }, [filteredDocuments, handleDocumentClick, handleDocumentEdit, handleDocumentDelete])

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Documents ({filteredDocuments.length})
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search documents..."
              defaultValue={searchQuery}
              onChange={e => debouncedSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{documentCards}</div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No documents found matching your criteria.
          </div>
        )}
      </div>
    )
  }
)

OptimizedDocumentList.displayName = 'OptimizedDocumentList'
