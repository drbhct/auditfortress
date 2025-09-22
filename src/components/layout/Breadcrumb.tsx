import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

interface BreadcrumbItem {
  label: string
  path?: string
  current?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

// Route to breadcrumb mapping
const routeBreadcrumbs: Record<string, BreadcrumbItem[]> = {
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

// Dynamic breadcrumb generation for nested routes
const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  // Check if we have a predefined breadcrumb
  if (routeBreadcrumbs[pathname]) {
    return routeBreadcrumbs[pathname]
  }

  // Generate breadcrumbs dynamically
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

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

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation()
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname)

  // Don't show breadcrumb if we're on the root dashboard
  if (location.pathname === '/dashboard' || location.pathname === '/superadmin') {
    return null
  }

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500 transition-colors">
              <HomeIcon className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
              {item.current ? (
                <span className="text-sm font-medium text-gray-900" aria-current="page">
                  {item.label}
                </span>
              ) : item.path ? (
                <Link
                  to={item.path}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-500">{item.label}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Hook for getting breadcrumb items
export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation()
  return generateBreadcrumbs(location.pathname)
}
