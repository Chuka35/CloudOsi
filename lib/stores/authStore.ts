'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  selectedVoice: string
  aiModel: string
  autoSpeak: boolean
  showTranscript: boolean
  theme: string
  accentColor: string
  wallpaper: string
  isPro: boolean
  isGuest: boolean
  emailVerified: boolean
  storageUsed: number
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  signup: (email: string, password: string, displayName: string) => Promise<void>
  signin: (email: string, password: string) => Promise<void>
  continueAsGuest: () => Promise<void>
  signout: () => Promise<void>
  loadUser: () => Promise<void>
  updateSettings: (settings: Partial<User>) => Promise<void>
  sendVerification: () => Promise<boolean>
  clearError: () => void
}

async function apiFetch(path: string, options: RequestInit = {}, token?: string | null) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(path, { ...options, headers: { ...headers, ...(options.headers as Record<string, string> || {}) } })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      clearError: () => set({ error: null }),

      signup: async (email, password, displayName) => {
        set({ isLoading: true, error: null })
        try {
          const data = await apiFetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, displayName })
          })
          localStorage.setItem('cloudos_token', data.token)
          set({ token: data.token, user: data.user, isLoading: false, isAuthenticated: true })
        } catch (error: unknown) {
          set({ error: error instanceof Error ? error.message : 'Signup failed', isLoading: false })
          throw error
        }
      },

      signin: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const data = await apiFetch('/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password })
          })
          localStorage.setItem('cloudos_token', data.token)
          set({ token: data.token, user: data.user, isLoading: false, isAuthenticated: true })
        } catch (error: unknown) {
          set({ error: error instanceof Error ? error.message : 'Sign in failed', isLoading: false })
          throw error
        }
      },

      continueAsGuest: async () => {
        set({ isLoading: true, error: null })
        try {
          const data = await apiFetch('/api/auth/guest', { method: 'POST' })
          localStorage.setItem('cloudos_token', data.token)
          set({ token: data.token, user: data.user, isLoading: false, isAuthenticated: true })
        } catch (error: unknown) {
          set({ error: error instanceof Error ? error.message : 'Could not start guest session', isLoading: false })
          throw error
        }
      },

      signout: async () => {
        const { token } = get()
        try {
          if (token) {
            await apiFetch('/api/auth/signout', { method: 'POST' }, token)
          }
        } finally {
          localStorage.removeItem('cloudos_token')
          set({ user: null, token: null, isAuthenticated: false })
        }
      },

      loadUser: async () => {
        const token = localStorage.getItem('cloudos_token') || get().token
        if (!token) return
        try {
          const data = await apiFetch('/api/auth/me', {}, token)
          set({ user: data.user, token, isAuthenticated: true })
        } catch {
          localStorage.removeItem('cloudos_token')
          set({ user: null, token: null, isAuthenticated: false })
        }
      },

      updateSettings: async (settings) => {
        const { token } = get()
        if (!token) return
        try {
          const data = await apiFetch('/api/auth/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
          }, token)
          set({ user: data.user })
        } catch (error: unknown) {
          set({ error: error instanceof Error ? error.message : 'Failed to update settings' })
        }
      },

      sendVerification: async () => {
        const { token } = get()
        if (!token) return false
        try {
          const data = await apiFetch('/api/auth/send-verification', { method: 'POST' }, token)
          return data.sent === true
        } catch {
          return false
        }
      }
    }),
    {
      name: 'cloudos-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)
