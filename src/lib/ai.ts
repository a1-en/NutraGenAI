import type { UserProfile, Recipe, MealPlan, DietaryPreference, HealthGoal } from '@/types'

// AI Service class for handling all AI-related operations via server-side proxy
export class AIService {
  // Generate personalized meal plan
  async generateMealPlan(
    userProfile: UserProfile,
    days: number = 7,
    preferences?: string[]
  ): Promise<MealPlan> {
    try {
      const prompt = this.buildMealPlanPrompt(userProfile, days, preferences)

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a professional nutritionist and meal planning expert. Generate detailed, healthy meal plans with accurate nutritional information. You MUST return valid JSON only, no markdown formatting.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate meal plan')
      }

      const data = await response.json()
      return this.parseMealPlanResponse(data.choices[0].message.content, userProfile)
    } catch (error: any) {
      console.error('Error generating meal plan:', error)
      if (error.message?.includes('API key is missing')) {
        throw error
      }
      return this.getFallbackMealPlan(userProfile)
    }
  }

  // Generate recipes based on available ingredients
  async generateRecipeFromIngredients(
    ingredients: string[],
    dietaryPreferences: DietaryPreference[] = [],
    servings: number = 4
  ): Promise<Recipe> {
    try {
      const prompt = this.buildRecipePrompt(ingredients, dietaryPreferences, servings)

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a creative chef and nutritionist. Create healthy, delicious recipes using available ingredients with accurate nutritional information and clear instructions. You MUST return valid JSON only, no markdown formatting.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          response_format: { type: "json_object" }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate recipe')
      }

      const data = await response.json()
      return this.parseRecipeResponse(data.choices[0].message.content, ingredients)
    } catch (error) {
      console.error('Error generating recipe:', error)
      throw error
    }
  }

  // AI Coach chat responses
  async getChatResponse(
    message: string,
    userProfile?: UserProfile,
    context?: string[]
  ): Promise<string> {
    try {
      const systemPrompt = this.buildChatSystemPrompt(userProfile)

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...(context?.map(msg => ({ role: 'assistant', content: msg })) || []),
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to get chat response')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error getting chat response:', error)
      return "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again."
    }
  }

  // Analyze food from image description or text
  async analyzeFoodInput(input: string, isImageDescription: boolean = false): Promise<{
    foodName: string
    estimatedCalories: number
    nutrition: {
      protein: number
      carbs: number
      fat: number
      fiber: number
    }
    servingSize: string
  }> {
    try {
      const prompt = isImageDescription
        ? `Analyze this food image description and provide nutritional information: "${input}"`
        : `Analyze this food item and provide nutritional information: "${input}"`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a nutrition expert. Analyze food items and provide accurate nutritional information. Return data in JSON format.'
            },
            {
              role: 'user',
              content: `${prompt}\n\nReturn as JSON: { "foodName": "", "estimatedCalories": 0, "nutrition": {"protein": 0, "carbs": 0, "fat": 0, "fiber": 0}, "servingSize": "" }`
            }
          ],
          temperature: 0.3,
          max_tokens: 300,
          response_format: { type: "json_object" }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to analyze food')
      }

      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)
      return result
    } catch (error) {
      console.error('Error analyzing food:', error)
      return {
        foodName: input,
        estimatedCalories: 0,
        nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0 },
        servingSize: '1 serving'
      }
    }
  }

  // Helper methods
  private buildMealPlanPrompt(userProfile: UserProfile, days: number, preferences?: string[]): string {
    const { age, weight, height, activityLevel, dietaryPreferences, healthGoals } = userProfile

    return `Create a ${days}-day meal plan for a user with the following profile:
    - Age: ${age}, Weight: ${weight}kg, Height: ${height}cm
    - Activity Level: ${activityLevel}
    - Dietary Preferences: ${dietaryPreferences.join(', ')}
    - Health Goals: ${healthGoals.join(', ')}
    ${preferences ? `- Additional Preferences: ${preferences.join(', ')}` : ''}

    Include breakfast, lunch, dinner, and 1-2 snacks per day.
    
    The output MUST be a valid JSON object with the following structure:
    {
      "name": "Plan Name",
      "targetNutrition": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "sugar": 0, "sodium": 0 },
      "meals": [
        {
          "day": 1,
          "breakfast": { "name": "Meal Name", "type": "breakfast", "preparationTime": 15, "instructions": ["step 1"], "totalNutrition": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0 } },
          "lunch": { ... },
          "dinner": { ... },
          "snacks": [ { ... } ]
        }
      ]
    }
    
    Ensure all nutrition values are calculated numbers (no units).`
  }

  private buildRecipePrompt(ingredients: string[], dietaryPreferences: DietaryPreference[], servings: number): string {
    return `Create a healthy recipe using these ingredients: ${ingredients.join(', ')}
    
    Requirements:
    - Serves ${servings} people
    - Dietary preferences: ${dietaryPreferences.join(', ') || 'None specified'}
    
    The output MUST be a valid JSON object with the following structure:
    {
      "name": "Recipe Name",
      "description": "Short description",
      "ingredients": [ { "name": "", "amount": 0, "unit": "", "optional": false } ],
      "instructions": [ "Step 1", "Step 2" ],
      "preparationTime": 0,
      "cookingTime": 0,
      "servings": ${servings},
      "difficulty": "medium",
      "nutrition": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "sugar": 0, "sodium": 0 },
      "tags": [ "healthy", "dinner", "quick" ]
    }`
  }

  private buildChatSystemPrompt(userProfile?: UserProfile): string {
    const basePrompt = `You are a friendly, knowledgeable AI nutrition coach. Provide helpful, evidence-based advice about healthy eating, nutrition, and wellness. Keep responses concise but informative. Always be encouraging and supportive.`

    if (userProfile) {
      const { dietaryPreferences, healthGoals, allergies } = userProfile
      return `${basePrompt}
      
      User context:
      - Dietary preferences: ${dietaryPreferences.join(', ')}
      - Health goals: ${healthGoals.join(', ')}
      - Allergies: ${allergies.join(', ') || 'None'}
      
      Tailor your advice to their specific needs and restrictions.`
    }

    return basePrompt
  }

  private parseMealPlanResponse(response: string, userProfile: UserProfile): MealPlan {
    try {
      const parsed = JSON.parse(response)
      const startDate = new Date()
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + (parsed.meals.length - 1))

      const meals = parsed.meals.map((dayPlan: any, index: number) => {
        const date = new Date(startDate)
        date.setDate(date.getDate() + index)

        return {
          date: date,
          breakfast: dayPlan.breakfast ? { ...dayPlan.breakfast, id: `meal_${Date.now()}_b_${index}` } : undefined,
          lunch: dayPlan.lunch ? { ...dayPlan.lunch, id: `meal_${Date.now()}_l_${index}` } : undefined,
          dinner: dayPlan.dinner ? { ...dayPlan.dinner, id: `meal_${Date.now()}_d_${index}` } : undefined,
          snacks: dayPlan.snacks ? dayPlan.snacks.map((s: any, i: number) => ({ ...s, id: `meal_${Date.now()}_s_${index}_${i}` })) : []
        }
      })

      return {
        id: `plan_${Date.now()}`,
        userId: userProfile.id,
        name: parsed.name || 'AI Generated Plan',
        startDate,
        endDate,
        meals,
        targetNutrition: parsed.targetNutrition || { calories: 2000, protein: 100, carbs: 200, fat: 60, fiber: 25, sugar: 30, sodium: 2000 },
        createdAt: new Date()
      }
    } catch (error) {
      console.error('Error parsing meal plan:', error)
      return this.getFallbackMealPlan(userProfile)
    }
  }

  private parseRecipeResponse(response: string, ingredients: string[]): Recipe {
    try {
      const parsed = JSON.parse(response)

      return {
        id: `recipe_${Date.now()}`,
        name: parsed.name || 'Unknown Recipe',
        description: parsed.description || 'No description provided.',
        ingredients: parsed.ingredients || [],
        instructions: parsed.instructions || [],
        preparationTime: parsed.preparationTime || 15,
        cookingTime: parsed.cookingTime || 15,
        servings: parsed.servings || 4,
        difficulty: parsed.difficulty || 'medium',
        nutrition: parsed.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
        tags: parsed.tags || [],
        image: '/images/placeholder-recipe.jpg'
      }
    } catch (error) {
      console.error('Error parsing recipe:', error)
      throw new Error('Failed to parse recipe response')
    }
  }

  private getFallbackMealPlan(userProfile: UserProfile): MealPlan {
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)

    return {
      id: `fallback_plan_${Date.now()}`,
      userId: userProfile.id,
      name: 'Basic Healthy Plan (Fallback)',
      startDate,
      endDate,
      meals: [],
      targetNutrition: {
        calories: 2000,
        protein: 125,
        carbs: 225,
        fat: 67,
        fiber: 25,
        sugar: 50,
        sodium: 2300
      },
      createdAt: new Date()
    }
  }
}

export const aiService = new AIService()

export const calculateDailyCalories = (profile: UserProfile): number => {
  const { age, weight, height, activityLevel } = profile
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }
  return Math.round(bmr * activityMultipliers[activityLevel])
}

export const calculateMacroTargets = (calories: number, healthGoals: HealthGoal[]) => {
  let proteinRatio = 0.25
  let carbRatio = 0.45
  let fatRatio = 0.30
  if (healthGoals.includes('muscle_gain')) {
    proteinRatio = 0.30
    carbRatio = 0.40
    fatRatio = 0.30
  } else if (healthGoals.includes('weight_loss')) {
    proteinRatio = 0.30
    carbRatio = 0.35
    fatRatio = 0.35
  }
  return {
    protein: Math.round(calories * proteinRatio / 4),
    carbs: Math.round(calories * carbRatio / 4),
    fat: Math.round(calories * fatRatio / 9)
  }
}