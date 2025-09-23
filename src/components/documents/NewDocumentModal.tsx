import React, { useState, useMemo } from 'react'
import {
  DocumentTextIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { AppModal } from '@/components/ui/AppModal'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useTemplates } from '@/hooks/useTemplates'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import type { SystemTemplateWithMetrics } from '@/services/templateService'

interface NewDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateFromTemplate?: (templateId: string, documentData: DocumentCreationData) => Promise<void>
  onCreateBlank: (documentData: Partial<DocumentCreationData>) => Promise<void>
  isLoading?: boolean
  canCreateFromTemplate?: boolean
}

export interface DocumentCreationData {
  title: string
  description?: string
  templateId?: string
  organizationData: {
    name: string
    address: string
    contactEmail: string
    contactPhone: string
    effectiveDate: string
    department?: string
    complianceFramework?: string
  }
}

const categoryDisplayNames = {
  privacy_policies: 'Privacy Policies',
  patient_rights: 'Patient Rights',
  breach_procedures: 'Breach Procedures',
  training_materials: 'Training Materials',
  security_standards: 'Security Standards',
  service_agreements: 'Service Agreements',
  business_associate: 'Business Associate',
  incident_response: 'Incident Response'
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isOpen,
  onClose,
  onCreateFromTemplate,
  onCreateBlank,
  isLoading = false,
  canCreateFromTemplate = false,
}) => {
  const [currentStep, setCurrentStep] = useState<'selection' | 'template-details' | 'blank-details'>('selection')
  const [selectedTemplate, setSelectedTemplate] = useState<SystemTemplateWithMetrics | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  // Document data form
  const [documentData, setDocumentData] = useState<DocumentCreationData>({
    title: '',
    description: '',
    organizationData: {
      name: '',
      address: '',
      contactEmail: '',
      contactPhone: '',
      effectiveDate: new Date().toISOString().split('T')[0], // Today's date
      department: '',
      complianceFramework: '',
    }
  })

  const { organization } = useAuth()
  const { data: templatesData } = useTemplates({
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
  })

  const templates = templatesData?.data || []

  // Category options
  const categoryOptions = useMemo(() => {
    const options = [{ value: '', label: 'All Categories' }]
    const uniqueCategories = [...new Set(templates.map(t => t.category))]
    uniqueCategories.forEach(category => {
      options.push({
        value: category,
        label: categoryDisplayNames[category] || category
      })
    })
    return options
  }, [templates])

  // Reset modal state when closed
  React.useEffect(() => {
    if (!isOpen) {
      setCurrentStep('selection')
      setSelectedTemplate(null)
      setSearchTerm('')
      setSelectedCategory('')
      setDocumentData({
        title: '',
        description: '',
        organizationData: {
          name: organization?.name || '',
          address: organization?.address || '',
          contactEmail: organization?.contact_email || '',
          contactPhone: organization?.contact_phone || '',
          effectiveDate: new Date().toISOString().split('T')[0],
          department: '',
          complianceFramework: '',
        }
      })
    }
  }, [isOpen, organization])

  const handleTemplateSelect = (template: SystemTemplateWithMetrics) => {
    setSelectedTemplate(template)
    setDocumentData(prev => ({
      ...prev,
      title: template.name,
      description: template.description || '',
      templateId: template.id,
    }))
    setCurrentStep('template-details')
  }

  const handleCreateBlank = () => {
    setCurrentStep('blank-details')
  }

  const handleBack = () => {
    if (currentStep === 'template-details' || currentStep === 'blank-details') {
      setCurrentStep('selection')
      setSelectedTemplate(null)
    }
  }

  const handleSubmit = async () => {
    if (currentStep === 'template-details' && selectedTemplate && onCreateFromTemplate) {
      await onCreateFromTemplate(selectedTemplate.id, documentData)
    } else if (currentStep === 'blank-details') {
      await onCreateBlank(documentData)
    }
  }

  const isFormValid = () => {
    return documentData.title.trim() && 
           documentData.organizationData.name.trim() &&
           documentData.organizationData.effectiveDate
  }

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        currentStep === 'selection' ? 'Create New Document' :
        currentStep === 'template-details' ? `Create from Template: ${selectedTemplate?.name}` :
        'Create Blank Document'
      }
    >
      <div className="space-y-6">
        {currentStep === 'selection' && (
          <>
            {/* Permission Notice for Template Access */}
            {!canCreateFromTemplate && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-5 w-5 text-amber-500 mt-0.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Limited Access</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Creating documents from templates requires Account Owner or Compliance Officer permissions. 
                      You can still create blank documents.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Template Selection - Only for privileged users */}
            {canCreateFromTemplate && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <AppInput
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    />
                  </div>
                  <div className="w-48">
                    <AppSelect
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Category"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className={cn("border-b border-gray-200 pb-4", !canCreateFromTemplate && "mt-4")}>
              <AppButton
                variant="outline"
                onClick={handleCreateBlank}
                leftIcon={<ClipboardDocumentIcon className="h-5 w-5" />}
                className="w-full justify-start"
              >
                Create Blank Document
              </AppButton>
            </div>

            {/* Templates Grid - Only for privileged users */}
            {canCreateFromTemplate && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {templates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No templates found
                  </div>
                ) : (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {template.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {categoryDisplayNames[template.category]}
                            </span>
                            <span className="text-xs text-gray-400">
                              Used {template.usage_count} times
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {(currentStep === 'template-details' || currentStep === 'blank-details') && (
          <>
            {/* Document Details Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppInput
                  label="Document Title"
                  value={documentData.title}
                  onChange={(e) => setDocumentData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Privacy Policy - 2024"
                  required
                />
                <AppInput
                  label="Effective Date"
                  type="date"
                  value={documentData.organizationData.effectiveDate}
                  onChange={(e) => setDocumentData(prev => ({
                    ...prev,
                    organizationData: { ...prev.organizationData, effectiveDate: e.target.value }
                  }))}
                  required
                />
              </div>

              <AppInput
                label="Description (Optional)"
                value={documentData.description || ''}
                onChange={(e) => setDocumentData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this document"
              />

              {/* Organization Information */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AppInput
                    label="Organization Name"
                    value={documentData.organizationData.name}
                    onChange={(e) => setDocumentData(prev => ({
                      ...prev,
                      organizationData: { ...prev.organizationData, name: e.target.value }
                    }))}
                    required
                  />
                  <AppInput
                    label="Contact Email"
                    type="email"
                    value={documentData.organizationData.contactEmail}
                    onChange={(e) => setDocumentData(prev => ({
                      ...prev,
                      organizationData: { ...prev.organizationData, contactEmail: e.target.value }
                    }))}
                  />
                  <AppInput
                    label="Contact Phone"
                    value={documentData.organizationData.contactPhone}
                    onChange={(e) => setDocumentData(prev => ({
                      ...prev,
                      organizationData: { ...prev.organizationData, contactPhone: e.target.value }
                    }))}
                  />
                  <AppInput
                    label="Department (Optional)"
                    value={documentData.organizationData.department || ''}
                    onChange={(e) => setDocumentData(prev => ({
                      ...prev,
                      organizationData: { ...prev.organizationData, department: e.target.value }
                    }))}
                  />
                </div>
                <div className="mt-4">
                  <AppInput
                    label="Address"
                    value={documentData.organizationData.address}
                    onChange={(e) => setDocumentData(prev => ({
                      ...prev,
                      organizationData: { ...prev.organizationData, address: e.target.value }
                    }))}
                    placeholder="Full organization address"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div>
            {currentStep !== 'selection' && (
              <AppButton
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </AppButton>
            )}
          </div>
          <div className="flex space-x-3">
            <AppButton
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </AppButton>
            {(currentStep === 'template-details' || currentStep === 'blank-details') && (
              <AppButton
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
                leftIcon={currentStep === 'template-details' ? <SparklesIcon className="h-4 w-4" /> : <DocumentTextIcon className="h-4 w-4" />}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  currentStep === 'template-details' ? 'Create from Template' : 'Create Document'
                )}
              </AppButton>
            )}
          </div>
        </div>
      </div>
    </AppModal>
  )
}
