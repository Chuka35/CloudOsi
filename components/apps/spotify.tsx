"use client"

import { useState, useEffect } from "react"
import { Home, Search, Plus, Heart, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ListMusic, Monitor } from "lucide-react"

interface Playlist {
  id: number
  name: string
  color: string
  icon?: string
}

interface Track {
  id: number
  name: string
  artist: string
  duration: string
}

const playlists: Playlist[] = [
  { id: 1, name: "Liked Songs", color: "linear-gradient(135deg, #4c1d95, #7c3aed)", icon: "heart" },
  { id: 2, name: "CloudOS Vibes", color: "linear-gradient(135deg, #7B2FBE, #C239B3)" },
  { id: 3, name: "Focus Mode", color: "linear-gradient(135deg, #059669, #10b981)" },
  { id: 4, name: "Workout Mix", color: "linear-gradient(135deg, #dc2626, #ef4444)" },
  { id: 5, name: "Chill Evening", color: "linear-gradient(135deg, #0078D4, #60CDFF)" },
]

const tracks: Track[] = [
  { id: 1, name: "Cloud Dreams", artist: "CloudOS Beats", duration: "3:45" },
  { id: 2, name: "Digital Sunrise", artist: "Synthwave", duration: "4:12" },
  { id: 3, name: "Neural Network", artist: "AI Composer", duration: "3:28" },
  { id: 4, name: "Data Flow", artist: "Techno Pulse", duration: "5:01" },
  { id: 5, name: "Quantum Leap", artist: "Electronic Dreams", duration: "4:33" },
]

const recentlyPlayed = [
  { name: "CloudOS Vibes", type: "Playlist" },
  { name: "Focus Mode", type: "Playlist" },
  { name: "Chill Beats", type: "Album" },
  { name: "Workout Energy", type: "Playlist" },
  { name: "Study Session", type: "Playlist" },
  { name: "Evening Jazz", type: "Album" },
]

export function SpotifyApp() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(42)
  const [volume, setVolume] = useState(70)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [currentTrack] = useState(tracks[0])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => prev < 100 ? prev + 0.5 : 0)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (percent: number) => {
    const totalSeconds = 225 // 3:45
    const currentSeconds = Math.floor((percent / 100) * totalSeconds)
    const minutes = Math.floor(currentSeconds / 60)
    const seconds = currentSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="h-full flex flex-col bg-[#121212] text-white overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-60 flex flex-col bg-black p-2">
          {/* Navigation */}
          <div className="bg-[#121212] rounded-lg p-4 mb-2">
            <button className="flex items-center gap-4 w-full py-2 text-white hover:text-white/80 transition-colors">
              <Home className="w-6 h-6" />
              <span className="font-semibold">Home</span>
            </button>
            <button className="flex items-center gap-4 w-full py-2 text-white/70 hover:text-white transition-colors">
              <Search className="w-6 h-6" />
              <span className="font-semibold">Search</span>
            </button>
          </div>

          {/* Library */}
          <div className="flex-1 bg-[#121212] rounded-lg p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 font-semibold">Your Library</span>
              <button className="p-1 hover:bg-white/10 rounded-full">
                <Plus className="w-5 h-5 text-white/70" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  className="flex items-center gap-3 w-full p-2 rounded hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: playlist.color }}
                  >
                    {playlist.icon === "heart" ? (
                      <Heart className="w-5 h-5 fill-white" />
                    ) : (
                      <ListMusic className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium truncate">{playlist.name}</p>
                    <p className="text-xs text-white/50">Playlist</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div 
            className="p-6"
            style={{
              background: "linear-gradient(180deg, #1a1a2e 0%, #121212 300px)"
            }}
          >
            <h1 className="text-3xl font-bold mb-6">{getGreeting()}</h1>

            {/* Recently Played */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {recentlyPlayed.map((item, i) => (
                <button
                  key={i}
                  className="flex items-center bg-white/10 rounded overflow-hidden hover:bg-white/20 transition-colors group"
                >
                  <div
                    className="w-20 h-20 flex items-center justify-center flex-shrink-0"
                    style={{ background: playlists[i % playlists.length].color }}
                  >
                    <ListMusic className="w-8 h-8" />
                  </div>
                  <span className="flex-1 px-4 font-semibold text-sm truncate">{item.name}</span>
                  <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-black text-black ml-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Made For You */}
            <h2 className="text-2xl font-bold mb-4">Made for you</h2>
            <div className="grid grid-cols-5 gap-6 mb-8">
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="relative mb-4">
                    <div
                      className="aspect-square rounded-md flex items-center justify-center shadow-lg"
                      style={{ background: playlist.color }}
                    >
                      {playlist.icon === "heart" ? (
                        <Heart className="w-16 h-16 fill-white" />
                      ) : (
                        <ListMusic className="w-16 h-16" />
                      )}
                    </div>
                    <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                      <Play className="w-5 h-5 fill-black text-black ml-1" />
                    </button>
                  </div>
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  <p className="text-sm text-white/50 truncate">By CloudOS</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Now Playing Bar */}
      <div className="h-20 flex items-center px-4 bg-[#181818] border-t border-white/10">
        {/* Track Info */}
        <div className="w-[240px] flex items-center gap-4">
          <div
            className="w-14 h-14 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7B2FBE, #C239B3)" }}
          >
            <ListMusic className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{currentTrack.name}</p>
            <p className="text-xs text-white/50 truncate">{currentTrack.artist}</p>
          </div>
          <button className="p-2 hover:text-[#1DB954]">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-2 ${shuffle ? "text-[#1DB954]" : "text-white/60 hover:text-white"}`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button className="p-2 text-white/60 hover:text-white">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-black fill-black" />
              ) : (
                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
              )}
            </button>
            <button className="p-2 text-white/60 hover:text-white">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={`p-2 ${repeat ? "text-[#1DB954]" : "text-white/60 hover:text-white"}`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full max-w-[500px] flex items-center gap-2">
            <span className="text-[10px] text-white/50 w-10 text-right">{formatTime(progress)}</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden group cursor-pointer">
              <div
                className="h-full bg-white group-hover:bg-[#1DB954] transition-colors"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-white/50 w-10">{currentTrack.duration}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-[240px] flex items-center justify-end gap-2">
          <button className="p-2 text-white/60 hover:text-white">
            <ListMusic className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/60 hover:text-white">
            <Monitor className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/60 hover:text-white">
            <Volume2 className="w-4 h-4" />
          </button>
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden group cursor-pointer">
            <div
              className="h-full bg-white group-hover:bg-[#1DB954] transition-colors"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
