import {
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
  icon?: React.ReactNode
}

interface AppSelectProps {
  options: SelectOption[]
  value?: string | number | (string | number)[]
  onChange: (value: string | number | (string | number)[]) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  loading?: boolean
  className?: string
  maxHeight?: string
  emptyMessage?: string
}

export const AppSelect: React.FC<AppSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  error,
  label,
  required = false,
  multiple = false,
  searchable = false,
  clearable = false,
  loading = false,
  className,
  maxHeight = 'max-h-60',
  emptyMessage = 'No options available',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  // Filter options based on search term
  const filteredOptions =
    searchable && searchTerm
      ? options.filter(
          option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options

  // Get selected options
  const selectedOptions = multiple
    ? options.filter(option => Array.isArray(value) && value.includes(option.value))
    : options.filter(option => option.value === value)

  // Handle option selection
  const handleOptionSelect = (optionValue: string | number) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue]
      onChange(newValues)
    } else {
      onChange(optionValue)
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(multiple ? [] : '')
  }

  // Remove single item in multiple mode
  const handleRemoveItem = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple && Array.isArray(value)) {
      onChange(value.filter(v => v !== optionValue))
    }
  }

  // Get display text
  const getDisplayText = () => {
    if (multiple) {
      return selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder
    }
    return selectedOptions[0]?.label || placeholder
  }

  // Check if option is selected
  const isOptionSelected = (optionValue: string | number) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue)
    }
    return value === optionValue
  }

  return (
    <div className={cn('relative', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select trigger */}
      <div
        ref={selectRef}
        className={cn(
          'relative w-full cursor-pointer rounded-md border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
          disabled ? 'cursor-not-allowed bg-gray-50 text-gray-500' : 'text-gray-900',
          error ? 'border-red-300' : 'border-gray-300'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {/* Selected values display */}
        <div className="flex flex-wrap gap-1">
          {multiple && selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded"
              >
                {option.label}
                <button
                  onClick={e => handleRemoveItem(option.value, e)}
                  className="hover:text-primary-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className={cn('block truncate', !selectedOptions.length && 'text-gray-500')}>
              {getDisplayText()}
            </span>
          )}
        </div>

        {/* Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {clearable && selectedOptions.length > 0 && !disabled && (
            <button onClick={handleClear} className="mr-1 p-1 hover:text-gray-600 text-gray-400">
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          <ChevronDownIcon
            className={cn(
              'h-5 w-5 text-gray-400 transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className={cn('py-1 overflow-auto', maxHeight)}>
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm ? 'No matching options' : emptyMessage}
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = isOptionSelected(option.value)

                return (
                  <div
                    key={option.value}
                    className={cn(
                      'relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100',
                      option.disabled && 'cursor-not-allowed opacity-50',
                      isSelected && 'bg-primary-50 text-primary-900'
                    )}
                    onClick={() => !option.disabled && handleOptionSelect(option.value)}
                  >
                    <div className="flex items-center">
                      {option.icon && <span className="mr-3 flex-shrink-0">{option.icon}</span>}
                      <div className="flex-1">
                        <span
                          className={cn(
                            'block truncate',
                            isSelected ? 'font-semibold' : 'font-normal'
                          )}
                        >
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="block text-xs text-gray-500 truncate">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
