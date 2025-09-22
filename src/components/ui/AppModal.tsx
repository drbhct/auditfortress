import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AppButton } from './AppButton'
import { cn } from '@/utils/cn'

interface AppModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  footer?: React.ReactNode
  className?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
}

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  footer,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus()
      }, 0)

      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }

      // Restore body scroll
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  // Handle focus trap
  const handleKeyDown = (event: React.KeyEvent) => {
    if (event.key === 'Tab') {
      const modal = modalRef.current
      if (!modal) return

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          event.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          event.preventDefault()
        }
      }
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={cn(
            'relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all',
            sizeClasses[size],
            className
          )}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                {title && (
                  <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {description && (
                  <p id="modal-description" className="mt-1 text-sm text-gray-500">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Convenience components for common modal patterns
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm()
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      default:
        return 'text-gray-900'
    }
  }

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger' as const
      case 'warning':
        return 'warning' as const
      default:
        return 'primary' as const
    }
  }

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <AppButton variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </AppButton>
          <AppButton variant={getButtonVariant()} onClick={handleConfirm} loading={isLoading}>
            {confirmText}
          </AppButton>
        </>
      }
    >
      <p className={cn('text-sm', getVariantStyles())}>{message}</p>
    </AppModal>
  )
}

// Form modal wrapper
interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  onSubmit?: () => void
  submitText?: string
  cancelText?: string
  isLoading?: boolean
  submitDisabled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitText = 'Save',
  cancelText = 'Cancel',
  isLoading = false,
  submitDisabled = false,
  size = 'md',
}) => {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      footer={
        onSubmit && (
          <>
            <AppButton variant="secondary" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </AppButton>
            <AppButton
              variant="primary"
              onClick={onSubmit}
              loading={isLoading}
              disabled={submitDisabled}
            >
              {submitText}
            </AppButton>
          </>
        )
      }
    >
      {children}
    </AppModal>
  )
}
