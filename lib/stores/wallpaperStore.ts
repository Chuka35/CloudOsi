'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WallpaperKey = 'aurora' | 'deep-space' | 'sunset' | 'forest' | 'ocean' | 'minimal' | 'cosmic' | 'dawn'

export interface WallpaperConfig {
  key: WallpaperKey
  label: string
  gradient: string
  aurora1: string
  aurora2: string
  stars: boolean
}

export const WALLPAPERS: WallpaperConfig[] = [
  {
    key: 'aurora',
    label: 'Aurora',
    gradient: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    aurora1: 'rgba(0, 120, 212, 0.08)',
    aurora2: 'rgba(96, 205, 255, 0.05)',
    stars: true,
  },
  {
    key: 'deep-space',
    label: 'Deep Space',
    gradient: 'linear-gradient(135deg, #000000 0%, #0a0a1a 50%, #050515 100%)',
    aurora1: 'rgba(60, 0, 180, 0.10)',
    aurora2: 'rgba(0, 60, 180, 0.07)',
    stars: true,
  },
  {
    key: 'cosmic',
    label: 'Cosmic',
    gradient: 'linear-gradient(135deg, #0d001a 0%, #1a0030 50%, #0a0020 100%)',
    aurora1: 'rgba(180, 0, 220, 0.12)',
    aurora2: 'rgba(80, 0, 180, 0.08)',
    stars: true,
  },
  {
    key: 'ocean',
    label: 'Ocean',
    gradient: 'linear-gradient(135deg, #001a1a 0%, #002a3a 50%, #001530 100%)',
    aurora1: 'rgba(0, 180, 220, 0.12)',
    aurora2: 'rgba(0, 120, 180, 0.08)',
    stars: false,
  },
  {
    key: 'forest',
    label: 'Forest',
    gradient: 'linear-gradient(135deg, #001a0a 0%, #002a15 50%, #001a10 100%)',
    aurora1: 'rgba(0, 200, 100, 0.10)',
    aurora2: 'rgba(0, 160, 80, 0.07)',
    stars: false,
  },
  {
    key: 'sunset',
    label: 'Sunset',
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #2a1500 50%, #3a0010 100%)',
    aurora1: 'rgba(220, 80, 0, 0.12)',
    aurora2: 'rgba(180, 0, 60, 0.08)',
    stars: false,
  },
  {
    key: 'dawn',
    label: 'Dawn',
    gradient: 'linear-gradient(135deg, #0a0015 0%, #1a0a2a 50%, #0f051a 100%)',
    aurora1: 'rgba(220, 100, 200, 0.10)',
    aurora2: 'rgba(100, 60, 220, 0.08)',
    stars: true,
  },
  {
    key: 'minimal',
    label: 'Minimal',
    gradient: 'linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0f0f0f 100%)',
    aurora1: 'rgba(255, 255, 255, 0.02)',
    aurora2: 'rgba(255, 255, 255, 0.01)',
    stars: false,
  },
]

export const ACCENT_COLORS = [
  { key: 'blue', value: '#0078D4', label: 'Windows Blue' },
  { key: 'green', value: '#6CCB5F', label: 'Sage Green' },
  { key: 'purple', value: '#C239B3', label: 'Iris Purple' },
  { key: 'orange', value: '#FF8C00', label: 'Gold Orange' },
  { key: 'red', value: '#E74856', label: 'Cherry Red' },
  { key: 'teal', value: '#00B7C3', label: 'Teal' },
  { key: 'pink', value: '#E3008C', label: 'Hot Pink' },
  { key: 'yellow', value: '#F7630C', label: 'Pumpkin' },
]

interface WallpaperStore {
  wallpaper: WallpaperKey
  accentColor: string
  setWallpaper: (key: WallpaperKey) => void
  setAccentColor: (color: string) => void
  getWallpaperConfig: () => WallpaperConfig
}

export const useWallpaperStore = create<WallpaperStore>()(
  persist(
    (set, get) => ({
      wallpaper: 'aurora',
      accentColor: '#0078D4',
      setWallpaper: (key) => set({ wallpaper: key }),
      setAccentColor: (color) => set({ accentColor: color }),
      getWallpaperConfig: () => WALLPAPERS.find(w => w.key === get().wallpaper) || WALLPAPERS[0],
    }),
    { name: 'cloudos-wallpaper' }
  )
)
