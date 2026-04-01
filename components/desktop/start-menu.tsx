'use client'

import { useState, useEffect, useRef } from 'react'
import { useDesktop } from '@/lib/desktop-context'
import { apps as appsList, type AppConfig } from '@/lib/apps'
import { useWallpaperStore } from '@/lib/stores/wallpaperStore'
import { useAuthStore } from '@/lib/stores/authStore'
import { AppIcon } from '@/components/app-icon'
import { 
  Search, 
  Power, 
  FileText,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  LogOut,
  Lock,
  Moon,
  RotateCw,
} from 'lucide-react'

interface StartMenuProps {
  onClose: () => void
}

export function StartMenu({ onClose }: StartMenuProps) {
  const { openWindow } = useDesktop()
  const { user, signout } = useAuthStore()
  const menuRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPowerMenu, setShowPowerMenu] = useState(false)
  const [showAllApps, setShowAllApps] = useState(false)
  const { accentColor } = useWallpaperStore()
  
  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const taskbar = document.querySelector('[data-taskbar]')
        if (taskbar?.contains(e.target as Node)) return
        onClose()
      }
    }
    
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])
  
  const handleAppClick = (app: AppConfig) => {
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
    onClose()
  }
  
  const filteredApps = appsList.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const allAppsSorted = [...appsList].sort((a, b) => a.name.localeCompare(b.name))
  
  const pinnedApps = filteredApps.slice(0, 18)
  
  const recommendedItems = [
    { name: 'Welcome to CloudOS.txt', time: 'Just now' },
    { name: 'Getting Started.pdf', time: 'Yesterday' },
    { name: 'README.md', time: '2 days ago' },
    { name: 'project-notes.txt', time: '3 days ago' },
  ]

  const groupedApps = allAppsSorted.reduce<Record<string, AppConfig[]>>((acc, app) => {
    const letter = app.name[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(app)
    return acc
  }, {})
  
  return (
    <div
      ref={menuRef}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[660px] rounded-xl z-[9998] animate-slide-up overflow-hidden"
      style={{
        background: 'rgba(32, 32, 32, 0.95)',
        backdropFilter: 'blur(30px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: '0 16px 64px rgba(0, 0, 0, 0.70)',
        maxHeight: '75vh',
      }}
    >
      {/* All Apps View */}
      {showAllApps ? (
        <div className="flex flex-col" style={{ maxHeight: '75vh' }}>
          <div className="flex items-center gap-3 px-6 pt-5 pb-4 flex-shrink-0">
            <button
              onClick={() => setShowAllApps(false)}
              className="flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white/90 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-sm font-semibold text-white ml-1">All apps</span>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}>
            {Object.entries(groupedApps).map(([letter, apps]) => (
              <div key={letter} className="mb-4">
                <div 
                  className="text-[11px] font-bold text-white/30 mb-2 px-1 uppercase tracking-widest"
                >
                  {letter}
                </div>
                <div className="space-y-0.5">
                  {apps.map((app) => (
                    <button
                      key={app.id}
                      className="w-full h-10 rounded-lg px-3 flex items-center gap-3 hover:bg-white/8 transition-colors"
                      onClick={() => handleAppClick(app)}
                    >
                      <AppIcon appId={app.id} size={28} />
                      <span className="text-[13px] text-white/80 text-left">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col" style={{ maxHeight: '75vh' }}>
          {/* Search Bar */}
          <div 
            className="w-full h-10 flex items-center gap-3 px-4 rounded flex-shrink-0"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <Search className="w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Type here to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              autoFocus
            />
          </div>
          
          <div className="flex-1 overflow-y-auto mt-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}>
            {/* Pinned Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">Pinned</span>
                <button 
                  className="flex items-center gap-1 text-[13px] hover:underline"
                  style={{ color: accentColor }}
                  onClick={() => setShowAllApps(true)}
                >
                  <LayoutGrid className="w-3 h-3" />
                  All apps
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="grid grid-cols-6 gap-1">
                {(searchQuery ? filteredApps : pinnedApps).map((app) => (
                  <button
                    key={app.id}
                    className="h-[76px] rounded-lg p-2 flex flex-col items-center hover:bg-white/8 transition-colors"
                    onClick={() => handleAppClick(app)}
                  >
                    <AppIcon appId={app.id} size={40} />
                    <span className="mt-1.5 text-[11px] text-white/70 text-center truncate w-full">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Recommended Section */}
            {!searchQuery && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">Recommended</span>
                  <button className="flex items-center gap-1 text-[13px] hover:underline" style={{ color: accentColor }}>
                    More
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  {recommendedItems.map((item, i) => (
                    <button
                      key={i}
                      className="h-12 rounded-lg px-3 flex items-center gap-3 hover:bg-white/8 transition-colors"
                    >
                      <FileText className="w-5 h-5" style={{ color: accentColor }} />
                      <div className="text-left">
                        <div className="text-[13px] text-white truncate">{item.name}</div>
                        <div className="text-[11px] text-white/40">{item.time}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom Row */}
          <div 
            className="mt-4 pt-4 flex items-center justify-between flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <button
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/8 transition-colors flex-1 min-w-0 text-left"
              onClick={() => { onClose(); /* open accounts */ }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
              >
                {(user?.displayName || user?.email || 'G')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-white truncate">{user?.displayName || 'CloudUser'}</div>
                <div className="text-[10px] text-white/40 truncate">{user?.email || 'Guest'}</div>
              </div>
            </button>
            
            <div className="relative ml-2">
              <button 
                className="w-9 h-9 rounded flex items-center justify-center hover:bg-white/8 transition-colors"
                onClick={() => setShowPowerMenu(!showPowerMenu)}
                title="Power options"
              >
                <Power className="w-4 h-4 text-white/80" />
              </button>
              
              {showPowerMenu && (
                <div 
                  className="absolute bottom-full right-0 mb-2 w-52 rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(28, 28, 36, 0.98)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.70)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="px-3 py-2 border-b border-white/6">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider font-medium">CloudOS</div>
                  </div>
                  {[
                    { icon: Lock, label: 'Lock', action: () => { window.location.reload() } },
                    { icon: LogOut, label: 'Sign out', action: () => { signout(); window.location.href = '/' } },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      className="w-full h-10 px-3 flex items-center gap-3 text-[13px] text-white/80 hover:bg-white/8 transition-colors"
                      onClick={action}
                    >
                      <Icon className="w-4 h-4 text-white/50" />
                      {label}
                    </button>
                  ))}
                  <div className="border-t border-white/6 my-1" />
                  {[
                    { icon: Moon, label: 'Sleep', action: () => {} },
                    { icon: RotateCw, label: 'Restart', action: () => { window.location.reload() } },
                    { icon: Power, label: 'Shut down', action: () => { window.location.href = '/' } },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      className="w-full h-10 px-3 flex items-center gap-3 text-[13px] text-white/80 hover:bg-white/8 transition-colors"
                      onClick={action}
                    >
                      <Icon className="w-4 h-4 text-white/50" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
