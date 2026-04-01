import { NextRequest } from 'next/server'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  const { content, color, positionX, positionY } = await req.json()
  getDb().prepare(`UPDATE sticky_notes SET content = COALESCE(?, content), color = COALESCE(?, color), position_x = COALESCE(?, position_x), position_y = COALESCE(?, position_y), updated_at = datetime('now') WHERE id = ? AND user_id = ?`)
    .run(content, color, positionX, positionY, id, payload.userId)
  return Response.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  getDb().prepare(`DELETE FROM sticky_notes WHERE id = ? AND user_id = ?`).run(id, payload.userId)
  return Response.json({ success: true })
}
