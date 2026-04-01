import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  const { name, parentFolder = 'root' } = await req.json()
  if (!name?.trim()) return Response.json({ error: 'Folder name is required' }, { status: 400 })

  const id = uuidv4()
  getDb().prepare(`INSERT INTO folders (id, user_id, name, parent_folder) VALUES (?, ?, ?, ?)`)
    .run(id, payload.userId, name.trim(), parentFolder)

  return Response.json({ id, name: name.trim(), parentFolder }, { status: 201 })
}
