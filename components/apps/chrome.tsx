"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, RotateCw, Home, Star, X, Plus, Search, Shield, Globe, Mic, User, MoreVertical } from "lucide-react"

interface Tab {
  id: number
  title: string
  url: string
  favicon?: string
}

const quickLinks = [
  { name: "Google", color: "#4285F4" },
  { name: "YouTube", color: "#FF0000" },
  { name: "GitHub", color: "#333333" },
  { name: "Wikipedia", color: "#000000" },
  { name: "Twitter", color: "#1DA1F2" },
  { name: "Reddit", color: "#FF4500" },
  { name: "Cloudflare", color: "#F38020" },
  { name: "ElevenLabs", color: "#000000" },
]

export function ChromeApp() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: "New Tab", url: "" }
  ])
  const [activeTab, setActiveTab] = useState(1)
  const [inputUrl, setInputUrl] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [loadError, setLoadError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const currentTab = tabs.find(t => t.id === activeTab)
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const addTab = () => {
    const newTab: Tab = { id: Date.now(), title: "New Tab", url: "" }
    setTabs([...tabs, newTab])
    setActiveTab(newTab.id)
    setInputUrl("")
    setLoadError(false)
  }

  const closeTab = (id: number) => {
    if (tabs.length === 1) return
    const newTabs = tabs.filter(t => t.id !== id)
    setTabs(newTabs)
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id)
    }
  }

  const navigate = (url: string) => {
    let finalUrl = url.trim()
    
    // If it doesn't start with http, check if it's a search or URL
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      if (finalUrl.includes(".") && !finalUrl.includes(" ")) {
        finalUrl = "https://" + finalUrl
      } else {
        // Search Google
        window.open(`https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`, "_blank")
        return
      }
    }

    setLoadError(false)
    const newTabs = tabs.map(t => 
      t.id === activeTab ? { ...t, url: finalUrl, title: new URL(finalUrl).hostname } : t
    )
    setTabs(newTabs)
    setInputUrl(finalUrl)
    
    // Update history
    const newHistory = [...history.slice(0, historyIndex + 1), finalUrl]
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      const url = history[historyIndex - 1]
      const newTabs = tabs.map(t => 
        t.id === activeTab ? { ...t, url, title: url ? new URL(url).hostname : "New Tab" } : t
      )
      setTabs(newTabs)
      setInputUrl(url)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      const url = history[historyIndex + 1]
      const newTabs = tabs.map(t => 
        t.id === activeTab ? { ...t, url, title: url ? new URL(url).hostname : "New Tab" } : t
      )
      setTabs(newTabs)
      setInputUrl(url)
    }
  }

  const refresh = () => {
    if (iframeRef.current && currentTab?.url) {
      iframeRef.current.src = currentTab.url
    }
  }

  const goHome = () => {
    const newTabs = tabs.map(t => 
      t.id === activeTab ? { ...t, url: "", title: "New Tab" } : t
    )
    setTabs(newTabs)
    setInputUrl("")
    setLoadError(false)
  }

  return (
    <div className="h-full flex flex-col bg-[#202124] text-white overflow-hidden">
      {/* Tab Bar */}
      <div className="h-9 flex items-end bg-[#202124] px-2">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setInputUrl(tab.url)
            }}
            className={`h-[30px] max-w-[200px] flex items-center gap-2 px-3 rounded-t-lg cursor-pointer ${
              tab.id === activeTab ? "bg-[#35363a]" : "hover:bg-[#35363a]/50"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
            <span className="text-xs truncate flex-1">{tab.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
              className="p-0.5 hover:bg-white/10 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button onClick={addTab} className="h-[30px] w-7 flex items-center justify-center hover:bg-white/10 rounded">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Browser Chrome */}
      <div className="h-11 flex items-center gap-1 px-2 bg-[#35363a]">
        {/* Navigation */}
        <button
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={refresh} className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded">
          <RotateCw className="w-4 h-4" />
        </button>
        <button onClick={goHome} className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded">
          <Home className="w-4 h-4" />
        </button>

        {/* Address Bar */}
        <div className="flex-1 h-8 flex items-center gap-2 bg-[#202124] rounded-full px-4 mx-2">
          {currentTab?.url && <Shield className="w-3 h-3 text-[#6CCB5F]" />}
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(inputUrl)}
            onFocus={(e) => e.target.select()}
            placeholder="Search Google or type a URL"
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button className="hover:bg-white/10 p-1 rounded">
            <Star className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Actions */}
        <div className="w-7 h-7 rounded-full bg-[#4285F4] flex items-center justify-center text-xs font-medium">
          U
        </div>
        <button className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#202124] overflow-hidden">
        {!currentTab?.url ? (
          /* New Tab Page */
          <div className="h-full flex flex-col items-center pt-24" style={{
            background: "linear-gradient(180deg, #1a1a2e 0%, #202124 100%)"
          }}>
            <h1 className="text-3xl font-light text-white/70 mb-8">{getGreeting()}</h1>
            
            {/* Search Bar */}
            <div className="w-[520px] h-12 flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-6">
              <Search className="w-5 h-5 text-white/60" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && navigate(inputUrl)}
                placeholder="Search Google"
                className="flex-1 bg-transparent outline-none text-white"
              />
              <Mic className="w-5 h-5 text-white/60" />
            </div>

            {/* Quick Links */}
            <div className="mt-12 grid grid-cols-4 gap-6">
              {quickLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => navigate(`https://${link.name.toLowerCase()}.com`)}
                  className="w-20 h-24 flex flex-col items-center gap-2 hover:bg-white/5 rounded-lg p-2"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: link.color }}
                  >
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white/70">{link.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : loadError ? (
          /* Error Page */
          <div className="h-full flex flex-col items-center justify-center">
            <Shield className="w-16 h-16 text-white/30 mb-4" />
            <h2 className="text-xl font-medium mb-2">cloudos.app can&apos;t open this page</h2>
            <p className="text-white/60 text-center max-w-md mb-6">
              This site doesn&apos;t allow embedding in other windows.
            </p>
            <a
              href={currentTab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4285F4] hover:underline"
            >
              Open in new tab &rarr;
            </a>
          </div>
        ) : (
          /* Iframe */
          <iframe
            ref={iframeRef}
            src={currentTab.url}
            className="w-full h-full border-0"
            onError={() => setLoadError(true)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  )
}
