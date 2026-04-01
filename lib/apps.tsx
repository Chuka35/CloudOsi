"use client"

import { 
  FolderOpen, 
  Globe, 
  FileText, 
  Calculator as CalcIcon, 
  TerminalSquare, 
  Settings as SettingsIcon,
  Activity,
  Paintbrush,
  Image,
  CalendarDays,
  Mail,
  Play,
  Music,
  Cloud,
  Clock,
  ShoppingBag,
  Gamepad2,
  Shield,
  HardDrive,
  Info,
  Scissors,
  Mic,
  StickyNote,
  FileEdit,
  Table,
  Presentation,
  Users,
  Inbox,
  MessageCircle,
  MapPin,
  type LucideIcon
} from "lucide-react"
import { CloudLogo } from "@/components/cloud-logo"

// App components
import { FileExplorerApp } from "@/components/apps/file-explorer"
import { NotepadApp } from "@/components/apps/notepad"
import { CalculatorApp } from "@/components/apps/calculator"
import { TerminalApp } from "@/components/apps/terminal"
import { SettingsApp } from "@/components/apps/settings"
import { TaskManagerApp } from "@/components/apps/task-manager"
import { PaintApp } from "@/components/apps/paint"
import { CalendarApp } from "@/components/apps/calendar"
import { MailApp } from "@/components/apps/mail"
import { PhotosApp } from "@/components/apps/photos"
import { BrowserApp } from "@/components/apps/browser"
import { WeatherApp } from "@/components/apps/weather"
import { MusicApp } from "@/components/apps/music"
import { VideoPlayerApp } from "@/components/apps/video-player"
import { ClockApp } from "@/components/apps/clock"
import { StoreApp } from "@/components/apps/store"
import { GamesApp } from "@/components/apps/games"

// New app components
import { WordApp } from "@/components/apps/word"
import { ExcelApp } from "@/components/apps/excel"
import { PowerPointApp } from "@/components/apps/powerpoint"
import { ChromeApp } from "@/components/apps/chrome"
import { TeamsApp } from "@/components/apps/teams"
import { OneDriveApp } from "@/components/apps/onedrive"
import { OutlookApp } from "@/components/apps/outlook"
import { SpotifyApp } from "@/components/apps/spotify"
import { WhatsAppApp } from "@/components/apps/whatsapp"
import { MapsApp } from "@/components/apps/maps"
import { CloudiaApp } from "@/components/apps/cloudia"

// CloudiaIcon wraps CloudLogo with a LucideIcon-compatible API
const CloudiaIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <CloudLogo size={typeof size === 'number' ? size : 24} className={className} />
)

export interface AppConfig {
  id: string
  name: string
  icon: React.ElementType
  color: string
  gradient: string
  defaultWidth: number
  defaultHeight: number
  minWidth?: number
  minHeight?: number
  isResizable?: boolean
  isSingleton?: boolean
  showOnDesktop?: boolean
  pinnedToTaskbar?: boolean
  pinnedToStart?: boolean
  component: React.ComponentType
}

