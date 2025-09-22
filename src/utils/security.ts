/**
 * Security utilities for the application
 * Provides session management, rate limiting, and security checks
 */

// Session configuration
const SESSION_CONFIG = {
  TIMEOUT: 30 * 60 * 1000, // 30 minutes
  WARNING_TIME: 5 * 60 * 1000, // 5 minutes before timeout
  REFRESH_INTERVAL: 5 * 60 * 1000, // Refresh every 5 minutes
}

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  LOGIN_ATTEMPTS: {
    MAX_ATTEMPTS: 5,
    WINDOW: 15 * 60 * 1000, // 15 minutes
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },
  API_CALLS: {
    MAX_CALLS: 100,
    WINDOW: 60 * 1000, // 1 minute
  },
}

// Security headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

/**
 * Session management utilities
 */
export class SessionManager {
  private static instance: SessionManager
  private lastActivity: number = Date.now()
  private warningShown: boolean = false
  private refreshTimer: NodeJS.Timeout | null = null

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  /**
   * Initialize session management
   */
  initialize() {
    this.startActivityTracking()
    this.startRefreshTimer()
    this.checkSessionTimeout()
  }

  /**
   * Track user activity
   */
  private startActivityTracking() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    const updateActivity = () => {
      this.lastActivity = Date.now()
      this.warningShown = false
      localStorage.setItem('lastActivity', this.lastActivity.toString())
    }

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    // Check for activity on page focus
    window.addEventListener('focus', updateActivity)
  }

  /**
   * Start refresh timer
   */
  private startRefreshTimer() {
    this.refreshTimer = setInterval(() => {
      this.checkSessionTimeout()
    }, SESSION_CONFIG.REFRESH_INTERVAL)
  }

  /**
   * Check if session should timeout
   */
  private checkSessionTimeout() {
    const now = Date.now()
    const timeSinceActivity = now - this.lastActivity
    const timeUntilTimeout = SESSION_CONFIG.TIMEOUT - timeSinceActivity

    // Show warning if approaching timeout
    if (timeUntilTimeout <= SESSION_CONFIG.WARNING_TIME && !this.warningShown) {
      this.showSessionWarning(timeUntilTimeout)
      this.warningShown = true
    }

    // Timeout session
    if (timeSinceActivity >= SESSION_CONFIG.TIMEOUT) {
      this.timeoutSession()
    }
  }

  /**
   * Show session timeout warning
   */
  private showSessionWarning(timeUntilTimeout: number) {
    const minutes = Math.ceil(timeUntilTimeout / 60000)

    // You can replace this with a proper notification system
    if (
      confirm(`Your session will expire in ${minutes} minute(s). Click OK to extend your session.`)
    ) {
      this.extendSession()
    }
  }

  /**
   * Extend session
   */
  extendSession() {
    this.lastActivity = Date.now()
    this.warningShown = false
    localStorage.setItem('lastActivity', this.lastActivity.toString())
  }

  /**
   * Timeout session
   */
  private timeoutSession() {
    this.cleanup()

    // Clear auth data
    localStorage.removeItem('auth-storage')
    sessionStorage.clear()

    // Redirect to login
    window.location.href = '/login?reason=session_timeout'
  }

  /**
   * Cleanup session management
   */
  cleanup() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  /**
   * Get time until session timeout
   */
  getTimeUntilTimeout(): number {
    const now = Date.now()
    const timeSinceActivity = now - this.lastActivity
    return Math.max(0, SESSION_CONFIG.TIMEOUT - timeSinceActivity)
  }

  /**
   * Check if session is active
   */
  isSessionActive(): boolean {
    return this.getTimeUntilTimeout() > 0
  }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private static attempts: Map<string, number[]> = new Map()
  private static apiCalls: Map<string, number[]> = new Map()

  /**
   * Check login attempt rate limit
   */
  static checkLoginAttempts(identifier: string): {
    allowed: boolean
    remainingAttempts: number
    lockoutTime?: number
  } {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(
      time => now - time < RATE_LIMIT_CONFIG.LOGIN_ATTEMPTS.WINDOW
    )

    if (recentAttempts.length >= RATE_LIMIT_CONFIG.LOGIN_ATTEMPTS.MAX_ATTEMPTS) {
      const oldestAttempt = Math.min(...recentAttempts)
      const lockoutTime = oldestAttempt + RATE_LIMIT_CONFIG.LOGIN_ATTEMPTS.WINDOW

      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutTime: lockoutTime - now,
      }
    }

    this.attempts.set(identifier, recentAttempts)

    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.LOGIN_ATTEMPTS.MAX_ATTEMPTS - recentAttempts.length,
    }
  }

  /**
   * Record login attempt
   */
  static recordLoginAttempt(identifier: string, success: boolean) {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []

    if (success) {
      // Clear attempts on successful login
      this.attempts.delete(identifier)
    } else {
      // Add failed attempt
      attempts.push(now)
      this.attempts.set(identifier, attempts)
    }
  }

  /**
   * Check API call rate limit
   */
  static checkApiRateLimit(identifier: string): { allowed: boolean; remainingCalls: number } {
    const now = Date.now()
    const calls = this.apiCalls.get(identifier) || []

    // Remove old calls outside the window
    const recentCalls = calls.filter(time => now - time < RATE_LIMIT_CONFIG.API_CALLS.WINDOW)

    if (recentCalls.length >= RATE_LIMIT_CONFIG.API_CALLS.MAX_CALLS) {
      return {
        allowed: false,
        remainingCalls: 0,
      }
    }

    return {
      allowed: true,
      remainingCalls: RATE_LIMIT_CONFIG.API_CALLS.MAX_CALLS - recentCalls.length,
    }
  }

  /**
   * Record API call
   */
  static recordApiCall(identifier: string) {
    const now = Date.now()
    const calls = this.apiCalls.get(identifier) || []
    calls.push(now)
    this.apiCalls.set(identifier, calls)
  }

  /**
   * Clear rate limit data
   */
  static clearRateLimit(identifier: string) {
    this.attempts.delete(identifier)
    this.apiCalls.delete(identifier)
  }
}

