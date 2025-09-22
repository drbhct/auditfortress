import React, { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  VariableIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppInput } from '@/components/ui/AppInput'
import { cn } from '@/utils/cn'
import type { PolicyTemplate, TemplateWithCategory } from '@/types'

interface PolicyGeneratorProps {
  template: TemplateWithCategory
  isOpen: boolean
  onClose: () => void
  onGeneratePolicy?: (policy: GeneratedPolicy) => Promise<void>
  className?: string
}

interface GeneratedPolicy {
  id: string
  templateId: string
  title: string
  content: string
  variables: Record<string, string>
  generatedAt: string
  generatedBy: string
}

interface VariableInput {
  name: string
  value: string
  description?: string
  required: boolean
}

export function PolicyGenerator({
  template,
  isOpen,
  onClose,
  onGeneratePolicy,
  className,
}: PolicyGeneratorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [variableInputs, setVariableInputs] = useState<VariableInput[]>([])
  const [policyTitle, setPolicyTitle] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize variable inputs from template
  useEffect(() => {
    if (template?.variables) {
      const inputs = Object.entries(template.variables).map(([name, defaultValue]) => ({
        name,
        value: typeof defaultValue === 'string' ? defaultValue : String(defaultValue),
        description: `Variable: ${name}`,
        required: true,
      }))
      setVariableInputs(inputs)
    }

    // Set default policy title
    setPolicyTitle(`${template.name} - Policy`)
  }, [template])

  // Handle variable input changes
  const handleVariableChange = (name: string, value: string) => {
    setVariableInputs(prev =>
      prev.map(input => (input.name === name ? { ...input, value } : input))
    )
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // Generate policy content with variable substitution
  const generateContent = () => {
    let content = template.content

    // Replace variables with user inputs
    variableInputs.forEach(input => {
      const regex = new RegExp(`{{${input.name}}}`, 'g')
      content = content.replace(regex, input.value)
    })

    setGeneratedContent(content)
    return content
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!policyTitle.trim()) {
      newErrors.title = 'Policy title is required'
    }

    variableInputs.forEach(input => {
      if (input.required && !input.value.trim()) {
        newErrors[input.name] = `${input.name} is required`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle policy generation
  const handleGeneratePolicy = async () => {
    if (!validateForm()) return

    setIsGenerating(true)
    try {
      const content = generateContent()

      const policy: GeneratedPolicy = {
        id: `policy-${Date.now()}`,
        templateId: template.id,
        title: policyTitle,
        content,
        variables: variableInputs.reduce(
          (acc, input) => {
            acc[input.name] = input.value
            return acc
          },
          {} as Record<string, string>
        ),
        generatedAt: new Date().toISOString(),
        generatedBy: 'current-user', // Will be replaced with actual user ID
      }

      await onGeneratePolicy?.(policy)
      onClose()
    } catch (error) {
      console.error('Failed to generate policy:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle preview toggle
  const handlePreviewToggle = () => {
    if (!isPreviewMode) {
      generateContent()
    }
    setIsPreviewMode(!isPreviewMode)
  }

  // Handle print
  const handlePrint = () => {
    const content = isPreviewMode ? generatedContent : generateContent()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${policyTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1, h2, h3 { color: #1f2937; }
              .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
              .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${policyTitle}</h1>
              <p>Generated from: ${template.name}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>This policy was generated using AuditFortress Template System</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Handle download
  const handleDownload = () => {
    const content = isPreviewMode ? generatedContent : generateContent()
    const blob = new Blob(
      [
        `
      <html>
        <head>
          <title>${policyTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1, h2, h3 { color: #1f2937; }
            .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${policyTitle}</h1>
            <p>Generated from: ${template.name}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>This policy was generated using AuditFortress Template System</p>
          </div>
        </body>
      </html>
    `,
      ],
      { type: 'text/html' }
    )

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${policyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
            'relative w-full max-w-6xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Generate Policy</h2>
                <p className="text-sm text-gray-500">
                  From: {template.name} • {template.category.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AppButton
                variant="outline"
                size="sm"
                onClick={handlePreviewToggle}
                className="flex items-center gap-2"
              >
                {isPreviewMode ? (
                  <>
                    <EyeSlashIcon className="h-4 w-4" />
                    Edit Variables
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-4 w-4" />
                    Preview
                  </>
                )}
              </AppButton>

              <AppButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </AppButton>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {!isPreviewMode ? (
              <>
                {/* Policy Information */}
                <AppCard className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Title *
                    </label>
                    <AppInput
                      type="text"
                      value={policyTitle}
                      onChange={e => setPolicyTitle(e.target.value)}
                      placeholder="Enter policy title"
                      className={cn(errors.title && 'border-red-500')}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>
                </AppCard>

                {/* Variable Inputs */}
                <AppCard className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <VariableIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Template Variables</h3>
                  </div>

                  <div className="space-y-4">
                    {variableInputs.map(input => (
                      <div key={input.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {input.name} {input.required && '*'}
                        </label>
                        <AppInput
                          type="text"
                          value={input.value}
                          onChange={e => handleVariableChange(input.name, e.target.value)}
                          placeholder={`Enter value for ${input.name}`}
                          className={cn(errors[input.name] && 'border-red-500')}
                        />
                        {input.description && (
                          <p className="mt-1 text-xs text-gray-500">{input.description}</p>
                        )}
                        {errors[input.name] && (
                          <p className="mt-1 text-sm text-red-600">{errors[input.name]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AppCard>
              </>
            ) : (
              /* Preview */
              <AppCard className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Policy Preview</h3>
                  <div className="flex items-center gap-2">
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="flex items-center gap-2"
                    >
                      <PrinterIcon className="h-4 w-4" />
                      Print
                    </AppButton>
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="flex items-center gap-2"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      Download
                    </AppButton>
                  </div>
                </div>

                <div className="p-6">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{policyTitle}</h1>
                    <p className="text-sm text-gray-600 mt-2">
                      Generated from: {template.name} • {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedContent }}
                  />
                </div>
              </AppCard>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <AppButton variant="outline" onClick={onClose}>
                Cancel
              </AppButton>
              <AppButton
                onClick={handleGeneratePolicy}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Generate Policy
                  </>
                )}
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
