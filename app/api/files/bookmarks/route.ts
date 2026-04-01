import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const bookmarks = getDb().prepare(`SELECT * FROM bookmarks WHERE user_id = ? ORDER BY title`).all(payload.userId)
  return Response.json({ bookmarks })
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { title, url, favicon, folder } = await req.json()
  const id = uuidv4()
  getDb().prepare(`INSERT INTO bookmarks (id, user_id, title, url, favicon, folder) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(id, payload.userId, title, url, favicon || null, folder || 'default')
  return Response.json({ id, title, url })
}
