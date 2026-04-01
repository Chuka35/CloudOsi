import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'
import { sendVerificationEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  try {
    const db = getDb()
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId) as {
      id: string; email: string; display_name: string; email_verified: number
    } | undefined

    if (!user) return Response.json({ error: 'User not found' }, { status: 404 })
    if (user.email_verified) return Response.json({ message: 'Email already verified' })

    // Invalidate old tokens
    db.prepare(`DELETE FROM verification_tokens WHERE user_id = ? AND type = 'email' AND used = 0`).run(user.id)

    // Create new token (24h expiry)
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    db.prepare(
      `INSERT INTO verification_tokens (token, user_id, type, expires_at) VALUES (?, ?, 'email', ?)`
    ).run(token, user.id, expiresAt)

    const sent = await sendVerificationEmail(user.email, user.display_name, token)

    return Response.json({ success: true, sent })
  } catch (err) {
    console.error('Send verification error:', err)
    return Response.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
