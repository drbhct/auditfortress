import React, { useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppModal } from '@/components/ui/AppModal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { TemplateWithCategory } from '@/types'

interface TemplateDeleteModalProps {
  template: TemplateWithCategory | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (templateId: string) => Promise<void>
}

export const TemplateDeleteModal: React.FC<TemplateDeleteModalProps> = ({
  template,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (!template) return

    setIsDeleting(true)
    try {
      await onConfirm(template.id)
      onClose()
    } catch (error) {
      console.error('Error deleting template:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!template) return null

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Template"
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Delete "{template.name}"?
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone. The template will be permanently removed from the system.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Warning
              </h4>
              <div className="mt-1 text-sm text-yellow-700">
                <p>This template has been used <strong>{template.usageCount}</strong> times by organizations.</p>
                <p className="mt-1">Deleting it will not affect existing documents, but organizations will no longer be able to create new documents from this template.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <AppButton
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </AppButton>
          <AppButton
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting && <LoadingSpinner size="sm" />}
            Delete Template
          </AppButton>
        </div>
      </div>
    </AppModal>
  )
}
