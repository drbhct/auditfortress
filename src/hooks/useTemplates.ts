import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { templateService, type TemplateFilters, type TemplateCreateData, type TemplateUpdateData } from '@/services/templateService'

export const TEMPLATE_QUERY_KEYS = {
  all: ['templates'] as const,
  lists: () => [...TEMPLATE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: TemplateFilters, page: number, limit: number) => 
    [...TEMPLATE_QUERY_KEYS.lists(), { filters, page, limit }] as const,
  details: () => [...TEMPLATE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TEMPLATE_QUERY_KEYS.details(), id] as const,
  categories: () => [...TEMPLATE_QUERY_KEYS.all, 'categories'] as const,
  stats: () => [...TEMPLATE_QUERY_KEYS.all, 'stats'] as const,
}

/**
 * Hook for fetching templates with pagination and filtering
 */
export function useTemplates(
  filters: TemplateFilters = {},
  page = 1,
  limit = 10,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: TEMPLATE_QUERY_KEYS.list(filters, page, limit),
    queryFn: () => templateService.getSystemTemplates(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  })
}

/**
 * Hook for fetching a single template
 */
export function useTemplate(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: TEMPLATE_QUERY_KEYS.detail(id),
    queryFn: () => templateService.getSystemTemplate(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: (options?.enabled ?? true) && !!id,
  })
}

/**
 * Hook for fetching template categories
 */
export function useTemplateCategories() {
  return useQuery({
    queryKey: TEMPLATE_QUERY_KEYS.categories(),
    queryFn: () => templateService.getTemplateCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook for fetching template statistics
 */
export function useTemplateStats() {
  return useQuery({
    queryKey: TEMPLATE_QUERY_KEYS.stats(),
    queryFn: () => templateService.getTemplateStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook for creating a template
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (templateData: TemplateCreateData) => 
      templateService.createSystemTemplate(templateData),
    onSuccess: () => {
      // Invalidate all template lists and stats
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.stats() })
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.categories() })
    },
  })
}

/**
 * Hook for updating a template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TemplateUpdateData }) => 
      templateService.updateSystemTemplate(id, data),
    onSuccess: (updatedTemplate) => {
      // Update the specific template in cache
      queryClient.setQueryData(
        TEMPLATE_QUERY_KEYS.detail(updatedTemplate.id),
        updatedTemplate
      )
      
      // Invalidate template lists to refresh data
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.stats() })
    },
  })
}

/**
 * Hook for deleting a template
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => templateService.deleteSystemTemplate(id),
    onSuccess: (_, deletedId) => {
      // Remove the template from cache
      queryClient.removeQueries({ queryKey: TEMPLATE_QUERY_KEYS.detail(deletedId) })
      
      // Invalidate template lists and stats
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.stats() })
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.categories() })
    },
  })
}

/**
 * Hook for duplicating a template
 */
export function useDuplicateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      templateService.duplicateSystemTemplate(id, name),
    onSuccess: () => {
      // Invalidate template lists and stats
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TEMPLATE_QUERY_KEYS.stats() })
    },
  })
}