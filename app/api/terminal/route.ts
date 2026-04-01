import { NextRequest } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { getUserFromRequest, unauthorizedResponse } from '@/lib/auth-utils'

export const runtime = 'nodejs'

const execAsync = promisify(exec)

const BLOCKED_COMMANDS = [
  'rm', 'rmdir', 'del', 'format', 'mkfs', 'dd', 'kill', 'killall',
  'shutdown', 'reboot', 'halt', 'poweroff', 'init', 'passwd',
  'chmod', 'chown', 'sudo', 'su', 'wget', 'curl',
  'nc', 'netcat', 'nmap', 'ssh', 'scp', 'sftp',
  'python', 'python3', 'node', 'ruby', 'perl', 'php',
  'bash', 'sh', 'zsh', 'fish', 'csh',
  'eval', 'exec', 'source',
  '>', '>>', '|', '`', '$(',
]

function isCommandSafe(command: string): boolean {
  const lower = command.toLowerCase().trim()
  for (const blocked of BLOCKED_COMMANDS) {
    if (lower.startsWith(blocked + ' ') || lower === blocked) return false
    if (lower.includes(blocked)) return false
  }
  return true
}

const COMMAND_MAP: Record<string, string> = {
  dir: 'ls -la',
  cls: 'clear',
  type: 'cat',
  del: 'echo [del is disabled for safety]',
  copy: 'cp',
  move: 'mv',
  md: 'mkdir',
  rd: 'rmdir',
  'ipconfig': 'ip addr show 2>/dev/null || ifconfig 2>/dev/null || echo "Network info unavailable"',
  'tasklist': 'ps aux --sort=-%mem 2>/dev/null | head -20 || ps aux | head -20',
  'ver': 'uname -a',
  'systeminfo': 'uname -a && cat /etc/os-release 2>/dev/null',
}

export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return unauthorizedResponse()

  try {
    const { command } = await req.json()
    if (!command || typeof command !== 'string') {
      return Response.json({ error: 'Command is required' }, { status: 400 })
    }

    const trimmed = command.trim()
    if (trimmed.length === 0) {
      return Response.json({ output: '' })
    }

    const parts = trimmed.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1).join(' ')

    if (!isCommandSafe(trimmed)) {
      return Response.json({
        output: `'${cmd}' is restricted for security reasons.`,
        error: true
      })
    }

    const mappedCmd = COMMAND_MAP[cmd]
    const finalCommand = mappedCmd
      ? (args ? `${mappedCmd} ${args}` : mappedCmd)
      : trimmed

    const { stdout, stderr } = await execAsync(finalCommand, {
      timeout: 5000,
      maxBuffer: 1024 * 64,
      cwd: process.cwd(),
    })

    const output = stdout || stderr || ''
    return Response.json({ output: output.trim() })
  } catch (error: unknown) {
    const err = error as { killed?: boolean; message?: string; stderr?: string }
    if (err.killed) {
      return Response.json({ output: 'Command timed out.', error: true })
    }
    const msg = err.stderr || err.message || 'Command failed'
    return Response.json({ output: msg.trim(), error: true })
  }
}
