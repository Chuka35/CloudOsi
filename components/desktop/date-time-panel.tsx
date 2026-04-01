'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface DateTimePanelProps {
  onClose: () => void
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function DateTimePanel({ onClose }: DateTimePanelProps) {
  const [now, setNow] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())
  const panelRef = useRef<HTMLDivElement>(null)

  // Update clock every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const goToToday = () => setViewDate(new Date())

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: Array<{ day: number; current: boolean; isToday: boolean }> = []

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false, isToday: false })
  }
  // Current month
  const todayDate = now.getDate()
  const todayMonth = now.getMonth()
  const todayYear = now.getFullYear()
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      current: true,
      isToday: d === todayDate && month === todayMonth && year === todayYear,
    })
  }
  // Next month leading days
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, current: false, isToday: false })
  }

  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div
      ref={panelRef}
      className="fixed z-[10001] select-none"
      style={{
        right: 12,
        bottom: 56,
        width: 320,
        background: 'rgba(24, 24, 36, 0.96)',
        backdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 16,
        boxShadow: '0 24px 60px rgba(0,0,0,0.60)',
        overflow: 'hidden',
      }}
    >
      {/* Clock */}
      <div
        className="px-5 pt-5 pb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="text-4xl font-light text-white tracking-tight tabular-nums">
          {now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </div>
        <div className="text-sm text-white/50 mt-1">{dateStr}</div>
        <div className="text-xs text-white/30 mt-0.5 tabular-nums">{timeStr}</div>
      </div>

      {/* Calendar */}
      <div className="px-4 py-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToToday}
            className="text-xs font-semibold text-white/70 hover:text-white transition-colors px-1"
          >
            {MONTHS[month]} {year}
          </button>
          <div className="flex items-center gap-0.5">
            <button
              onClick={prevMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-white/25 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((cell, ci) => (
              <div
                key={ci}
                className={`h-8 flex items-center justify-center rounded-full text-xs transition-colors ${
                  cell.isToday
                    ? 'bg-blue-500 text-white font-semibold'
                    : cell.current
                    ? 'text-white/80 hover:bg-white/8 cursor-pointer'
                    : 'text-white/20'
                }`}
              >
                {cell.day}
              </div>
            ))}
          </div>
        ))}

        {/* Today button */}
        <button
          onClick={goToToday}
          className="mt-3 w-full text-xs text-white/40 hover:text-white/70 transition-colors py-1.5 rounded-lg hover:bg-white/5"
        >
          Go to today
        </button>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/8 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
