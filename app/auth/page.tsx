'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuroraBackground } from '@/components/aurora-background'
import { CloudLogo } from '@/components/cloud-logo'
import { useAuthStore } from '@/lib/stores/authStore'
import {
  Cloud,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle,
  UserCircle,
  CheckCircle2,
  Loader2,
  Quote
} from 'lucide-react'

function AuthContent() {
  const searchParams = useSearchParams()
  const [isSignIn, setIsSignIn] = useState(searchParams.get('mode') === 'signin')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [progress, setProgress] = useState(0)

  const { signup, signin, continueAsGuest, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const isSubmitting = useRef(false)

  const URL_ERRORS: Record<string, string> = {
    google_not_configured: 'Google login is not yet configured. Please use email sign-up for now.',
    google_denied: 'Google login was cancelled. Please try again.',
    google_token_failed: 'Google login failed — could not get access token. Please try email instead.',
    google_userinfo_failed: 'Could not retrieve your Google profile. Please try again.',
    google_db_failed: 'Account creation failed. Please try email sign-up.',
    google_server_error: 'Google login encountered an error. Please try email sign-up.',
  }
  const urlError = URL_ERRORS[searchParams.get('error') || ''] || null

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isAuthenticated && !isSubmitting.current) {
      window.location.href = '/desktop'
    }
  }, [isAuthenticated])

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'fullName':
        if (value.length < 2) return 'Name must be at least 2 characters'
        break
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
        break
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters'
        break
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match'
        break
    }
    return ''
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const err = validateField(name, formData[name as keyof typeof formData])
    setFieldErrors(prev => ({ ...prev, [name]: err }))
  }

  const handleChange = (name: string, value: string) => {
    clearError()
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const err = validateField(name, value)
      setFieldErrors(prev => ({ ...prev, [name]: err }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!isSignIn) {
      newErrors.fullName = validateField('fullName', formData.fullName)
      newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword)
    }
    newErrors.email = validateField('email', formData.email)
    newErrors.password = validateField('password', formData.password)

    const hasErrors = Object.values(newErrors).some(e => e)
    if (hasErrors) {
      setFieldErrors(newErrors)
      setTouched({ fullName: true, email: true, password: true, confirmPassword: true })
      return
    }

    isSubmitting.current = true
    try {
      if (isSignIn) {
        await signin(formData.email, formData.password)
      } else {
        await signup(formData.email, formData.password, formData.fullName)
      }
      setIsSuccess(true)
    } catch {
      isSubmitting.current = false
    }
  }

  const handleGuestLogin = async () => {
    isSubmitting.current = true
    try {
      await continueAsGuest()
      setIsSuccess(true)
    } catch {
      isSubmitting.current = false
    }
  }

  useEffect(() => {
    if (!isSuccess) return
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 4
      })
    }, 30)
    return () => clearInterval(interval)
  }, [isSuccess])

  useEffect(() => {
    if (progress >= 100) {
      window.location.href = '/desktop'
    }
  }, [progress])

  const inputClass = (name: string) => `
    w-full h-10 px-3 rounded text-sm text-white placeholder:text-white/25 outline-none transition-colors
    ${fieldErrors[name] && touched[name]
      ? 'bg-[rgba(255,82,82,0.04)] border border-[#FF5252]'
      : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] focus:border-[#0078D4] focus:bg-[rgba(0,120,212,0.06)]'
    }
  `

  return (
    <div className="min-h-screen flex relative">
      <AuroraBackground />

      {/* Left Half */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-14 relative z-10" style={{ background: 'rgba(15, 15, 35, 0.80)' }}>
        <div className="flex items-center gap-2.5">
          <CloudLogo size={34} />
          <span className="font-bold text-xl text-white tracking-wide">CloudOS</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            {isSignIn
              ? <>Welcome back.<br />Your work is waiting.</>
              : <>Join 12,000+ people<br />already working<br />from the cloud.</>
            }
          </h1>
          <div className="mt-8 max-w-md p-5 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Quote className="w-4 h-4 text-white/20" />
            <p className="mt-3 text-[15px] text-white/60 italic leading-relaxed">
              &quot;I run my entire freelance business from a cafe computer. CloudOS changed everything for me.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #0078D4, #6CCB5F)' }}>A</div>
              <div>
                <p className="text-[13px] font-medium text-white">Amara K., Graphic Designer</p>
                <p className="text-xs text-white/40">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to cloudos.app
        </Link>
      </div>

      {/* Right Half */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10" style={{ background: 'rgba(22, 27, 34, 0.90)' }}>
        <div className="w-full max-w-[380px]">
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <CloudLogo size={34} />
            <span className="font-bold text-xl text-white tracking-wide">CloudOS</span>
          </div>

          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-[#6CCB5F]/20">
                <CheckCircle2 className="w-10 h-10 text-[#6CCB5F]" />
              </div>
              <h2 className="mt-6 text-2xl font-extrabold text-white">You&apos;re in!</h2>
              <p className="mt-2 text-sm text-white/40">Setting up your CloudOS...</p>
              <div className="mt-6 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="h-full bg-[#0078D4] transition-all duration-75" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="text-2xl font-extrabold text-white">
                {isSignIn ? 'Sign in' : 'Create your account'}
              </h2>
              <p className="mt-2 text-sm text-white/40">
                {isSignIn ? 'Good to have you back.' : 'Free forever. No credit card.'}
              </p>

              {(error || urlError) && (
                <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded bg-[#FF5252]/10 border border-[#FF5252]/20">
                  <AlertCircle className="w-4 h-4 text-[#FF5252] flex-shrink-0" />
                  <span className="text-xs text-[#FF5252]">{error || urlError}</span>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {!isSignIn && (
                  <div>
                    <label className="block text-[13px] font-semibold text-white/60 mb-1">Full Name</label>
                    <input type="text" placeholder="John Doe" value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      className={inputClass('fullName')} />
                    {fieldErrors.fullName && touched.fullName && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-[#FF5252]">
                        <AlertCircle className="w-3 h-3" />{fieldErrors.fullName}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-semibold text-white/60 mb-1">Email Address</label>
                  <input type="email" placeholder="you@example.com" value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={inputClass('email')} />
                  {fieldErrors.email && touched.email && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#FF5252]">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-white/60 mb-1">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      className={inputClass('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && touched.password && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#FF5252]">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.password}
                    </div>
                  )}
                </div>

                {!isSignIn && (
                  <div>
                    <label className="block text-[13px] font-semibold text-white/60 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        className={inputClass('confirmPassword')} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && touched.confirmPassword && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-[#FF5252]">
                        <AlertCircle className="w-3 h-3" />{fieldErrors.confirmPassword}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" disabled={isLoading}
                className="mt-8 w-full h-10 rounded bg-[#0078D4] text-[15px] font-semibold text-white hover:bg-[#1084D8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{isSignIn ? 'Signing in...' : 'Creating account...'}</>
                ) : (
                  isSignIn ? 'Sign In' : 'Create Account'
                )}
              </button>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-[13px] text-white/30">or</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Google Sign-In */}
              <a
                href="/api/auth/google"
                className="mt-4 w-full h-10 rounded border border-white/15 text-sm text-white/80 hover:border-white/30 hover:bg-white/5 transition-colors flex items-center justify-center gap-2.5 select-none"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Continue with Google
              </a>

              <button type="button" onClick={handleGuestLogin} disabled={isLoading}
                className="mt-2 w-full h-10 rounded border border-white/10 text-sm text-white/60 hover:border-white/20 hover:text-white/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCircle className="w-4 h-4" />}
                Continue as Guest (1 hour session)
              </button>

              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-[#FCE100]">
                <AlertTriangle className="w-3 h-3" />
                Guest files deleted after 1 hour
              </div>

              <p className="mt-8 text-center text-sm text-white/40">
                {isSignIn ? 'New to CloudOS? ' : 'Already have an account? '}
                <button type="button" onClick={() => { setIsSignIn(!isSignIn); clearError(); setFieldErrors({}); setTouched({}) }}
                  className="text-[#0078D4] hover:underline">
                  {isSignIn ? 'Create account' : 'Sign in'}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f23]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0078D4]" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
