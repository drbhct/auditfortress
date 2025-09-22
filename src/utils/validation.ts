/**
 * Comprehensive input validation utilities
 * Provides sanitization, validation, and security checks
 */

// Email validation regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Password strength requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
}

// XSS prevention patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
]

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /('|(\\')|(;)|(\-\-)|(\s+or\s+)|(\s+and\s+))/gi,
  /(union\s+select)/gi,
  /(drop\s+table)/gi,
  /(delete\s+from)/gi,
  /(insert\s+into)/gi,
  /(update\s+set)/gi,
]

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings?: string[]
}

export interface PasswordValidationResult extends ValidationResult {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number
}

/**
 * Sanitize input to prevent XSS and other attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return ''
  }

  let sanitized = input.trim()

  // Remove XSS patterns
  XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })

  // Remove SQL injection patterns
  SQL_INJECTION_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '')
  })

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '')

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')

  return sanitized
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!email) {
    errors.push('Email is required')
    return { valid: false, errors, warnings }
  }

  const sanitizedEmail = sanitizeInput(email)

  if (sanitizedEmail !== email) {
    warnings.push('Email contained potentially unsafe characters')
  }

  if (!EMAIL_REGEX.test(sanitizedEmail)) {
    errors.push('Please enter a valid email address')
  }

  if (sanitizedEmail.length > 254) {
    errors.push('Email address is too long')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate password strength
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  let score = 0

  if (!password) {
    errors.push('Password is required')
    return { valid: false, errors, warnings, strength: 'weak', score: 0 }
  }

  // Length check
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`)
  } else {
    score += 1
  }

  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(`Password must be no more than ${PASSWORD_REQUIREMENTS.maxLength} characters long`)
  }

  // Character type checks
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else if (/[A-Z]/.test(password)) {
    score += 1
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else if (/[a-z]/.test(password)) {
    score += 1
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else if (/\d/.test(password)) {
    score += 1
  }

  if (
    PASSWORD_REQUIREMENTS.requireSpecialChars &&
    !PASSWORD_REQUIREMENTS.specialChars.test(password)
  ) {
    errors.push('Password must contain at least one special character')
  } else if (PASSWORD_REQUIREMENTS.specialChars.test(password)) {
    score += 1
  }

  // Common password checks
  const commonPasswords = [
    'password',
    '123456',
    '123456789',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    '1234567890',
  ]

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more unique password')
    score = 0
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak'
  if (score >= 5) {
    strength = 'very-strong'
  } else if (score >= 4) {
    strength = 'strong'
  } else if (score >= 3) {
    strength = 'medium'
  }

  // Additional length bonus
  if (password.length >= 12) {
    score += 1
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    strength,
    score: Math.min(score, 6),
  }
}

/**
 * Validate name fields (first name, last name, etc.)
 */
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!name) {
    errors.push(`${fieldName} is required`)
    return { valid: false, errors, warnings }
  }

  const sanitizedName = sanitizeInput(name)

  if (sanitizedName !== name) {
    warnings.push(`${fieldName} contained potentially unsafe characters`)
  }

  if (sanitizedName.length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`)
  }

  if (sanitizedName.length > 50) {
    errors.push(`${fieldName} must be no more than 50 characters long`)
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(sanitizedName)) {
    errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate organization name
 */
export const validateOrganizationName = (name: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!name) {
    errors.push('Organization name is required')
    return { valid: false, errors, warnings }
  }

  const sanitizedName = sanitizeInput(name)

  if (sanitizedName !== name) {
    warnings.push('Organization name contained potentially unsafe characters')
  }

  if (sanitizedName.length < 2) {
    errors.push('Organization name must be at least 2 characters long')
  }

  if (sanitizedName.length > 100) {
    errors.push('Organization name must be no more than 100 characters long')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate document title
 */
export const validateDocumentTitle = (title: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!title) {
    errors.push('Document title is required')
    return { valid: false, errors, warnings }
  }

  const sanitizedTitle = sanitizeInput(title)

  if (sanitizedTitle !== title) {
    warnings.push('Document title contained potentially unsafe characters')
  }

  if (sanitizedTitle.length < 3) {
    errors.push('Document title must be at least 3 characters long')
  }

  if (sanitizedTitle.length > 200) {
    errors.push('Document title must be no more than 200 characters long')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate template content
 */
export const validateTemplateContent = (content: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!content) {
    errors.push('Template content is required')
    return { valid: false, errors, warnings }
  }

  const sanitizedContent = sanitizeInput(content)

  if (sanitizedContent !== content) {
    warnings.push('Template content contained potentially unsafe characters')
  }

  if (sanitizedContent.length < 10) {
    errors.push('Template content must be at least 10 characters long')
  }

  if (sanitizedContent.length > 100000) {
    errors.push('Template content is too long (maximum 100,000 characters)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate URL
 */
export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!url) {
    errors.push('URL is required')
    return { valid: false, errors, warnings }
  }

  try {
    const urlObj = new URL(url)

    // Check for safe protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('URL must use HTTP or HTTPS protocol')
    }

    // Check for suspicious patterns
    if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('127.0.0.1')) {
      warnings.push('URL points to localhost')
    }
  } catch {
    errors.push('Please enter a valid URL')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate file upload
 */
export const validateFileUpload = (
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}
): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
  } = options

  if (!file) {
    errors.push('File is required')
    return { valid: false, errors, warnings }
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`)
  }

  // Check for suspicious file names
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('File name contains invalid characters')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Generic form validation
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => ValidationResult>
): {
  valid: boolean
  errors: Record<string, string[]>
  warnings: Record<string, string[]>
} => {
  const errors: Record<string, string[]> = {}
  const warnings: Record<string, string[]> = {}
  let valid = true

  Object.entries(rules).forEach(([field, validator]) => {
    const result = validator(data[field])
    if (!result.valid) {
      valid = false
      errors[field] = result.errors
    }
    if (result.warnings && result.warnings.length > 0) {
      warnings[field] = result.warnings
    }
  })

  return { valid, errors, warnings }
}
