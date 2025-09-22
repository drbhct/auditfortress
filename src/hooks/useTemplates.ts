import { useState, useEffect, useCallback } from 'react'
import { TemplateService } from '@/services/templateService'
import type { 
  PolicyTemplate, 
  TemplateCategory, 
  TemplateWithCategory, 
  ApiResponse 
} from '@/types'

export interface UseTemplatesReturn {
  // Data
  templates: TemplateWithCategory[]
  categories: TemplateCategory[]
  
  // Loading states
  isLoadingTemplates: boolean
  isLoadingCategories: boolean
  
  // Error states
  templatesError: string | null
  categoriesError: string | null
  
  // Actions
  refreshTemplates: () => Promise<void>
  refreshCategories: () => Promise<void>
  createTemplate: (template: Omit<PolicyTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<PolicyTemplate>>
  updateTemplate: (id: string, updates: Partial<PolicyTemplate>) => Promise<ApiResponse<PolicyTemplate>>
  deleteTemplate: (id: string) => Promise<ApiResponse<void>>
  searchTemplates: (query: string) => Promise<ApiResponse<TemplateWithCategory[]>>
  getTemplatesByCategory: (categoryId: string) => Promise<ApiResponse<TemplateWithCategory[]>>
}

export function useTemplates(): UseTemplatesReturn {
  // State
  const [templates, setTemplates] = useState<TemplateWithCategory[]>([])
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  // Load templates
  const loadTemplates = useCallback(async () => {
    setIsLoadingTemplates(true)
    setTemplatesError(null)
    
    try {
      const response = await TemplateService.getTemplates()
      if (response.success && response.data) {
        setTemplates(response.data)
      } else {
        setTemplatesError(response.error || 'Failed to load templates')
      }
    } catch (error) {
      setTemplatesError(error instanceof Error ? error.message : 'Failed to load templates')
    } finally {
      setIsLoadingTemplates(false)
    }
  }, [])

  // Load categories
  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true)
    setCategoriesError(null)
    
    try {
      const response = await TemplateService.getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        setCategoriesError(response.error || 'Failed to load categories')
      }
    } catch (error) {
      setCategoriesError(error instanceof Error ? error.message : 'Failed to load categories')
    } finally {
      setIsLoadingCategories(false)
    }
  }, [])

  // Create template
  const createTemplate = useCallback(async (template: Omit<PolicyTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await TemplateService.createTemplate(template)
    if (response.success) {
      // Refresh templates list
      await loadTemplates()
    }
    return response
  }, [loadTemplates])

  // Update template
  const updateTemplate = useCallback(async (id: string, updates: Partial<PolicyTemplate>) => {
    const response = await TemplateService.updateTemplate(id, updates)
    if (response.success) {
      // Update local state
      setTemplates(prev => 
        prev.map(template => 
          template.id === id 
            ? { ...template, ...updates, updatedAt: new Date().toISOString() }
            : template
        )
      )
    }
    return response
  }, [])

  // Delete template
  const deleteTemplate = useCallback(async (id: string) => {
    const response = await TemplateService.deleteTemplate(id)
    if (response.success) {
      // Remove from local state
      setTemplates(prev => prev.filter(template => template.id !== id))
    }
    return response
  }, [])

  // Search templates
  const searchTemplates = useCallback(async (query: string) => {
    return await TemplateService.searchTemplates(query)
  }, [])

  // Get templates by category
  const getTemplatesByCategory = useCallback(async (categoryId: string) => {
    return await TemplateService.getTemplatesByCategory(categoryId)
  }, [])

  // Load data on mount
  useEffect(() => {
    loadTemplates()
    loadCategories()
  }, [loadTemplates, loadCategories])

  return {
    // Data
    templates,
    categories,
    
    // Loading states
    isLoadingTemplates,
    isLoadingCategories,
    
    // Error states
    templatesError,
    categoriesError,
    
    // Actions
    refreshTemplates: loadTemplates,
    refreshCategories: loadCategories,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    searchTemplates,
    getTemplatesByCategory
  }
}
