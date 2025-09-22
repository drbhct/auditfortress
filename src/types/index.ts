import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Profile, Organization, Role, OrganizationType } from './supabase'

// Extended user type combining Supabase auth user with profile data
export interface User extends SupabaseUser {
  profile?: Profile
  organization?: Organization
  roles?: Role[]
}

// Authentication state
export interface AuthState {
  user: User | null
  profile: Profile | null
  organization: Organization | null
  roles: Role[]
  isLoading: boolean
  isAuthenticated: boolean
  isSuperAdmin: boolean
}

// Permission types
export type Permission =
  | 'read:documents'
  | 'write:documents'
  | 'delete:documents'
  | 'manage:templates'
  | 'create:templates'
  | 'edit:templates'
  | 'delete:templates'
  | 'manage:users'
  | 'invite:users'
  | 'edit:users'
  | 'delete:users'
  | 'manage:organization'
  | 'edit:organization'
  | 'view:organization_analytics'
  | 'view:analytics'
  | 'view:system_analytics'
  | 'manage:system'
  | 'manage:system_settings'
  | 'manage:feature_flags'
  | 'view:system_logs'
  | 'superadmin:all'

export interface RolePermissions {
  roleId: string
  roleName: string
  permissions: Permission[]
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends LoginCredentials {
  firstName: string
  lastName: string
  organizationName?: string
  organizationType?: OrganizationType
}

// UI State types
export interface LoadingState {
  [key: string]: boolean
}

export interface ErrorState {
  [key: string]: string | null
}

// Template System Types
export interface TemplateCategory {
  id: string
  name: string
  description?: string
  parentCategoryId?: string
  organizationTypes: OrganizationType[]
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PolicyTemplate {
  id: string
  name: string
  description?: string
  categoryId: string
  content: string // HTML with {{variable}} placeholders
  variables: Record<string, any>
  status: 'draft' | 'published' | 'archived'
  createdBy: string
  createdAt: string
  updatedBy?: string
  updatedAt: string
}

export interface TemplateWithCategory extends PolicyTemplate {
  category: TemplateCategory
}

// Generated Policy Types
export interface GeneratedPolicy {
  id: string
  templateId: string
  title: string
  content: string
  variables: Record<string, string>
  generatedAt: string
  generatedBy: string
  templateName?: string
  templateCategory?: string
}

// Document Management Types
export interface Document {
  id: string
  title: string
  content: string // HTML content
  description?: string
  organizationId: string
  templateId?: string
  status: DocumentStatus
  version: number
  currentVersionId: string
  createdBy: string
  createdAt: string
  updatedBy?: string
  updatedAt: string
  publishedAt?: string
  archivedAt?: string
  tags: string[]
  metadata: DocumentMetadata
  collaborators: DocumentCollaborator[]
  workflow: DocumentWorkflow
}

export interface DocumentVersion {
  id: string
  documentId: string
  version: number
  content: string
  changes: string
  createdBy: string
  createdAt: string
  isCurrent: boolean
}

export interface DocumentCollaborator {
  id: string
  documentId: string
  userId: string
  role: DocumentRole
  permissions: DocumentPermission[]
  addedBy: string
  addedAt: string
  lastAccessedAt?: string
}

export interface DocumentWorkflow {
  id: string
  documentId: string
  currentStep: number
  totalSteps: number
  status: WorkflowStatus
  steps: WorkflowStep[]
  assignedTo?: string
  dueDate?: string
  completedAt?: string
}

export interface WorkflowStep {
  id: string
  name: string
  description: string
  order: number
  status: StepStatus
  assignedTo?: string
  dueDate?: string
  completedAt?: string
  comments?: string
  required: boolean
}

export interface DocumentMetadata {
  category?: string
  department?: string
  priority: DocumentPriority
  confidentiality: ConfidentialityLevel
  retentionPeriod?: number // in days
  complianceRequirements: string[]
  lastReviewedAt?: string
  nextReviewDate?: string
  fileSize: number
  wordCount: number
  pageCount: number
}

export type DocumentStatus =
  | 'draft'
  | 'in_review'
  | 'pending_approval'
  | 'approved'
  | 'published'
  | 'archived'
  | 'rejected'

export type DocumentRole = 'owner' | 'editor' | 'reviewer' | 'viewer'

export type DocumentPermission =
  | 'read'
  | 'write'
  | 'comment'
  | 'approve'
  | 'publish'
  | 'archive'
  | 'delete'

export type WorkflowStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'rejected'

export type DocumentPriority = 'low' | 'medium' | 'high' | 'urgent'

export type ConfidentialityLevel = 'public' | 'internal' | 'confidential' | 'restricted'

export interface DocumentWithDetails extends Document {
  organization: Organization
  template?: PolicyTemplate
  currentVersion: DocumentVersion
  createdByUser: Profile
  updatedByUser?: Profile
  collaborators: (DocumentCollaborator & { user: Profile })[]
}

// Analytics Types
export interface ActivityItem {
  id: string
  type: 'document' | 'user' | 'system' | 'compliance' | 'alert'
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  status?: 'completed' | 'pending' | 'failed' | 'warning'
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ComplianceItem {
  id: string
  title: string
  description: string
  status: 'compliant' | 'non_compliant' | 'pending' | 'warning'
  lastChecked: string
  nextReview: string
  progress?: number
  requirements?: string[]
  issues?: string[]
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

export interface DashboardMetrics {
  documents: {
    total: number
    thisMonth: number
    lastMonth: number
    change: number
    byStatus: Record<string, number>
    byCategory: Record<string, number>
  }
  users: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
    change: number
  }
  compliance: {
    overallScore: number
    compliantItems: number
    nonCompliantItems: number
    pendingItems: number
    warningItems: number
    change: number
  }
  performance: {
    averageLoadTime: number
    uptime: number
    errorRate: number
  }
}

// Export all Supabase types for convenience
export type {
  Profile,
  Organization,
  Role,
  UserRole,
  UserStatus,
  OrganizationStatus,
  OrganizationType,
} from './supabase'
