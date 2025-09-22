import type { Organization, Profile, ActivityLog } from '@/types'

// Mock data for organizations
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'General Hospital',
    type: 'healthcare_facility',
    status: 'active',
    metadata: {
      description:
        'A leading healthcare facility providing comprehensive medical services to the community.',
      website: 'https://generalhospital.com',
      address: {
        street: '123 Medical Center Drive',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'United States',
      },
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'admin@generalhospital.com',
      },
    },
    settings: {
      timezone: 'America/Chicago',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-03-10T14:22:00Z',
  },
  {
    id: '2',
    name: 'MedTech Solutions',
    type: 'emr_software',
    status: 'active',
    metadata: {
      description:
        'Electronic Medical Records software company specializing in healthcare technology.',
      website: 'https://medtechsolutions.com',
      address: {
        street: '456 Tech Boulevard',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States',
      },
      contact: {
        phone: '+1 (555) 987-6543',
        email: 'contact@medtechsolutions.com',
      },
    },
    settings: {
      timezone: 'America/Los_Angeles',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
    created_at: '2024-02-20T09:15:00Z',
    updated_at: '2024-03-09T16:45:00Z',
  },
  {
    id: '3',
    name: 'Healthcare Analytics Inc',
    type: 'third_party_service',
    status: 'trial',
    metadata: {
      description: 'Healthcare data analytics and consulting services.',
      website: 'https://healthcareanalytics.com',
      address: {
        street: '789 Data Drive',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'United States',
      },
      contact: {
        phone: '+1 (555) 456-7890',
        email: 'info@healthcareanalytics.com',
      },
    },
    settings: {
      timezone: 'America/Chicago',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        email: true,
        sms: false,
        push: false,
      },
    },
    created_at: '2024-03-01T14:20:00Z',
    updated_at: '2024-03-08T11:30:00Z',
  },
]

// Mock data for organization members
const mockMembers = [
  {
    id: '1',
    organizationId: '1',
    userId: 'user-1',
    role: 'account_owner',
    department: 'Administration',
    status: 'active',
    joinedAt: '2024-01-15T10:30:00Z',
    lastActiveAt: '2024-03-10T14:22:00Z',
  },
  {
    id: '2',
    organizationId: '1',
    userId: 'user-2',
    role: 'compliance_manager',
    department: 'Compliance',
    status: 'active',
    joinedAt: '2024-01-20T09:15:00Z',
    lastActiveAt: '2024-03-10T12:15:00Z',
  },
  {
    id: '3',
    organizationId: '1',
    userId: 'user-3',
    role: 'document_manager',
    department: 'IT',
    status: 'active',
    joinedAt: '2024-02-01T14:20:00Z',
    lastActiveAt: '2024-03-09T16:45:00Z',
  },
  {
    id: '4',
    organizationId: '1',
    userId: 'user-4',
    role: 'user',
    department: 'HR',
    status: 'pending',
    joinedAt: '2024-03-08T09:30:00Z',
    lastActiveAt: '2024-03-08T09:30:00Z',
  },
]

