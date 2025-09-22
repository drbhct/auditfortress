import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface NavigationState {
  currentPath: string
  previousPath: string | null
  history: string[]
  breadcrumbs: Array<{
    label: string
    path?: string
    current?: boolean
  }>
  isNavigating: boolean
}

export interface UseNavigationReturn {
  // State
  navigationState: NavigationState
  isSearchOpen: boolean
  isSidebarCollapsed: boolean
  isMobileMenuOpen: boolean

  // Actions
  navigateTo: (path: string) => void
  goBack: () => void
  goForward: () => void
  toggleSearch: () => void
  closeSearch: () => void
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void

  // Utilities
  canGoBack: boolean
  canGoForward: boolean
  isCurrentPath: (path: string) => boolean
  getBreadcrumbs: () => Array<{
    label: string
    path?: string
    current?: boolean
  }>
}

// Route to breadcrumb mapping
const routeBreadcrumbs: Record<
  string,
  Array<{ label: string; path?: string; current?: boolean }>
> = {
  '/dashboard': [{ label: 'Dashboard', current: true }],
  '/documents': [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Documents', current: true },
  ],
  '/compliance': [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Compliance', current: true },
  ],
  '/analytics': [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Analytics', current: true },
  ],
  '/superadmin': [{ label: 'SuperAdmin', current: true }],
  '/superadmin/organizations': [
    { label: 'SuperAdmin', path: '/superadmin' },
    { label: 'Organizations', current: true },
  ],
  '/superadmin/users': [
    { label: 'SuperAdmin', path: '/superadmin' },
    { label: 'Global Users', current: true },
  ],
  '/superadmin/templates': [
    { label: 'SuperAdmin', path: '/superadmin' },
    { label: 'Templates', current: true },
  ],
  '/profile': [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', current: true },
  ],
  '/settings': [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Settings', current: true },
  ],
}

// Generate breadcrumbs dynamically for nested routes
const generateBreadcrumbs = (
  pathname: string
): Array<{ label: string; path?: string; current?: boolean }> => {
  // Check if we have a predefined breadcrumb
  if (routeBreadcrumbs[pathname]) {
    return routeBreadcrumbs[pathname]
  }

  // Generate breadcrumbs dynamically
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs: Array<{ label: string; path?: string; current?: boolean }> = []

  // Always start with home/dashboard
  if (pathSegments[0] === 'superadmin') {
    breadcrumbs.push({ label: 'SuperAdmin', path: '/superadmin' })
  } else {
    breadcrumbs.push({ label: 'Dashboard', path: '/dashboard' })
  }

  // Build breadcrumbs from path segments
  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Skip if this is the last segment (current page)
    if (index === pathSegments.length - 1) {
      breadcrumbs.push({
        label: segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        current: true,
      })
    } else {
      breadcrumbs.push({
        label: segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        path: currentPath,
      })
    }
  })

  return breadcrumbs
}

export const useNavigation = (): UseNavigationReturn => {
  const location = useLocation()
  const navigate = useNavigate()

  // State
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPath: location.pathname,
    previousPath: null,
    history: [location.pathname],
    breadcrumbs: generateBreadcrumbs(location.pathname),
    isNavigating: false,
  })

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Update navigation state when location changes
  useEffect(() => {
    setNavigationState(prev => {
      const newPath = location.pathname
      const isNewPath = newPath !== prev.currentPath

      if (isNewPath) {
        return {
          currentPath: newPath,
          previousPath: prev.currentPath,
          history: [...prev.history, newPath],
          breadcrumbs: generateBreadcrumbs(newPath),
          isNavigating: true,
        }
      }

      return {
        ...prev,
        isNavigating: false,
      }
    })

    // Close mobile menu when navigating
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Actions
  const navigateTo = useCallback(
    (path: string) => {
      setNavigationState(prev => ({ ...prev, isNavigating: true }))
      navigate(path)
    },
    [navigate]
  )

  const goBack = useCallback(() => {
    if (navigationState.history.length > 1) {
      const previousPath = navigationState.history[navigationState.history.length - 2]
      navigate(previousPath)
    }
  }, [navigate, navigationState.history])

  const goForward = useCallback(() => {
    // Note: React Router doesn't have a built-in forward function
    // This would need to be implemented with a custom history stack
    console.log('Forward navigation not implemented')
  }, [])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev)
  }, [])

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Utilities
  const canGoBack = navigationState.history.length > 1
  const canGoForward = false // Not implemented

  const isCurrentPath = useCallback(
    (path: string) => {
      if (path === '/superadmin') {
        return location.pathname === '/superadmin'
      }
      return location.pathname.startsWith(path)
    },
    [location.pathname]
  )

  const getBreadcrumbs = useCallback(() => {
    return generateBreadcrumbs(location.pathname)
  }, [location.pathname])

  return {
    // State
    navigationState,
    isSearchOpen,
    isSidebarCollapsed,
    isMobileMenuOpen,

    // Actions
    navigateTo,
    goBack,
    goForward,
    toggleSearch,
    closeSearch,
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,

    // Utilities
    canGoBack,
    canGoForward,
    isCurrentPath,
    getBreadcrumbs,
  }
}

// Hook for keyboard shortcuts
export const useKeyboardShortcuts = () => {
  const { toggleSearch, closeSearch, goBack, navigateTo } = useNavigation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        toggleSearch()
      }

      // Escape to close search
      if (e.key === 'Escape') {
        closeSearch()
      }

      // Alt + Left Arrow for back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      }

      // Ctrl/Cmd + 1-9 for quick navigation
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        const shortcuts: Record<string, string> = {
          '1': '/dashboard',
          '2': '/documents',
          '3': '/compliance',
          '4': '/analytics',
          '5': '/superadmin',
        }
        const path = shortcuts[e.key]
        if (path) {
          navigateTo(path)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleSearch, closeSearch, goBack, navigateTo])
}
