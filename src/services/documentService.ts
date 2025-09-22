import type {
  Document,
  DocumentWithDetails,
  DocumentVersion,
  DocumentCollaborator,
  DocumentWorkflow,
  DocumentStatus,
  DocumentRole,
  DocumentPermission,
  DocumentPriority,
  ConfidentialityLevel,
  WorkflowStatus,
  StepStatus,
} from '@/types'

// Mock data for documents
const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'HIPAA Privacy Policy',
    content: `
      <h1>HIPAA Privacy Policy</h1>
      <h2>General Hospital</h2>
      <p><strong>Effective Date:</strong> March 1, 2024</p>
      
      <h3>1. Purpose</h3>
      <p>This policy establishes guidelines for protecting patient privacy and complying with HIPAA regulations.</p>
      
      <h3>2. Patient Rights</h3>
      <p>Patients have the right to:</p>
      <ul>
        <li>Access their medical records</li>
        <li>Request amendments to their records</li>
        <li>Request restrictions on disclosure</li>
        <li>Receive confidential communications</li>
      </ul>
      
      <h3>3. Our Responsibilities</h3>
      <p>We are committed to:</p>
      <ul>
        <li>Maintaining the confidentiality of patient information</li>
        <li>Using patient information only for treatment, payment, and healthcare operations</li>
        <li>Implementing appropriate safeguards to protect patient information</li>
        <li>Training all staff on HIPAA requirements</li>
      </ul>
    `,
    description: 'Comprehensive HIPAA privacy policy for healthcare organizations',
    organizationId: 'org-1',
    templateId: 'template-1',
    status: 'published',
    version: 3,
    currentVersionId: 'version-3',
    createdBy: 'user-1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedBy: 'user-2',
    updatedAt: '2024-03-10T14:22:00Z',
    publishedAt: '2024-03-10T14:22:00Z',
    tags: ['HIPAA', 'Privacy', 'Compliance', 'Healthcare'],
    metadata: {
      category: 'Privacy Policies',
      department: 'Compliance',
      priority: 'high',
      confidentiality: 'confidential',
      retentionPeriod: 2555, // 7 years
      complianceRequirements: ['HIPAA', 'HITECH'],
      lastReviewedAt: '2024-03-01T00:00:00Z',
      nextReviewDate: '2024-09-01T00:00:00Z',
      fileSize: 15420,
      wordCount: 1250,
      pageCount: 8,
    },
    collaborators: [
      {
        id: 'collab-1',
        documentId: 'doc-1',
        userId: 'user-1',
        role: 'owner',
        permissions: ['read', 'write', 'comment', 'approve', 'publish', 'archive', 'delete'],
        addedBy: 'user-1',
        addedAt: '2024-01-15T10:30:00Z',
        lastAccessedAt: '2024-03-10T14:22:00Z',
      },
      {
        id: 'collab-2',
        documentId: 'doc-1',
        userId: 'user-2',
        role: 'editor',
        permissions: ['read', 'write', 'comment'],
        addedBy: 'user-1',
        addedAt: '2024-01-20T09:15:00Z',
        lastAccessedAt: '2024-03-09T16:45:00Z',
      },
    ],
    workflow: {
      id: 'workflow-1',
      documentId: 'doc-1',
      currentStep: 3,
      totalSteps: 4,
      status: 'completed',
      steps: [
        {
          id: 'step-1',
          name: 'Draft Creation',
          description: 'Initial document creation',
          order: 1,
          status: 'completed',
          assignedTo: 'user-1',
          completedAt: '2024-01-15T10:30:00Z',
          required: true,
        },
        {
          id: 'step-2',
          name: 'Internal Review',
          description: 'Compliance team review',
          order: 2,
          status: 'completed',
          assignedTo: 'user-2',
          completedAt: '2024-02-15T14:20:00Z',
          required: true,
        },
        {
          id: 'step-3',
          name: 'Legal Approval',
          description: 'Legal team approval',
          order: 3,
          status: 'completed',
          assignedTo: 'user-3',
          completedAt: '2024-03-01T11:30:00Z',
          required: true,
        },
        {
          id: 'step-4',
          name: 'Publication',
          description: 'Final publication',
          order: 4,
          status: 'completed',
          assignedTo: 'user-1',
          completedAt: '2024-03-10T14:22:00Z',
          required: true,
        },
      ],
      completedAt: '2024-03-10T14:22:00Z',
    },
  },
  {
    id: 'doc-2',
    title: 'Data Breach Response Plan',
    content: `
      <h1>Data Breach Response Plan</h1>
      <h2>General Hospital</h2>
      <p><strong>Effective Date:</strong> March 1, 2024</p>
      
      <h3>1. Incident Detection</h3>
      <p>All personnel must immediately report any suspected data breach to the security team.</p>
      
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
    description: 'Comprehensive data breach response procedures',
    organizationId: 'org-1',
    templateId: 'template-2',
    status: 'in_review',
    version: 2,
    currentVersionId: 'version-2',
    createdBy: 'user-2',
    createdAt: '2024-02-20T09:15:00Z',
    updatedBy: 'user-2',
    updatedAt: '2024-03-08T16:45:00Z',
    tags: ['Data Breach', 'Security', 'Incident Response', 'Compliance'],
    metadata: {
      category: 'Security Policies',
      department: 'IT Security',
      priority: 'high',
      confidentiality: 'confidential',
      retentionPeriod: 2555,
      complianceRequirements: ['HIPAA', 'HITECH', 'State Breach Laws'],
      lastReviewedAt: '2024-02-20T00:00:00Z',
      nextReviewDate: '2024-08-20T00:00:00Z',
      fileSize: 8750,
      wordCount: 680,
      pageCount: 5,
    },
    collaborators: [
      {
        id: 'collab-3',
        documentId: 'doc-2',
        userId: 'user-2',
        role: 'owner',
        permissions: ['read', 'write', 'comment', 'approve', 'publish', 'archive', 'delete'],
        addedBy: 'user-2',
        addedAt: '2024-02-20T09:15:00Z',
        lastAccessedAt: '2024-03-08T16:45:00Z',
      },
      {
        id: 'collab-4',
        documentId: 'doc-2',
        userId: 'user-4',
        role: 'reviewer',
        permissions: ['read', 'comment'],
        addedBy: 'user-2',
        addedAt: '2024-02-25T10:00:00Z',
        lastAccessedAt: '2024-03-05T14:30:00Z',
      },
    ],
    workflow: {
      id: 'workflow-2',
      documentId: 'doc-2',
      currentStep: 2,
      totalSteps: 4,
      status: 'in_progress',
      steps: [
        {
          id: 'step-5',
          name: 'Draft Creation',
          description: 'Initial document creation',
          order: 1,
          status: 'completed',
          assignedTo: 'user-2',
          completedAt: '2024-02-20T09:15:00Z',
          required: true,
        },
        {
          id: 'step-6',
          name: 'Security Review',
          description: 'IT Security team review',
          order: 2,
          status: 'in_progress',
          assignedTo: 'user-4',
          dueDate: '2024-03-15T17:00:00Z',
          required: true,
        },
        {
          id: 'step-7',
          name: 'Legal Approval',
          description: 'Legal team approval',
          order: 3,
          status: 'pending',
          assignedTo: 'user-3',
          required: true,
        },
        {
          id: 'step-8',
          name: 'Publication',
          description: 'Final publication',
          order: 4,
          status: 'pending',
          assignedTo: 'user-2',
          required: true,
        },
      ],
    },
  },
  {
    id: 'doc-3',
    title: 'Employee Handbook - Privacy Section',
    content: `
      <h1>Employee Handbook - Privacy Section</h1>
      <h2>General Hospital</h2>
      <p><strong>Effective Date:</strong> March 1, 2024</p>
      
      <h3>1. Privacy Responsibilities</h3>
      <p>All employees must protect patient privacy and confidential information.</p>
      
      <h3>2. Access Controls</h3>
      <p>Access to patient information is restricted based on job responsibilities.</p>
      
      <h3>3. Reporting Violations</h3>
      <p>Report any privacy violations immediately to your supervisor or the privacy officer.</p>
    `,
    description: 'Employee privacy guidelines and responsibilities',
    organizationId: 'org-1',
    status: 'draft',
    version: 1,
    currentVersionId: 'version-1',
    createdBy: 'user-1',
    createdAt: '2024-03-05T11:20:00Z',
    updatedBy: 'user-1',
    updatedAt: '2024-03-05T11:20:00Z',
    tags: ['Employee Handbook', 'Privacy', 'Training', 'HR'],
    metadata: {
      category: 'HR Policies',
      department: 'Human Resources',
      priority: 'medium',
      confidentiality: 'internal',
      retentionPeriod: 1095, // 3 years
      complianceRequirements: ['HIPAA', 'Employment Law'],
      fileSize: 3200,
      wordCount: 250,
      pageCount: 3,
    },
    collaborators: [
      {
        id: 'collab-5',
        documentId: 'doc-3',
        userId: 'user-1',
        role: 'owner',
        permissions: ['read', 'write', 'comment', 'approve', 'publish', 'archive', 'delete'],
        addedBy: 'user-1',
        addedAt: '2024-03-05T11:20:00Z',
        lastAccessedAt: '2024-03-05T11:20:00Z',
      },
    ],
    workflow: {
      id: 'workflow-3',
      documentId: 'doc-3',
      currentStep: 1,
      totalSteps: 3,
      status: 'in_progress',
      steps: [
        {
          id: 'step-9',
          name: 'Draft Creation',
          description: 'Initial document creation',
          order: 1,
          status: 'in_progress',
          assignedTo: 'user-1',
          required: true,
        },
        {
          id: 'step-10',
          name: 'HR Review',
          description: 'Human Resources review',
          order: 2,
          status: 'pending',
          assignedTo: 'user-5',
          required: true,
        },
        {
          id: 'step-11',
          name: 'Publication',
          description: 'Final publication',
          order: 3,
          status: 'pending',
          assignedTo: 'user-1',
          required: true,
        },
      ],
    },
  },
]

// Mock data for document versions
const mockDocumentVersions: DocumentVersion[] = [
  {
    id: 'version-1',
    documentId: 'doc-1',
    version: 1,
    content: 'Initial version content...',
    changes: 'Initial document creation',
    createdBy: 'user-1',
    createdAt: '2024-01-15T10:30:00Z',
    isCurrent: false,
  },
  {
    id: 'version-2',
    documentId: 'doc-1',
    version: 2,
    content: 'Updated version content...',
    changes: 'Added new section on patient rights',
    createdBy: 'user-2',
    createdAt: '2024-02-15T14:20:00Z',
    isCurrent: false,
  },
  {
    id: 'version-3',
    documentId: 'doc-1',
    version: 3,
    content: 'Current version content...',
    changes: 'Final review and legal approval',
    createdBy: 'user-2',
    createdAt: '2024-03-10T14:22:00Z',
    isCurrent: true,
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const documentService = {
  // Get all documents
  async getDocuments(organizationId?: string): Promise<Document[]> {
    await delay(500)
    let documents = [...mockDocuments]

    if (organizationId) {
      documents = documents.filter(doc => doc.organizationId === organizationId)
    }

    return documents
  },

  // Get document by ID
  async getDocumentById(id: string): Promise<Document | null> {
    await delay(300)
    return mockDocuments.find(doc => doc.id === id) || null
  },

  // Get document with full details
  async getDocumentWithDetails(id: string): Promise<DocumentWithDetails | null> {
    await delay(400)
    const document = mockDocuments.find(doc => doc.id === id)
    if (!document) return null

    // Mock additional details
    return {
      ...document,
      organization: {
        id: document.organizationId,
        name: 'General Hospital',
        type: 'healthcare_facility',
        status: 'active',
        metadata: {},
        settings: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-10T00:00:00Z',
      },
      template: document.templateId
        ? {
            id: document.templateId,
            name: 'HIPAA Privacy Policy Template',
            description: 'Template for HIPAA privacy policies',
            categoryId: 'cat-1',
            content: 'Template content...',
            variables: {},
            status: 'published',
            createdBy: 'user-1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          }
        : undefined,
      currentVersion: mockDocumentVersions.find(v => v.id === document.currentVersionId) || {
        id: 'version-1',
        documentId: document.id,
        version: 1,
        content: document.content,
        changes: 'Initial version',
        createdBy: document.createdBy,
        createdAt: document.createdAt,
        isCurrent: true,
      },
      createdByUser: {
        id: document.createdBy,
        email: 'admin@generalhospital.com',
        first_name: 'Dr. Sarah',
        last_name: 'Johnson',
        department: 'Administration',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-03-10T00:00:00Z',
        failed_login_attempts: 0,
        last_login_at: '2024-03-10T00:00:00Z',
        is_active: true,
        avatar_url: null,
        phone: null,
        title: null,
        bio: null,
        timezone: 'America/Chicago',
        language: 'en',
        notification_preferences: {},
        organization_id: document.organizationId,
      },
      updatedByUser: document.updatedBy
        ? {
            id: document.updatedBy,
            email: 'compliance@generalhospital.com',
            first_name: 'Michael',
            last_name: 'Chen',
            department: 'Compliance',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-03-10T00:00:00Z',
            failed_login_attempts: 0,
            last_login_at: '2024-03-09T00:00:00Z',
            is_active: true,
            avatar_url: null,
            phone: null,
            title: null,
            bio: null,
            timezone: 'America/Chicago',
            language: 'en',
            notification_preferences: {},
            organization_id: document.organizationId,
          }
        : undefined,
      collaborators: document.collaborators.map(collab => ({
        ...collab,
        user: {
          id: collab.userId,
          email: `user${collab.userId}@generalhospital.com`,
          first_name: 'User',
          last_name: 'Name',
          department: 'General',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-03-10T00:00:00Z',
          failed_login_attempts: 0,
          last_login_at: '2024-03-10T00:00:00Z',
          is_active: true,
          avatar_url: null,
          phone: null,
          title: null,
          bio: null,
          timezone: 'America/Chicago',
          language: 'en',
          notification_preferences: {},
          organization_id: document.organizationId,
        },
      })),
    }
  },

  // Create new document
  async createDocument(
    document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'currentVersionId'>
  ): Promise<Document> {
    await delay(800)

    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      version: 1,
      currentVersionId: `version-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockDocuments.unshift(newDocument)
    return newDocument
  },

  // Update document
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    await delay(600)

    const index = mockDocuments.findIndex(doc => doc.id === id)
    if (index === -1) return null

    const updatedDocument = {
      ...mockDocuments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    mockDocuments[index] = updatedDocument
    return updatedDocument
  },

  // Delete document
  async deleteDocument(id: string): Promise<boolean> {
    await delay(400)

    const index = mockDocuments.findIndex(doc => doc.id === id)
    if (index === -1) return false

    mockDocuments.splice(index, 1)
    return true
  },

  // Search documents
  async searchDocuments(query: string, organizationId?: string): Promise<Document[]> {
    await delay(300)

    const lowercaseQuery = query.toLowerCase()
    let documents = mockDocuments

    if (organizationId) {
      documents = documents.filter(doc => doc.organizationId === organizationId)
    }

    return documents.filter(
      doc =>
        doc.title.toLowerCase().includes(lowercaseQuery) ||
        doc.description?.toLowerCase().includes(lowercaseQuery) ||
        doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        doc.content.toLowerCase().includes(lowercaseQuery)
    )
  },

  // Get documents by status
  async getDocumentsByStatus(status: DocumentStatus, organizationId?: string): Promise<Document[]> {
    await delay(300)
    let documents = mockDocuments.filter(doc => doc.status === status)

    if (organizationId) {
      documents = documents.filter(doc => doc.organizationId === organizationId)
    }

    return documents
  },

  // Get documents by template
  async getDocumentsByTemplate(templateId: string, organizationId?: string): Promise<Document[]> {
    await delay(300)
    let documents = mockDocuments.filter(doc => doc.templateId === templateId)

    if (organizationId) {
      documents = documents.filter(doc => doc.organizationId === organizationId)
    }

    return documents
  },

  // Update document status
  async updateDocumentStatus(
    id: string,
    status: DocumentStatus,
    userId: string
  ): Promise<Document | null> {
    await delay(500)

    const document = mockDocuments.find(doc => doc.id === id)
    if (!document) return null

    const updatedDocument = {
      ...document,
      status,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
    }

    if (status === 'published') {
      updatedDocument.publishedAt = new Date().toISOString()
    } else if (status === 'archived') {
      updatedDocument.archivedAt = new Date().toISOString()
    }

    const index = mockDocuments.findIndex(doc => doc.id === id)
    mockDocuments[index] = updatedDocument

    return updatedDocument
  },

  // Add collaborator
  async addCollaborator(
    documentId: string,
    userId: string,
    role: DocumentRole,
    permissions: DocumentPermission[],
    addedBy: string
  ): Promise<boolean> {
    await delay(500)

    const document = mockDocuments.find(doc => doc.id === documentId)
    if (!document) return false

    const newCollaborator: DocumentCollaborator = {
      id: `collab-${Date.now()}`,
      documentId,
      userId,
      role,
      permissions,
      addedBy,
      addedAt: new Date().toISOString(),
    }

    document.collaborators.push(newCollaborator)
    return true
  },

  // Remove collaborator
  async removeCollaborator(documentId: string, collaboratorId: string): Promise<boolean> {
    await delay(400)

    const document = mockDocuments.find(doc => doc.id === documentId)
    if (!document) return false

    const index = document.collaborators.findIndex(collab => collab.id === collaboratorId)
    if (index === -1) return false

    document.collaborators.splice(index, 1)
    return true
  },

  // Get document versions
  async getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    await delay(300)
    return mockDocumentVersions.filter(version => version.documentId === documentId)
  },

  // Create new version
  async createDocumentVersion(
    documentId: string,
    content: string,
    changes: string,
    createdBy: string
  ): Promise<DocumentVersion> {
    await delay(600)

    const document = mockDocuments.find(doc => doc.id === documentId)
    if (!document) throw new Error('Document not found')

    const newVersion: DocumentVersion = {
      id: `version-${Date.now()}`,
      documentId,
      version: document.version + 1,
      content,
      changes,
      createdBy,
      createdAt: new Date().toISOString(),
      isCurrent: true,
    }

    // Update previous versions to not be current
    mockDocumentVersions.forEach(version => {
      if (version.documentId === documentId) {
        version.isCurrent = false
      }
    })

    mockDocumentVersions.push(newVersion)

    // Update document
    document.version = newVersion.version
    document.currentVersionId = newVersion.id
    document.content = content
    document.updatedAt = new Date().toISOString()

    return newVersion
  },

  // Get document workflow
  async getDocumentWorkflow(documentId: string): Promise<DocumentWorkflow | null> {
    await delay(300)
    const document = mockDocuments.find(doc => doc.id === documentId)
    return document?.workflow || null
  },

  // Update workflow step
  async updateWorkflowStep(
    documentId: string,
    stepId: string,
    status: StepStatus,
    comments?: string,
    userId?: string
  ): Promise<boolean> {
    await delay(500)

    const document = mockDocuments.find(doc => doc.id === documentId)
    if (!document) return false

    const step = document.workflow.steps.find(s => s.id === stepId)
    if (!step) return false

    step.status = status
    if (comments) step.comments = comments
    if (status === 'completed') {
      step.completedAt = new Date().toISOString()
    }

    // Update workflow status
    const completedSteps = document.workflow.steps.filter(s => s.status === 'completed').length
    if (completedSteps === document.workflow.totalSteps) {
      document.workflow.status = 'completed'
      document.workflow.completedAt = new Date().toISOString()
    } else if (completedSteps > 0) {
      document.workflow.status = 'in_progress'
    }

    return true
  },
}