/**
 * Security validation utilities
 */
export class SecurityValidator {
  /**
   * Validate IP address format
   */
  static isValidIP(ip: string): boolean {
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  /**
   * Get client IP address (if available)
   */
  static getClientIP(): string | null {
    // This is a simplified version - in production, you'd get this from your server
    return localStorage.getItem('clientIP') || null
  }

  /**
   * Check if request is from a suspicious source
   */
  static isSuspiciousRequest(userAgent: string, ip?: string): boolean {
    // Check for common bot patterns
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
    ]

    if (botPatterns.some(pattern => pattern.test(userAgent))) {
      return true
    }

    // Check for suspicious IP patterns (simplified)
    if (ip && (ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.'))) {
      return false // Local IPs are usually safe
    }

    return false
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Hash sensitive data (client-side, not for passwords)
   */
  static hashData(data: string): string {
    // Simple hash for non-sensitive data - use proper hashing for sensitive data
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16)
  }
}

/**
 * Content Security Policy utilities
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://*.supabase.co'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
}

/**
 * Initialize security features
 */
export const initializeSecurity = () => {
  // Initialize session management
  const sessionManager = SessionManager.getInstance()
  sessionManager.initialize()

  // Set security headers (if possible)
  if (typeof document !== 'undefined') {
    // Add security meta tags
    const metaTags = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { name: 'robots', content: 'noindex, nofollow' },
    ]

    metaTags.forEach(tag => {
      if (!document.querySelector(`meta[name="${tag.name}"]`)) {
        const meta = document.createElement('meta')
        meta.name = tag.name
        meta.content = tag.content
        document.head.appendChild(meta)
      }
    })
  }

  // Set up global error handling
  window.addEventListener('error', event => {
    console.error('Global error:', event.error)
    // Report to error tracking service
  })

  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason)
    // Report to error tracking service
  })
}

/**
 * Cleanup security features
 */
export const cleanupSecurity = () => {
  const sessionManager = SessionManager.getInstance()
  sessionManager.cleanup()
}
