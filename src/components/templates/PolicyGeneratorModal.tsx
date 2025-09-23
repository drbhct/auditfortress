import React, { useState } from 'react'
import { SparklesIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { AppTextArea } from '@/components/ui/AppTextArea'
import { AppSelect } from '@/components/ui/AppSelect'
import { AppModal } from '@/components/ui/AppModal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { TemplateWithCategory } from '@/types'

interface PolicyGeneratorModalProps {
  template: TemplateWithCategory | null
  isOpen: boolean
  onClose: () => void
  onGenerate: (templateId: string, organizationData: PolicyGenerationData) => Promise<void>
}

export interface PolicyGenerationData {
  organizationName: string
  organizationAddress: string
  contactEmail: string
  contactPhone: string
  effectiveDate: string
  department?: string
  customVariables?: Record<string, string>
}

// Mock organizations for demonstration
const mockOrganizations = [
  { value: 'org1', label: 'Acme Healthcare' },
  { value: 'org2', label: 'City Medical Center' },
  { value: 'org3', label: 'Regional Hospital Group' },
  { value: 'custom', label: 'Custom Organization...' },
]

export const PolicyGeneratorModal: React.FC<PolicyGeneratorModalProps> = ({
  template,
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState('')
  const [isCustomOrg, setIsCustomOrg] = useState(false)
  const [formData, setFormData] = useState<PolicyGenerationData>({
    organizationName: '',
    organizationAddress: '',
    contactEmail: '',
    contactPhone: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    department: '',
  })

  const handleOrgChange = (value: string) => {
    setSelectedOrg(value)
    setIsCustomOrg(value === 'custom')
    
    if (value !== 'custom') {
      // Pre-fill with mock data for demo
      const orgData = {
        org1: {
          organizationName: 'Acme Healthcare',
          organizationAddress: '123 Medical Drive, Healthcare City, HC 12345',
          contactEmail: 'admin@acmehealthcare.com',
          contactPhone: '(555) 123-4567',
        },
        org2: {
          organizationName: 'City Medical Center',
          organizationAddress: '456 Hospital Ave, Medical Town, MT 67890',
          contactEmail: 'info@citymedical.org',
          contactPhone: '(555) 987-6543',
        },
        org3: {
          organizationName: 'Regional Hospital Group',
          organizationAddress: '789 Regional Blvd, Health Valley, HV 54321',
          contactEmail: 'contact@regionalhospitals.com',
          contactPhone: '(555) 456-7890',
        },
      }
      
      const selected = orgData[value as keyof typeof orgData]
      if (selected) {
        setFormData(prev => ({
          ...prev,
          ...selected,
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        organizationName: '',
        organizationAddress: '',
        contactEmail: '',
        contactPhone: '',
      }))
    }
  }

  const handleGenerate = async () => {
    if (!template) return

    setIsGenerating(true)
    try {
      await onGenerate(template.id, formData)
      onClose()
    } catch (error) {
      console.error('Error generating policy:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate = formData.organizationName && formData.contactEmail && formData.effectiveDate

  if (!template) return null

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Policy Document"
      size="lg"
    >
      <div className="space-y-6">
        {/* Template Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">{template.name}</h3>
              <p className="text-sm text-blue-700">{template.description}</p>
              <p className="text-xs text-blue-600 mt-1">
                Category: {template.category.name} • 
                Frameworks: {template.complianceFrameworks.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Organization Selection */}
        <div>
          <AppSelect
            label="Target Organization"
            options={mockOrganizations}
            value={selectedOrg}
            onChange={handleOrgChange}
            placeholder="Select organization..."
            required
          />
        </div>

        {/* Organization Details */}
        {(selectedOrg && selectedOrg !== 'custom') || isCustomOrg ? (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Organization Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                label="Organization Name"
                value={formData.organizationName}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                placeholder="Enter organization name"
                required
                disabled={!isCustomOrg}
              />
              <AppInput
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="admin@organization.com"
                required
                disabled={!isCustomOrg}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="(555) 123-4567"
                disabled={!isCustomOrg}
              />
              <AppInput
                label="Department (Optional)"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g., IT, HR, Compliance"
              />
            </div>

            <AppTextArea
              label="Organization Address"
              value={formData.organizationAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationAddress: e.target.value }))}
              placeholder="Full address including city, state, zip"
              rows={2}
              disabled={!isCustomOrg}
            />

            <AppInput
              label="Effective Date"
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
              required
            />
          </div>
        ) : null}

        {/* Generation Preview */}
        {canGenerate && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Ready to Generate</h4>
                <p className="text-sm text-green-700">
                  This will create a customized policy document for <strong>{formData.organizationName}</strong> based on the "{template.name}" template.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <AppButton
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={handleGenerate}
            disabled={isGenerating || !canGenerate}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                Generate Policy
              </>
            )}
          </AppButton>
        </div>
      </div>
    </AppModal>
  )
}
