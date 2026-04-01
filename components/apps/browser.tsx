"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { 
  ChevronLeft, ChevronRight, RotateCw, Home, Star, Plus, X, Search,
  Lock, MoreHorizontal, Download, Bookmark, History, Settings,
  AlertCircle, ExternalLink, Globe,
} from "lucide-react"

interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isLoading?: boolean
  error?: string
  proxyFailed?: boolean
}

// Real site favicons using Google/DuckDuckGo favicon service
function getFaviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url)
    return `https://icons.duckduckgo.com/ip3/${hostname}.ico`
  } catch {
    return ''
  }
}

// Well-known site colors for bookmark cards
const BOOKMARKS = [
  { name: "Google",         url: "https://google.com",               color: "#4285F4", letter: "G" },
  { name: "YouTube",        url: "https://youtube.com",              color: "#FF0000", letter: "Y" },
  { name: "GitHub",         url: "https://github.com",               color: "#24292E", letter: "G" },
  { name: "Wikipedia",      url: "https://en.wikipedia.org",         color: "#000000", letter: "W" },
  { name: "Reddit",         url: "https://reddit.com",               color: "#FF4500", letter: "R" },
  { name: "Twitter/X",      url: "https://x.com",                    color: "#1A1A1A", letter: "X" },
  { name: "Netflix",        url: "https://netflix.com",              color: "#E50914", letter: "N" },
  { name: "LinkedIn",       url: "https://linkedin.com",             color: "#0A66C2", letter: "in" },
  { name: "Instagram",      url: "https://instagram.com",            color: "#E1306C", letter: "I" },
  { name: "Amazon",         url: "https://amazon.com",               color: "#FF9900", letter: "A" },
  { name: "Stack Overflow", url: "https://stackoverflow.com",        color: "#F58025", letter: "S" },
  { name: "MDN Docs",       url: "https://developer.mozilla.org",    color: "#0060DF", letter: "M" },
]

function buildProxyUrl(url: string): string {
  if (typeof window === 'undefined') return url
  const token = localStorage.getItem('cloudos_token') || ''
  return `/api/proxy?url=${encodeURIComponent(url)}&token=${encodeURIComponent(token)}`
}

