"use client"

import { useState } from "react"
import { Cloud, Users, Clock, Image, Trash2, FolderOpen, FileText, Upload, Plus, Grid, List, ChevronDown, Check, RefreshCw, MoreHorizontal } from "lucide-react"

interface FileItem {
  id: number
  name: string
  type: "folder" | "file"
  size?: string
  modified: string
  syncStatus: "synced" | "syncing" | "cloud"
}

const files: FileItem[] = [
  { id: 1, name: "Documents", type: "folder", modified: "Today", syncStatus: "synced" },
  { id: 2, name: "Pictures", type: "folder", modified: "Today", syncStatus: "synced" },
  { id: 3, name: "Music", type: "folder", modified: "Yesterday", syncStatus: "synced" },
  { id: 4, name: "Desktop Backup", type: "folder", modified: "Mar 15", syncStatus: "syncing" },
  { id: 5, name: "Projects", type: "folder", modified: "Mar 10", syncStatus: "synced" },
  { id: 6, name: "Getting Started.pdf", type: "file", size: "2.3 MB", modified: "Mar 1", syncStatus: "synced" },
  { id: 7, name: "Welcome to OneDrive.docx", type: "file", size: "156 KB", modified: "Mar 1", syncStatus: "cloud" },
]

const navItems = [
  { icon: Cloud, label: "My Files", active: true },
  { icon: Users, label: "Shared" },
  { icon: Clock, label: "Recent" },
  { icon: Image, label: "Photos" },
  { icon: Trash2, label: "Recycle Bin" },
]

export function OneDriveApp() {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeNav, setActiveNav] = useState("My Files")

  const toggleSelect = (id: number) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const getSyncIcon = (status: string) => {
    switch (status) {
      case "synced": return <Check className="w-3 h-3 text-[#6CCB5F]" />
      case "syncing": return <RefreshCw className="w-3 h-3 text-[var(--accent)] animate-spin" />
      case "cloud": return <Cloud className="w-3 h-3 text-white/40" />
    }
  }

  return (
    <div className="h-full flex bg-[#1e1e1e] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 flex flex-col bg-[#252525] border-r border-white/6">
        <div className="p-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-[var(--accent)] hover:bg-[var(--accent)] rounded-lg text-sm font-medium">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeNav === item.label
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[var(--accent)]" : "text-white/60"}`} />
                <span className={`text-sm ${isActive ? "font-medium" : "text-white/70"}`}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Storage */}
        <div className="p-4 border-t border-white/6">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-medium">OneDrive</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="h-full w-[46%] bg-[var(--accent)] rounded-full" />
          </div>
          <span className="text-xs text-white/50">2.3 GB used of 5 GB</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-white/6">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded text-sm">
              <Plus className="w-4 h-4" />
              New
              <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded text-sm">
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded text-sm">
              Sort
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-white/10" : "hover:bg-white/10"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-white/10" : "hover:bg-white/10"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="px-4 py-2 border-b border-white/6">
          <span className="text-sm font-medium">My Files</span>
        </div>

        {/* Files Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-5 gap-4">
              {files.map(file => (
                <button
                  key={file.id}
                  onClick={() => toggleSelect(file.id)}
                  className={`flex flex-col items-center p-3 rounded-lg hover:bg-white/5 ${
                    selectedFiles.includes(file.id) ? "bg-white/10 ring-1 ring-[var(--accent)]" : ""
                  }`}
                >
                  <div className="relative">
                    {file.type === "folder" ? (
                      <FolderOpen className="w-12 h-12 text-[#FFA500]" />
                    ) : (
                      <FileText className="w-12 h-12 text-[var(--accent)]" />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#252525] rounded-full flex items-center justify-center">
                      {getSyncIcon(file.syncStatus)}
                    </div>
                  </div>
                  <span className="text-xs mt-2 text-center truncate w-full">{file.name}</span>
                  <span className="text-[10px] text-white/40">{file.modified}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="flex items-center px-3 py-2 text-xs text-white/50 border-b border-white/10">
                <div className="flex-1">Name</div>
                <div className="w-24">Modified</div>
                <div className="w-20">Size</div>
                <div className="w-8" />
              </div>
              {files.map(file => (
                <button
                  key={file.id}
                  onClick={() => toggleSelect(file.id)}
                  className={`w-full flex items-center px-3 py-2 rounded hover:bg-white/5 ${
                    selectedFiles.includes(file.id) ? "bg-white/10" : ""
                  }`}
                >
                  <div className="flex-1 flex items-center gap-3">
                    {file.type === "folder" ? (
                      <FolderOpen className="w-5 h-5 text-[#FFA500]" />
                    ) : (
                      <FileText className="w-5 h-5 text-[var(--accent)]" />
                    )}
                    <span className="text-sm">{file.name}</span>
                    {getSyncIcon(file.syncStatus)}
                  </div>
                  <div className="w-24 text-xs text-white/50">{file.modified}</div>
                  <div className="w-20 text-xs text-white/50">{file.size || "-"}</div>
                  <div className="w-8">
                    <MoreHorizontal className="w-4 h-4 text-white/40" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Panel */}
      {selectedFiles.length === 1 && (
        <div className="w-52 bg-[#252525] border-l border-white/6 p-4">
          <div className="flex flex-col items-center mb-4">
            {files.find(f => f.id === selectedFiles[0])?.type === "folder" ? (
              <FolderOpen className="w-16 h-16 text-[#FFA500] mb-2" />
            ) : (
              <FileText className="w-16 h-16 text-[var(--accent)] mb-2" />
            )}
            <span className="text-sm font-medium text-center">
              {files.find(f => f.id === selectedFiles[0])?.name}
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-white/50">Size</span>
              <p>{files.find(f => f.id === selectedFiles[0])?.size || "—"}</p>
            </div>
            <div>
              <span className="text-white/50">Modified</span>
              <p>{files.find(f => f.id === selectedFiles[0])?.modified}</p>
            </div>
            <div>
              <span className="text-white/50">Shared with</span>
              <div className="flex -space-x-1 mt-1">
                <div className="w-6 h-6 rounded-full bg-[var(--accent)] border-2 border-[#252525]" />
                <div className="w-6 h-6 rounded-full bg-[#6CCB5F] border-2 border-[#252525]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
