import React, { useState, useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
// import TextStyle from '@tiptap/extension-text-style'
// import Color from '@tiptap/extension-color'
// import BulletList from '@tiptap/extension-bullet-list'
// import OrderedList from '@tiptap/extension-ordered-list'
// import ListItem from '@tiptap/extension-list-item'
// import Link from '@tiptap/extension-link'
// import Table from '@tiptap/extension-table'
// import TableRow from '@tiptap/extension-table-row'
// import TableCell from '@tiptap/extension-table-cell'
// import TableHeader from '@tiptap/extension-table-header'
import {
  BoldIcon,
  ItalicIcon,
  // ListBulletIcon,
  // QueueListIcon,
  Bars3Icon,
  Bars2Icon,
  MinusIcon,
  CodeBracketIcon,
  // LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppInput } from '@/components/ui/AppInput'
import { AppSelect } from '@/components/ui/AppSelect'
import { cn } from '@/utils/cn'
import type { Document, DocumentStatus, DocumentPriority, ConfidentialityLevel } from '@/types'

interface DocumentEditorProps {
  document?: Document
  onSave?: (document: Partial<Document>) => Promise<void>
  onCancel?: () => void
  className?: string
}

export function DocumentEditor({ document, onSave, onCancel, className }: DocumentEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [documentData, setDocumentData] = useState({
    title: document?.title || '',
    description: document?.description || '',
    status: document?.status || ('draft' as DocumentStatus),
    tags: document?.tags || [],
    metadata: {
      category: document?.metadata.category || '',
      department: document?.metadata.department || '',
      priority: document?.metadata.priority || ('medium' as DocumentPriority),
      confidentiality: document?.metadata.confidentiality || ('internal' as ConfidentialityLevel),
      complianceRequirements: document?.metadata.complianceRequirements || [],
    },
  })
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize TipTap editor with minimal configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      // TextStyle,
      // Color,
      // BulletList,
      // OrderedList,
      // ListItem,
      // Link.configure({
      //   openOnClick: false,
      //   HTMLAttributes: {
      //     class: 'text-blue-600 underline',
      //   },
      // }),
      // Table.configure({
      //   resizable: true,
      // }),
      // TableRow,
      // TableHeader,
      // TableCell,
    ],
    content: document?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: () => {
      setHasUnsavedChanges(true)
    },
  })

  // Handle document data changes
  const handleDocumentDataChange = (field: string, value: any) => {
    setDocumentData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value,
          },
        }
      }
      return { ...prev, [field]: value }
    })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Add tag
  const addTag = () => {
    if (!newTag.trim()) return

    const tag = newTag.trim()
    if (documentData.tags.includes(tag)) {
      setErrors(prev => ({ ...prev, tag: 'Tag already exists' }))
      return
    }

    setDocumentData(prev => ({
      ...prev,
      tags: [...prev.tags, tag],
    }))
    setNewTag('')
    setErrors(prev => ({ ...prev, tag: undefined }))
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setDocumentData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  // Add compliance requirement
  const addComplianceRequirement = () => {
    const requirement = prompt('Enter compliance requirement:')
    if (requirement && !documentData.metadata.complianceRequirements.includes(requirement)) {
      setDocumentData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          complianceRequirements: [...prev.metadata.complianceRequirements, requirement],
        },
      }))
    }
  }

  // Remove compliance requirement
  const removeComplianceRequirement = (requirement: string) => {
    setDocumentData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        complianceRequirements: prev.metadata.complianceRequirements.filter(
          req => req !== requirement
        ),
      },
    }))
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!documentData.title.trim()) {
      newErrors.title = 'Document title is required'
    }

    if (!editor?.getText().trim()) {
      newErrors.content = 'Document content is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSave = async () => {
    if (!editor || !validateForm()) return

    setIsSaving(true)
    try {
      const documentToSave = {
        ...documentData,
        content: editor.getHTML(),
        metadata: {
          ...documentData.metadata,
          fileSize: new Blob([editor.getHTML()]).size,
          wordCount: editor.getText().split(/\s+/).length,
          pageCount: Math.ceil(editor.getText().split(/\s+/).length / 250), // Rough estimate
        },
      }

      await onSave?.(documentToSave)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save document:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        handleSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'in_review', label: 'In Review' },
    { value: 'pending_approval', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
    { value: 'rejected', label: 'Rejected' },
  ]

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  // Confidentiality options
  const confidentialityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'internal', label: 'Internal' },
    { value: 'confidential', label: 'Confidential' },
    { value: 'restricted', label: 'Restricted' },
  ]

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {document ? 'Edit Document' : 'Create Document'}
          </h2>
          <p className="text-gray-600">
            {document
              ? 'Modify your document content and settings'
              : 'Create a new document with rich text editing'}
          </p>
        </div>

        <div className="flex items-center gap-3">
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

          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <ArrowPathIcon className="h-4 w-4" />
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {/* Document Information */}
      <AppCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <AppInput
              type="text"
              value={documentData.title}
              onChange={e => handleDocumentDataChange('title', e.target.value)}
              placeholder="Enter document title"
              className={cn(errors.title && 'border-red-500')}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <AppSelect
              value={documentData.status}
              onChange={e => handleDocumentDataChange('status', e.target.value)}
              options={statusOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <AppInput
              type="text"
              value={documentData.metadata.category}
              onChange={e => handleDocumentDataChange('metadata.category', e.target.value)}
              placeholder="e.g., Privacy Policies"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <AppInput
              type="text"
              value={documentData.metadata.department}
              onChange={e => handleDocumentDataChange('metadata.department', e.target.value)}
              placeholder="e.g., Compliance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <AppSelect
              value={documentData.metadata.priority}
              onChange={e => handleDocumentDataChange('metadata.priority', e.target.value)}
              options={priorityOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confidentiality</label>
            <AppSelect
              value={documentData.metadata.confidentiality}
              onChange={e => handleDocumentDataChange('metadata.confidentiality', e.target.value)}
              options={confidentialityOptions}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <AppInput
            type="text"
            value={documentData.description}
            onChange={e => handleDocumentDataChange('description', e.target.value)}
            placeholder="Enter document description"
          />
        </div>

        {/* Tags */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {documentData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <AppInput
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={e => e.key === 'Enter' && addTag()}
            />
            <AppButton onClick={addTag} variant="outline">
              Add
            </AppButton>
          </div>
          {errors.tag && <p className="mt-1 text-sm text-red-600">{errors.tag}</p>}
        </div>

        {/* Compliance Requirements */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compliance Requirements
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {documentData.metadata.complianceRequirements.map(requirement => (
              <span
                key={requirement}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-md"
              >
                {requirement}
                <button
                  onClick={() => removeComplianceRequirement(requirement)}
                  className="text-green-600 hover:text-green-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <AppButton onClick={addComplianceRequirement} variant="outline" size="sm">
            Add Compliance Requirement
          </AppButton>
        </div>
      </AppCard>

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
                  <Bars3Icon className="h-4 w-4" />
                </AppButton>

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={cn(editor.isActive('heading', { level: 2 }) && 'bg-gray-100')}
                >
                  <Bars2Icon className="h-4 w-4" />
                </AppButton>

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={cn(editor.isActive('heading', { level: 3 }) && 'bg-gray-100')}
                >
                  <MinusIcon className="h-4 w-4" />
                </AppButton>

                <div className="w-px h-6 bg-gray-300 mx-2" />

                {/* List functionality temporarily disabled due to import issues */}
                {/* <AppButton
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
                  <QueueListIcon className="h-4 w-4" />
                </AppButton> */}

                <div className="w-px h-6 bg-gray-300 mx-2" />

                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={cn(editor.isActive('code') && 'bg-gray-100')}
                >
                  <CodeBracketIcon className="h-4 w-4" />
                </AppButton>

                {/* Link functionality temporarily disabled due to import issues */}
                {/* <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = window.prompt('Enter URL:')
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run()
                    }
                  }}
                  className={cn(editor.isActive('link') && 'bg-gray-100')}
                >
                  <LinkIcon className="h-4 w-4" />
                </AppButton> */}

                {/* Table functionality temporarily disabled due to import issues */}
                {/* <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  <TableCellsIcon className="h-4 w-4" />
                </AppButton> */}
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
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
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
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckIcon className="h-4 w-4" />
              {document ? 'Update Document' : 'Create Document'}
            </>
          )}
        </AppButton>
      </div>
    </div>
  )
}
