'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Eye, EyeOff } from 'lucide-react'
import { useWallpaperStore } from '@/lib/stores/wallpaperStore'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

interface CalendarEvent {
  id: string
  title: string
  date: number
  month: number
  year: number
  allDay?: boolean
  time?: string
  color: string
}

const defaultEvents: CalendarEvent[] = [
  { id: '1', title: 'CloudOS Launch', date: 29, month: 2, year: 2026, allDay: true, color: '#0078D4' },
  { id: '2', title: 'Team Standup', date: 29, month: 2, year: 2026, time: '9:00 AM', color: '#6CCB5F' },
  { id: '3', title: 'Deadline', date: 31, month: 2, year: 2026, time: '5:00 PM', color: '#FF5252' },
  { id: '4', title: 'Q2 Planning', date: 1, month: 3, year: 2026, allDay: true, color: '#C239B3' },
]

export function CalendarApp() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 29)) // March 29, 2026
  const [selectedDate, setSelectedDate] = useState<number | null>(29)
  const [events] = useState<CalendarEvent[]>(defaultEvents)
  const { accentColor } = useWallpaperStore()
  const [calendars, setCalendars] = useState([
    { name: 'CloudOS Calendar', color: '#0078D4', visible: true },
    { name: 'Birthdays', color: '#6CCB5F', visible: true },
    { name: 'Holidays', color: '#FF5252', visible: true },
  ])
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => setCurrentDate(new Date(2026, 2, 29))
  
  const getEventsForDate = (date: number) => {
    return events.filter(e => e.date === date && e.month === month && e.year === year)
  }
  
  const generateCalendarDays = () => {
    const days = []
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ date: daysInPrevMonth - i, currentMonth: false })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, currentMonth: true })
    }
    
    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: i, currentMonth: false })
    }
    
    return days
  }
  
  const calendarDays = generateCalendarDays()
  const isToday = (date: number) => date === 29 && month === 2 && year === 2026
  
  return (
    <div className="h-full flex">
      {/* Left Panel */}
      <div 
        className="w-[250px] p-4 flex-shrink-0 overflow-y-auto"
        style={{ borderRight: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        {/* Mini Calendar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/8">
              <ChevronLeft className="w-4 h-4 text-white/70" />
            </button>
            <span className="text-sm font-semibold text-white">{months[month]} {year}</span>
            <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/8">
              <ChevronRight className="w-4 h-4 text-white/70" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {daysOfWeek.map(day => (
              <div key={day} className="text-[10px] font-semibold text-white/40 py-1">{day.charAt(0)}</div>
            ))}
            {calendarDays.slice(0, 35).map((day, i) => (
              <button
                key={i}
                className={`text-xs w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isToday(day.date) && day.currentMonth
                    ? 'text-white'
                    : selectedDate === day.date && day.currentMonth
                    ? 'ring-1 ring-white/40 text-white'
                    : day.currentMonth
                    ? 'text-white hover:bg-white/10'
                    : 'text-white/20'
                }`}
                style={isToday(day.date) && day.currentMonth ? { background: accentColor } : {}}
                onClick={() => day.currentMonth && setSelectedDate(day.date)}
              >
                {day.date}
              </button>
            ))}
          </div>
        </div>
        
        {/* My Calendars */}
        <div>
          <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wide mb-2">
            MY CALENDARS
          </div>
          {calendars.map((cal, i) => (
            <div 
              key={cal.name}
              className="h-8 flex items-center gap-2 px-2 rounded hover:bg-white/6 cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: cal.color }} />
              <span className="flex-1 text-[13px] text-white/80">{cal.name}</span>
              <button 
                onClick={() => {
                  const newCals = [...calendars]
                  newCals[i].visible = !newCals[i].visible
                  setCalendars(newCals)
                }}
                className="text-white/40 hover:text-white/70"
              >
                {cal.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div 
          className="h-12 flex items-center justify-between px-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button 
              onClick={goToToday}
              className="px-3 h-7 rounded border border-white/15 text-sm text-white hover:bg-white/8"
            >
              Today
            </button>
            <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8">
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
            <span className="text-lg font-semibold text-white">{months[month]} {year}</span>
          </div>
          
          <button
            className="h-8 px-4 flex items-center gap-2 rounded text-sm text-white"
            style={{ background: accentColor }}
          >
            <Plus className="w-4 h-4" />
            New event
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-white/6">
            {daysOfWeek.map(day => (
              <div key={day} className="py-2 text-center text-[13px] font-semibold text-white/50">
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5">
            {calendarDays.slice(0, 35).map((day, i) => {
              const dayEvents = day.currentMonth ? getEventsForDate(day.date) : []
              
              return (
                <div
                  key={i}
                  className={`min-h-[80px] p-1 border-r border-b border-white/6 ${
                    day.currentMonth ? '' : 'bg-white/2'
                  }`}
                >
                  <div 
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-[13px] ${
                      isToday(day.date) && day.currentMonth
                        ? 'text-white'
                        : day.currentMonth
                        ? 'text-white'
                        : 'text-white/20'
                    }`}
                    style={isToday(day.date) && day.currentMonth ? { background: accentColor } : {}}
                  >
                    {day.date}
                  </div>
                  
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className="h-[18px] px-1 rounded-sm text-[11px] text-white truncate"
                        style={{ background: event.color }}
                      >
                        {event.time || ''} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-white/40 pl-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
