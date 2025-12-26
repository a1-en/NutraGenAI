'use client'

import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import AppLayout from '@/components/layout/AppLayout'
import UserProfileForm from '@/components/features/UserProfileForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Calendar,
  Activity,
  Target,
  Edit3,
  Heart,
  Scale,
  Ruler,
  Mail,
  Shield,
  Clock
} from 'lucide-react'
import { calculateBMI, getBMICategory, formatWeight } from '@/lib/utils'

export default function ProfilePage() {
  const { profile } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)

  if (!profile) {
    return (
      <UserProfileForm onComplete={() => setIsEditing(false)} />
    )
  }

  if (isEditing) {
    return (
      <UserProfileForm onComplete={() => setIsEditing(false)} />
    )
  }

  const bmi = calculateBMI(profile.weight, profile.height)
  const bmiCategory = getBMICategory(bmi)

  return (
    <AppLayout>
      <div className="space-y-8 p-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border-0 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Profile Overview</h1>
            <p className="text-muted-foreground mt-2 font-medium">Manage your personal information, preferences, and health stats</p>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            className="rounded-xl gradient-primary relative z-10 flex items-center gap-2 hover-lift shadow-lg shadow-primary/20 px-6 py-5 text-lg"
          >
            <Edit3 className="w-5 h-5" />
            Edit Profile
          </Button>

          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="glass-panel border-0 hover-lift group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 mr-3 group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 p-3 rounded-xl bg-background/50 hover:bg-background/80 transition-colors">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-semibold text-lg">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-xl bg-background/50 hover:bg-background/80 transition-colors">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-semibold text-lg">{profile.age} years old</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-xl bg-background/50 hover:bg-background/80 transition-colors">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                  <Activity className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Activity Level</p>
                  <p className="font-semibold text-lg capitalize">{profile.activityLevel.replace('_', ' ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Stats */}
          <Card className="glass-panel border-0 hover-lift group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 mr-3 group-hover:scale-110 transition-transform">
                  <Scale className="w-5 h-5" />
                </div>
                Physical Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-all text-center">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <Scale className="w-3 h-3" /> Weight
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatWeight(profile.weight)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-all text-center">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <Ruler className="w-3 h-3" /> Height
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{profile.height} cm</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-background/50 border border-border/50">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">BMI Score</span>
                    <div className="text-3xl font-bold mt-1">{bmi.toFixed(1)}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bmi < 18.5 ? 'bg-blue-100 text-blue-700' :
                      bmi < 25 ? 'bg-green-100 text-green-700' :
                        bmi < 30 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                    }`}>
                    {bmiCategory}
                  </span>
                </div>
                <Progress
                  value={Math.min((bmi / 40) * 100, 100)}
                  className="h-2.5 mt-2"
                  indicatorClassName={`
                    ${bmi < 18.5 ? 'bg-blue-500' :
                      bmi < 25 ? 'bg-green-500' :
                        bmi < 30 ? 'bg-orange-500' :
                          'bg-red-500'}
                  `}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Healthy range: 18.5 - 24.9
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Health Goals */}
          <Card className="glass-panel border-0 hover-lift group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-red-500/10 rounded-xl text-red-500 mr-3 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                Health Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.healthGoals.map((goal, index) => (
                  <div key={index} className="flex items-center p-4 bg-background/50 hover:bg-background/80 rounded-xl transition-all border border-border/50">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full mr-3">
                      <Heart className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="font-medium capitalize">{goal.replace('_', ' ')}</span>
                  </div>
                ))}
                {profile.healthGoals.length === 0 && (
                  <div className="text-center p-8 bg-muted/20 rounded-xl border-dashed border-2 border-muted">
                    <p className="text-muted-foreground">No health goals set</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dietary Preferences & Allergies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-panel border-0 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <span className="mr-3">🥗</span> Dietary Preferences
              </CardTitle>
              <CardDescription>
                Your selected dietary preferences and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {profile.dietaryPreferences.map((pref, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium capitalize flex items-center shadow-sm"
                  >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    {pref.replace('_', ' ')}
                  </span>
                ))}
                {profile.dietaryPreferences.length === 0 && (
                  <p className="text-muted-foreground text-sm italic">No dietary preferences set</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-0 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <span className="mr-3">⚠️</span> Food Allergies
              </CardTitle>
              <CardDescription>
                Foods and ingredients to avoid in meal recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {profile.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 rounded-xl text-sm font-medium flex items-center shadow-sm"
                  >
                    <Shield className="w-3 h-3 mr-2" />
                    {allergy}
                  </span>
                ))}
                {profile.allergies.length === 0 && (
                  <p className="text-muted-foreground text-sm italic">No allergies specified</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <Card className="glass-panel border-0 opacity-80 hover:opacity-100 transition-opacity">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-muted-foreground flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}