export const apps: AppConfig[] = [
  // Core Windows Apps
  {
    id: "file-explorer",
    name: "File Explorer",
    icon: FolderOpen,
    color: "#FFA500",
    gradient: "linear-gradient(135deg, #FF8C00, #FFA500, #FFB733)",
    defaultWidth: 760,
    defaultHeight: 500,
    showOnDesktop: true,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: FileExplorerApp,
  },
  {
    id: "browser",
    name: "Microsoft Edge",
    icon: Globe,
    color: "#0078D4",
    gradient: "linear-gradient(135deg, #0052CC, #0078D4, #00BCF2)",
    defaultWidth: 860,
    defaultHeight: 560,
    showOnDesktop: true,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: BrowserApp,
  },
  {
    id: "notepad",
    name: "Notepad",
    icon: FileText,
    color: "#0078D4",
    gradient: "linear-gradient(135deg, #2B88D8, #0078D4)",
    defaultWidth: 600,
    defaultHeight: 440,
    showOnDesktop: true,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: NotepadApp,
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: CalcIcon,
    color: "#6CCB5F",
    gradient: "linear-gradient(135deg, #107C10, #6CCB5F)",
    defaultWidth: 320,
    defaultHeight: 500,
    minWidth: 320,
    minHeight: 500,
    isResizable: false,
    showOnDesktop: true,
    pinnedToStart: true,
    component: CalculatorApp,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: TerminalSquare,
    color: "#4472C4",
    gradient: "linear-gradient(135deg, #012456, #2359BA, #4472C4)",
    defaultWidth: 680,
    defaultHeight: 440,
    showOnDesktop: true,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: TerminalApp,
  },
  {
    id: "settings",
    name: "Settings",
    icon: SettingsIcon,
    color: "#AAAAAA",
    gradient: "linear-gradient(135deg, #767676, #AAAAAA)",
    defaultWidth: 820,
    defaultHeight: 560,
    isSingleton: true,
    pinnedToStart: true,
    component: SettingsApp,
  },
  {
    id: "task-manager",
    name: "Task Manager",
    icon: Activity,
    color: "#6CCB5F",
    gradient: "linear-gradient(135deg, #0F7B0F, #6CCB5F)",
    defaultWidth: 760,
    defaultHeight: 520,
    isSingleton: true,
    pinnedToStart: true,
    component: TaskManagerApp,
  },
  {
    id: "paint",
    name: "Paint",
    icon: Paintbrush,
    color: "#67C4CD",
    gradient: "linear-gradient(135deg, #038387, #67C4CD)",
    defaultWidth: 760,
    defaultHeight: 520,
    pinnedToStart: true,
    component: PaintApp,
  },
  {
    id: "photos",
    name: "Photos",
    icon: Image,
    color: "#FF6B6B",
    gradient: "linear-gradient(135deg, #E74856, #FF6B6B)",
    defaultWidth: 760,
    defaultHeight: 520,
    pinnedToStart: true,
    component: PhotosApp,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: CalendarDays,
    color: "#0078D4",
    gradient: "linear-gradient(135deg, #0078D4, #004E9A)",
    defaultWidth: 680,
    defaultHeight: 480,
    pinnedToStart: true,
    component: CalendarApp,
  },
  {
    id: "mail",
    name: "Mail",
    icon: Mail,
    color: "#28C8FF",
    gradient: "linear-gradient(135deg, #0078D4, #28C8FF)",
    defaultWidth: 760,
    defaultHeight: 500,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: MailApp,
  },
  {
    id: "video-player",
    name: "Media Player",
    icon: Play,
    color: "#5EC75E",
    gradient: "linear-gradient(135deg, #107C10, #5EC75E)",
    defaultWidth: 760,
    defaultHeight: 500,
    pinnedToStart: true,
    component: VideoPlayerApp,
  },
  {
    id: "music",
    name: "Groove Music",
    icon: Music,
    color: "#F7630C",
    gradient: "linear-gradient(135deg, #DA3B01, #F7630C)",
    defaultWidth: 820,
    defaultHeight: 560,
    pinnedToStart: true,
    component: MusicApp,
  },
  {
    id: "weather",
    name: "Weather",
    icon: Cloud,
    color: "#60CDFF",
    gradient: "linear-gradient(135deg, #0078D4, #60CDFF)",
    defaultWidth: 520,
    defaultHeight: 440,
    pinnedToStart: true,
    component: WeatherApp,
  },
  {
    id: "clock",
    name: "Clock",
    icon: Clock,
    color: "#886CE4",
    gradient: "linear-gradient(135deg, #744DA9, #886CE4)",
    defaultWidth: 580,
    defaultHeight: 440,
    pinnedToStart: true,
    component: ClockApp,
  },
  {
    id: "store",
    name: "Microsoft Store",
    icon: ShoppingBag,
    color: "#00BCF2",
    gradient: "linear-gradient(135deg, #0078D4, #00BCF2)",
    defaultWidth: 820,
    defaultHeight: 560,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: StoreApp,
  },
  {
    id: "games",
    name: "Games",
    icon: Gamepad2,
    color: "#6CCB5F",
    gradient: "linear-gradient(135deg, #107C10, #6CCB5F)",
    defaultWidth: 520,
    defaultHeight: 440,
    pinnedToStart: true,
    component: GamesApp,
  },
  {
    id: "cloudia",
    name: "Cloudia AI",
    icon: CloudiaIcon,
    color: "#2563EB",
    gradient: "linear-gradient(135deg, #1D4ED8, #2563EB)",
    defaultWidth: 720,
    defaultHeight: 480,
    showOnDesktop: true,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: CloudiaApp,
  },
  // Utility Apps
  {
    id: "snipping-tool",
    name: "Snipping Tool",
    icon: Scissors,
    color: "#FF3333",
    gradient: "linear-gradient(135deg, #E74856, #FF3333)",
    defaultWidth: 400,
    defaultHeight: 300,
    pinnedToStart: true,
    component: SnippingToolApp,
  },
  {
    id: "sound-recorder",
    name: "Sound Recorder",
    icon: Mic,
    color: "#C239B3",
    gradient: "linear-gradient(135deg, #881798, #C239B3)",
    defaultWidth: 400,
    defaultHeight: 500,
    pinnedToStart: true,
    component: SoundRecorderApp,
  },
  {
    id: "sticky-notes",
    name: "Sticky Notes",
    icon: StickyNote,
    color: "#FF8C00",
    gradient: "linear-gradient(135deg, #FCE100, #FF8C00)",
    defaultWidth: 300,
    defaultHeight: 300,
    pinnedToStart: true,
    component: StickyNotesApp,
  },
  {
    id: "security",
    name: "Windows Security",
    icon: Shield,
    color: "#6CCB5F",
    gradient: "linear-gradient(135deg, #107C10, #6CCB5F)",
    defaultWidth: 680,
    defaultHeight: 480,
    pinnedToStart: true,
    component: SecurityApp,
  },
  {
    id: "disk-management",
    name: "Disk Management",
    icon: HardDrive,
    color: "#333333",
    gradient: "linear-gradient(135deg, #767676, #333333)",
    defaultWidth: 680,
    defaultHeight: 440,
    component: DiskManagementApp,
  },
  {
    id: "system-info",
    name: "System Information",
    icon: Info,
    color: "#60CDFF",
    gradient: "linear-gradient(135deg, #0078D4, #60CDFF)",
    defaultWidth: 580,
    defaultHeight: 440,
    component: SystemInfoApp,
  },
  // Microsoft Office Apps
  {
    id: "word",
    name: "Microsoft Word",
    icon: FileEdit,
    color: "#41A5EE",
    gradient: "linear-gradient(135deg, #185ABD, #41A5EE)",
    defaultWidth: 760,
    defaultHeight: 540,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: WordApp,
  },
  {
    id: "excel",
    name: "Microsoft Excel",
    icon: Table,
    color: "#21A366",
    gradient: "linear-gradient(135deg, #107C41, #21A366)",
    defaultWidth: 820,
    defaultHeight: 540,
    pinnedToStart: true,
    component: ExcelApp,
  },
  {
    id: "powerpoint",
    name: "Microsoft PowerPoint",
    icon: Presentation,
    color: "#E05C31",
    gradient: "linear-gradient(135deg, #C43E1C, #E05C31)",
    defaultWidth: 820,
    defaultHeight: 560,
    pinnedToStart: true,
    component: PowerPointApp,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    icon: Inbox,
    color: "#0078D4",
    gradient: "linear-gradient(135deg, #0078D4, #003087)",
    defaultWidth: 820,
    defaultHeight: 540,
    pinnedToStart: true,
    component: OutlookApp,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    icon: Users,
    color: "#7B83EB",
    gradient: "linear-gradient(135deg, #5558AF, #7B83EB)",
    defaultWidth: 760,
    defaultHeight: 520,
    pinnedToStart: true,
    component: TeamsApp,
  },
  {
    id: "onedrive",
    name: "OneDrive",
    icon: Cloud,
    color: "#0078D4",
    gradient: "linear-gradient(135deg, #0078D4, #083F88)",
    defaultWidth: 680,
    defaultHeight: 500,
    pinnedToStart: true,
    component: OneDriveApp,
  },
  // Third-Party Apps
  {
    id: "chrome",
    name: "Google Chrome",
    icon: Globe,
    color: "#34A853",
    gradient: "linear-gradient(135deg, #4285F4, #34A853)",
    defaultWidth: 820,
    defaultHeight: 560,
    pinnedToStart: true,
    component: ChromeApp,
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: Music,
    color: "#1DB954",
    gradient: "linear-gradient(135deg, #1DB954, #158A3E)",
    defaultWidth: 760,
    defaultHeight: 520,
    pinnedToStart: true,
    component: SpotifyApp,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "#25D366",
    gradient: "linear-gradient(135deg, #25D366, #075E54)",
    defaultWidth: 760,
    defaultHeight: 520,
    pinnedToTaskbar: true,
    pinnedToStart: true,
    component: WhatsAppApp,
  },
  {
    id: "maps",
    name: "Maps",
    icon: MapPin,
    color: "#EA4335",
    gradient: "linear-gradient(135deg, #E74856, #EA4335)",
    defaultWidth: 760,
    defaultHeight: 520,
    pinnedToStart: true,
    component: MapsApp,
  },
]

