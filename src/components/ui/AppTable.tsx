import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import React, { useState, useMemo } from 'react'
import { AppButton } from './AppButton'
import { cn } from '@/utils/cn'

export interface TableColumn<T = any> {
  key: string
  header: string
  accessor?: keyof T | ((row: T) => any)
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => React.ReactNode
}

export interface TableProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  emptyMessage?: string
  className?: string

  // Selection
  selectable?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  getRowId?: (row: T) => string

  // Sorting
  sortable?: boolean
  defaultSort?: { key: string; direction: 'asc' | 'desc' }
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void

  // Pagination
  pagination?: boolean
  pageSize?: number
  currentPage?: number
  totalItems?: number
  onPageChange?: (page: number) => void

  // Row actions
  onRowClick?: (row: T, index: number) => void
  rowClassName?: (row: T, index: number) => string
}

export function AppTable<T = any>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  className,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (row: any) => row.id,
  sortable = true,
  defaultSort,
  onSortChange,
  pagination = false,
  pageSize = 10,
  currentPage = 1,
  totalItems,
  onPageChange,
  onRowClick,
  rowClassName,
}: TableProps<T>) {
  const [internalSort, setInternalSort] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(defaultSort || null)

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return

    const newDirection =
      internalSort?.key === columnKey && internalSort.direction === 'asc' ? 'desc' : 'asc'

    const newSort = { key: columnKey, direction: newDirection }
    setInternalSort(newSort)
    onSortChange?.(columnKey, newDirection)
  }

  // Sort data if no external sorting
  const sortedData = useMemo(() => {
    if (!internalSort || onSortChange) return data

    const { key, direction } = internalSort
    const column = columns.find(col => col.key === key)
    if (!column) return data

    return [...data].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (column.accessor) {
        if (typeof column.accessor === 'function') {
          aValue = column.accessor(a)
          bValue = column.accessor(b)
        } else {
          aValue = a[column.accessor]
          bValue = b[column.accessor]
        }
      } else {
        aValue = a[key as keyof T]
        bValue = b[key as keyof T]
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return direction === 'asc' ? -1 : 1
      if (bValue == null) return direction === 'asc' ? 1 : -1

      // Convert to strings for comparison if needed
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Numeric comparison
      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, internalSort, columns, onSortChange])

  // Paginate data if no external pagination
  const paginatedData = useMemo(() => {
    if (!pagination || onPageChange) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, pagination, currentPage, pageSize, onPageChange])

  // Selection handlers
  const isAllSelected = selectable && selectedRows.length === data.length && data.length > 0
  const isIndeterminate = selectable && selectedRows.length > 0 && selectedRows.length < data.length

  const handleSelectAll = () => {
    if (!onSelectionChange) return

    if (isAllSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(data.map(getRowId))
    }
  }

  const handleSelectRow = (rowId: string) => {
    if (!onSelectionChange) return

    if (selectedRows.includes(rowId)) {
      onSelectionChange(selectedRows.filter(id => id !== rowId))
    } else {
      onSelectionChange([...selectedRows, rowId])
    }
  }

  // Get cell value
  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (column.accessor) {
      if (typeof column.accessor === 'function') {
        return column.accessor(row)
      }
      return row[column.accessor]
    }
    return row[column.key as keyof T]
  }

  // Pagination calculations
  const totalPages = Math.ceil((totalItems || sortedData.length) / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems || sortedData.length)

  return (
    <div className={cn('overflow-hidden', className)}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Selection column */}
              {selectable && (
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isIndeterminate
                    }}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}

              {/* Column headers */}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable !== false && sortable && 'cursor-pointer hover:bg-gray-100'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.header}</span>
                    {column.sortable !== false && sortable && (
                      <div className="flex flex-col">
                        <ChevronUpIcon
                          className={cn(
                            'h-3 w-3',
                            internalSort?.key === column.key && internalSort.direction === 'asc'
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          )}
                        />
                        <ChevronDownIcon
                          className={cn(
                            'h-3 w-3 -mt-1',
                            internalSort?.key === column.key && internalSort.direction === 'desc'
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowId = getRowId(row)
                const isSelected = selectedRows.includes(rowId)

                return (
                  <tr
                    key={rowId}
                    className={cn(
                      'hover:bg-gray-50',
                      isSelected && 'bg-primary-50',
                      onRowClick && 'cursor-pointer',
                      rowClassName?.(row, index)
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {/* Selection cell */}
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            e.stopPropagation()
                            handleSelectRow(rowId)
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map(column => {
                      const value = getCellValue(row, column)
                      const renderedValue = column.render ? column.render(value, row, index) : value

                      return (
                        <td
                          key={column.key}
                          className={cn(
                            'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {renderedValue}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && !loading && paginatedData.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems || sortedData.length}</span> results
          </div>

          <div className="flex items-center space-x-2">
            <AppButton
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              icon={<ChevronLeftIcon className="h-4 w-4" />}
            >
              Previous
            </AppButton>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange?.(pageNum)}
                    className={cn(
                      'px-3 py-1 text-sm rounded',
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <AppButton
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              icon={<ChevronRightIcon className="h-4 w-4" />}
            >
              Next
            </AppButton>
          </div>
        </div>
      )}
    </div>
  )
}
