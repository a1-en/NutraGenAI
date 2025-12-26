'use client'

import { useState } from 'react'
import { useMealStore } from '@/store/mealStore'
import AppLayout from '@/components/layout/AppLayout'
import OnboardingCheck from '@/components/layout/OnboardingCheck'
import MealPlanGenerator from '@/components/features/MealPlanGenerator'
import MealPlanViewer from '@/components/features/MealPlanViewer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Sparkles,
  Clock,
  Target,
  ArrowRight
} from 'lucide-react'


export default function MealPlanPage() {
  const { currentMealPlan } = useMealStore()
  const [showGenerator, setShowGenerator] = useState(!currentMealPlan)

  const handlePlanGenerated = () => {
    setShowGenerator(false)
  }

  const handleEditPlan = () => {
    setShowGenerator(true)
  }

  const handleRegeneratePlan = () => {
    setShowGenerator(true)
  }

  if (showGenerator || !currentMealPlan) {
    return (
      <OnboardingCheck>
        <AppLayout>
          <div className="space-y-8 p-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border-0 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">AI Meal Planner</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Generate personalized meal plans based on your preferences and health goals in seconds.
                </p>
              </div>

              {currentMealPlan && (
                <Button
                  variant="outline"
                  onClick={() => setShowGenerator(false)}
                  className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary relative z-10 flex items-center gap-2 hover-lift"
                >
                  <Calendar className="w-4 h-4" />
                  View Current Plan
                </Button>
              )}

              <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* Features Info */}
            {!currentMealPlan && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="glass-panel border-0 hover-lift group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-24 h-24 text-amber-500" />
                  </div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center text-xl">
                      <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 mr-3 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      AI-Powered
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground">
                      Advanced AI considers your dietary preferences, health goals, and restrictions to create optimal meal plans.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-0 hover-lift group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="w-24 h-24 text-primary" />
                  </div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center text-xl">
                      <div className="p-2 bg-primary/10 rounded-xl text-primary mr-3 group-hover:scale-110 transition-transform">
                        <Target className="w-5 h-5" />
                      </div>
                      Goal-Oriented
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground">
                      Every meal is designed to help you achieve your specific health and nutrition goals efficiently.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-0 hover-lift group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="w-24 h-24 text-blue-500" />
                  </div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center text-xl">
                      <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 mr-3 group-hover:scale-110 transition-transform">
                        <Clock className="w-5 h-5" />
                      </div>
                      Time-Efficient
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground">
                      Plans include preparation times and can be filtered by available cooking time to suit your schedule.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="glass-panel rounded-3xl p-1 shadow-sm">
              <MealPlanGenerator onPlanGenerated={handlePlanGenerated} />
            </div>
          </div>
        </AppLayout>
      </OnboardingCheck>
    )
  }

  return (
    <OnboardingCheck>
      <AppLayout>
        <div className="p-6 animate-in fade-in duration-500">
          <MealPlanViewer
            mealPlan={currentMealPlan}
            onEdit={handleEditPlan}
            onRegenerate={handleRegeneratePlan}
          />
        </div>
      </AppLayout>
    </OnboardingCheck>
  )
}