// Helper to get app by ID
export function getApp(id: string): AppConfig | undefined {
  return apps.find(app => app.id === id)
}

// Helper to get app icon component
export function getAppIcon(id: string): LucideIcon {
  return getApp(id)?.icon || FolderOpen
}

// Get pinned apps for Start Menu
export function getPinnedApps(): AppConfig[] {
  return apps.filter(app => app.pinnedToStart)
}

// Get taskbar apps
export function getTaskbarApps(): AppConfig[] {
  return apps.filter(app => app.pinnedToTaskbar)
}

// Placeholder Apps
function SnippingToolApp() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#202020] text-white p-8">
      <Scissors className="w-16 h-16 text-[#E74856] mb-4" />
      <h2 className="text-xl font-semibold mb-2">Snipping Tool</h2>
      <p className="text-white/60 text-center text-sm">Capture screenshots of your desktop</p>
      <button className="mt-6 px-6 py-2 bg-[#E74856] rounded-lg hover:bg-[#FF3333] transition-colors text-sm font-medium">
        New Snip
      </button>
    </div>
  )
}

function SoundRecorderApp() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#202020] text-white p-8">
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #881798, #C239B3)' }}>
        <Mic className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Sound Recorder</h2>
      <p className="text-white/60 text-center text-sm mb-6">Record audio clips</p>
      <button className="w-16 h-16 rounded-full bg-[#C239B3] hover:bg-[#D24BC4] transition-colors flex items-center justify-center">
        <Mic className="w-8 h-8 text-white" />
      </button>
    </div>
  )
}

