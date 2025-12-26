'use client'

import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { useMealStore } from '@/store/mealStore'
import { aiService } from '@/lib/ai'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ChefHat,
  Sparkles,
  RefreshCw,
  Settings,
  Brain,
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  Timer
} from 'lucide-react'
import { generateId, formatCalories, cn } from '@/lib/utils'
import type { MealPlan, DailyMeals, Meal, NutritionInfo } from '@/types'

// Mock meal data for demo purposes
const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Greek Yogurt Parfait',
    type: 'breakfast',
    foods: [],
    totalNutrition: { calories: 280, protein: 20, carbs: 35, fat: 8, fiber: 6, sugar: 25, sodium: 120 },
    preparationTime: 5,
    instructions: ['Layer yogurt with berries', 'Add granola on top', 'Drizzle with honey'],
    image: '/meal-images/yogurt-parfait.jpg'
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    type: 'lunch',
    foods: [],
    totalNutrition: { calories: 420, protein: 35, carbs: 20, fat: 22, fiber: 8, sugar: 12, sodium: 580 },
    preparationTime: 20,
    instructions: ['Grill chicken breast', 'Prepare mixed greens', 'Add vegetables and dressing'],
    image: '/meal-images/chicken-salad.jpg'
  },
  {
    id: '3',
    name: 'Salmon with Quinoa',
    type: 'dinner',
    foods: [],
    totalNutrition: { calories: 520, protein: 40, carbs: 45, fat: 18, fiber: 6, sugar: 8, sodium: 420 },
    preparationTime: 30,
    instructions: ['Cook quinoa', 'Season and bake salmon', 'Steam vegetables'],
    image: '/meal-images/salmon-quinoa.jpg'
  },
  {
    id: '4',
    name: 'Apple with Almond Butter',
    type: 'snack',
    foods: [],
    totalNutrition: { calories: 180, protein: 6, carbs: 20, fat: 12, fiber: 5, sugar: 15, sodium: 80 },
    preparationTime: 2,
    instructions: ['Slice apple', 'Serve with almond butter'],
    image: '/meal-images/apple-almond.jpg'
  }
]

interface MealPlanGeneratorProps {
  onPlanGenerated: (plan: MealPlan) => void
}

