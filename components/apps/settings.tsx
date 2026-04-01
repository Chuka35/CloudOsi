'use client'

import { useState, ReactNode } from 'react'
import { 
  Home, Monitor, Bluetooth, Wifi, Palette, AppWindow, UserCircle,
  Globe, Gamepad2, Accessibility, Shield, RefreshCw, Search,
  Sparkles, Volume2, Bell, Moon, Check, Mic, ChevronRight,
  Power, Clock, Lock, Eye, Download, Cpu, HardDrive, Smartphone,
  MousePointer, Keyboard, Printer
} from 'lucide-react'
import { useWallpaperStore, WALLPAPERS, ACCENT_COLORS, WallpaperKey } from '@/lib/stores/wallpaperStore'
import { useAuthStore } from '@/lib/stores/authStore'

const navItems = [
  { icon: Home, label: 'Home' },
  { icon: Monitor, label: 'System' },
  { icon: Bluetooth, label: 'Bluetooth & devices' },
  { icon: Wifi, label: 'Network & internet' },
  { icon: Palette, label: 'Personalization' },
  { icon: AppWindow, label: 'Apps' },
  { icon: UserCircle, label: 'Accounts' },
  { icon: Globe, label: 'Time & language' },
  { icon: Gamepad2, label: 'Gaming' },
  { icon: Accessibility, label: 'Accessibility' },
  { icon: Shield, label: 'Privacy & security' },
  { icon: RefreshCw, label: 'Windows Update' },
  { icon: Sparkles, label: 'AI & CLOUDIA' },
]

const VOICES = [
  { key: 'aria', label: 'ARIA', description: 'Warm & friendly', gender: 'Female' },
  { key: 'atlas', label: 'ATLAS', description: 'Deep & professional', gender: 'Male' },
  { key: 'echo', label: 'ECHO', description: 'Calm & soothing', gender: 'Neutral' },
  { key: 'rachel', label: 'RACHEL', description: 'Bright & energetic', gender: 'Female' },
]

