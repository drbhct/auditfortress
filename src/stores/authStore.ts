import type { User as SupabaseUser } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  supabase,
  getCurrentUserProfile,
  updateLoginTracking,
  logProfileActivity,
} from '@/lib/supabaseClient'
import { RateLimiter, SecurityValidator, initializeSecurity } from '@/utils/security'
import { handleError } from '@/utils/errorHandler'
import type { AuthState, Profile, Organization, Role, LoginCredentials } from '@/types'

interface AuthActions {
  // Authentication actions
  signIn: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  signUp: (
    credentials: LoginCredentials & { firstName: string; lastName: string }
  ) => Promise<{ success: boolean; error?: string }>

  // State management
  setUser: (user: SupabaseUser | null) => void
  setProfile: (profile: Profile | null) => void
  setOrganization: (organization: Organization | null) => void
  setRoles: (roles: Role[]) => void
  setLoading: (loading: boolean) => void

  // Profile management
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>
  refreshUserData: () => Promise<void>

  // Permission checking
  hasPermission: (permission: string) => boolean
  hasRole: (roleName: string) => boolean

  // Reset state
  reset: () => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  profile: null,
  organization: null,
  roles: [],
  isLoading: true,
  isAuthenticated: false,
  isSuperAdmin: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Authentication actions
      signIn: async (credentials: LoginCredentials) => {
        set({ isLoading: true })

        try {
          // Rate limiting check
          const rateLimitCheck = RateLimiter.checkLoginAttempts(credentials.email)
          if (!rateLimitCheck.allowed) {
            const lockoutMinutes = Math.ceil((rateLimitCheck.lockoutTime || 0) / 60000)
            set({ isLoading: false })
            return {
              success: false,
              error: `Too many failed attempts. Please try again in ${lockoutMinutes} minute(s).`,
            }
          }

          // Security validation
          const clientIP = SecurityValidator.getClientIP()
          const userAgent = navigator.userAgent

          if (SecurityValidator.isSuspiciousRequest(userAgent, clientIP)) {
            set({ isLoading: false })
            return {
              success: false,
              error: 'Access denied due to security policy.',
            }
          }

          console.log('Attempting to sign in with:', { email: credentials.email })

          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          console.log('Sign in response:', { data, error })

          if (error) {
            console.error('Sign in error:', error)

            // Record failed attempt
            RateLimiter.recordLoginAttempt(credentials.email, false)

            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          if (data.user) {
            // Record successful attempt
            RateLimiter.recordLoginAttempt(credentials.email, true)

            // Update login tracking with IP
            await updateLoginTracking(data.user.id, clientIP)

            // Log login activity with security context
            await logProfileActivity(data.user.id, 'login', {
              method: 'email_password',
              ip: clientIP,
              userAgent: userAgent,
            })

            // Fetch and set user profile data
            await get().refreshUserData()
          }

          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          // Record failed attempt
          RateLimiter.recordLoginAttempt(credentials.email, false)

          set({ isLoading: false })

          // Use error handler for consistent error reporting
          const apiError = await handleError(error, {
            action: 'sign_in',
            component: 'authStore',
          })

          return {
            success: false,
            error: apiError.message,
          }
        }
      },

      signOut: async () => {
        set({ isLoading: true })

        try {
          const { user } = get()

          if (user) {
            // Log logout activity
            await logProfileActivity(user.id, 'logout', { method: 'manual' })
          }

          await supabase.auth.signOut()
          get().reset()
        } catch (error) {
          console.error('Error during sign out:', error)
          get().reset() // Reset state even if logout fails
        }
      },

      signUp: async credentials => {
        set({ isLoading: true })

        try {
          console.log('Attempting to sign up with:', {
            email: credentials.email,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
          })

          const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              data: {
                first_name: credentials.firstName,
                last_name: credentials.lastName,
              },
            },
          })

          console.log('Sign up response:', { data, error })

          if (error) {
            console.error('Sign up error:', error)
            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          if (data.user) {
            // Profile will be created automatically by database trigger
            // Log signup activity (only if user is confirmed)
            if (data.user.email_confirmed_at) {
              await logProfileActivity(data.user.id, 'signup', { method: 'email_password' })
            }
          }

          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          console.error('Unexpected signup error:', error)
          set({ isLoading: false })
          return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
          }
        }
      },

      // State management
      setUser: user => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },

      setProfile: profile => {
        set({
          profile,
          isSuperAdmin: profile?.is_superadmin || false,
        })
      },

      setOrganization: organization => {
        set({ organization })
      },

      setRoles: roles => {
        set({ roles })
      },

      setLoading: isLoading => {
        set({ isLoading })
      },

      // Profile management
      updateProfile: async updates => {
        const { user } = get()
        if (!user) {
          return { success: false, error: 'No authenticated user' }
        }

        try {
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

          if (error) {
            return { success: false, error: error.message }
          }

          set({ profile: data })

          // Log profile update activity
          await logProfileActivity(user.id, 'profile_update', {
            updated_fields: Object.keys(updates),
          })

          return { success: true }
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
          }
        }
      },

      refreshUserData: async () => {
        try {
          const profileData = await getCurrentUserProfile()

          if (profileData) {
            set({
              profile: profileData,
              organization: profileData.organization || null,
              roles: (profileData.user_roles?.map(ur => ur.role).filter(Boolean) as Role[]) || [],
              isSuperAdmin: profileData.is_superadmin || false,
            })
          }
        } catch (error) {
          console.error('Error refreshing user data:', error)
        }
      },

      // Permission checking
      hasPermission: (permission: string) => {
        const { isSuperAdmin, roles } = get()

        // SuperAdmins have all permissions
        if (isSuperAdmin) return true

        // Check role permissions
        return roles.some(role => {
          const permissions = (role.permissions as string[]) || []
          return permissions.includes(permission)
        })
      },

      hasRole: (roleName: string) => {
        const { roles } = get()
        return roles.some(role => role.name === roleName)
      },

      // Reset state
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        // Only persist essential data, not sensitive information
        user: state.user ? { id: state.user.id, email: state.user.email } : null,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Flag to prevent multiple initializations
let isInitializing = false
let isInitialized = false

// Initialize auth state on app start
export const initializeAuth = async () => {
  if (isInitializing || isInitialized) {
    console.log('Auth already initializing or initialized, skipping...')
    return
  }

  isInitializing = true

  try {
    console.log('Initializing auth...')
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (session?.user) {
      console.log('User found in session:', session.user.email)
      useAuthStore.getState().setUser(session.user)
      await useAuthStore.getState().refreshUserData()
    } else {
      console.log('No user session found')
    }

    console.log('Auth initialization complete')
    useAuthStore.getState().setLoading(false)
    isInitialized = true
  } catch (error) {
    console.error('Error initializing auth:', error)
    useAuthStore.getState().setLoading(false)
  } finally {
    isInitializing = false
  }
}

// Simplified auth listener - only handle sign out for now
let authListenerSetup = false
if (!authListenerSetup) {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state change:', event)

    // Only handle sign out to avoid conflicts with initialization
    if (event === 'SIGNED_OUT') {
      useAuthStore.getState().reset()
    }
  })
  authListenerSetup = true
}
