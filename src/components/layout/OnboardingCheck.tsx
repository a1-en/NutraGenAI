'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import UserProfileForm from '@/components/features/UserProfileForm'
import { Logo } from '@/components/ui/logo'

interface OnboardingCheckProps {
  children: React.ReactNode
}

export default function OnboardingCheck({ children }: OnboardingCheckProps) {
  const { profile, isAuthenticated } = useUserStore()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for hydration
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!profile || !isAuthenticated) {
        setShowOnboarding(true)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [profile, isAuthenticated])

  // Show loading state during hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6 p-8">
          <div className="relative">
            <div className="w-16 h-16 pulse-glow">
              <Logo size="xl" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-xl font-semibold text-foreground">Loading NutraGenAI</div>
            <div className="text-sm text-muted-foreground">Preparing your personalized experience...</div>
          </div>
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show onboarding if no profile exists
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <UserProfileForm onComplete={() => setShowOnboarding(false)} />
      </div>
    )
  }

  // Show main app content
  return <>{children}</>
}