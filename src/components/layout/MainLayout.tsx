import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { Sidebar } from './Sidebar'
import { Breadcrumb } from './Breadcrumb'
import { GlobalSearch } from './GlobalSearch'
import { useNavigation } from '@/hooks/useNavigation'

interface MainLayoutProps {
  showSidebar?: boolean
  showBreadcrumb?: boolean
  className?: string
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  showSidebar = false,
  showBreadcrumb = true,
  className = '',
}) => {
  const {
    isSearchOpen,
    isSidebarCollapsed,
    isMobileMenuOpen,
    toggleSearch,
    closeSearch,
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,
  } = useNavigation()

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Navigation */}
      <Navigation />

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebar}
            className="hidden lg:block"
          />
        )}

        {/* Main content */}
        <div className={`flex-1 ${showSidebar ? 'lg:ml-0' : ''}`}>
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <Breadcrumb />
            </div>
          )}

          {/* Page content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Search */}
      <GlobalSearch isOpen={isSearchOpen} onClose={closeSearch} />

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  )
}

// Layout variants for different page types
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MainLayout showSidebar={false} showBreadcrumb={true}>
    {children}
  </MainLayout>
)

export const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MainLayout showSidebar={true} showBreadcrumb={true}>
    {children}
  </MainLayout>
)

export const FullScreenLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MainLayout showSidebar={false} showBreadcrumb={false}>
    {children}
  </MainLayout>
)
