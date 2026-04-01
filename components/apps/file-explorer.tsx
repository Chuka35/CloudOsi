'use client'

import { useState, useCallback } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUp, 
  Search,
  FolderOpen,
  FileText,
  Image,
  Music,
  Video,
  Download,
  Monitor,
  HardDrive,
  Code2,
  FileCheck,
  Plus,
  Scissors,
  Copy,
  Trash2,
  Share2,
  ArrowUpDown,
  LayoutGrid,
  Home,
  Folder,
} from 'lucide-react'

interface FileItem {
  name: string
  type: 'folder' | 'file'
  extension?: string
  size?: string
  modified?: string
}

interface FolderPath {
  name: string
  key: string
}

const FOLDER_CONTENTS: Record<string, FileItem[]> = {
  'root': [
    { name: 'Desktop', type: 'folder', modified: 'Today' },
    { name: 'Documents', type: 'folder', modified: 'Yesterday' },
    { name: 'Downloads', type: 'folder', modified: 'Today' },
    { name: 'Pictures', type: 'folder', modified: '2 days ago' },
    { name: 'Music', type: 'folder', modified: '1 week ago' },
    { name: 'Videos', type: 'folder', modified: '2 weeks ago' },
    { name: 'Projects', type: 'folder', modified: 'Yesterday' },
    { name: 'readme.txt', type: 'file', extension: 'txt', size: '2 KB', modified: '3 days ago' },
    { name: 'notes.txt', type: 'file', extension: 'txt', size: '1 KB', modified: 'Today' },
    { name: 'welcome.pdf', type: 'file', extension: 'pdf', size: '245 KB', modified: '1 month ago' },
  ],
  'Desktop': [
    { name: 'CloudOS Shortcut', type: 'file', extension: 'lnk', size: '1 KB', modified: 'Today' },
    { name: 'My Work', type: 'folder', modified: 'Yesterday' },
    { name: 'screenshot.png', type: 'file', extension: 'png', size: '1.2 MB', modified: 'Today' },
    { name: 'todo.txt', type: 'file', extension: 'txt', size: '3 KB', modified: 'Today' },
  ],
  'Downloads': [
    { name: 'cloudos-setup.exe', type: 'file', extension: 'exe', size: '48 MB', modified: 'Yesterday' },
    { name: 'report.pdf', type: 'file', extension: 'pdf', size: '2.3 MB', modified: '3 days ago' },
    { name: 'photo-backup', type: 'folder', modified: '1 week ago' },
    { name: 'song.mp3', type: 'file', extension: 'mp3', size: '5.4 MB', modified: '2 weeks ago' },
    { name: 'movie.mp4', type: 'file', extension: 'mp4', size: '1.1 GB', modified: '1 month ago' },
    { name: 'archive.zip', type: 'file', extension: 'zip', size: '234 MB', modified: '2 weeks ago' },
  ],
  'Documents': [
    { name: 'Work', type: 'folder', modified: 'Yesterday' },
    { name: 'Personal', type: 'folder', modified: '3 days ago' },
    { name: 'resume.docx', type: 'file', extension: 'docx', size: '42 KB', modified: '1 week ago' },
    { name: 'budget.xlsx', type: 'file', extension: 'xlsx', size: '18 KB', modified: '2 weeks ago' },
    { name: 'presentation.pptx', type: 'file', extension: 'pptx', size: '3.5 MB', modified: '1 month ago' },
    { name: 'notes.txt', type: 'file', extension: 'txt', size: '8 KB', modified: 'Today' },
    { name: 'ideas.md', type: 'file', extension: 'md', size: '2 KB', modified: 'Yesterday' },
  ],
  'Pictures': [
    { name: 'Wallpapers', type: 'folder', modified: '1 month ago' },
    { name: 'Vacation 2025', type: 'folder', modified: '2 months ago' },
    { name: 'screenshot1.png', type: 'file', extension: 'png', size: '856 KB', modified: 'Today' },
    { name: 'photo1.jpg', type: 'file', extension: 'jpg', size: '2.1 MB', modified: '1 week ago' },
    { name: 'photo2.jpg', type: 'file', extension: 'jpg', size: '1.8 MB', modified: '1 week ago' },
    { name: 'profile.png', type: 'file', extension: 'png', size: '234 KB', modified: '1 month ago' },
  ],
  'Music': [
    { name: 'Playlists', type: 'folder', modified: '1 week ago' },
    { name: 'song1.mp3', type: 'file', extension: 'mp3', size: '4.2 MB', modified: '2 weeks ago' },
    { name: 'song2.mp3', type: 'file', extension: 'mp3', size: '3.8 MB', modified: '2 weeks ago' },
    { name: 'album.flac', type: 'file', extension: 'flac', size: '48 MB', modified: '1 month ago' },
  ],
  'Videos': [
    { name: 'Clips', type: 'folder', modified: '1 month ago' },
    { name: 'tutorial.mp4', type: 'file', extension: 'mp4', size: '450 MB', modified: '2 months ago' },
    { name: 'demo.mp4', type: 'file', extension: 'mp4', size: '120 MB', modified: '3 months ago' },
  ],
  'Projects': [
    { name: 'CloudOS', type: 'folder', modified: 'Today' },
    { name: 'WebApp', type: 'folder', modified: 'Yesterday' },
    { name: 'README.md', type: 'file', extension: 'md', size: '4 KB', modified: 'Today' },
    { name: 'package.json', type: 'file', extension: 'json', size: '1 KB', modified: 'Yesterday' },
    { name: 'index.ts', type: 'file', extension: 'ts', size: '8 KB', modified: 'Today' },
  ],
  'My Work': [
    { name: 'project-brief.pdf', type: 'file', extension: 'pdf', size: '1.2 MB', modified: 'Yesterday' },
    { name: 'mockups.png', type: 'file', extension: 'png', size: '3.4 MB', modified: '2 days ago' },
  ],
  'Work': [
    { name: 'Q1 Report.pdf', type: 'file', extension: 'pdf', size: '2.1 MB', modified: '1 week ago' },
    { name: 'meetings.docx', type: 'file', extension: 'docx', size: '45 KB', modified: '2 days ago' },
    { name: 'contracts', type: 'folder', modified: '1 month ago' },
  ],
  'Personal': [
    { name: 'diary.txt', type: 'file', extension: 'txt', size: '12 KB', modified: 'Today' },
    { name: 'wishlist.txt', type: 'file', extension: 'txt', size: '2 KB', modified: '1 week ago' },
    { name: 'goals.docx', type: 'file', extension: 'docx', size: '15 KB', modified: '1 month ago' },
  ],
  'CloudOS': [
    { name: 'src', type: 'folder', modified: 'Today' },
    { name: 'public', type: 'folder', modified: 'Today' },
    { name: 'package.json', type: 'file', extension: 'json', size: '2 KB', modified: 'Today' },
    { name: 'README.md', type: 'file', extension: 'md', size: '4 KB', modified: 'Today' },
  ],
}

