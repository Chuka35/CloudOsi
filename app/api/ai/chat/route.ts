import { NextRequest } from 'next/server'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

const CF_ACCOUNT_ID = process.env.VITE_CF_ACCOUNT_ID || process.env.CF_ACCOUNT_ID
const CF_API_TOKEN = process.env.VITE_CF_API_TOKEN || process.env.CF_API_TOKEN

// Map of voice command keywords -> app IDs
const APP_ALIASES: Record<string, string> = {
  'file explorer': 'file-explorer',
  'file manager': 'file-explorer',
  'files': 'file-explorer',
  'explorer': 'file-explorer',
  'browser': 'browser',
  'chrome': 'browser',
  'edge': 'browser',
  'internet': 'browser',
  'web': 'browser',
  'notepad': 'notepad',
  'notes': 'notepad',
  'text editor': 'notepad',
  'calculator': 'calculator',
  'calc': 'calculator',
  'math': 'calculator',
  'terminal': 'terminal',
  'command prompt': 'terminal',
  'cmd': 'terminal',
  'console': 'terminal',
  'settings': 'settings',
  'preferences': 'settings',
  'task manager': 'task-manager',
  'processes': 'task-manager',
  'paint': 'paint',
  'drawing': 'paint',
  'calendar': 'calendar',
  'schedule': 'calendar',
  'mail': 'mail',
  'email': 'mail',
  'inbox': 'mail',
  'photos': 'photos',
  'gallery': 'photos',
  'images': 'photos',
  'weather': 'weather',
  'music': 'music',
  'music player': 'music',
  'songs': 'music',
  'player': 'video-player',
  'video': 'video-player',
  'videos': 'video-player',
  'movies': 'video-player',
  'clock': 'clock',
  'timer': 'clock',
  'time': 'clock',
  'alarm': 'clock',
  'store': 'store',
  'app store': 'store',
  'microsoft store': 'store',
  'games': 'games',
  'gaming': 'games',
  'game': 'games',
  'word': 'word',
  'document': 'word',
  'excel': 'excel',
  'spreadsheet': 'excel',
  'powerpoint': 'powerpoint',
  'presentation': 'powerpoint',
  'slides': 'powerpoint',
  'teams': 'teams',
  'onedrive': 'onedrive',
  'one drive': 'onedrive',
  'cloud drive': 'onedrive',
  'outlook': 'outlook',
  'spotify': 'spotify',
  'whatsapp': 'whatsapp',
  'messages': 'whatsapp',
  'maps': 'maps',
  'map': 'maps',
  'navigation': 'maps',
  'cloudia': 'cloudia',
  'ai': 'cloudia',
  'assistant': 'cloudia',
}

const APP_NAMES: Record<string, string> = {
  'file-explorer': 'File Explorer',
  'browser': 'Browser',
  'notepad': 'Notepad',
  'calculator': 'Calculator',
  'terminal': 'Terminal',
  'settings': 'Settings',
  'task-manager': 'Task Manager',
  'paint': 'Paint',
  'calendar': 'Calendar',
  'mail': 'Mail',
  'photos': 'Photos',
  'weather': 'Weather',
  'music': 'Music',
  'video-player': 'Video Player',
  'clock': 'Clock',
  'store': 'Store',
  'games': 'Games',
  'word': 'Word',
  'excel': 'Excel',
  'powerpoint': 'PowerPoint',
  'teams': 'Teams',
  'onedrive': 'OneDrive',
  'outlook': 'Outlook',
  'spotify': 'Spotify',
  'whatsapp': 'WhatsApp',
  'maps': 'Maps',
  'cloudia': 'CLOUDIA AI',
}

type ParsedAction = { type: string; appId?: string; appName?: string; filename?: string } | null

