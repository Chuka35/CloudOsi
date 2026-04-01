'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2, User, Plus, MessageSquare, ChevronLeft, ChevronRight, Zap, Trash2 } from 'lucide-react'
import { voiceAPI } from '@/lib/api-client'
import { useAuthStore } from '@/lib/stores/authStore'
import { useDesktop } from '@/lib/desktop-context'
import { apps, getApp } from '@/lib/apps'
import { CloudLogo } from '@/components/cloud-logo'

// ── Client-side local command parser (instant, zero network calls) ──────────
const LOCAL_PATTERNS: Array<{ test: (s: string) => boolean; respond: (s: string) => { response: string; action: { type: string; appId?: string; appName?: string } | null } }> = [
  {
    test: s => /^(?:hi|hello|hey|good (?:morning|afternoon|evening)|what'?s? ?up|howdy)\??$/.test(s),
    respond: () => {
      const h = new Date().getHours()
      const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
      return { response: `${g}! 👋 I'm CLOUDIA, your CloudOS AI assistant. How can I help you today?`, action: null }
    },
  },
  {
    test: s => /what(?:'s| is)(?: the)?(?: current)? time|what time is it/.test(s),
    respond: () => {
      const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      return { response: `It's currently **${t}**.`, action: null }
    },
  },
  {
    test: s => /what(?:'s| is)(?: today'?s?)? date|what day is it|today'?s? date/.test(s),
    respond: () => {
      const d = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      return { response: `Today is **${d}**.`, action: null }
    },
  },
  {
    test: s => /^(?:help|what can you do|what are your capabilities)\??$/.test(s),
    respond: () => ({ response: 'I can **open any app** (say "open Calculator"), **answer questions**, tell you the **time & date**, and more! 🎤 You can also talk to me using the microphone.', action: null }),
  },
  {
    test: s => /(?:what|which|list) ?apps?/.test(s),
    respond: () => ({ response: 'I can open: 📁 File Explorer, 🌐 Browser, 📝 Notepad, 🧮 Calculator, ⌨️ Terminal, ⚙️ Settings, 🎨 Paint, 📅 Calendar, 📧 Mail, 🌤️ Weather, 🎵 Music, 🎬 Video Player, 🕐 Clock, 🛒 Store, 🎮 Games, 📄 Word, 📊 Excel, 📊 PowerPoint, 👥 Teams, ☁️ OneDrive, 📫 Outlook, 🎧 Spotify, 💬 WhatsApp, 🗺️ Maps\n\nJust say "open [app name]"!', action: null }),
  },
  {
    test: s => /(?:which|what)\s+ai|what(?:'s| is) (?:your|the) (?:ai|model|technology|engine|llm)|what(?:'s| is) (?:powering|running|behind) you|are you (?:openai|gpt|chatgpt|claude|gemini)|what(?:'s| is) your (?:model|version)|which (?:model|company|provider)|how do you work/.test(s),
    respond: () => ({ response: "I'm powered by **Cloudflare Workers AI**, running Meta's **Llama 3.1** model on Cloudflare's global edge network. My voice uses **ElevenLabs** text-to-speech. I'm CLOUDIA — built exclusively for CloudOS! ☁️", action: null }),
  },
  {
    test: s => /who (?:created|built|made|is behind|founded|owns|invented|designed) (?:you|cloudos|cloud os)|who is your (?:creator|maker|author|developer|founder|owner|builder)|your creator|tell me (?:about )?(?:your|the) creator|who is victor|victor james|where (?:was|is) cloudos (?:built|made|from|created)|cloudos (?:creator|founder|owner)|made in nigeria|built by whom|who (?:made|built|created) (?:this|cloudos|you)|from (?:nigeria|naija)/.test(s),
    respond: () => ({ response: "CloudOS was created by **Victor James**, a developer from **Nigeria** 🇳🇬. His mission is simple and powerful: give every person on Earth access to a full computer for free, regardless of what device they own. I'm proud to be part of that mission! ☁️", action: null }),
  },
]

const APP_OPEN_ALIASES: Record<string, string> = {
  'file explorer': 'file-explorer', 'files': 'file-explorer', 'explorer': 'file-explorer', 'file manager': 'file-explorer',
  'browser': 'browser', 'chrome': 'browser', 'edge': 'browser', 'internet': 'browser', 'web browser': 'browser',
  'notepad': 'notepad', 'notes': 'notepad', 'text editor': 'notepad',
  'calculator': 'calculator', 'calc': 'calculator',
  'terminal': 'terminal', 'cmd': 'terminal', 'command prompt': 'terminal', 'console': 'terminal',
  'settings': 'settings', 'preferences': 'settings',
  'task manager': 'task-manager', 'processes': 'task-manager',
  'paint': 'paint', 'drawing': 'paint',
  'calendar': 'calendar', 'schedule': 'calendar',
  'mail': 'mail', 'email': 'mail', 'inbox': 'mail',
  'photos': 'photos', 'gallery': 'photos', 'images': 'photos',
  'weather': 'weather',
  'music': 'music', 'music player': 'music',
  'video player': 'video-player', 'video': 'video-player', 'movies': 'video-player',
  'clock': 'clock', 'timer': 'clock', 'alarm': 'clock',
  'store': 'store', 'app store': 'store', 'microsoft store': 'store',
  'games': 'games', 'gaming': 'games',
  'word': 'word', 'document': 'word',
  'excel': 'excel', 'spreadsheet': 'excel',
  'powerpoint': 'powerpoint', 'presentation': 'powerpoint', 'slides': 'powerpoint',
  'teams': 'teams',
  'onedrive': 'onedrive', 'one drive': 'onedrive',
  'outlook': 'outlook',
  'spotify': 'spotify',
  'whatsapp': 'whatsapp', 'messages': 'whatsapp', 'chat': 'whatsapp',
  'maps': 'maps', 'navigation': 'maps',
  'cloudia': 'cloudia', 'ai': 'cloudia',
}

function tryLocalCommand(text: string): { response: string; action: { type: string; appId?: string; appName?: string } | null } | null {
  const lower = text.toLowerCase().trim()

  // Check static patterns first
  for (const p of LOCAL_PATTERNS) {
    if (p.test(lower)) return p.respond(lower)
  }

  // Open app command
  const openMatch = lower.match(/^(?:open|launch|start|run|show|go to|switch to|bring up) +(.+?)(?:\s+(?:please|for me|now))?$/)
  if (openMatch) {
    const query = openMatch[1].trim().replace(/[?.!]+$/, '')
    for (const [alias, appId] of Object.entries(APP_OPEN_ALIASES)) {
      if (query === alias || query.includes(alias) || alias.includes(query)) {
        const appConfig = apps.find(a => a.id === appId)
        const appName = appConfig?.name || appId
        return { response: `Opening **${appName}** for you! 🚀`, action: { type: 'OPEN_APP', appId, appName } }
      }
    }
  }

  return null
}

// ── Fast browser-side AI call (bypasses server IP rate limit) ──────────────
async function callPollinationsFromBrowser(userMessage: string, conversationHistory: { role: string; content: string }[]): Promise<string> {
  const SYSTEM = 'You are CLOUDIA, the AI assistant built into CloudOS — a free, browser-based computer created by Victor James from Nigeria. Your mission is to help give every person on Earth access to a full computer. You are powered by Cloudflare Workers AI (Meta Llama 3.1) and your voice uses ElevenLabs. NEVER say you are OpenAI, GPT, ChatGPT, or any other provider. Be warm, natural, and concise (under 120 words). If asked who built CloudOS, say Victor James from Nigeria.'
  const messages = [
    { role: 'system', content: SYSTEM },
    ...conversationHistory.slice(-6),
    { role: 'user', content: userMessage },
  ]

  // Try POST endpoint with openai model
  const tryModels = ['openai', 'openai-large', 'mistral']
  for (const model of tryModels) {
    try {
      const res = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, max_tokens: 200, private: true }),
        signal: AbortSignal.timeout(12000),
      })
      if (res.ok) {
        const data = await res.json() as { choices?: { message?: { content?: string } }[] }
        const content = data?.choices?.[0]?.message?.content
        if (content?.trim()) return content.trim()
      }
    } catch { /* try next model */ }
  }

  // Fallback: GET endpoint (simpler, different infrastructure)
  const systemEncoded = encodeURIComponent(SYSTEM)
  const promptEncoded = encodeURIComponent(userMessage)
  const getRes = await fetch(
    `https://text.pollinations.ai/${promptEncoded}?model=openai&system=${systemEncoded}&private=true`,
    { signal: AbortSignal.timeout(12000) }
  )
  if (!getRes.ok) throw new Error(`HTTP ${getRes.status}`)
  const text = await getRes.text()
  if (!text?.trim()) throw new Error('Empty response')
  return text.trim()
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: { type: string; appId?: string; appName?: string } | null
}

