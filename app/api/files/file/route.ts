import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  const { name, type = 'text', content = '', parentFolder = 'root' } = await req.json()
  if (!name?.trim()) return Response.json({ error: 'File name is required' }, { status: 400 })

  const db = getDb()
  const id = uuidv4()
  const size = Buffer.byteLength(content, 'utf8')

  db.prepare(`INSERT INTO files (id, user_id, name, type, content, parent_folder, size) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(id, payload.userId, name.trim(), type, content, parentFolder, size)

  db.prepare(`UPDATE users SET storage_used = storage_used + ?, updated_at = datetime('now') WHERE id = ?`).run(size, payload.userId)

  return Response.json({ id, name: name.trim(), type, content, parentFolder, size, createdAt: new Date().toISOString() }, { status: 201 })
}
