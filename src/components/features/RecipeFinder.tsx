'use client'

import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { useMealStore } from '@/store/mealStore'
import { aiService } from '@/lib/ai'
import { cn, generateId } from '@/lib/utils'

import { Search, Plus, Clock, Users, ChefHat, Loader2, Heart, X, Flame, Zap, BarChart3 } from 'lucide-react'
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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-12 text-white shadow-2xl">
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
                      "absolute -inset-0.5 bg-gradient-primary rounded-2xl blur opacity-0 transition duration-500 group-focus-within:opacity-30",
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
                  <div className="flex items-center gap-6">
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={servings}
                      onChange={(e) => setServings(parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-2xl">
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-2xl flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto glass-panel border-0 shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[3rem] p-0 custom-scrollbar relative">
            <div className="sticky top-0 right-0 p-6 flex justify-end z-10 pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRecipe(null)}
                className="rounded-full bg-background/50 hover:bg-destructive hover:text-white transition-all pointer-events-auto shadow-xl"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <CardContent className="p-12 pt-0 space-y-12">
              {/* Header */}
              <div className="text-center space-y-4">
                <Badge className="px-4 py-1.5 rounded-full gradient-primary text-white font-black uppercase tracking-widest text-[10px] border-0 shadow-lg mb-4">
                  {selectedRecipe.difficulty} Mastery
                </Badge>
                <h2 className="text-5xl font-black text-foreground tracking-tight leading-tight">
                  {selectedRecipe.name}
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                  &ldquo;{selectedRecipe.description}&rdquo;
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Preparation', val: `${selectedRecipe.preparationTime}m`, icon: Clock },
                  { label: 'Cooking', val: `${selectedRecipe.cookingTime}m`, icon: Flame },
                  { label: 'Servings', val: selectedRecipe.servings, icon: Users },
                  { label: 'Health Score', val: 'A+', icon: Zap }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-[2rem] bg-primary/5 flex flex-col items-center justify-center border border-primary/10">
                    <stat.icon className="w-6 h-6 text-primary mb-3" />
                    <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">{stat.label}</span>
                    <span className="text-xl font-black">{stat.val}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Ingredients */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">
                      🛒
                    </div>
                    <h4 className="text-2xl font-black tracking-tight">The Essentials</h4>
                  </div>
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all group">
                        <span className="font-bold flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {ingredient.name}
                        </span>
                        <span className="font-black text-primary px-3 py-1 bg-primary/5 rounded-lg text-sm">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                      🔪
                    </div>
                    <h4 className="text-2xl font-black tracking-tight">The Ritual</h4>
                  </div>
                  <div className="space-y-4">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-6 group">
                        <div className="flex-none w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center font-black text-lg group-hover:bg-primary group-hover:text-white transition-all">
                          {index + 1}
                        </div>
                        <p className="text-base font-medium pt-2 leading-relaxed">
                          {instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nutrition Footer */}
              <div className="pt-12 border-t border-border/40">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" /> Nutrition Profile
                  </h4>
                  <span className="text-sm font-bold text-muted-foreground">Standardized per serving</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {[
                    { l: 'Calories', v: selectedRecipe.nutrition.calories, c: 'text-foreground' },
                    { l: 'Protein', v: `${selectedRecipe.nutrition.protein}g`, c: 'text-rose-500' },
                    { l: 'Carbs', v: `${selectedRecipe.nutrition.carbs}g`, c: 'text-sky-500' },
                    { l: 'Fat', v: `${selectedRecipe.nutrition.fat}g`, c: 'text-amber-500' },
                    { l: 'Fiber', v: `${selectedRecipe.nutrition.fiber}g`, c: 'text-emerald-500' },
                    { l: 'Sugar', v: `${selectedRecipe.nutrition.sugar}g`, c: 'text-rose-400' }
                  ].map((nut, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-muted/20 border border-border/20">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{nut.l}</p>
                      <p className={cn("text-lg font-black", nut.c)}>{nut.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}