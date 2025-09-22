import React from 'react'
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { TemplateEditor } from './TemplateEditor'
import { cn } from '@/utils/cn'
import type { TemplateCategory, PolicyTemplate } from '@/types'

interface TemplateEditorModalProps {
  template: PolicyTemplate
  categories: TemplateCategory[]
  isOpen: boolean
  onClose: () => void
  onSave: (template: Omit<PolicyTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  className?: string
}

export function TemplateEditorModal({
  template,
  categories,
  isOpen,
  onClose,
  onSave,
  className,
}: TemplateEditorModalProps) {
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
                <h2 className="text-xl font-semibold text-gray-900">Edit Template</h2>
                <p className="text-sm text-gray-500">{template.name}</p>
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

          {/* Template Editor */}
          <div className="p-6">
            <TemplateEditor
              template={template}
              categories={categories}
              onSave={onSave}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
