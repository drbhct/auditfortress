import type { 
  PolicyTemplate, 
  TemplateCategory, 
  TemplateWithCategory, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types'

// Mock data for template categories
const mockCategories: TemplateCategory[] = [
  {
    id: '1',
    name: 'HIPAA Privacy',
    description: 'HIPAA Privacy compliance templates',
    parentCategoryId: undefined,
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Privacy Policies',
    description: 'Patient privacy policy templates',
    parentCategoryId: '1',
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Patient Rights',
    description: 'Patient rights and responsibilities templates',
    parentCategoryId: '1',
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Breach Procedures',
    description: 'Data breach response procedures',
    parentCategoryId: '1',
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'HIPAA Security',
    description: 'HIPAA Security compliance templates',
    parentCategoryId: undefined,
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 2,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Security Standards',
    description: 'Technical and administrative safeguards',
    parentCategoryId: '5',
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 1,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'OIG',
    description: 'Office of Inspector General compliance',
    parentCategoryId: undefined,
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 3,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'Coding',
    description: 'Medical coding and documentation',
    parentCategoryId: undefined,
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '9',
    name: 'Documentation',
    description: 'Clinical documentation requirements',
    parentCategoryId: undefined,
    organizationTypes: ['healthcare_facility', 'emr_software'],
    sortOrder: 5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Mock data for policy templates
const mockTemplates: PolicyTemplate[] = [
  {
    id: '1',
    name: 'HIPAA Privacy Policy',
    description: 'Comprehensive HIPAA privacy policy template',
    categoryId: '2',
    content: `
      <h1>HIPAA Privacy Policy</h1>
      <p>This policy outlines how {{organization_name}} protects patient health information...</p>
      <h2>Patient Rights</h2>
      <p>Patients have the right to:</p>
      <ul>
        <li>Access their health information</li>
        <li>Request amendments to their records</li>
        <li>Receive an accounting of disclosures</li>
      </ul>
      <h2>Contact Information</h2>
      <p>Privacy Officer: {{privacy_officer_name}}<br>
      Phone: {{privacy_officer_phone}}<br>
      Email: {{privacy_officer_email}}</p>
    `,
    variables: {
      organization_name: 'Your Organization Name',
      privacy_officer_name: 'Privacy Officer Name',
      privacy_officer_phone: '(555) 123-4567',
      privacy_officer_email: 'privacy@organization.com'
    },
    status: 'published',
    createdBy: 'system',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Patient Rights and Responsibilities',
    description: 'Patient rights and responsibilities document',
    categoryId: '3',
    content: `
      <h1>Patient Rights and Responsibilities</h1>
      <p>{{organization_name}} is committed to protecting your rights as a patient...</p>
      <h2>Your Rights</h2>
      <ul>
        <li>Right to receive quality care</li>
        <li>Right to privacy and confidentiality</li>
        <li>Right to participate in treatment decisions</li>
      </ul>
      <h2>Your Responsibilities</h2>
      <ul>
        <li>Provide accurate health information</li>
        <li>Follow treatment plans</li>
        <li>Respect facility policies</li>
      </ul>
    `,
    variables: {
      organization_name: 'Your Organization Name'
    },
    status: 'published',
    createdBy: 'system',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Data Breach Response Plan',
    description: 'Comprehensive data breach response procedures',
    categoryId: '4',
    content: `
      <h1>Data Breach Response Plan</h1>
      <p>This plan outlines the steps to take in the event of a data breach...</p>
      <h2>Immediate Response (0-24 hours)</h2>
      <ol>
        <li>Contain the breach</li>
        <li>Assess the scope and impact</li>
        <li>Notify the Privacy Officer</li>
        <li>Document all actions taken</li>
      </ol>
      <h2>Notification Requirements</h2>
      <p>Notify affected individuals within {{notification_period}} days...</p>
    `,
    variables: {
      notification_period: '60'
    },
    status: 'published',
    createdBy: 'system',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Security Risk Assessment',
    description: 'HIPAA security risk assessment template',
    categoryId: '6',
    content: `
      <h1>Security Risk Assessment</h1>
      <p>This assessment evaluates {{organization_name}}'s security posture...</p>
      <h2>Administrative Safeguards</h2>
      <ul>
        <li>Security Officer designation</li>
        <li>Workforce training</li>
        <li>Access management procedures</li>
      </ul>
      <h2>Technical Safeguards</h2>
      <ul>
        <li>Access controls</li>
        <li>Audit controls</li>
        <li>Integrity controls</li>
      </ul>
    `,
    variables: {
      organization_name: 'Your Organization Name'
    },
    status: 'draft',
    createdBy: 'system',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z'
  }
]

// Helper function to get category by ID
const getCategoryById = (id: string): TemplateCategory | undefined => {
  return mockCategories.find(cat => cat.id === id)
}

// Helper function to add category to template
const addCategoryToTemplate = (template: PolicyTemplate): TemplateWithCategory => {
  const category = getCategoryById(template.categoryId)
  if (!category) {
    throw new Error(`Category with id ${template.categoryId} not found`)
  }
  return { ...template, category }
}

// Template Service
export class TemplateService {
  // Get all categories
  static async getCategories(): Promise<ApiResponse<TemplateCategory[]>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return {
        success: true,
        data: mockCategories.filter(cat => cat.isActive)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      }
    }
  }

  // Get all templates with categories
  static async getTemplates(): Promise<ApiResponse<TemplateWithCategory[]>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const templatesWithCategories = mockTemplates.map(addCategoryToTemplate)
      
      return {
        success: true,
        data: templatesWithCategories
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates'
      }
    }
  }

  // Get templates by category
  static async getTemplatesByCategory(categoryId: string): Promise<ApiResponse<TemplateWithCategory[]>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const templatesInCategory = mockTemplates
        .filter(template => template.categoryId === categoryId)
        .map(addCategoryToTemplate)
      
      return {
        success: true,
        data: templatesInCategory
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates by category'
      }
    }
  }

  // Get single template
  static async getTemplate(id: string): Promise<ApiResponse<TemplateWithCategory>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const template = mockTemplates.find(t => t.id === id)
      if (!template) {
        return {
          success: false,
          error: 'Template not found'
        }
      }
      
      const templateWithCategory = addCategoryToTemplate(template)
      
      return {
        success: true,
        data: templateWithCategory
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch template'
      }
    }
  }

  // Create new template
  static async createTemplate(template: Omit<PolicyTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PolicyTemplate>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newTemplate: PolicyTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockTemplates.push(newTemplate)
      
      return {
        success: true,
        data: newTemplate
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create template'
      }
    }
  }

  // Update template
  static async updateTemplate(id: string, updates: Partial<PolicyTemplate>): Promise<ApiResponse<PolicyTemplate>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const templateIndex = mockTemplates.findIndex(t => t.id === id)
      if (templateIndex === -1) {
        return {
          success: false,
          error: 'Template not found'
        }
      }
      
      const updatedTemplate = {
        ...mockTemplates[templateIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      mockTemplates[templateIndex] = updatedTemplate
      
      return {
        success: true,
        data: updatedTemplate
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update template'
      }
    }
  }

  // Delete template
  static async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const templateIndex = mockTemplates.findIndex(t => t.id === id)
      if (templateIndex === -1) {
        return {
          success: false,
          error: 'Template not found'
        }
      }
      
      mockTemplates.splice(templateIndex, 1)
      
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete template'
      }
    }
  }

  // Search templates
  static async searchTemplates(query: string): Promise<ApiResponse<TemplateWithCategory[]>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const searchResults = mockTemplates
        .filter(template => 
          template.name.toLowerCase().includes(query.toLowerCase()) ||
          template.description?.toLowerCase().includes(query.toLowerCase())
        )
        .map(addCategoryToTemplate)
      
      return {
        success: true,
        data: searchResults
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search templates'
      }
    }
  }
}
