'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import Link from 'next/link'
import { useMealStore } from '@/store/mealStore'
import {
  Calendar,
  Target,
  TrendingUp,
  Droplets,
  Zap,
  Award,
  ChefHat,
  BarChart3,
  MessageCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCalories, formatDate, calculateDailyCalories, calculateDailyWater } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import type { DailyLog, FoodLog } from '@/types'

export default function Dashboard() {
  const { profile, currentStreak } = useUserStore()
  const { foodLogs } = useMealStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  // Calculate today's nutrition from real logs
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaysLogs = foodLogs.filter(log => {
    const logDate = new Date(log.date)
    return logDate.toDateString() === today.toDateString()
  })

  const totalNutrition = todaysLogs.reduce((acc, log) => ({
    calories: acc.calories + log.nutrition.calories,
    protein: acc.protein + log.nutrition.protein,
    carbs: acc.carbs + log.nutrition.carbs,
    fat: acc.fat + log.nutrition.fat,
    fiber: acc.fiber + log.nutrition.fiber,
    sugar: acc.sugar + (log.nutrition.sugar || 0),
    sodium: acc.sodium + (log.nutrition.sodium || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 })

  // Calculate targets
  const targetCalories = profile ? calculateDailyCalories(profile) : 2000
  const targetWater = profile ? calculateDailyWater(profile.weight) : 2500
  const waterIntake = todaysLogs.filter(log => log.food.category === 'beverages').reduce((acc, log) => acc + (log.quantity * 250), 0) // Assume 250ml per beverage if not specified

  const calorieProgress = (totalNutrition.calories / targetCalories) * 100
  const waterProgress = (waterIntake / targetWater) * 100

  const macroTargets = {
    protein: Math.round(targetCalories * 0.25 / 4),
    carbs: Math.round(targetCalories * 0.45 / 4),
    fat: Math.round(targetCalories * 0.30 / 9)
  }

  // Use recent logs for "Upcoming Meals" if no plan, just to show something real
  const recentMeals = todaysLogs.slice(-3).reverse().map(log => ({
    id: log.id,
    name: log.food.name,
    type: log.mealType,
    time: new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    calories: log.nutrition.calories
  }))

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Logo size="lg" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}{profile?.name ? `, ${profile.name}` : ''}!
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">
              {formatDate(new Date())} • Let&apos;s make today healthy and delicious
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary button-hover hover-lift" asChild>
            <Link href="/meal-plan">
              <Calendar className="w-4 h-4 mr-2" />
              View Plan
            </Link>
          </Button>
          <Button className="rounded-xl gradient-primary text-white shadow-lg shadow-primary/20 button-hover hover-lift" asChild>
            <Link href="/food-log">
              <ChefHat className="w-4 h-4 mr-2" />
              Log Meal
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-primary" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                Daily Goal
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Calories</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-2xl font-bold text-foreground">{formatCalories(totalNutrition.calories)}</p>
                <span className="text-sm text-muted-foreground">/ {formatCalories(targetCalories)}</span>
              </div>
            </div>
            <Progress value={calorieProgress} className="mt-4 h-2 bg-primary/10" indicatorClassName="gradient-primary" />
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Droplets className="w-24 h-24 text-blue-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full">
                Hydration
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Water Intake</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-3xl font-bold text-foreground">{(waterIntake / 1000).toFixed(1)}L</p>
                <span className="text-sm text-muted-foreground">/ {(targetWater / 1000).toFixed(1)}L</span>
              </div>
            </div>
            <Progress value={waterProgress} className="mt-4 h-2 bg-blue-500/10" indicatorClassName="bg-blue-500" />
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-emerald-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
                Streak
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Consistency</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-3xl font-bold text-foreground">{currentStreak || 0} Days</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {currentStreak > 0 ? "You're on fire! 🔥" : "Log your first meal to start! 🚀"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-amber-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full">
                Energy
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-2xl font-bold text-foreground">
                  {todaysLogs.length > 0 ? (totalNutrition.calories > targetCalories * 0.5 ? 'High' : 'Normal') : 'Awaiting Data'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {todaysLogs.length > 0 ? 'Based on your macros' : 'No logs recorded yet'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Macros - Spans 2 cols */}
        <Card className="lg:col-span-2 glass-panel border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BarChart3 className="w-6 h-6 mr-3 text-primary" />
              Today&apos;s Macros
            </CardTitle>
            <CardDescription>
              Your macronutrient breakdown for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-primary">Protein</span>
                  <span className="text-2xl font-bold">{totalNutrition.protein}g</span>
                </div>
                <Progress
                  value={(totalNutrition.protein / macroTargets.protein) * 100}
                  className="h-2.5 bg-background"
                  indicatorClassName="bg-primary"
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">Target: {macroTargets.protein}g</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-blue-500">Carbs</span>
                  <span className="text-2xl font-bold text-foreground">{totalNutrition.carbs}g</span>
                </div>
                <Progress
                  value={(totalNutrition.carbs / macroTargets.carbs) * 100}
                  className="h-2.5 bg-background"
                  indicatorClassName="bg-blue-500"
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">Target: {macroTargets.carbs}g</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-semibold text-amber-500">Fat</span>
                  <span className="text-2xl font-bold text-foreground">{totalNutrition.fat}g</span>
                </div>
                <Progress
                  value={(totalNutrition.fat / macroTargets.fat) * 100}
                  className="h-2.5 bg-background"
                  indicatorClassName="bg-amber-500"
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">Target: {macroTargets.fat}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meals - Spans 1 col */}
        <Card className="glass-panel border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Calendar className="w-6 h-6 mr-3 text-primary" />
              Recent Meals
            </CardTitle>
            <CardDescription>
              Your latest activity for the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMeals.length > 0 ? recentMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="group flex items-center justify-between p-3 rounded-2xl border border-transparent hover:bg-accent/50 hover:border-border/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {meal.type === 'lunch' ? '🥗' : meal.type === 'snack' ? '🍎' : meal.type === 'breakfast' ? '🍳' : '🍗'}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{meal.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{meal.type} • {meal.time}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold px-2 py-1 rounded-lg bg-background border">{formatCalories(meal.calories)}</div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No meals logged yet today</p>
                </div>
              )}

              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary mt-2">
                View Full Schedule <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'AI Coach', icon: MessageCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10', href: '/coach' },
          { title: 'Find Recipes', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-500/10', href: '/recipes' },
          { title: 'View Insights', icon: BarChart3, color: 'text-sky-500', bg: 'bg-sky-500/10', href: '/insights' },
          { title: 'Achievements', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/achievements' },
        ].map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group glass-panel border-0 p-6 rounded-3xl hover-lift flex flex-col items-center justify-center text-center gap-3 transition-all"
          >
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
              <item.icon className="w-8 h-8" />
            </div>
            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}