import { NextRequest } from 'next/server'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { id } = await params
  const { content, name } = await req.json()
  getDb().prepare(`UPDATE notepad_files SET content = COALESCE(?, content), name = COALESCE(?, name), updated_at = datetime('now') WHERE id = ? AND user_id = ?`)
    .run(content, name, id, payload.userId)
  return Response.json({ success: true })
}
