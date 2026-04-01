import { NextRequest } from 'next/server'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  return Response.json({
    voices: [
      { id: 'aria', name: 'ARIA', description: 'Friendly, warm female voice' },
      { id: 'atlas', name: 'ATLAS', description: 'Professional, clear male voice' },
      { id: 'echo', name: 'ECHO', description: 'Calm, neutral voice' },
      { id: 'rachel', name: 'RACHEL', description: 'Natural American female voice' }
    ]
  })
}
