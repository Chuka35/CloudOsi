import { NextRequest } from 'next/server'
import getDb, { formatUser } from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function PUT(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  try {
    const { displayName, selectedVoice, aiModel, autoSpeak, showTranscript, theme, accentColor, wallpaper } = await req.json()
    const db = getDb()

    db.prepare(`
      UPDATE users SET
        display_name = COALESCE(?, display_name),
        selected_voice = COALESCE(?, selected_voice),
        ai_model = COALESCE(?, ai_model),
        auto_speak = COALESCE(?, auto_speak),
        show_transcript = COALESCE(?, show_transcript),
        theme = COALESCE(?, theme),
        accent_color = COALESCE(?, accent_color),
        wallpaper = COALESCE(?, wallpaper),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      displayName, selectedVoice, aiModel,
      autoSpeak !== undefined ? (autoSpeak ? 1 : 0) : null,
      showTranscript !== undefined ? (showTranscript ? 1 : 0) : null,
      theme, accentColor, wallpaper,
      payload.userId
    )

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId) as Record<string, unknown>
    return Response.json({ success: true, user: formatUser(user) })
  } catch (error) {
    return Response.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
