"use client"

import { useState } from "react"
import { 
  Inbox, Send, FileText, Trash2, Archive, AlertCircle, Plus, Search, 
  ChevronDown, ChevronRight, Star, Paperclip, MoreHorizontal, Reply, ReplyAll, Forward
} from "lucide-react"

interface Email {
  id: number
  from: string
  fromEmail: string
  subject: string
  preview: string
  body: string
  time: string
  read: boolean
  starred: boolean
  hasAttachment?: boolean
}

const emails: Email[] = [
  {
    id: 1,
    from: "CloudOS Team",
    fromEmail: "team@cloudos.app",
    subject: "Welcome to CloudOS!",
    preview: "Thank you for joining CloudOS. Your cloud computer is ready...",
    body: "Thank you for joining CloudOS!\n\nYour cloud computer is ready to use. Here are some things you can do:\n\n• Open File Explorer to manage your files\n• Use Microsoft Word, Excel, and PowerPoint\n• Chat with CLOUDIA, your AI assistant\n• Browse the web with Edge or Chrome\n\nEnjoy your new cloud computer!\n\nThe CloudOS Team",
    time: "10:30 AM",
    read: false,
    starred: true,
  },
  {
    id: 2,
    from: "Security Alert",
    fromEmail: "security@cloudos.app",
    subject: "New sign-in to your account",
    preview: "A new device was used to sign in to your CloudOS account...",
    body: "A new device was used to sign in to your CloudOS account.\n\nDevice: Chrome on Windows\nLocation: San Francisco, CA\nTime: March 29, 2024 at 10:15 AM\n\nIf this was you, no action is needed. If you don't recognize this activity, please reset your password immediately.",
    time: "10:15 AM",
    read: false,
    starred: false,
    hasAttachment: true,
  },
  {
    id: 3,
    from: "Cloudflare",
    fromEmail: "noreply@cloudflare.com",
    subject: "Your weekly analytics report",
    preview: "Here's your CloudOS usage summary for the past week...",
    body: "Your CloudOS Weekly Report\n\nTotal sessions: 47\nFiles created: 12\nApps used: 8\nStorage used: 2.3 GB\n\nTop apps this week:\n1. File Explorer\n2. Microsoft Word\n3. Edge Browser",
    time: "Yesterday",
    read: true,
    starred: false,
  },
  {
    id: 4,
    from: "ElevenLabs",
    fromEmail: "hello@elevenlabs.io",
    subject: "Voice AI features now available",
    preview: "We're excited to announce new voice features in CLOUDIA...",
    body: "New Voice Features in CLOUDIA!\n\nWe've partnered with CloudOS to bring you:\n\n• Natural voice conversations\n• Text-to-speech for documents\n• Voice commands for apps\n\nTry saying 'Hey CLOUDIA, open my documents' to get started!",
    time: "Yesterday",
    read: true,
    starred: true,
  },
]

const folders = [
  { icon: Inbox, label: "Inbox", count: 2, expanded: true, children: [
    { label: "Focused", count: 2 },
    { label: "Other", count: 0 },
  ]},
  { icon: FileText, label: "Drafts", count: 1 },
  { icon: Send, label: "Sent" },
  { icon: Trash2, label: "Deleted Items" },
  { icon: Archive, label: "Archive" },
  { icon: AlertCircle, label: "Junk Email", count: 2 },
]

