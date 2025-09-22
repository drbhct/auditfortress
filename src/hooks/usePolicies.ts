import { useState, useEffect, useCallback } from 'react'
import { policyService } from '@/services/policyService'
import type { GeneratedPolicy } from '@/types'

export function usePolicies() {
  const [policies, setPolicies] = useState<GeneratedPolicy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load policies
  const loadPolicies = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await policyService.getPolicies()
      setPolicies(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load policies')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Create policy
  const createPolicy = useCallback(
    async (policy: Omit<GeneratedPolicy, 'id' | 'generatedAt' | 'generatedBy'>) => {
      try {
        setError(null)
        const newPolicy = await policyService.createPolicy(policy)
        setPolicies(prev => [newPolicy, ...prev])
        return newPolicy
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create policy')
        throw err
      }
    },
    []
  )

  // Update policy
  const updatePolicy = useCallback(async (id: string, updates: Partial<GeneratedPolicy>) => {
    try {
      setError(null)
      const updatedPolicy = await policyService.updatePolicy(id, updates)
      if (updatedPolicy) {
        setPolicies(prev => prev.map(policy => (policy.id === id ? updatedPolicy : policy)))
      }
      return updatedPolicy
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update policy')
      throw err
    }
  }, [])

  // Delete policy
  const deletePolicy = useCallback(async (id: string) => {
    try {
      setError(null)
      const success = await policyService.deletePolicy(id)
      if (success) {
        setPolicies(prev => prev.filter(policy => policy.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete policy')
      throw err
    }
  }, [])

  // Search policies
  const searchPolicies = useCallback(async (query: string) => {
    try {
      setError(null)
      const results = await policyService.searchPolicies(query)
      return results
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search policies')
      throw err
    }
  }, [])

  // Get policy by ID
  const getPolicyById = useCallback(async (id: string) => {
    try {
      setError(null)
      const policy = await policyService.getPolicyById(id)
      return policy
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get policy')
      throw err
    }
  }, [])

  // Get policies by template
  const getPoliciesByTemplate = useCallback(async (templateId: string) => {
    try {
      setError(null)
      const templatePolicies = await policyService.getPoliciesByTemplate(templateId)
      return templatePolicies
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get template policies')
      throw err
    }
  }, [])

  // Load policies on mount
  useEffect(() => {
    loadPolicies()
  }, [loadPolicies])

  return {
    policies,
    isLoading,
    error,
    createPolicy,
    updatePolicy,
    deletePolicy,
    searchPolicies,
    getPolicyById,
    getPoliciesByTemplate,
    refreshPolicies: loadPolicies,
  }
}
