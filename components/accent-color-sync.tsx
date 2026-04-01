"use client"

import { useEffect } from "react"
import { useWallpaperStore } from "@/lib/stores/wallpaperStore"

export function AccentColorSync() {
  const { accentColor } = useWallpaperStore()

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accentColor)

    // Also set derived values
    const hex = accentColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    document.documentElement.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`)
  }, [accentColor])

  return null
}
