import React from 'react'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline'
import { AppCard } from '@/components/ui/AppCard'
import { AppButton } from '@/components/ui/AppButton'
import { cn } from '@/utils/cn'
import type { TemplateWithCategory } from '@/types'

interface TemplateCardProps {
  template: TemplateWithCategory
  onView?: (template: TemplateWithCategory) => void
  onEdit?: (template: TemplateWithCategory) => void
  onDelete?: (template: TemplateWithCategory) => void
  onGeneratePolicy?: (template: TemplateWithCategory) => void
  className?: string
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

export function TemplateCard({
  template,
  onView,
  onEdit,
  onDelete,
  onGeneratePolicy,
  className,
}: TemplateCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const getPreview = (content: string, maxLength: number = 150) => {
    const text = stripHtml(content)
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <AppCard className={cn('p-6 hover:shadow-lg transition-shadow', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{template.name}</h3>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <TagIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{template.category.name}</span>
            <span className="text-gray-300">•</span>
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                statusColors[template.status]
              )}
            >
              {statusLabels[template.status]}
            </span>
          </div>
        </div>
      </div>

      {template.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
      )}

      <div className="mb-4">
        <p className="text-sm text-gray-500 line-clamp-3">{getPreview(template.content)}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Updated {formatDate(template.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" />
            <span>By {template.createdBy}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onView && (
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onView(template)}
            className="flex-1"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </AppButton>
        )}

        {onEdit && (
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onEdit(template)}
            className="flex-1"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </AppButton>
        )}

        {onGeneratePolicy && (
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onGeneratePolicy(template)}
            className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
            Generate
          </AppButton>
        )}

        {onDelete && (
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onDelete(template)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </AppButton>
        )}
      </div>
    </AppCard>
  )
}
