export const runtime = 'nodejs'

export async function GET() {
  return Response.json({
    status: 'running',
    name: 'CloudOS Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      database: 'SQLite (connected)',
      ai: 'Cloudflare Workers AI',
      voice: 'ElevenLabs TTS',
      auth: 'JWT + bcrypt'
    }
  })
}
