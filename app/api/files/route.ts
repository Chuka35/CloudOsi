import { NextRequest } from 'next/server'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  const db = getDb()
  const folders = db.prepare(`SELECT * FROM folders WHERE user_id = ? ORDER BY name ASC`).all(payload.userId)
  const files = db.prepare(`SELECT id, user_id, name, type, parent_folder, size, is_pinned, created_at, updated_at FROM files WHERE user_id = ? ORDER BY name ASC`).all(payload.userId)

  return Response.json({ folders, files })
}