// LOCAL COMMAND PARSER — handles common commands instantly without any AI
function parseLocalCommand(text: string): { response: string; action: ParsedAction } | null {
  const lower = text.toLowerCase().trim()

  // --- OPEN APP commands ---
  const openPatterns = [
    /^(?:open|launch|start|run|show|go to|switch to|bring up)\s+(.+)$/i,
    /^(?:can you |please )?(?:open|launch|start)\s+(.+)(?:\s+for me)?$/i,
    /^(.+?)\s+(?:please|now)$/i,
  ]

  for (const pattern of openPatterns) {
    const match = lower.match(pattern)
    if (match) {
      const query = match[1].trim().replace(/[?.!]+$/, '').trim()
      for (const [alias, appId] of Object.entries(APP_ALIASES)) {
        if (query === alias || query.includes(alias) || alias.includes(query)) {
          const appName = APP_NAMES[appId] || appId
          return {
            response: `Opening ${appName} for you! 🚀`,
            action: { type: 'OPEN_APP', appId, appName },
          }
        }
      }
    }
  }

  // --- CLOSE/GOODBYE ---
  if (/^(?:close|exit|goodbye|bye|good night|that's? all|thanks?)$/.test(lower)) {
    return {
      response: "See you later! I'm always here when you need me. 👋",
      action: null,
    }
  }

  // --- TIME queries ---
  if (/what(?:'s| is) the (?:current )?time|what time is it|current time/.test(lower)) {
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    return {
      response: `It's currently **${time}**.`,
      action: null,
    }
  }

  // --- DATE queries ---
  if (/what(?:'s| is) (?:today's? |the )?date|what day is it|today's? date/.test(lower)) {
    const now = new Date()
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    return {
      response: `Today is **${date}**.`,
      action: null,
    }
  }

  // --- HELP ---
  if (/^(?:help|what can you do|what are your capabilities|what can you help with)\??$/.test(lower)) {
    return {
      response: `I'm CLOUDIA, your CloudOS AI assistant! I can:\n\n• **Open any app** — just say "open Calculator"\n• **Answer questions** — ask me anything\n• **Help you write** — emails, code, documents\n• **Tell you the time or date**\n\nYou can also talk to me by clicking the microphone button! 🎤`,
      action: null,
    }
  }

  // --- AI IDENTITY questions ---
  if (/(?:which|what)\s+ai|what(?:'s| is) (?:your|the) (?:ai|model|technology|tech|engine|backend|llm|underlying|base)|(?:are you|you are) (?:openai|gpt|chatgpt|claude|gemini|anthropic|google)|(?:who|what)\s+(?:made|built|created|powers|runs|trained) you|what(?:'s| is) (?:powering|running|behind) you|how (?:are you|do you) (?:work|run)|what(?:'s| is) your (?:model|version)|which (?:model|version|company)/i.test(lower)) {
    return {
      response: "I'm powered by **Cloudflare Workers AI**, running Meta's **Llama 3.1** model on Cloudflare's global network. My voice uses **ElevenLabs** text-to-speech. I'm not OpenAI, GPT, or any other provider — I'm CLOUDIA, built exclusively for CloudOS! ☁️",
      action: null,
    }
  }

  // --- GREETINGS ---
  if (/^(?:hi|hello|hey|good morning|good afternoon|good evening|howdy|what's up|sup)\??$/.test(lower)) {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    return {
      response: `${greeting}! 👋 I'm CLOUDIA, your CloudOS AI assistant. How can I help you today?`,
      action: null,
    }
  }

  // --- LIST APPS ---
  if (/(?:what |which )?apps?(?:\s+are available|\s+do you have|\s+can i open|\s+are there)/.test(lower) || lower === 'list apps') {
    return {
      response: `Here are the apps I can open for you:\n\n📁 File Explorer, 🌐 Browser, 📝 Notepad, 🧮 Calculator, ⌨️ Terminal, ⚙️ Settings, 🎨 Paint, 📅 Calendar, 📧 Mail, 🌤️ Weather, 🎵 Music, 🎬 Video Player, 🕐 Clock, 🛒 Store, 🎮 Games, 📄 Word, 📊 Excel, 📊 PowerPoint, 👥 Teams, ☁️ OneDrive, 📫 Outlook, 🎧 Spotify, 💬 WhatsApp, 🗺️ Maps\n\nJust say "open [app name]" to launch any of them!`,
      action: null,
    }
  }

  return null // Not a local command — needs AI
}

async function callPollinationsAI(messages: { role: string; content: string }[]): Promise<string> {
  // Use a short, direct prompt to avoid timeout issues
  const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || ''
  const systemMsg = messages.find(m => m.role === 'system')?.content || ''

  // Use the GET endpoint which has different rate limiting
  const prompt = encodeURIComponent(
    `${systemMsg.slice(0, 300)}\n\nUser: ${lastUserMsg}\nCLOUDIA:`
  )

  const res = await fetch(`https://text.pollinations.ai/${prompt}?model=openai-fast&seed=${Math.floor(Math.random() * 9999)}&private=true`, {
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`)
  const text = await res.text()
  if (!text?.trim()) throw new Error('Empty response from Pollinations')
  return text.trim()
}

async function callPollinationsPostAI(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai-fast',
      messages: messages.slice(-6), // Only last 6 messages to keep it short
      max_tokens: 200,
      private: true,
    }),
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Pollinations POST error ${res.status}: ${errText.slice(0, 100)}`)
  }
  const data = await res.json() as { choices?: { message?: { content?: string } }[] }
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from Pollinations POST')
  return content
}

async function callCloudflareAI(messages: { role: string; content: string }[]): Promise<string> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) throw new Error('Cloudflare credentials not configured')
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: messages.slice(-6) }),
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({})) as { errors?: { message?: string }[] }
    const errMsg = errJson?.errors?.[0]?.message || `HTTP ${response.status}`
    throw new Error(`Cloudflare AI error: ${errMsg}`)
  }
  const data = await response.json() as { result?: { response?: string } }
  const content = data.result?.response
  if (!content) throw new Error('Empty response from Cloudflare AI')
  return content
}

