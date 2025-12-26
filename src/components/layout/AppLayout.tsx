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
        "flex-1 relative transition-all duration-300",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        {/* Mobile header space */}
        <div className="lg:hidden" style={{ height: 'calc(4rem + env(safe-area-inset-top, 0px))' }} />

        {/* Page content */}
        <main className="flex-1 focus:outline-none relative z-10">
          <div className="py-6 px-4 lg:px-8 max-w-7xl mx-auto">
            <div className="slide-in-up">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}