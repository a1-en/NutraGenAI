import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatCalories(calories: number): string {
  return `${Math.round(calories)} cal`
}

export function formatWeight(weight: number, unit: 'kg' | 'lbs' = 'kg'): string {
  return `${weight.toFixed(1)} ${unit}`
}

export function calculateBMI(weight: number, height: number): number {
  // weight in kg, height in cm
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function calculateDailyCalories(profile: { weight: number, height: number, age: number, activityLevel: string, healthGoals: string[] }): number {
  // Simple BMR formula (Mifflin-St Jeor average)
  const bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 80

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }

  let calories = bmr * (activityMultipliers[profile.activityLevel] || 1.2)

  if (profile.healthGoals.includes('weight_loss')) calories -= 500
  if (profile.healthGoals.includes('weight_gain')) calories += 500
  if (profile.healthGoals.includes('muscle_gain')) calories += 300

  return Math.max(1200, Math.round(calories))
}

export function calculateDailyWater(weight: number): number {
  // 35ml per kg
  return Math.round(weight * 35)
}