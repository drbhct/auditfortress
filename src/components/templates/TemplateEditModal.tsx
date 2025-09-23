import React, { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  QueueListIcon as NumberedListIcon,
  Bars3Icon as H1Icon,
  Bars2Icon as H2Icon,
  MinusIcon as H3Icon,
  CodeBracketIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  XMarkIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { AppTextArea } from '@/components/ui/AppTextArea'
import { AppSelect } from '@/components/ui/AppSelect'
import { AppModal } from '@/components/ui/AppModal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FormError } from '@/components/ui/FormError'
import { useTemplateCategories } from '@/hooks/useTemplates'
import { cn } from '@/utils/cn'
import type { SystemTemplateWithMetrics } from '@/services/templateService'

interface TemplateEditModalProps {
  template: SystemTemplateWithMetrics | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (template: TemplateEditData) => Promise<void>
  isLoading?: boolean
}

export interface TemplateEditData {
  name: string
  description: string
  categoryIds: string[]
  organizationTypes: string[]
  complianceFrameworks: string[]
  content: string
  variables?: string[]
  tags?: string[]
}

const organizationTypeOptions = [
  { value: 'healthcare_facility', label: 'Healthcare Facility' },
  { value: 'emr_software', label: 'EMR Software' },
  { value: 'third_party_services', label: 'Third Party Services' },
]

const complianceFrameworkOptions = [
  { value: 'HIPAA', label: 'HIPAA (Healthcare)' },
  { value: 'SOC2', label: 'SOC 2' },
  { value: 'GDPR', label: 'GDPR (Privacy)' },
  { value: 'PCI-DSS', label: 'PCI DSS (Payment Card)' },
  { value: 'NIST', label: 'NIST Cybersecurity Framework' },
  { value: 'ISO27001', label: 'ISO 27001' },
  { value: 'FERPA', label: 'FERPA (Education)' },
  { value: 'CCPA', label: 'CCPA (California Privacy)' },
  { value: 'General', label: 'General Compliance' },
]

// Template category display names (matching Supabase enum)
const categoryDisplayNames: Record<string, string> = {
  privacy_policies: 'Privacy Policies',
  patient_rights: 'Patient Rights',
  breach_procedures: 'Breach Procedures',
  training_materials: 'Training Materials',
  security_standards: 'Security Standards',
  service_agreements: 'Service Agreements',
  business_associate: 'Business Associate',
  incident_response: 'Incident Response'
}

export const TemplateEditModal: React.FC<TemplateEditModalProps> = ({
  template,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  // Fetch categories using the hook
  const { data: categoriesData } = useTemplateCategories()
  
  // Transform categories data to the expected format
  const categories = categoriesData ? 
    categoriesData.map(cat => ({
      id: cat.category,
      name: categoryDisplayNames[cat.category] || cat.category,
      count: cat.count
    })) : []
  const [formData, setFormData] = useState<TemplateEditData>({
    name: '',
    description: '',
    categoryIds: [],
    organizationTypes: [],
    complianceFrameworks: [],
    content: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing the policy body content... The header with organization details will be automatically added. Use {{variable_name}} for dynamic content.',
      }),
    ],
    content: formData.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4 border border-gray-300 rounded-md',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      setFormData(prev => ({ ...prev, content }))
    },
  })

  // Reset form when modal opens/closes or template changes
  useEffect(() => {
    if (isOpen && template) {
      const newFormData: TemplateEditData = {
        name: template.name,
        description: template.description || '',
        categoryIds: [template.category.id], // Convert single category to array
        organizationTypes: template.organizationTypes || [],
        complianceFrameworks: template.complianceFrameworks || [],
        content: template.content || '',
      }
      setFormData(newFormData)
      setErrors({})
      editor?.commands.setContent(template.content || '')
    } else if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        categoryIds: [],
        organizationTypes: [],
        complianceFrameworks: [],
        content: '',
      })
      setErrors({})
      editor?.commands.setContent('')
    }
  }, [isOpen, template, editor])

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Template name must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = 'At least one category is required'
    }

    if (formData.organizationTypes.length === 0) {
      newErrors.organizationTypes = 'At least one organization type is required'
    }

    if (formData.complianceFrameworks.length === 0) {
      newErrors.complianceFrameworks = 'At least one compliance framework is required'
    }

    if (!formData.content.trim() || formData.content === '<p></p>') {
      newErrors.content = 'Template content is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSave = async () => {
    if (!template || !validateForm()) {
      return
    }

    setIsSaving(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error saving template:', error)
      setErrors({
        general: 'Failed to save template. Please try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (!isSaving) {
      onClose()
    }
  }

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  const insertVariable = (variableName: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`{{${variableName}}}`).run()
    }
  }

  const commonVariables = [
    'organization_name',
    'organization_address',
    'contact_email',
    'contact_phone',
    'effective_date',
    'last_updated',
    'version',
    'department',
    'title',
    'employee_name',
  ]

  if (!template) return null

  // Custom header content with Template Name field
  const customHeader = (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex-1 mr-4">
        <AppInput
          label="Template Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., HIPAA Privacy Policy"
          error={errors.name}
          required
          className="text-lg"
        />
      </div>
      <button
        onClick={handleClose}
        disabled={isSaving}
        className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Close modal"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  )

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      showCloseButton={false}
      className="p-0"
    >
      {/* Custom Header */}
      {customHeader}
      
      <div className="px-6 py-4 space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <InformationCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Template Details - Single Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <AppSelect
              label="Categories"
              options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
              value={formData.categoryIds}
              onChange={(value) => setFormData(prev => ({ ...prev, categoryIds: value as string[] }))}
              placeholder="Select categories"
              multiple
              error={errors.categoryIds}
              required
            />
          </div>
          <div>
            <AppSelect
              label="Organization Types"
              options={organizationTypeOptions}
              value={formData.organizationTypes}
              onChange={(value) => setFormData(prev => ({ ...prev, organizationTypes: value as string[] }))}
              placeholder="Select types"
              multiple
              error={errors.organizationTypes}
              required
            />
          </div>
          <div>
            <AppSelect
              label="Compliance"
              options={complianceFrameworkOptions}
              value={formData.complianceFrameworks}
              onChange={(value) => setFormData(prev => ({ ...prev, complianceFrameworks: value as string[] }))}
              placeholder="Select frameworks"
              multiple
              error={errors.complianceFrameworks}
              required
            />
          </div>
        </div>

        <div>
          <AppTextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of what this template covers..."
            rows={2}
            error={errors.description}
            required
          />
        </div>

        {isPreviewMode ? (
          /* Full Document Preview */
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Document Preview</h4>
              <AppButton
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(false)}
                leftIcon={<PencilIcon className="h-4 w-4" />}
              >
                Edit
              </AppButton>
            </div>
            <div className="bg-white border border-gray-300 rounded p-6 font-serif min-h-[400px]">
              {/* Header */}
              <div className="text-center mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-lg font-bold text-gray-900 mb-2">
                  {formData.name || 'Template Name'}
                </h1>
                <div className="text-xs text-gray-500 space-x-4">
                  <span>{'{{organization_name}}'}</span>
                  <span>•</span>
                  <span>{'{{organization_address}}'}</span>
                  <span>•</span>
                  <span>Effective: {'{{effective_date}}'}</span>
                  <span>•</span>
                  <span>Updated: {'{{last_updated}}'}</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="prose prose-sm max-w-none">
                {editor?.getHTML() && editor.getHTML() !== '<p></p>' ? (
                  <div dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
                ) : (
                  <div className="text-gray-400 italic">
                    No content yet. Click "Edit" to add policy content.
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Note:</strong> This shows how the complete policy document will appear when generated.
            </p>
          </div>
        ) : (
          <>
            {/* Template Header Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Template Header Preview</h4>
              <div className="bg-white border border-gray-300 rounded p-4 font-serif">
                <div className="text-center mb-4">
                  <h1 className="text-lg font-bold text-gray-900 mb-2">
                    {formData.name || 'Template Name'}
                  </h1>
                  <div className="text-xs text-gray-500 space-x-4">
                    <span>{'{{organization_name}}'}</span>
                    <span>•</span>
                    <span>{'{{organization_address}}'}</span>
                    <span>•</span>
                    <span>Effective: {'{{effective_date}}'}</span>
                    <span>•</span>
                    <span>Updated: {'{{last_updated}}'}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Note:</strong> This header will automatically appear on all generated policies.
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-end mb-2">
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(true)}
                  leftIcon={<EyeIcon className="h-4 w-4" />}
                >
                  Preview
                </AppButton>
              </div>
            </div>
          </>
        )}

        {/* Content Editor (only show when NOT in preview mode) */}
        {!isPreviewMode && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Policy Content (Body Only) <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Editor Toolbar */}
            <div className="border border-gray-300 border-b-0 rounded-t-md bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={cn(editor?.isActive('bold') && 'bg-gray-200')}
                  >
                    <BoldIcon className="h-4 w-4" />
                  </AppButton>

                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={cn(editor?.isActive('italic') && 'bg-gray-200')}
                  >
                    <ItalicIcon className="h-4 w-4" />
                  </AppButton>
                </div>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <div className="flex items-center gap-1">
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn(editor?.isActive('heading', { level: 1 }) && 'bg-gray-200')}
                  >
                    <H1Icon className="h-4 w-4" />
                  </AppButton>

                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn(editor?.isActive('heading', { level: 2 }) && 'bg-gray-200')}
                  >
                    <H2Icon className="h-4 w-4" />
                  </AppButton>

                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn(editor?.isActive('heading', { level: 3 }) && 'bg-gray-200')}
                  >
                    <H3Icon className="h-4 w-4" />
                  </AppButton>
                </div>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <div className="flex items-center gap-1">
                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={cn(editor?.isActive('bulletList') && 'bg-gray-200')}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                  </AppButton>

                  <AppButton
                    variant="outline"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={cn(editor?.isActive('orderedList') && 'bg-gray-200')}
                  >
                    <NumberedListIcon className="h-4 w-4" />
                  </AppButton>
                </div>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  className={cn(editor?.isActive('code') && 'bg-gray-200')}
                >
                  <CodeBracketIcon className="h-4 w-4" />
                </AppButton>
              </div>

            {/* Variables Toolbar */}
            <div className="border border-gray-300 border-b-0 bg-blue-50 p-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-blue-700">Common Variables:</span>
                {commonVariables.map((variable) => (
                  <AppButton
                    key={variable}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable)}
                    className="text-xs h-6 px-2 bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    {`{{${variable}}}`}
                  </AppButton>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="border border-gray-300 rounded-b-md">
              <EditorContent editor={editor} />
            </div>

            {errors.content && <FormError message={errors.content} />}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
        <AppButton
          variant="outline"
          onClick={handleClose}
          disabled={isSaving}
        >
          Cancel
        </AppButton>
        <AppButton
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving && <LoadingSpinner size="sm" />}
          Update Template
        </AppButton>
      </div>
    </AppModal>
  )
}
