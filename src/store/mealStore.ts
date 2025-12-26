import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MealPlan, Recipe, FoodLog } from '@/types'

interface MealState {
  // Current meal plan
  currentMealPlan: MealPlan | null

  // Saved recipes
  savedRecipes: Recipe[]

  // Food logs
  foodLogs: FoodLog[]

  // Recipe search and generation
  searchResults: Recipe[]
  isSearching: boolean
  generatedRecipes: Recipe[]
  isGenerating: boolean

  // Actions
  setCurrentMealPlan: (plan: MealPlan) => void
  addSavedRecipe: (recipe: Recipe) => void
  removeSavedRecipe: (recipeId: string) => void
  addFoodLog: (log: FoodLog) => void
  removeFoodLog: (logId: string) => void
  setSearchResults: (results: Recipe[]) => void
  setIsSearching: (searching: boolean) => void
  addGeneratedRecipe: (recipe: Recipe) => void
  setIsGenerating: (generating: boolean) => void
  clearSearchResults: () => void
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentMealPlan: null,
      savedRecipes: [],
      foodLogs: [],
      searchResults: [],
      isSearching: false,
      generatedRecipes: [],
      isGenerating: false,

      // Actions
      setCurrentMealPlan: (plan) => {
        set({ currentMealPlan: plan })
      },

      addSavedRecipe: (recipe) => {
        const savedRecipes = get().savedRecipes
        const exists = savedRecipes.find(r => r.id === recipe.id)

        if (!exists) {
          set({ savedRecipes: [...savedRecipes, recipe] })
        }
      },

      removeSavedRecipe: (recipeId) => {
        const savedRecipes = get().savedRecipes
        set({ savedRecipes: savedRecipes.filter(r => r.id !== recipeId) })
      },

      addFoodLog: (log) => {
        const foodLogs = get().foodLogs
        set({ foodLogs: [...foodLogs, log] })
      },

      removeFoodLog: (logId) => {
        const foodLogs = get().foodLogs
        set({ foodLogs: foodLogs.filter(log => log.id !== logId) })
      },

      setSearchResults: (results) => {
        set({ searchResults: results })
      },

      setIsSearching: (searching) => {
        set({ isSearching: searching })
      },

      addGeneratedRecipe: (recipe) => {
        const generatedRecipes = get().generatedRecipes
        set({ generatedRecipes: [recipe, ...generatedRecipes] })
      },

      setIsGenerating: (generating) => {
        set({ isGenerating: generating })
      },

      clearSearchResults: () => {
        set({ searchResults: [] })
      }
    }),
    {
      name: 'nutri-ai-meal-storage',
    }
  )
)