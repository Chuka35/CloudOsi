import { NextRequest } from 'next/server'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  getDb().prepare(`DELETE FROM bookmarks WHERE id = ? AND user_id = ?`).run(id, payload.userId)
  return Response.json({ success: true })
}
