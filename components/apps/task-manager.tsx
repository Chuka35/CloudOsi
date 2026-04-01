'use client'

import { useState, useEffect } from 'react'
import { useDesktop } from '@/lib/desktop-context'
import { ChevronDown, ChevronRight } from 'lucide-react'

const tabs = ['Processes', 'Performance', 'App history', 'Startup', 'Users', 'Details', 'Services']

const systemProcesses = [
  { name: 'System', cpu: 0.1, memory: 8 },
  { name: 'Registry', cpu: 0, memory: 12 },
  { name: 'smss.exe', cpu: 0, memory: 0.5 },
  { name: 'csrss.exe', cpu: 0.1, memory: 4 },
  { name: 'wininit.exe', cpu: 0, memory: 1.2 },
  { name: 'services.exe', cpu: 0.1, memory: 6 },
  { name: 'lsass.exe', cpu: 0.2, memory: 12 },
  { name: 'svchost.exe', cpu: 0.5, memory: 24 },
  { name: 'dwm.exe', cpu: 1.2, memory: 86 },
  { name: 'explorer.exe', cpu: 0.8, memory: 48 },
  { name: 'RuntimeBroker.exe', cpu: 0.1, memory: 18 },
  { name: 'SearchHost.exe', cpu: 0.3, memory: 32 },
]

