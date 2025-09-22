import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { cn } from '@/utils/cn'

interface FormErrorProps {
  error?: string | string[]
  className?: string
}

export const FormError: React.FC<FormErrorProps> = ({ error, className }) => {
  if (!error) return null

  const errors = Array.isArray(error) ? error : [error]

  return (
    <div className={cn('mt-1', className)}>
      {errors.map((err, index) => (
        <div key={index} className="flex items-center text-sm text-red-600">
          <ExclamationTriangleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{err}</span>
        </div>
      ))}
    </div>
  )
}

// Form field wrapper with label and error display
interface FormFieldProps {
  label?: string
  required?: boolean
  error?: string | string[]
  children: React.ReactNode
  className?: string
  labelClassName?: string
  helpText?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  children,
  className,
  labelClassName,
  helpText,
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className={cn('block text-sm font-medium text-gray-700', labelClassName)}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
      <FormError error={error} />
    </div>
  )
}

// Form section with title and description
interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description) && (
        <div className="border-b border-gray-200 pb-4">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  )
}
