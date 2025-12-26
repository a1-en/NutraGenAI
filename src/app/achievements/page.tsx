import AppLayout from '@/components/layout/AppLayout'
import OnboardingCheck from '@/components/layout/OnboardingCheck'
import Gamification from '@/components/features/Gamification'

export default function AchievementsPage() {
  return (
    <OnboardingCheck>
      <AppLayout>
        <div className="px-6">
          <Gamification />
        </div>
      </AppLayout>
    </OnboardingCheck>
  )
}