export function TaskManagerApp() {
  const { state } = useDesktop()
  const [activeTab, setActiveTab] = useState('Processes')
  const [expandedApps, setExpandedApps] = useState(true)
  const [expandedBackground, setExpandedBackground] = useState(false)
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(60).fill(10))
  const [cpuUsage, setCpuUsage] = useState(12)
  const [uptime, setUptime] = useState(0)
  
  // Simulate CPU usage updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = Math.random() * 20 + 5
      setCpuUsage(Math.round(newCpu))
      setCpuHistory(prev => [...prev.slice(1), newCpu])
      setUptime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  
  const getCpuColor = (cpu: number) => {
    if (cpu < 10) return 'text-white/60'
    if (cpu < 30) return 'text-[#FCE100]'
    if (cpu < 60) return 'text-[#FF8C00]'
    return 'text-[#FF5252]'
  }
  
  const runningApps = state.windows.map(w => ({
    name: w.appName,
    icon: w.icon,
    cpu: Math.random() * 3,
    memory: Math.random() * 150 + 10,
  }))
  
  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div 
        className="h-10 flex items-center gap-1 px-2 flex-shrink-0"
        style={{ 
          background: 'rgba(32, 32, 32, 0.80)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`h-full px-4 text-[13px] transition-colors ${
              activeTab === tab 
                ? 'text-white border-b-2 border-[var(--accent)]' 
                : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {activeTab === 'Processes' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Table Header */}
          <div 
            className="h-8 grid grid-cols-7 items-center px-4 text-xs font-semibold text-white/60 flex-shrink-0"
            style={{ background: 'rgba(255, 255, 255, 0.04)' }}
          >
            <div className="col-span-2">Name</div>
            <div>Status</div>
            <div>CPU</div>
            <div>Memory</div>
            <div>Disk</div>
            <div>Network</div>
          </div>
          
          {/* Table Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Apps Group */}
            <button 
              className="w-full h-7 flex items-center gap-2 px-4 text-[11px] text-white/40"
              onClick={() => setExpandedApps(!expandedApps)}
            >
              {expandedApps ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Apps ({runningApps.length} running)
            </button>
            
            {expandedApps && runningApps.map((app, i) => (
              <div 
                key={i}
                className="h-9 grid grid-cols-7 items-center px-4 hover:bg-white/4 transition-colors"
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}
              >
                <div className="col-span-2 flex items-center gap-2 text-[13px] text-white">
                  <span className="text-base">{app.icon}</span>
                  {app.name}
                </div>
                <div className="text-xs text-[#6CCB5F]">Running</div>
                <div className={`text-xs ${getCpuColor(app.cpu)}`}>{app.cpu.toFixed(1)}%</div>
                <div className="text-xs text-white/60">{app.memory.toFixed(1)} MB</div>
                <div className="text-xs text-white/60">0 MB/s</div>
                <div className="text-xs text-white/60">0 Mbps</div>
              </div>
            ))}
            
            {/* Background Processes */}
            <button 
              className="w-full h-7 flex items-center gap-2 px-4 text-[11px] text-white/40 mt-2"
              onClick={() => setExpandedBackground(!expandedBackground)}
            >
              {expandedBackground ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              Background processes ({systemProcesses.length})
            </button>
            
            {expandedBackground && systemProcesses.map((proc, i) => (
              <div 
                key={i}
                className="h-9 grid grid-cols-7 items-center px-4 hover:bg-white/4 transition-colors"
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}
              >
                <div className="col-span-2 text-[13px] text-white/80">{proc.name}</div>
                <div className="text-xs text-white/40">Running</div>
                <div className="text-xs text-white/60">{proc.cpu}%</div>
                <div className="text-xs text-white/60">{proc.memory} MB</div>
                <div className="text-xs text-white/60">0 MB/s</div>
                <div className="text-xs text-white/60">0 Mbps</div>
              </div>
            ))}
          </div>
          
          {/* Status Bar */}
          <div 
            className="h-7 flex items-center justify-between px-4 text-[11px] text-white/40 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <span>Processes: {runningApps.length + systemProcesses.length}</span>
            <span>CPU usage: {cpuUsage}%</span>
            <span>Memory: 4.2/16.0 GB (26%)</span>
          </div>
        </div>
      )}
      
      {activeTab === 'Performance' && (
        <div className="flex-1 flex">
          {/* Left Sidebar */}
          <div 
            className="w-[150px] p-2 flex-shrink-0"
            style={{ borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            {[
              { label: 'CPU', value: `${cpuUsage}%`, color: 'var(--accent)' },
              { label: 'Memory', value: '26%', color: '#8B5CF6' },
              { label: 'Disk 0', value: '2%', color: '#FF8C00' },
              { label: 'Ethernet', value: '0 Kbps', color: 'var(--accent)' },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`p-2 rounded mb-1 cursor-pointer transition-colors ${
                  i === 0 ? 'bg-[rgba(var(--accent-rgb),0.20)]' : 'hover:bg-white/8'
                }`}
              >
                <div className="text-xs text-white/80">{item.label}</div>
                <div className="text-lg text-white">{item.value}</div>
                <div className="mt-1 h-4 flex items-end gap-[1px]">
                  {Array.from({ length: 20 }).map((_, j) => (
                    <div 
                      key={j}
                      className="flex-1 rounded-sm"
                      style={{ 
                        height: `${Math.random() * 100}%`,
                        background: item.color,
                        opacity: 0.6 + Math.random() * 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Content - CPU */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-white/60">CPU</div>
                <div className="text-xl text-white">Cloudflare Edge CPU @ 2.4 GHz</div>
              </div>
              <div className="text-4xl font-light text-white">{cpuUsage}%</div>
            </div>
            
            {/* Graph */}
            <div 
              className="h-48 rounded relative"
              style={{ background: 'rgba(0, 0, 0, 0.40)' }}
            >
              <svg className="w-full h-full">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={`${100 - y}%`}
                    x2="100%"
                    y2={`${100 - y}%`}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Data line */}
                <polyline
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  points={cpuHistory.map((v, i) => `${(i / 59) * 100}%,${100 - v}%`).join(' ')}
                />
                
                {/* Fill */}
                <polygon
                  fill="rgba(var(--accent-rgb),0.10)"
                  points={`0,100% ${cpuHistory.map((v, i) => `${(i / 59) * 100}%,${100 - v}%`).join(' ')} 100%,100%`}
                />
              </svg>
              
              <div className="absolute top-2 left-2 text-xs text-white/40">% Utilization</div>
              <div className="absolute bottom-2 right-2 text-xs text-white/40">60 seconds</div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-xs text-white/40">Utilization</div>
                <div className="text-lg text-white">{cpuUsage}%</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Speed</div>
                <div className="text-lg text-white">2.4 GHz</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Processes</div>
                <div className="text-lg text-white">{runningApps.length + systemProcesses.length}</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Threads</div>
                <div className="text-lg text-white">892</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Handles</div>
                <div className="text-lg text-white">48,234</div>
              </div>
              <div>
                <div className="text-xs text-white/40">Up time</div>
                <div className="text-lg text-white">{formatUptime(uptime)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!['Processes', 'Performance'].includes(activeTab) && (
        <div className="flex-1 flex items-center justify-center text-white/40">
          {activeTab} content coming soon
        </div>
      )}
    </div>
  )
}