// Mock data for activity logs
const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    organizationId: '1',
    userId: 'user-1',
    action: 'document_created',
    description: 'HIPAA Privacy Policy document was created',
    entityType: 'document',
    entityId: 'doc-1',
    metadata: {
      documentName: 'HIPAA Privacy Policy',
      templateId: 'template-1',
    },
    created_at: '2024-03-10T14:22:00Z',
  },
  {
    id: '2',
    organizationId: '1',
    userId: 'user-1',
    action: 'user_invited',
    description: 'John Smith was invited to join the organization',
    entityType: 'user',
    entityId: 'user-4',
    metadata: {
      invitedUserEmail: 'john.smith@generalhospital.com',
      role: 'user',
    },
    created_at: '2024-03-08T09:30:00Z',
  },
  {
    id: '3',
    organizationId: '1',
    userId: 'user-2',
    action: 'template_updated',
    description: 'Data Breach Response template was updated',
    entityType: 'template',
    entityId: 'template-2',
    metadata: {
      templateName: 'Data Breach Response',
      changes: ['content', 'variables'],
    },
    created_at: '2024-03-07T16:15:00Z',
  },
  {
    id: '4',
    organizationId: '1',
    userId: 'system',
    action: 'payment_failed',
    description: 'Payment method expired, please update billing information',
    entityType: 'billing',
    entityId: 'payment-1',
    metadata: {
      paymentMethodId: 'pm_1234',
      amount: 299.99,
      currency: 'USD',
    },
    created_at: '2024-03-05T10:00:00Z',
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const organizationService = {
  // Get all organizations
  async getOrganizations(): Promise<Organization[]> {
    await delay(500)
    return [...mockOrganizations]
  },

  // Get organization by ID
  async getOrganizationById(id: string): Promise<Organization | null> {
    await delay(300)
    return mockOrganizations.find(org => org.id === id) || null
  },

  // Create new organization
  async createOrganization(
    organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Organization> {
    await delay(800)

    const newOrganization: Organization = {
      ...organization,
      id: `org-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockOrganizations.push(newOrganization)
    return newOrganization
  },

  // Update organization
  async updateOrganization(
    id: string,
    updates: Partial<Organization>
  ): Promise<Organization | null> {
    await delay(600)

    const index = mockOrganizations.findIndex(org => org.id === id)
    if (index === -1) return null

    mockOrganizations[index] = {
      ...mockOrganizations[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    return mockOrganizations[index]
  },

  // Delete organization
  async deleteOrganization(id: string): Promise<boolean> {
    await delay(400)

    const index = mockOrganizations.findIndex(org => org.id === id)
    if (index === -1) return false

    mockOrganizations.splice(index, 1)
    return true
  },

  // Search organizations
  async searchOrganizations(query: string): Promise<Organization[]> {
    await delay(300)

    const lowercaseQuery = query.toLowerCase()
    return mockOrganizations.filter(
      org =>
        org.name.toLowerCase().includes(lowercaseQuery) ||
        org.metadata?.description?.toLowerCase().includes(lowercaseQuery) ||
        org.metadata?.contact?.email?.toLowerCase().includes(lowercaseQuery)
    )
  },

  // Get organization members
  async getOrganizationMembers(organizationId: string): Promise<any[]> {
    await delay(300)
    return mockMembers.filter(member => member.organizationId === organizationId)
  },

  // Add member to organization
  async addMember(
    organizationId: string,
    userId: string,
    role: string,
    department?: string
  ): Promise<boolean> {
    await delay(500)

    const newMember = {
      id: `member-${Date.now()}`,
      organizationId,
      userId,
      role,
      department: department || 'General',
      status: 'pending',
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    }

    mockMembers.push(newMember)
    return true
  },

  // Update member role
  async updateMemberRole(memberId: string, role: string, department?: string): Promise<boolean> {
    await delay(400)

    const member = mockMembers.find(m => m.id === memberId)
    if (!member) return false

    member.role = role
    if (department) member.department = department
    return true
  },

  // Remove member from organization
  async removeMember(memberId: string): Promise<boolean> {
    await delay(400)

    const index = mockMembers.findIndex(m => m.id === memberId)
    if (index === -1) return false

    mockMembers.splice(index, 1)
    return true
  },

  // Get organization activity logs
  async getOrganizationActivity(organizationId: string, limit = 50): Promise<ActivityLog[]> {
    await delay(300)
    return mockActivityLogs.filter(log => log.organizationId === organizationId).slice(0, limit)
  },

  // Get organization statistics
  async getOrganizationStats(organizationId: string): Promise<{
    memberCount: number
    documentCount: number
    templateCount: number
    complianceScore: number
    lastActivity: string
  }> {
    await delay(200)

    const members = mockMembers.filter(m => m.organizationId === organizationId)
    const activity = mockActivityLogs
      .filter(log => log.organizationId === organizationId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return {
      memberCount: members.length,
      documentCount: 1234, // Mock data
      templateCount: 45, // Mock data
      complianceScore: 98, // Mock data
      lastActivity: activity[0]?.created_at || new Date().toISOString(),
    }
  },

  // Get organization billing information
  async getOrganizationBilling(organizationId: string): Promise<{
    subscription: {
      plan: string
      status: string
      currentPeriodStart: string
      currentPeriodEnd: string
      amount: number
      currency: string
    }
    paymentMethod: {
      type: string
      last4: string
      brand: string
      expiryMonth: number
      expiryYear: number
    }
    usage: {
      documentsGenerated: number
      storageUsed: number
      storageLimit: number
      apiCalls: number
      apiLimit: number
    }
    invoices: Array<{
      id: string
      date: string
      amount: number
      status: string
      downloadUrl: string
    }>
  }> {
    await delay(300)

    // Mock billing data
    return {
      subscription: {
        plan: 'Pro',
        status: 'active',
        currentPeriodStart: '2024-03-01T00:00:00Z',
        currentPeriodEnd: '2024-03-31T23:59:59Z',
        amount: 299.99,
        currency: 'USD',
      },
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
      },
      usage: {
        documentsGenerated: 1234,
        storageUsed: 2.5,
        storageLimit: 100,
        apiCalls: 15420,
        apiLimit: 100000,
      },
      invoices: [
        {
          id: 'inv_001',
          date: '2024-03-01T00:00:00Z',
          amount: 299.99,
          status: 'paid',
          downloadUrl: '#',
        },
        {
          id: 'inv_002',
          date: '2024-02-01T00:00:00Z',
          amount: 299.99,
          status: 'paid',
          downloadUrl: '#',
        },
      ],
    }
  },
}
