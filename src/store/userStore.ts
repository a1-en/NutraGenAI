import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, DailyLog, UserBadge, ChatSession, ProgressEntry } from '@/types'

interface UserState {
  // User profile
  profile: UserProfile | null
  isAuthenticated: boolean
  
  // Daily tracking
  todayLog: DailyLog | null
  currentStreak: number
  
  // Badges and achievements
  badges: UserBadge[]
  
  // Chat sessions
  chatSessions: ChatSession[]
  activeChatSession: string | null
  
  // Progress tracking
  progressEntries: ProgressEntry[]
  
  // Actions
  setProfile: (profile: UserProfile) => void
  updateProfile: (updates: Partial<UserProfile>) => void
  setTodayLog: (log: DailyLog) => void
  addBadge: (badge: UserBadge) => void
  addChatSession: (session: ChatSession) => void
  setActiveChatSession: (sessionId: string | null) => void
  addProgressEntry: (entry: ProgressEntry) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      isAuthenticated: false,
      todayLog: null,
      currentStreak: 0,
      badges: [],
      chatSessions: [],
      activeChatSession: null,
      progressEntries: [],

      // Actions
      setProfile: (profile) => {
        set({ profile, isAuthenticated: true })
      },

      updateProfile: (updates) => {
        const currentProfile = get().profile
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              ...updates,
              updatedAt: new Date()
            }
          })
        }
      },

      setTodayLog: (log) => {
        set({ todayLog: log })
      },

      addBadge: (badge) => {
        const badges = get().badges
        const existingBadge = badges.find(b => b.badge.id === badge.badge.id)
        
        if (!existingBadge) {
          set({ badges: [...badges, badge] })
        }
      },

      addChatSession: (session) => {
        const sessions = get().chatSessions
        set({ chatSessions: [session, ...sessions] })
      },

      setActiveChatSession: (sessionId) => {
        set({ activeChatSession: sessionId })
      },

      addProgressEntry: (entry) => {
        const entries = get().progressEntries
        set({ 
          progressEntries: [entry, ...entries].sort(
            (a, b) => b.date.getTime() - a.date.getTime()
          )
        })
      },

      logout: () => {
        set({
          profile: null,
          isAuthenticated: false,
          todayLog: null,
          currentStreak: 0,
          badges: [],
          chatSessions: [],
          activeChatSession: null,
          progressEntries: []
        })
      }
    }),
    {
      name: 'nutri-ai-user-storage',
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        badges: state.badges,
        progressEntries: state.progressEntries
      })
    }
  )
)