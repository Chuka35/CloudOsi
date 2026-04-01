import { NextRequest } from 'next/server'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  return Response.json({
    models: [
      { id: '@cf/meta/llama-3-8b-instruct', name: 'Llama 3 8B (Fast)', description: 'Best for general conversation', isDefault: true },
      { id: '@cf/mistral/mistral-7b-instruct-v0.1', name: 'Mistral 7B (Balanced)', description: 'Good balance of speed and quality' },
      { id: '@cf/google/gemma-7b-it', name: 'Gemma 7B (Smart)', description: 'Great for complex reasoning' },
      { id: '@cf/deepseek-ai/deepseek-coder-6.7b-instruct', name: 'DeepSeek Coder (Code)', description: 'Specialized for programming tasks' }
    ]
  })
}
