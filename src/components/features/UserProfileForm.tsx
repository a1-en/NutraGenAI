'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useUserStore } from '@/store/userStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn, generateId, calculateBMI } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import type { UserProfile, ActivityLevel, DietaryPreference, HealthGoal } from '@/types'
import {
  Check,
  User,
  Ruler,
  Activity,
  Target,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Heart,
  Zap,
  Flame,
  Dumbbell,
  ShieldAlert,
  Mail,
  Calendar as CalendarIcon
} from 'lucide-react'

const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  age: z.number().min(16, 'Age must be at least 16').max(120, 'Age must be less than 120'),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(300, 'Weight must be less than 300kg'),
  height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be less than 250cm'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  dietaryPreferences: z.array(z.string()),
  healthGoals: z.array(z.string()),
  allergies: z.array(z.string())
})

type UserProfileFormData = z.infer<typeof userProfileSchema>

const steps = [
  { id: 'basic', title: 'Identity', description: 'Who are we planning for?', icon: User },
  { id: 'physical', title: 'Body Stats', description: 'Your physiological profile', icon: Ruler },
  { id: 'lifestyle', title: 'Lifestyle', description: 'Daily activity & habits', icon: Activity },
  { id: 'goals', title: 'Aspirations', description: 'What are your health goals?', icon: Target }
]

const activityLevels: { value: ActivityLevel; label: string; description: string; icon: any }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Office job, little exercise', icon: Zap },
  { value: 'light', label: 'Light', description: 'Exercise 1-3 days/week', icon: Heart },
  { value: 'moderate', label: 'Moderate', description: 'Exercise 3-5 days/week', icon: Activity },
  { value: 'active', label: 'Active', description: 'Daily intense exercise', icon: Flame },
  { value: 'very_active', label: 'Very Active', description: 'Physical job or elite athlete', icon: Dumbbell }
]

const dietaryOptions: { value: DietaryPreference; label: string; emoji: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'keto', label: 'Keto', emoji: '🥑' },
  { value: 'paleo', label: 'Paleo', emoji: '🥩' },
  { value: 'mediterranean', label: 'Mediterranean', emoji: '🐟' },
  { value: 'halal', label: 'Halal', emoji: '☪️' },
  { value: 'kosher', label: 'Kosher', emoji: '✡️' },
  { value: 'gluten_free', label: 'Gluten-Free', emoji: '🌾' },
  { value: 'dairy_free', label: 'Dairy-Free', emoji: '🥛' }
]

const healthGoalOptions: { value: HealthGoal; label: string; icon: any }[] = [
  { value: 'weight_loss', label: 'Weight Loss', icon: Flame },
  { value: 'weight_gain', label: 'Weight Gain', icon: Zap },
  { value: 'muscle_gain', label: 'Muscle Gain', icon: Dumbbell },
  { value: 'maintain_weight', label: 'Optimal Balance', icon: Heart },
  { value: 'improve_health', label: 'Better Vitality', icon: Sparkles },
  { value: 'increase_energy', label: 'High Performance', icon: Activity }
]

interface UserProfileFormProps {
  onComplete: () => void
}

