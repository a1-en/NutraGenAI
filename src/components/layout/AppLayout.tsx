'use client'

import { ReactNode, useState } from 'react'
import Navigation from './Navigation'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className={cn(
        "flex-1 relative transition-all duration-300 h-screen overflow-y-auto overflow-x-hidden",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        {/* Mobile header space - Adjust for mobile nav bar */}
        <div className="lg:hidden h-16" style={{ height: 'calc(4rem + env(safe-area-inset-top, 0px))' }} />

        {/* Page content */}
        <main className="flex-1 relative z-10 w-full">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
            <div className="slide-in-up">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}