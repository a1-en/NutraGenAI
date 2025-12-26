import AppLayout from '@/components/layout/AppLayout'
import OnboardingCheck from '@/components/layout/OnboardingCheck'
import Dashboard from '@/components/features/Dashboard'

export default function Home() {
  return (
    <OnboardingCheck>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </OnboardingCheck>
  )
}
