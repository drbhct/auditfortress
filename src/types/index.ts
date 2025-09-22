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
