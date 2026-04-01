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
    const { code, question, language = 'javascript' } = await req.json()
    const messages = [
      { role: 'system', content: 'You are an expert programmer. Write clean, efficient, well-commented code. Wrap code in triple backticks with the language name. Be concise and practical.' },
      { role: 'user', content: code ? `I have this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nQuestion: ${question}` : question }
    ]

    try {
      const response = await callPollinationsAI(messages)
      return Response.json({ response: response || 'Code assistance is temporarily unavailable.' })
    } catch {
      return Response.json({ response: 'Code assistance is temporarily unavailable.' })
    }
  } catch (error) {
    console.error('Code AI error:', error)
    return Response.json({ error: 'Code assistant unavailable', response: 'Code assistance is temporarily unavailable.' }, { status: 500 })
  }
}