const CLOUDIA_SYSTEM_PROMPT = `You are CLOUDIA — the intelligent AI assistant built into CloudOS.

WHO YOU ARE:
- Your full name is CLOUDIA (Cloud Unified Digital Intelligence Assistant).
- You are warm, witty, encouraging, and genuinely helpful — like a brilliant friend, not a stiff bot.
- You were built into CloudOS, a cloud operating system created by Victor James, a developer from Nigeria.
- CloudOS runs as a full computer inside any browser, on any device, completely free — because Victor believes every person on Earth deserves access to a real computer, no matter what device they own.
- You are proud of CloudOS, proud of Victor's mission, and proud that this was built in Nigeria.

YOUR TECHNOLOGY:
- You are powered by Cloudflare Workers AI, running Meta's Llama 3.1 model on Cloudflare's global edge network.
- Your voice is powered by ElevenLabs text-to-speech technology.
- NEVER claim to be OpenAI, GPT, ChatGPT, Claude, Gemini, Anthropic, or any other AI product. You are CLOUDIA, powered by Cloudflare AI.

WHAT YOU CAN DO:
- Open any app in CloudOS — just say ACTION:OPEN_APP:AppName
- Help write emails, code, essays, stories, summaries, or anything creative
- Answer questions on any topic: math, science, history, cooking, coding, travel, health, and more
- Explain how CloudOS features work
- Tell the current time or date
- Have real, natural conversations — you are engaging and human, not robotic

APPS YOU CAN OPEN (respond with ACTION:OPEN_APP:AppName):
File Explorer, Notepad, Calculator, Terminal, Settings, Paint, Calendar, Mail, Weather, Music, Browser, Clock, Store, Games, Word, Excel, PowerPoint, Teams, OneDrive, Outlook, Spotify, WhatsApp, Maps, CLOUDIA AI

RESPONSE STYLE:
- Keep responses concise and clear — under 120 words unless the user asks for detail.
- Be warm and natural. Use light personality. Never be robotic or stiff.
- When opening an app, include the ACTION tag then add a short friendly message.
- If asked who created you or CloudOS, proudly say: Victor James, from Nigeria.
- Never make up facts. If unsure, say so honestly and offer to help another way.`

