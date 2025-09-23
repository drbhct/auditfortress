import React, { useState, useMemo } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { AppModal } from '@/components/ui/AppModal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
  useTemplates, 
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useDuplicateTemplate,
  useTemplateCategories 
} from '@/hooks/useTemplates'
import { 
  TemplateCreator, 
  TemplateEditModal, 
  TemplateDeleteModal,
  type TemplateFormData,
  type TemplateEditData
} from '@/components/templates'
import { cn } from '@/utils/cn'
import type { SystemTemplateWithMetrics, TemplateFilters, TemplateCategory } from '@/services/templateService'
import type { SystemTemplate } from '@/services/templateService'

// Organization type options (from Supabase enum)
const organizationTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'healthcare_facility', label: 'Healthcare Facility' },
  { value: 'emr_software', label: 'EMR Software' },
  { value: 'third_party_services', label: 'Third Party Services' }
]

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' }
]

// Template category display names
const categoryDisplayNames: Record<TemplateCategory, string> = {
  privacy_policies: 'Privacy Policies',
  patient_rights: 'Patient Rights',
  breach_procedures: 'Breach Procedures',
  training_materials: 'Training Materials',
  security_standards: 'Security Standards',
  service_agreements: 'Service Agreements',
  business_associate: 'Business Associate',
  incident_response: 'Incident Response'
}

interface TemplateDetailsModalProps {
  template: SystemTemplateWithMetrics | null
  isOpen: boolean
  onClose: () => void
  onEdit: (template: SystemTemplateWithMetrics) => void
  onDelete: (template: SystemTemplateWithMetrics) => void
  onDuplicate: (template: SystemTemplateWithMetrics) => void
}

