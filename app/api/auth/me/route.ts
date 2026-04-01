import { NextRequest } from 'next/server'
import getDb, { formatUser } from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId) as Record<string, unknown> | undefined
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  return Response.json({ user: formatUser(user) })
}
