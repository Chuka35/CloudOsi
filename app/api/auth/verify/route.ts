import { NextRequest, NextResponse } from 'next/server'
import getDb from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const origin = req.nextUrl.origin

  if (!token) {
    return NextResponse.redirect(`${origin}/auth?error=invalid_token`)
  }

  try {
    const db = getDb()

    const record = db.prepare(
      `SELECT * FROM verification_tokens WHERE token = ? AND type = 'email' AND used = 0`
    ).get(token) as { user_id: string; expires_at: string; used: number } | undefined

    if (!record) {
      return NextResponse.redirect(`${origin}/auth?error=invalid_token`)
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.redirect(`${origin}/auth?error=token_expired`)
    }

    db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(record.user_id)
    db.prepare('UPDATE verification_tokens SET used = 1 WHERE token = ?').run(token)

    return NextResponse.redirect(`${origin}/desktop?verified=1`)
  } catch (err) {
    console.error('Email verification error:', err)
    return NextResponse.redirect(`${origin}/auth?error=verification_failed`)
  }
}
