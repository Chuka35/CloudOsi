"use client"

import { useDesktop } from "@/lib/desktop-context"
import { apps, AppConfig } from "@/lib/apps"
import { AppIcon } from "@/components/app-icon"

export function DesktopIcons() {
  const { openWindow } = useDesktop()

  const desktopApps = apps.filter(app => app.showOnDesktop)

  const handleAppOpen = (app: AppConfig) => {
    const offset = Math.random() * 60
    openWindow({
      appId: app.id,
      appName: app.name,
      icon: app.icon,
      iconColor: app.color,
      isMinimized: false,
      isMaximized: false,
      x: 120 + offset,
      y: 60 + offset,
      width: app.defaultWidth,
      height: app.defaultHeight,
      savedX: 120 + offset,
      savedY: 60 + offset,
      savedWidth: app.defaultWidth,
      savedHeight: app.defaultHeight,
      minWidth: app.minWidth,
      minHeight: app.minHeight,
      isResizable: app.isResizable,
    })
  }

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-1">
      {desktopApps.map(app => (
        <button
          key={app.id}
          onDoubleClick={() => handleAppOpen(app)}
          className="group flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 w-[76px] transition-colors"
        >
          <AppIcon appId={app.id} size={46} />
          <span className="text-[11px] text-white text-center leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:bg-[var(--accent)]/60 group-hover:px-1 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[72px]">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  )
}