const TemplateDetailsModal: React.FC<TemplateDetailsModalProps> = ({
  template,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  if (!template) return null

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={template.name}
      size="lg"
    >
      <div className="space-y-6">
        {/* Template Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Category</h4>
            <p className="text-sm text-gray-900">{categoryDisplayNames[template.category]}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Version</h4>
            <p className="text-sm text-gray-900">{template.version}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              template.status === 'active' ? 'bg-green-100 text-green-800' :
              template.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            )}>
              {template.status}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Usage Count</h4>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-900">{template.usageCount}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {template.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        )}

        {/* Organization Types */}
        {template.organization_types && template.organization_types.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Organization Types</h4>
            <div className="flex flex-wrap gap-2">
              {template.organization_types.map((type, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Framework */}
        {template.compliance_framework && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Compliance Framework</h4>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {template.compliance_framework}
            </span>
          </div>
        )}

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{template.usageCount}</div>
            <div className="text-xs text-gray-500">Total Uses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{template.averageRating}</div>
            <div className="text-xs text-gray-500">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{template.successfulImplementations}</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Created: {new Date(template.created_at || '').toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Updated: {new Date(template.updated_at || '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
        <AppButton
          variant="outline"
          onClick={() => onDuplicate(template)}
          leftIcon={<DocumentDuplicateIcon className="h-4 w-4" />}
        >
          Duplicate
        </AppButton>
        <AppButton
          variant="outline"
          onClick={() => onEdit(template)}
          leftIcon={<PencilIcon className="h-4 w-4" />}
        >
          Edit
        </AppButton>
        <AppButton
          variant="danger"
          onClick={() => onDelete(template)}
          leftIcon={<TrashIcon className="h-4 w-4" />}
        >
          Delete
        </AppButton>
      </div>
    </AppModal>
  )
}

const TemplatesPageNew: React.FC = () => {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<TemplateFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedOrgType, setSelectedOrgType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<SystemTemplateWithMetrics | null>(null)

  // Build filters object
  const templateFilters = useMemo<TemplateFilters>(() => ({
    search: searchTerm || undefined,
    category: selectedCategory as TemplateCategory || undefined,
    organization_type: selectedOrgType || undefined,
    status: selectedStatus || undefined,
  }), [searchTerm, selectedCategory, selectedOrgType, selectedStatus])

  // Hooks
  const { data: templatesData, isLoading, error } = useTemplates(templateFilters, currentPage, 10)
  const { data: categories } = useTemplateCategories()
  const createMutation = useCreateTemplate()
  const updateMutation = useUpdateTemplate()
  const deleteMutation = useDeleteTemplate()
  const duplicateMutation = useDuplicateTemplate()

  const templates = templatesData?.data || []
  const totalPages = templatesData?.totalPages || 1

  // Category options from real data
  const categoryOptions = useMemo(() => {
    const options = [{ value: '', label: 'All Categories' }]
    if (categories) {
      options.push(...categories.map(cat => ({
        value: cat.category,
        label: categoryDisplayNames[cat.category]
      })))
    }
    return options
  }, [categories])

  const handleRowClick = (template: SystemTemplateWithMetrics) => {
    setSelectedTemplate(template)
    setIsEditModalOpen(true) // Skip details modal, go directly to edit
  }

  const handleEdit = (template: SystemTemplateWithMetrics) => {
    setSelectedTemplate(template)
    setIsDetailsModalOpen(false)
    setIsEditModalOpen(true)
  }

  const handleDelete = (template: SystemTemplateWithMetrics) => {
    setSelectedTemplate(template)
    setIsDetailsModalOpen(false)
    setIsDeleteModalOpen(true)
  }

  const handleDuplicate = async (template: SystemTemplateWithMetrics) => {
    try {
      await duplicateMutation.mutateAsync({
        id: template.id,
        name: `${template.name} (Copy)`
      })
      setIsDetailsModalOpen(false)
    } catch (error) {
      console.error('Error duplicating template:', error)
    }
  }

  const handleCreateTemplate = async (formData: TemplateFormData) => {
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        category: formData.categoryIds[0] as TemplateCategory, // Take first category
        organization_types: formData.organizationTypes,
        compliance_framework: formData.complianceFrameworks[0], // Take first framework
        content: { html: formData.content, variables: formData.variables },
        variables: formData.variables,
        tags: formData.tags || [],
        is_starter: false
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating template:', error)
    }
  }

  const handleUpdateTemplate = async (formData: TemplateEditData) => {
    if (!selectedTemplate) return

    try {
      await updateMutation.mutateAsync({
        id: selectedTemplate.id,
        data: {
          name: formData.name,
          description: formData.description,
          category: formData.categoryIds[0] as TemplateCategory,
          organization_types: formData.organizationTypes,
          compliance_framework: formData.complianceFrameworks[0],
          content: { html: formData.content, variables: formData.variables },
          variables: formData.variables,
          tags: formData.tags || [],
        }
      })
      setIsEditModalOpen(false)
      setSelectedTemplate(null)
    } catch (error) {
      console.error('Error updating template:', error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate) return

    try {
      await deleteMutation.mutateAsync(selectedTemplate.id)
      setIsDeleteModalOpen(false)
      setSelectedTemplate(null)
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedOrgType('')
    setSelectedStatus('')
    setCurrentPage(1)
  }

  if (error) {
    return (
      <SuperAdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">Error loading templates</div>
            <div className="text-gray-500 text-sm">{error.message}</div>
          </div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
            <p className="text-gray-600">Manage system templates and monitor usage</p>
          </div>
          <AppButton
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<PlusIcon className="h-5 w-5" />}
          >
            Create Template
          </AppButton>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <AppInput
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <div className="min-w-[160px]">
              <AppSelect
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Category"
              />
            </div>
            <div className="min-w-[160px]">
              <AppSelect
                options={organizationTypeOptions}
                value={selectedOrgType}
                onChange={setSelectedOrgType}
                placeholder="Org Type"
              />
            </div>
            <div className="min-w-[120px]">
              <AppSelect
                options={statusOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Status"
              />
            </div>
            <AppButton
              variant="outline"
              onClick={clearFilters}
              leftIcon={<FunnelIcon className="h-4 w-4" />}
            >
              Clear
            </AppButton>
          </div>
        </div>

        {/* Templates Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No templates found</div>
              <div className="text-gray-400 text-sm">
                {Object.keys(templateFilters).some(key => templateFilters[key as keyof TemplateFilters]) 
                  ? 'Try adjusting your filters' 
                  : 'Create your first template to get started'}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organization Types
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {templates.map((template) => (
                      <tr
                        key={template.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(template)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                            {template.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {template.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {categoryDisplayNames[template.category]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {template.organization_types?.map((type, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {type.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <ChartBarIcon className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-900">{template.usageCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            template.status === 'active' ? 'bg-green-100 text-green-800' :
                            template.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          )}>
                            {template.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(template.updated_at || '').toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </AppButton>
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </AppButton>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        <TemplateCreator
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTemplate}
          isLoading={createMutation.isPending}
        />

        {selectedTemplate && (
          <>
            <TemplateEditModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false)
                setSelectedTemplate(null)
              }}
              onSubmit={handleUpdateTemplate}
              template={selectedTemplate}
              isLoading={updateMutation.isPending}
            />

            <TemplateDeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => {
                setIsDeleteModalOpen(false)
                setSelectedTemplate(null)
              }}
              onConfirm={handleDeleteConfirm}
              template={selectedTemplate}
              isLoading={deleteMutation.isPending}
            />

            <TemplateDetailsModal
              template={selectedTemplate}
              isOpen={isDetailsModalOpen}
              onClose={() => {
                setIsDetailsModalOpen(false)
                setSelectedTemplate(null)
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          </>
        )}
      </div>
    </SuperAdminLayout>
  )
}

export default TemplatesPageNew