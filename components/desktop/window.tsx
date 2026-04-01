'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'
import { useDesktop } from '@/lib/desktop-context'
import { WindowState, SnapType } from '@/lib/types'
import { Minus, Maximize2, Minimize2, X } from 'lucide-react'
import { useWallpaperStore } from '@/lib/stores/wallpaperStore'

interface WindowProps {
  window: WindowState
  children: ReactNode
}

const snapLayouts: { type: SnapType; label: string }[] = [
  { type: 'full', label: 'Full screen' },
  { type: 'left', label: 'Left half' },
  { type: 'right', label: 'Right half' },
  { type: 'top-left', label: 'Top left' },
  { type: 'top-right', label: 'Top right' },
  { type: 'left-2/3', label: 'Left 2/3' },
]

export function Window({ window, children }: WindowProps) {
  const { 
    state, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    unmaximizeWindow, 
    focusWindow,
    updatePosition,
    updateSize,
    snapWindow,
  } = useDesktop()
  const { accentColor } = useWallpaperStore()
  
  const windowRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const isResizing = useRef(false)
  const resizeDir = useRef('')
  const dragOffset = useRef({ x: 0, y: 0 })
  const startMouse = useRef({ x: 0, y: 0 })
  const startDims = useRef({ x: 0, y: 0, w: 0, h: 0 })
  
  const [showMaxSnapLayout, setShowMaxSnapLayout] = useState(false)
  const [hoveredSnap, setHoveredSnap] = useState<SnapType | null>(null)
  const snapLayoutTimeout = useRef<NodeJS.Timeout | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  
  const isActive = state.activeWindowId === window.id
  const isResizable = window.isResizable !== false
  
  // Handle drag
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-window-control]')) return
    if (window.isMaximized) return
    
    e.preventDefault()
    isDragging.current = true
    dragOffset.current = {
      x: e.clientX - window.x,
      y: e.clientY - window.y,
    }
    focusWindow(window.id)
  }
  
  // Handle resize zones mousedown
  const handleResizeMouseDown = (e: React.MouseEvent, dir: string) => {
    if (!isResizable) return
    e.preventDefault()
    e.stopPropagation()
    isResizing.current = true
    resizeDir.current = dir
    startMouse.current = { x: e.clientX, y: e.clientY }
    startDims.current = { x: window.x, y: window.y, w: window.width, h: window.height }
    focusWindow(window.id)
  }
  
  // Global mouse move/up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        let newX = e.clientX - dragOffset.current.x
        let newY = e.clientY - dragOffset.current.y
        
        const vw = globalThis.innerWidth
        const vh = globalThis.innerHeight
        newX = Math.max(-window.width + 100, Math.min(newX, vw - 100))
        newY = Math.max(0, Math.min(newY, vh - 48 - 32))
        
        updatePosition(window.id, newX, newY)
      }
      
      if (isResizing.current) {
        const dx = e.clientX - startMouse.current.x
        const dy = e.clientY - startMouse.current.y
        const dir = resizeDir.current
        const minW = window.minWidth || 300
        const minH = window.minHeight || 200
        
        let newX = startDims.current.x
        let newY = startDims.current.y
        let newW = startDims.current.w
        let newH = startDims.current.h
        
        if (dir.includes('e')) newW = Math.max(minW, startDims.current.w + dx)
        if (dir.includes('w')) {
          newW = Math.max(minW, startDims.current.w - dx)
          if (newW > minW) newX = startDims.current.x + dx
        }
        if (dir.includes('s')) newH = Math.max(minH, startDims.current.h + dy)
        if (dir.includes('n')) {
          newH = Math.max(minH, startDims.current.h - dy)
          if (newH > minH) newY = startDims.current.y + dy
        }
        
        updateSize(window.id, newW, newH, newX, newY)
      }
    }
    
    const handleMouseUp = () => {
      isDragging.current = false
      isResizing.current = false
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [window.id, window.width, window.height, window.minWidth, window.minHeight, updatePosition, updateSize])
  
  // Touch events for mobile
  useEffect(() => {
    const el = windowRef.current
    if (!el) return
    
    const titleBar = el.querySelector('[data-title-bar]')
    if (!titleBar) return
    
    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest('[data-window-control]')) return
      if (window.isMaximized) return
      
      const touch = e.touches[0]
      isDragging.current = true
      dragOffset.current = {
        x: touch.clientX - window.x,
        y: touch.clientY - window.y,
      }
      focusWindow(window.id)
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      e.preventDefault()
      
      const touch = e.touches[0]
      let newX = touch.clientX - dragOffset.current.x
      let newY = touch.clientY - dragOffset.current.y
      
      const vw = globalThis.innerWidth
      const vh = globalThis.innerHeight
      newX = Math.max(-window.width + 100, Math.min(newX, vw - 100))
      newY = Math.max(0, Math.min(newY, vh - 48 - 32))
      
      updatePosition(window.id, newX, newY)
    }
    
    const handleTouchEnd = () => {
      isDragging.current = false
    }
    
    titleBar.addEventListener('touchstart', handleTouchStart as EventListener)
    document.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      titleBar.removeEventListener('touchstart', handleTouchStart as EventListener)
      document.removeEventListener('touchmove', handleTouchMove as EventListener)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [window.id, window.x, window.y, window.width, window.isMaximized, focusWindow, updatePosition])
  
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      closeWindow(window.id)
    }, 150)
  }
  
  const handleMaximizeHover = () => {
    if (snapLayoutTimeout.current) clearTimeout(snapLayoutTimeout.current)
    snapLayoutTimeout.current = setTimeout(() => setShowMaxSnapLayout(true), 400)
  }
  
  const handleMaximizeLeave = () => {
    if (snapLayoutTimeout.current) clearTimeout(snapLayoutTimeout.current)
    snapLayoutTimeout.current = setTimeout(() => {
      setShowMaxSnapLayout(false)
      setHoveredSnap(null)
    }, 200)
  }

  const handleSnapPopupEnter = () => {
    if (snapLayoutTimeout.current) clearTimeout(snapLayoutTimeout.current)
  }

  const handleSnapPopupLeave = () => {
    if (snapLayoutTimeout.current) clearTimeout(snapLayoutTimeout.current)
    snapLayoutTimeout.current = setTimeout(() => {
      setShowMaxSnapLayout(false)
      setHoveredSnap(null)
    }, 150)
  }
  
  if (window.isMinimized) return null
  
  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col overflow-hidden transition-[border,box-shadow] duration-150 ${
        isClosing ? 'animate-window-close' : 'animate-window-open'
      }`}
      style={{
        left: window.x,
        top: window.y,
        width: window.width,
        height: window.height,
        zIndex: window.zIndex,
        borderRadius: window.isMaximized ? 0 : 8,
        border: `1px solid ${isActive ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.10)'}`,
        boxShadow: isActive 
          ? '0 16px 48px rgba(0,0,0,0.70)' 
          : '0 8px 24px rgba(0,0,0,0.40)',
      }}
      onClick={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        data-title-bar
        className="h-8 flex items-center px-3 cursor-grab active:cursor-grabbing flex-shrink-0 select-none"
        style={{ background: 'rgba(40, 40, 40, 0.98)' }}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="flex items-center gap-2">
          <window.icon className="w-4 h-4" style={{ color: window.iconColor }} />
          <span className="text-[13px] text-white/80">{window.appName}</span>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex">
          {/* Minimize */}
          <button
            data-window-control
            className="w-[46px] h-8 flex items-center justify-center hover:bg-white/8 transition-colors"
            onClick={() => minimizeWindow(window.id)}
          >
            <Minus className="w-3 h-3 text-white" />
          </button>
          
          {/* Maximize with Snap Layouts */}
          <div 
            className="relative"
            onMouseEnter={handleMaximizeHover}
            onMouseLeave={handleMaximizeLeave}
          >
            <button
              data-window-control
              className="w-[46px] h-8 flex items-center justify-center hover:bg-white/8 transition-colors"
              onClick={() => window.isMaximized ? unmaximizeWindow(window.id) : maximizeWindow(window.id)}
            >
              {window.isMaximized ? (
                <Minimize2 className="w-3 h-3 text-white" />
              ) : (
                <Maximize2 className="w-3 h-3 text-white" />
              )}
            </button>
            
            {/* Snap Layouts Popup */}
            {showMaxSnapLayout && !window.isMaximized && (
              <div 
                className="absolute top-full right-0 mt-1 z-50 rounded-lg overflow-hidden"
                style={{
                  background: 'rgba(32, 32, 32, 0.97)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                  padding: '10px',
                  minWidth: '220px',
                }}
                onMouseEnter={handleSnapPopupEnter}
                onMouseLeave={handleSnapPopupLeave}
              >
                <div className="text-[11px] text-white/40 mb-2 px-1 select-none">Snap layout</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {snapLayouts.map((snap) => (
                    <button
                      key={snap.type}
                      className="group flex flex-col items-center gap-1.5 p-1.5 rounded-md transition-colors hover:bg-white/6"
                      onMouseEnter={() => setHoveredSnap(snap.type)}
                      onMouseLeave={() => setHoveredSnap(null)}
                      onClick={(e) => {
                        e.stopPropagation()
                        snapWindow(window.id, snap.type)
                        setShowMaxSnapLayout(false)
                        setHoveredSnap(null)
                      }}
                      title={snap.label}
                    >
                      <div
                        className="w-[56px] h-[38px] rounded flex items-center justify-center transition-all"
                        style={{
                          background: hoveredSnap === snap.type
                            ? `${accentColor}22`
                            : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${hoveredSnap === snap.type ? `${accentColor}80` : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        <SnapLayoutPreview type={snap.type} active={hoveredSnap === snap.type} accent={accentColor} />
                      </div>
                      <span className="text-[9px] text-white/40 text-center leading-tight group-hover:text-white/60 transition-colors">
                        {snap.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Close */}
          <button
            data-window-control
            className="w-[46px] h-8 flex items-center justify-center hover:bg-[#E81123] transition-colors"
            onClick={handleClose}
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
      
      {/* Window Body */}
      <div className="flex-1 overflow-hidden" style={{ background: 'rgba(28, 28, 28, 0.97)' }}>
        {children}
      </div>
      
      {/* Resize Handles */}
      {isResizable && !window.isMaximized && (
        <>
          <div className="absolute top-0 left-0 right-0 h-2 cursor-n-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
          <div className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          <div className="absolute top-0 bottom-0 left-0 w-2 cursor-w-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
          <div className="absolute top-0 bottom-0 right-0 w-2 cursor-e-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
        </>
      )}
    </div>
  )
}

function SnapLayoutPreview({ type, active, accent }: { type: SnapType; active: boolean; accent: string }) {
  const activeBox = active ? accent : `${accent}99`
  const inactiveBox = active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'
  
  switch (type) {
    case 'full':
      return <div className="w-9 h-6 rounded-sm" style={{ background: activeBox }} />
    case 'left':
      return (
        <div className="flex gap-0.5">
          <div className="w-[18px] h-6 rounded-sm" style={{ background: activeBox }} />
          <div className="w-[18px] h-6 rounded-sm" style={{ background: inactiveBox }} />
        </div>
      )
    case 'right':
      return (
        <div className="flex gap-0.5">
          <div className="w-[18px] h-6 rounded-sm" style={{ background: inactiveBox }} />
          <div className="w-[18px] h-6 rounded-sm" style={{ background: activeBox }} />
        </div>
      )
    case 'top-left':
      return (
        <div className="flex gap-0.5">
          <div className="flex flex-col gap-0.5">
            <div className="w-[18px] h-[11px] rounded-sm" style={{ background: activeBox }} />
            <div className="w-[18px] h-[11px] rounded-sm" style={{ background: inactiveBox }} />
          </div>
          <div className="w-[18px] h-6 rounded-sm" style={{ background: inactiveBox }} />
        </div>
      )
    case 'top-right':
      return (
        <div className="flex gap-0.5">
          <div className="w-[18px] h-6 rounded-sm" style={{ background: inactiveBox }} />
          <div className="flex flex-col gap-0.5">
            <div className="w-[18px] h-[11px] rounded-sm" style={{ background: activeBox }} />
            <div className="w-[18px] h-[11px] rounded-sm" style={{ background: inactiveBox }} />
          </div>
        </div>
      )
    case 'left-2/3':
      return (
        <div className="flex gap-0.5">
          <div className="w-[26px] h-6 rounded-sm" style={{ background: activeBox }} />
          <div className="w-[10px] h-6 rounded-sm" style={{ background: inactiveBox }} />
        </div>
      )
    default:
      return null
  }
}