interface ChatSession {
  id: string
  title: string
  messages: { role: 'user' | 'assistant'; content: string; timestamp: string }[]
  createdAt: number
  updatedAt: number
}

// Find an app by name with fuzzy matching
function findAppByName(name: string) {
  if (!name) return null
  const lower = name.toLowerCase().trim()

  // Exact ID match
  let found = apps.find(a => a.id === lower)
  if (found) return found

  // Exact name match
  found = apps.find(a => a.name.toLowerCase() === lower)
  if (found) return found

  // Partial name match
  found = apps.find(a => a.name.toLowerCase().includes(lower) || lower.includes(a.name.toLowerCase()))
  if (found) return found

  // Common aliases
  const aliases: Record<string, string> = {
    chrome: 'browser', edge: 'browser', internet: 'browser', web: 'browser', firefox: 'browser',
    files: 'file-explorer', 'file manager': 'file-explorer', folder: 'file-explorer',
    notes: 'notepad', 'text editor': 'notepad',
    calc: 'calculator', math: 'calculator',
    cmd: 'terminal', 'command prompt': 'terminal', console: 'terminal',
    preferences: 'settings', options: 'settings',
    'task manager': 'task-manager', processes: 'task-manager',
    drawing: 'paint', 'ms paint': 'paint',
    email: 'mail', emails: 'mail', inbox: 'mail',
    schedule: 'calendar', agenda: 'calendar',
    gallery: 'photos', images: 'photos', pictures: 'photos',
    songs: 'music', 'media player': 'music',
    movies: 'video-player', videos: 'video-player',
    clock: 'clock', timer: 'clock', alarm: 'clock',
    'app store': 'store', 'microsoft store': 'store', shop: 'store',
    gaming: 'games',
    document: 'word', docs: 'word',
    spreadsheet: 'excel',
    presentation: 'powerpoint', slides: 'powerpoint',
    'one drive': 'onedrive', 'cloud storage': 'onedrive',
    navigation: 'maps', directions: 'maps',
    ai: 'cloudia', assistant: 'cloudia',
    whatsapp: 'whatsapp', messages: 'whatsapp', chat: 'whatsapp',
  }

  const aliasId = aliases[lower]
  if (aliasId) return apps.find(a => a.id === aliasId) || null

  return null
}

