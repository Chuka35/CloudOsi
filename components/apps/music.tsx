"use client"

import { useState, useRef, useEffect } from "react"
import { useWallpaperStore } from "@/lib/stores/wallpaperStore"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  Music2,
  Search,
  Home,
  Library,
  PlusCircle
} from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
}

const mockTracks: Track[] = [
  { id: "1", title: "Midnight Dreams", artist: "Aurora Skies", album: "Nocturnal", duration: 234, cover: "6366f1" },
  { id: "2", title: "Electric Pulse", artist: "Neon Wave", album: "Digital Age", duration: 198, cover: "ec4899" },
  { id: "3", title: "Ocean Breeze", artist: "Coastal Sounds", album: "Serenity", duration: 267, cover: "06b6d4" },
  { id: "4", title: "Mountain High", artist: "Peak Experience", album: "Altitude", duration: 312, cover: "22c55e" },
  { id: "5", title: "City Lights", artist: "Urban Dreams", album: "Metropolis", duration: 245, cover: "f59e0b" },
  { id: "6", title: "Starfall", artist: "Cosmic Journey", album: "Galaxy", duration: 289, cover: "8b5cf6" },
  { id: "7", title: "Rain Dance", artist: "Storm Chasers", album: "Elements", duration: 201, cover: "3b82f6" },
  { id: "8", title: "Sunset Glow", artist: "Golden Hour", album: "Twilight", duration: 276, cover: "ef4444" },
]

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function MusicApp() {
  const [currentTrack, setCurrentTrack] = useState<Track>(mockTracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["1", "3"]))
  const [activeView, setActiveView] = useState<"home" | "library" | "playlist">("home")
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const { accentColor } = useWallpaperStore()

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= currentTrack.duration) {
            playNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [isPlaying, currentTrack])

  const playNext = () => {
    const currentIndex = mockTracks.findIndex(t => t.id === currentTrack.id)
    const nextIndex = shuffle 
      ? Math.floor(Math.random() * mockTracks.length)
      : (currentIndex + 1) % mockTracks.length
    setCurrentTrack(mockTracks[nextIndex])
    setProgress(0)
  }

  const playPrev = () => {
    const currentIndex = mockTracks.findIndex(t => t.id === currentTrack.id)
    const prevIndex = (currentIndex - 1 + mockTracks.length) % mockTracks.length
    setCurrentTrack(mockTracks[prevIndex])
    setProgress(0)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#121212] text-white">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-black/40 p-4 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Music2 size={24} style={{ color: accentColor }} />
            <span className="font-bold">CloudMusic</span>
          </div>

          <nav className="flex flex-col gap-1">
            {[
              { id: "home", icon: Home, label: "Home" },
              { id: "library", icon: Library, label: "Your Library" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as typeof activeView)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  activeView === item.id 
                    ? "bg-white/10 text-white" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/60 uppercase">Playlists</span>
              <button className="text-white/60 hover:text-white">
                <PlusCircle size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {["Liked Songs", "Chill Vibes", "Workout Mix", "Focus Flow"].map(playlist => (
                <button
                  key={playlist}
                  className="text-left text-sm text-white/60 hover:text-white py-1.5 truncate"
                >
                  {playlist}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Search */}
            <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 mb-6 max-w-md">
              <Search size={18} className="text-white/60" />
              <input
                type="text"
                placeholder="Search for songs, artists..."
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-white/40"
              />
            </div>

            {/* Now Playing */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Now Playing</h2>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div 
                  className="w-20 h-20 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `#${currentTrack.cover}` }}
                >
                  <Music2 size={32} className="text-white/80" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{currentTrack.title}</h3>
                  <p className="text-sm text-white/60">{currentTrack.artist}</p>
                  <p className="text-xs text-white/40">{currentTrack.album}</p>
                </div>
                <button 
                  onClick={() => toggleFavorite(currentTrack.id)}
                  className="p-2"
                >
                  <Heart 
                    size={20} 
                    style={favorites.has(currentTrack.id) ? { fill: accentColor, color: accentColor } : { color: 'rgba(255,255,255,0.6)' }} 
                  />
                </button>
              </div>
            </div>

            {/* Track List */}
            <div>
              <h2 className="text-xl font-bold mb-4">All Tracks</h2>
              <div className="flex flex-col">
                {mockTracks.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => {
                      setCurrentTrack(track)
                      setProgress(0)
                      setIsPlaying(true)
                    }}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentTrack.id === track.id 
                        ? "bg-white/10" 
                        : "hover:bg-white/5"
                    }`}
                  >
                    <span className="w-6 text-center text-sm text-white/40">
                      {currentTrack.id === track.id && isPlaying ? (
                        <div className="flex items-center justify-center gap-0.5">
                          {[1,2,3].map(i => (
                            <div 
                              key={i}
                              className="w-0.5 animate-pulse"
                              style={{ 
                                background: accentColor,
                                height: `${8 + Math.random() * 8}px`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            />
                          ))}
                        </div>
                      ) : index + 1}
                    </span>
                    <div 
                      className="w-10 h-10 rounded flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `#${track.cover}` }}
                    >
                      <Music2 size={16} className="text-white/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={currentTrack.id === track.id ? { color: accentColor } : {}}>
                        {track.title}
                      </p>
                      <p className="text-xs text-white/60 truncate">{track.artist}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(track.id)
                      }}
                      className="p-2"
                    >
                      <Heart 
                        size={16} 
                        style={favorites.has(track.id) ? { fill: accentColor, color: accentColor } : { color: 'rgba(255,255,255,0.4)' }} 
                      />
                    </button>
                    <span className="text-xs text-white/40 w-12 text-right">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="h-20 bg-[#181818] border-t border-white/10 flex items-center px-4 gap-4">
        {/* Track Info */}
        <div className="w-56 flex items-center gap-3">
          <div 
            className="w-14 h-14 rounded flex items-center justify-center shrink-0"
            style={{ backgroundColor: `#${currentTrack.cover}` }}
          >
            <Music2 size={20} className="text-white/80" />
          </div>
          <div className="min-w-0">
            <p className="text-sm truncate">{currentTrack.title}</p>
            <p className="text-xs text-white/60 truncate">{currentTrack.artist}</p>
          </div>
          <button onClick={() => toggleFavorite(currentTrack.id)}>
            <Heart 
              size={16} 
              style={favorites.has(currentTrack.id) ? { fill: accentColor, color: accentColor } : { color: 'rgba(255,255,255,0.6)' }} 
            />
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShuffle(!shuffle)}
              className="p-1"
              style={shuffle ? { color: accentColor } : { color: 'rgba(255,255,255,0.6)' }}
            >
              <Shuffle size={16} />
            </button>
            <button onClick={playPrev} className="text-white/60 hover:text-white">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button onClick={playNext} className="text-white/60 hover:text-white">
              <SkipForward size={20} />
            </button>
            <button 
              onClick={() => setRepeat(!repeat)}
              className="p-1"
              style={repeat ? { color: accentColor } : { color: 'rgba(255,255,255,0.6)' }}
            >
              <Repeat size={16} />
            </button>
          </div>
          
          <div className="w-full max-w-md flex items-center gap-2">
            <span className="text-xs text-white/60 w-10 text-right">{formatTime(progress)}</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-colors"
                style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/60 w-10">{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-40 flex items-center gap-2">
          <button className="p-1" onClick={() => setIsMuted(!isMuted)}>
            <ListMusic size={16} className="text-white/60" />
          </button>
          <button className="p-1" onClick={() => setIsMuted(!isMuted)}>
            {isMuted || volume === 0 ? (
              <VolumeX size={16} className="text-white/60" />
            ) : (
              <Volume2 size={16} className="text-white/60" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value))
              setIsMuted(false)
            }}
            className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>
    </div>
  )
}
