import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  TemplateIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface SearchResult {
  id: string
  type: 'document' | 'user' | 'organization' | 'template' | 'page'
  title: string
  description: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  metadata?: Record<string, any>
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

// Mock search results - in production, this would come from an API
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'document',
    title: 'HIPAA Privacy Policy',
    description: 'Patient privacy protection compliance document',
    path: '/documents/1',
    icon: DocumentTextIcon,
    metadata: { status: 'published', lastModified: '2024-01-15' },
  },
  {
    id: '2',
    type: 'document',
    title: 'Data Breach Response Plan',
    description: 'Incident response procedures and protocols',
    path: '/documents/2',
    icon: DocumentTextIcon,
    metadata: { status: 'draft', lastModified: '2024-01-10' },
  },
  {
    id: '3',
    type: 'user',
    title: 'Sarah Johnson',
    description: 'Compliance Officer - Healthcare Division',
    path: '/users/3',
    icon: UserIcon,
    metadata: { role: 'admin', status: 'active' },
  },
  {
    id: '4',
    type: 'organization',
    title: 'MedCenter Health',
    description: 'Healthcare facility with 500+ employees',
    path: '/organizations/4',
    icon: BuildingOfficeIcon,
    metadata: { type: 'healthcare_facility', status: 'active' },
  },
  {
    id: '5',
    type: 'template',
    title: 'HIPAA Privacy Policy Template',
    description: 'Template for creating HIPAA privacy policies',
    path: '/templates/5',
    icon: TemplateIcon,
    metadata: { category: 'HIPAA Privacy', status: 'published' },
  },
  {
    id: '6',
    type: 'page',
    title: 'Analytics Dashboard',
    description: 'View system analytics and metrics',
    path: '/analytics',
    icon: DocumentTextIcon,
  },
]

const typeLabels = {
  document: 'Document',
  user: 'User',
  organization: 'Organization',
  template: 'Template',
  page: 'Page',
}

const typeColors = {
  document: 'text-blue-600 bg-blue-100',
  user: 'text-green-600 bg-green-100',
  organization: 'text-purple-600 bg-purple-100',
  template: 'text-orange-600 bg-orange-100',
  page: 'text-gray-600 bg-gray-100',
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, className = '' }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Filter results based on query
    const filteredResults = mockSearchResults.filter(
      result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(filteredResults)
    setSelectedIndex(0)
    setIsLoading(false)
  }

  // Handle input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
    }
  }

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    navigate(result.path)
    onClose()
    setQuery('')
  }

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`} onClick={handleOverlayClick}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      {/* Search modal */}
      <div className="relative min-h-screen flex items-start justify-center pt-16 px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          {/* Search input */}
          <div className="flex items-center p-4 border-b border-gray-200">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search documents, users, organizations, templates..."
              className="flex-1 text-lg border-none outline-none placeholder-gray-500"
            />
            <button onClick={onClose} className="ml-3 p-1 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Search results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-center p-4 text-left hover:bg-gray-50 transition-colors ${
                      index === selectedIndex ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg ${typeColors[result.type]}`}>
                        <result.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                        <span className="text-xs text-gray-500">{typeLabels[result.type]}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{result.description}</p>
                      {result.metadata && (
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                          {result.metadata.status && (
                            <span
                              className={`px-2 py-0.5 rounded-full ${
                                result.metadata.status === 'published' ||
                                result.metadata.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {result.metadata.status}
                            </span>
                          )}
                          {result.metadata.lastModified && (
                            <span>Modified {result.metadata.lastModified}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">No results found for "{query}"</p>
                <p className="text-sm text-gray-400">
                  Try searching for documents, users, or organizations
                </p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">Start typing to search</p>
                <p className="text-sm text-gray-400">
                  Search across documents, users, organizations, and templates
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
              <span>
                {results.length} result{results.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
