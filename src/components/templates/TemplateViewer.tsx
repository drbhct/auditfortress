import React, { useState } from 'react'
import {
  XMarkIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { cn } from '@/utils/cn'
import type { TemplateWithCategory } from '@/types'

interface TemplateViewerProps {
  template: TemplateWithCategory
  isOpen: boolean
  onClose: () => void
  onEdit?: (template: TemplateWithCategory) => void
  className?: string
}

export function TemplateViewer({
  template,
  isOpen,
  onClose,
  onEdit,
  className,
}: TemplateViewerProps) {
  const [showRawContent, setShowRawContent] = useState(false)

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPreviewContent = () => {
    let content = template.content

    // Replace variables with placeholder text
    if (template.variables) {
      Object.entries(template.variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        content = content.replace(regex, `[${key}]`)
      })
    }

    return content
  }

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  }

  const statusLabels = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
  }

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
                <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
                <p className="text-sm text-gray-500">
                  {template.category.name} • {statusLabels[template.status]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AppButton
                variant="outline"
                size="sm"
                onClick={() => setShowRawContent(!showRawContent)}
                className="flex items-center gap-2"
              >
                <CodeBracketIcon className="h-4 w-4" />
                {showRawContent ? 'Preview' : 'Raw HTML'}
              </AppButton>

              {onEdit && (
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(template)}
                  className="flex items-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </AppButton>
              )}

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
            {/* Template Info */}
            <AppCard className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                  <p className="text-sm text-gray-900">
                    {template.description || 'No description provided'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{template.category.name}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
                  <span
                    className={cn(
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      statusColors[template.status]
                    )}
                  >
                    {statusLabels[template.status]}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Created By</h3>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{template.createdBy}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h3>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{formatDate(template.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </AppCard>

            {/* Variables */}
            {template.variables && Object.keys(template.variables).length > 0 && (
              <AppCard className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(template.variables).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <code className="text-sm font-mono text-gray-900">{`{{${key}}}`}</code>
                        <p className="text-xs text-gray-500 mt-1">
                          Default: {typeof value === 'string' ? value : String(value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AppCard>
            )}

            {/* Template Content */}
            <AppCard className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showRawContent ? 'Raw HTML Content' : 'Template Preview'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <EyeIcon className="h-4 w-4" />
                  {showRawContent ? 'HTML Source' : 'Rendered Preview'}
                </div>
              </div>

              <div className="p-6">
                {showRawContent ? (
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{template.content}</code>
                  </pre>
                ) : (
                  <div
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                  />
                )}
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </div>
  )
}