export default function UserProfileForm({ onComplete }: UserProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { setProfile } = useUserStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid }
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    mode: 'onChange',
    defaultValues: {
      dietaryPreferences: [],
      healthGoals: [],
      allergies: []
    }
  })

  const watchedValues = watch()
  const progress = ((currentStep + 1) / steps.length) * 100

  const onSubmit = (data: UserProfileFormData) => {
    const profile: UserProfile = {
      id: generateId(),
      name: data.name,
      email: data.email,
      age: data.age,
      weight: data.weight,
      height: data.height,
      activityLevel: data.activityLevel,
      dietaryPreferences: data.dietaryPreferences as DietaryPreference[],
      healthGoals: data.healthGoals as HealthGoal[],
      allergies: data.allergies,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setProfile(profile)
    onComplete()
    router.push('/')
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof UserProfileFormData)[] = []

    if (currentStep === 0) fieldsToValidate = ['name', 'email', 'age']
    if (currentStep === 1) fieldsToValidate = ['weight', 'height']
    if (currentStep === 2) fieldsToValidate = ['activityLevel']

    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleArrayValue = (array: string[], value: string, field: 'dietaryPreferences' | 'healthGoals' | 'allergies') => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value]
    setValue(field, newArray)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="group">
              <label className="block text-sm font-bold mb-2.5 text-foreground ml-1 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Full Name
              </label>
              <div className="relative">
                <input
                  {...register('name')}
                  type="text"
                  className="w-full p-4 pl-12 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background/40 backdrop-blur-md hover:bg-background/60"
                  placeholder="e.g. John Doe"
                />
                <User className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
              </div>
              {errors.name && <p className="text-destructive text-xs mt-2 ml-2 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {errors.name.message}
              </p>}
            </div>

            <div className="group">
              <label className="block text-sm font-bold mb-2.5 text-foreground ml-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Email Address
              </label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  className="w-full p-4 pl-12 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background/40 backdrop-blur-md hover:bg-background/60"
                  placeholder="name@example.com"
                />
                <Mail className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
              </div>
              {errors.email && <p className="text-destructive text-xs mt-2 ml-2 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {errors.email.message}
              </p>}
            </div>

            <div className="group">
              <label className="block text-sm font-bold mb-2.5 text-foreground ml-1 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" /> Age
              </label>
              <div className="relative">
                <input
                  {...register('age', { valueAsNumber: true })}
                  type="number"
                  className="w-full p-4 pl-12 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background/40 backdrop-blur-md hover:bg-background/60"
                  placeholder="Years"
                />
                <CalendarIcon className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
              </div>
              {errors.age && <p className="text-destructive text-xs mt-2 ml-2 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {errors.age.message}
              </p>}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-bold mb-2.5 text-foreground ml-1">Weight (kg)</label>
                <input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full p-4 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background/40 backdrop-blur-md hover:bg-background/60"
                  placeholder="0.0"
                />
                {errors.weight && <p className="text-destructive text-xs mt-2 ml-2">{errors.weight.message}</p>}
              </div>

              <div className="group">
                <label className="block text-sm font-bold mb-2.5 text-foreground ml-1">Height (cm)</label>
                <input
                  {...register('height', { valueAsNumber: true })}
                  type="number"
                  className="w-full p-4 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background/40 backdrop-blur-md hover:bg-background/60"
                  placeholder="000"
                />
                {errors.height && <p className="text-destructive text-xs mt-2 ml-2">{errors.height.message}</p>}
              </div>
            </div>

            {watchedValues.weight && watchedValues.height && (
              <div className="p-6 rounded-3xl gradient-primary text-white shadow-xl shadow-primary/20 animate-in zoom-in-95 duration-500 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Activity className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/80 uppercase tracking-widest mb-1">Your Calculated BMI</p>
                    <p className="text-4xl font-black">{calculateBMI(watchedValues.weight, watchedValues.height).toFixed(1)}</p>
                    <p className="text-xs text-white/70 mt-2 font-medium">Standard metric for body composition analysis.</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Ruler className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label className="block text-sm font-bold mb-4 text-foreground ml-1 flex items-center gap-2">
                <Flame className="w-4 h-4 text-primary" /> Daily Activity
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activityLevels.map((level) => {
                  const Icon = level.icon;
                  return (
                    <label key={level.value} className={cn(
                      "relative flex flex-col p-4 border rounded-2xl cursor-pointer transition-all duration-300 group",
                      watchedValues.activityLevel === level.value
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-input hover:border-primary/30 hover:bg-muted/30'
                    )}>
                      <input
                        {...register('activityLevel')}
                        type="radio"
                        value={level.value}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "p-2 rounded-xl transition-colors",
                          watchedValues.activityLevel === level.value ? "bg-primary text-white" : "bg-primary/10 text-primary"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={cn("font-bold text-sm", watchedValues.activityLevel === level.value ? "text-primary" : "text-foreground")}>
                          {level.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{level.description}</p>
                      {watchedValues.activityLevel === level.value && (
                        <div className="absolute top-4 right-4 text-primary animate-in fade-in zoom-in duration-300">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-4 text-foreground ml-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" /> Dietary Preferences
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dietaryOptions.map((option) => {
                  const isSelected = watchedValues.dietaryPreferences?.includes(option.value);
                  return (
                    <label key={option.value} className={cn(
                      "flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all duration-300",
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary scale-105 shadow-sm'
                        : 'border-input hover:border-primary/30 hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                    )}>
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={() => toggleArrayValue(watchedValues.dietaryPreferences || [], option.value, 'dietaryPreferences')}
                        className="sr-only"
                      />
                      <span className="text-lg grayscale-0">{option.emoji}</span>
                      <span className="text-xs font-bold leading-none">{option.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-primary animate-in zoom-in duration-300" />}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <label className="block text-sm font-bold mb-4 text-foreground ml-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Primary Health Goals
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {healthGoalOptions.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = watchedValues.healthGoals?.includes(goal.value);
                  return (
                    <label key={goal.value} className={cn(
                      "flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300",
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-input hover:border-primary/30 hover:bg-muted/30'
                    )}>
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={() => toggleArrayValue(watchedValues.healthGoals || [], goal.value, 'healthGoals')}
                        className="sr-only"
                      />
                      <div className={cn(
                        "p-3 rounded-xl",
                        isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={cn("font-bold", isSelected ? "text-primary text-lg" : "text-foreground")}>
                        {goal.label}
                      </span>
                      {isSelected && <Check className="w-5 h-5 ml-auto text-primary animate-in zoom-in duration-300" />}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-foreground ml-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" /> Food Allergies
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-4 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-background/40 backdrop-blur-md hover:bg-background/60"
                  placeholder="e.g. Nuts, Dairy, Shellfish..."
                  onChange={(e) => {
                    const allergies = e.target.value.split(',').map(a => a.trim()).filter(a => a)
                    setValue('allergies', allergies)
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 ml-2 flex items-center gap-1 font-medium italic">
                <Sparkles className="w-2 h-2 text-primary" /> AI will automatically filter these from your meal plans.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-primary/30 rounded-full blur-[150px] -z-10" />

      <Card className="w-full max-w-2xl glass-panel shadow-2xl border-0 overflow-hidden slide-in-up">
        <CardHeader className="bg-gradient-primary text-white p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl">
                  <Logo size="md" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight leading-none mb-1 text-white">NutraGenAI</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 leading-none">Intelligence. Optimized.</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                  PHASE {currentStep + 1}
                </div>
                <p className="text-[10px] font-bold text-white/60 mt-2 uppercase">Core Calibration</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/90">
                <span>System Readiness</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full h-1.5 bg-white/20" indicatorClassName="bg-white shadow-[0_0_10px_white]" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-10 pt-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-10 min-h-[380px]">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-3xl gradient-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 glow-effect">
                  <CurrentStepIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight leading-none mb-2">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">{steps[currentStep].description}</p>
                </div>
              </div>

              <div className="">
                {renderStepContent()}
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border/40 gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn(
                  "h-14 px-8 rounded-2xl font-bold transition-all text-muted-foreground hover:bg-muted duration-300",
                  currentStep === 0 ? "opacity-0 invisible" : "opacity-100 visible"
                )}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="h-14 flex-1 sm:flex-none px-12 rounded-2xl gradient-primary text-white font-black text-lg shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  IGNITE MY JOURNEY
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="h-14 flex-1 sm:flex-none px-12 rounded-2xl gradient-primary text-white font-black text-lg shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  CONTINUE
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}