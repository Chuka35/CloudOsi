import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import getDb, { createDefaultData } from '@/lib/db'
import { signToken, saveSession } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function POST(_req: NextRequest) {
  try {
    const db = getDb()
    const guestId = `guest_${uuidv4().replace(/-/g, '')}`
    const guestEmail = `guest_${Date.now()}@cloudos.app`

    db.prepare(
      `INSERT INTO users (id, email, password_hash, display_name, is_guest) VALUES (?, ?, '', 'Guest User', 1)`
    ).run(guestId, guestEmail)

    createDefaultData(guestId)

    const token = signToken({ userId: guestId, email: guestEmail, isGuest: true }, '1h')
    saveSession(getDb, token, guestId, true, 1)

    return Response.json({
      token,
      user: {
        id: guestId,
        email: guestEmail,
        displayName: 'Guest User',
        selectedVoice: 'aria',
        aiModel: '@cf/meta/llama-3-8b-instruct',
        autoSpeak: true,
        showTranscript: true,
        theme: 'dark',
        accentColor: '#0078D4',
        wallpaper: 'aurora',
        isPro: false,
        isGuest: true,
        storageUsed: 0
      }
    })
  } catch (error) {
    console.error('Guest error:', error)
    return Response.json({ error: 'Could not create guest session' }, { status: 500 })
  }
}
