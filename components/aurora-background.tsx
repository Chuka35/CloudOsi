'use client'

import { useState, useEffect } from 'react'
import { useWallpaperStore } from '@/lib/stores/wallpaperStore'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkle: boolean
  delay: number
  duration: number
}

export function AuroraBackground() {
  const [mounted, setMounted] = useState(false)
  const [stars, setStars] = useState<Star[]>([])
  const { getWallpaperConfig } = useWallpaperStore()

  useEffect(() => {
    setMounted(true)
    const generated = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.5 ? 1 : 2,
      opacity: 0.2 + Math.random() * 0.4,
      twinkle: i < 10,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 2,
    }))
    setStars(generated)
  }, [])

  // Use a safe default config for SSR to prevent hydration mismatch
  const config = mounted ? getWallpaperConfig() : {
    gradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
    aurora1: 'radial-gradient(circle, rgba(0,120,212,0.3) 0%, transparent 70%)',
    aurora2: 'radial-gradient(circle, rgba(88,101,242,0.2) 0%, transparent 70%)',
    stars: false,
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: config.gradient }}
      />
      {mounted && (
        <>
          <div
            className="absolute animate-aurora-1 transition-all duration-1000"
            style={{
              width: '600px', height: '600px', borderRadius: '50%',
              background: config.aurora1, filter: 'blur(120px)',
              top: '-100px', left: '-100px',
            }}
          />
          <div
            className="absolute animate-aurora-2 transition-all duration-1000"
            style={{
              width: '400px', height: '400px', borderRadius: '50%',
              background: config.aurora2, filter: 'blur(100px)',
              bottom: '100px', right: '100px',
            }}
          />
          {config.stars && stars.map((star) => (
            <div
              key={star.id}
              className={star.twinkle ? 'animate-star-twinkle' : ''}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: '50%',
                backgroundColor: 'white',
                opacity: star.opacity,
                animationDelay: star.twinkle ? `${star.delay}s` : undefined,
                animationDuration: star.twinkle ? `${star.duration}s` : undefined,
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
