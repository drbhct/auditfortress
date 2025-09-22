import React, { useState } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { AppCard } from '@/components/ui/AppCard'
import { cn } from '@/utils/cn'
import type { TemplateCategory, OrganizationType } from '@/types'

interface CategoryManagementProps {
  categories: TemplateCategory[]
  onUpdateCategory?: (id: string, updates: Partial<TemplateCategory>) => void
  onDeleteCategory?: (id: string) => void
  onCreateCategory?: (category: Omit<TemplateCategory, 'id' | 'createdAt' | 'updatedAt'>) => void
  className?: string
}

interface CategoryFormData {
  name: string
  description: string
  parentCategoryId: string
  organizationTypes: OrganizationType[]
  sortOrder: number
}

const initialFormData: CategoryFormData = {
  name: '',
  description: '',
  parentCategoryId: '',
  organizationTypes: [],
  sortOrder: 0
}

const organizationTypeOptions = [
  { value: 'healthcare_facility', label: 'Healthcare Facility' },
  { value: 'emr_software', label: 'EMR Software' },
  { value: 'third_party_services', label: 'Third Party Services' }
]

export function CategoryManagement({
  categories,
  onUpdateCategory,
  onDeleteCategory,
  onCreateCategory,
  className
}: CategoryManagementProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({})

  // Get root categories (no parent)
  const rootCategories = categories.filter(cat => !cat.parentCategoryId)

  // Get child categories for a parent
  const getChildCategories = (parentId: string) => {
    return categories.filter(cat => cat.parentCategoryId === parentId)
  }

  // Toggle category expansion
  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  // Start creating new category
  const startCreating = (parentId?: string) => {
    setFormData({
      ...initialFormData,
      parentCategoryId: parentId || '',
      sortOrder: categories.length + 1
    })
    setIsCreating(true)
    setEditingId(null)
    setErrors({})
  }

  // Start editing category
  const startEditing = (category: TemplateCategory) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      parentCategoryId: category.parentCategoryId || '',
      organizationTypes: category.organizationTypes,
      sortOrder: category.sortOrder
    })
    setEditingId(category.id)
    setIsCreating(false)
    setErrors({})
  }

  // Cancel editing/creating
  const cancelEditing = () => {
    setFormData(initialFormData)
    setEditingId(null)
    setIsCreating(false)
    setErrors({})
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }

    if (formData.organizationTypes.length === 0) {
      newErrors.organizationTypes = 'At least one organization type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (isCreating) {
      onCreateCategory?.(formData)
    } else if (editingId) {
      onUpdateCategory?.(editingId, formData)
    }

    cancelEditing()
  }

  // Handle input changes
  const handleInputChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle organization type changes
  const handleOrganizationTypeChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      organizationTypes: checked
        ? [...prev.organizationTypes, value as OrganizationType]
        : prev.organizationTypes.filter(type => type !== value)
    }))
  }

  // Render category tree
  const renderCategoryTree = (category: TemplateCategory, level: number = 0) => {
    const children = getChildCategories(category.id)
    const isExpanded = expandedCategories.has(category.id)
    const hasChildren = children.length > 0

    return (
      <div key={category.id} className="space-y-1">
        <div className={cn(
          'flex items-center justify-between p-3 rounded-lg border',
          'hover:bg-gray-50 transition-colors',
          level > 0 && 'ml-6'
        )}>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(category.id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            
            <TagIcon className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-900">{category.name}</span>
            {category.description && (
              <span className="text-sm text-gray-500">- {category.description}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {category.organizationTypes.join(', ')}
            </span>
            <div className="flex items-center gap-1">
              <AppButton
                variant="ghost"
                size="sm"
                onClick={() => startEditing(category)}
                className="p-1"
              >
                <PencilIcon className="h-4 w-4" />
              </AppButton>
              <AppButton
                variant="ghost"
                size="sm"
                onClick={() => onDeleteCategory?.(category.id)}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </AppButton>
            </div>
          </div>
        </div>

        {isExpanded && children.map(child => renderCategoryTree(child, level + 1))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Template Categories</h2>
          <p className="text-gray-600">
            Manage template categories and their organization type assignments
          </p>
        </div>
        
        <AppButton onClick={() => startCreating()}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Category
        </AppButton>
      </div>

      {/* Category Tree */}
      <AppCard className="p-6">
        <div className="space-y-2">
          {rootCategories.map(category => renderCategoryTree(category))}
        </div>
      </AppCard>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <AppCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isCreating ? 'Create New Category' : 'Edit Category'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <AppInput
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter category name"
                  className={cn(errors.name && 'border-red-500')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <AppSelect
                  value={formData.parentCategoryId}
                  onChange={(e) => handleInputChange('parentCategoryId', e.target.value)}
                  options={[
                    { value: '', label: 'No parent (root category)' },
                    ...categories.map(cat => ({
                      value: cat.id,
                      label: cat.name
                    }))
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <AppInput
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter category description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Types *
              </label>
              <div className="space-y-2">
                {organizationTypeOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.organizationTypes.includes(option.value as OrganizationType)}
                      onChange={(e) => handleOrganizationTypeChange(option.value, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.organizationTypes && (
                <p className="mt-1 text-sm text-red-600">{errors.organizationTypes}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <AppButton
                type="button"
                variant="outline"
                onClick={cancelEditing}
              >
                Cancel
              </AppButton>
              <AppButton type="submit">
                {isCreating ? 'Create Category' : 'Update Category'}
              </AppButton>
            </div>
          </form>
        </AppCard>
      )}
    </div>
  )
}
