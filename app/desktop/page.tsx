"use client"

import { useEffect, useState, useCallback } from "react"
import { DesktopProvider, useDesktop } from "@/lib/desktop-context"
import { Window } from "@/components/desktop/window"
import { Taskbar } from "@/components/desktop/taskbar"
import { DesktopIcons } from "@/components/desktop/desktop-icons"
import { AuroraBackground } from "@/components/aurora-background"
import { getApp } from "@/lib/apps"
import { useAuthStore } from "@/lib/stores/authStore"
import { AccentColorSync } from "@/components/accent-color-sync"
import { Mail, X, CheckCircle2, RefreshCw } from "lucide-react"

function VerificationBanner() {
  const { user, sendVerification } = useAuthStore()
  const [dismissed, setDismissed] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = useCallback(async () => {
    setSending(true)
    const ok = await sendVerification()
    setSending(false)
    setSent(ok)
  }, [sendVerification])

  if (!user || user.isGuest || user.emailVerified || dismissed) return null

  return (
    <div className="absolute top-0 left-0 right-0 z-[999] flex items-center gap-3 px-4 py-2.5"
      style={{ background: 'rgba(0, 120, 212, 0.92)', backdropFilter: 'blur(8px)' }}>
      <Mail className="w-4 h-4 text-white flex-shrink-0" />
      <p className="flex-1 text-white text-sm">
        {sent
          ? 'Verification email sent! Check your inbox.'
          : 'Please verify your email address to secure your account.'}
      </p>
      {!sent && (
        <button
          onClick={handleSend}
          disabled={sending}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors disabled:opacity-50"
        >
          {sending ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
          {sending ? 'Sending...' : 'Resend email'}
        </button>
      )}
      <button onClick={() => setDismissed(true)} className="text-white/70 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function VerifiedToast({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-2xl"
      style={{ background: 'rgba(15, 123, 15, 0.95)', backdropFilter: 'blur(12px)' }}>
      <CheckCircle2 className="w-5 h-5 text-[#6CCB5F]" />
      <span className="text-white text-sm font-medium">Email verified successfully!</span>
    </div>
  )
}

function DesktopContent({ showVerifiedToast }: { showVerifiedToast: boolean }) {
  const { state } = useDesktop()
  const [toastVisible, setToastVisible] = useState(showVerifiedToast)

  return (
    <div className="h-screen w-screen overflow-hidden relative select-none">
      <AuroraBackground />
      <VerificationBanner />
      {toastVisible && <VerifiedToast onDone={() => setToastVisible(false)} />}
      <DesktopIcons />
      {state.windows.map(window => {
        const appConfig = getApp(window.appId)
        if (!appConfig) return null
        const AppComponent = appConfig.component
        return (
          <Window key={window.id} window={window}>
            <AppComponent />
          </Window>
        )
      })}
      <Taskbar />
    </div>
  )
}

export default function DesktopPage() {
  const { isAuthenticated, loadUser } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)
  const [showVerifiedToast, setShowVerifiedToast] = useState(false)

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
    }
    return () => unsub()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('verified') === '1') {
        setShowVerifiedToast(true)
        window.history.replaceState({}, '', '/desktop')
      }
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const currentToken = localStorage.getItem('cloudos_token') || useAuthStore.getState().token
    if (!currentToken) {
      window.location.href = '/auth'
      return
    }
    loadUser().then(() => {
      if (!useAuthStore.getState().isAuthenticated) {
        window.location.href = '/auth'
      }
    })
  }, [hydrated, loadUser])

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0f0f23]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#0078D4] border-t-transparent animate-spin" />
          <p className="text-white/40 text-sm">Loading CloudOS...</p>
        </div>
      </div>
    )
  }

  return (
    <DesktopProvider>
      <AccentColorSync />
      <DesktopContent showVerifiedToast={showVerifiedToast} />
    </DesktopProvider>
  )
}
