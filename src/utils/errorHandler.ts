/**
 * Centralized error handling utilities
 * Provides consistent error handling across the application
 */

export interface ApiError {
  message: string
  code?: string | number
  status?: number
  details?: any
}

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  timestamp?: string
  userAgent?: string
  url?: string
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error types for categorization
 */
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

export interface ErrorReport {
  id: string
  message: string
  type: ErrorType
  severity: ErrorSeverity
  context: ErrorContext
  stack?: string
  timestamp: string
  resolved: boolean
}

/**
 * Standardized error handler for API responses
 */
export const handleApiError = (error: any): ApiError => {
  // Network errors
  if (!error.response) {
    return {
      message: 'Network error. Please check your connection and try again.',
      code: 'NETWORK_ERROR',
      status: 0,
    }
  }

  const { status, data } = error.response

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      return {
        message: data?.message || 'Invalid request. Please check your input and try again.',
        code: 'BAD_REQUEST',
        status,
        details: data?.errors,
      }

    case 401:
      return {
        message: 'Your session has expired. Please log in again.',
        code: 'UNAUTHORIZED',
        status,
      }

    case 403:
      return {
        message: 'You do not have permission to perform this action.',
        code: 'FORBIDDEN',
        status,
      }

    case 404:
      return {
        message: 'The requested resource was not found.',
        code: 'NOT_FOUND',
        status,
      }

    case 409:
      return {
        message: data?.message || 'A conflict occurred. The resource may have been modified.',
        code: 'CONFLICT',
        status,
      }

    case 422:
      return {
        message: data?.message || 'Validation failed. Please check your input.',
        code: 'VALIDATION_ERROR',
        status,
        details: data?.errors,
      }

    case 429:
      return {
        message: 'Too many requests. Please wait a moment and try again.',
        code: 'RATE_LIMITED',
        status,
      }

    case 500:
      return {
        message: 'Internal server error. Please try again later.',
        code: 'SERVER_ERROR',
        status,
      }

    case 502:
    case 503:
    case 504:
      return {
        message: 'Service temporarily unavailable. Please try again later.',
        code: 'SERVICE_UNAVAILABLE',
        status,
      }

    default:
      return {
        message: data?.message || 'An unexpected error occurred.',
        code: 'UNKNOWN_ERROR',
        status,
      }
  }
}

/**
 * Categorize error by type
 */
export const categorizeError = (error: any): ErrorType => {
  if (!error.response) {
    return ErrorType.NETWORK
  }

  const { status } = error.response

  if (status === 401) {
    return ErrorType.AUTHENTICATION
  }

  if (status === 403) {
    return ErrorType.AUTHORIZATION
  }

  if (status === 404) {
    return ErrorType.NOT_FOUND
  }

  if (status >= 500) {
    return ErrorType.SERVER
  }

  if (status >= 400) {
    return ErrorType.CLIENT
  }

  return ErrorType.UNKNOWN
}

/**
 * Determine error severity
 */
export const getErrorSeverity = (error: any, type: ErrorType): ErrorSeverity => {
  // Critical errors
  if (type === ErrorType.SERVER && error.response?.status >= 500) {
    return ErrorSeverity.CRITICAL
  }

  // High severity errors
  if (type === ErrorType.AUTHENTICATION || type === ErrorType.AUTHORIZATION) {
    return ErrorSeverity.HIGH
  }

  // Medium severity errors
  if (type === ErrorType.VALIDATION || type === ErrorType.NOT_FOUND) {
    return ErrorSeverity.MEDIUM
  }

  // Low severity errors
  if (type === ErrorType.NETWORK) {
    return ErrorSeverity.LOW
  }

  return ErrorSeverity.MEDIUM
}

/**
 * Create error report
 */
export const createErrorReport = (error: any, context: ErrorContext = {}): ErrorReport => {
  const type = categorizeError(error)
  const severity = getErrorSeverity(error, type)
  const apiError = handleApiError(error)

  return {
    id: generateErrorId(),
    message: apiError.message,
    type,
    severity,
    context: {
      ...context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    },
    stack: error.stack,
    timestamp: new Date().toISOString(),
    resolved: false,
  }
}

/**
 * Generate unique error ID
 */
const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Log error to console (development only)
 */
export const logError = (error: any, context?: ErrorContext) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Logged')
    console.error('Error:', error)
    if (context) {
      console.error('Context:', context)
    }
    console.groupEnd()
  }
}

/**
 * Report error to external service (production)
 */
export const reportError = async (errorReport: ErrorReport) => {
  // In production, send to error reporting service
  // Example: Sentry.captureException(error, { extra: errorReport })

  if (process.env.NODE_ENV === 'production') {
    try {
      // Example implementation for error reporting service
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }
}

/**
 * Handle error with full processing
 */
export const handleError = async (error: any, context: ErrorContext = {}): Promise<ApiError> => {
  const errorReport = createErrorReport(error, context)

  // Log error
  logError(error, context)

  // Report error
  await reportError(errorReport)

  // Return user-friendly error
  return handleApiError(error)
}

/**
 * Retry mechanism for failed operations
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      // Don't retry on certain error types
      const type = categorizeError(error)
      if (type === ErrorType.AUTHENTICATION || type === ErrorType.AUTHORIZATION) {
        throw error
      }

      if (attempt === maxRetries) {
        throw error
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError
}

/**
 * Timeout wrapper for operations
 */
export const withTimeout = <T>(operation: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
  return Promise.race([
    operation,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ])
}

/**
 * Error boundary helper for async operations
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: ErrorContext = {}
): Promise<{ success: boolean; data?: T; error?: ApiError }> => {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    const apiError = await handleError(error, context)
    return { success: false, error: apiError }
  }
}

/**
 * Validation error formatter
 */
export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  const errorMessages = Object.entries(errors).map(([field, messages]) => {
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
    return `${fieldName}: ${messages.join(', ')}`
  })

  return errorMessages.join('\n')
}

/**
 * User-friendly error messages
 */
export const getUserFriendlyMessage = (error: ApiError): string => {
  // Customize messages based on error code
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Unable to connect to the server. Please check your internet connection and try again.'

    case 'UNAUTHORIZED':
      return 'Your session has expired. Please log in again to continue.'

    case 'FORBIDDEN':
      return 'You do not have permission to perform this action. Please contact your administrator if you believe this is an error.'

    case 'NOT_FOUND':
      return 'The requested item could not be found. It may have been deleted or moved.'

    case 'VALIDATION_ERROR':
      return error.details
        ? formatValidationErrors(error.details)
        : 'Please check your input and try again.'

    case 'RATE_LIMITED':
      return 'You are making requests too quickly. Please wait a moment before trying again.'

    case 'SERVER_ERROR':
      return 'Something went wrong on our end. We have been notified and are working to fix it. Please try again later.'

    case 'SERVICE_UNAVAILABLE':
      return 'Our service is temporarily unavailable. Please try again in a few minutes.'

    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}