const quickAccessItems = [
  { name: 'Desktop', icon: Monitor, key: 'Desktop' },
  { name: 'Downloads', icon: Download, key: 'Downloads' },
  { name: 'Documents', icon: FileText, key: 'Documents' },
  { name: 'Pictures', icon: Image, key: 'Pictures' },
  { name: 'Music', icon: Music, key: 'Music' },
  { name: 'Videos', icon: Video, key: 'Videos' },
]

export function FileExplorerApp() {
  const [history, setHistory] = useState<FolderPath[]>([{ name: 'This PC', key: 'root' }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const currentFolder = history[historyIndex]
  const canGoBack = historyIndex > 0
  const canGoForward = historyIndex < history.length - 1

  const navigate = useCallback((name: string, key: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ name, key })
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setSelectedFile(null)
    setSearchQuery('')
  }, [history, historyIndex])

  const goBack = () => {
    if (canGoBack) {
      setHistoryIndex(prev => prev - 1)
      setSelectedFile(null)
    }
  }

  const goForward = () => {
    if (canGoForward) {
      setHistoryIndex(prev => prev + 1)
      setSelectedFile(null)
    }
  }

  const goUp = () => {
    if (historyIndex > 0) {
      goBack()
    }
  }

  const currentFiles = FOLDER_CONTENTS[currentFolder.key] || []

  const filteredFiles = currentFiles.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pathParts = history.slice(0, historyIndex + 1)

  const getFileIcon = (file: FileItem, small = false) => {
    const size = small ? 'w-5 h-5' : (viewMode === 'grid' ? 'w-12 h-12' : 'w-5 h-5')
    if (file.type === 'folder') {
      return <FolderOpen className={`${size} text-orange-400`} />
    }
    switch (file.extension) {
      case 'txt': return <FileText className={`${size} text-[var(--accent)]`} />
      case 'pdf': return <FileCheck className={`${size} text-[#E74856]`} />
      case 'mp3': case 'flac': return <Music className={`${size} text-[#6CCB5F]`} />
      case 'mp4': case 'mkv': return <Video className={`${size} text-[#C239B3]`} />
      case 'jpg': case 'png': case 'jpeg': case 'gif': return <Image className={`${size} text-[#C239B3]`} />
      case 'js': case 'ts': case 'tsx': case 'jsx': return <Code2 className={`${size} text-[#FCE100]`} />
      case 'json': case 'md': return <Code2 className={`${size} text-[var(--accent)]`} />
      case 'docx': return <FileText className={`${size} text-[var(--accent)]`} />
      case 'xlsx': return <FileText className={`${size} text-[#6CCB5F]`} />
      case 'pptx': return <FileText className={`${size} text-orange-500`} />
      case 'zip': return <Folder className={`${size} text-yellow-500`} />
      default: return <FileText className={`${size} text-white/50`} />
    }
  }

  const folderCount = filteredFiles.filter(f => f.type === 'folder').length
  const fileCount = filteredFiles.filter(f => f.type === 'file').length

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(24, 24, 24, 0.98)', color: 'rgba(255,255,255,0.88)' }}>
      {/* Navigation + Address Bar */}
      <div
        className="h-9 flex items-center gap-1 px-2 flex-shrink-0"
        style={{
          background: 'rgba(40, 40, 40, 0.90)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 disabled:opacity-30 disabled:cursor-default transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white/70" />
        </button>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 disabled:opacity-30 disabled:cursor-default transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-white/70" />
        </button>
        <button
          onClick={goUp}
          disabled={!canGoBack}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8 disabled:opacity-30 disabled:cursor-default transition-colors"
        >
          <ArrowUp className="w-4 h-4 text-white/70" />
        </button>

        <div className="w-px h-[18px] bg-white/10 mx-1" />

        {/* Breadcrumb Address Bar */}
        <div
          className="flex-1 h-[26px] flex items-center gap-0.5 px-2 rounded"
          style={{
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <Home className="w-3 h-3 text-white/40 mr-1 flex-shrink-0" />
          {pathParts.map((part, i) => (
            <span key={i} className="flex items-center">
              {i > 0 && <ChevronRight className="w-3 h-3 text-white/30 mx-0.5" />}
              <button
                onClick={() => {
                  setHistoryIndex(i)
                  setSelectedFile(null)
                }}
                className="text-[12px] text-white/75 hover:text-white transition-colors"
              >
                {part.name}
              </button>
            </span>
          ))}
        </div>

        {/* Search */}
        <div
          className="w-[180px] h-[26px] flex items-center gap-2 px-2 rounded"
          style={{
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
          }}
        >
          <Search className="w-3 h-3 text-white/50 flex-shrink-0" />
          <input
            type="text"
            placeholder={`Search ${currentFolder.name}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-white/40 outline-none"
          />
        </div>
      </div>

      {/* Action Toolbar */}
      <div
        className="h-8 flex items-center gap-1 px-2 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        {[
          { icon: Plus, label: 'New' },
          { icon: Scissors, label: 'Cut' },
          { icon: Copy, label: 'Copy' },
          { icon: Trash2, label: 'Delete' },
          { icon: Share2, label: 'Share' },
          { icon: ArrowUpDown, label: 'Sort' },
        ].map((btn) => (
          <button
            key={btn.label}
            className="h-6 px-2 flex items-center gap-1 rounded text-[11px] text-white/70 hover:bg-white/8 transition-colors"
          >
            <btn.icon className="w-3 h-3" />
            {btn.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="h-6 px-2 flex items-center gap-1 rounded text-[11px] text-white/70 hover:bg-white/8 transition-colors"
        >
          <LayoutGrid className="w-3 h-3" />
          {viewMode === 'grid' ? 'List' : 'Grid'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className="w-[190px] p-2 overflow-y-auto flex-shrink-0"
          style={{ borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <div className="px-2 py-1 text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1">
            Quick access
          </div>
          {quickAccessItems.map((item) => {
            const isActive = currentFolder.key === item.key
            return (
              <button
                key={item.name}
                className={`w-full h-[28px] flex items-center gap-2 px-2 rounded text-[12px] transition-colors ${
                  isActive
                    ? 'bg-[rgba(var(--accent-rgb),0.20)] text-white'
                    : 'text-white/75 hover:bg-white/6'
                }`}
                onClick={() => navigate(item.name, item.key)}
              >
                <item.icon className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                {item.name}
              </button>
            )
          })}

          <div className="mt-4 px-2 py-1 text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1">
            This PC
          </div>
          <button
            onClick={() => navigate('This PC', 'root')}
            className={`w-full px-2 py-1.5 rounded text-[12px] hover:bg-white/6 transition-colors ${
              currentFolder.key === 'root' ? 'bg-[rgba(var(--accent-rgb),0.20)] text-white' : 'text-white/75'
            }`}
          >
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-white/60 flex-shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <div className="truncate">Local Disk (C:)</div>
                <div className="mt-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <div className="h-full w-[30%] bg-[var(--accent)]" />
                </div>
                <div className="text-[10px] text-white/35 mt-0.5">350 GB free of 500 GB</div>
              </div>
            </div>
          </button>
        </div>

        {/* File Area */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}>
          {filteredFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/30 gap-3">
              <FolderOpen className="w-16 h-16 text-white/15" />
              <span className="text-sm">{searchQuery ? 'No files match your search' : 'This folder is empty'}</span>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-3 grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
              {filteredFiles.map((file) => (
                <button
                  key={file.name}
                  className={`p-2 rounded flex flex-col items-center text-center transition-colors ${
                    selectedFile === file.name
                      ? 'bg-[rgba(var(--accent-rgb),0.22)] border border-[var(--accent)]'
                      : 'hover:bg-white/6 border border-transparent'
                  }`}
                  onClick={() => setSelectedFile(file.name)}
                  onDoubleClick={() => {
                    if (file.type === 'folder') {
                      navigate(file.name, file.name)
                    }
                  }}
                >
                  {getFileIcon(file)}
                  <span className="mt-1 text-[11px] text-white/70 line-clamp-2 w-full leading-tight">{file.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="text-left px-4 py-1.5 text-white/40 font-medium">Name</th>
                  <th className="text-left px-4 py-1.5 text-white/40 font-medium">Modified</th>
                  <th className="text-left px-4 py-1.5 text-white/40 font-medium">Type</th>
                  <th className="text-left px-4 py-1.5 text-white/40 font-medium">Size</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.name}
                    className={`cursor-pointer transition-colors ${
                      selectedFile === file.name ? 'bg-[rgba(var(--accent-rgb),0.18)]' : 'hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedFile(file.name)}
                    onDoubleClick={() => {
                      if (file.type === 'folder') navigate(file.name, file.name)
                    }}
                  >
                    <td className="px-4 py-1.5">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file, true)}
                        <span className="text-white/80">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-1.5 text-white/40">{file.modified || '—'}</td>
                    <td className="px-4 py-1.5 text-white/40">
                      {file.type === 'folder' ? 'Folder' : (file.extension?.toUpperCase() + ' File') || 'File'}
                    </td>
                    <td className="px-4 py-1.5 text-white/40">{file.size || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div
        className="h-6 flex items-center justify-between px-3 text-[11px] text-white/35 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <span>{folderCount} folders, {fileCount} files</span>
        <span>{selectedFile ? `${selectedFile} selected` : ''}</span>
      </div>
    </div>
  )
}
