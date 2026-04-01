'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDesktop } from '@/lib/desktop-context'
import { 
  Search, 
  Wifi, 
  Volume2, 
  Battery, 
  BellDot,
  ChevronUp,
  X,
  Minus,
  Maximize2,
} from 'lucide-react'
import { StartMenu } from './start-menu'
import { ActionCenter } from './action-center'
import { SearchPanel } from './search-panel'
import { DateTimePanel } from './date-time-panel'
import { AppIcon } from '@/components/app-icon'
import { CloudLogo } from '@/components/cloud-logo'
import { useWallpaperStore } from '@/lib/stores/wallpaperStore'
import { apps as allApps } from '@/lib/apps'

export function Taskbar() {
  const { accentColor } = useWallpaperStore()
  const { state, minimizeWindow, restoreWindow, focusWindow, minimizeAll, closeWindow, openWindow } = useDesktop()
  const [time, setTime] = useState(new Date())
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showActionCenter, setShowActionCenter] = useState(false)
  const [showDateTimePanel, setShowDateTimePanel] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; windowId: string; appId: string } | null>(null)
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null)
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null)
  const [appOrder, setAppOrder] = useState<string[]>([])
  const contextMenuRef = useRef<HTMLDivElement>(null)
  
  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }
    if (contextMenu) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [contextMenu])
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
  }
  
  const handleTaskbarIconClick = (windowId: string) => {
    const win = state.windows.find(w => w.id === windowId)
    if (!win) return
    if (win.isMinimized) {
      restoreWindow(windowId)
    } else if (state.activeWindowId === windowId) {
      minimizeWindow(windowId)
    } else {
      focusWindow(windowId)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, windowId: string, appId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ x: e.clientX, y: e.clientY, windowId, appId })
  }

  const handleCloseApp = useCallback((windowId: string, appId: string) => {
    const allWindows = state.windows.filter(w => w.appId === appId)
    allWindows.forEach(w => closeWindow(w.id))
    setContextMenu(null)
    void windowId
  }, [state.windows, closeWindow])

  const handleMinimizeApp = useCallback((appId: string) => {
    const allWindows = state.windows.filter(w => w.appId === appId)
    allWindows.forEach(w => minimizeWindow(w.id))
    setContextMenu(null)
  }, [state.windows, minimizeWindow])

  const handleMaximizeApp = useCallback((windowId: string) => {
    focusWindow(windowId)
    setContextMenu(null)
  }, [focusWindow])

  // Pinned apps — always show in taskbar regardless of whether they're open
  const pinnedApps = allApps.filter(a => a.pinnedToTaskbar)

  // Open windows grouped by appId (for apps NOT in pinned list)
  const runningUnpinnedApps = state.windows.filter(w =>
    !pinnedApps.find(p => p.id === w.appId) &&
    !state.windows.find(other => other.id !== w.id && other.appId === w.appId && state.windows.indexOf(other) < state.windows.indexOf(w))
  )

  // Merge: pinned first, then running unpinned
  const taskbarItems: Array<{
    kind: 'pinned' | 'running'
    appId: string
    appName: string
    windowId?: string
  }> = [
    ...pinnedApps.map(app => ({
      kind: 'pinned' as const,
      appId: app.id,
      appName: app.name,
      windowId: state.windows.find(w => w.appId === app.id)?.id,
    })),
    ...runningUnpinnedApps.map(win => ({
      kind: 'running' as const,
      appId: win.appId,
      appName: win.appName,
      windowId: win.id,
    })),
  ]

  // Apply custom order
  const orderedItems = appOrder.length > 0
    ? [
        ...appOrder
          .map(appId => taskbarItems.find(t => t.appId === appId))
          .filter(Boolean) as typeof taskbarItems,
        ...taskbarItems.filter(t => !appOrder.includes(t.appId))
      ]
    : taskbarItems

  const handleTaskbarItemClick = (item: typeof taskbarItems[0]) => {
    if (item.windowId) {
      handleTaskbarIconClick(item.windowId)
    } else {
      // Pinned but not open → open it
      const appConfig = allApps.find(a => a.id === item.appId)
      if (!appConfig) return
      const offset = Math.random() * 30
      openWindow({
        appId: appConfig.id,
        appName: appConfig.name,
        icon: appConfig.icon,
        iconColor: appConfig.color,
        isMinimized: false,
        isMaximized: false,
        x: 100 + offset,
        y: 60 + offset,
        width: appConfig.defaultWidth,
        height: appConfig.defaultHeight,
        savedX: 100 + offset,
        savedY: 60 + offset,
        savedWidth: appConfig.defaultWidth,
        savedHeight: appConfig.defaultHeight,
        minWidth: appConfig.minWidth,
        minHeight: appConfig.minHeight,
        isResizable: appConfig.isResizable !== false,
      })
    }
  }

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedAppId(appId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, targetAppId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!draggedAppId || draggedAppId === targetAppId) return
  }

  const handleDrop = (e: React.DragEvent, targetAppId: string) => {
    e.preventDefault()
    if (!draggedAppId || draggedAppId === targetAppId) return
    const currentOrder = appOrder.length > 0 
      ? appOrder 
      : orderedItems.map(t => t.appId)
    const draggedIdx = currentOrder.indexOf(draggedAppId)
    const targetIdx = currentOrder.indexOf(targetAppId)
    const newOrder = [...currentOrder]
    if (draggedIdx === -1 || targetIdx === -1) return
    newOrder.splice(draggedIdx, 1)
    newOrder.splice(targetIdx, 0, draggedAppId)
    setAppOrder(newOrder)
    setDraggedAppId(null)
  }

  const handleDragEnd = () => {
    setDraggedAppId(null)
  }

  const toggleActionCenter = () => {
    setShowActionCenter(p => !p)
    setShowStartMenu(false)
    setShowDateTimePanel(false)
  }

  const toggleDateTimePanel = () => {
    setShowDateTimePanel(p => !p)
    setShowStartMenu(false)
    setShowActionCenter(false)
  }
  
  return (
    <>
      <div 
        data-taskbar
        className="fixed bottom-0 left-0 right-0 h-12 flex items-center px-3 gap-1 z-[10000]"
        style={{
          background: 'rgba(32, 32, 32, 0.85)',
          backdropFilter: 'blur(30px) saturate(180%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Left — Search */}
        <div 
          className="w-[220px] h-8 flex items-center gap-2 px-3 rounded cursor-pointer hover:bg-white/10 transition-colors select-none"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
          onClick={() => { setShowSearch(true); setShowStartMenu(false); setShowActionCenter(false); setShowDateTimePanel(false) }}
        >
          <Search className="w-[14px] h-[14px] text-white/50 flex-shrink-0" />
          <span className="text-[13px] text-white/40 truncate">Search apps...</span>
        </div>
        
        {/* Center — Start + Pinned + Running */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[2px]">
          {/* Start Button */}
          <button
            className={`w-10 h-10 flex items-center justify-center rounded hover:bg-white/8 transition-colors ${showStartMenu ? 'bg-white/12' : ''}`}
            onClick={() => {
              setShowStartMenu(!showStartMenu)
              setShowActionCenter(false)
              setShowDateTimePanel(false)
            }}
            title="Start"
          >
            <svg width="18" height="18" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="40" height="40" rx="3" fill="#4CC2FF"/>
              <rect x="48" y="0" width="40" height="40" rx="3" fill="#4CC2FF"/>
              <rect x="0" y="48" width="40" height="40" rx="3" fill="#4CC2FF"/>
              <rect x="48" y="48" width="40" height="40" rx="3" fill="#4CC2FF"/>
            </svg>
          </button>
          
          {/* Taskbar Items (pinned + running) */}
          {orderedItems.map((item) => {
            const openWin = item.windowId ? state.windows.find(w => w.id === item.windowId) : null
            const isRunning = !!item.windowId
            const isActive = item.windowId
              ? (state.activeWindowId === item.windowId ||
                state.windows.some(w => w.appId === item.appId && state.activeWindowId === w.id))
              : false
            const allMinimized = isRunning
              ? state.windows.filter(w => w.appId === item.appId).every(w => w.isMinimized)
              : true
            const isDraggingThis = draggedAppId === item.appId
            const isOpen = isRunning && !allMinimized
            
            return (
              <button
                key={item.appId}
                className="w-11 h-11 flex flex-col items-center justify-center rounded hover:bg-white/8 transition-all relative select-none"
                style={{ opacity: isDraggingThis ? 0.4 : 1, cursor: 'grab' }}
                onClick={() => handleTaskbarItemClick(item)}
                onContextMenu={openWin ? (e) => handleContextMenu(e, openWin.id, item.appId) : undefined}
                onMouseEnter={() => setHoveredAppId(item.appId)}
                onMouseLeave={() => setHoveredAppId(null)}
                draggable
                onDragStart={(e) => handleDragStart(e, item.appId)}
                onDragOver={(e) => handleDragOver(e, item.appId)}
                onDrop={(e) => handleDrop(e, item.appId)}
                onDragEnd={handleDragEnd}
              >
                {/* Windows 11-style tooltip */}
                {hoveredAppId === item.appId && (
                  <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded pointer-events-none z-50 whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-100"
                    style={{
                      background: 'rgba(28, 28, 28, 0.96)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.90)',
                      fontFamily: '"Segoe UI", system-ui, sans-serif',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {item.appName}
                  </div>
                )}

                <AppIcon appId={item.appId} size={28} />
                
                {/* Indicator bar: bright when active, dim when running/minimized, invisible when closed */}
                <div 
                  className="absolute bottom-1 h-[3px] rounded-full transition-all duration-150"
                  style={{
                    width: isRunning ? (isActive && isOpen ? 16 : 4) : 0,
                    background: isActive && isOpen ? accentColor : 'rgba(255, 255, 255, 0.60)',
                  }}
                />
              </button>
            )
          })}
        </div>
        
        {/* Right Section */}
        <div className="ml-auto flex items-center gap-[2px]">
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/8 transition-colors">
            <ChevronUp className="w-[14px] h-[14px] text-white/70" />
          </button>
          
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-white/8 transition-colors ${showActionCenter ? 'bg-white/12' : ''}`}
            onClick={toggleActionCenter}
          >
            <Wifi className="w-[18px] h-[18px] text-white/70 hover:text-white" />
          </button>
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-white/8 transition-colors ${showActionCenter ? 'bg-white/12' : ''}`}
            onClick={toggleActionCenter}
          >
            <Volume2 className="w-[18px] h-[18px] text-white/70 hover:text-white" />
          </button>
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-white/8 transition-colors ${showActionCenter ? 'bg-white/12' : ''}`}
            onClick={toggleActionCenter}
          >
            <Battery className="w-[18px] h-[18px] text-white/70 hover:text-white" />
          </button>
          
          {/* Clock — opens calendar/date-time panel */}
          <button 
            className={`px-2 h-full flex flex-col items-end justify-center text-right cursor-pointer hover:bg-white/8 transition-colors rounded ${showDateTimePanel ? 'bg-white/12' : ''}`}
            onClick={toggleDateTimePanel}
            title="Clock & Calendar"
          >
            <span className="text-xs font-semibold text-white">{formatTime(time)}</span>
            <span className="text-xs text-white/60">{formatDate(time)}</span>
          </button>
          
          <button 
            className={`w-8 h-8 flex items-center justify-center rounded hover:bg-white/8 transition-colors ${showActionCenter ? 'bg-white/12' : ''}`}
            onClick={toggleActionCenter}
          >
            <BellDot className="w-[18px] h-[18px] text-white/70 hover:text-white" />
          </button>
          
          <button 
            className="w-1 h-12 hover:bg-white/15 transition-colors"
            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
            onClick={minimizeAll}
          />
        </div>
      </div>
      
      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-[10002] rounded-lg overflow-hidden py-1"
          style={{
            left: Math.min(contextMenu.x, window.innerWidth - 180),
            top: Math.max(contextMenu.y - 140, 8),
            background: 'rgba(32, 32, 32, 0.98)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.70)',
            minWidth: '172px',
          }}
        >
          <div className="px-3 py-2 border-b border-white/6 mb-1">
            <div className="text-[12px] text-white/60 truncate">
              {state.windows.find(w => w.id === contextMenu.windowId)?.appName}
            </div>
          </div>
          <button
            className="w-full h-9 px-3 flex items-center gap-3 text-[13px] text-white/80 hover:bg-white/8 transition-colors"
            onClick={() => { handleMaximizeApp(contextMenu.windowId); restoreWindow(contextMenu.windowId) }}
          >
            <Maximize2 className="w-4 h-4 text-white/50" />
            Restore / Focus
          </button>
          <button
            className="w-full h-9 px-3 flex items-center gap-3 text-[13px] text-white/80 hover:bg-white/8 transition-colors"
            onClick={() => handleMinimizeApp(contextMenu.appId)}
          >
            <Minus className="w-4 h-4 text-white/50" />
            Minimize
          </button>
          <div className="my-1 border-t border-white/6" />
          <button
            className="w-full h-9 px-3 flex items-center gap-3 text-[13px] text-[#FF5252] hover:bg-[#FF5252]/10 transition-colors"
            onClick={() => handleCloseApp(contextMenu.windowId, contextMenu.appId)}
          >
            <X className="w-4 h-4" />
            Close window
          </button>
        </div>
      )}
      
      {/* Start Menu */}
      {showStartMenu && (
        <StartMenu onClose={() => setShowStartMenu(false)} />
      )}
      
      {/* Action Center */}
      {showActionCenter && (
        <ActionCenter onClose={() => setShowActionCenter(false)} />
      )}

      {/* Date/Time Panel */}
      {showDateTimePanel && (
        <DateTimePanel onClose={() => setShowDateTimePanel(false)} />
      )}

      {/* Search Panel */}
      {showSearch && (
        <SearchPanel onClose={() => setShowSearch(false)} />
      )}
    </>
  )
}
