"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Navigation, Plus, Minus, Compass, Locate, MapPin, Star, Share2, MoreHorizontal, Phone, Globe, Clock, ChevronRight } from "lucide-react"

interface Pin {
  id: number
  x: number
  y: number
  label: string
  isYou?: boolean
}

const pins: Pin[] = [
  { id: 1, x: 50, y: 50, label: "You are here", isYou: true },
  { id: 2, x: 25, y: 30, label: "Coffee Shop" },
  { id: 3, x: 70, y: 20, label: "Park" },
  { id: 4, x: 35, y: 65, label: "Library" },
  { id: 5, x: 80, y: 70, label: "Restaurant" },
  { id: 6, x: 15, y: 80, label: "Museum" },
]

export function MapsApp() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null)
  const [mapType, setMapType] = useState("default")
  const mapRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const centerOnUser = () => {
    setPan({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleSearch = () => {
    if (searchQuery.toLowerCase().includes("coffee")) {
      setSelectedPin(pins[1])
    } else if (searchQuery.toLowerCase().includes("park")) {
      setSelectedPin(pins[2])
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a2e] text-white overflow-hidden">
      {/* Search Bar */}
      <div className="h-[52px] flex items-center gap-3 px-4 bg-[#202020] border-b border-white/10">
        <div className="flex-1 flex items-center gap-3 bg-white/10 rounded-full px-4 h-9">
          <Search className="w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search Google Maps"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent)] rounded-full text-sm font-medium">
          <Navigation className="w-4 h-4" />
          Directions
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Side Panel */}
        {selectedPin && (
          <div className="w-[300px] bg-[#202020] border-r border-white/10 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{selectedPin.label}</h2>
              <p className="text-sm text-white/60 mb-4">123 Example Street, City</p>

              <div className="flex gap-2 mb-6">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[var(--accent)] hover:bg-[var(--accent)] rounded-lg text-sm">
                  <Navigation className="w-4 h-4" />
                  Directions
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/15 rounded-lg">
                  <Star className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/15 rounded-lg">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/15 rounded-lg">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= 4 ? "text-[#FCE100] fill-[#FCE100]" : "text-white/30"}`} />
                  ))}
                </div>
                <span className="text-sm">4.2 (128 reviews)</span>
              </div>

              {/* Info */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-white/60" />
                  <div>
                    <span className="text-sm text-[#6CCB5F]">Open</span>
                    <span className="text-sm text-white/60"> · Closes 10PM</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 ml-auto" />
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/60" />
                  <span className="text-sm">123 Example Street, City, State 12345</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-white/60" />
                  <span className="text-sm text-[var(--accent)]">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-white/60" />
                  <span className="text-sm text-[var(--accent)]">example.com</span>
                </div>
              </div>

              {/* Reviews */}
              <div className="border-t border-white/10 mt-4 pt-4">
                <h3 className="font-medium mb-3">Reviews</h3>
                <div className="space-y-3">
                  {[
                    { name: "John D.", rating: 5, text: "Great place! Highly recommend." },
                    { name: "Sarah M.", rating: 4, text: "Nice atmosphere, good service." },
                  ].map((review, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-[10px]">
                          {review.name[0]}
                        </div>
                        <span className="text-sm font-medium">{review.name}</span>
                        <div className="flex ml-auto">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "text-[#FCE100] fill-[#FCE100]" : "text-white/30"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-white/60">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Area */}
        <div 
          ref={mapRef}
          className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Map Background */}
          <div 
            className="absolute inset-0"
            style={{
              background: mapType === "satellite" 
                ? "linear-gradient(135deg, #1a2f1a 0%, #0d1f0d 100%)" 
                : mapType === "terrain"
                ? "linear-gradient(135deg, #2a3a4a 0%, #1a2a3a 100%)"
                : "#1a1a2e",
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: "center",
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
          >
            {/* Grid Lines (Streets) */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Vertical streets */}
              {Array.from({ length: 20 }, (_, i) => (
                <line
                  key={`v${i}`}
                  x1={`${i * 5}%`}
                  y1="0"
                  x2={`${i * 5}%`}
                  y2="100%"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}
              {/* Horizontal streets */}
              {Array.from({ length: 20 }, (_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={`${i * 5}%`}
                  x2="100%"
                  y2={`${i * 5}%`}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}
              {/* Major roads */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
            </svg>

            {/* Pins */}
            {pins.map(pin => (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                className={`absolute transform -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 ${
                  selectedPin?.id === pin.id ? "z-10" : ""
                }`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <MapPin 
                  className={`w-6 h-6 ${pin.isYou ? "text-[var(--accent)]" : "text-[#E74856]"} drop-shadow-lg`}
                  fill={pin.isYou ? "var(--accent)" : "#E74856"}
                />
                {pin.isYou && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1">
                    <div className="w-4 h-4 rounded-full bg-[var(--accent)]/30 animate-ping" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-[var(--accent)]/50" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.5))}
              className="w-10 h-10 bg-[#202020]/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-[#303030] border border-white/10"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
              className="w-10 h-10 bg-[#202020]/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-[#303030] border border-white/10"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-[#202020]/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-[#303030] border border-white/10">
              <Compass className="w-5 h-5" />
            </button>
            <button
              onClick={centerOnUser}
              className="w-10 h-10 bg-[#202020]/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-[#303030] border border-white/10"
            >
              <Locate className="w-5 h-5" />
            </button>
          </div>

          {/* Map Type Toggle */}
          <div className="absolute bottom-4 left-4 flex gap-1 bg-[#202020]/90 backdrop-blur rounded-lg p-1 border border-white/10">
            {["default", "satellite", "terrain"].map(type => (
              <button
                key={type}
                onClick={() => setMapType(type)}
                className={`px-3 py-1.5 rounded text-xs capitalize ${
                  mapType === type ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
