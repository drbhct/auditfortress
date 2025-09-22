import { useCallback } from 'react'
import { useAuth } from './useAuth'
import {
  handleError,
  handleApiError,
  createErrorReport,
  ErrorContext,
  ErrorType,
  ErrorSeverity,
  getUserFriendlyMessage,
} from '@/utils/errorHandler'

/**
 * Hook for consistent error handling across components
 */
export const useErrorHandler = () => {
  const { user } = useAuth()

  /**
   * Handle error with context
   */
  const handleErrorWithContext = useCallback(
    async (error: any, context: Partial<ErrorContext> = {}) => {
      const fullContext: ErrorContext = {
        userId: user?.id,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context,
      }

      return await handleError(error, fullContext)
    },
    [user?.id]
  )

  /**
   * Handle API error and return user-friendly message
   */
  const handleApiErrorWithMessage = useCallback(
    (error: any, context?: Partial<ErrorContext>) => {
      const apiError = handleApiError(error)
      const userMessage = getUserFriendlyMessage(apiError)

      if (context) {
        handleErrorWithContext(error, context)
      }

      return {
        ...apiError,
        userMessage,
      }
    },
    [handleErrorWithContext]
  )

  /**
   * Create error report with current context
   */
  const createErrorReportWithContext = useCallback(
    (error: any, context: Partial<ErrorContext> = {}) => {
      const fullContext: ErrorContext = {
        userId: user?.id,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context,
      }

      return createErrorReport(error, fullContext)
    },
    [user?.id]
  )

  /**
   * Handle validation errors
   */
  const handleValidationError = useCallback(
    (errors: Record<string, string[]>, context?: Partial<ErrorContext>) => {
      const error = new Error('Validation failed')
      error.name = 'ValidationError'

      const errorReport = createErrorReportWithContext(error, {
        ...context,
        action: 'validation',
      })

      return {
        message: 'Please check your input and try again.',
        details: errors,
        errorReport,
      }
    },
    [createErrorReportWithContext]
  )

  /**
   * Handle network errors
   */
  const handleNetworkError = useCallback(
    (error: any, context?: Partial<ErrorContext>) => {
      return handleApiErrorWithMessage(error, {
        ...context,
        action: 'network_request',
      })
    },
    [handleApiErrorWithMessage]
  )

  /**
   * Handle authentication errors
   */
  const handleAuthError = useCallback(
    (error: any, context?: Partial<ErrorContext>) => {
      return handleApiErrorWithMessage(error, {
        ...context,
        action: 'authentication',
      })
    },
    [handleApiErrorWithMessage]
  )

  /**
   * Handle authorization errors
   */
  const handleAuthorizationError = useCallback(
    (error: any, context?: Partial<ErrorContext>) => {
      return handleApiErrorWithMessage(error, {
        ...context,
        action: 'authorization',
      })
    },
    [handleApiErrorWithMessage]
  )

  /**
   * Handle file upload errors
   */
  const handleFileUploadError = useCallback(
    (error: any, context?: Partial<ErrorContext>) => {
      return handleApiErrorWithMessage(error, {
        ...context,
        action: 'file_upload',
      })
    },
    [handleApiErrorWithMessage]
  )

  /**
   * Handle form submission errors
   */
  const handleFormError = useCallback(
    (error: any, formName: string, context?: Partial<ErrorContext>) => {
      return handleApiErrorWithMessage(error, {
        ...context,
        action: 'form_submission',
        component: formName,
      })
    },
    [handleApiErrorWithMessage]
  )

  /**
   * Handle component errors
   */
  const handleComponentError = useCallback(
    (error: any, componentName: string, context?: Partial<ErrorContext>) => {
      return handleApiErrorWithMessage(error, {
        ...context,
        action: 'component_error',
        component: componentName,
      })
    },
    [handleApiErrorWithMessage]
  )

  /**
   * Handle service errors
   */
  const handleServiceError = useCallback(
    (error: any, serviceName: string, context?: Partial<ErrorContext>) => {
      return handleApiErrorWithMessage(error, {
        ...context,
        action: 'service_call',
        component: serviceName,
      })
    },
    [handleApiErrorWithMessage]
  )

  /**
   * Get error severity for UI display
   */
  const getErrorSeverity = useCallback((error: any) => {
    const apiError = handleApiError(error)

    // Map status codes to severity
    if (apiError.status && apiError.status >= 500) {
      return ErrorSeverity.CRITICAL
    }

    if (apiError.status && apiError.status >= 400) {
      return ErrorSeverity.HIGH
    }

    return ErrorSeverity.MEDIUM
  }, [])

  /**
   * Check if error is retryable
   */
  const isRetryableError = useCallback((error: any) => {
    const apiError = handleApiError(error)

    // Network errors are retryable
    if (apiError.code === 'NETWORK_ERROR') {
      return true
    }

    // Server errors are retryable
    if (apiError.status && apiError.status >= 500) {
      return true
    }

    // Rate limiting is retryable
    if (apiError.code === 'RATE_LIMITED') {
      return true
    }

    return false
  }, [])

  /**
   * Get retry delay based on error type
   */
  const getRetryDelay = useCallback((error: any, attempt: number) => {
    const apiError = handleApiError(error)

    // Rate limiting - exponential backoff
    if (apiError.code === 'RATE_LIMITED') {
      return Math.min(1000 * Math.pow(2, attempt), 30000) // Max 30 seconds
    }

    // Server errors - linear backoff
    if (apiError.status && apiError.status >= 500) {
      return 1000 * attempt
    }

    // Default delay
    return 1000
  }, [])

  return {
    // Main error handling
    handleError: handleErrorWithContext,
    handleApiError: handleApiErrorWithMessage,
    createErrorReport: createErrorReportWithContext,

    // Specific error types
    handleValidationError,
    handleNetworkError,
    handleAuthError,
    handleAuthorizationError,
    handleFileUploadError,
    handleFormError,
    handleComponentError,
    handleServiceError,

    // Error utilities
    getErrorSeverity,
    isRetryableError,
    getRetryDelay,

    // Direct access to utilities
    getUserFriendlyMessage,
  }
}
