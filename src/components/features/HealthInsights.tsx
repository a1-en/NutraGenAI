'use client'

import { useState, useMemo } from 'react'
import { useUserStore } from '@/store/userStore'

import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target,
  Award,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'



// Mock data for demonstration
const generateMockWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day) => ({
    day,
    calories: 1800 + Math.random() * 400,
    protein: 80 + Math.random() * 40,
    carbs: 200 + Math.random() * 80,
    fat: 60 + Math.random() * 30,
    water: 2000 + Math.random() * 1000,
    weight: 70 + (Math.random() - 0.5) * 2
  }))
}

const generateMockMonthlyData = () => {
  return Array.from({ length: 30 }, (_, index) => ({
    date: `Day ${index + 1}`,
    calories: 1800 + Math.random() * 400,
    weight: 70 + (Math.random() - 0.5) * 5,
    avgMacros: {
      protein: 80 + Math.random() * 20,
      carbs: 200 + Math.random() * 50,
      fat: 60 + Math.random() * 20
    }
  }))
}

export default function HealthInsights() {
  const { profile } = useUserStore()

  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week')

  const weeklyData = useMemo(() => generateMockWeeklyData(), [])
  const monthlyData = useMemo(() => generateMockMonthlyData(), [])
  
  const currentData = timeframe === 'week' ? weeklyData : monthlyData

  // Calculate trends
  const caloriesTrend = useMemo(() => {
    if (currentData.length < 2) return 0
    const recent = currentData.slice(-3).reduce((sum, day) => sum + day.calories, 0) / 3
    const previous = currentData.slice(-6, -3).reduce((sum, day) => sum + day.calories, 0) / 3
    return ((recent - previous) / previous) * 100
  }, [currentData])

  const weightTrend = useMemo(() => {
    if (currentData.length < 2) return 0
    const recent = currentData[currentData.length - 1].weight
    const previous = currentData[currentData.length - 7].weight
    return recent - previous
  }, [currentData])

  // Macro distribution for pie chart
  const macroData = useMemo(() => {
    const avgData = currentData.reduce(
      (acc, day) => {
        if ('protein' in day) {
          return {
            protein: acc.protein + day.protein,
            carbs: acc.carbs + day.carbs,
            fat: acc.fat + day.fat
          }
        } else {
          return {
            protein: acc.protein + day.avgMacros.protein,
            carbs: acc.carbs + day.avgMacros.carbs,
            fat: acc.fat + day.avgMacros.fat
          }
        }
      },
      { protein: 0, carbs: 0, fat: 0 }
    )
    
    const count = currentData.length
    return [
      { name: 'Protein', value: Math.round(avgData.protein / count), color: '#8884d8' },
      { name: 'Carbs', value: Math.round(avgData.carbs / count), color: '#82ca9d' },
      { name: 'Fat', value: Math.round(avgData.fat / count), color: '#ffc658' }
    ]
  }, [currentData])

  // AI-generated insights
  const insights = useMemo(() => {
    const avgCalories = currentData.reduce((sum, day) => sum + day.calories, 0) / currentData.length
    const targetCalories = 2000 // This would come from user profile
    
    const insights = []
    
    if (avgCalories > targetCalories * 1.1) {
      insights.push({
        type: 'warning',
        title: 'Calorie Intake Above Target',
        message: `Your average daily intake is ${Math.round(avgCalories - targetCalories)} calories above your target. Consider reducing portion sizes or choosing lower-calorie alternatives.`,
        action: 'View meal suggestions'
      })
    } else if (avgCalories < targetCalories * 0.9) {
      insights.push({
        type: 'info',
        title: 'Low Calorie Intake',
        message: `You're eating ${Math.round(targetCalories - avgCalories)} calories below your target. Make sure you're getting enough energy for your activities.`,
        action: 'Add healthy snacks'
      })
    }

    if (caloriesTrend > 10) {
      insights.push({
        type: 'warning',
        title: 'Increasing Calorie Trend',
        message: 'Your calorie intake has been trending upward. Consider reviewing your recent meal choices.',
        action: 'Review meal plan'
      })
    }

    if (weightTrend < -0.5 && profile?.healthGoals.includes('weight_loss')) {
      insights.push({
        type: 'success',
        title: 'Great Progress!',
        message: `You've lost ${Math.abs(weightTrend).toFixed(1)} kg this week. Keep up the excellent work!`,
        action: 'Share achievement'
      })
    }

    return insights
  }, [currentData, caloriesTrend, weightTrend, profile])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Health Insights</h2>
          <p className="text-muted-foreground">Track your nutrition trends and progress</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={timeframe === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeframe('week')}
            size="sm"
            className="button-hover hover-lift"
          >
            Week
          </Button>
          <Button 
            variant={timeframe === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeframe('month')}
            size="sm"
            className="button-hover hover-lift"
          >
            Month
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Calories</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Math.round(currentData.reduce((sum, day) => sum + day.calories, 0) / currentData.length)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {caloriesTrend > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              )}
              {Math.abs(caloriesTrend).toFixed(1)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight Change</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weightTrend > 0 ? '+' : ''}{weightTrend.toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground">
              This {timeframe}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein Avg</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(currentData.reduce((sum, day) => {
                if ('protein' in day) {
                  return sum + day.protein
                } else {
                  return sum + day.avgMacros.protein
                }
              }, 0) / currentData.length)}g
            </div>
            <p className="text-xs text-muted-foreground">
              Daily average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hydration Avg</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(currentData.reduce((sum, day) => {
                if ('water' in day) {
                  return sum + day.water
                } else {
                  return sum + 2000 // Default water intake for monthly data
                }
              }, 0) / currentData.length / 1000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">
              Daily average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Calorie Trend
            </CardTitle>
            <CardDescription>
              Daily calorie intake over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={timeframe === 'week' ? 'day' : 'date'} />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Macro Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Macro Distribution
            </CardTitle>
            <CardDescription>
              Average macronutrient breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}g`}
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weight Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Weight Progress
          </CardTitle>
          <CardDescription>
            Track your weight changes over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={timeframe === 'week' ? 'day' : 'date'} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={{ fill: '#82ca9d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              AI Insights & Recommendations
            </CardTitle>
            <CardDescription>
              Personalized insights based on your nutrition data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  insight.type === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : insight.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <h4 className="font-medium mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{insight.message}</p>
                <Button variant="outline" size="sm">
                  {insight.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}