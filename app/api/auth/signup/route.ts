import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import getDb, { createDefaultData, formatUser } from '@/lib/db'
import { signToken, saveSession } from '@/lib/auth-utils'
import { sendVerificationEmail } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json()
    const db = getDb()

    if (!email?.trim() || !password || !displayName?.trim()) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase())
    if (existing) {
      return Response.json({ error: 'This email is already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const userId = uuidv4()

    db.prepare(
      `INSERT INTO users (id, email, password_hash, display_name, email_verified) VALUES (?, ?, ?, ?, 0)`
    ).run(userId, email.toLowerCase(), passwordHash, displayName.trim())

    createDefaultData(userId)

    const token = signToken({ userId, email: email.toLowerCase(), isGuest: false })
    saveSession(getDb, token, userId, false, 720)

    // Create email verification token and send email (non-blocking)
    try {
      const verifyToken = uuidv4()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      db.prepare(
        `INSERT INTO verification_tokens (token, user_id, type, expires_at) VALUES (?, ?, 'email', ?)`
      ).run(verifyToken, userId, expiresAt)
      sendVerificationEmail(email.toLowerCase(), displayName.trim(), verifyToken).catch(console.error)
    } catch (emailErr) {
      console.error('Verification email setup error:', emailErr)
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as Record<string, unknown>
    return Response.json({ token, user: formatUser(user) }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return Response.json({ error: 'Server error during signup' }, { status: 500 })
  }
}