export function OutlookApp() {
  const [selectedEmail, setSelectedEmail] = useState<Email>(emails[0])
  const [activeFolder, setActiveFolder] = useState("Inbox")
  const [showCompose, setShowCompose] = useState(false)
  const [filter, setFilter] = useState("All")

  return (
    <div className="h-full flex bg-[#1e1e1e] text-white overflow-hidden">
      {/* Left Sidebar - Folders */}
      <div className="w-56 flex flex-col bg-[#252525] border-r border-white/6">
        <div className="p-3">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent)] rounded text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Email
          </button>
        </div>

        {/* Folders */}
        <nav className="flex-1 overflow-y-auto px-2">
          {folders.map(folder => {
            const Icon = folder.icon
            const isActive = activeFolder === folder.label
            return (
              <div key={folder.label}>
                <button
                  onClick={() => setActiveFolder(folder.label)}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded ${
                    isActive ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  {folder.children ? (
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  ) : (
                    <div className="w-3" />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? "text-[var(--accent)]" : "text-white/60"}`} />
                  <span className="flex-1 text-sm text-left">{folder.label}</span>
                  {folder.count && (
                    <span className="text-xs text-[var(--accent)] font-medium">{folder.count}</span>
                  )}
                </button>
                {folder.children && folder.expanded && (
                  <div className="ml-6">
                    {folder.children.map(child => (
                      <button
                        key={child.label}
                        className="w-full flex items-center gap-3 px-3 py-1 hover:bg-white/5 rounded text-sm text-white/70"
                      >
                        <span className="flex-1 text-left">{child.label}</span>
                        {child.count > 0 && (
                          <span className="text-xs text-[var(--accent)]">{child.count}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Center - Email List */}
      <div className="w-80 flex flex-col bg-[#1f1f1f] border-r border-white/6">
        {/* Filters */}
        <div className="p-3 border-b border-white/6">
          <div className="flex gap-2">
            {["All", "Unread", "Flagged", "Attachments"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full ${
                  filter === f ? "bg-[var(--accent)] text-white" : "bg-white/10 text-white/60 hover:bg-white/15"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 bg-white/10 rounded px-3 py-2">
            <Search className="w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search mail"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {emails.map(email => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full text-left px-3 py-3 border-b border-white/6 ${
                selectedEmail.id === email.id ? "bg-white/10" : "hover:bg-white/5"
              } ${!email.read ? "border-l-2 border-l-[var(--accent)]" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  {email.from[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm truncate ${!email.read ? "font-semibold" : ""}`}>
                      {email.from}
                    </span>
                    <span className="text-[10px] text-white/40 flex-shrink-0">{email.time}</span>
                  </div>
                  <p className={`text-sm truncate ${!email.read ? "font-medium" : "text-white/70"}`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-white/50 truncate">{email.preview}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 pl-11">
                {email.starred && <Star className="w-3 h-3 text-[#FCE100] fill-[#FCE100]" />}
                {email.hasAttachment && <Paperclip className="w-3 h-3 text-white/40" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right - Reading Pane */}
      <div className="flex-1 flex flex-col">
        {showCompose ? (
          /* Compose View */
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">New Message</h2>
              <button onClick={() => setShowCompose(false)} className="text-white/60 hover:text-white">
                ×
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="To"
                className="w-full bg-white/10 rounded px-3 py-2 text-sm outline-none"
              />
              <input
                type="text"
                placeholder="Cc"
                className="w-full bg-white/10 rounded px-3 py-2 text-sm outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full bg-white/10 rounded px-3 py-2 text-sm outline-none"
              />
            </div>
            <textarea
              placeholder="Write your message..."
              className="flex-1 bg-white/10 rounded p-3 text-sm outline-none resize-none"
            />
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 bg-[var(--accent)] hover:bg-[var(--accent)] rounded text-sm font-medium">
                Send
              </button>
            </div>
          </div>
        ) : (
          /* Reading View */
          <>
            <div className="p-4 border-b border-white/6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{selectedEmail.subject}</h2>
                <button>
                  <MoreHorizontal className="w-5 h-5 text-white/60" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-sm font-medium">
                  {selectedEmail.from[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedEmail.from}</span>
                    <span className="text-xs text-white/50">&lt;{selectedEmail.fromEmail}&gt;</span>
                  </div>
                  <span className="text-xs text-white/50">To: me</span>
                </div>
                <span className="text-sm text-white/50">{selectedEmail.time}</span>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {selectedEmail.body}
              </div>
            </div>
            <div className="p-4 border-t border-white/6">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded text-sm">
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded text-sm">
                  <ReplyAll className="w-4 h-4" />
                  Reply All
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded text-sm">
                  <Forward className="w-4 h-4" />
                  Forward
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