function StickyNotesApp() {
  return (
    <div className="h-full flex flex-col" style={{ background: '#FEF08A' }}>
      <div className="h-8 flex items-center justify-between px-3" style={{ background: '#FACC15' }}>
        <span className="text-xs font-medium text-black/70">Sticky Note</span>
      </div>
      <textarea 
        className="flex-1 p-3 bg-transparent resize-none outline-none text-sm text-black/80"
        placeholder="Type your note here..."
      />
    </div>
  )
}

function SecurityApp() {
  return (
    <div className="h-full flex flex-col bg-[#202020] text-white">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#6CCB5F]" />
          <h2 className="text-xl font-semibold">Windows Security</h2>
        </div>
      </div>
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Virus & threat protection', status: 'No action needed', ok: true },
            { name: 'Account protection', status: 'No action needed', ok: true },
            { name: 'Firewall & network', status: 'No action needed', ok: true },
            { name: 'App & browser control', status: 'No action needed', ok: true },
          ].map((item) => (
            <div key={item.name} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#6CCB5F]" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <span className="text-xs text-[#6CCB5F]">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DiskManagementApp() {
  return (
    <div className="h-full flex flex-col bg-[#202020] text-white">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-semibold">Disk Management</h2>
      </div>
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">System (C:)</span>
              <span className="text-sm text-white/60">128 GB</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-[#0078D4] rounded-full" />
            </div>
            <span className="text-xs text-white/40 mt-1">83.2 GB used</span>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Data (D:)</span>
              <span className="text-sm text-white/60">256 GB</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[30%] bg-[#6CCB5F] rounded-full" />
            </div>
            <span className="text-xs text-white/40 mt-1">76.8 GB used</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SystemInfoApp() {
  return (
    <div className="h-full flex flex-col bg-[#202020] text-white">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-semibold">System Information</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3 text-sm">
          {[
            { label: 'Device name', value: 'CLOUDOS-PC' },
            { label: 'Processor', value: 'CloudOS Virtual CPU @ 2.4GHz' },
            { label: 'Installed RAM', value: '8.00 GB' },
            { label: 'System type', value: '64-bit operating system' },
            { label: 'Edition', value: 'CloudOS Pro' },
            { label: 'Version', value: '24H2' },
            { label: 'OS build', value: '26100.1' },
          ].map((item) => (
            <div key={item.label} className="flex">
              <span className="w-40 text-white/60">{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