const SESSIONS_KEY = 'cloudia_sessions'
const MAX_SESSIONS = 30

function getWelcomeMessage(name?: string): Message {
  return {
    role: 'assistant',
    content: `Hi${name ? ` ${name.split(' ')[0]}` : ''}! I'm CLOUDIA, your CloudOS AI assistant.\n\nI can help you:\n• **Open apps** — "open Calculator"\n• **Answer questions** — anything you're curious about\n• **Write & code** — drafts, code, ideas\n\nTap 🎤 to talk or type below.`,
    timestamp: new Date(),
  }
}

export function CloudiaApp() {
  const { user } = useAuthStore()
  const { openWindow } = useDesktop()

  // ── Session / history ──────────────────────────────────────────
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage(user?.displayName)])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(user?.autoSpeak ?? true)
  const [isListening, setIsListening] = useState(false)
  const [statusText, setStatusText] = useState<string>('Ready')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  // Always holds the latest selected voice — avoids stale closure in speak()
  const voiceRef = useRef<string>(user?.selectedVoice || 'aria')

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY)
      if (raw) {
        const parsed: ChatSession[] = JSON.parse(raw)
        setSessions(parsed.slice(0, MAX_SESSIONS))
        if (parsed.length > 0) {
          const latest = parsed[0]
          setActiveSessionId(latest.id)
          setMessages(latest.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })))
        }
      }
    } catch { /* ignore */ }
  }, [])

  // Keep voiceRef in sync with auth store changes (survives stale closures)
  useEffect(() => {
    voiceRef.current = user?.selectedVoice || 'aria'
  }, [user?.selectedVoice])

  // Keep autoSpeak in sync with auth store changes
  useEffect(() => {
    if (user?.autoSpeak !== undefined) setAutoSpeak(user.autoSpeak)
  }, [user?.autoSpeak])

  const persistSession = useCallback((id: string, title: string, msgs: Message[]) => {
    setSessions(prev => {
      const serialized: ChatSession = {
        id,
        title,
        messages: msgs.map(m => ({ role: m.role, content: m.content, timestamp: m.timestamp.toISOString() })),
        createdAt: prev.find(s => s.id === id)?.createdAt || Date.now(),
        updatedAt: Date.now(),
      }
      const filtered = prev.filter(s => s.id !== id)
      const next = [serialized, ...filtered].slice(0, MAX_SESSIONS)
      try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const startNewChat = useCallback(() => {
    const id = `session-${Date.now()}`
    const welcome = getWelcomeMessage(user?.displayName)
    setActiveSessionId(id)
    setMessages([welcome])
    setInput('')
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
  }, [user?.displayName])

  const loadSession = useCallback((session: ChatSession) => {
    setActiveSessionId(session.id)
    setMessages(session.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })))
    setInput('')
  }, [])

  const deleteSession = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id)
      try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
    if (id === activeSessionId) startNewChat()
  }, [activeSessionId, startNewChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speakWithBrowserTTS = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    // Clean markdown for TTS
    const clean = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\n/g, '. ').slice(0, 400)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.rate = 1.05
    utterance.pitch = 1.1
    utterance.volume = 1
    // Try to pick a good voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Microsoft Aria'))
    if (preferred) utterance.voice = preferred
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => { setIsSpeaking(false); setStatusText('Ready') }
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
    setStatusText('Speaking...')
  }, [])

  const handleOpenApp = useCallback((action: { type: string; appId?: string; appName?: string }) => {
    if (action.type !== 'OPEN_APP') return

    // Try to find the app
    const appConfig = action.appId ? (getApp(action.appId) || findAppByName(action.appName || '')) : findAppByName(action.appName || '')

    if (!appConfig) {
      console.warn('CLOUDIA: App not found for action:', action)
      return
    }

    const offset = Math.random() * 40
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
  }, [openWindow])

  const speak = useCallback((text: string) => {
    if (!autoSpeak) return
    const voice = voiceRef.current
    const clean = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\n/g, ' ').slice(0, 400)
    setIsSpeaking(true)
    setStatusText('Speaking...')
    voiceAPI.speakAndPlay(clean, voice)
      .catch(() => speakWithBrowserTTS(text))
      .finally(() => { setIsSpeaking(false); setStatusText('Ready') })
  }, [autoSpeak, speakWithBrowserTTS])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setStatusText('Thinking...')

    // ── 1. Try client-side local parser (INSTANT, zero network) ──
    const localResult = tryLocalCommand(text)
    if (localResult) {
      const msg: Message = {
        role: 'assistant',
        content: localResult.response,
        timestamp: new Date(),
        action: localResult.action,
      }
      setMessages(prev => [...prev, msg])
      if (localResult.action?.type === 'OPEN_APP') handleOpenApp(localResult.action)
      speak(localResult.response)
      setStatusText('Ready')
      return
    }

    // ── 2. Need real AI — show loading ──
    setIsLoading(true)

    const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }))

    let responseText = ''
    let action: { type: string; appId?: string; appName?: string } | null = null

    try {
      // ── 2a. Call server API first (uses Cloudflare Workers AI) ──
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('cloudos_token') : null
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: text }] }),
        signal: AbortSignal.timeout(15000),
      })
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) throw new Error('Non-JSON response')
      const data = await res.json() as { response?: string; action?: { type: string; appId?: string; appName?: string } | null }
      responseText = data.response || ''
      action = data.action || null
    } catch {
      // ── 2b. Fall back to Pollinations directly from browser ──
      try {
        responseText = await callPollinationsFromBrowser(text, history)
      } catch {
        responseText = "I'm having trouble connecting. Try asking me to open an app — just say \"open Calculator\"!"
      }
    }

    const assistantMessage: Message = {
      role: 'assistant',
      content: responseText || "I'm not sure how to help with that. Try asking me to open an app!",
      timestamp: new Date(),
      action,
    }
    setMessages(prev => {
      const next = [...prev, assistantMessage]
      // Derive session title from first user message
      const firstUser = next.find(m => m.role === 'user')
      const title = firstUser
        ? firstUser.content.slice(0, 40) + (firstUser.content.length > 40 ? '…' : '')
        : 'New conversation'
      const sid = activeSessionId || `session-${Date.now()}`
      if (!activeSessionId) setActiveSessionId(sid)
      persistSession(sid, title, next)
      return next
    })
    if (action?.type === 'OPEN_APP') handleOpenApp(action)
    if (responseText) speak(responseText)
    setStatusText('Ready')
    setIsLoading(false)
  }, [messages, isLoading, autoSpeak, handleOpenApp, speak, activeSessionId, persistSession])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const startListening = useCallback(async () => {
    // Stop any TTS first
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
    setIsSpeaking(false)

    // Check browser support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SpeechRecognitionClass = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SpeechRecognitionClass) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Your browser doesn't support voice input. Please type your message instead! 💬", timestamp: new Date() }])
      return
    }

    // Request microphone permission first to avoid "audio-capture" error
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Got permission — stop the stream, speech recognition will handle audio
      stream.getTracks().forEach(t => t.stop())
    } catch (err) {
      const e = err as DOMException
      let msg = "Microphone access is required for voice input."
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        msg = "Microphone permission was denied. To enable voice: click the 🔒 lock icon in your browser's address bar, then allow Microphone access. 🎤"
      } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        msg = "No microphone found. Please connect a microphone and try again. 🎤"
      } else if (e.name === 'NotReadableError' || e.name === 'TrackStartError') {
        msg = "Your microphone is being used by another application. Please close other apps using it and try again. 🎤"
      }
      setMessages(prev => [...prev, { role: 'assistant', content: msg, timestamp: new Date() }])
      return
    }

    setIsListening(true)
    setStatusText('Listening... speak now')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SpeechRecognitionClass()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcript = result[0].transcript
      setInput(transcript)
      if (result.isFinal) {
        setIsListening(false)
        setStatusText('Processing...')
        recognition.stop()
        sendMessage(transcript)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setStatusText('Ready')
      if (event.error === 'audio-capture') {
        setMessages(prev => [...prev, { role: 'assistant', content: "Could not capture audio. Make sure no other app is using the microphone, then try again. 🎤", timestamp: new Date() }])
      } else if (event.error === 'not-allowed') {
        setMessages(prev => [...prev, { role: 'assistant', content: "Microphone permission denied. Click the 🔒 icon in the address bar to allow it. 🎤", timestamp: new Date() }])
      } else if (event.error === 'network') {
        setMessages(prev => [...prev, { role: 'assistant', content: "Speech recognition needs an internet connection. Please check your connection and try again.", timestamp: new Date() }])
      } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setMessages(prev => [...prev, { role: 'assistant', content: `Voice error: ${event.error}. Please try typing instead. 💬`, timestamp: new Date() }])
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setStatusText('Ready')
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      setIsListening(false)
      setStatusText('Ready')
    }
  }, [sendMessage])

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
    setStatusText('Ready')
  }

  const clearMessages = () => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    startNewChat()
  }

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const quickPrompts = [
    { label: '🗒️ Open Notepad', text: 'Open Notepad' },
    { label: '🧮 Calculator', text: 'Open Calculator' },
    { label: '🌤️ Weather', text: 'Open Weather' },
    { label: '⏰ What time?', text: 'What time is it?' },
    { label: '📅 What day?', text: 'What day is it?' },
    { label: '📱 List apps', text: 'What apps can you open?' },
  ]

  const fmtSessionDate = (ts: number) => {
    const d = new Date(ts)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' })
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="h-full flex bg-[#060616] text-white overflow-hidden">

      {/* ── SIDEBAR ── */}
      <div
        className="flex-shrink-0 flex flex-col border-r border-white/6 overflow-hidden transition-all duration-200"
        style={{ width: sidebarOpen ? 196 : 0, background: '#04041a' }}
      >
        {/* Brand + New Chat */}
        <div className="p-3 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3 px-1">
            <CloudLogo size={18} />
            <span className="text-xs font-bold text-white/70 tracking-widest uppercase">Cloudia</span>
          </div>
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/8 transition-colors border border-white/8"
          >
            <Plus className="w-3.5 h-3.5 flex-shrink-0" />
            <span>New chat</span>
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
          {sessions.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-white/20">No previous chats</div>
          )}
          {sessions.map(session => (
            <div
              key={session.id}
              role="button"
              tabIndex={0}
              onClick={() => loadSession(session)}
              onKeyDown={(e) => e.key === 'Enter' && loadSession(session)}
              className={`w-full flex items-start gap-2 px-2.5 py-2 rounded-lg mb-0.5 text-left transition-colors group cursor-pointer ${
                session.id === activeSessionId
                  ? 'bg-white/8 text-white'
                  : 'text-white/40 hover:bg-white/4 hover:text-white/70'
              }`}
            >
              <MessageSquare className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-60" />
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate">{session.title}</div>
                <div className="text-[10px] text-white/25 mt-0.5">{fmtSessionDate(session.updatedAt)}</div>
              </div>
              <button
                onClick={(e) => deleteSession(session.id, e)}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-0.5 rounded transition-opacity"
                title="Delete"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>

        {/* User footer */}
        <div className="p-3 border-t border-white/6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1D4ED8] flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">
              {user?.displayName?.[0]?.toUpperCase() || <User className="w-3 h-3" />}
            </div>
            <span className="text-xs text-white/30 truncate">{user?.displayName || 'Guest'}</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CHAT PANEL ── */}
      <div className="flex-1 flex flex-col bg-[#08081a] min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/6 flex-shrink-0" style={{ background: '#0a0a20' }}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-colors"
              title={sidebarOpen ? 'Hide history' : 'Show history'}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <div className="text-xs text-white/35 flex items-center gap-1.5 ml-1">
              {isListening ? (
                <><div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />Listening…</>
              ) : isSpeaking ? (
                <><Volume2 className="w-3 h-3 text-blue-400" />Speaking…</>
              ) : isLoading ? (
                <><Loader2 className="w-3 h-3 animate-spin" />Thinking…</>
              ) : (
                <><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Ready</>
              )}
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-1.5 rounded-lg transition-colors ${autoSpeak ? 'text-blue-400 bg-blue-500/10' : 'text-white/25 hover:text-white/50'}`}
              title={autoSpeak ? 'Voice on — click to mute' : 'Voice off — click to unmute'}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={startNewChat}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-colors"
              title="New chat"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        {messages.map((message, i) => (
          <div key={i} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#0c1a3a]">
                <CloudLogo size={22} />
              </div>
            )}
            <div className={`max-w-[80%] flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'bg-white/6 border border-white/8 text-white/90 rounded-tl-sm'
                }`}
                style={message.role === 'user' ? { background: 'var(--accent)' } : {}}
              >
                {/* Render with bold markdown */}
                {message.content.split('\n').map((line, li) => (
                  <span key={li}>
                    {line.split(/(\*\*[^*]+\*\*)/).map((part, pi) =>
                      part.startsWith('**') && part.endsWith('**')
                        ? <strong key={pi}>{part.slice(2, -2)}</strong>
                        : <span key={pi}>{part}</span>
                    )}
                    {li < message.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              {/* Show action chip if app was opened */}
              {message.action?.type === 'OPEN_APP' && message.action.appName && (
                <div className="flex items-center gap-1 text-xs text-white/40 px-2">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>Opened {message.action.appName}</span>
                </div>
              )}
              <span className="text-[10px] text-white/20 px-1">{formatTime(message.timestamp)}</span>
            </div>
            {message.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-white/60" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#0c1a3a]">
              <CloudLogo size={22} />
            </div>
            <div className="bg-white/6 border border-white/8 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center">
                {[0, 150, 300].map(delay => (
                  <div key={delay} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
        {quickPrompts.map(prompt => (
          <button
            key={prompt.text}
            onClick={() => sendMessage(prompt.text)}
            disabled={isLoading}
            className="text-xs px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.65)' }}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3">
        {isListening && (
          <div className="mb-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs text-red-300 font-medium">Listening... speak now</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : 'Ask CLOUDIA anything, or say "open [app]"...'}
              rows={1}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none resize-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                minHeight: '44px',
                maxHeight: '100px',
              }}
            />
          </div>
          {/* Mic button */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={isListening ? {
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#f87171',
            } : {
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.5)',
            }}
            title={isListening ? 'Stop listening' : 'Click to talk'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          {/* Send button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
      </div>
    </div>
  )
}
