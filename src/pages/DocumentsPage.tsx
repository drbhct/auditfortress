import React, { useState } from 'react'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { AppButton } from '@/components/ui/AppButton'
import {
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { DocumentList, DocumentEditor } from '@/components/documents'
import { useDocuments } from '@/hooks/useDocuments'
import type { Document } from '@/types'

export const DocumentsPage: React.FC = () => {
  const [isCreatingDocument, setIsCreatingDocument] = useState(false)
  const [isViewingDocument, setIsViewingDocument] = useState(false)
  const [isEditingDocument, setIsEditingDocument] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Use the documents hook
  const {
    documents,
    isLoading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    updateDocumentStatus,
  } = useDocuments()

  // Handle document actions
  const handleCreateDocument = async (documentData: Partial<Document>) => {
    try {
      await createDocument({
        title: documentData.title || 'Untitled Document',
        description: documentData.description || '',
        organizationId: 'org-1', // This would come from user context
        status: documentData.status || 'draft',
        tags: documentData.tags || [],
        metadata: {
          category: documentData.metadata?.category || '',
          department: documentData.metadata?.department || '',
          priority: documentData.metadata?.priority || 'medium',
          confidentiality: documentData.metadata?.confidentiality || 'internal',
          complianceRequirements: documentData.metadata?.complianceRequirements || [],
          fileSize: documentData.metadata?.fileSize || 0,
          wordCount: documentData.metadata?.wordCount || 0,
          pageCount: documentData.metadata?.pageCount || 0,
        },
        content: documentData.content || '',
        version: 1,
        currentVersionId: `version-${Date.now()}`,
        collaborators: [],
        workflow: {
          id: `workflow-${Date.now()}`,
          documentId: '',
          currentStep: 1,
          totalSteps: 3,
          status: 'not_started',
          steps: [
            {
              id: `step-1-${Date.now()}`,
              name: 'Draft Creation',
              description: 'Initial document creation',
              order: 1,
              status: 'in_progress',
              required: true,
            },
            {
              id: `step-2-${Date.now()}`,
              name: 'Review',
              description: 'Document review',
              order: 2,
              status: 'pending',
              required: true,
            },
            {
              id: `step-3-${Date.now()}`,
              name: 'Approval',
              description: 'Final approval',
              order: 3,
              status: 'pending',
              required: true,
            },
          ],
        },
      })
      setIsCreatingDocument(false)
    } catch (error) {
      console.error('Failed to create document:', error)
    }
  }

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsEditingDocument(true)
  }

  const handleUpdateDocument = async (documentData: Partial<Document>) => {
    if (!selectedDocument) return

    try {
      await updateDocument(selectedDocument.id, documentData)
      setIsEditingDocument(false)
      setSelectedDocument(null)
    } catch (error) {
      console.error('Failed to update document:', error)
    }
  }

  const handleDeleteDocument = async (document: Document) => {
    if (window.confirm(`Are you sure you want to delete "${document.title}"?`)) {
      try {
        await deleteDocument(document.id)
      } catch (error) {
        console.error('Failed to delete document:', error)
      }
    }
  }

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsViewingDocument(true)
  }

  const handleShareDocument = (document: Document) => {
    // TODO: Implement document sharing
    console.log('Share document:', document.id)
  }

  const handleCloseModals = () => {
    setIsCreatingDocument(false)
    setIsViewingDocument(false)
    setIsEditingDocument(false)
    setSelectedDocument(null)
  }

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
              <p className="text-gray-600">Manage and collaborate on documents</p>
            </div>

            <AppButton
              onClick={() => setIsCreatingDocument(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              New Document
            </AppButton>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Documents List */}
        <DocumentList
          documents={documents}
          isLoading={isLoading}
          onView={handleViewDocument}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
          onShare={handleShareDocument}
          onCreateNew={() => setIsCreatingDocument(true)}
        />

        {/* Modals */}
        {isCreatingDocument && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleCloseModals}
              />

              {/* Modal */}
              <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <DocumentEditor onSave={handleCreateDocument} onCancel={handleCloseModals} />
              </div>
            </div>
          </div>
        )}

        {isEditingDocument && selectedDocument && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleCloseModals}
              />

              {/* Modal */}
              <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <DocumentEditor
                  document={selectedDocument}
                  onSave={handleUpdateDocument}
                  onCancel={handleCloseModals}
                />
              </div>
            </div>
          </div>
        )}

        {isViewingDocument && selectedDocument && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleCloseModals}
              />

              {/* Modal */}
              <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {selectedDocument.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedDocument.description || 'No description'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <AppButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDocument(selectedDocument)}
                        className="flex items-center gap-2"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </AppButton>
                      <AppButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareDocument(selectedDocument)}
                        className="flex items-center gap-2"
                      >
                        <ShareIcon className="h-4 w-4" />
                        Share
                      </AppButton>
                      <AppButton
                        variant="outline"
                        size="sm"
                        onClick={handleCloseModals}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        Close
                      </AppButton>
                    </div>
                  </div>

                  {/* Document Content */}
                  <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: selectedDocument.content }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  )
}
