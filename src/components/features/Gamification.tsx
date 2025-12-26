'use client'

import { useState, useMemo } from 'react'
import { useUserStore } from '@/store/userStore'
import { useMealStore } from '@/store/mealStore'

import {
  Award,
  Trophy,
  Star,
  Target,
  Zap,
  Calendar,
  Droplets,
  Heart,
  TrendingUp,
  CheckCircle,
  Medal
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge as UIBadge } from '@/components/ui/badge'
import type { Badge, BadgeCategory } from '@/types'

// Predefined badges system
const availableBadges: Badge[] = [
  {
    id: 'hydration_hero',
    name: 'Hydration Hero',
    description: 'Drink your daily water goal for 7 days straight',
    icon: '💧',
    category: 'hydration',
    criteria: { type: 'streak', value: 7, metric: 'water_goal' }
  },
  {
    id: 'meal_planner',
    name: 'Meal Planner',
    description: 'Log all meals for 5 consecutive days',
    icon: '📋',
    category: 'consistency',
    criteria: { type: 'streak', value: 5, metric: 'complete_logging' }
  },
  {
    id: 'protein_power',
    name: 'Protein Power',
    description: 'Meet your protein goals for 10 days',
    icon: '💪',
    category: 'nutrition',
    criteria: { type: 'total', value: 10, metric: 'protein_goal' }
  },
  {
    id: 'calorie_conscious',
    name: 'Calorie Conscious',
    description: 'Stay within 100 calories of your target for 7 days',
    icon: '🎯',
    category: 'nutrition',
    criteria: { type: 'streak', value: 7, metric: 'calorie_accuracy' }
  },
  {
    id: 'veggie_lover',
    name: 'Veggie Lover',
    description: 'Log vegetables in 15 different meals',
    icon: '🥗',
    category: 'nutrition',
    criteria: { type: 'total', value: 15, metric: 'vegetable_meals' }
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Log meals for 30 consecutive days',
    icon: '🔥',
    category: 'consistency',
    criteria: { type: 'streak', value: 30, metric: 'daily_logging' }
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Log breakfast before 9 AM for 7 days',
    icon: '🌅',
    category: 'consistency',
    criteria: { type: 'streak', value: 7, metric: 'early_breakfast' }
  },
  {
    id: 'balanced_diet',
    name: 'Balanced Diet',
    description: 'Hit all macro targets in a single day',
    icon: '⚖️',
    category: 'nutrition',
    criteria: { type: 'achievement', value: 1, metric: 'macro_balance' }
  },
  {
    id: 'recipe_explorer',
    name: 'Recipe Explorer',
    description: 'Try 10 different AI-generated recipes',
    icon: '👨‍🍳',
    category: 'goals',
    criteria: { type: 'total', value: 10, metric: 'recipes_tried' }
  },
  {
    id: 'goal_crusher',
    name: 'Goal Crusher',
    description: 'Achieve your weekly nutrition goal',
    icon: '🏆',
    category: 'goals',
    criteria: { type: 'achievement', value: 1, metric: 'weekly_goal' }
  }
]

