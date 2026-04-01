"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Subtitles,
  Film,
  FolderOpen,
  List
} from "lucide-react"

interface Video {
  id: string
  title: string
  duration: string
  thumbnail: string
}

const mockVideos: Video[] = [
  { id: "1", title: "Nature Documentary", duration: "45:32", thumbnail: "22c55e" },
  { id: "2", title: "City Timelapse", duration: "12:15", thumbnail: "3b82f6" },
  { id: "3", title: "Ocean Waves", duration: "1:30:00", thumbnail: "06b6d4" },
  { id: "4", title: "Mountain Sunset", duration: "8:45", thumbnail: "f59e0b" },
  { id: "5", title: "Northern Lights", duration: "25:00", thumbnail: "8b5cf6" },
]

export function VideoPlayerApp() {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showPlaylist, setShowPlaylist] = useState(true)
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="h-full flex bg-[#1a1a1a] text-white">
      {/* Main Player */}
      <div 
        className="flex-1 flex flex-col relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {currentVideo ? (
          <>
            {/* Video Area */}
            <div className="flex-1 bg-black flex items-center justify-center relative">
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `#${currentVideo.thumbnail}20` }}
              >
                <Film size={80} className="text-white/20" />
              </div>

              {/* Play/Pause Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors"
              >
                {!isPlaying && (
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play size={32} className="ml-1" />
                  </div>
                )}
              </button>

              {/* Controls */}
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#0078d4] [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                <div className="flex items-center gap-4">
                  {/* Play Controls */}
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 hover:bg-white/10 rounded"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded">
                    <SkipBack size={18} />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded">
                    <SkipForward size={18} />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 hover:bg-white/10 rounded"
                    >
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
                      className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>

                  {/* Time */}
                  <span className="text-sm text-white/80">
                    {formatTime(progress * 27.32)} / {currentVideo.duration}
                  </span>

                  <div className="flex-1" />

                  {/* Right Controls */}
                  <button className="p-2 hover:bg-white/10 rounded">
                    <Subtitles size={18} />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded">
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className={`p-2 hover:bg-white/10 rounded ${showPlaylist ? "bg-white/10" : ""}`}
                  >
                    <List size={18} />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded">
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Title Bar */}
            <div className="h-12 bg-[#252525] flex items-center px-4">
              <span className="font-medium">{currentVideo.title}</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Film size={64} className="text-white/20 mb-4" />
            <h2 className="text-xl font-medium mb-2">No video selected</h2>
            <p className="text-white/60 text-sm mb-6">Select a video from the playlist or open a file</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0078d4] hover:bg-[#006cbd] rounded-md text-sm transition-colors">
              <FolderOpen size={16} />
              Open File
            </button>
          </div>
        )}
      </div>

      {/* Playlist Sidebar */}
      {showPlaylist && (
        <div className="w-72 bg-[#252525] border-l border-white/10 flex flex-col">
          <div className="h-12 flex items-center justify-between px-4 border-b border-white/10">
            <span className="font-medium">Playlist</span>
            <span className="text-xs text-white/60">{mockVideos.length} videos</span>
          </div>
          
          <div className="flex-1 overflow-auto">
            {mockVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => {
                  setCurrentVideo(video)
                  setIsPlaying(true)
                  setProgress(0)
                }}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  currentVideo?.id === video.id 
                    ? "bg-[#0078d4]/20 border-l-2 border-[#0078d4]" 
                    : "hover:bg-white/5"
                }`}
              >
                <span className="text-xs text-white/40 w-5">{index + 1}</span>
                <div 
                  className="w-20 h-12 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `#${video.thumbnail}` }}
                >
                  <Play size={16} className="text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{video.title}</p>
                  <p className="text-xs text-white/50">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