export function BrowserApp() {
  const [tabs, setTabs] = useState<Tab[]>([{ id: "1", title: "New Tab", url: "" }])
  const [activeTabId, setActiveTabId] = useState("1")
  const [urlInput, setUrlInput] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [navHistory, setNavHistory] = useState<Record<string, string[]>>({ "1": [] })
  const [navIndex, setNavIndex] = useState<Record<string, number>>({ "1": -1 })

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0]
  const currentHistory = navHistory[activeTabId] || []
  const currentIndex = navIndex[activeTabId] ?? -1
  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < currentHistory.length - 1

  const addTab = () => {
    const id = Date.now().toString()
    setTabs(prev => [...prev, { id, title: "New Tab", url: "" }])
    setActiveTabId(id)
    setUrlInput("")
    setNavHistory(prev => ({ ...prev, [id]: [] }))
    setNavIndex(prev => ({ ...prev, [id]: -1 }))
  }

  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      const newId = Date.now().toString()
      setTabs([{ id: newId, title: "New Tab", url: "" }])
      setActiveTabId(newId)
      setUrlInput("")
      return
    }
    const idx = tabs.findIndex(t => t.id === id)
    const newTabs = tabs.filter(t => t.id !== id)
    setTabs(newTabs)
    if (activeTabId === id) {
      const next = newTabs[Math.max(0, idx - 1)]
      setActiveTabId(next.id)
      setUrlInput(next.url)
    }
  }

  // Convert any URL or search query to a loadable URL.
  // Uses Brave Search as default — modern, independent index, real results.
  const resolveUrl = useCallback((raw: string): string => {
    const s = raw.trim()
    if (!s) return ''

    if (s.startsWith('http://') || s.startsWith('https://')) {
      try {
        const url = new URL(s)
        // Normalize Google → Brave Search (Google blocks server-side proxy)
        if (url.hostname.includes('google.com') && url.pathname.includes('/search')) {
          const q = url.searchParams.get('q')
          if (q) return `https://search.brave.com/search?q=${encodeURIComponent(q)}&source=web`
        }
        // Normalize Bing → Brave Search
        if (url.hostname.includes('bing.com')) {
          const q = url.searchParams.get('q')
          if (q) return `https://search.brave.com/search?q=${encodeURIComponent(q)}&source=web`
        }
        // Normalize DuckDuckGo → Brave Search
        if (url.hostname.includes('duckduckgo.com')) {
          const q = url.searchParams.get('q')
          if (q) return `https://search.brave.com/search?q=${encodeURIComponent(q)}&source=web`
        }
      } catch { /* keep original */ }
      return s
    }

    // Has dot and no spaces → domain
    if (s.includes('.') && !s.includes(' ')) return `https://${s}`

    // Anything else → Brave Search (modern, independent index, real results)
    return `https://search.brave.com/search?q=${encodeURIComponent(s)}&source=web`
  }, [])

  const navigate = useCallback((rawUrl: string, addToHistory = true) => {
    if (!rawUrl.trim()) return
    let finalUrl = resolveUrl(rawUrl)
    const hostname = (() => { try { return new URL(finalUrl).hostname } catch { return finalUrl } })()
    const favicon = getFaviconUrl(finalUrl)

    setTabs(prev => prev.map(t =>
      t.id === activeTabId
        ? { ...t, url: finalUrl, title: hostname, favicon, isLoading: true, error: undefined, proxyFailed: false }
        : t
    ))
    setUrlInput(finalUrl)

    if (addToHistory) {
      setNavHistory(prev => {
        const hist = (prev[activeTabId] || []).slice(0, (navIndex[activeTabId] ?? -1) + 1)
        return { ...prev, [activeTabId]: [...hist, finalUrl] }
      })
      setNavIndex(prev => ({ ...prev, [activeTabId]: (prev[activeTabId] ?? -1) + 1 }))
    }
  }, [activeTabId, navIndex, resolveUrl])

  // Listen for navigation messages from proxied page
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'PROXY_NAVIGATE' && event.data?.url) {
        navigate(event.data.url)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [navigate])

  const goBack = () => {
    if (!canGoBack) return
    const idx = currentIndex - 1
    const url = currentHistory[idx]
    setNavIndex(prev => ({ ...prev, [activeTabId]: idx }))
    setUrlInput(url)
    const favicon = getFaviconUrl(url)
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, url, title: new URL(url).hostname, favicon, isLoading: true, error: undefined } : t
    ))
  }

  const goForward = () => {
    if (!canGoForward) return
    const idx = currentIndex + 1
    const url = currentHistory[idx]
    setNavIndex(prev => ({ ...prev, [activeTabId]: idx }))
    setUrlInput(url)
    const favicon = getFaviconUrl(url)
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, url, title: new URL(url).hostname, favicon, isLoading: true, error: undefined } : t
    ))
  }

  const handleIframeLoad = () => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isLoading: false } : t))
  }

  const handleIframeError = () => {
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, isLoading: false, error: 'failed' } : t
    ))
  }

  const reload = () => {
    if (activeTab.url) navigate(activeTab.url, false)
  }

  const openExternal = () => {
    if (activeTab.url) window.open(activeTab.url, '_blank', 'noopener,noreferrer')
  }

  const goHome = () => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: '', title: 'New Tab', error: undefined } : t))
    setUrlInput('')
  }

  const proxyUrl = activeTab.url ? buildProxyUrl(activeTab.url) : null

  return (
    <div className="h-full flex flex-col bg-[#202124] text-white select-none">
      {/* Tab Bar */}
      <div className="h-9 bg-[#35363a] flex items-end px-1 gap-0.5 flex-shrink-0 overflow-x-auto">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => { setActiveTabId(tab.id); setUrlInput(tab.url) }}
            className={`group h-8 flex-shrink-0 w-[180px] flex items-center gap-2 px-3 rounded-t-lg cursor-pointer transition-colors ${
              activeTabId === tab.id ? "bg-[#202124]" : "bg-[#2d2e32] hover:bg-[#3c3d41]"
            }`}
          >
            {/* Real favicon or loading spinner or globe */}
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
              {tab.isLoading ? (
                <div className="w-3 h-3 border border-white/30 border-t-white/80 rounded-full animate-spin" />
              ) : tab.favicon ? (
                <img
                  src={tab.favicon}
                  alt=""
                  className="w-4 h-4 rounded-sm object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <Globe size={12} className="text-white/50" />
              )}
            </div>
            <span className="flex-1 text-xs truncate text-white/80">{tab.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/15 rounded"
            >
              <X size={11} />
            </button>
          </div>
        ))}
        <button onClick={addTab} className="h-8 w-8 flex items-center justify-center hover:bg-white/10 rounded-lg flex-shrink-0 text-white/60">
          <Plus size={15} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="h-10 bg-[#202124] flex items-center gap-1 px-2 flex-shrink-0 border-b border-white/5">
        <button onClick={goBack} disabled={!canGoBack}
          className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-default transition-colors">
          <ChevronLeft size={17} />
        </button>
        <button onClick={goForward} disabled={!canGoForward}
          className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-default transition-colors">
          <ChevronRight size={17} />
        </button>
        <button onClick={reload}
          className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
          <RotateCw size={15} className={activeTab.isLoading ? "animate-spin" : ""} />
        </button>
        <button onClick={goHome}
          className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
          <Home size={15} />
        </button>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-2 bg-[#35363a] hover:bg-[#3c3d41] rounded-full px-4 py-1 mx-2 transition-colors">
          {activeTab.url ? (
            <Lock size={13} className="text-[#6CCB5F] flex-shrink-0" />
          ) : (
            <Search size={13} className="text-white/35 flex-shrink-0" />
          )}
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(urlInput)}
            onFocus={(e) => e.target.select()}
            placeholder="Search or enter URL"
            className="flex-1 bg-transparent outline-none text-sm text-white/90 placeholder:text-white/30 select-text"
          />
          {activeTab.url && (
            <button onClick={() => { setUrlInput(''); goHome() }} className="p-0.5 hover:bg-white/10 rounded flex-shrink-0">
              <X size={11} className="text-white/40" />
            </button>
          )}
        </div>

        {activeTab.url && (
          <button onClick={openExternal} title="Open in real browser tab"
            className="p-1.5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
            <ExternalLink size={15} />
          </button>
        )}
        <button className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
          <Star size={15} />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
          <Download size={15} />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
          <MoreHorizontal size={15} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[#1a1a1a] overflow-hidden relative">
        {activeTab.url ? (
          <>
            {/* Progress bar */}
            {activeTab.isLoading && (
              <div className="absolute top-0 left-0 right-0 h-0.5 z-10 overflow-hidden bg-white/5">
                <div className="h-full bg-[var(--accent)] animate-[progress_2s_ease-in-out_infinite]"
                  style={{ width: '40%', animationName: 'progress' }} />
              </div>
            )}

            {activeTab.error ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center bg-[#202124]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white/20" />
                </div>
                <div>
                  <div className="text-white/70 font-medium mb-1">This page couldn&apos;t load</div>
                  <div className="text-white/35 text-sm max-w-sm">
                    The site may be blocking preview, or the connection failed.
                  </div>
                </div>
                <div className="text-xs text-white/25 font-mono bg-white/5 px-3 py-1.5 rounded max-w-xs truncate">
                  {activeTab.url}
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  <button onClick={openExternal}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[var(--accent)] text-white hover:opacity-90 transition-opacity font-medium">
                    <ExternalLink size={14} />
                    Open in Real Browser
                  </button>
                  <button onClick={reload}
                    className="px-4 py-2 rounded-lg text-sm bg-white/10 text-white/70 hover:bg-white/15 transition-colors">
                    Try Again
                  </button>
                  <button onClick={goHome}
                    className="px-4 py-2 rounded-lg text-sm bg-white/10 text-white/70 hover:bg-white/15 transition-colors">
                    New Tab
                  </button>
                </div>
              </div>
            ) : proxyUrl ? (
              <iframe
                ref={iframeRef}
                key={proxyUrl}
                src={proxyUrl}
                className="w-full h-full border-0"
                title="Browser"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-scripts allow-forms allow-downloads allow-modals"
              />
            ) : null}
          </>
        ) : (
          /* New Tab Page */
          <div className="h-full flex flex-col items-center pt-12 pb-8 px-8 bg-[#202124] overflow-auto">
            <div className="text-5xl font-light mb-8 tracking-tight bg-gradient-to-r from-[#4285f4] via-[#ea4335] via-[#fbbc05] to-[#34a853] bg-clip-text text-transparent">
              CloudBrowser
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-lg flex items-center gap-3 bg-[#303134] rounded-full px-5 py-3 shadow-lg mb-10 hover:shadow-xl transition-shadow border border-white/5">
              <Search size={18} className="text-white/40 flex-shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && navigate(urlInput)}
                placeholder="Search or enter URL"
                className="flex-1 bg-transparent outline-none text-white/90 placeholder:text-white/30 select-text"
                autoFocus
              />
            </div>

            {/* Bookmarks Grid with real favicons */}
            <div className="grid grid-cols-6 gap-4 w-full max-w-2xl">
              {BOOKMARKS.map(bm => (
                <button
                  key={bm.name}
                  onClick={() => navigate(bm.url)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/6 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ background: `${bm.color}22` }}>
                    <img
                      src={getFaviconUrl(bm.url)}
                      alt={bm.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.style.display = 'none'
                        const parent = img.parentElement
                        if (parent) {
                          parent.style.background = bm.color
                          parent.innerHTML = `<span style="color:white;font-size:16px;font-weight:700">${bm.letter}</span>`
                        }
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors truncate w-full text-center">
                    {bm.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-10 flex gap-6 text-xs text-white/30">
              <button className="flex items-center gap-1.5 hover:text-white/50 transition-colors">
                <History size={13} />History
              </button>
              <button className="flex items-center gap-1.5 hover:text-white/50 transition-colors">
                <Bookmark size={13} />Bookmarks
              </button>
              <button className="flex items-center gap-1.5 hover:text-white/50 transition-colors">
                <Settings size={13} />Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
