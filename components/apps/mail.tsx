'use client'

import { useState } from 'react'
import { 
  Plus, 
  Mail as MailIcon, 
  Inbox, 
  FileEdit, 
  Send, 
  Archive, 
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Search,
  Star
} from 'lucide-react'

interface Email {
  id: string
  sender: string
  senderEmail: string
  subject: string
  preview: string
  body: string
  date: string
  unread: boolean
  starred: boolean
}

const emails: Email[] = [
  {
    id: '1',
    sender: 'CloudOS Team',
    senderEmail: 'team@cloudos.app',
    subject: 'Welcome to CloudOS!',
    preview: 'Thank you for joining CloudOS. We are excited to have you...',
    body: `Welcome to CloudOS!

Thank you for joining CloudOS. We're excited to have you as part of our growing community of users who are experiencing the future of computing.

With CloudOS, you can:
- Access your files from anywhere
- Use powerful applications in your browser
- Collaborate with others in real-time
- Stay productive on any device

Getting started is easy - just explore the Start menu to discover all the apps available to you.

If you have any questions, CLOUDIA is here to help! Just click the CLOUDIA icon to get AI-powered assistance.

Best regards,
The CloudOS Team`,
    date: 'Just now',
    unread: true,
    starred: false,
  },
  {
    id: '2',
    sender: 'CLOUDIA',
    senderEmail: 'cloudia@cloudos.app',
    subject: 'Your AI assistant is ready',
    preview: 'Hello! I am CLOUDIA, your personal AI assistant...',
    body: `Hello!

I'm CLOUDIA, your personal AI assistant built into CloudOS.

I can help you with:
- Opening applications
- Answering questions
- Writing and editing documents
- Finding files
- And much more!

Just click my icon in the Start menu or press Ctrl+Space to summon me anytime.

Looking forward to helping you!

CLOUDIA`,
    date: '5 min ago',
    unread: true,
    starred: true,
  },
  {
    id: '3',
    sender: 'ElevenHacks',
    senderEmail: 'hackathon@elevenlabs.io',
    subject: 'Hackathon updates',
    preview: 'Important updates about ElevenHacks Week 2...',
    body: `Hi there,

Here are the latest updates for ElevenHacks Week 2:

- Submissions are due by March 30th
- Make sure to include a demo video
- Winners will be announced April 5th

Good luck with your project!

The ElevenHacks Team`,
    date: 'Yesterday',
    unread: false,
    starred: false,
  },
  {
    id: '4',
    sender: 'Cloudflare',
    senderEmail: 'noreply@cloudflare.com',
    subject: 'Account activated',
    preview: 'Your Cloudflare Workers account has been activated...',
    body: `Your Cloudflare Workers account is now active!

You can now deploy serverless functions to the edge with Workers.

Get started at dash.cloudflare.com

Cloudflare`,
    date: '2 days ago',
    unread: false,
    starred: false,
  },
]

const folders = [
  { icon: Inbox, name: 'Inbox', count: 2 },
  { icon: FileEdit, name: 'Drafts', count: 1 },
  { icon: Send, name: 'Sent Items', count: 0 },
  { icon: Archive, name: 'Junk Email', count: 0 },
  { icon: Trash2, name: 'Deleted Items', count: 0 },
  { icon: Archive, name: 'Archive', count: 0 },
]

export function MailApp() {
  const [selectedEmail, setSelectedEmail] = useState<Email>(emails[0])
  const [activeFolder, setActiveFolder] = useState('Inbox')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  
  const filteredEmails = filter === 'unread' 
    ? emails.filter(e => e.unread) 
    : emails
  
  return (
    <div className="h-full flex">
      {/* Left Sidebar */}
      <div 
        className="w-[200px] p-2 flex-shrink-0"
        style={{ borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <button className="w-full h-10 flex items-center justify-center gap-2 rounded bg-[var(--accent)] text-sm font-semibold text-white hover:bg-[var(--accent)] mb-2">
          <Plus className="w-4 h-4" />
          New mail
        </button>
        
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-white/50">
          <MailIcon className="w-3 h-3" />
          cloudos@cloudos.app
        </div>
        
        {folders.map((folder) => (
          <button
            key={folder.name}
            className={`w-full h-[30px] flex items-center gap-2 px-2 rounded text-[13px] transition-colors ${
              activeFolder === folder.name 
                ? 'bg-[rgba(var(--accent-rgb),0.20)] text-white' 
                : 'text-white/80 hover:bg-white/6'
            }`}
            onClick={() => setActiveFolder(folder.name)}
          >
            <folder.icon className="w-4 h-4 text-white/60" />
            <span className="flex-1 text-left">{folder.name}</span>
            {folder.count > 0 && (
              <span className="text-xs font-semibold">({folder.count})</span>
            )}
          </button>
        ))}
      </div>
      
      {/* Email List */}
      <div 
        className="w-[300px] flex flex-col flex-shrink-0"
        style={{ borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        {/* Search */}
        <div className="p-2">
          <div 
            className="h-9 flex items-center gap-2 px-3 rounded"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Search className="w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search mail"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            className={`px-3 h-6 rounded-full text-xs ${
              filter === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-white/8 text-white/70'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 h-6 rounded-full text-xs ${
              filter === 'unread' ? 'bg-[var(--accent)] text-white' : 'bg-white/8 text-white/70'
            }`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
        </div>
        
        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => (
            <button
              key={email.id}
              className={`w-full p-3 text-left transition-colors ${
                selectedEmail.id === email.id 
                  ? 'bg-[rgba(var(--accent-rgb),0.15)] border-l-[3px] border-[var(--accent)]' 
                  : 'hover:bg-white/4 border-l-[3px] border-transparent'
              }`}
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
              onClick={() => setSelectedEmail(email)}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--accent)' }}
                >
                  {email.sender.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-[13px] truncate ${email.unread ? 'font-semibold text-white' : 'text-white/80'}`}>
                      {email.sender}
                    </span>
                    <span className="text-xs text-white/40 flex-shrink-0 ml-2">{email.date}</span>
                  </div>
                  <div className={`text-[13px] truncate ${email.unread ? 'text-white' : 'text-white/70'}`}>
                    {email.subject}
                  </div>
                  <div className="text-xs text-white/40 truncate">{email.preview}</div>
                </div>
                {email.unread && (
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div 
          className="h-9 flex items-center gap-1 px-2 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          {[Reply, ReplyAll, Forward, Trash2, Archive, Star, MoreHorizontal].map((Icon, i) => (
            <button 
              key={i}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/8"
            >
              <Icon className="w-4 h-4 text-white/70" />
            </button>
          ))}
        </div>
        
        {/* Email Header */}
        <div className="p-6 border-b border-white/6">
          <h1 className="text-xl font-semibold text-white">{selectedEmail.subject}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: 'var(--accent)' }}
            >
              {selectedEmail.sender.charAt(0)}
            </div>
            <div>
              <div className="text-sm text-white">
                {selectedEmail.sender} <span className="text-white/40">&lt;{selectedEmail.senderEmail}&gt;</span>
              </div>
              <div className="text-xs text-white/40">To: me</div>
            </div>
            <div className="ml-auto text-xs text-white/40">{selectedEmail.date}</div>
          </div>
        </div>
        
        {/* Email Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
            {selectedEmail.body}
          </div>
        </div>
      </div>
    </div>
  )
}
