import AppLayout from '@/components/layout/AppLayout'
import OnboardingCheck from '@/components/layout/OnboardingCheck'
import RecipeFinder from '@/components/features/RecipeFinder'
import { Card } from '@/components/ui/card'
import { BookOpen, ChefHat } from 'lucide-react'

export default function RecipesPage() {
  return (
    <OnboardingCheck>
      <AppLayout>
        <div className="space-y-8 p-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border-0 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 flex items-center">
                <ChefHat className="w-8 h-8 mr-3 text-primary" />
                Recipe Generator
              </h1>
              <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
                Discover healthy recipes tailored to your ingredients and preferences using AI.
              </p>
            </div>

            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="glass-panel p-1 rounded-3xl">
            <RecipeFinder />
          </div>
        </div>
      </AppLayout>
    </OnboardingCheck>
  )
}