'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { apps, AppConfig } from '@/lib/apps'
import { AppIcon } from '@/components/app-icon'
import { useDesktop } from '@/lib/desktop-context'

interface SearchPanelProps {
  onClose: () => void
}

export function SearchPanel({ onClose }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AppConfig[]>([])
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { openWindow } = useDesktop()

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults(apps.filter(a => a.pinnedToStart).slice(0, 8))
      setHighlighted(0)
      return
    }
    const q = query.toLowerCase()
    const matches = apps.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
    )
    setResults(matches.slice(0, 8))
    setHighlighted(0)
  }, [query])

  const openApp = useCallback((app: AppConfig) => {
    const offset = Math.random() * 40
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
  }, [openWindow, onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
    if (e.key === 'Enter' && results[highlighted]) { openApp(results[highlighted]) }
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const panel = document.getElementById('search-panel')
      if (panel && !panel.contains(e.target as Node)) onClose()
    }
    setTimeout(() => document.addEventListener('mousedown', handler), 100)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
    >
      <div
        id="search-panel"
        className="absolute bottom-14 left-3 w-[400px] rounded-xl overflow-hidden"
        style={{
          background: 'rgba(28, 28, 36, 0.97)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
          <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps..."
            className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-white/30"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/40 hover:text-white/70">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="py-2 max-h-[400px] overflow-y-auto">
          {!query && (
            <div className="px-4 py-1.5 text-[11px] text-white/30 uppercase tracking-wider font-medium">
              Pinned apps
            </div>
          )}
          {query && results.length === 0 && (
            <div className="px-4 py-6 text-center text-white/30 text-sm">
              No apps found for "{query}"
            </div>
          )}
          {results.map((app, i) => (
            <button
              key={app.id}
              onClick={() => openApp(app)}
              onMouseEnter={() => setHighlighted(i)}
              className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
              style={{
                background: highlighted === i ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              <AppIcon appId={app.id} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/90 font-medium truncate">{app.name}</div>
                <div className="text-xs text-white/35 truncate">App</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
