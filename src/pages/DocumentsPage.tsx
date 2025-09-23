import React, { useState } from 'react'
import { OrganizationLayout } from '@/components/layout/OrganizationLayout'
import { AppButton } from '@/components/ui/AppButton'
import {
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { DocumentList, DocumentEditor, NewDocumentModal, type DocumentCreationData } from '@/components/documents'
import { useDocuments } from '@/hooks/useDocuments'
import { usePermissions } from '@/hooks/usePermissions'
import { templateService } from '@/services/templateService'
import type { Document } from '@/types'

const DocumentsPage: React.FC = () => {
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
  const { isAccountOwner, isComplianceOfficer, canWriteDocuments } = usePermissions()

  // Check if user can create documents from templates
  const canCreateFromTemplate = isAccountOwner || isComplianceOfficer

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

  const handleCreateFromTemplate = async (templateId: string, documentData: DocumentCreationData) => {
    try {
      // Get the template content
      const template = await templateService.getTemplateById(templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      // Substitute template variables with organization data
      let processedContent = template.content?.html || ''
      
      // Replace common variables
      const variableMap = {
        organization_name: documentData.organizationData.name,
        organization_address: documentData.organizationData.address,
        contact_email: documentData.organizationData.contactEmail,
        contact_phone: documentData.organizationData.contactPhone,
        effective_date: documentData.organizationData.effectiveDate,
        last_updated: new Date().toLocaleDateString(),
        version: '1.0',
        department: documentData.organizationData.department || '',
        compliance_framework: documentData.organizationData.complianceFramework || '',
      }

      // Replace all variables in the content
      Object.entries(variableMap).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        processedContent = processedContent.replace(regex, value)
      })

      // Create the document
      await createDocument({
        title: documentData.title,
        description: documentData.description || '',
        organizationId: 'org-1', // This would come from user context
        status: 'draft',
        content: processedContent,
        templateId: templateId,
        tags: [template.category, 'from-template'],
        metadata: {
          category: template.category,
          department: documentData.organizationData.department || '',
          priority: 'medium',
          confidentiality: 'internal',
          complianceRequirements: template.compliance_framework ? [template.compliance_framework] : [],
          fileSize: processedContent.length,
          wordCount: processedContent.split(' ').length,
          pageCount: Math.ceil(processedContent.split(' ').length / 250), // Rough estimate
          templateId: templateId,
          templateName: template.name,
          organizationData: documentData.organizationData,
        },
      })

      setIsCreatingDocument(false)
    } catch (error) {
      console.error('Failed to create document from template:', error)
      // TODO: Show error message to user
    }
  }

  const handleCreateBlankDocument = async (documentData: Partial<DocumentCreationData>) => {
    try {
      await createDocument({
        title: documentData.title || 'Untitled Document',
        description: documentData.description || '',
        organizationId: 'org-1', // This would come from user context
        status: 'draft',
        content: '<p>Start writing your document...</p>',
        tags: ['blank-document'],
        metadata: {
          category: '',
          department: documentData.organizationData?.department || '',
          priority: 'medium',
          confidentiality: 'internal',
          complianceRequirements: [],
          fileSize: 0,
          wordCount: 0,
          pageCount: 1,
          organizationData: documentData.organizationData,
        },
      })

      setIsCreatingDocument(false)
    } catch (error) {
      console.error('Failed to create blank document:', error)
      // TODO: Show error message to user
    }
  }

  const handleCloseModals = () => {
    setIsCreatingDocument(false)
    setIsViewingDocument(false)
    setIsEditingDocument(false)
    setSelectedDocument(null)
  }

  return (
    <OrganizationLayout>
      <div className="p-6">

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
        <NewDocumentModal
          isOpen={isCreatingDocument}
          onClose={handleCloseModals}
          onCreateFromTemplate={canCreateFromTemplate ? handleCreateFromTemplate : undefined}
          onCreateBlank={handleCreateBlankDocument}
          isLoading={false}
          canCreateFromTemplate={canCreateFromTemplate}
        />

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
    </OrganizationLayout>
  )
}

export default DocumentsPage
