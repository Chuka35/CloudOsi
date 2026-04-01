import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'cloudos-fallback-secret'

export interface JwtPayload {
  userId: string
  email?: string
  isGuest?: boolean
}

export function signToken(payload: JwtPayload, expiresIn: string = '30d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as Parameters<typeof jwt.sign>[2])
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice(7)
}

export function getUserFromRequest(req: NextRequest): JwtPayload | null {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}

export function saveSession(
  db: ReturnType<typeof import('./db').default>,
  token: string,
  userId: string,
  isGuest: boolean,
  expiryHours: number
) {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + expiryHours)
  db().prepare(
    `INSERT INTO sessions (token, user_id, is_guest, expires_at) VALUES (?, ?, ?, ?)`
  ).run(token, userId, isGuest ? 1 : 0, expiresAt.toISOString())
}

export function unauthorizedResponse(message = 'Authentication required') {
  return Response.json({ error: message }, { status: 401 })
}
