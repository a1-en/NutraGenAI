// User Profile Types
export interface UserProfile {
  id: string
  name: string
  email: string
  age: number
  weight: number // in kg
  height: number // in cm
  activityLevel: ActivityLevel
  dietaryPreferences: DietaryPreference[]
  healthGoals: HealthGoal[]
  allergies: string[]
  createdAt: Date
  updatedAt: Date
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export type DietaryPreference = 
  | 'vegetarian' 
  | 'vegan' 
  | 'keto' 
  | 'paleo' 
  | 'mediterranean' 
  | 'halal' 
  | 'kosher' 
  | 'gluten_free' 
  | 'dairy_free'

export type HealthGoal = 
  | 'weight_loss' 
  | 'weight_gain' 
  | 'muscle_gain' 
  | 'maintain_weight' 
  | 'improve_health' 
  | 'increase_energy'

// Nutrition Types
export interface NutritionInfo {
  calories: number
  protein: number // in grams
  carbs: number // in grams
  fat: number // in grams
  fiber: number // in grams
  sugar: number // in grams
  sodium: number // in mg
}

export interface Food {
  id: string
  name: string
  brand?: string
  nutrition: NutritionInfo
  servingSize: string
  servingWeight: number // in grams
  category: FoodCategory
}

export type FoodCategory = 
  | 'fruits' 
  | 'vegetables' 
  | 'grains' 
  | 'protein' 
  | 'dairy' 
  | 'fats' 
  | 'beverages' 
  | 'snacks' 
  | 'other'

// Meal Types
export interface Meal {
  id: string
  name: string
  type: MealType
  foods: MealFood[]
  totalNutrition: NutritionInfo
  preparationTime?: number // in minutes
  instructions?: string[]
  image?: string
}

export interface MealFood {
  food: Food
  quantity: number // servings
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

// Meal Plan Types
export interface MealPlan {
  id: string
  userId: string
  name: string
  startDate: Date
  endDate: Date
  meals: DailyMeals[]
  targetNutrition: NutritionInfo
  createdAt: Date
}

export interface DailyMeals {
  date: Date
  breakfast?: Meal
  lunch?: Meal
  dinner?: Meal
  snacks: Meal[]
}

// Recipe Types
export interface Recipe {
  id: string
  name: string
  description: string
  ingredients: RecipeIngredient[]
  instructions: string[]
  preparationTime: number // in minutes
  cookingTime: number // in minutes
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  cuisine?: string
  nutrition: NutritionInfo
  image?: string
  tags: string[]
}

export interface RecipeIngredient {
  name: string
  amount: number
  unit: string
  optional?: boolean
}

// Food Logging Types
export interface FoodLog {
  id: string
  userId: string
  date: Date
  mealType: MealType
  food: Food
  quantity: number
  nutrition: NutritionInfo
  loggedAt: Date
}

export interface DailyLog {
  date: Date
  logs: FoodLog[]
  totalNutrition: NutritionInfo
  waterIntake: number // in ml
  targetCalories: number
  targetWater: number // in ml
}

// Badge and Gamification Types
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  criteria: BadgeCriteria
}

export type BadgeCategory = 'nutrition' | 'hydration' | 'consistency' | 'goals' | 'social'

export interface BadgeCriteria {
  type: 'streak' | 'total' | 'daily' | 'achievement'
  value: number
  metric: string
}

export interface UserBadge {
  badge: Badge
  earnedAt: Date
  progress?: number
}

// AI Coach Types
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  type?: 'text' | 'suggestion' | 'meal_plan' | 'recipe'
  metadata?: Record<string, unknown>
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

// Progress Tracking Types
export interface ProgressEntry {
  id: string
  userId: string
  date: Date
  weight?: number
  bodyFat?: number
  measurements?: BodyMeasurements
  notes?: string
}

export interface BodyMeasurements {
  chest?: number
  waist?: number
  hips?: number
  arms?: number
  thighs?: number
}

// Dashboard Types
export interface DashboardData {
  user: UserProfile
  todayLog: DailyLog
  weeklyProgress: ProgressEntry[]
  streaks: UserStreaks
  recentBadges: UserBadge[]
  upcomingMeals: Meal[]
}

export interface UserStreaks {
  logging: number
  hydration: number
  mealPlan: number
  exercise: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}