import { useState, useEffect, useCallback } from 'react'
import { organizationService } from '@/services/organizationService'
import type { Organization, ActivityLog } from '@/types'

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load organizations
  const loadOrganizations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await organizationService.getOrganizations()
      setOrganizations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organizations')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Create organization
  const createOrganization = useCallback(
    async (organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        setError(null)
        const newOrganization = await organizationService.createOrganization(organization)
        setOrganizations(prev => [...prev, newOrganization])
        return newOrganization
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create organization')
        throw err
      }
    },
    []
  )

  // Update organization
  const updateOrganization = useCallback(async (id: string, updates: Partial<Organization>) => {
    try {
      setError(null)
      const updatedOrganization = await organizationService.updateOrganization(id, updates)
      if (updatedOrganization) {
        setOrganizations(prev => prev.map(org => (org.id === id ? updatedOrganization : org)))
      }
      return updatedOrganization
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization')
      throw err
    }
  }, [])

  // Delete organization
  const deleteOrganization = useCallback(async (id: string) => {
    try {
      setError(null)
      const success = await organizationService.deleteOrganization(id)
      if (success) {
        setOrganizations(prev => prev.filter(org => org.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organization')
      throw err
    }
  }, [])

  // Search organizations
  const searchOrganizations = useCallback(async (query: string) => {
    try {
      setError(null)
      const results = await organizationService.searchOrganizations(query)
      return results
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search organizations')
      throw err
    }
  }, [])

  // Get organization by ID
  const getOrganizationById = useCallback(async (id: string) => {
    try {
      setError(null)
      const organization = await organizationService.getOrganizationById(id)
      return organization
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get organization')
      throw err
    }
  }, [])

  // Load organizations on mount
  useEffect(() => {
    loadOrganizations()
  }, [loadOrganizations])

  return {
    organizations,
    isLoading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    searchOrganizations,
    getOrganizationById,
    refreshOrganizations: loadOrganizations,
  }
}

export function useOrganizationDetail(organizationId: string) {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [stats, setStats] = useState<any>(null)
  const [billing, setBilling] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load organization details
  const loadOrganizationDetails = useCallback(async () => {
    if (!organizationId) return

    try {
      setIsLoading(true)
      setError(null)

      const [orgData, membersData, activityData, statsData, billingData] = await Promise.all([
        organizationService.getOrganizationById(organizationId),
        organizationService.getOrganizationMembers(organizationId),
        organizationService.getOrganizationActivity(organizationId),
        organizationService.getOrganizationStats(organizationId),
        organizationService.getOrganizationBilling(organizationId),
      ])

      setOrganization(orgData)
      setMembers(membersData)
      setActivity(activityData)
      setStats(statsData)
      setBilling(billingData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organization details')
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  // Update organization
  const updateOrganization = useCallback(
    async (updates: Partial<Organization>) => {
      if (!organizationId) return

      try {
        setError(null)
        const updatedOrganization = await organizationService.updateOrganization(
          organizationId,
          updates
        )
        if (updatedOrganization) {
          setOrganization(updatedOrganization)
        }
        return updatedOrganization
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update organization')
        throw err
      }
    },
    [organizationId]
  )

  // Add member
  const addMember = useCallback(
    async (userId: string, role: string, department?: string) => {
      if (!organizationId) return

      try {
        setError(null)
        const success = await organizationService.addMember(
          organizationId,
          userId,
          role,
          department
        )
        if (success) {
          // Reload members
          const membersData = await organizationService.getOrganizationMembers(organizationId)
          setMembers(membersData)
        }
        return success
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add member')
        throw err
      }
    },
    [organizationId]
  )

  // Update member role
  const updateMemberRole = useCallback(
    async (memberId: string, role: string, department?: string) => {
      try {
        setError(null)
        const success = await organizationService.updateMemberRole(memberId, role, department)
        if (success) {
          // Reload members
          const membersData = await organizationService.getOrganizationMembers(organizationId)
          setMembers(membersData)
        }
        return success
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update member role')
        throw err
      }
    },
    [organizationId]
  )

  // Remove member
  const removeMember = useCallback(async (memberId: string) => {
    try {
      setError(null)
      const success = await organizationService.removeMember(memberId)
      if (success) {
        setMembers(prev => prev.filter(member => member.id !== memberId))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member')
      throw err
    }
  }, [])

  // Load organization details on mount
  useEffect(() => {
    loadOrganizationDetails()
  }, [loadOrganizationDetails])

  return {
    organization,
    members,
    activity,
    stats,
    billing,
    isLoading,
    error,
    updateOrganization,
    addMember,
    updateMemberRole,
    removeMember,
    refreshOrganizationDetails: loadOrganizationDetails,
  }
}
