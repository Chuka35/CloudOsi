import { NextRequest } from 'next/server'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY

const VOICES: Record<string, { id: string; name: string }> = {
  aria: { id: 'gJx1vCzNCD1EQHT212Ls', name: 'ARIA' },
  atlas: { id: 'sB7vwSCyX0tQmU24cW2C', name: 'ATLAS' },
  echo: { id: '6fZce9LFNG3iEITDfqZZ', name: 'ECHO' },
  rachel: { id: 'EST9Ui6982FZPSi7gCHi', name: 'RACHEL' }
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  try {
    const { text, voice = 'aria', stability = 0.5, similarity = 0.75 } = await req.json()
    if (!text?.trim()) return Response.json({ error: 'Text is required' }, { status: 400 })
    if (text.length > 5000) return Response.json({ error: 'Text too long. Maximum 5000 characters.' }, { status: 400 })

    const voiceConfig = VOICES[voice] || VOICES.aria

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}/stream`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability, similarity_boost: similarity, style: 0.4, use_speaker_boost: true, speed: 1.25 }
      })
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()
    return new Response(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': audioBuffer.byteLength.toString() }
    })
  } catch (error: unknown) {
    console.error('TTS error:', error)
    return Response.json({ error: 'Voice service unavailable' }, { status: 500 })
  }
}
