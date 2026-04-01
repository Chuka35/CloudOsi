import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import getDb, { formatUser } from '@/lib/db'
import { signToken, saveSession } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const db = getDb()

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as Record<string, unknown> | undefined
    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash as string)
    if (!valid) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = signToken({ userId: user.id as string, email: user.email as string, isGuest: false })
    saveSession(getDb, token, user.id as string, false, 720)

    return Response.json({ token, user: formatUser(user) })
  } catch (error) {
    console.error('Signin error:', error)
    return Response.json({ error: 'Server error during signin' }, { status: 500 })
  }
}