export function SettingsApp() {
  const [activeNav, setActiveNav] = useState('Home')
  const [nightLight, setNightLight] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [volume, setVolume] = useState(75)
  const [searchQuery, setSearchQuery] = useState('')
  const [saveStatus, setSaveStatus] = useState('')

  const { wallpaper, accentColor, setWallpaper, setAccentColor } = useWallpaperStore()
  const { user, updateSettings, signout } = useAuthStore()

  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [selectedVoice, setSelectedVoice] = useState(user?.selectedVoice || 'aria')
  const [autoSpeak, setAutoSpeak] = useState(user?.autoSpeak ?? false)

  const filteredNav = searchQuery
    ? navItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : navItems

  const saveVoiceSettings = async () => {
    await updateSettings({ selectedVoice, autoSpeak })
    setSaveStatus('Saved!')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  const saveAccountSettings = async () => {
    await updateSettings({ displayName })
    setSaveStatus('Saved!')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  return (
    <div className="h-full flex text-sm">
      {/* Left Sidebar */}
      <div 
        className="w-[248px] p-3 overflow-y-auto flex-shrink-0"
        style={{ 
          background: 'rgba(20, 20, 20, 0.80)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* User Profile */}
        <button 
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/6 cursor-pointer mb-2 text-left"
          onClick={() => setActiveNav('Accounts')}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}
          >
            {(user?.displayName || 'C').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.displayName || 'CloudUser'}</div>
            <div className="text-[11px] text-white/40 truncate">{user?.email || 'CloudOS Account'}</div>
          </div>
        </button>
        
        {/* Search */}
        <div 
          className="h-8 flex items-center gap-2 px-3 rounded mb-2"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Search className="w-3 h-3 text-white/50 flex-shrink-0" />
          <input
            type="text"
            placeholder="Find a setting"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-white/40 outline-none"
          />
        </div>
        
        {/* Navigation */}
        <nav className="space-y-0.5">
          {filteredNav.map((item) => (
            <button
              key={item.label}
              className={`w-full h-9 flex items-center gap-3 px-2 rounded transition-colors ${
                activeNav === item.label 
                  ? 'text-white' 
                  : 'text-white/80 hover:bg-white/8'
              }`}
              style={activeNav === item.label ? { background: `${accentColor}30`, borderLeft: `3px solid ${accentColor}` } : {}}
              onClick={() => setActiveNav(item.label)}
            >
              <item.icon className="w-[18px] h-[18px] text-white/70 flex-shrink-0" />
              <span className="text-[13px] text-left">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-2xl">

          {/* HOME */}
          {activeNav === 'Home' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>
              
              <div 
                className="rounded-lg p-4 flex items-center gap-4 mb-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div 
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}
                >
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">CloudOS 1.0.0</div>
                  <div className="text-sm text-white/60">Cloud Edge Processor</div>
                  <div className="flex gap-4 mt-2">
                    <button 
                      className="text-[13px] hover:underline"
                      style={{ color: accentColor }}
                      onClick={() => setActiveNav('Accounts')}
                    >
                      Account settings
                    </button>
                    <button 
                      className="text-[13px] hover:underline"
                      style={{ color: accentColor }}
                      onClick={() => setActiveNav('Personalization')}
                    >
                      Personalize
                    </button>
                  </div>
                </div>
              </div>
              
              <h2 className="text-base font-semibold text-white mb-4">Quick settings</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <SettingToggle 
                  icon={<Moon className="w-5 h-5" />}
                  label="Night light"
                  description="Reduce blue light"
                  checked={nightLight}
                  onChange={setNightLight}
                  accent={accentColor}
                />
                <SettingToggle 
                  icon={<Bell className="w-5 h-5" />}
                  label="Notifications"
                  description="App and system alerts"
                  checked={notifications}
                  onChange={setNotifications}
                  accent={accentColor}
                />
              </div>
              
              <h2 className="text-base font-semibold text-white mb-4">Sound</h2>
              <div 
                className="rounded-lg p-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-white/70" />
                  <span className="text-sm text-white">Master volume</span>
                  <input
                    type="range" min="0" max="100" value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${accentColor} ${volume}%, rgba(255,255,255,0.12) ${volume}%)` }}
                  />
                  <span className="text-sm text-white/60 w-10 text-right">{volume}%</span>
                </div>
              </div>

              {/* Quick nav cards */}
              <h2 className="text-base font-semibold text-white mb-4 mt-6">Explore settings</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Personalization', desc: 'Wallpaper, colors', nav: 'Personalization', icon: Palette },
                  { label: 'Accounts', desc: 'Your profile', nav: 'Accounts', icon: UserCircle },
                  { label: 'AI & CLOUDIA', desc: 'Voice & assistant', nav: 'AI & CLOUDIA', icon: Sparkles },
                  { label: 'Privacy & security', desc: 'Permissions', nav: 'Privacy & security', icon: Shield },
                ].map(item => (
                  <button
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/8 text-left transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onClick={() => setActiveNav(item.nav)}
                  >
                    <item.icon className="w-5 h-5 text-white/60" />
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-white/40">{item.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* PERSONALIZATION */}
          {activeNav === 'Personalization' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Personalization</h1>
              
              <h2 className="text-base font-semibold text-white mb-3">Background</h2>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.key}
                    className="aspect-video rounded-lg overflow-hidden relative transition-all"
                    style={{
                      background: wp.gradient,
                      border: wallpaper === wp.key ? `2px solid ${accentColor}` : '2px solid transparent',
                      boxShadow: wallpaper === wp.key ? `0 0 0 1px ${accentColor}40` : 'none',
                    }}
                    onClick={() => setWallpaper(wp.key as WallpaperKey)}
                  >
                    {/* Mini aurora blobs */}
                    <div className="absolute inset-0" style={{ background: wp.aurora1, filter: 'blur(8px)', borderRadius: '50%', width: '60%', height: '60%', top: '-10%', left: '-10%' }} />
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2" style={{ background: wp.aurora2, filter: 'blur(6px)', borderRadius: '50%' }} />
                    <div className="absolute inset-0 flex items-end justify-center pb-1">
                      <span className="text-[10px] text-white/70 font-medium">{wp.label}</span>
                    </div>
                    {wallpaper === wp.key && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <h2 className="text-base font-semibold text-white mb-3">Accent color</h2>
              <div className="flex flex-wrap gap-3 mb-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.key}
                    title={c.label}
                    className="w-9 h-9 rounded-full relative transition-transform hover:scale-110"
                    style={{ 
                      background: c.value,
                      border: accentColor === c.value ? '2px solid white' : '2px solid transparent',
                      boxShadow: accentColor === c.value ? `0 0 0 2px ${c.value}` : 'none',
                    }}
                    onClick={() => setAccentColor(c.value)}
                  >
                    {accentColor === c.value && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-1">
                Current: <span className="font-mono" style={{ color: accentColor }}>{accentColor}</span>
                {' '}— changes apply immediately to the entire desktop
              </p>
            </div>
          )}

          {/* ACCOUNTS */}
          {activeNav === 'Accounts' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Accounts</h1>

              <div 
                className="rounded-lg p-5 mb-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)` }}
                  >
                    {(user?.displayName || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{user?.displayName || 'CloudUser'}</div>
                    <div className="text-sm text-white/50">{user?.email || 'guest@cloudos.app'}</div>
                    <div 
                      className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
                      style={{ background: `${accentColor}20`, color: accentColor }}
                    >
                      {user?.isPro ? 'CloudOS Pro' : user?.isGuest ? 'Guest Account' : 'Free Account'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full h-9 px-3 rounded text-sm text-white outline-none"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                      placeholder="Your display name"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    className="h-8 px-4 rounded text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: accentColor }}
                    onClick={saveAccountSettings}
                  >
                    Save changes
                  </button>
                  {saveStatus && (
                    <span className="text-sm text-green-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {saveStatus}
                    </span>
                  )}
                </div>
              </div>

              <div 
                className="rounded-lg p-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <h3 className="text-sm font-semibold text-white mb-3">Account actions</h3>
                <div className="space-y-2">
                  <button
                    className="w-full h-9 px-3 rounded text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    onClick={() => signout()}
                  >
                    Sign out of CloudOS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI & CLOUDIA */}
          {activeNav === 'AI & CLOUDIA' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">AI & CLOUDIA</h1>
              
              <h2 className="text-base font-semibold text-white mb-3">Voice</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {VOICES.map((voice) => (
                  <button
                    key={voice.key}
                    className="p-4 rounded-lg text-left transition-all"
                    style={{
                      background: selectedVoice === voice.key ? `${accentColor}20` : 'rgba(255,255,255,0.05)',
                      border: selectedVoice === voice.key ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.08)',
                    }}
                    onClick={() => setSelectedVoice(voice.key)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <Mic className="w-4 h-4" style={{ color: selectedVoice === voice.key ? accentColor : 'rgba(255,255,255,0.5)' }} />
                        {voice.label}
                      </div>
                      {selectedVoice === voice.key && <Check className="w-4 h-4" style={{ color: accentColor }} />}
                    </div>
                    <div className="text-xs text-white/50">{voice.description}</div>
                    <div className="text-xs text-white/30 mt-0.5">{voice.gender}</div>
                  </button>
                ))}
              </div>

              <SettingToggle
                icon={<Mic className="w-5 h-5" />}
                label="Auto-speak responses"
                description="CLOUDIA reads her replies aloud automatically"
                checked={autoSpeak}
                onChange={setAutoSpeak}
                accent={accentColor}
              />

              <div className="flex items-center gap-3 mt-5">
                <button
                  className="h-8 px-4 rounded text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: accentColor }}
                  onClick={saveVoiceSettings}
                >
                  Save preferences
                </button>
                {saveStatus && (
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {saveStatus}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* SYSTEM */}
          {activeNav === 'System' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">System</h1>
              
              {/* Display */}
              <SettingCard title="Display" icon={<Monitor className="w-5 h-5" />}>
                <div className="space-y-4">
                  <SettingRow label="Resolution" value="1920 × 1080 (Recommended)" />
                  <SettingRow label="Scale" value="100%" />
                  <SettingRow label="Refresh rate" value="60 Hz" />
                  <SettingToggle icon={<Moon className="w-5 h-5" />} label="Night light" description="Reduce blue light" checked={nightLight} onChange={setNightLight} accent={accentColor} />
                </div>
              </SettingCard>

              {/* Sound */}
              <SettingCard title="Sound" icon={<Volume2 className="w-5 h-5" />}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-white/50 flex-shrink-0" />
                    <span className="text-sm text-white flex-shrink-0 w-28">Master volume</span>
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))}
                      className="flex-1 h-1 rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
                      style={{ background: `linear-gradient(to right, ${accentColor} ${volume}%, rgba(255,255,255,0.12) ${volume}%)` }}
                    />
                    <span className="text-sm text-white/50 w-9 text-right">{volume}%</span>
                  </div>
                  <SettingRow label="Output device" value="Browser Default" />
                  <SettingRow label="Input device" value="Default Microphone" />
                </div>
              </SettingCard>

              {/* Notifications */}
              <SettingCard title="Notifications" icon={<Bell className="w-5 h-5" />}>
                <SettingToggle icon={<Bell className="w-5 h-5" />} label="App notifications" description="Allow apps to send notifications" checked={notifications} onChange={setNotifications} accent={accentColor} />
              </SettingCard>

              {/* Power */}
              <SettingCard title="Power" icon={<Power className="w-5 h-5" />}>
                <SettingRow label="Power mode" value="Balanced (recommended)" />
                <SettingRow label="Screen timeout" value="Never (Browser managed)" />
              </SettingCard>

              {/* About */}
              <SettingCard title="About" icon={<Monitor className="w-5 h-5" />}>
                <div className="space-y-2">
                  <SettingRow label="OS" value="CloudOS 1.0.0" />
                  <SettingRow label="Architecture" value="Cloud Edge / Browser" />
                  <SettingRow label="Framework" value="Next.js 16 + React 19" />
                  <SettingRow label="Runtime" value="Node.js (Turbopack)" />
                </div>
              </SettingCard>
            </div>
          )}

          {/* WINDOWS UPDATE */}
          {activeNav === 'Windows Update' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">CloudOS Update</h1>
              <div 
                className="rounded-lg p-6 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${accentColor}20` }}>
                  <Check className="w-7 h-7" style={{ color: accentColor }} />
                </div>
                <div className="text-lg font-semibold text-white mb-1">You&apos;re up to date</div>
                <div className="text-sm text-white/50">CloudOS 1.0.0 — Last checked: just now</div>
              </div>
            </div>
          )}

          {/* BLUETOOTH & DEVICES */}
          {activeNav === 'Bluetooth & devices' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Bluetooth & devices</h1>
              <SettingCard title="Bluetooth" icon={<Bluetooth className="w-5 h-5" />}>
                <SettingToggle icon={<Bluetooth className="w-5 h-5" />} label="Bluetooth" description="Discover and connect Bluetooth devices" checked={false} onChange={() => {}} accent={accentColor} />
              </SettingCard>
              <SettingCard title="Devices" icon={<Smartphone className="w-5 h-5" />}>
                <SettingRow label="Mouse" value="Default (Browser)" />
                <SettingRow label="Keyboard" value="Default (Browser)" />
                <SettingRow label="Printer / Scanner" value="Not available in browser" />
              </SettingCard>
              <SettingCard title="Cameras" icon={<Eye className="w-5 h-5" />}>
                <SettingRow label="Camera" value="Managed by browser" />
              </SettingCard>
            </div>
          )}

          {/* NETWORK & INTERNET */}
          {activeNav === 'Network & internet' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Network & internet</h1>
              <SettingCard title="Wi-Fi / Connection" icon={<Wifi className="w-5 h-5" />}>
                <SettingRow label="Status" value="Connected (Browser managed)" />
                <SettingRow label="Network type" value="Internet access via browser" />
                <SettingRow label="IP address" value="Dynamic (DHCP)" />
              </SettingCard>
              <SettingCard title="VPN" icon={<Lock className="w-5 h-5" />}>
                <SettingRow label="VPN" value="Not configured" />
              </SettingCard>
              <SettingCard title="Proxy" icon={<Globe className="w-5 h-5" />}>
                <SettingRow label="Proxy" value="Automatic (browser default)" />
              </SettingCard>
            </div>
          )}

          {/* APPS */}
          {activeNav === 'Apps' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Apps</h1>
              <SettingCard title="Installed apps" icon={<AppWindow className="w-5 h-5" />}>
                {[
                  { name: 'CLOUDIA AI', version: '2.0.0', size: '—' },
                  { name: 'Browser', version: '1.5.0', size: '—' },
                  { name: 'File Manager', version: '1.0.0', size: '—' },
                  { name: 'Text Editor', version: '1.0.0', size: '—' },
                  { name: 'Settings', version: '1.0.0', size: '—' },
                  { name: 'Calculator', version: '1.0.0', size: '—' },
                  { name: 'Weather', version: '1.0.0', size: '—' },
                  { name: 'Terminal', version: '1.0.0', size: '—' },
                ].map(app => (
                  <div key={app.name} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-sm text-white font-medium">{app.name}</div>
                      <div className="text-xs text-white/40">v{app.version}</div>
                    </div>
                    <span className="text-xs text-white/30">Built-in</span>
                  </div>
                ))}
              </SettingCard>
              <SettingCard title="Default apps" icon={<Download className="w-5 h-5" />}>
                <SettingRow label="Web browser" value="CloudBrowser" />
                <SettingRow label="Text editor" value="Cloud Notepad" />
              </SettingCard>
            </div>
          )}

          {/* TIME & LANGUAGE */}
          {activeNav === 'Time & language' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Time & language</h1>
              <SettingCard title="Date & time" icon={<Clock className="w-5 h-5" />}>
                <SettingRow label="Time zone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
                <SettingRow label="Date format" value="MM/DD/YYYY" />
                <SettingRow label="Time format" value="12-hour (AM/PM)" />
                <SettingToggle icon={<Clock className="w-5 h-5" />} label="Sync automatically" description="Set time using internet time server" checked={true} onChange={() => {}} accent={accentColor} />
              </SettingCard>
              <SettingCard title="Language" icon={<Globe className="w-5 h-5" />}>
                <SettingRow label="Display language" value="English (United States)" />
                <SettingRow label="Region" value="United States" />
              </SettingCard>
            </div>
          )}

          {/* GAMING */}
          {activeNav === 'Gaming' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Gaming</h1>
              <SettingCard title="Game Bar" icon={<Gamepad2 className="w-5 h-5" />}>
                <SettingToggle icon={<Gamepad2 className="w-5 h-5" />} label="Game Bar" description="Open Game Bar with keyboard shortcuts while in games" checked={false} onChange={() => {}} accent={accentColor} />
              </SettingCard>
              <SettingCard title="Game Mode" icon={<Cpu className="w-5 h-5" />}>
                <SettingToggle icon={<Cpu className="w-5 h-5" />} label="Game Mode" description="Optimise CPU and GPU resources for gaming" checked={true} onChange={() => {}} accent={accentColor} />
              </SettingCard>
            </div>
          )}

          {/* ACCESSIBILITY */}
          {activeNav === 'Accessibility' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Accessibility</h1>
              <SettingCard title="Vision" icon={<Eye className="w-5 h-5" />}>
                <SettingToggle icon={<Eye className="w-5 h-5" />} label="High contrast" description="Increase colour contrast for better visibility" checked={false} onChange={() => {}} accent={accentColor} />
                <div className="mt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white flex-shrink-0 w-28">Text size</span>
                    <input type="range" min="75" max="200" defaultValue="100"
                      className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, ${accentColor} 25%, rgba(255,255,255,0.12) 25%)` }}
                    />
                    <span className="text-sm text-white/50 w-12 text-right">100%</span>
                  </div>
                </div>
              </SettingCard>
              <SettingCard title="Interaction" icon={<MousePointer className="w-5 h-5" />}>
                <SettingToggle icon={<MousePointer className="w-5 h-5" />} label="Sticky keys" description="Press keyboard shortcuts one key at a time" checked={false} onChange={() => {}} accent={accentColor} />
                <SettingToggle icon={<Keyboard className="w-5 h-5" />} label="Toggle keys" description="Hear a sound when pressing Caps Lock or Num Lock" checked={false} onChange={() => {}} accent={accentColor} />
              </SettingCard>
            </div>
          )}

          {/* PRIVACY & SECURITY */}
          {activeNav === 'Privacy & security' && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">Privacy & security</h1>
              <SettingCard title="Security" icon={<Shield className="w-5 h-5" />}>
                <SettingRow label="Firewall" value="Browser sandbox (Active)" />
                <SettingRow label="Encryption" value="TLS 1.3 — Active" />
                <SettingRow label="Auth method" value="JWT + bcrypt" />
              </SettingCard>
              <SettingCard title="Privacy" icon={<Lock className="w-5 h-5" />}>
                <SettingToggle icon={<Eye className="w-5 h-5" />} label="Analytics" description="Send anonymous usage data to improve CloudOS" checked={false} onChange={() => {}} accent={accentColor} />
                <SettingToggle icon={<Lock className="w-5 h-5" />} label="Location" description="Allow apps to use your location" checked={false} onChange={() => {}} accent={accentColor} />
              </SettingCard>
              <SettingCard title="App permissions" icon={<Smartphone className="w-5 h-5" />}>
                <SettingRow label="Camera" value="Browser managed" />
                <SettingRow label="Microphone" value="CLOUDIA only (on request)" />
                <SettingRow label="Notifications" value={notifications ? 'Allowed' : 'Blocked'} />
              </SettingCard>
            </div>
          )}

          {/* DEFAULT for other sections (fallback) */}
          {!['Home', 'Personalization', 'Accounts', 'AI & CLOUDIA', 'System', 'Windows Update',
             'Bluetooth & devices', 'Network & internet', 'Apps', 'Time & language', 'Gaming',
             'Accessibility', 'Privacy & security'].includes(activeNav) && (
            <div>
              <h1 className="text-2xl font-semibold text-white mb-6">{activeNav}</h1>
              <div 
                className="rounded-lg p-8 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="text-white/40 text-sm">No settings available for {activeNav}.</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function SettingCard({ 
  title, icon, children 
}: { 
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div 
      className="rounded-xl p-4 mb-3"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center gap-2 mb-3 text-white/60">
        {icon}
        <span className="text-[13px] font-semibold text-white">{title}</span>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/70">{label}</span>
      <span className="text-sm text-white/50 text-right max-w-[55%] truncate">{value}</span>
    </div>
  )
}

function SettingToggle({ 
  icon, label, description, checked, onChange, accent 
}: { 
  icon: ReactNode
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
  accent: string
}) {
  return (
    <div 
      className="rounded-lg p-4 flex items-center gap-4"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="text-white/70">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-white/50">{description}</div>
      </div>
      <button
        className="w-11 h-6 rounded-full transition-colors flex-shrink-0"
        style={{ background: checked ? accent : 'rgba(255,255,255,0.20)' }}
        onClick={() => onChange(!checked)}
      >
        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
      </button>
    </div>
  )
}
