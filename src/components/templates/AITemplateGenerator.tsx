import React, { useState } from 'react'
import {
  XMarkIcon,
  SparklesIcon,
  DocumentTextIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { cn } from '@/utils/cn'
import { aiService } from '@/services/aiService'
import type { TemplateCategory } from '@/types'

interface AITemplateGeneratorProps {
  categories: TemplateCategory[]
  isOpen: boolean
  onClose: () => void
  onGenerateTemplate?: (template: {
    name: string
    description: string
    categoryId: string
    content: string
    variables: Record<string, any>
  }) => Promise<void>
  className?: string
}

export function AITemplateGenerator({
  categories,
  isOpen,
  onClose,
  onGenerateTemplate,
  className,
}: AITemplateGeneratorProps) {
  const [step, setStep] = useState<'description' | 'review' | 'generating'>('description')
  const [formData, setFormData] = useState({
    description: '',
    categoryId: '',
    enhancementType: 'clarity' as 'clarity' | 'completeness' | 'compliance',
  })
  const [generatedTemplate, setGeneratedTemplate] = useState<{
    name: string
    content: string
    variables: string[]
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
  }))

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleGenerate = async () => {
    if (!formData.description.trim() || !formData.categoryId) {
      setError('Please provide a description and select a category')
      return
    }

    setIsGenerating(true)
    setError(null)
    setStep('generating')

    try {
      const result = await aiService.generateTemplateFromDescription(
        formData.description,
        formData.categoryId
      )

      setGeneratedTemplate(result)
      setStep('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate template')
      setStep('description')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEnhance = async () => {
    if (!generatedTemplate) return

    setIsGenerating(true)
    try {
      const enhancedContent = await aiService.enhanceTemplateContent(
        generatedTemplate.content,
        formData.enhancementType
      )

      setGeneratedTemplate(prev =>
        prev
          ? {
              ...prev,
              content: enhancedContent,
            }
          : null
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance template')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedTemplate || !formData.categoryId) return

    try {
      const templateData = {
        name: generatedTemplate.name,
        description: formData.description,
        categoryId: formData.categoryId,
        content: generatedTemplate.content,
        variables: generatedTemplate.variables.reduce(
          (acc, variable) => {
            acc[variable] = `[${variable}]`
            return acc
          },
          {} as Record<string, any>
        ),
      }

      await onGenerateTemplate?.(templateData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template')
    }
  }

  const handleReset = () => {
    setStep('description')
    setFormData({
      description: '',
      categoryId: '',
      enhancementType: 'clarity',
    })
    setGeneratedTemplate(null)
    setError(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={cn(
            'relative w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-6 w-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Template Generator</h2>
                <p className="text-sm text-gray-500">
                  {step === 'description' && 'Describe what you need'}
                  {step === 'generating' && 'Generating your template...'}
                  {step === 'review' && 'Review and customize your template'}
                </p>
              </div>
            </div>
            <AppButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </AppButton>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {step === 'description' && (
              <>
                <AppCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Describe Your Template</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        What kind of template do you need? *
                      </label>
                      <AppInput
                        type="text"
                        value={formData.description}
                        onChange={e => handleInputChange('description', e.target.value)}
                        placeholder="e.g., A comprehensive HIPAA privacy policy for healthcare organizations"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <AppSelect
                        value={formData.categoryId}
                        onChange={e => handleInputChange('categoryId', e.target.value)}
                        options={[{ value: '', label: 'Select a category' }, ...categoryOptions]}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enhancement Type
                      </label>
                      <AppSelect
                        value={formData.enhancementType}
                        onChange={e => handleInputChange('enhancementType', e.target.value)}
                        options={[
                          { value: 'clarity', label: 'Clarity - Improve readability' },
                          { value: 'completeness', label: 'Completeness - Add missing sections' },
                          { value: 'compliance', label: 'Compliance - Add legal requirements' },
                        ]}
                        className="w-full"
                      />
                    </div>
                  </div>
                </AppCard>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <AppButton variant="outline" onClick={onClose}>
                    Cancel
                  </AppButton>
                  <AppButton
                    onClick={handleGenerate}
                    disabled={!formData.description.trim() || !formData.categoryId}
                    className="flex items-center gap-2"
                  >
                    <SparklesIcon className="h-4 w-4" />
                    Generate Template
                  </AppButton>
                </div>
              </>
            )}

            {step === 'generating' && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generating Your Template
                </h3>
                <p className="text-gray-600">Our AI is creating a customized template for you...</p>
              </div>
            )}

            {step === 'review' && generatedTemplate && (
              <>
                <AppCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Generated Template</h3>
                    <div className="flex items-center gap-2">
                      <AppButton
                        variant="outline"
                        size="sm"
                        onClick={handleEnhance}
                        disabled={isGenerating}
                        className="flex items-center gap-2"
                      >
                        <SparklesIcon className="h-4 w-4" />
                        Enhance
                      </AppButton>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template Name
                      </label>
                      <AppInput
                        type="text"
                        value={generatedTemplate.name}
                        onChange={e =>
                          setGeneratedTemplate(prev =>
                            prev
                              ? {
                                  ...prev,
                                  name: e.target.value,
                                }
                              : null
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <AppInput
                        type="text"
                        value={formData.description}
                        onChange={e => handleInputChange('description', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Detected Variables
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {generatedTemplate.variables.map(variable => (
                          <span
                            key={variable}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AppCard>

                <AppCard className="p-0">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <DocumentTextIcon className="h-4 w-4" />
                      AI Generated Content
                    </div>
                  </div>

                  <div className="p-6">
                    <div
                      className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
                      dangerouslySetInnerHTML={{ __html: generatedTemplate.content }}
                    />
                  </div>
                </AppCard>

                <div className="flex items-center justify-between">
                  <AppButton variant="outline" onClick={handleReset}>
                    Start Over
                  </AppButton>
                  <div className="flex items-center gap-3">
                    <AppButton variant="outline" onClick={onClose}>
                      Cancel
                    </AppButton>
                    <AppButton onClick={handleSave} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4" />
                      Save Template
                    </AppButton>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
