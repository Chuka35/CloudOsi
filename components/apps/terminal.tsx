'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { TerminalSquare, Plus, ChevronDown, X } from 'lucide-react'

interface TerminalLine {
  type: 'output' | 'input' | 'error' | 'info'
  content: string
  color?: string
}

const initialOutput: TerminalLine[] = [
  { type: 'info', content: 'CloudOS PowerShell', color: 'var(--accent)' },
  { type: 'info', content: 'Copyright (C) CloudOS Corporation. All rights reserved.' },
  { type: 'info', content: '' },
  { type: 'info', content: 'Type "help" for available commands. Real shell execution is enabled.', color: '#6CCB5F' },
  { type: 'info', content: '' },
]

const CLIENT_COMMANDS: Record<string, (args: string[]) => TerminalLine[]> = {
  help: () => [
    { type: 'info', content: '' },
    { type: 'info', content: 'CloudOS Terminal — Real shell commands are supported.', color: '#60CDFF' },
    { type: 'info', content: '' },
    { type: 'info', content: 'Built-in commands:', color: '#60CDFF' },
    { type: 'info', content: '  clear / cls   - Clear the terminal' },
    { type: 'info', content: '  help          - Show this help' },
    { type: 'info', content: '  ver           - CloudOS version' },
    { type: 'info', content: '  echo <text>   - Print text' },
    { type: 'info', content: '' },
    { type: 'info', content: 'Shell commands (executed on server):', color: '#FCE100' },
    { type: 'info', content: '  ls / dir      - List files' },
    { type: 'info', content: '  pwd           - Working directory' },
    { type: 'info', content: '  cat <file>    - Read a file' },
    { type: 'info', content: '  whoami        - Current user' },
    { type: 'info', content: '  date          - Current date/time' },
    { type: 'info', content: '  uname -a      - System info' },
    { type: 'info', content: '  ps aux        - Running processes' },
    { type: 'info', content: '  df -h         - Disk usage' },
    { type: 'info', content: '  free -h       - Memory usage' },
    { type: 'info', content: '  env           - Environment variables' },
    { type: 'info', content: '' },
  ],
  clear: () => [],
  cls: () => [],
  ver: () => [
    { type: 'info', content: '' },
    { type: 'info', content: 'CloudOS [Version 1.0.0] — Powered by Cloudflare AI', color: '#6CCB5F' },
    { type: 'info', content: '' },
  ],
  echo: (args) => [
    { type: 'info', content: args.join(' ') },
    { type: 'info', content: '' },
  ],
}

export function TerminalApp() {
  const [lines, setLines] = useState<TerminalLine[]>(initialOutput)
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [lines])

  const runRemoteCommand = useCallback(async (command: string) => {
    setIsRunning(true)
    try {
      const token = localStorage.getItem('cloudos_token') || ''
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ command }),
      })
      const data = await res.json() as { output?: string; error?: boolean }
      const output = data.output || ''
      if (output) {
        const outputLines = output.split('\n').map(line => ({
          type: (data.error ? 'error' : 'info') as TerminalLine['type'],
          content: line,
          color: data.error ? '#FF5252' : undefined,
        }))
        setLines(prev => [...prev, ...outputLines, { type: 'info', content: '' }])
      } else {
        setLines(prev => [...prev, { type: 'info', content: '' }])
      }
    } catch {
      setLines(prev => [...prev, 
        { type: 'error', content: 'Failed to execute command — server unreachable.', color: '#FF5252' },
        { type: 'info', content: '' },
      ])
    } finally {
      setIsRunning(false)
    }
  }, [])
  
  const executeCommand = useCallback(async (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return
    
    setCommandHistory(prev => [...prev, trimmed])
    setHistoryIndex(-1)
    setCurrentInput('')
    
    setLines(prev => [...prev, { type: 'input', content: trimmed }])
    
    const parts = trimmed.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)
    
    if (cmd === 'clear' || cmd === 'cls') {
      setLines([])
      return
    }

    if (cmd === 'exit') {
      setLines(initialOutput)
      return
    }

    if (CLIENT_COMMANDS[cmd]) {
      const output = CLIENT_COMMANDS[cmd](args)
      setLines(prev => [...prev, ...output])
      return
    }

    await runRemoteCommand(trimmed)
  }, [runRemoteCommand])
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isRunning) executeCommand(currentInput)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      setIsRunning(false)
      setLines(prev => [...prev, { type: 'info', content: '^C', color: '#FF5252' }, { type: 'info', content: '' }])
    }
  }
  
  return (
    <div className="h-full flex flex-col" style={{ background: '#0c0c0c' }}>
      {/* Tabs Bar */}
      <div 
        className="h-9 flex items-center flex-shrink-0"
        style={{ 
          background: '#1a1a1a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        <div 
          className="h-9 px-4 flex items-center gap-2 text-[13px] text-white/80"
          style={{ 
            background: '#1f1f1f',
            borderRight: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <TerminalSquare className="w-[14px] h-[14px] text-[var(--accent)]" />
          CloudOS Shell
          <button className="ml-2 w-4 h-4 flex items-center justify-center rounded hover:bg-white/20">
            <X className="w-3 h-3 text-white/60" />
          </button>
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 ml-1">
          <Plus className="w-4 h-4 text-white/70" />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2 mr-3">
          {isRunning && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FCE100] animate-pulse" />
              <span className="text-[11px] text-white/40">Running...</span>
            </div>
          )}
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 mr-2">
          <ChevronDown className="w-4 h-4 text-white/70" />
        </button>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-[13px] leading-relaxed cursor-text"
        style={{ color: '#cccccc', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line.type === 'input' ? (
              <span>
                <span className="text-[var(--accent)]">PS C:\Users\CloudUser&gt; </span>
                {line.content}
              </span>
            ) : (
              line.content || '\u00a0'
            )}
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex items-center">
          <span className="text-[var(--accent)] flex-shrink-0">PS C:\Users\CloudUser&gt;&nbsp;</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-white caret-white"
              autoFocus
              disabled={isRunning}
              style={{ opacity: isRunning ? 0.5 : 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
