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
  ArrowRight,
  Plus,
  User
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCalories, formatDate, calculateDailyCalories, calculateDailyWater } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import type { FoodLog } from '@/types'

export default function Dashboard() {
  const { profile, currentStreak } = useUserStore()
  const { foodLogs } = useMealStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
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
  const waterIntake = todaysLogs.filter(log => log.food.category === 'beverages').reduce((acc, log) => acc + (log.quantity * 250), 0)

  const calorieProgress = (totalNutrition.calories / targetCalories) * 100
  const waterProgress = (waterIntake / targetWater) * 100

  const macroTargets = {
    protein: Math.round(targetCalories * 0.25 / 4),
    carbs: Math.round(targetCalories * 0.45 / 4),
    fat: Math.round(targetCalories * 0.30 / 9)
  }

  const recentMeals = todaysLogs.slice(-3).reverse().map(log => ({
    id: log.id,
    name: log.food.name,
    type: log.mealType,
    time: new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    calories: log.nutrition.calories
  }))

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 sm:p-8 glass-panel rounded-[2rem] shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="hidden sm:block">
            <Logo size="lg" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 italic leading-tight">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}{profile?.name ? `, ${profile.name}` : ''}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {formatDate(new Date())} • Today's Nutrition Guide
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 relative z-10 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none rounded-xl border-border/40 hover:bg-muted/50 transition-all font-bold h-11" asChild>
            <Link href="/profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold h-11" asChild>
            <Link href="/meal-plan">
              <Calendar className="w-4 h-4 mr-2" />
              Plan
            </Link>
          </Button>
          <Button className="flex-1 md:flex-none rounded-xl gradient-primary text-white shadow-lg shadow-primary/20 transition-all font-black h-11 px-6" asChild>
            <Link href="/food-log">
              <Plus className="w-4 h-4 mr-2 text-white" />
              Log Meal
            </Link>
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative rounded-[1.5rem]">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-primary" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-wider">
                Daily Goal
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Calories</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-foreground tracking-tighter">{formatCalories(totalNutrition.calories)}</p>
                <span className="text-sm font-bold text-muted-foreground">/ {formatCalories(targetCalories)}</span>
              </div>
            </div>
            <Progress value={calorieProgress} className="mt-5 h-2 bg-primary/10" indicatorClassName="gradient-primary" />
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative rounded-[1.5rem]">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Droplets className="w-24 h-24 text-blue-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-lg uppercase tracking-wider">
                Hydration
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Water Intake</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-foreground tracking-tighter">{(waterIntake / 1000).toFixed(1)}L</p>
                <span className="text-sm font-bold text-muted-foreground">/ {(targetWater / 1000).toFixed(1)}L</span>
              </div>
            </div>
            <Progress value={waterProgress} className="mt-5 h-2 bg-blue-500/10" indicatorClassName="bg-blue-500" />
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative rounded-[1.5rem]">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-emerald-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg uppercase tracking-wider">
                Streak
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Consistency</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-foreground tracking-tighter">{currentStreak || 0} Days</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {currentStreak > 0 ? "You're on fire! 🔥" : "Log your first meal! 🚀"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative rounded-[1.5rem]">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-amber-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-lg uppercase tracking-wider">
                Energy
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black text-foreground tracking-tighter">
                  {todaysLogs.length > 0 ? (totalNutrition.calories > targetCalories * 0.5 ? 'High' : 'Normal') : 'No Data'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {todaysLogs.length > 0 ? 'Fuel levels optimal' : 'Awaiting logs'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-panel border-0 shadow-sm rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-black italic">
              <BarChart3 className="w-6 h-6 mr-3 text-primary" />
              Daily Macros
            </CardTitle>
            <CardDescription className="font-medium text-sm">
              Your detailed nutritional breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10 group">
                <div className="flex justify-between items-end mb-3">
                  <span className="font-bold text-xs text-primary uppercase tracking-widest">Protein</span>
                  <span className="text-2xl font-black group-hover:scale-110 transition-transform">{totalNutrition.protein}g</span>
                </div>
                <Progress
                  value={(totalNutrition.protein / macroTargets.protein) * 100}
                  className="h-2 bg-background/50"
                  indicatorClassName="bg-primary"
                />
                <p className="text-[10px] text-muted-foreground mt-2 text-right font-black uppercase">Goal: {macroTargets.protein}g</p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 transition-all border border-blue-500/10 group">
                <div className="flex justify-between items-end mb-3">
                  <span className="font-bold text-xs text-blue-500 uppercase tracking-widest">Carbs</span>
                  <span className="text-2xl font-black group-hover:scale-110 transition-transform">{totalNutrition.carbs}g</span>
                </div>
                <Progress
                  value={(totalNutrition.carbs / macroTargets.carbs) * 100}
                  className="h-2 bg-background/50"
                  indicatorClassName="bg-blue-500"
                />
                <p className="text-[10px] text-muted-foreground mt-2 text-right font-black uppercase">Goal: {macroTargets.carbs}g</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 transition-all border border-amber-500/10 group">
                <div className="flex justify-between items-end mb-3">
                  <span className="font-bold text-xs text-amber-500 uppercase tracking-widest">Fat</span>
                  <span className="text-2xl font-black group-hover:scale-110 transition-transform">{totalNutrition.fat}g</span>
                </div>
                <Progress
                  value={(totalNutrition.fat / macroTargets.fat) * 100}
                  className="h-2 bg-background/50"
                  indicatorClassName="bg-amber-500"
                />
                <p className="text-[10px] text-muted-foreground mt-2 text-right font-black uppercase">Goal: {macroTargets.fat}g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 shadow-sm rounded-[1.5rem]">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-black italic">
              <Calendar className="w-6 h-6 mr-3 text-primary" />
              Recent Logs
            </CardTitle>
            <CardDescription className="font-medium">
              Your latest activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMeals.length > 0 ? (
                recentMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="group flex items-center justify-between p-3.5 rounded-2xl border border-transparent hover:bg-background/80 hover:border-border/40 hover:shadow-sm transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {meal.type === 'lunch' ? '🥗' : meal.type === 'snack' ? '🍎' : meal.type === 'breakfast' ? '🍳' : '🍗'}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{meal.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{meal.type} • {meal.time}</p>
                      </div>
                    </div>
                    <div className="text-xs font-black px-2.5 py-1 rounded-lg bg-primary/5 text-primary border border-primary/10">{formatCalories(meal.calories)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No meals logged yet</p>
                </div>
              )}

              <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground hover:text-primary mt-2 uppercase tracking-widest h-10" asChild>
                <Link href="/food-log">View All Logs <ArrowRight className="w-3 h-3 ml-2" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
        {[
          { title: 'AI Coach', icon: MessageCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10', href: '/coach' },
          { title: 'Find Recipes', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-500/10', href: '/recipes' },
          { title: 'View Insights', icon: BarChart3, color: 'text-sky-500', bg: 'bg-sky-500/10', href: '/insights' },
          { title: 'Achievements', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/achievements' },
        ].map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group glass-panel border-0 p-6 rounded-[2rem] hover:shadow-xl transition-all flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1 duration-300"
          >
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
              <item.icon className="w-7 h-7" />
            </div>
            <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}