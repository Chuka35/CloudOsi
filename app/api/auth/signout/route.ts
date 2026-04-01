import { NextRequest } from 'next/server'
import getDb from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (token) {
    getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token)
  }
  return Response.json({ success: true })
}
