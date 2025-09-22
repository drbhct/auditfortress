export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activity_logs_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          settings: Json | null
          status: Database['public']['Enums']['organization_status'] | null
          type: Database['public']['Enums']['organization_type']
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          settings?: Json | null
          status?: Database['public']['Enums']['organization_status'] | null
          type: Database['public']['Enums']['organization_type']
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          settings?: Json | null
          status?: Database['public']['Enums']['organization_status'] | null
          type?: Database['public']['Enums']['organization_type']
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          failed_login_attempts: number | null
          first_name: string | null
          force_password_change: boolean | null
          id: string
          is_superadmin: boolean | null
          job_title: string | null
          last_login_at: string | null
          last_login_ip: unknown | null
          last_name: string | null
          last_password_change: string | null
          locked_until: string | null
          login_count: number | null
          metadata: Json | null
          organization_id: string | null
          phone: string | null
          preferred_language: string | null
          status: Database['public']['Enums']['user_status'] | null
          theme: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          failed_login_attempts?: number | null
          first_name?: string | null
          force_password_change?: boolean | null
          id: string
          is_superadmin?: boolean | null
          job_title?: string | null
          last_login_at?: string | null
          last_login_ip?: unknown | null
          last_name?: string | null
          last_password_change?: string | null
          locked_until?: string | null
          login_count?: number | null
          metadata?: Json | null
          organization_id?: string | null
          phone?: string | null
          preferred_language?: string | null
          status?: Database['public']['Enums']['user_status'] | null
          theme?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          failed_login_attempts?: number | null
          first_name?: string | null
          force_password_change?: boolean | null
          id?: string
          is_superadmin?: boolean | null
          job_title?: string | null
          last_login_at?: string | null
          last_login_ip?: unknown | null
          last_name?: string | null
          last_password_change?: string | null
          locked_until?: string | null
          login_count?: number | null
          metadata?: Json | null
          organization_id?: string | null
          phone?: string | null
          preferred_language?: string | null
          status?: Database['public']['Enums']['user_status'] | null
          theme?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          organization_id: string | null
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          organization_id?: string | null
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          organization_id?: string | null
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'roles_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          organization_id: string | null
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          organization_id?: string | null
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          organization_id?: string | null
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user_roles_assigned_by_fkey'
            columns: ['assigned_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_roles_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_roles_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_ticket_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_feature_enabled: {
        Args: { feature_key: string; user_id: string }
        Returns: boolean
      }
      log_profile_activity: {
        Args: {
          p_activity_type: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      document_status: 'draft' | 'review' | 'approved' | 'published' | 'archived'
      organization_status: 'active' | 'trial' | 'suspended' | 'cancelled'
      organization_type: 'healthcare_facility' | 'emr_software' | 'third_party_services'
      template_category:
        | 'privacy_policies'
        | 'patient_rights'
        | 'breach_procedures'
        | 'training_materials'
        | 'security_standards'
        | 'service_agreements'
        | 'business_associate'
        | 'incident_response'
      user_status: 'active' | 'inactive' | 'pending' | 'locked'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

// Helper types for common use cases
export type Profile = Tables<'profiles'>
export type Organization = Tables<'organizations'>
export type Role = Tables<'roles'>
export type UserRole = Tables<'user_roles'>

export type UserStatus = Enums<'user_status'>
export type OrganizationStatus = Enums<'organization_status'>
export type OrganizationType = Enums<'organization_type'>
