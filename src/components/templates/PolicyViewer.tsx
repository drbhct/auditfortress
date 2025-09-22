import React, { useState } from 'react'
import {
  XMarkIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { cn } from '@/utils/cn'

interface GeneratedPolicy {
  id: string
  templateId: string
  title: string
  content: string
  variables: Record<string, string>
  generatedAt: string
  generatedBy: string
  templateName?: string
  templateCategory?: string
}

interface PolicyViewerProps {
  policy: GeneratedPolicy
  isOpen: boolean
  onClose: () => void
  onEdit?: (policy: GeneratedPolicy) => void
  className?: string
}

export function PolicyViewer({ policy, isOpen, onClose, onEdit, className }: PolicyViewerProps) {
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${policy.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1, h2, h3 { color: #1f2937; }
              .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
              .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${policy.title}</h1>
              <p>Generated from: ${policy.templateName || 'Unknown Template'}</p>
              <p>Date: ${formatDate(policy.generatedAt)}</p>
            </div>
            <div class="content">
              ${policy.content}
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

  const handleDownload = () => {
    const blob = new Blob(
      [
        `
      <html>
        <head>
          <title>${policy.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1, h2, h3 { color: #1f2937; }
            .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${policy.title}</h1>
            <p>Generated from: ${policy.templateName || 'Unknown Template'}</p>
            <p>Date: ${formatDate(policy.generatedAt)}</p>
          </div>
          <div class="content">
            ${policy.content}
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
    a.download = `${policy.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
                <h2 className="text-xl font-semibold text-gray-900">{policy.title}</h2>
                <p className="text-sm text-gray-500">
                  {policy.templateName || 'Unknown Template'} • {formatDate(policy.generatedAt)}
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

              {onEdit && (
                <AppButton
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(policy)}
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
            {/* Policy Info */}
            <AppCard className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Template</h3>
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {policy.templateName || 'Unknown Template'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Generated By</h3>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{policy.generatedBy}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Generated Date</h3>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{formatDate(policy.generatedAt)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                  <span className="text-sm text-gray-900">
                    {policy.templateCategory || 'Unknown Category'}
                  </span>
                </div>
              </div>
            </AppCard>

            {/* Variables */}
            {Object.keys(policy.variables).length > 0 && (
              <AppCard className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Used Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(policy.variables).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <code className="text-sm font-mono text-gray-900">{key}</code>
                        <p className="text-xs text-gray-500 mt-1">Value: {value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AppCard>
            )}

            {/* Policy Content */}
            <AppCard className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showRawContent ? 'Raw HTML Content' : 'Policy Content'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <EyeIcon className="h-4 w-4" />
                  {showRawContent ? 'HTML Source' : 'Rendered Content'}
                </div>
              </div>

              <div className="p-6">
                {showRawContent ? (
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{policy.content}</code>
                  </pre>
                ) : (
                  <div
                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: policy.content }}
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
