'use client'

import { useState, useRef } from 'react'
import { useUserStore } from '@/store/userStore'
import { useMealStore } from '@/store/mealStore'
import { aiService } from '@/lib/ai'
import { cn, generateId } from '@/lib/utils'
import { Camera, Search, Plus, Loader2, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FoodLog, MealType, Food, NutritionInfo } from '@/types'

interface FoodLoggerProps {
  onClose?: () => void
}

export default function FoodLogger({ onClose }: FoodLoggerProps) {
  const { profile } = useUserStore()
  const { addFoodLog } = useMealStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [foodInput, setFoodInput] = useState('')
  const [analyzedFood, setAnalyzedFood] = useState<{
    foodName: string
    estimatedCalories: number
    nutrition: { protein: number; carbs: number; fat: number; fiber: number }
    servingSize: string
  } | null>(null)
  const [quantity, setQuantity] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextInput = async () => {
    if (!foodInput.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await aiService.analyzeFoodInput(foodInput, false)
      setAnalyzedFood(result)
    } catch (error) {
      console.error('Error analyzing food:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    try {
      const mockDescription = `Image of food: ${file.name}`
      const result = await aiService.analyzeFoodInput(mockDescription, true)
      setAnalyzedFood(result)
      setFoodInput(result.foodName)
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLogFood = async () => {
    if (!analyzedFood || !profile) return

    const nutrition: NutritionInfo = {
      calories: analyzedFood.estimatedCalories * quantity,
      protein: analyzedFood.nutrition.protein * quantity,
      carbs: analyzedFood.nutrition.carbs * quantity,
      fat: analyzedFood.nutrition.fat * quantity,
      fiber: analyzedFood.nutrition.fiber * quantity,
      sugar: 0,
      sodium: 0
    }

    const isBeverage = analyzedFood.foodName.toLowerCase().match(/water|tea|coffee|juice|soda|bev|drink|milk|smoothie/)

    const food: Food = {
      id: generateId(),
      name: analyzedFood.foodName,
      nutrition: {
        calories: analyzedFood.estimatedCalories,
        protein: analyzedFood.nutrition.protein,
        carbs: analyzedFood.nutrition.carbs,
        fat: analyzedFood.nutrition.fat,
        fiber: analyzedFood.nutrition.fiber,
        sugar: 0,
        sodium: 0
      },
      servingSize: analyzedFood.servingSize,
      servingWeight: 100,
      category: isBeverage ? 'beverages' : 'other'
    }

    const foodLog: FoodLog = {
      id: generateId(),
      userId: profile.id,
      date: new Date(),
      mealType,
      food,
      quantity,
      nutrition,
      loggedAt: new Date()
    }

    addFoodLog(foodLog)

    setFoodInput('')
    setAnalyzedFood(null)
    setQuantity(1)

    onClose?.()
  }

  return (
    <Card className="w-full max-w-md mx-auto glass-panel border-0 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Log Food</CardTitle>
            <CardDescription className="text-muted-foreground/80 font-medium">
              Add food to your daily log with AI assistance
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Meal Type</label>
          <div className="grid grid-cols-2 gap-2">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type as MealType)}
                className={cn(
                  "py-2 px-4 rounded-xl text-sm font-semibold capitalize transition-all duration-300",
                  mealType === type
                    ? "gradient-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                    : "glass-panel bg-muted/30 hover:bg-muted/50 border-0"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Add Food</label>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex gap-2 relative">
              <Input
                placeholder="Describe your meal..."
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextInput()}
                className="bg-background/50 border-border/40 focus-visible:ring-primary rounded-xl py-6"
              />
              <Button
                onClick={handleTextInput}
                disabled={isAnalyzing || !foodInput.trim()}
                className="rounded-xl h-auto px-6 gradient-primary"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          <div className="relative pt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl py-6 border-dashed border-2 bg-primary/5 hover:bg-primary/10 border-primary/30 text-primary font-bold transition-all"
              disabled={isAnalyzing}
            >
              <Camera className="h-5 w-5 mr-3" />
              Scan Meal Image
            </Button>
          </div>
        </div>

        {analyzedFood && (
          <div className="space-y-4 p-5 glass-panel bg-primary/5 border-primary/20 rounded-2xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between border-b border-primary/10 pb-3">
              <h4 className="font-bold text-lg text-primary">{analyzedFood.foodName}</h4>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-16 h-8 text-center bg-background/50"
                />
                <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Qty</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              <div className="flex flex-col">
                <span className="text-secondary-foreground opacity-60">Serving</span>
                <span className="font-bold">{analyzedFood.servingSize}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-secondary-foreground opacity-60">Calories</span>
                <span className="font-bold text-primary">{Math.round(analyzedFood.estimatedCalories * quantity)} kcal</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-t border-primary/10 pt-3">
              {[
                { label: 'Prot', value: analyzedFood.nutrition.protein, color: 'text-rose-500' },
                { label: 'Carbs', value: analyzedFood.nutrition.carbs, color: 'text-sky-500' },
                { label: 'Fat', value: analyzedFood.nutrition.fat, color: 'text-amber-500' },
                { label: 'Fiber', value: analyzedFood.nutrition.fiber, color: 'text-emerald-500' }
              ].map((macro) => (
                <div key={macro.label} className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{macro.label}</p>
                  <p className={cn("text-xs font-bold", macro.color)}>{Math.round(macro.value * quantity)}g</p>
                </div>
              ))}
            </div>

            <Button onClick={handleLogFood} className="w-full rounded-xl py-6 gradient-primary shadow-lg shadow-primary/20 font-bold">
              <Plus className="h-5 w-5 mr-2" />
              Add to Daily Log
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex items-center justify-center p-12 glass-panel bg-background/20 rounded-2xl border-0">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto relative z-10" />
              </div>
              <p className="text-sm font-bold text-primary animate-pulse uppercase tracking-widest">AI Analysis in Progress...</p>
            </div>
          </div>
        )}
      </CardContent>
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    </Card>
  )
}