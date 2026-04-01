import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID

  if (!clientId) {
    const authUrl = req.nextUrl.clone()
    authUrl.pathname = '/auth'
    authUrl.searchParams.set('error', 'google_not_configured')
    return NextResponse.redirect(authUrl)
  }

  const origin = req.nextUrl.origin
  const redirectUri = `${origin}/api/auth/google/callback`
  const state = Buffer.from(JSON.stringify({ origin })).toString('base64url')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  })

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
