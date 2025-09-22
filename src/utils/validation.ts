// Validation utility functions and schemas

export interface ValidationRule {
  required?: boolean | string
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  custom?: (value: any) => boolean | string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Common validation patterns
export const ValidationPatterns = {
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Please enter a valid email address',
  },
  phone: {
    value: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number',
  },
  url: {
    value: /^https?:\/\/.+\..+/,
    message: 'Please enter a valid URL',
  },
  password: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  },
  strongPassword: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
    message:
      'Password must be at least 12 characters with uppercase, lowercase, number, and special character',
  },
  alphanumeric: {
    value: /^[a-zA-Z0-9]+$/,
    message: 'Only letters and numbers are allowed',
  },
  numeric: {
    value: /^\d+$/,
    message: 'Only numbers are allowed',
  },
  alpha: {
    value: /^[a-zA-Z]+$/,
    message: 'Only letters are allowed',
  },
  slug: {
    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    message: 'Only lowercase letters, numbers, and hyphens are allowed',
  },
  zipCode: {
    value: /^\d{5}(-\d{4})?$/,
    message: 'Please enter a valid ZIP code',
  },
  creditCard: {
    value:
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/,
    message: 'Please enter a valid credit card number',
  }
}

// Validation function
export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = []

  // Required validation
  if (rules.required) {
    const isEmpty =
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)

    if (isEmpty) {
      const message = typeof rules.required === 'string' ? rules.required : 'This field is required'
      errors.push(message)
      return { isValid: false, errors }
    }
  }

  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return { isValid: true, errors: [] }
  }

  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength) {
      const minLength =
        typeof rules.minLength === 'number' ? rules.minLength : rules.minLength.value
      const message =
        typeof rules.minLength === 'number'
          ? `Must be at least ${minLength} characters`
          : rules.minLength.message

      if (value.length < minLength) {
        errors.push(message)
      }
    }

    if (rules.maxLength) {
      const maxLength =
        typeof rules.maxLength === 'number' ? rules.maxLength : rules.maxLength.value
      const message =
        typeof rules.maxLength === 'number'
          ? `Must be no more than ${maxLength} characters`
          : rules.maxLength.message

      if (value.length > maxLength) {
        errors.push(message)
      }
    }
  }

  // Pattern validation
  if (rules.pattern) {
    const pattern =
      typeof rules.pattern === 'object' && 'value' in rules.pattern
        ? rules.pattern.value
        : (rules.pattern as RegExp)
    const message =
      typeof rules.pattern === 'object' && 'message' in rules.pattern
        ? rules.pattern.message
        : 'Invalid format'

    if (!pattern.test(String(value))) {
      errors.push(message)
    }
  }

  // Numeric validations
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value)

    if (rules.min) {
      const min = typeof rules.min === 'number' ? rules.min : rules.min.value
      const message = typeof rules.min === 'number' ? `Must be at least ${min}` : rules.min.message

      if (numValue < min) {
        errors.push(message)
      }
    }

    if (rules.max) {
      const max = typeof rules.max === 'number' ? rules.max : rules.max.value
      const message =
        typeof rules.max === 'number' ? `Must be no more than ${max}` : rules.max.message

      if (numValue > max) {
        errors.push(message)
      }
    }
  }

  // Custom validation
  if (rules.custom) {
    const result = rules.custom(value)
    if (result !== true) {
      const message = typeof result === 'string' ? result : 'Invalid value'
      errors.push(message)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validate multiple fields
export const validateForm = (
  data: Record<string, any>,
  schema: Record<string, ValidationRule>
): {
  isValid: boolean
  errors: Record<string, string[]>
} => {
  const errors: Record<string, string[]> = {}
  let isValid = true

  Object.entries(schema).forEach(([field, rules]) => {
    const result = validateField(data[field], rules)
    if (!result.isValid) {
      errors[field] = result.errors
      isValid = false
    }
  })

  return { isValid, errors }
}

// Common validation schemas
export const CommonSchemas = {
  login: {
    email: {
      required: 'Email is required',
      pattern: ValidationPatterns.email,
    },
    password: {
      required: 'Password is required',
      minLength: { value: 6, message: 'Password must be at least 6 characters' },
    }
  },
  },

  register: {
    firstName: {
      required: 'First name is required',
      minLength: { value: 2, message: 'First name must be at least 2 characters' },
      maxLength: { value: 50, message: 'First name must be no more than 50 characters' },
    },
    lastName: {
      required: 'Last name is required',
      minLength: { value: 2, message: 'Last name must be at least 2 characters' },
      maxLength: { value: 50, message: 'Last name must be no more than 50 characters' },
    },
    email: {
      required: 'Email is required',
      pattern: ValidationPatterns.email,
    },
    password: {
      required: 'Password is required',
      pattern: ValidationPatterns.password,
    },
    confirmPassword: {
      required: 'Please confirm your password',
      custom: (value: string, data?: any) => {
        if (data && value !== data.password) {
          return 'Passwords do not match'
        }
        return true
      },
    }
  },

  organization: {
    name: {
      required: 'Organization name is required',
      minLength: { value: 2, message: 'Organization name must be at least 2 characters' },
      maxLength: { value: 100, message: 'Organization name must be no more than 100 characters' },
    },
    type: {
      required: 'Organization type is required',
    },
    email: {
      required: 'Email is required',
      pattern: ValidationPatterns.email,
    },
    phone: {
      pattern: ValidationPatterns.phone,
    },
    website: {
      pattern: ValidationPatterns.url,
    }
  },

  profile: {
    firstName: {
      required: 'First name is required',
      minLength: { value: 2, message: 'First name must be at least 2 characters' },
      maxLength: { value: 50, message: 'First name must be no more than 50 characters' },
    },
    lastName: {
      required: 'Last name is required',
      minLength: { value: 2, message: 'Last name must be at least 2 characters' },
      maxLength: { value: 50, message: 'Last name must be no more than 50 characters' },
    },
    email: {
      required: 'Email is required',
      pattern: ValidationPatterns.email,
    },
    phone: {
      pattern: ValidationPatterns.phone,
    }
  },
}

// Utility functions for common validations
export const isEmail = (email: string): boolean => {
  return ValidationPatterns.email.value.test(email)
}

export const isStrongPassword = (password: string): boolean => {
  return ValidationPatterns.strongPassword.value.test(password)
}

export const isPhoneNumber = (phone: string): boolean => {
  return ValidationPatterns.phone.value.test(phone)
}

export const isUrl = (url: string): boolean => {
  return ValidationPatterns.url.value.test(url)
}

// Password strength checker
export const getPasswordStrength = (
  password: string
): {
  score: number
  feedback: string[]
  strength: 'weak' | 'fair' | 'good' | 'strong'
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else feedback.push('Use at least 8 characters')

  if (password.length >= 12) score += 1
  else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security')

  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Include lowercase letters')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Include uppercase letters')

  if (/\d/.test(password)) score += 1
  else feedback.push('Include numbers')

  if (/[@$!%*?&]/.test(password)) score += 1
  else feedback.push('Include special characters (@$!%*?&)')

  const strength = score <= 2 ? 'weak' : score <= 3 ? 'fair' : score <= 4 ? 'good' : 'strong'

  return { score, feedback, strength }
}
