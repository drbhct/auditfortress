import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import { usePerformance } from '@/hooks/usePerformance'

interface VirtualizedListProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (props: { index: number; style: React.CSSProperties; item: T }) => React.ReactNode
  className?: string
  overscanCount?: number
  onScroll?: (scrollOffset: number) => void
}

interface ListItemProps<T> {
  index: number
  style: React.CSSProperties
  data: {
    items: T[]
    renderItem: (props: { index: number; style: React.CSSProperties; item: T }) => React.ReactNode
  }
}

// Memoized list item component
const ListItem = memo(<T,>({ index, style, data }: ListItemProps<T>) => {
  const { items, renderItem } = data
  const item = items[index]

  if (!item) {
    return <div style={style} />
  }

  return (
    <div style={style}>
      {renderItem({ index, style, item })}
    </div>
  )
}) as <T>(props: ListItemProps<T>) => React.ReactElement

export const VirtualizedList = memo(<T,>({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
  overscanCount = 5,
  onScroll,
}: VirtualizedListProps<T>) => {
  const listRef = useRef<List>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  // Performance monitoring
  usePerformance('VirtualizedList', {
    enableLogging: process.env.NODE_ENV === 'development',
    logThreshold: 16,
  })

  // Memoized data for list items
  const itemData = useMemo(() => ({
    items,
    renderItem,
  }), [items, renderItem])

  // Handle scroll events
  const handleScroll = useCallback((scrollOffset: number) => {
    setIsScrolling(true)
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)

    onScroll?.(scrollOffset)
  }, [onScroll])

  // Cleanup scroll timeout
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Scroll to item
  const scrollToItem = useCallback((index: number) => {
    listRef.current?.scrollToItem(index, 'start')
  }, [])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    listRef.current?.scrollTo(0)
  }, [])

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToItem(items.length - 1, 'end')
  }, [items.length])

  return (
    <div className={`relative ${className}`}>
      <List
        ref={listRef}
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={overscanCount}
        onScroll={({ scrollOffset }) => handleScroll(scrollOffset)}
        className={isScrolling ? 'opacity-90' : 'opacity-100'}
      >
        {ListItem}
      </List>
      
      {/* Scroll indicators */}
      {items.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          <button
            onClick={scrollToTop}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Scroll to top"
          >
            ↑
          </button>
          <button
            onClick={scrollToBottom}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Scroll to bottom"
          >
            ↓
          </button>
        </div>
      )}
    </div>
  )
}) as <T>(props: VirtualizedListProps<T>) => React.ReactElement

VirtualizedList.displayName = 'VirtualizedList'

// Hook for virtualized list with search
export const useVirtualizedSearch = <T>(
  items: T[],
  searchQuery: string,
  searchFields: (keyof T)[]
) => {
  const [filteredItems, setFilteredItems] = useState<T[]>(items)
  const [searchIndex, setSearchIndex] = useState<number>(-1)

  // Memoized search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return items
    }

    const query = searchQuery.toLowerCase()
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query)
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(query)
          )
        }
        return false
      })
    })
  }, [items, searchQuery, searchFields])

  // Update filtered items when search results change
  useEffect(() => {
    setFilteredItems(searchResults)
    setSearchIndex(-1)
  }, [searchResults])

  // Navigate to next search result
  const nextResult = useCallback(() => {
    setSearchIndex(prev => {
      const next = prev + 1
      return next >= searchResults.length ? 0 : next
    })
  }, [searchResults.length])

  // Navigate to previous search result
  const prevResult = useCallback(() => {
    setSearchIndex(prev => {
      const prev = prev - 1
      return prev < 0 ? searchResults.length - 1 : prev
    })
  }, [searchResults.length])

  return {
    filteredItems,
    searchResults,
    searchIndex,
    nextResult,
    prevResult,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length,
  }
}

// Virtualized list with search
export const VirtualizedListWithSearch = memo(<T,>({
  items,
  height,
  itemHeight,
  renderItem,
  searchQuery,
  searchFields,
  className = '',
  overscanCount = 5,
  onScroll,
}: VirtualizedListProps<T> & {
  searchQuery: string
  searchFields: (keyof T)[]
}) => {
  const {
    filteredItems,
    searchIndex,
    nextResult,
    prevResult,
    hasResults,
    resultCount,
  } = useVirtualizedSearch(items, searchQuery, searchFields)

  const listRef = useRef<List>(null)

  // Scroll to search result
  useEffect(() => {
    if (searchIndex >= 0 && searchIndex < filteredItems.length) {
      const originalIndex = items.findIndex(item => item === filteredItems[searchIndex])
      if (originalIndex >= 0) {
        listRef.current?.scrollToItem(originalIndex, 'center')
      }
    }
  }, [searchIndex, filteredItems, items])

  return (
    <div className={className}>
      {/* Search controls */}
      {hasResults && (
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="text-sm text-gray-600">
            {resultCount} result{resultCount !== 1 ? 's' : ''} found
            {searchIndex >= 0 && (
              <span className="ml-2">
                ({searchIndex + 1} of {resultCount})
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevResult}
              disabled={!hasResults}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↑ Previous
            </button>
            <button
              onClick={nextResult}
              disabled={!hasResults}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next ↓
            </button>
          </div>
        </div>
      )}
      
      <VirtualizedList
        ref={listRef}
        items={items}
        height={height}
        itemHeight={itemHeight}
        renderItem={renderItem}
        overscanCount={overscanCount}
        onScroll={onScroll}
      />
    </div>
  )
}) as <T>(props: VirtualizedListProps<T> & {
  searchQuery: string
  searchFields: (keyof T)[]
}) => React.ReactElement

VirtualizedListWithSearch.displayName = 'VirtualizedListWithSearch'
