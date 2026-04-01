"use client"

import { useState } from "react"
import { Camera, Edit, MoreVertical, Search, Smile, Paperclip, Mic, Send, Check, Phone, Video } from "lucide-react"

interface Chat {
  id: number
  name: string
  avatar: string
  color: string
  lastMessage: string
  time: string
  unread?: number
}

interface Message {
  id: number
  content: string
  time: string
  isMe: boolean
  status?: "sent" | "delivered" | "read"
}

const chats: Chat[] = [
  { id: 1, name: "Mom", avatar: "M", color: "#E91E63", lastMessage: "Okay I'll call you later", time: "10:30 AM", unread: 2 },
  { id: 2, name: "Work Group", avatar: "W", color: "#2196F3", lastMessage: "Meeting at 3pm", time: "9:45 AM" },
  { id: 3, name: "CLOUDIA AI", avatar: "C", color: "#7B2FBE", lastMessage: "How can I help?", time: "9:30 AM" },
  { id: 4, name: "John", avatar: "J", color: "#4CAF50", lastMessage: "Hey! Are you free?", time: "Yesterday", unread: 1 },
  { id: 5, name: "Design Team", avatar: "D", color: "#FF9800", lastMessage: "New mockups ready", time: "Yesterday" },
  { id: 6, name: "Alice", avatar: "A", color: "#9C27B0", lastMessage: "Thanks for the help!", time: "Yesterday" },
  { id: 7, name: "News Channel", avatar: "N", color: "#607D8B", lastMessage: "Latest updates...", time: "Mar 27" },
  { id: 8, name: "Dad", avatar: "D", color: "#795548", lastMessage: "Call me when you can", time: "Mar 26" },
]

const initialMessages: Message[] = [
  { id: 1, content: "Hey! How are you?", time: "9:00 AM", isMe: false },
  { id: 2, content: "I'm good! Just working on CloudOS", time: "9:05 AM", isMe: true, status: "read" },
  { id: 3, content: "That sounds interesting! What's CloudOS?", time: "9:10 AM", isMe: false },
  { id: 4, content: "It's a full operating system that runs in your browser!", time: "9:15 AM", isMe: true, status: "read" },
  { id: 5, content: "Wow, that's amazing! Can I try it?", time: "9:20 AM", isMe: false },
  { id: 6, content: "Of course! Just go to cloudos.app", time: "9:25 AM", isMe: true, status: "delivered" },
  { id: 7, content: "Okay I'll call you later", time: "10:30 AM", isMe: false },
]

export function WhatsAppApp() {
  const [activeChat, setActiveChat] = useState<Chat>(chats[0])
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const sendMessage = () => {
    if (!inputValue.trim()) return
    const newMessage: Message = {
      id: Date.now(),
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: "sent",
    }
    setMessages([...messages, newMessage])
    setInputValue("")
  }

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex bg-[#111b21] text-white overflow-hidden">
      {/* Left Panel - Chat List */}
      <div className="w-[340px] flex flex-col bg-[#111b21] border-r border-[#222d34]">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 bg-[#202c33]">
          <span className="text-xl font-semibold">WhatsApp</span>
          <div className="flex items-center gap-4">
            <button className="text-[#aebac1] hover:text-white">
              <Camera className="w-5 h-5" />
            </button>
            <button className="text-[#aebac1] hover:text-white">
              <Edit className="w-5 h-5" />
            </button>
            <button className="text-[#aebac1] hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-2">
          <div className="flex items-center gap-3 bg-[#202c33] rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-[#8696a0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start new chat"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#8696a0]"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#202c33] ${
                activeChat.id === chat.id ? "bg-[#2a3942]" : ""
              }`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium flex-shrink-0"
                style={{ backgroundColor: chat.color }}
              >
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0 text-left border-b border-[#222d34] pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{chat.name}</span>
                  <span className={`text-xs ${chat.unread ? "text-[#25D366]" : "text-[#8696a0]"}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-sm text-[#8696a0] truncate">{chat.lastMessage}</p>
                  {chat.unread && (
                    <span className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-[11px] text-black font-medium">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 flex items-center justify-between px-4 bg-[#202c33]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-medium"
              style={{ backgroundColor: activeChat.color }}
            >
              {activeChat.avatar}
            </div>
            <div>
              <h3 className="font-medium">{activeChat.name}</h3>
              <span className="text-xs text-[#8696a0]">online</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#aebac1] hover:text-white">
              <Video className="w-5 h-5" />
            </button>
            <button className="text-[#aebac1] hover:text-white">
              <Phone className="w-5 h-5" />
            </button>
            <button className="text-[#aebac1] hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-[#aebac1] hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-2"
          style={{ background: "#0b141a" }}
        >
          {/* Date Separator */}
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 bg-[#182229] rounded-lg text-xs text-[#8696a0]">TODAY</span>
          </div>

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[65%] px-3 py-2 rounded-lg ${
                  msg.isMe
                    ? "bg-[#005c4b] rounded-tr-none"
                    : "bg-[#202c33] rounded-tl-none"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] text-[#8696a0]">{msg.time}</span>
                  {msg.isMe && (
                    <div className="flex">
                      <Check className={`w-3 h-3 ${msg.status === "read" ? "text-[#53bdeb]" : "text-[#8696a0]"}`} />
                      {(msg.status === "delivered" || msg.status === "read") && (
                        <Check className={`w-3 h-3 -ml-1.5 ${msg.status === "read" ? "text-[#53bdeb]" : "text-[#8696a0]"}`} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="h-[62px] flex items-center gap-2 px-4 bg-[#202c33]">
          <button className="p-2 text-[#8696a0] hover:text-white">
            <Smile className="w-6 h-6" />
          </button>
          <button className="p-2 text-[#8696a0] hover:text-white">
            <Paperclip className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message"
              className="w-full bg-[#2a3942] rounded-lg px-4 py-2.5 text-sm outline-none placeholder:text-[#8696a0]"
            />
          </div>
          <button
            onClick={inputValue ? sendMessage : undefined}
            className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#2ee67a]"
          >
            {inputValue ? (
              <Send className="w-5 h-5 text-[#111b21]" />
            ) : (
              <Mic className="w-5 h-5 text-[#111b21]" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
