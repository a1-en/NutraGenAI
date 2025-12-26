import AppLayout from '@/components/layout/AppLayout'
import OnboardingCheck from '@/components/layout/OnboardingCheck'
import HealthInsights from '@/components/features/HealthInsights'

export default function InsightsPage() {
  return (
    <OnboardingCheck>
      <AppLayout>
        <div className="px-6">
          <HealthInsights />
        </div>
      </AppLayout>
    </OnboardingCheck>
  )
}