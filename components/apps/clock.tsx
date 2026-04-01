"use client"

import { useState, useEffect } from "react"
import { 
  Clock, 
  AlarmClock, 
  Timer, 
  Hourglass,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Globe,
  MapPin
} from "lucide-react"

type Tab = "clock" | "alarm" | "timer" | "stopwatch"

interface WorldClock {
  id: string
  city: string
  timezone: string
  offset: number
}

interface Alarm {
  id: string
  time: string
  label: string
  enabled: boolean
  days: string[]
}

const worldClocks: WorldClock[] = [
  { id: "1", city: "Local", timezone: "Local Time", offset: 0 },
  { id: "2", city: "London", timezone: "GMT", offset: 0 },
  { id: "3", city: "New York", timezone: "EST", offset: -5 },
  { id: "4", city: "Tokyo", timezone: "JST", offset: 9 },
  { id: "5", city: "Sydney", timezone: "AEST", offset: 11 },
]

export function ClockApp() {
  const [activeTab, setActiveTab] = useState<Tab>("clock")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: "1", time: "07:00", label: "Wake up", enabled: true, days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    { id: "2", time: "09:00", label: "Meeting", enabled: false, days: ["Mon", "Wed"] },
  ])
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerRemaining, setTimerRemaining] = useState(0)
  
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      const interval = setInterval(() => {
        setTimerRemaining(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timerRemaining === 0 && timerRunning) {
      setTimerRunning(false)
    }
  }, [timerRunning, timerRemaining])

  useEffect(() => {
    if (stopwatchRunning) {
      const interval = setInterval(() => {
        setStopwatchTime(prev => prev + 10)
      }, 10)
      return () => clearInterval(interval)
    }
  }, [stopwatchRunning])

  const formatStopwatch = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeForOffset = (offset: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000
    return new Date(utc + offset * 3600000)
  }

  const tabs = [
    { id: "clock", icon: Clock, label: "World Clock" },
    { id: "alarm", icon: AlarmClock, label: "Alarms" },
    { id: "timer", icon: Timer, label: "Timer" },
    { id: "stopwatch", icon: Hourglass, label: "Stopwatch" },
  ]

  return (
    <div className="h-full flex flex-col bg-[#202020] text-white">
      {/* Tab Bar */}
      <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === tab.id 
                ? "bg-[#0078d4] text-white" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "clock" && (
          <div className="space-y-6">
            {/* Main Clock */}
            <div className="text-center mb-8">
              <div className="text-7xl font-light mb-2">
                {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-white/60">
                {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>

            {/* World Clocks */}
            <div className="grid grid-cols-2 gap-4">
              {worldClocks.map(clock => {
                const time = clock.id === "1" ? currentTime : getTimeForOffset(clock.offset)
                return (
                  <div key={clock.id} className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0078d4]/20 flex items-center justify-center">
                      {clock.id === "1" ? <MapPin size={20} className="text-[#0078d4]" /> : <Globe size={20} className="text-[#0078d4]" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{clock.city}</div>
                      <div className="text-xs text-white/50">{clock.timezone}</div>
                    </div>
                    <div className="text-2xl font-light">
                      {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === "alarm" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Alarms</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0078d4] hover:bg-[#006cbd] rounded-md text-sm">
                <Plus size={16} />
                Add Alarm
              </button>
            </div>
            
            {alarms.map(alarm => (
              <div key={alarm.id} className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-3xl font-light mb-1">{alarm.time}</div>
                  <div className="text-sm text-white/60">{alarm.label}</div>
                  <div className="flex gap-1 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                      <span 
                        key={day}
                        className={`text-xs px-2 py-0.5 rounded ${
                          alarm.days.includes(day) 
                            ? "bg-[#0078d4] text-white" 
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        {day[0]}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setAlarms(alarms.map(a => 
                    a.id === alarm.id ? { ...a, enabled: !a.enabled } : a
                  ))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    alarm.enabled ? "bg-[#0078d4]" : "bg-white/20"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                    alarm.enabled ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded">
                  <Trash2 size={16} className="text-white/60" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "timer" && (
          <div className="flex flex-col items-center justify-center h-full">
            {timerRunning || timerRemaining > 0 ? (
              <>
                <div className="text-8xl font-light mb-8">
                  {formatTimer(timerRemaining)}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="w-16 h-16 rounded-full bg-[#0078d4] hover:bg-[#006cbd] flex items-center justify-center"
                  >
                    {timerRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimerRunning(false)
                      setTimerRemaining(0)
                    }}
                    className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  >
                    <RotateCcw size={24} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(Math.min(99, Math.max(0, Number(e.target.value))))}
                      className="w-24 text-6xl font-light bg-transparent text-center outline-none"
                    />
                    <span className="text-sm text-white/50">minutes</span>
                  </div>
                  <span className="text-6xl font-light">:</span>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={timerSeconds}
                      onChange={(e) => setTimerSeconds(Math.min(59, Math.max(0, Number(e.target.value))))}
                      className="w-24 text-6xl font-light bg-transparent text-center outline-none"
                    />
                    <span className="text-sm text-white/50">seconds</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTimerRemaining(timerMinutes * 60 + timerSeconds)
                    setTimerRunning(true)
                  }}
                  className="w-16 h-16 rounded-full bg-[#0078d4] hover:bg-[#006cbd] flex items-center justify-center"
                >
                  <Play size={28} className="ml-1" />
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === "stopwatch" && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-8xl font-light mb-8 font-mono">
              {formatStopwatch(stopwatchTime)}
            </div>
            
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
                className="w-16 h-16 rounded-full bg-[#0078d4] hover:bg-[#006cbd] flex items-center justify-center"
              >
                {stopwatchRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              {stopwatchRunning && (
                <button
                  onClick={() => setLaps([stopwatchTime, ...laps])}
                  className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <Timer size={24} />
                </button>
              )}
              {!stopwatchRunning && stopwatchTime > 0 && (
                <button
                  onClick={() => {
                    setStopwatchTime(0)
                    setLaps([])
                  }}
                  className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <RotateCcw size={24} />
                </button>
              )}
            </div>

            {laps.length > 0 && (
              <div className="w-full max-w-md">
                <div className="text-sm text-white/60 mb-2">Laps</div>
                <div className="space-y-1 max-h-48 overflow-auto">
                  {laps.map((lap, i) => (
                    <div key={i} className="flex justify-between text-sm bg-white/5 rounded px-4 py-2">
                      <span className="text-white/60">Lap {laps.length - i}</span>
                      <span className="font-mono">{formatStopwatch(lap)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