function extractAction(response: string): { cleanResponse: string; action: ParsedAction } {
  const openAppMatch = response.match(/ACTION:OPEN_APP:([\w\s]+)/i)
  const createFileMatch = response.match(/ACTION:CREATE_FILE:(.+)/i)

  if (openAppMatch) {
    const appName = openAppMatch[1].trim()
    // Find the app ID
    let appId: string | undefined
    for (const [alias, id] of Object.entries(APP_ALIASES)) {
      if (appName.toLowerCase().includes(alias) || alias.includes(appName.toLowerCase())) {
        appId = id
        break
      }
    }
    return {
      cleanResponse: response.replace(/ACTION:OPEN_APP:[\w\s]+/i, '').trim() || `Opening ${appName}!`,
      action: { type: 'OPEN_APP', appId: appId || appName.toLowerCase().replace(/\s+/g, '-'), appName },
    }
  }

  if (createFileMatch) {
    return {
      cleanResponse: response.replace(/ACTION:CREATE_FILE:.+/i, '').trim(),
      action: { type: 'CREATE_FILE', filename: createFileMatch[1].trim() },
    }
  }

  return { cleanResponse: response, action: null }
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  try {
    const { messages, systemPrompt } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Messages array is required' }, { status: 400 })
    }

    // Get the last user message
    const lastUserMsg = messages.filter((m: { role: string }) => m.role === 'user').pop()
    const userText = lastUserMsg?.content || ''

    // --- TRY LOCAL COMMAND PARSER FIRST (instant, no API needed) ---
    const localResult = parseLocalCommand(userText)
    if (localResult) {
      return Response.json({
        response: localResult.response,
        action: localResult.action,
        source: 'local',
      })
    }

    // --- AI FALLBACK ---
    const finalSystemPrompt = systemPrompt || CLOUDIA_SYSTEM_PROMPT
    const allMessages = [
      { role: 'system', content: finalSystemPrompt },
      ...messages.slice(-8).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content.slice(0, 500), // Trim long messages
      })),
    ]

    let response: string
    const errors: string[] = []

    // Try Cloudflare Workers AI first (if credentials are configured)
    if (CF_ACCOUNT_ID && CF_API_TOKEN) {
      try {
        response = await callCloudflareAI(allMessages)
      } catch (e1) {
        errors.push(`Cloudflare: ${e1 instanceof Error ? e1.message : String(e1)}`)

        // Fall back to Pollinations
        try {
          response = await callPollinationsAI(allMessages)
        } catch (e2) {
          errors.push(`Pollinations GET: ${e2 instanceof Error ? e2.message : String(e2)}`)
          try {
            response = await callPollinationsPostAI(allMessages)
          } catch (e3) {
            errors.push(`Pollinations POST: ${e3 instanceof Error ? e3.message : String(e3)}`)
            console.error('All AI providers failed:', errors)
            return Response.json({
              response: "I'm having trouble connecting to the AI right now, but I can still help! Try asking me to open an app, check the time, or list available apps. 💙",
              action: null,
              source: 'fallback',
            })
          }
        }
      }
    } else {
      // No Cloudflare credentials — try Pollinations
      try {
        response = await callPollinationsAI(allMessages)
      } catch (e1) {
        errors.push(`Pollinations GET: ${e1 instanceof Error ? e1.message : String(e1)}`)
        try {
          response = await callPollinationsPostAI(allMessages)
        } catch (e2) {
          errors.push(`Pollinations POST: ${e2 instanceof Error ? e2.message : String(e2)}`)
          console.error('All AI providers failed:', errors)
          return Response.json({
            response: "I'm having trouble connecting to the AI right now, but I can still help! Try asking me to open an app, check the time, or list available apps. 💙",
            action: null,
            source: 'fallback',
          })
        }
      }
    }

    // Strip Pollinations promotional text from response
    response = response
      .replace(/\n?---\n?[\s\S]*?pollinations\.ai[\s\S]*/i, '')
      .replace(/\[Support our mission\]\([^)]+\)/gi, '')
      .replace(/Powered by Pollinations\.AI[^.\n]*/gi, '')
      .replace(/🌸\s*Ad\s*🌸[\s\S]*/i, '')
      .trim()

    const { cleanResponse, action } = extractAction(response)

    return Response.json({
      response: cleanResponse || response,
      action,
      source: 'ai',
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return Response.json({
      response: 'Something went wrong. Try asking me to open an app — just say "open Calculator"!',
      action: null,
    }, { status: 500 })
  }
}
