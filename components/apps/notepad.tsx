'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { filesAPI } from '@/lib/api-client'
import { Plus, FileText, X, Save, Loader2 } from 'lucide-react'
import { useWallpaperStore } from '@/lib/stores/wallpaperStore'

interface NotepadFile {
  id: string
  name: string
  content: string
  updated_at?: string
}

const menuItems = ['File', 'Edit', 'Format', 'View', 'Help']

export function NotepadApp() {
  const [files, setFiles] = useState<NotepadFile[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [fileName, setFileName] = useState('Untitled.txt')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'unsaved'>('idle')
  const [line, setLine] = useState(1)
  const [column, setColumn] = useState(1)
  const [wordWrap, setWordWrap] = useState(true)
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { accentColor } = useWallpaperStore()

  const activeFile = files.find(f => f.id === activeFileId)

  // Load files on mount
  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    setIsLoading(true)
    try {
      const data = await filesAPI.getNotepadFiles() as { files: NotepadFile[] }
      const fileList = data.files || []
      setFiles(fileList)
      if (fileList.length > 0) {
        openFile(fileList[0])
      } else {
        await createNewFile()
      }
    } catch {
      setFiles([])
    } finally {
      setIsLoading(false)
    }
  }

  const openFile = (file: NotepadFile) => {
    setActiveFileId(file.id)
    setContent(file.content || '')
    setFileName(file.name)
    setSaveStatus('idle')
  }

  const createNewFile = async () => {
    try {
      const name = 'Untitled.txt'
      const data = await filesAPI.createNotepadFile({ name, content: '' }) as NotepadFile
      const newFile = { id: data.id, name, content: '' }
      setFiles(prev => [newFile, ...prev])
      openFile(newFile)
    } catch {
      // offline fallback
      const tmpFile = { id: `tmp-${Date.now()}`, name: 'Untitled.txt', content: '' }
      setFiles(prev => [tmpFile, ...prev])
      openFile(tmpFile)
    }
  }

  const saveFile = useCallback(async (fileId: string, fileContent: string, name?: string) => {
    if (!fileId || fileId.startsWith('tmp-')) return
    setIsSaving(true)
    try {
      await filesAPI.updateNotepadFile(fileId, { content: fileContent, name })
      setSaveStatus('saved')
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, content: fileContent, name: name || f.name } : f))
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('unsaved')
    } finally {
      setIsSaving(false)
    }
  }, [])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setSaveStatus('unsaved')

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      if (activeFileId) saveFile(activeFileId, newContent, fileName)
    }, 1500)
  }

  const handleSaveNow = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    if (activeFileId) saveFile(activeFileId, content, fileName)
  }

  const updatePosition = () => {
    if (!textareaRef.current) return
    const text = textareaRef.current.value.substring(0, textareaRef.current.selectionStart)
    const lines = text.split('\n')
    setLine(lines.length)
    setColumn(lines[lines.length - 1].length + 1)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault()
            handleSaveNow()
            break
          case 'n':
            e.preventDefault()
            createNewFile()
            break
          case 'a':
            e.preventDefault()
            textareaRef.current?.select()
            break
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeFileId, content, fileName])

  const menuDropdowns: Record<string, { label: string; shortcut?: string; action?: () => void }[]> = {
    File: [
      { label: 'New', shortcut: 'Ctrl+N', action: () => createNewFile() },
      { label: 'Save', shortcut: 'Ctrl+S', action: handleSaveNow },
    ],
    Edit: [
      { label: 'Select All', shortcut: 'Ctrl+A', action: () => textareaRef.current?.select() },
    ],
    Format: [
      { label: wordWrap ? '✓ Word Wrap' : 'Word Wrap', action: () => setWordWrap(!wordWrap) },
    ],
    View: [
      { label: showSidebar ? '✓ Files panel' : 'Files panel', action: () => setShowSidebar(!showSidebar) },
    ],
    Help: [
      { label: 'About CloudOS Notepad' },
    ],
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  return (
    <div className="h-full flex flex-col" style={{ background: '#1c1c1c' }}>
      {/* Menu Bar */}
      <div 
        className="h-7 flex items-center flex-shrink-0"
        style={{ background: 'rgba(32, 32, 32, 0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {menuItems.map((item) => (
          <div key={item} className="relative">
            <button
              className={`h-7 px-3 text-[13px] transition-colors ${showMenu === item ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/8'}`}
              onClick={() => setShowMenu(showMenu === item ? null : item)}
              onMouseEnter={() => showMenu && setShowMenu(item)}
            >
              {item}
            </button>
            {showMenu === item && (
              <div 
                className="absolute top-full left-0 min-w-[200px] py-1 rounded-lg z-50"
                style={{ background: 'rgba(32,32,32,0.98)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 8px 32px rgba(0,0,0,0.60)' }}
              >
                {menuDropdowns[item].map((menuItem, i) => (
                  <button
                    key={i}
                    className="w-full h-8 px-3 flex items-center justify-between text-[13px] text-white/80 hover:bg-white/8 transition-colors"
                    onClick={() => { menuItem.action?.(); setShowMenu(null) }}
                  >
                    <span>{menuItem.label}</span>
                    {menuItem.shortcut && <span className="text-white/40 text-xs">{menuItem.shortcut}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Save indicator */}
        <div className="ml-auto flex items-center gap-2 mr-2">
          {isSaving && <Loader2 className="w-3 h-3 text-white/40 animate-spin" />}
          {saveStatus === 'saved' && <span className="text-xs text-green-400">Saved</span>}
          {saveStatus === 'unsaved' && <span className="text-xs text-yellow-400">Unsaved</span>}
          <button
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/8 transition-colors"
            onClick={handleSaveNow}
            title="Save (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Sidebar */}
        {showSidebar && (
          <div 
            className="w-44 flex flex-col flex-shrink-0 overflow-hidden"
            style={{ background: 'rgba(28,28,28,0.97)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="h-8 flex items-center justify-between px-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[11px] text-white/40 uppercase tracking-wide">Files</span>
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/8 transition-colors"
                onClick={() => createNewFile()}
                title="New file"
              >
                <Plus className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {isLoading ? (
                <div className="flex items-center justify-center h-16">
                  <Loader2 className="w-4 h-4 text-white/20 animate-spin" />
                </div>
              ) : files.map((file) => (
                <div
                  key={file.id}
                  className="group flex items-center px-2 h-8 cursor-pointer transition-colors"
                  style={{
                    background: activeFileId === file.id ? `${accentColor}18` : 'transparent',
                    borderLeft: activeFileId === file.id ? `2px solid ${accentColor}` : '2px solid transparent',
                  }}
                  onClick={() => openFile(file)}
                >
                  <FileText className="w-3.5 h-3.5 flex-shrink-0 mr-2 text-white/40" />
                  <span className="text-[12px] text-white/70 truncate flex-1">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* File name tab */}
          {activeFile && (
            <div 
              className="h-7 flex items-center px-3 gap-2 flex-shrink-0"
              style={{ background: 'rgba(24,24,24,0.98)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <FileText className="w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onBlur={() => { if (activeFileId) saveFile(activeFileId, content, fileName) }}
                className="bg-transparent text-[12px] text-white/70 outline-none min-w-0"
                style={{ maxWidth: '200px' }}
              />
              {saveStatus === 'unsaved' && <span className="text-white/30 text-[10px]">●</span>}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onSelect={updatePosition}
            onClick={updatePosition}
            onKeyUp={updatePosition}
            className="flex-1 p-3 resize-none outline-none font-mono text-sm leading-relaxed overflow-auto"
            style={{
              background: '#1c1c1c',
              color: 'rgba(255,255,255,0.90)',
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-word' : 'normal',
              overflowX: wordWrap ? 'hidden' : 'auto',
            }}
            spellCheck
            placeholder="Start typing..."
          />
        </div>
      </div>
      
      {/* Status Bar */}
      <div 
        className="h-[22px] flex items-center justify-between px-3 text-[11px] text-white/40 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(20,20,20,0.98)' }}
      >
        <div className="flex items-center gap-4">
          <span>Ln {line}, Col {column}</span>
          <span>{charCount} chars</span>
          <span>{wordCount} words</span>
        </div>
        <span>UTF-8</span>
      </div>

      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(null)} />}
    </div>
  )
}
