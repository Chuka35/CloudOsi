'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Wifi, 
  Bluetooth, 
  Plane, 
  Moon, 
  BatteryLow, 
  Accessibility,
  Focus,
  ShieldCheck,
  Volume2,
  Sun,
  X,
  Bell,
  BellOff,
} from 'lucide-react'
import { useWallpaperStore } from '@/lib/stores/wallpaperStore'

interface ActionCenterProps {
  onClose: () => void
}

interface QuickSetting {
  icon: React.ElementType
  label: string
  active: boolean
  realEffect?: (active: boolean) => void
}

export function ActionCenter({ onClose }: ActionCenterProps) {
  const centerRef = useRef<HTMLDivElement>(null)
  const [volume, setVolume] = useState(75)
  const [brightness, setBrightness] = useState(100)
  const { accentColor } = useWallpaperStore()

  // Real-world side effects
  const applyNightLight = (active: boolean) => {
    if (active) {
      document.documentElement.style.filter = 'sepia(0.4) hue-rotate(-30deg) brightness(0.88)'
    } else {
      document.documentElement.style.filter = ''
    }
  }

  const applyBatterySaver = (active: boolean) => {
    document.documentElement.style.transition = active ? 'filter 0.5s' : ''
    const current = document.documentElement.style.filter
    if (active) {
      document.documentElement.style.filter = current
        ? current + ' brightness(0.85)'
        : 'brightness(0.85)'
    } else {
      // Remove any brightness-only filter — night light takes precedence
      const nightLightActive = settings.find(s => s.label === 'Night light')?.active
      document.documentElement.style.filter = nightLightActive
        ? 'sepia(0.4) hue-rotate(-30deg) brightness(0.88)'
        : ''
    }
  }

  const [settings, setSettings] = useState<QuickSetting[]>([
    { icon: Wifi, label: 'Wi-Fi', active: true },
    { icon: Bluetooth, label: 'Bluetooth', active: false },
    { icon: Plane, label: 'Airplane', active: false },
    { icon: Moon, label: 'Night light', active: false, realEffect: applyNightLight },
    { icon: BatteryLow, label: 'Battery saver', active: false },
    { icon: Focus, label: 'Focus', active: false },
    { icon: ShieldCheck, label: 'VPN', active: false },
    { icon: Bell, label: 'Do not disturb', active: false },
  ])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (centerRef.current && !centerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Sync brightness slider to display filter
  useEffect(() => {
    const nightLightActive = settings.find(s => s.label === 'Night light')?.active
    if (nightLightActive) {
      document.documentElement.style.filter = `sepia(0.4) hue-rotate(-30deg) brightness(${brightness / 100})`
    } else {
      document.documentElement.style.filter = brightness < 100
        ? `brightness(${brightness / 100})`
        : ''
    }
  }, [brightness, settings])

  const toggleSetting = (index: number) => {
    setSettings(prev => {
      const next = prev.map((s, i) =>
        i === index ? { ...s, active: !s.active } : s
      )
      // Apply real effects
      if (next[index].label === 'Night light') {
        applyNightLight(next[index].active)
      }
      return next
    })
  }

  const accentStyle = { backgroundColor: accentColor }

  return (
    <div
      ref={centerRef}
      className="absolute bottom-14 right-2 w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      style={{
        background: 'rgba(10,10,30,0.92)',
        backdropFilter: 'blur(32px)',
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Quick Settings</span>
        <button onClick={onClose} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Setting Grid — 4 columns */}
      <div className="px-4 pb-3 grid grid-cols-4 gap-2">
        {settings.map((setting, i) => {
          const Icon = setting.icon
          return (
            <button
              key={setting.label}
              onClick={() => toggleSetting(i)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200 select-none"
              style={{
                background: setting.active
                  ? `${accentColor}33`
                  : 'rgba(255,255,255,0.07)',
                border: setting.active
                  ? `1px solid ${accentColor}66`
                  : '1px solid transparent',
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{ color: setting.active ? accentColor : 'rgba(255,255,255,0.7)' }}
              />
              <span className="text-[10px] text-center leading-tight"
                style={{ color: setting.active ? '#fff' : 'rgba(255,255,255,0.5)' }}
              >
                {setting.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="h-px bg-white/8 mx-4" />

      {/* Brightness Slider */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <Sun className="w-4 h-4 text-white/50 flex-shrink-0" />
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={e => setBrightness(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${accentColor} ${brightness}%, rgba(255,255,255,0.15) ${brightness}%)`,
            }}
          />
          <span className="text-xs text-white/40 w-8 text-right">{brightness}%</span>
        </div>
      </div>

      {/* Volume Slider */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-white/50 flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${accentColor} ${volume}%, rgba(255,255,255,0.15) ${volume}%)`,
            }}
          />
          <span className="text-xs text-white/40 w-8 text-right">{volume}%</span>
        </div>
      </div>
    </div>
  )
}
