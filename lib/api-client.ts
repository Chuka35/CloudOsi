function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cloudos_token')
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(path, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) }
  })

  if (res.status === 401) {
    localStorage.removeItem('cloudos_token')
    if (!window.location.pathname.includes('/auth')) {
      window.location.href = '/auth'
    }
    throw new Error('Authentication required')
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const aiAPI = {
  chat: (messages: { role: string; content: string }[], model?: string, systemPrompt?: string) =>
    apiFetch('/api/ai/chat', { method: 'POST', body: JSON.stringify({ messages, model, systemPrompt }) }),
  code: (code: string, question: string, language?: string) =>
    apiFetch('/api/ai/code', { method: 'POST', body: JSON.stringify({ code, question, language }) }),
  write: (text: string, action: string) =>
    apiFetch('/api/ai/write', { method: 'POST', body: JSON.stringify({ text, action }) }),
  getModels: () => apiFetch('/api/ai/models')
}

export const voiceAPI = {
  speakAndPlay: async (text: string, voice = 'aria'): Promise<void> => {
    const token = getToken()
    const res = await fetch('/api/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      body: JSON.stringify({ text, voice })
    })
    if (!res.ok) throw new Error('Voice service unavailable')
    const blob = await res.blob()
    const audioUrl = URL.createObjectURL(blob)
    const audio = new Audio(audioUrl)
    await audio.play()
    return new Promise(resolve => {
      audio.onended = () => { URL.revokeObjectURL(audioUrl); resolve() }
    })
  },
  getVoices: () => apiFetch('/api/voice/voices')
}

export const filesAPI = {
  getAll: () => apiFetch('/api/files'),
  getFolder: (id: string) => apiFetch(`/api/files/folder/${id}`),
  getFile: (id: string) => apiFetch(`/api/files/file/${id}`),
  createFile: (data: Record<string, unknown>) => apiFetch('/api/files/file', { method: 'POST', body: JSON.stringify(data) }),
  updateFile: (id: string, data: Record<string, unknown>) => apiFetch(`/api/files/file/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFile: (id: string) => apiFetch(`/api/files/file/${id}`, { method: 'DELETE' }),
  createFolder: (data: Record<string, unknown>) => apiFetch('/api/files/folder', { method: 'POST', body: JSON.stringify(data) }),
  deleteFolder: (id: string) => apiFetch(`/api/files/folder/${id}`, { method: 'DELETE' }),
  getNotepadFiles: () => apiFetch('/api/files/notepad'),
  createNotepadFile: (data: Record<string, unknown>) => apiFetch('/api/files/notepad', { method: 'POST', body: JSON.stringify(data) }),
  updateNotepadFile: (id: string, data: Record<string, unknown>) => apiFetch(`/api/files/notepad/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getStickyNotes: () => apiFetch('/api/files/sticky'),
  createStickyNote: (data: Record<string, unknown>) => apiFetch('/api/files/sticky', { method: 'POST', body: JSON.stringify(data) }),
  updateStickyNote: (id: string, data: Record<string, unknown>) => apiFetch(`/api/files/sticky/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStickyNote: (id: string) => apiFetch(`/api/files/sticky/${id}`, { method: 'DELETE' }),
  getCalendarEvents: () => apiFetch('/api/files/calendar'),
  createCalendarEvent: (data: Record<string, unknown>) => apiFetch('/api/files/calendar', { method: 'POST', body: JSON.stringify(data) }),
  deleteCalendarEvent: (id: string) => apiFetch(`/api/files/calendar/${id}`, { method: 'DELETE' }),
  getBookmarks: () => apiFetch('/api/files/bookmarks'),
  createBookmark: (data: Record<string, unknown>) => apiFetch('/api/files/bookmarks', { method: 'POST', body: JSON.stringify(data) }),
  deleteBookmark: (id: string) => apiFetch(`/api/files/bookmarks/${id}`, { method: 'DELETE' })
}

export default apiFetch
