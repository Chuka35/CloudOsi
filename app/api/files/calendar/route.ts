import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import getDb from '@/lib/db'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const events = getDb().prepare(`SELECT * FROM calendar_events WHERE user_id = ? ORDER BY date ASC`).all(payload.userId)
  return Response.json({ events })
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()
  const { title, date, time, endTime, allDay, color, notes } = await req.json()
  if (!title || !date) return Response.json({ error: 'Title and date required' }, { status: 400 })
  const id = uuidv4()
  getDb().prepare(`INSERT INTO calendar_events (id, user_id, title, date, time, end_time, all_day, color, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, payload.userId, title, date, time || null, endTime || null, allDay ? 1 : 0, color || '#0078D4', notes || '')
  return Response.json({ id, title, date, color })
}
