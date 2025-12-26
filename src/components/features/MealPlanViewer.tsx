'use client'

import { useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShoppingCart,
  Utensils,
  Coffee,
  Apple,
  MessageCircle,
  Clock,
  Flame,
  Dumbbell,
  Grape,
  Share2,
  FileDown,
  ChevronDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { MealPlan, Meal, NutritionInfo, DailyMeals } from '@/types'

interface MealPlanViewerProps {
  mealPlan: MealPlan
  onEdit?: () => void
  onRegenerate?: () => void
}

export default function MealPlanViewer({ mealPlan, onEdit, onRegenerate }: MealPlanViewerProps) {
  const [selectedDay, setSelectedDay] = useState(0)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const selectedDayData = mealPlan.meals[selectedDay]

  const getMealTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast': return <Coffee className="w-5 h-5" />
      case 'lunch': return <Utensils className="w-5 h-5" />
      case 'dinner': return <Utensils className="w-5 h-5" />
      case 'snack': return <Apple className="w-5 h-5" />
      default: return <Utensils className="w-5 h-5" />
    }
  }

  const getMealColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast': return 'text-amber-500 bg-amber-500/10'
      case 'lunch': return 'text-sky-500 bg-sky-500/10'
      case 'dinner': return 'text-indigo-500 bg-indigo-500/10'
      case 'snack': return 'text-rose-500 bg-rose-500/10'
      default: return 'text-primary bg-primary/10'
    }
  }

  const getMacroColor = (macro: string) => {
    switch (macro.toLowerCase()) {
      case 'protein': return 'text-rose-500 bg-rose-500/10'
      case 'carbs': return 'text-sky-500 bg-sky-500/10'
      case 'fat': return 'text-amber-500 bg-amber-500/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  const EmptyMealSlot = ({ mealType }: { mealType: string }) => (
    <Card className="glass-panel border-dashed border-2 border-muted-foreground/20 hover:border-primary/50 transition-all duration-300 group cursor-pointer">
      <CardContent className="p-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          {getMealTypeIcon(mealType)}
        </div>
        <h4 className="font-bold text-foreground mb-1">No {mealType} planned</h4>
        <p className="text-sm text-muted-foreground max-w-[200px]">Add a meal to complete your specialized plan</p>
      </CardContent>
    </Card>
  )

  const MealCard = ({ meal, mealType }: { meal: Meal; mealType: string }) => (
    <Card className="glass-panel border-0 shadow-sm card-hover overflow-hidden group">
      <div className={cn("h-1.5 w-full", getMealColor(mealType).split(' ')[1])} />
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex w-fit", getMealColor(mealType))}>
              {mealType}
            </div>
            <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{meal.name}</CardTitle>
          </div>
          <Badge variant="outline" className="rounded-lg bg-background/50 border-0 shadow-sm">
            <Clock className="w-3 h-3 mr-1 text-primary" />
            {meal.preparationTime || 0}m
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
          {meal.instructions ? meal.instructions[0] : 'Expertly curated nutrition for your goals.'}
        </p>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/40">
          <div className="text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Protein</p>
            <p className="text-sm font-bold text-rose-500">{meal.totalNutrition.protein}g</p>
          </div>
          <div className="text-center border-x border-border/40">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Carbs</p>
            <p className="text-sm font-bold text-sky-500">{meal.totalNutrition.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Fat</p>
            <p className="text-sm font-bold text-amber-500">{meal.totalNutrition.fat}g</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="button-hover hover-lift flex-1 rounded-xl bg-background/40">
            Details
          </Button>
          <Button size="sm" className="button-hover gradient-primary hover-lift flex-1 rounded-xl text-white shadow-md shadow-primary/20">
            Log Meal
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const getDayNutrition = (dayMeals: DailyMeals): NutritionInfo => {
    const meals = [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner, ...dayMeals.snacks].filter(Boolean) as Meal[]

    return meals.reduce((total, meal) => ({
      calories: total.calories + meal.totalNutrition.calories,
      protein: total.protein + meal.totalNutrition.protein,
      carbs: total.carbs + meal.totalNutrition.carbs,
      fat: total.fat + meal.totalNutrition.fat,
      fiber: total.fiber + (meal.totalNutrition.fiber || 0),
      sugar: total.sugar + (meal.totalNutrition.sugar || 0),
      sodium: total.sodium + (meal.totalNutrition.sodium || 0)
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0
    })
  }

  const dayNutrition = selectedDayData ? getDayNutrition(selectedDayData) : {
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Glass Panel */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 border-0 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl gradient-primary text-white">
                <Calendar className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Your Weekly Roadmap</h1>
            </div>
            <p className="text-muted-foreground font-medium max-w-2xl px-2">
              Optimize your health with this personalized <span className="text-primary font-bold">{mealPlan.name}</span> plan, calculated specifically for your body composition.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={onEdit} className="button-hover hover-lift rounded-xl border-primary/20 bg-background/50">
              Update Preferences
            </Button>
            <Button onClick={onRegenerate} className="button-hover gradient-primary hover-lift rounded-xl text-white shadow-lg shadow-primary/20">
              Regenerate AI Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Modern Day Navigation */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Pick Your Day
          </h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))} className="rounded-full hover:bg-primary/10">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSelectedDay(Math.min(days.length - 1, selectedDay + 1))} className="rounded-full hover:bg-primary/10">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {days.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={cn(
                'group relative px-4 py-4 rounded-2xl font-bold transition-all duration-300 hover-lift overflow-hidden',
                selectedDay === index
                  ? 'gradient-primary text-white shadow-xl shadow-primary/25 scale-105'
                  : 'glass-panel border-0 text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="relative z-10 block text-xs md:text-sm">{day.slice(0, 3)}</span>
              {selectedDay === index && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Nutrition Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Energize', value: `${dayNutrition.calories} cal`, target: mealPlan.targetNutrition.calories, icon: Flame, color: 'primary', unit: 'cal' },
          { label: 'Building', value: `${dayNutrition.protein}g`, target: mealPlan.targetNutrition.protein, icon: Dumbbell, color: 'rose-500', unit: 'g Protein' },
          { label: 'Performance', value: `${dayNutrition.carbs}g`, target: mealPlan.targetNutrition.carbs, icon: Zap, color: 'sky-500', unit: 'g Carbs' },
          { label: 'Vitals', value: `${dayNutrition.fat}g`, target: mealPlan.targetNutrition.fat, icon: Grape, color: 'amber-500', unit: 'g Fat' },
        ].map((stat, i) => (
          <Card key={i} className="glass-panel border-0 shadow-sm hover-lift relative group overflow-hidden">
            <div className={cn("absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity", `text-${stat.color}`)}>
              <stat.icon className="w-16 h-16" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("p-1.5 rounded-lg", `bg-${stat.color === 'primary' ? 'primary' : stat.color}/10`, `text-${stat.color === 'primary' ? 'primary' : stat.color}`)}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-black mb-1">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium mb-4">Goal: {stat.target}{stat.unit.includes('cal') ? ' cal' : 'g'}</p>
              <Progress value={(parseInt(stat.value) / stat.target) * 100} className="h-1.5 bg-muted/30" indicatorClassName={stat.color === 'primary' ? 'gradient-primary' : `bg-${stat.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meals Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-xl text-foreground px-2 flex items-center gap-2">
          Today&apos;s Menu
          <div className="h-0.5 flex-1 bg-border/40 ml-4 rounded-full" />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((mealType) => {
            let meal: Meal | undefined
            if (mealType === 'Breakfast') meal = selectedDayData?.breakfast
            else if (mealType === 'Lunch') meal = selectedDayData?.lunch
            else if (mealType === 'Dinner') meal = selectedDayData?.dinner
            else if (mealType === 'Snack') meal = selectedDayData?.snacks?.[0]

            return meal ? (
              <MealCard key={mealType} meal={meal} mealType={mealType} />
            ) : (
              <EmptyMealSlot key={mealType} mealType={mealType} />
            )
          })}
        </div>
      </div>

      {/* Actions Glass Footer */}
      <div className="glass-panel border-0 shadow-lg rounded-3xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/5 text-primary">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Meal Preparation</h4>
              <p className="text-sm text-muted-foreground">Ready to start? Generate your shopping list or share your plan.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <Button variant="outline" className="button-hover hover-lift rounded-xl h-12 px-6 flex-1 sm:flex-none bg-background/40">
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="button-hover hover-lift rounded-xl h-12 px-6 flex-1 sm:flex-none bg-background/40">
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
            <Button className="button-hover gradient-primary hover-lift rounded-xl h-12 px-8 flex-1 sm:flex-none text-white shadow-lg shadow-primary/20 font-bold">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shopping List
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