export default function MealPlanGenerator({ onPlanGenerated }: MealPlanGeneratorProps) {
  const { profile } = useUserStore()
  const { setCurrentMealPlan } = useMealStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(7) // days
  const [selectedCalorieTarget, setSelectedCalorieTarget] = useState(2000)
  const [includedMealTypes, setIncludedMealTypes] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    snack: true
  })

  const [generationStep, setGenerationStep] = useState(0)
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false)

  const generationSteps = [
    { label: 'Analyzing Profile', icon: Brain, description: 'Processing your biometric data and goals...' },
    { label: 'Consulting Database', icon: Database, description: 'Matching your preferences with healthy recipes...' },
    { label: 'Optimizing Macros', icon: Settings, description: 'Fine-tuning calorie and nutrient ratios for you...' },
    { label: 'Finalizing Plan', icon: Sparkles, description: 'Creating your personalized weekly schedule...' },
  ]

  const generateMealPlan = async () => {
    if (!profile) return

    setIsGenerating(true)
    setGenerationStep(0)
    setShowLongWaitMessage(false)

    // Simulate steps for better UX
    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < 3 ? prev + 1 : prev))
    }, 6000) // Slower steps

    const longWaitTimer = setTimeout(() => {
      setShowLongWaitMessage(true)
    }, 35000)

    try {
      const preferences = []
      const includedTypes = Object.entries(includedMealTypes)
        .filter(([, included]) => included)
        .map(([type]) => type)

      if (includedTypes.length > 0) {
        preferences.push(`Include: ${includedTypes.join(', ')}`)
      }

      if (selectedCalorieTarget !== 2000) {
        preferences.push(`Target ${selectedCalorieTarget} calories per day`)
      }

      const generatedPlan = await aiService.generateMealPlan(
        profile,
        selectedDuration,
        preferences
      )

      setCurrentMealPlan(generatedPlan)
      onPlanGenerated(generatedPlan)
    } catch (error) {
      console.error('Error generating meal plan:', error)
    } finally {
      setIsGenerating(false)
      clearInterval(stepInterval)
      clearTimeout(longWaitTimer)
    }
  }

  const calculateEstimatedCalories = () => {
    let total = 0
    if (includedMealTypes.breakfast) total += 280
    if (includedMealTypes.lunch) total += 420
    if (includedMealTypes.dinner) total += 520
    if (includedMealTypes.snack) total += 180
    return total
  }



  return (
    <div className="space-y-6">
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            AI Meal Plan Generator
          </CardTitle>
          <CardDescription>
            Generate a personalized meal plan based on your preferences and goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Plan Duration</label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 7, 14].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedDuration(days)}
                  className={`p-3 border rounded-lg text-center transition-all duration-200 hover-lift ${selectedDuration === days
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                    : 'border-input hover:bg-muted hover:shadow-md'
                    }`}
                >
                  <div className="font-medium">{days} Days</div>
                  <div className="text-xs opacity-80">
                    {days === 3 ? 'Quick start' : days === 7 ? 'Recommended' : 'Extended'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calorie Target */}
          <div>
            <label className="block text-sm font-medium mb-3">Daily Calorie Target</label>
            <div className="space-y-2">
              <input
                type="range"
                min="1200"
                max="3000"
                step="50"
                value={selectedCalorieTarget}
                onChange={(e) => setSelectedCalorieTarget(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1,200 cal</span>
                <span className="font-medium text-foreground">
                  {formatCalories(selectedCalorieTarget)}
                </span>
                <span>3,000 cal</span>
              </div>
            </div>
          </div>

          {/* Meal Types */}
          <div>
            <label className="block text-sm font-medium mb-3">Include Meal Types</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(includedMealTypes).map(([mealType, included]) => (
                <label
                  key={mealType}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted transition-all duration-200 hover-lift"
                >
                  <input
                    type="checkbox"
                    checked={included}
                    onChange={(e) =>
                      setIncludedMealTypes(prev => ({
                        ...prev,
                        [mealType]: e.target.checked
                      }))
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium capitalize">{mealType}</div>
                    <div className="text-sm text-muted-foreground">
                      {mealType === 'breakfast' && '~280 cal'}
                      {mealType === 'lunch' && '~420 cal'}
                      {mealType === 'dinner' && '~520 cal'}
                      {mealType === 'snack' && '~180 cal'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Plan Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <span className="ml-2 font-medium">{selectedDuration} days</span>
              </div>
              <div>
                <span className="text-muted-foreground">Daily Target:</span>
                <span className="ml-2 font-medium">{formatCalories(selectedCalorieTarget)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estimated Daily:</span>
                <span className="ml-2 font-medium">{formatCalories(calculateEstimatedCalories())}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Meals:</span>
                <span className="ml-2 font-medium">
                  {selectedDuration * Object.values(includedMealTypes).filter(Boolean).length}
                </span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateMealPlan}
            disabled={isGenerating || Object.values(includedMealTypes).every(v => !v)}
            className="w-full h-14 button-hover gradient-primary text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-3 spinner" />
                Crafting Your AI Plan...
              </>
            ) : (
              <>
                <ChefHat className="w-5 h-5 mr-3" />
                Generate AI Meal Plan
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="relative h-1 mb-8">
                {/* Progress bar logic: Don't hit 100 until fully done */}
                <Progress value={Math.min(95, (generationStep + 1) * 24)} className="w-full h-1.5" indicatorClassName="gradient-primary" />
                <div className="absolute top-4 left-0 w-full flex justify-between px-1">
                  {generationSteps.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-500",
                        i <= generationStep ? "bg-primary scale-125 shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="glass-panel border-0 bg-primary/5 p-6 rounded-3xl flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary animate-pulse">
                  {(() => {
                    const StepIcon = generationSteps[generationStep].icon;
                    return <StepIcon className="w-8 h-8" />;
                  })()}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-primary">{generationSteps[generationStep].label}</h4>
                  <p className="text-sm text-muted-foreground">{generationSteps[generationStep].description}</p>
                </div>
              </div>

              {showLongWaitMessage && (
                <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl animate-in zoom-in-95 duration-300">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-600 font-medium leading-relaxed">
                    AI is processing a complex plan. This usually takes 45-60 seconds for a full week. Please keep this tab open.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center p-4 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                <Timer className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Estimated time: 30-60 seconds</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Preferences Info */}
      {profile && (
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary" />
              Your Preferences
            </CardTitle>
            <CardDescription>
              The AI will consider these preferences when generating your meal plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Dietary Preferences</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.dietaryPreferences.length > 0 ? (
                    profile.dietaryPreferences.map((pref, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs capitalize"
                      >
                        {pref.replace('_', ' ')}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">None specified</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Health Goals</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.healthGoals.length > 0 ? (
                    profile.healthGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs capitalize"
                      >
                        {goal.replace('_', ' ')}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">None specified</span>
                  )}
                </div>
              </div>

              {profile.allergies.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-2">Allergies to Avoid</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}