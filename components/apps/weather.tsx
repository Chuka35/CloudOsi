"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets,
  Thermometer, MapPin, Search, RefreshCw, CloudLightning, CloudFog
} from "lucide-react"
import { useWallpaperStore } from "@/lib/stores/wallpaperStore"

interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  forecast: { day: string; high: number; low: number; condition: string; label: string }[]
}

function WeatherIcon({ icon, size = 24, className = "" }: { icon: string; size?: number; className?: string }) {
  const props = { size, className }
  switch (icon) {
    case 'sunny': return <Sun {...props} className={`text-yellow-400 ${className}`} />
    case 'partly-cloudy': return <Cloud {...props} className={`text-gray-300 ${className}`} />
    case 'rainy': return <CloudRain {...props} className={`text-blue-400 ${className}`} />
    case 'snowy': return <CloudSnow {...props} className={`text-blue-200 ${className}`} />
    case 'stormy': return <CloudLightning {...props} className={`text-purple-400 ${className}`} />
    case 'foggy': return <CloudFog {...props} className={`text-gray-400 ${className}`} />
    default: return <Cloud {...props} className={`text-gray-300 ${className}`} />
  }
}

export function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchCity, setSearchCity] = useState("")
  const [activeCity, setActiveCity] = useState("San Francisco")
  const { accentColor } = useWallpaperStore()

  const fetchWeather = useCallback(async (city: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error || 'Failed to fetch weather')
      }
      const data = await res.json() as WeatherData
      setWeather(data)
      setActiveCity(city)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Weather unavailable')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather(activeCity)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim())
      setSearchCity("")
    }
  }

  const quickCities = ["London", "Tokyo", "New York", "Dubai", "Sydney"]

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f2c5a 0%, #1a4a8a 100%)' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin mx-auto mb-3" />
          <p className="text-white/60 text-sm">Loading weather...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0f2c5a 50%, #1a3a6a 100%)' }}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="px-4 pt-4 pb-2">
        <div 
          className="flex items-center gap-2 px-3 h-9 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
          />
          <button type="submit" className="text-xs text-white/50 hover:text-white/80 transition-colors px-1">Go</button>
          <button
            type="button"
            onClick={() => fetchWeather(activeCity)}
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Cloud className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60 text-sm">{error}</p>
            <button
              className="mt-3 text-sm px-4 py-1.5 rounded-lg"
              style={{ background: `${accentColor}30`, color: accentColor, border: `1px solid ${accentColor}50` }}
              onClick={() => fetchWeather(activeCity)}
            >
              Retry
            </button>
          </div>
        </div>
      ) : weather && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Main weather card */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-white/60" />
              <span className="text-sm text-white/60">{weather.location}</span>
            </div>
            
            <WeatherIcon icon={weather.icon} size={72} className="mx-auto my-3 drop-shadow-lg" />
            
            <div className="text-7xl font-thin text-white mb-1">{weather.temperature}°F</div>
            <div className="text-base text-white/70 mb-1">{weather.condition}</div>
            <div className="text-sm text-white/40">Feels like {weather.feelsLike}°</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
              { icon: Wind, label: 'Wind', value: `${weather.windSpeed} mph` },
              { icon: Thermometer, label: 'Feels Like', value: `${weather.feelsLike}°F` },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-lg p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <stat.icon className="w-4 h-4 text-white/50 mx-auto mb-1" />
                <div className="text-lg font-semibold text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 7-day forecast */}
          <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="px-3 py-2 border-b border-white/8 text-xs text-white/40 uppercase tracking-wide">
              7-Day Forecast
            </div>
            {weather.forecast.map((day, i) => (
              <div
                key={i}
                className="flex items-center px-3 py-2.5 border-b border-white/4 last:border-0"
              >
                <span className="text-sm text-white/70 w-14">{day.day}</span>
                <WeatherIcon icon={day.condition} size={18} className="mx-2" />
                <span className="text-xs text-white/40 flex-1 ml-1">{day.label}</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white font-medium">{day.high}°</span>
                  <span className="text-white/40">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick city buttons */}
          <div className="mt-3">
            <div className="text-xs text-white/30 mb-2">Quick access</div>
            <div className="flex flex-wrap gap-1.5">
              {quickCities.map(city => (
                <button
                  key={city}
                  className="text-xs px-2.5 py-1 rounded-full transition-colors"
                  style={{
                    background: activeCity === city ? `${accentColor}40` : 'rgba(255,255,255,0.08)',
                    color: activeCity === city ? accentColor : 'rgba(255,255,255,0.60)',
                    border: `1px solid ${activeCity === city ? accentColor + '60' : 'rgba(255,255,255,0.10)'}`,
                  }}
                  onClick={() => fetchWeather(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
