import { NextRequest } from 'next/server'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  const db = getDb()

  const subFolders = db.prepare(`SELECT * FROM folders WHERE user_id = ? AND parent_folder = ? ORDER BY name ASC`).all(payload.userId, id)
  const files = db.prepare(`SELECT id, user_id, name, type, parent_folder, size, created_at, updated_at FROM files WHERE user_id = ? AND parent_folder = ? ORDER BY name ASC`).all(payload.userId, id)

  return Response.json({ folders: subFolders, files })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  const db = getDb()

  db.prepare(`DELETE FROM folders WHERE id = ? AND user_id = ?`).run(id, payload.userId)
  db.prepare(`DELETE FROM files WHERE parent_folder = ? AND user_id = ?`).run(id, payload.userId)

  return Response.json({ success: true })
}
