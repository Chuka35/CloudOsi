import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { signToken, saveSession } from '@/lib/auth-utils'
import getDb, { createDefaultData, formatUser } from '@/lib/db'

export const runtime = 'nodejs'

interface GoogleTokenResponse {
  access_token?: string
  error?: string
}

interface GoogleUserInfo {
  sub: string
  name: string
  email: string
  picture?: string
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const origin = req.nextUrl.origin
  const authUrl = `${origin}/auth`

  if (error || !code) {
    return NextResponse.redirect(`${authUrl}?error=google_denied`)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${authUrl}?error=google_not_configured`)
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData: GoogleTokenResponse = await tokenRes.json()
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${authUrl}?error=google_token_failed`)
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    if (!userRes.ok) {
      return NextResponse.redirect(`${authUrl}?error=google_userinfo_failed`)
    }

    const googleUser: GoogleUserInfo = await userRes.json()
    const db = getDb()

    let dbUser = db.prepare(
      'SELECT * FROM users WHERE google_id = ? OR email = ?'
    ).get(googleUser.sub, googleUser.email) as Record<string, unknown> | undefined

    if (!dbUser) {
      const userId = uuidv4()
      db.prepare(
        `INSERT INTO users (id, email, display_name, password_hash, google_id, avatar_url, email_verified)
         VALUES (?, ?, ?, '', ?, ?, 1)`
      ).run(userId, googleUser.email.toLowerCase(), googleUser.name, googleUser.sub, googleUser.picture || null)
      createDefaultData(userId)
      dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as Record<string, unknown>
    } else {
      if (!dbUser.google_id) {
        db.prepare('UPDATE users SET google_id = ?, avatar_url = COALESCE(avatar_url, ?), email_verified = 1 WHERE id = ?')
          .run(googleUser.sub, googleUser.picture || null, dbUser.id)
      }
      dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(dbUser.id) as Record<string, unknown>
    }

    if (!dbUser) {
      return NextResponse.redirect(`${authUrl}?error=google_db_failed`)
    }

    const token = signToken({ userId: dbUser.id as string, email: dbUser.email as string, isGuest: false })
    saveSession(getDb, token, dbUser.id as string, false, 720)

    const user = formatUser(dbUser)
    const successUrl = `${origin}/auth/google-success?token=${encodeURIComponent(token)}&name=${encodeURIComponent(user.displayName as string)}`
    return NextResponse.redirect(successUrl)
  } catch (err) {
    console.error('Google OAuth callback error:', err)
    return NextResponse.redirect(`${authUrl}?error=google_server_error`)
  }
}
