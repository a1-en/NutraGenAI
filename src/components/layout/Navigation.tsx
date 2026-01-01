'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  User,
  Calendar,
  BookOpen,
  Camera,
  BarChart3,
  MessageCircle,
  Trophy,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Logo } from '@/components/ui/logo'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Meal Plan', href: '/meal-plan', icon: Calendar },
  { name: 'Recipes', href: '/recipes', icon: BookOpen },
  { name: 'Food Log', href: '/food-log', icon: Camera },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'AI Coach', href: '/coach', icon: MessageCircle },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
]

interface NavigationProps {
  isCollapsed?: boolean
  toggleSidebar?: () => void
}

export default function Navigation({ isCollapsed = false, toggleSidebar }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 glass-panel border-r-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <div className="flex flex-col flex-1 min-h-0">
          <div className={cn(
            "flex items-center h-20 gradient-primary shadow-lg transition-all duration-300",
            isCollapsed ? "justify-center px-2" : "justify-between px-6"
          )}>
            {!isCollapsed ? (
              <>
                <Logo size="lg" showText={true} className="text-white" />
                <div className="flex items-center gap-2">
                  <div className="text-white">
                    <ThemeToggle />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>

          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto overflow-x-hidden">
            <nav className="mt-4 flex-1 px-3 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden',
                      isCollapsed ? 'justify-center px-2' : 'px-4',
                      isActive
                        ? 'text-primary-foreground shadow-lg scale-[1.02]'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground hover:scale-[1.02]'
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    {isActive && (
                      <div className="absolute inset-0 gradient-primary opacity-100" />
                    )}
                    <item.icon
                      className={cn(
                        'flex-shrink-0 h-5 w-5 transition-all duration-300 relative z-10',
                        !isCollapsed && 'mr-4',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'
                      )}
                    />
                    {!isCollapsed && (
                      <span className="font-semibold relative z-10 whitespace-nowrap opacity-100 transition-opacity duration-300">{item.name}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse relative z-10 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="px-3 mt-auto space-y-4">
              {!isCollapsed ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 mx-3 mb-2">
                  <p className="text-xs font-medium text-primary mb-1">Premium Plan</p>
                  <p className="text-xs text-muted-foreground mb-3">Get unlimited AI access</p>
                  <Button size="sm" className="w-full text-xs gradient-primary border-0 shadow-lg hover:shadow-primary/25">Upgrade Now</Button>
                </div>
              ) : (
                <div className="flex justify-center mb-2">
                  <Button size="icon" variant="ghost" className="rounded-full w-10 h-10 bg-primary/10 text-primary hover:bg-primary/20">
                    <Trophy className="w-5 h-5" />
                  </Button>
                </div>
              )}

              {isCollapsed && (
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/40 px-4 py-3 shadow-sm" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}>
          <div className="flex items-center justify-between">
            <Logo size="md" showText={true} />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden hover:bg-accent"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-xs glass-panel border-r border-border/40 shadow-2xl slide-in-left flex flex-col">
              <div className="flex items-center justify-between h-20 px-6 gradient-primary text-white shrink-0" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
                <Logo size="lg" showText={true} />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:bg-white/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                <nav className="space-y-1.5">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'group flex items-center px-4 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 relative overflow-hidden',
                          isActive
                            ? 'text-primary-foreground shadow-md scale-[1.02]'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                      >
                        {isActive && (
                          <div className="absolute inset-0 gradient-primary" />
                        )}
                        <item.icon
                          className={cn(
                            'mr-4 flex-shrink-0 h-5 w-5 relative z-10',
                            isActive ? 'text-primary-foreground text-white' : 'text-muted-foreground group-hover:text-primary transition-colors'
                          )}
                        />
                        <span className="relative z-10">{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full relative z-10 shadow-sm" />
                        )}
                      </Link>
                    )
                  })}
                </nav>

                <div className="pt-6 border-t border-border/40">
                  <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">NutraGenAI Pro</p>
                    <p className="text-xs text-muted-foreground mb-4 font-medium">Unlock all features and AI capabilities</p>
                    <Button className="w-full gradient-primary text-xs font-black h-10 rounded-xl shadow-lg shadow-primary/20">Upgrade Now</Button>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/40 shrink-0 flex items-center justify-between">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Theme Selection</p>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}