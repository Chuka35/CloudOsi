'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function GoogleSuccessContent() {
  const params = useSearchParams()

  useEffect(() => {
    const token = params.get('token')
    const name = params.get('name')

    if (token) {
      try {
        localStorage.setItem('cloudos_token', token)
        if (name) {
          // Optionally store display name hint
          localStorage.setItem('cloudos_google_name', decodeURIComponent(name))
        }
      } catch { /* ignore */ }
    }

    // Short delay so storage settles, then navigate
    setTimeout(() => {
      window.location.href = '/desktop'
    }, 100)
  }, [params])

  return (
    <div className="min-h-screen bg-[#08081a] flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-sm">Signing you in…</p>
      </div>
    </div>
  )
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#08081a] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GoogleSuccessContent />
    </Suspense>
  )
}
