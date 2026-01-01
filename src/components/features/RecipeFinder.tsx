'use client'

import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { useMealStore } from '@/store/mealStore'
import { aiService } from '@/lib/ai'
import { cn, generateId } from '@/lib/utils'

import { Search, Plus, Minus, Clock, Users, ChefHat, Loader2, Heart, X, Flame, Zap, BarChart3, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { Recipe } from '@/types'

export default function RecipeFinder() {
  const { profile } = useUserStore()
  const {
    searchResults,
    isSearching,
    savedRecipes,
    addSavedRecipe,
    removeSavedRecipe,
    setSearchResults,
    setIsSearching
  } = useMealStore()

  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState('')
  const [servings, setServings] = useState(4)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const { addFoodLog } = useMealStore()

  const handleLogMeal = (recipe: Recipe) => {
    const foodLog = {
      id: generateId(),
      userId: profile?.id || 'guest',
      date: new Date(),
      mealType: 'lunch' as any, // Default to lunch for now
      food: {
        id: recipe.id,
        name: recipe.name,
        nutrition: recipe.nutrition,
        servingSize: '1 serving',
        servingWeight: 300,
        category: 'other' as any
      },
      quantity: 1,
      nutrition: recipe.nutrition,
      loggedAt: new Date()
    }

    addFoodLog(foodLog)
    setToastMessage(`${recipe.name} logged successfully!`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setSelectedRecipe(null)
  }

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()])
      setCurrentIngredient('')
    }
  }

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient))
  }

  const handleSearchRecipes = async () => {
    // Automatically add the current ingredient if user forgot to click +
    let finalIngredients = [...ingredients]
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      finalIngredients.push(currentIngredient.trim())
      setIngredients(finalIngredients)
      setCurrentIngredient('')
    }

    if (finalIngredients.length === 0) return

    setIsSearching(true)
    try {
      const dietaryPreferences = profile?.dietaryPreferences || []
      const recipe = await aiService.generateRecipeFromIngredients(
        finalIngredients,
        dietaryPreferences,
        servings
      )

      setSearchResults([recipe])
    } catch (error) {
      console.error('Error generating recipe:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSaveRecipe = (recipe: Recipe) => {
    addSavedRecipe(recipe)
  }

  const handleUnsaveRecipe = (recipeId: string) => {
    removeSavedRecipe(recipeId)
  }

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some(r => r.id === recipeId)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/10 text-emerald-500'
      case 'medium': return 'bg-amber-500/10 text-amber-500'
      case 'hard': return 'bg-rose-500/10 text-rose-500'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Card className="h-full glass-panel border-0 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{recipe.name}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{recipe.description}</CardDescription>
          </div>
          <Button
            variant={isRecipeSaved(recipe.id) ? "default" : "ghost"}
            size="icon"
            onClick={() => isRecipeSaved(recipe.id)
              ? handleUnsaveRecipe(recipe.id)
              : handleSaveRecipe(recipe)
            }
            className={cn(
              "rounded-full transition-all duration-300",
              isRecipeSaved(recipe.id) ? "gradient-primary text-white scale-110 shadow-lg" : "hover:bg-primary/10 hover:text-primary text-muted-foreground"
            )}
          >
            <Heart
              className={`w-5 h-5 ${isRecipeSaved(recipe.id) ? 'fill-current' : ''}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recipe Info */}
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-primary" />
              {recipe.preparationTime + recipe.cookingTime} min
            </div>
            <div className="flex items-center border-l pl-4 border-border/40">
              <Users className="w-4 h-4 mr-1.5 text-primary" />
              {recipe.servings} servings
            </div>
          </div>
          <Badge className={cn("px-2 py-0.5 rounded-lg font-black border-0", getDifficultyColor(recipe.difficulty))}>
            {recipe.difficulty}
          </Badge>
        </div>

        {/* Nutrition Info */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'CAL', val: recipe.nutrition.calories, col: 'text-foreground' },
            { label: 'PRO', val: `${recipe.nutrition.protein}g`, col: 'text-rose-500' },
            { label: 'CAR', val: `${recipe.nutrition.carbs}g`, col: 'text-sky-500' },
            { label: 'FAT', val: `${recipe.nutrition.fat}g`, col: 'text-amber-500' }
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center p-2 rounded-xl bg-muted/30 border border-border/20">
              <span className="text-[10px] font-black text-muted-foreground/60 mb-1">{item.label}</span>
              <span className={cn("text-xs font-black", item.col)}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-[10px] font-bold uppercase bg-primary/5 text-primary border-0 hover:bg-primary/20 transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full rounded-2xl h-12 font-bold border-primary/20 hover:bg-primary/5 hover:border-primary transition-all group/btn"
          onClick={() => setSelectedRecipe(recipe)}
        >
          <ChefHat className="w-4 h-4 mr-2 text-primary group-hover/btn:scale-110 transition-transform" />
          View Detailed Steps
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Recipe Generator Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] gradient-primary p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl">
              <ChefHat className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tight italic">Flavor Lab</h1>
          </div>
          <h2 className="text-3xl font-black mb-4 leading-tight">What&apos;s in your fridge?</h2>
          <p className="text-white/80 font-medium text-lg">
            Our AI Chef will transform your random ingredients into professional-grade healthy recipes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Generator Form */}
        <Card className="lg:col-span-12 glass-panel border-0 shadow-xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Side: Inputs */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Search className="w-4 h-4 text-primary" /> Available Ingredients
                    </label>
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                      {ingredients.length} Added
                    </span>
                  </div>

                  <div className="relative group">
                    <div className={cn(
                      "absolute -inset-0.5 gradient-primary rounded-2xl blur opacity-0 transition duration-500 group-focus-within:opacity-30",
                      currentIngredient.trim() && "opacity-20"
                    )} />
                    <div className="relative flex items-center gap-3">
                      <Input
                        placeholder="e.g. Chicken breast, Avocado, Spinach..."
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                        className="h-16 px-6 bg-background/50 border-border/40 focus:border-primary rounded-2xl text-lg font-medium pr-16 shadow-inner"
                      />
                      <Button
                        onClick={handleAddIngredient}
                        disabled={!currentIngredient.trim()}
                        className={cn(
                          "absolute right-2 h-12 w-12 rounded-xl transition-all duration-300",
                          currentIngredient.trim()
                            ? "gradient-primary text-white shadow-lg shadow-primary/30 pulse-subtle scale-105"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Plus className={cn("w-6 h-6 transition-transform", currentIngredient.trim() && "rotate-90")} />
                      </Button>
                    </div>
                    {currentIngredient.trim() && (
                      <p className="absolute -bottom-6 left-2 text-[10px] font-black text-primary animate-pulse tracking-widest uppercase">
                        Click + icon or press Enter to add
                      </p>
                    )}
                  </div>

                  {/* Tag Cloud */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {ingredients.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic pl-2">Start typing to build your flavor list...</p>
                    ) : (
                      ingredients.map((ingredient, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-2 py-2 px-4 rounded-xl font-bold bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-all animate-in zoom-in duration-300 group"
                        >
                          {ingredient}
                          <X
                            className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => handleRemoveIngredient(ingredient)}
                          />
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Options & Actions */}
              <div className="space-y-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Target Servings
                  </label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <div className="flex-1 relative h-10 flex items-center group">
                      <div className="absolute inset-0 h-2 my-auto bg-primary/20 rounded-full border border-primary/10 group-hover:bg-primary/30 transition-colors" />
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={servings}
                        onChange={(e) => setServings(parseInt(e.target.value))}
                        className="relative z-10 w-full appearance-none bg-transparent cursor-pointer accent-primary"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                      onClick={() => setServings(Math.min(12, servings + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>

                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-2xl shadow-lg shadow-primary/5">
                      {servings}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSearchRecipes}
                    disabled={(ingredients.length === 0 && !currentIngredient.trim()) || isSearching}
                    className="w-full h-20 rounded-3xl gradient-primary text-xl font-black tracking-tight shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all group"
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span>CONSULTING CHEF...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <ChefHat className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                        <span>GENERATE MASTERPIECE</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        {searchResults.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-10 duration-1000">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-3xl font-black text-foreground tracking-tight">AI Generated Selection</h3>
              <div className="h-0.5 flex-1 mx-8 bg-gradient-to-r from-primary to-transparent opacity-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {/* Saved Recipes */}
        {savedRecipes.length > 0 && (
          <div className="pt-12 border-t border-border/40">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-3xl font-black text-foreground tracking-tight opacity-40">Your Cookbook</h3>
              <div className="h-0.5 flex-1 mx-8 bg-gradient-to-r from-primary to-transparent opacity-10" />
              <Badge variant="outline" className="rounded-full px-4 py-1 font-black text-primary border-primary/20 opacity-40">
                {savedRecipes.length} Saved
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grayscale-50 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {savedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-background/40 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 z-[100] animate-in fade-in duration-300">
          <div
            className="absolute inset-0 z-0"
            onClick={() => setSelectedRecipe(null)}
          />

          <Card className="relative z-10 w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden glass-panel border-0 shadow-[0_0_50px_rgba(0,0,0,0.1)] sm:rounded-[2.5rem] flex flex-col">
            {/* Modal Header/Close */}
            <div className="absolute top-4 right-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRecipe(null)}
                className="rounded-full bg-background/80 backdrop-blur-md hover:bg-destructive hover:text-white transition-all shadow-lg border border-border/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Hero Section */}
              <div className="relative p-6 sm:p-10 pt-12 text-center space-y-6">
                <div className="flex justify-center mb-2">
                  <Badge className="px-4 py-1.5 rounded-full gradient-primary text-white font-black uppercase tracking-widest text-[10px] border-0 shadow-lg">
                    {selectedRecipe.difficulty} Mastery
                  </Badge>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight px-4 italic">
                  {selectedRecipe.name}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto italic px-6">
                  &ldquo;{selectedRecipe.description}&rdquo;
                </p>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
                  {[
                    { label: 'Prep', val: `${selectedRecipe.preparationTime}m`, icon: Clock, color: 'text-blue-500' },
                    { label: 'Cook', val: `${selectedRecipe.cookingTime}m`, icon: Flame, color: 'text-orange-500' },
                    { label: 'Serves', val: selectedRecipe.servings, icon: Users, color: 'text-emerald-500' },
                    { label: 'Rating', val: 'A+', icon: Zap, color: 'text-amber-500' }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-background/40 border border-border/40 flex flex-col items-center justify-center shadow-sm">
                      <stat.icon className={cn("w-5 h-5 sm:w-6 sm:h-6 mb-2 sm:mb-3", stat.color)} />
                      <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">{stat.label}</span>
                      <span className="text-lg sm:text-xl font-black">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-10 pt-0 space-y-10 sm:space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                  {/* Ingredients */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
                      <h4 className="text-xl sm:text-2xl font-black tracking-tight">The Essentials</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/20 border border-transparent hover:border-primary/20 transition-all">
                          <span className="font-bold text-sm sm:text-base flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {ingredient.name}
                          </span>
                          <Badge variant="outline" className="font-black text-primary border-primary/20 bg-primary/5 text-[10px] sm:text-xs">
                            {ingredient.amount} {ingredient.unit}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
                      <h4 className="text-xl sm:text-2xl font-black tracking-tight">The Ritual</h4>
                    </div>
                    <div className="space-y-6">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-4 sm:gap-6 group">
                          <div className="flex-none w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-background border-2 border-border/40 flex items-center justify-center font-black text-sm sm:text-base group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            {index + 1}
                          </div>
                          <p className="text-sm sm:text-base font-medium leading-relaxed text-foreground/90">
                            {instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nutrition Profile */}
                <div className="pt-10 border-t border-border/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h4 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3 italic">
                      <BarChart3 className="w-6 h-6 text-primary" /> Nutrition Profile
                    </h4>
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
                      Standardized per serving
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                    {[
                      { l: 'Calories', v: selectedRecipe.nutrition.calories, c: 'text-foreground' },
                      { l: 'Protein', v: `${selectedRecipe.nutrition.protein}g`, c: 'text-rose-500' },
                      { l: 'Carbs', v: `${selectedRecipe.nutrition.carbs}g`, c: 'text-sky-500' },
                      { l: 'Fat', v: `${selectedRecipe.nutrition.fat}g`, c: 'text-amber-500' },
                      { l: 'Fiber', v: `${selectedRecipe.nutrition.fiber}g`, c: 'text-emerald-500' },
                      { l: 'Sugar', v: `${selectedRecipe.nutrition.sugar}g`, c: 'text-orange-400' }
                    ].map((nut, i) => (
                      <div key={i} className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-background/50 border border-border/40 shadow-sm hover-lift">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{nut.l}</p>
                        <p className={cn("text-base sm:text-lg font-black", nut.c)}>{nut.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 sm:p-6 bg-background/80 backdrop-blur-xl border-t border-border/40 flex items-center gap-3">
              <Button
                onClick={() => {
                  isRecipeSaved(selectedRecipe.id)
                    ? handleUnsaveRecipe(selectedRecipe.id)
                    : handleSaveRecipe(selectedRecipe);
                }}
                variant={isRecipeSaved(selectedRecipe.id) ? "default" : "outline"}
                className={cn(
                  "flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base transition-all",
                  isRecipeSaved(selectedRecipe.id) ? "gradient-primary text-white" : "border-primary/20 hover:bg-primary/5 text-primary"
                )}
              >
                {isRecipeSaved(selectedRecipe.id) ? (
                  <>
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    SAVED TO COOKBOOK
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    SAVE RECIPE
                  </>
                )}
              </Button>
              <Button
                className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl gradient-primary text-white font-black text-sm sm:text-base shadow-xl shadow-primary/20"
                onClick={() => handleLogMeal(selectedRecipe)}
              >
                LOG AS MEAL
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  )
}