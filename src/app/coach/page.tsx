import AppLayout from '@/components/layout/AppLayout'
import OnboardingCheck from '@/components/layout/OnboardingCheck'
import AICoach from '@/components/features/AICoach'
import { Bot, MessageCircle } from 'lucide-react'

export default function CoachPage() {
  return (
    <OnboardingCheck>
      <AppLayout>
        <div className="space-y-8 p-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border-0 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 flex items-center">
                <Bot className="w-8 h-8 mr-3 text-primary" />
                AI Nutrition Coach
              </h1>
              <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
                Get instant, personalized nutrition advice and expert answers to your healthy eating questions.
              </p>
            </div>

            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="max-w-4xl mx-auto glass-panel p-1 rounded-3xl">
            <AICoach />
          </div>
        </div>
      </AppLayout>
    </OnboardingCheck>
  )
}