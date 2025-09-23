import { supabase } from '@/lib/supabaseClient'
import type { 
  Tables, 
  TablesInsert, 
  TablesUpdate,
  Enums 
} from '@/types/supabase'

// Template types from database
export type SystemTemplate = Tables<'system_templates'>
export type OrganizationTemplate = Tables<'organization_templates'>
export type TemplateCategory = Enums<'template_category'>

// Extended types for UI
export interface SystemTemplateWithMetrics extends SystemTemplate {
  usageCount: number
  averageRating: number
  successfulImplementations: number
  organizationCount: number
}

export interface TemplateCreateData {
  name: string
  description?: string
  category: TemplateCategory
  organization_types: string[]
  compliance_framework?: string
  content: any // JSON content structure
  variables?: any[]
  tags?: string[]
  is_starter?: boolean
}

export interface TemplateUpdateData extends Partial<TemplateCreateData> {
  version?: string
  metadata?: any
  status?: string
}

export interface TemplateFilters {
  category?: TemplateCategory
  organization_type?: string
  compliance_framework?: string
  status?: string
  search?: string
  is_starter?: boolean
}

export interface TemplateListResponse {
  data: SystemTemplateWithMetrics[]
  count: number
  page: number
  totalPages: number
}

class TemplateService {
  /**
   * Get all system templates with optional filtering and pagination
   */
  async getSystemTemplates(
    filters: TemplateFilters = {},
    page = 1,
    limit = 10
  ): Promise<TemplateListResponse> {
    try {
      let query = supabase
        .from('system_templates')
        .select(`
          *,
          organization_templates(count),
          profiles!system_templates_created_by_fkey(
            first_name,
            last_name,
            email
          )
        `)

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.compliance_framework) {
        query = query.eq('compliance_framework', filters.compliance_framework)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.is_starter !== undefined) {
        query = query.eq('is_starter', filters.is_starter)
      }

      if (filters.organization_type) {
        query = query.contains('organization_types', [filters.organization_type])
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Add pagination
      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

      // Execute query
      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching system templates:', error)
        throw new Error(error.message)
      }

      // Transform data to include metrics
      const templatesWithMetrics: SystemTemplateWithMetrics[] = (data || []).map(template => ({
        ...template,
        usageCount: template.organization_templates?.length || 0,
        averageRating: 4.5, // TODO: Calculate from actual ratings
        successfulImplementations: Math.floor((template.organization_templates?.length || 0) * 0.85),
        organizationCount: template.organization_templates?.length || 0
      }))

      return {
        data: templatesWithMetrics,
        count: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Template service error:', error)
      throw error
    }
  }

  /**
   * Get a single system template by ID
   */
  async getSystemTemplate(id: string): Promise<SystemTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('system_templates')
        .select(`
          *,
          profiles!system_templates_created_by_fkey(
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching system template:', error)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Template service error:', error)
      throw error
    }
  }

  /**
   * Create a new system template
   */
  async createSystemTemplate(templateData: TemplateCreateData): Promise<SystemTemplate> {
    try {
      const insertData: TablesInsert<'system_templates'> = {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        organization_types: templateData.organization_types,
        compliance_framework: templateData.compliance_framework,
        content: templateData.content,
        variables: templateData.variables || [],
        tags: templateData.tags || [],
        is_starter: templateData.is_starter || false,
        version: '1.0.0',
        status: 'active'
      }

      const { data, error } = await supabase
        .from('system_templates')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error creating system template:', error)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Template service error:', error)
      throw error
    }
  }

  /**
   * Update a system template
   */
  async updateSystemTemplate(id: string, templateData: TemplateUpdateData): Promise<SystemTemplate> {
    try {
      const updateData: TablesUpdate<'system_templates'> = {
        ...templateData,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('system_templates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating system template:', error)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Template service error:', error)
      throw error
    }
  }

  /**
   * Delete a system template
   */
  async deleteSystemTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_templates')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting system template:', error)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Template service error:', error)
      throw error
    }
  }

  /**
   * Get template categories with counts
   */
  async getTemplateCategories(): Promise<Array<{ category: TemplateCategory; count: number }>> {
    try {
      const { data, error } = await supabase
        .from('system_templates')
        .select('category')

      if (error) {
        console.error('Error fetching template categories:', error)
        throw new Error(error.message)
      }

      // Count categories
      const categoryCounts = (data || []).reduce((acc, template) => {
        acc[template.category] = (acc[template.category] || 0) + 1
        return acc
      }, {} as Record<TemplateCategory, number>)

      return Object.entries(categoryCounts).map(([category, count]) => ({
        category: category as TemplateCategory,
        count
      }))
    } catch (error) {
      console.error('Template service error:', error)
      throw error
    }
  }

  /**
   * Duplicate a system template
   */
  async duplicateSystemTemplate(id: string, name: string): Promise<SystemTemplate> {
    try {
      // First get the original template
      const original = await this.getSystemTemplate(id)
      if (!original) {
        throw new Error('Template not found')
      }

      // Create a copy with new name
      const duplicateData: TemplateCreateData = {
        name,
        description: original.description || undefined,
        category: original.category,
        organization_types: original.organization_types || [],
        compliance_framework: original.compliance_framework || undefined,
        content: original.content,
        variables: original.variables || [],
        tags: original.tags || [],
        is_starter: false
      }

      return await this.createSystemTemplate(duplicateData)
    } catch (error) {
      console.error('Template service error:', error)
      throw error
    }
  }

  /**
   * Get template usage statistics
   */
  async getTemplateStats(): Promise<{
    total: number
    byCategory: Record<string, number>
    byStatus: Record<string, number>
    thisMonth: number
    lastMonth: number
  }> {
    try {
      const { data, error } = await supabase
        .from('system_templates')
        .select('category, status, created_at')

      if (error) {
        console.error('Error fetching template stats:', error)
        throw new Error(error.message)
      }

      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      const stats = (data || []).reduce(
        (acc, template) => {
          acc.total++
          acc.byCategory[template.category] = (acc.byCategory[template.category] || 0) + 1
          acc.byStatus[template.status || 'active'] = (acc.byStatus[template.status || 'active'] || 0) + 1

          const createdAt = new Date(template.created_at || '')
          if (createdAt >= thisMonthStart) {
            acc.thisMonth++
          } else if (createdAt >= lastMonthStart && createdAt <= lastMonthEnd) {
            acc.lastMonth++
          }

          return acc
        },
        {
          total: 0,
          byCategory: {} as Record<string, number>,
          byStatus: {} as Record<string, number>,
          thisMonth: 0,
          lastMonth: 0
        }
      )

      return stats
    } catch (error) {
      console.error('Template service error:', error)
      throw error
    }
  }
}

export const templateService = new TemplateService()