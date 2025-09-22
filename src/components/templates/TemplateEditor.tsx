import React, { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  ListNumberedIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  CodeBracketIcon,
  EyeIcon,
  EyeSlashIcon,
  VariableIcon,
  DocumentTextIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppInput } from '@/components/ui/AppInput'
import { cn } from '@/utils/cn'
import type { PolicyTemplate, TemplateCategory } from '@/types'

interface TemplateEditorProps {
  template?: PolicyTemplate
  categories: TemplateCategory[]
  onSave?: (template: Omit<PolicyTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel?: () => void
  className?: string
}

interface Variable {
  name: string
  description: string
  defaultValue: string
}

export function TemplateEditor({
  template,
  categories,
  onSave,
  onCancel,
  className,
}: TemplateEditorProps) {
  // State
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showVariables, setShowVariables] = useState(false)
  const [templateData, setTemplateData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    categoryId: template?.categoryId || '',
    status: template?.status || ('draft' as const),
  })
  const [variables, setVariables] = useState<Variable[]>([])
  const [newVariable, setNewVariable] = useState({ name: '', description: '', defaultValue: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          'Start writing your template content... Use {{variable_name}} for dynamic content.',
      }),
      TextStyle,
      Color,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: template?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  // Initialize variables from template
  useEffect(() => {
    if (template?.variables) {
      const templateVariables = Object.entries(template.variables).map(([name, value]) => ({
        name,
        description: `Variable: ${name}`,
        defaultValue: typeof value === 'string' ? value : String(value),
      }))
      setVariables(templateVariables)
    }
  }, [template])

  // Handle template data changes
  const handleTemplateDataChange = (field: string, value: string) => {
    setTemplateData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Add variable
  const addVariable = () => {
    if (!newVariable.name.trim()) return

    const variableName = newVariable.name.trim()
    if (variables.some(v => v.name === variableName)) {
      setErrors(prev => ({ ...prev, variableName: 'Variable name already exists' }))
      return
    }

    const newVar: Variable = {
      name: variableName,
      description: newVariable.description.trim() || `Variable: ${variableName}`,
      defaultValue: newVariable.defaultValue.trim(),
    }

    setVariables(prev => [...prev, newVar])
    setNewVariable({ name: '', description: '', defaultValue: '' })
    setErrors(prev => ({ ...prev, variableName: undefined }))
  }

  // Remove variable
  const removeVariable = (index: number) => {
    setVariables(prev => prev.filter((_, i) => i !== index))
  }

  // Insert variable into editor
  const insertVariable = (variableName: string) => {
    if (!editor) return
    editor.chain().focus().insertContent(`{{${variableName}}}`).run()
  }

  // Get preview content with variables replaced
  const getPreviewContent = () => {
    if (!editor) return ''

    let content = editor.getHTML()

    // Replace variables with their default values
    variables.forEach(variable => {
      const regex = new RegExp(`{{${variable.name}}}`, 'g')
      content = content.replace(regex, variable.defaultValue || `[${variable.name}]`)
    })

    return content
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!templateData.name.trim()) {
      newErrors.name = 'Template name is required'
    }

    if (!templateData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (!editor?.getText().trim()) {
      newErrors.content = 'Template content is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSave = async () => {
    if (!editor || !validateForm()) return

    setIsSaving(true)
    try {
      const templateToSave = {
        ...templateData,
        content: editor.getHTML(),
        variables: variables.reduce(
          (acc, variable) => {
            acc[variable.name] = variable.defaultValue
            return acc
          },
          {} as Record<string, any>
        ),
        createdBy: 'current-user', // Will be replaced with actual user ID
      }

      await onSave?.(templateToSave)
    } catch (error) {
      console.error('Failed to save template:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Get category options
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
  }))

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {template ? 'Edit Template' : 'Create Template'}
          </h2>
          <p className="text-gray-600">
            {template
              ? 'Modify your template content and settings'
              : 'Create a new template with rich text editing'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AppButton
            variant="outline"
            onClick={() => setShowVariables(!showVariables)}
            className="flex items-center gap-2"
          >
            <VariableIcon className="h-4 w-4" />
            Variables ({variables.length})
          </AppButton>

          <AppButton
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2"
          >
            {isPreviewMode ? (
              <>
                <EyeSlashIcon className="h-4 w-4" />
                Edit Mode
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4" />
                Preview
              </>
            )}
          </AppButton>
        </div>
      </div>

      {/* Template Information */}
      <AppCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
            <AppInput
              type="text"
              value={templateData.name}
              onChange={e => handleTemplateDataChange('name', e.target.value)}
              placeholder="Enter template name"
              className={cn(errors.name && 'border-red-500')}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={templateData.categoryId}
              onChange={e => handleTemplateDataChange('categoryId', e.target.value)}
              className={cn(
                'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.categoryId && 'border-red-500'
              )}
            >
              <option value="">Select a category</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <AppInput
            type="text"
            value={templateData.description}
            onChange={e => handleTemplateDataChange('description', e.target.value)}
            placeholder="Enter template description"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={templateData.status}
            onChange={e => handleTemplateDataChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </AppCard>

      {/* Variables Panel */}
      {showVariables && (
        <AppCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Variables</h3>

          {/* Add Variable Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variable Name</label>
              <AppInput
                type="text"
                value={newVariable.name}
                onChange={e => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., organization_name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <AppInput
                type="text"
                value={newVariable.description}
                onChange={e => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Organization Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Value</label>
              <div className="flex gap-2">
                <AppInput
                  type="text"
                  value={newVariable.defaultValue}
                  onChange={e =>
                    setNewVariable(prev => ({ ...prev, defaultValue: e.target.value }))
                  }
                  placeholder="e.g., Your Organization"
                />
                <AppButton onClick={addVariable} className="px-3">
                  <CheckIcon className="h-4 w-4" />
                </AppButton>
              </div>
            </div>
          </div>

          {/* Variables List */}
          {variables.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Current Variables:</h4>
              {variables.map((variable, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <code className="px-2 py-1 bg-gray-200 rounded text-sm">
                      {`{{${variable.name}}}`}
                    </code>
                    <span className="text-sm text-gray-600">{variable.description}</span>
                    <span className="text-xs text-gray-500">
                      Default: {variable.defaultValue || 'None'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable.name)}
                    >
                      Insert
                    </AppButton>
                    <AppButton
                      variant="outline"
                      size="sm"
                      onClick={() => removeVariable(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </AppButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AppCard>
      )}

      {/* Editor/Preview */}
      <AppCard className="p-0">
        {!isPreviewMode ? (
          <>
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={cn(editor.isActive('bold') && 'bg-gray-100')}
                >
                  <BoldIcon className="h-4 w-4" />
                </AppButton>

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={cn(editor.isActive('italic') && 'bg-gray-100')}
                >
                  <ItalicIcon className="h-4 w-4" />
                </AppButton>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={cn(editor.isActive('heading', { level: 1 }) && 'bg-gray-100')}
                >
                  <Heading1Icon className="h-4 w-4" />
                </AppButton>

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={cn(editor.isActive('heading', { level: 2 }) && 'bg-gray-100')}
                >
                  <Heading2Icon className="h-4 w-4" />
                </AppButton>

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={cn(editor.isActive('heading', { level: 3 }) && 'bg-gray-100')}
                >
                  <Heading3Icon className="h-4 w-4" />
                </AppButton>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={cn(editor.isActive('bulletList') && 'bg-gray-100')}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </AppButton>

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={cn(editor.isActive('orderedList') && 'bg-gray-100')}
                >
                  <ListNumberedIcon className="h-4 w-4" />
                </AppButton>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={cn(editor.isActive('code') && 'bg-gray-100')}
                >
                  <CodeBracketIcon className="h-4 w-4" />
                </AppButton>
              </div>
            </div>

            {/* Editor */}
            <div className="p-4">
              <EditorContent editor={editor} />
              {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
            </div>
          </>
        ) : (
          /* Preview */
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DocumentTextIcon className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            </div>
            <div
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
              dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
            />
          </div>
        )}
      </AppCard>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <AppButton variant="outline" onClick={onCancel}>
            Cancel
          </AppButton>
        )}
        <AppButton onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <DocumentTextIcon className="h-4 w-4" />
              {template ? 'Update Template' : 'Create Template'}
            </>
          )}
        </AppButton>
      </div>
    </div>
  )
}
