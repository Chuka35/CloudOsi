import { NextRequest } from 'next/server'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  const file = getDb().prepare(`SELECT * FROM files WHERE id = ? AND user_id = ?`).get(id, payload.userId)
  if (!file) return Response.json({ error: 'File not found' }, { status: 404 })
  return Response.json({ file })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  const db = getDb()
  const { content, name } = await req.json()

  const existing = db.prepare(`SELECT * FROM files WHERE id = ? AND user_id = ?`).get(id, payload.userId) as Record<string, unknown> | undefined
  if (!existing) return Response.json({ error: 'File not found' }, { status: 404 })

  const newSize = content !== undefined ? Buffer.byteLength(content, 'utf8') : (existing.size as number)
  const sizeDiff = newSize - ((existing.size as number) || 0)

  db.prepare(`UPDATE files SET content = COALESCE(?, content), name = COALESCE(?, name), size = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`)
    .run(content, name, newSize, id, payload.userId)

  if (sizeDiff !== 0) {
    db.prepare(`UPDATE users SET storage_used = storage_used + ? WHERE id = ?`).run(sizeDiff, payload.userId)
  }

  return Response.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  const db = getDb()

  const file = db.prepare(`SELECT * FROM files WHERE id = ? AND user_id = ?`).get(id, payload.userId) as Record<string, unknown> | undefined
  if (file) {
    db.prepare(`UPDATE users SET storage_used = MAX(0, storage_used - ?) WHERE id = ?`).run(file.size || 0, payload.userId)
  }

  db.prepare(`DELETE FROM files WHERE id = ? AND user_id = ?`).run(id, payload.userId)
  return Response.json({ success: true })
}
