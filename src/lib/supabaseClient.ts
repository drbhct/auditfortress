import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.',
  )
}

// Create a singleton Supabase client to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: {
          'X-Client-Info': 'auditfortress-react@1.0.0',
        },
      },
    })
  }
  return supabaseInstance
})()

// Helper function to get the current user's profile
export const getCurrentUserProfile = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error('Error getting user:', userError)
      return null
    }

    if (!user) {
      return null
    }

    // Get the basic profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    // Return the basic profile - we'll add organization and roles later
    return {
      ...profile,
      organization: null,
      user_roles: [],
    }
  } catch (error) {
    console.error('Unexpected error in getCurrentUserProfile:', error)
    return null
  }
}

// Helper function to update login tracking
export const updateLoginTracking = async (userId: string, ipAddress?: string) => {
  const updates = {
    last_login_at: new Date().toISOString(),
    last_login_ip: ipAddress,
    login_count: 1, // This will be incremented by a database trigger
    failed_login_attempts: 0,
  }

  const { error } = await supabase.from('profiles').update(updates).eq('id', userId)

  if (error) {
    console.error('Error updating login tracking:', error)
  }
}

// Helper function to log profile activity
export const logProfileActivity = async (
  userId: string,
  activityType: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string,
) => {
  const { error } = await supabase.rpc('log_profile_activity', {
    p_user_id: userId,
    p_activity_type: activityType,
    p_details: details,
    p_ip_address: ipAddress,
    p_user_agent: userAgent,
  })

  if (error) {
    console.error('Error logging profile activity:', error)
  }
}

export default supabase
