import { supabase } from '@/lib/supabaseClient'

export interface DevUserProfile {
  id: string
  organization_id: string | null
  first_name: string
  last_name: string
  email: string
  job_title: string | null
  department: string | null
  phone: string | null
  status: string
  is_superadmin: boolean
  metadata: any
  created_at: string
  updated_at: string
}

/**
 * Service for managing development user switching
 * This allows switching between real database users for testing
 */
export class DevUserService {
  /**
   * Get a specific user profile by ID
   */
  static async getUserProfile(profileId: string): Promise<DevUserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          organization_id,
          first_name,
          last_name,
          email,
          job_title,
          department,
          phone,
          status,
          is_superadmin,
          metadata,
          created_at,
          updated_at,
          organization:organizations(
            id,
            name,
            type,
            status
          )
        `)
        .eq('id', profileId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      // Get user roles separately to avoid relationship issues
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select(`
          role:roles(
            id,
            name,
            description,
            permissions
          )
        `)
        .eq('user_id', profileId)

      // Add roles to the profile
      const profileWithRoles = {
        ...data,
        user_roles: userRoles || []
      }

      return profileWithRoles
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  }

  /**
   * Get all test users for the role switcher
   */
  static async getTestUsers(): Promise<DevUserProfile[]> {
    try {
      const testUserIds = [
        'bd81df73-1ef6-4e71-9ef5-5b5ddd94ebcb', // SuperAdmin
        '5b48afeb-a131-4b27-a7a5-f7baa8a94d59', // Account Owner
        '2a84b3d8-1c81-4627-90d5-a41231e96452', // Compliance Officer
        '60e2a4b2-0804-48a8-8254-09951e189ba1', // Team Member
      ]

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          organization_id,
          first_name,
          last_name,
          email,
          job_title,
          department,
          phone,
          status,
          is_superadmin,
          metadata,
          created_at,
          updated_at
        `)
        .in('id', testUserIds)
        .order('is_superadmin', { ascending: false })

      if (error) {
        console.error('Error fetching test users:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getTestUsers:', error)
      return []
    }
  }

  /**
   * Simulate switching to a different user by storing their profile
   * This is for development testing only
   */
  static switchToUser(profileId: string): void {
    localStorage.setItem('dev-impersonated-user-id', profileId)
    
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('dev-user-switched', { 
      detail: { profileId } 
    }))
    
    console.log(`🔄 Dev Mode: Switched to user ${profileId}`)
  }

  /**
   * Get the currently impersonated user ID
   */
  static getCurrentImpersonatedUserId(): string | null {
    return localStorage.getItem('dev-impersonated-user-id')
  }

  /**
   * Clear user impersonation (return to original user)
   */
  static clearImpersonation(): void {
    localStorage.removeItem('dev-impersonated-user-id')
    
    window.dispatchEvent(new CustomEvent('dev-user-switched', { 
      detail: { profileId: null } 
    }))
    
    console.log('🔄 Dev Mode: Cleared user impersonation')
  }
}
