import React, { useState } from 'react'
import { SuperAdminLayout } from '@/components/layout/SuperAdminLayout'
import { AppButton } from '@/components/ui/AppButton'
import { SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import {
  TemplateList,
  TemplateCreator,
  TemplateViewer,
  TemplateEditorModal,
  CategoryManagement,
  PolicyGenerator,
  PolicyList,
  PolicyViewer,
  AITemplateGenerator,
  AIEnhancement,
} from '@/components/templates'
import { useTemplates } from '@/hooks/useTemplates'
import { usePolicies } from '@/hooks/usePolicies'
import type { TemplateWithCategory, PolicyTemplate, GeneratedPolicy } from '@/types'

const TemplatesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'categories' | 'policies'>('templates')
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [isViewingTemplate, setIsViewingTemplate] = useState(false)
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)
  const [isGeneratingPolicy, setIsGeneratingPolicy] = useState(false)
  const [isViewingPolicy, setIsViewingPolicy] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateWithCategory | null>(null)
  const [selectedPolicy, setSelectedPolicy] = useState<GeneratedPolicy | null>(null)

  // Use the templates hook
  const {
    templates,
    categories,
    isLoadingTemplates,
    isLoadingCategories,
    templatesError,
    categoriesError,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTemplates()

  // Use the policies hook
  const { policies, isLoadingPolicies, policiesError, createPolicy, updatePolicy, deletePolicy } =
    usePolicies()

  // Handle template actions
  const handleCreateTemplate = async (
    templateData: Omit<PolicyTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await createTemplate(templateData)
      setIsCreatingTemplate(false)
    } catch (error) {
      console.error('Failed to create template:', error)
    }
  }

  const handleEditTemplate = (template: TemplateWithCategory) => {
    setSelectedTemplate(template)
    setIsEditingTemplate(true)
  }

  const handleUpdateTemplate = async (
    templateData: Omit<PolicyTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!selectedTemplate) return

    try {
      await updateTemplate(selectedTemplate.id, templateData)
      setIsEditingTemplate(false)
      setSelectedTemplate(null)
    } catch (error) {
      console.error('Failed to update template:', error)
    }
  }

  const handleDeleteTemplate = async (template: TemplateWithCategory) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        await deleteTemplate(template.id)
      } catch (error) {
        console.error('Failed to delete template:', error)
      }
    }
  }

  const handleViewTemplate = (template: TemplateWithCategory) => {
    setSelectedTemplate(template)
    setIsViewingTemplate(true)
  }

  // Handle policy actions
  const handleGeneratePolicy = (template: TemplateWithCategory) => {
    setSelectedTemplate(template)
    setIsGeneratingPolicy(true)
  }

  const handleCreatePolicy = async (
    policy: Omit<GeneratedPolicy, 'id' | 'generatedAt' | 'generatedBy'>
  ) => {
    try {
      await createPolicy(policy)
      setIsGeneratingPolicy(false)
      setSelectedTemplate(null)
    } catch (error) {
      console.error('Failed to create policy:', error)
    }
  }

  const handleViewPolicy = (policy: GeneratedPolicy) => {
    setSelectedPolicy(policy)
    setIsViewingPolicy(true)
  }

  const handleDeletePolicy = async (policy: GeneratedPolicy) => {
    if (window.confirm(`Are you sure you want to delete "${policy.title}"?`)) {
      try {
        await deletePolicy(policy.id)
      } catch (error) {
        console.error('Failed to delete policy:', error)
      }
    }
  }

  // Handle AI template generation
  const handleAIGenerateTemplate = async (templateData: {
    name: string
    description: string
    categoryId: string
    content: string
    variables: Record<string, any>
  }) => {
    try {
      await createTemplate(templateData)
      setIsAIGenerating(false)
    } catch (error) {
      console.error('Failed to create AI-generated template:', error)
    }
  }

  const handleCloseModals = () => {
    setIsCreatingTemplate(false)
    setIsViewingTemplate(false)
    setIsEditingTemplate(false)
    setIsGeneratingPolicy(false)
    setIsViewingPolicy(false)
    setIsAIGenerating(false)
    setSelectedTemplate(null)
    setSelectedPolicy(null)
  }

  return (
    <SuperAdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Management</h1>
              <p className="text-gray-600">Manage system templates and categories</p>
            </div>

            {activeTab === 'templates' && (
              <div className="flex items-center gap-3">
                <AppButton
                  variant="outline"
                  onClick={() => setIsAIGenerating(true)}
                  className="flex items-center gap-2"
                >
                  <SparklesIcon className="h-4 w-4" />
                  AI Generate
                </AppButton>
                <AppButton
                  onClick={() => setIsCreatingTemplate(true)}
                  className="flex items-center gap-2"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  Create Template
                </AppButton>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Templates ({templates.length})
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'policies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Generated Policies ({policies.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories ({categories.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'templates' && (
          <TemplateList
            templates={templates}
            categories={categories}
            isLoading={isLoadingTemplates}
            onView={handleViewTemplate}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
            onGeneratePolicy={handleGeneratePolicy}
            onCreateNew={() => setIsCreatingTemplate(true)}
          />
        )}

        {activeTab === 'policies' && (
          <PolicyList
            policies={policies}
            isLoading={isLoadingPolicies}
            onView={handleViewPolicy}
            onDelete={handleDeletePolicy}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManagement
            categories={categories}
            onUpdateCategory={(id, updates) => {
              // TODO: Implement category update
              console.log('Update category:', id, updates)
            }}
            onDeleteCategory={id => {
              // TODO: Implement category delete
              console.log('Delete category:', id)
            }}
            onCreateCategory={category => {
              // TODO: Implement category create
              console.log('Create category:', category)
            }}
          />
        )}

        {/* Modals */}
        <TemplateCreator
          categories={categories}
          isOpen={isCreatingTemplate}
          onClose={handleCloseModals}
          onSave={handleCreateTemplate}
        />

        {selectedTemplate && (
          <>
            <TemplateViewer
              template={selectedTemplate}
              isOpen={isViewingTemplate}
              onClose={handleCloseModals}
              onEdit={handleEditTemplate}
            />

            <TemplateEditorModal
              template={selectedTemplate}
              categories={categories}
              isOpen={isEditingTemplate}
              onClose={handleCloseModals}
              onSave={handleUpdateTemplate}
            />

            <PolicyGenerator
              template={selectedTemplate}
              isOpen={isGeneratingPolicy}
              onClose={handleCloseModals}
              onGeneratePolicy={handleCreatePolicy}
            />
          </>
        )}

        {selectedPolicy && (
          <PolicyViewer
            policy={selectedPolicy}
            isOpen={isViewingPolicy}
            onClose={handleCloseModals}
          />
        )}

        <AITemplateGenerator
          categories={categories}
          isOpen={isAIGenerating}
          onClose={handleCloseModals}
          onGenerateTemplate={handleAIGenerateTemplate}
        />
      </div>
    </SuperAdminLayout>
  )
}

export default TemplatesPage
