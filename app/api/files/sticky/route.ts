import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const notes = getDb().prepare(`SELECT * FROM sticky_notes WHERE user_id = ?`).all(payload.userId)
  return Response.json({ notes })
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { content = '', color = 'yellow' } = await req.json()
  const id = uuidv4()
  getDb().prepare(`INSERT INTO sticky_notes (id, user_id, content, color) VALUES (?, ?, ?, ?)`).run(id, payload.userId, content, color)
  return Response.json({ id, content, color })
}