export default function Gamification() {
  const { badges: userBadges, currentStreak } = useUserStore()
  const { foodLogs } = useMealStore()
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all')

  // Mock progress data - in real app this would be calculated from actual user data
  const mockProgress = useMemo(() => {
    return availableBadges.map(badge => {
      const userBadge = userBadges.find(ub => ub.badge.id === badge.id)
      if (userBadge) {
        return { badge, progress: 100, earned: true, earnedAt: userBadge.earnedAt }
      }

      // Simulate progress based on badge type
      let progress = 0
      switch (badge.id) {
        case 'hydration_hero':
          progress = Math.min((currentStreak * 14), 100) // Simulate hydration streak
          break
        case 'meal_planner':
          progress = Math.min((foodLogs.length * 20), 100)
          break
        case 'protein_power':
          progress = Math.min((currentStreak * 10), 100)
          break
        case 'calorie_conscious':
          progress = Math.min((currentStreak * 15), 100)
          break
        case 'veggie_lover':
          progress = Math.min((foodLogs.length * 6.67), 100) // 15 meals needed
          break
        case 'streak_master':
          progress = Math.min((currentStreak * 3.33), 100) // 30 days needed
          break
        case 'early_bird':
          progress = Math.min((currentStreak * 14), 100)
          break
        case 'balanced_diet':
          progress = Math.random() * 80 // Random progress for demo
          break
        case 'recipe_explorer':
          progress = Math.min((foodLogs.length * 10), 100) // 10 recipes needed
          break
        case 'goal_crusher':
          progress = Math.random() * 90 // Random progress for demo
          break
        default:
          progress = Math.random() * 60
      }

      return { badge, progress, earned: false }
    })
  }, [userBadges, currentStreak, foodLogs])

  const categories: { key: BadgeCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Star className="w-4 h-4" /> },
    { key: 'nutrition', label: 'Nutrition', icon: <Heart className="w-4 h-4" /> },
    { key: 'hydration', label: 'Hydration', icon: <Droplets className="w-4 h-4" /> },
    { key: 'consistency', label: 'Consistency', icon: <Calendar className="w-4 h-4" /> },
    { key: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> }
  ]

  const filteredBadges = mockProgress.filter(item =>
    selectedCategory === 'all' || item.badge.category === selectedCategory
  )

  const earnedBadges = mockProgress.filter(item => item.earned)
  const totalPoints = earnedBadges.length * 100 + mockProgress.reduce((sum, item) =>
    sum + (item.earned ? 0 : item.progress), 0
  )

  const getBadgeIcon = (iconString: string) => {
    // For demo, return the emoji. In a real app, you might map to actual icon components
    return <span className="text-3xl filter drop-shadow-md">{iconString}</span>
  }

  const getCategoryColor = (category: BadgeCategory) => {
    switch (category) {
      case 'nutrition': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
      case 'hydration': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
      case 'consistency': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
      case 'goals': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-0 hover-lift relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-24 h-24 text-amber-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
              <Trophy className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-amber-500">{Math.round(totalPoints)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Keep logging to earn more!
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 hover-lift relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award className="w-24 h-24 text-purple-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-purple-500">{earnedBadges.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              of {availableBadges.length} total badges
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 hover-lift relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-emerald-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-emerald-500">{currentStreak}</div>
            <p className="text-sm text-muted-foreground mt-1">
              days of consistent logging
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="glass-panel border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Medal className="w-5 h-5 text-primary" />
                Achievement Gallery
              </CardTitle>
              <CardDescription className="mt-1">
                Track your progress and earn badges for healthy habits
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center gap-2 rounded-full transition-all duration-300 ${selectedCategory === category.key
                      ? 'gradient-primary border-0 shadow-lg scale-105'
                      : 'hover:bg-accent hover:text-foreground'
                    }`}
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredBadges.map((item) => (
              <Card
                key={item.badge.id}
                className={`relative transition-all duration-500 group overflow-hidden ${item.earned
                    ? 'border-2 border-amber-400/50 bg-gradient-to-br from-amber-50/50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 hover:-translate-y-2'
                    : 'glass-panel border-0 hover:-translate-y-1 hover:shadow-lg opacity-80 hover:opacity-100'
                  }`}
              >
                {item.earned && (
                  <>
                    <div className="absolute top-0 right-0 px-3 py-1 bg-amber-400 text-white text-xs font-bold rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Earned
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 to-transparent pointer-events-none" />
                  </>
                )}

                <CardContent className="p-6">
                  <div className="text-center space-y-4 relative z-10">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg ${item.earned
                        ? 'bg-gradient-to-br from-amber-200 to-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/40'
                        : 'bg-muted'
                      }`}>
                      {getBadgeIcon(item.badge.icon)}
                    </div>

                    <div>
                      <h3 className={`font-bold text-lg ${item.earned ? 'text-amber-900 dark:text-amber-100' : ''}`}>
                        {item.badge.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[40px]">
                        {item.badge.description}
                      </p>
                    </div>

                    <UIBadge className={`${getCategoryColor(item.badge.category)} border-0 px-3 py-1 shadow-none`}>
                      {item.badge.category}
                    </UIBadge>

                    {!item.earned && (
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{Math.round(item.progress)}%</span>
                        </div>
                        <Progress
                          value={item.progress}
                          className="h-2 bg-muted/50"
                          indicatorClassName={item.progress > 80 ? 'bg-primary' : 'bg-muted-foreground'}
                        />
                      </div>
                    )}

                    {item.earned && item.earnedAt && (
                      <p className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium pt-2">
                        Unlocked {new Date(item.earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {earnedBadges.length > 0 && (
        <Card className="glass-panel border-0 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Your latest earned badges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {earnedBadges.slice(0, 4).map((item, index) => (
                <div key={index} className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all cursor-pointer">
                  <div className="text-3xl mb-2 filter drop-shadow-sm">{item.badge.icon}</div>
                  <p className="font-semibold text-sm truncate">{item.badge.name}</p>
                  {item.earnedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}