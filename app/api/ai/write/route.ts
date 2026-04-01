import { NextRequest } from 'next/server'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

async function callPollinationsAI(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'openai-fast', messages, private: true }),
    signal: AbortSignal.timeout(25000),
  })
  if (!res.ok) throw new Error(`Pollinations error: ${res.status}`)
  const data = await res.json() as { choices?: { message?: { content?: string } }[] }
  return data?.choices?.[0]?.message?.content || ''
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  try {
    const { text, action = 'improve' } = await req.json()
    if (!text?.trim()) return Response.json({ error: 'Text is required' }, { status: 400 })

    const actionPrompts: Record<string, string> = {
      improve: `Improve this text for clarity and flow. Return only the improved text:\n\n${text}`,
      summarize: `Summarize this text in 2-3 sentences. Return only the summary:\n\n${text}`,
      expand: `Expand this text with more detail and examples. Return only the expanded text:\n\n${text}`,
      formal: `Rewrite this in a formal professional tone. Return only the rewritten text:\n\n${text}`,
      casual: `Rewrite this in a casual, friendly tone. Return only the rewritten text:\n\n${text}`,
      fix: `Fix any grammar and spelling errors. Return only the corrected text:\n\n${text}`,
      shorter: `Make this text shorter and more concise. Return only the shortened text:\n\n${text}`
    }

    const messages = [
      { role: 'system', content: 'You are a professional writing assistant. Follow instructions exactly and return only the requested text output.' },
      { role: 'user', content: actionPrompts[action] || actionPrompts.improve }
    ]

    try {
      const response = await callPollinationsAI(messages)
      return Response.json({ response: response || text })
    } catch {
      return Response.json({ response: text })
    }
  } catch (error) {
    console.error('Write AI error:', error)
    return Response.json({ error: 'Writing assistant unavailable' }, { status: 500 })
  }
}
