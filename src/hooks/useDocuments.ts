import { useState, useEffect, useCallback } from 'react'
import { documentService } from '@/services/documentService'
import type {
  Document,
  DocumentWithDetails,
  DocumentVersion,
  DocumentCollaborator,
  DocumentWorkflow,
  DocumentStatus,
  DocumentRole,
  DocumentPermission,
  WorkflowStatus,
  StepStatus,
} from '@/types'

export function useDocuments(organizationId?: string) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load documents
  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await documentService.getDocuments(organizationId)
      setDocuments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents')
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  // Create document
  const createDocument = useCallback(
    async (
      document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'currentVersionId'>
    ) => {
      try {
        setError(null)
        const newDocument = await documentService.createDocument(document)
        setDocuments(prev => [newDocument, ...prev])
        return newDocument
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create document')
        throw err
      }
    },
    []
  )

  // Update document
  const updateDocument = useCallback(async (id: string, updates: Partial<Document>) => {
    try {
      setError(null)
      const updatedDocument = await documentService.updateDocument(id, updates)
      if (updatedDocument) {
        setDocuments(prev => prev.map(doc => (doc.id === id ? updatedDocument : doc)))
      }
      return updatedDocument
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document')
      throw err
    }
  }, [])

  // Delete document
  const deleteDocument = useCallback(async (id: string) => {
    try {
      setError(null)
      const success = await documentService.deleteDocument(id)
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document')
      throw err
    }
  }, [])

  // Search documents
  const searchDocuments = useCallback(
    async (query: string) => {
      try {
        setError(null)
        const results = await documentService.searchDocuments(query, organizationId)
        return results
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search documents')
        throw err
      }
    },
    [organizationId]
  )

  // Get documents by status
  const getDocumentsByStatus = useCallback(
    async (status: DocumentStatus) => {
      try {
        setError(null)
        const results = await documentService.getDocumentsByStatus(status, organizationId)
        return results
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get documents by status')
        throw err
      }
    },
    [organizationId]
  )

  // Get documents by template
  const getDocumentsByTemplate = useCallback(
    async (templateId: string) => {
      try {
        setError(null)
        const results = await documentService.getDocumentsByTemplate(templateId, organizationId)
        return results
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get documents by template')
        throw err
      }
    },
    [organizationId]
  )

  // Update document status
  const updateDocumentStatus = useCallback(
    async (id: string, status: DocumentStatus, userId: string) => {
      try {
        setError(null)
        const updatedDocument = await documentService.updateDocumentStatus(id, status, userId)
        if (updatedDocument) {
          setDocuments(prev => prev.map(doc => (doc.id === id ? updatedDocument : doc)))
        }
        return updatedDocument
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update document status')
        throw err
      }
    },
    []
  )

  // Load documents on mount
  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  return {
    documents,
    isLoading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    getDocumentsByStatus,
    getDocumentsByTemplate,
    updateDocumentStatus,
    refreshDocuments: loadDocuments,
  }
}

export function useDocumentDetail(documentId: string) {
  const [document, setDocument] = useState<DocumentWithDetails | null>(null)
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [workflow, setWorkflow] = useState<DocumentWorkflow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load document details
  const loadDocumentDetails = useCallback(async () => {
    if (!documentId) return

    try {
      setIsLoading(true)
      setError(null)

      const [docData, versionsData, workflowData] = await Promise.all([
        documentService.getDocumentWithDetails(documentId),
        documentService.getDocumentVersions(documentId),
        documentService.getDocumentWorkflow(documentId),
      ])

      setDocument(docData)
      setVersions(versionsData)
      setWorkflow(workflowData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document details')
    } finally {
      setIsLoading(false)
    }
  }, [documentId])

  // Update document
  const updateDocument = useCallback(
    async (updates: Partial<Document>) => {
      if (!documentId) return

      try {
        setError(null)
        const updatedDocument = await documentService.updateDocument(documentId, updates)
        if (updatedDocument) {
          // Reload document details
          await loadDocumentDetails()
        }
        return updatedDocument
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update document')
        throw err
      }
    },
    [documentId, loadDocumentDetails]
  )

  // Create new version
  const createVersion = useCallback(
    async (content: string, changes: string, createdBy: string) => {
      if (!documentId) return

      try {
        setError(null)
        const newVersion = await documentService.createDocumentVersion(
          documentId,
          content,
          changes,
          createdBy
        )

        // Reload versions and document details
        await Promise.all([
          documentService.getDocumentVersions(documentId).then(setVersions),
          loadDocumentDetails(),
        ])

        return newVersion
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create document version')
        throw err
      }
    },
    [documentId, loadDocumentDetails]
  )

  // Add collaborator
  const addCollaborator = useCallback(
    async (
      userId: string,
      role: DocumentRole,
      permissions: DocumentPermission[],
      addedBy: string
    ) => {
      if (!documentId) return

      try {
        setError(null)
        const success = await documentService.addCollaborator(
          documentId,
          userId,
          role,
          permissions,
          addedBy
        )
        if (success) {
          // Reload document details
          await loadDocumentDetails()
        }
        return success
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add collaborator')
        throw err
      }
    },
    [documentId, loadDocumentDetails]
  )

  // Remove collaborator
  const removeCollaborator = useCallback(
    async (collaboratorId: string) => {
      if (!documentId) return

      try {
        setError(null)
        const success = await documentService.removeCollaborator(documentId, collaboratorId)
        if (success) {
          // Reload document details
          await loadDocumentDetails()
        }
        return success
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove collaborator')
        throw err
      }
    },
    [documentId, loadDocumentDetails]
  )

  // Update workflow step
  const updateWorkflowStep = useCallback(
    async (stepId: string, status: StepStatus, comments?: string, userId?: string) => {
      if (!documentId) return

      try {
        setError(null)
        const success = await documentService.updateWorkflowStep(
          documentId,
          stepId,
          status,
          comments,
          userId
        )
        if (success) {
          // Reload workflow and document details
          await Promise.all([
            documentService.getDocumentWorkflow(documentId).then(setWorkflow),
            loadDocumentDetails(),
          ])
        }
        return success
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update workflow step')
        throw err
      }
    },
    [documentId, loadDocumentDetails]
  )

  // Update document status
  const updateDocumentStatus = useCallback(
    async (status: DocumentStatus, userId: string) => {
      if (!documentId) return

      try {
        setError(null)
        const updatedDocument = await documentService.updateDocumentStatus(
          documentId,
          status,
          userId
        )
        if (updatedDocument) {
          // Reload document details
          await loadDocumentDetails()
        }
        return updatedDocument
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update document status')
        throw err
      }
    },
    [documentId, loadDocumentDetails]
  )

  // Load document details on mount
  useEffect(() => {
    loadDocumentDetails()
  }, [loadDocumentDetails])

  return {
    document,
    versions,
    workflow,
    isLoading,
    error,
    updateDocument,
    createVersion,
    addCollaborator,
    removeCollaborator,
    updateWorkflowStep,
    updateDocumentStatus,
    refreshDocumentDetails: loadDocumentDetails,
  }
}
