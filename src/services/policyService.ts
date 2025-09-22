import type { GeneratedPolicy } from '@/types'

// Mock data for generated policies
const mockPolicies: GeneratedPolicy[] = [
  {
    id: 'policy-1',
    templateId: 'template-1',
    title: 'HIPAA Privacy Policy - General Hospital',
    content: `
      <h1>HIPAA Privacy Policy</h1>
      <h2>General Hospital</h2>
      <p>This policy outlines our commitment to protecting patient privacy and complying with HIPAA regulations.</p>
      <h3>1. Patient Rights</h3>
      <p>Patients have the right to:</p>
      <ul>
        <li>Access their medical records</li>
        <li>Request amendments to their records</li>
        <li>Request restrictions on disclosure</li>
        <li>Receive confidential communications</li>
      </ul>
      <h3>2. Our Responsibilities</h3>
      <p>We are committed to:</p>
      <ul>
        <li>Maintaining the confidentiality of patient information</li>
        <li>Using patient information only for treatment, payment, and healthcare operations</li>
        <li>Implementing appropriate safeguards to protect patient information</li>
        <li>Training all staff on HIPAA requirements</li>
      </ul>
    `,
    variables: {
      organization_name: 'General Hospital',
      contact_email: 'privacy@generalhospital.com',
      effective_date: '2024-01-01',
    },
    generatedAt: '2024-01-15T10:30:00Z',
    generatedBy: 'admin@auditfortress.com',
    templateName: 'HIPAA Privacy Policy Template',
    templateCategory: 'Privacy Policies',
  },
  {
    id: 'policy-2',
    templateId: 'template-2',
    title: 'Data Breach Response Plan - TechCorp',
    content: `
      <h1>Data Breach Response Plan</h1>
      <h2>TechCorp</h2>
      <p>This plan outlines our procedures for responding to data breaches and security incidents.</p>
      <h3>1. Incident Detection</h3>
      <p>All staff must immediately report any suspected data breach to the security team.</p>
      <h3>2. Response Team</h3>
      <p>The response team includes:</p>
      <ul>
        <li>Chief Information Security Officer</li>
        <li>Legal Counsel</li>
        <li>Public Relations Manager</li>
        <li>IT Director</li>
      </ul>
      <h3>3. Notification Requirements</h3>
      <p>We will notify affected individuals within 72 hours of discovery.</p>
    `,
    variables: {
      organization_name: 'TechCorp',
      contact_email: 'security@techcorp.com',
      effective_date: '2024-01-01',
    },
    generatedAt: '2024-01-20T14:45:00Z',
    generatedBy: 'admin@auditfortress.com',
    templateName: 'Data Breach Response Plan Template',
    templateCategory: 'Incident Response',
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const policyService = {
  // Get all policies
  async getPolicies(): Promise<GeneratedPolicy[]> {
    await delay(500)
    return [...mockPolicies]
  },

  // Get policy by ID
  async getPolicyById(id: string): Promise<GeneratedPolicy | null> {
    await delay(300)
    return mockPolicies.find(policy => policy.id === id) || null
  },

  // Create new policy
  async createPolicy(
    policy: Omit<GeneratedPolicy, 'id' | 'generatedAt' | 'generatedBy'>
  ): Promise<GeneratedPolicy> {
    await delay(800)

    const newPolicy: GeneratedPolicy = {
      ...policy,
      id: `policy-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      generatedBy: 'current-user', // Will be replaced with actual user ID
    }

    mockPolicies.unshift(newPolicy)
    return newPolicy
  },

  // Update policy
  async updatePolicy(
    id: string,
    updates: Partial<GeneratedPolicy>
  ): Promise<GeneratedPolicy | null> {
    await delay(600)

    const index = mockPolicies.findIndex(policy => policy.id === id)
    if (index === -1) return null

    mockPolicies[index] = { ...mockPolicies[index], ...updates }
    return mockPolicies[index]
  },

  // Delete policy
  async deletePolicy(id: string): Promise<boolean> {
    await delay(400)

    const index = mockPolicies.findIndex(policy => policy.id === id)
    if (index === -1) return false

    mockPolicies.splice(index, 1)
    return true
  },

  // Search policies
  async searchPolicies(query: string): Promise<GeneratedPolicy[]> {
    await delay(300)

    const lowercaseQuery = query.toLowerCase()
    return mockPolicies.filter(
      policy =>
        policy.title.toLowerCase().includes(lowercaseQuery) ||
        policy.templateName?.toLowerCase().includes(lowercaseQuery) ||
        policy.templateCategory?.toLowerCase().includes(lowercaseQuery) ||
        policy.content.toLowerCase().includes(lowercaseQuery)
    )
  },

  // Get policies by template
  async getPoliciesByTemplate(templateId: string): Promise<GeneratedPolicy[]> {
    await delay(300)
    return mockPolicies.filter(policy => policy.templateId === templateId)
  },

  // Get policies by user
  async getPoliciesByUser(userId: string): Promise<GeneratedPolicy[]> {
    await delay(300)
    return mockPolicies.filter(policy => policy.generatedBy === userId)
  },
}
