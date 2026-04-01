"use client"

import { useState } from "react"
import { 
  Grid2x2, MessageSquare, Users, CalendarDays, Video, FolderOpen, MoreHorizontal, 
  Settings, Plus, Search, Phone, MoreVertical, Send, Smile, Paperclip, AtSign
} from "lucide-react"

interface Chat {
  id: number
  name: string
  avatar: string
  color: string
  lastMessage: string
  time: string
  unread?: number
  isGroup?: boolean
  isBot?: boolean
}

interface Message {
  id: number
  sender: string
  content: string
  time: string
  isMe?: boolean
}

const chats: Chat[] = [
  { id: 1, name: "CLOUDIA AI", avatar: "C", color: "#7B2FBE", lastMessage: "How can I help you today?", time: "Now", isBot: true },
  { id: 2, name: "ElevenHacks Team", avatar: "E", color: "#0078D4", lastMessage: "Meeting at 3pm", time: "2m", isGroup: true, unread: 3 },
  { id: 3, name: "Cloudflare Support", avatar: "CS", color: "#F38020", lastMessage: "Your ticket has been resolved", time: "15m" },
  { id: 4, name: "Design Review", avatar: "D", color: "#E74856", lastMessage: "New mockups are ready!", time: "1h", isGroup: true },
  { id: 5, name: "Alex Chen", avatar: "A", color: "#6CCB5F", lastMessage: "Thanks for the help!", time: "3h" },
  { id: 6, name: "Project Alpha", avatar: "P", color: "#5558AF", lastMessage: "Sprint planning tomorrow", time: "5h", isGroup: true, unread: 1 },
]

const railItems = [
  { icon: Grid2x2, label: "Activity" },
  { icon: MessageSquare, label: "Chat" },
  { icon: Users, label: "Teams" },
  { icon: CalendarDays, label: "Calendar" },
  { icon: Video, label: "Calls" },
  { icon: FolderOpen, label: "Files" },
  { icon: MoreHorizontal, label: "More" },
]

export function TeamsApp() {
  const [activeRail, setActiveRail] = useState("Chat")
  const [activeChat, setActiveChat] = useState<Chat>(chats[0])
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "CLOUDIA AI", content: "Hello! I'm CLOUDIA, your AI assistant. How can I help you today?", time: "10:30 AM" },
    { id: 2, sender: "Me", content: "Hi! Can you help me with the project?", time: "10:31 AM", isMe: true },
    { id: 3, sender: "CLOUDIA AI", content: "Of course! I'd be happy to help with your project. What do you need assistance with?", time: "10:31 AM" },
  ])

  const sendMessage = () => {
    if (!messageInput.trim()) return
    const newMessage: Message = {
      id: Date.now(),
      sender: "Me",
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }
    setMessages([...messages, newMessage])
    setMessageInput("")
  }

  return (
    <div className="h-full flex bg-[#1b1b1b] text-white overflow-hidden">
      {/* Far Left Rail */}
      <div className="w-16 flex flex-col items-center py-2 bg-[#242424] border-r border-white/6">
        {railItems.map((item, i) => {
          const Icon = item.icon
          const isActive = activeRail === item.label
          return (
            <button
              key={item.label}
              onClick={() => setActiveRail(item.label)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg mb-1 ${
                isActive ? "bg-[#5558AF]/30" : "hover:bg-white/10"
              }`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/60"}`} />
            </button>
          )
        })}
        <div className="flex-1" />
        <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 mb-1">
          <Settings className="w-5 h-5 text-white/60" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#5558AF] flex items-center justify-center text-sm font-medium">
          U
        </div>
      </div>

      {/* Left Panel - Chat List */}
      <div className="w-60 flex flex-col bg-[#1f1f1f] border-r border-white/6">
        <div className="p-3 flex items-center justify-between border-b border-white/6">
          <h2 className="font-semibold">Chat</h2>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5558AF] hover:bg-[#6669BD]">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 ${
                activeChat.id === chat.id ? "bg-white/10" : ""
              }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                style={{ backgroundColor: chat.color }}
              >
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className={`text-sm truncate ${chat.unread ? "font-semibold" : ""}`}>
                    {chat.name}
                  </span>
                  <span className="text-[10px] text-white/40">{chat.time}</span>
                </div>
                <p className="text-xs text-white/50 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread && (
                <div className="w-5 h-5 rounded-full bg-[#5558AF] flex items-center justify-center text-[10px]">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: activeChat.color }}
            >
              {activeChat.avatar}
            </div>
            <div>
              <h3 className="font-medium text-sm">{activeChat.name}</h3>
              <span className="text-xs text-white/50">
                {activeChat.isBot ? "AI Assistant" : activeChat.isGroup ? "Group" : "Online"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/10">
              <Video className="w-5 h-5 text-white/60" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/10">
              <Phone className="w-5 h-5 text-white/60" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/10">
              <Search className="w-5 h-5 text-white/60" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/10">
              <MoreVertical className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.isMe ? "flex-row-reverse" : ""}`}>
              {!msg.isMe && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                  style={{ backgroundColor: activeChat.color }}
                >
                  {activeChat.avatar}
                </div>
              )}
              <div className={`max-w-[70%] ${msg.isMe ? "text-right" : ""}`}>
                {!msg.isMe && (
                  <span className="text-xs text-white/50 mb-1 block">{msg.sender}</span>
                )}
                <div
                  className={`rounded-lg px-4 py-2 inline-block text-left ${
                    msg.isMe ? "bg-[#5558AF]" : "bg-white/10"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <span className="text-[10px] text-white/40 mt-1 block">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/6">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
            <div className="flex items-center gap-1 px-2 border-r border-white/10">
              <button className="p-1.5 hover:bg-white/10 rounded">
                <AtSign className="w-4 h-4 text-white/60" />
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <Smile className="w-4 h-4 text-white/60" />
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded">
                <Paperclip className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!messageInput.trim()}
              className="w-8 h-8 flex items-center justify-center rounded bg-[#5558AF] hover:bg-[#6669BD] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
