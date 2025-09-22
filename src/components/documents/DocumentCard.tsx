import React from 'react'
import {
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { cn } from '@/utils/cn'
import type { Document, DocumentStatus, DocumentPriority, ConfidentialityLevel } from '@/types'

interface DocumentCardProps {
  document: Document
  onView?: (document: Document) => void
  onEdit?: (document: Document) => void
  onDelete?: (document: Document) => void
  onShare?: (document: Document) => void
  className?: string
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  pending_approval: 'bg-orange-100 text-orange-800',
  approved: 'bg-green-100 text-green-800',
  published: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-800',
  rejected: 'bg-red-100 text-red-800',
}

const statusLabels = {
  draft: 'Draft',
  in_review: 'In Review',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  published: 'Published',
  archived: 'Archived',
  rejected: 'Rejected',
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const confidentialityColors = {
  public: 'bg-green-100 text-green-800',
  internal: 'bg-blue-100 text-blue-800',
  confidential: 'bg-orange-100 text-orange-800',
  restricted: 'bg-red-100 text-red-800',
}

const confidentialityLabels = {
  public: 'Public',
  internal: 'Internal',
  confidential: 'Confidential',
  restricted: 'Restricted',
}

const getStatusIcon = (status: DocumentStatus) => {
  const icons = {
    draft: <PencilIcon className="h-4 w-4" />,
    in_review: <ClockIcon className="h-4 w-4" />,
    pending_approval: <ExclamationTriangleIcon className="h-4 w-4" />,
    approved: <CheckCircleIcon className="h-4 w-4" />,
    published: <CheckCircleIcon className="h-4 w-4" />,
    archived: <ArchiveBoxIcon className="h-4 w-4" />,
    rejected: <XCircleIcon className="h-4 w-4" />,
  }
  return icons[status] || <DocumentTextIcon className="h-4 w-4" />
}

export function DocumentCard({
  document,
  onView,
  onEdit,
  onDelete,
  onShare,
  className,
}: DocumentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getWorkflowProgress = () => {
    const completedSteps = document.workflow.steps.filter(
      step => step.status === 'completed'
    ).length
    return Math.round((completedSteps / document.workflow.totalSteps) * 100)
  }

  const isWorkflowInProgress = document.workflow.status === 'in_progress'
  const workflowProgress = getWorkflowProgress()

  return (
    <AppCard
      className={cn(
        'flex flex-col justify-between h-full hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{document.title}</h3>
            {document.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{document.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full',
              statusColors[document.status]
            )}
          >
            {getStatusIcon(document.status)}
            {statusLabels[document.status]}
          </span>
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-3 mb-4">
        {/* Priority and Confidentiality */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex px-2 py-1 text-xs font-medium rounded-full',
              priorityColors[document.metadata.priority]
            )}
          >
            {priorityLabels[document.metadata.priority]}
          </span>
          <span
            className={cn(
              'inline-flex px-2 py-1 text-xs font-medium rounded-full',
              confidentialityColors[document.metadata.confidentiality]
            )}
          >
            {confidentialityLabels[document.metadata.confidentiality]}
          </span>
        </div>

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <TagIcon className="h-4 w-4 text-gray-400" />
            {document.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{document.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Workflow Progress */}
        {isWorkflowInProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Workflow Progress</span>
              <span className="text-gray-900">{workflowProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${workflowProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Step {document.workflow.currentStep} of {document.workflow.totalSteps}
            </p>
          </div>
        )}

        {/* Document Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <UserIcon className="h-4 w-4" />
            <span>{document.collaborators.length} collaborators</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>v{document.version}</span>
          </div>
        </div>

        {/* File Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatFileSize(document.metadata.fileSize)}</span>
          <span>{document.metadata.wordCount} words</span>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Created {formatDate(document.createdAt)}</span>
          <span>Updated {formatDate(document.updatedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
        {onView && (
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onView(document)}
            className="flex-1 flex items-center gap-1"
          >
            <EyeIcon className="h-4 w-4" />
            View
          </AppButton>
        )}

        {onEdit && (
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onEdit(document)}
            className="flex-1 flex items-center gap-1"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </AppButton>
        )}

        {onShare && (
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onShare(document)}
            className="flex items-center gap-1"
          >
            <ShareIcon className="h-4 w-4" />
          </AppButton>
        )}

        {onDelete && (
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => onDelete(document)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </AppButton>
        )}
      </div>
    </AppCard>
  )
}
