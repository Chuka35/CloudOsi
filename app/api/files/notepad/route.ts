import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const files = getDb().prepare(`SELECT * FROM notepad_files WHERE user_id = ? ORDER BY updated_at DESC`).all(payload.userId)
  return Response.json({ files })
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { name = 'Untitled.txt', content = '' } = await req.json()
  const id = uuidv4()
  getDb().prepare(`INSERT INTO notepad_files (id, user_id, name, content) VALUES (?, ?, ?, ?)`).run(id, payload.userId, name, content)
  return Response.json({ id, name, content })
}
