"use client"

import { useState } from "react"
import { 
  Image, 
  Grid3X3, 
  LayoutGrid, 
  Heart, 
  Trash2, 
  Download,
  Share2,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FolderOpen
} from "lucide-react"

interface Photo {
  id: string
  url: string
  name: string
  date: string
  favorite: boolean
}

const generatePlaceholderPhotos = (): Photo[] => {
  const colors = ["3b82f6", "ef4444", "22c55e", "f59e0b", "8b5cf6", "ec4899", "06b6d4", "84cc16"]
  return Array.from({ length: 24 }, (_, i) => ({
    id: `photo-${i}`,
    url: `https://placehold.co/400x300/${colors[i % colors.length]}/ffffff?text=Photo+${i + 1}`,
    name: `Photo ${i + 1}.jpg`,
    date: new Date(2024, Math.floor(i / 4), (i % 28) + 1).toLocaleDateString(),
    favorite: i % 5 === 0
  }))
}

export function PhotosApp() {
  const [photos] = useState<Photo[]>(generatePlaceholderPhotos)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "large">("grid")
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "albums">("all")

  const filteredPhotos = activeTab === "favorites" 
    ? photos.filter(p => p.favorite) 
    : photos

  const currentIndex = selectedPhoto 
    ? filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
    : -1

  const navigatePhoto = (direction: "prev" | "next") => {
    if (!selectedPhoto) return
    const newIndex = direction === "prev" 
      ? (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      : (currentIndex + 1) % filteredPhotos.length
    setSelectedPhoto(filteredPhotos[newIndex])
  }

  return (
    <div className="h-full flex flex-col bg-[#202020] text-white">
      {/* Header */}
      <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <Image size={20} className="text-[#0078d4]" />
          <span className="font-medium">Photos</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center gap-1">
          {[
            { id: "all", icon: LayoutGrid, label: "All Photos" },
            { id: "favorites", icon: Heart, label: "Favorites" },
            { id: "albums", icon: FolderOpen, label: "Albums" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-colors ${
                activeTab === tab.id 
                  ? "bg-white/10 text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid" ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode("large")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "large" ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "albums" ? (
          <div className="grid grid-cols-4 gap-4">
            {["Vacation", "Family", "Work", "Screenshots"].map(album => (
              <div key={album} className="group cursor-pointer">
                <div className="aspect-square bg-white/5 rounded-lg overflow-hidden mb-2 relative">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="bg-white/10 rounded-sm" />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <span className="text-sm">{album}</span>
                <span className="text-xs text-white/50 block">12 items</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-2 ${
            viewMode === "grid" 
              ? "grid-cols-6" 
              : "grid-cols-4"
          }`}>
            {filteredPhotos.map(photo => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square bg-white/5 rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn size={24} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {photo.favorite && (
                  <Heart size={16} className="absolute top-2 right-2 fill-red-500 text-red-500" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col">
          <div className="h-12 flex items-center justify-between px-4 border-b border-white/10">
            <span className="text-sm">{selectedPhoto.name}</span>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-md">
                <Heart size={18} className={selectedPhoto.favorite ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-md">
                <Share2 size={18} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-md">
                <Download size={18} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-md">
                <Trash2 size={18} />
              </button>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="p-2 hover:bg-white/10 rounded-md ml-2"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative">
            <button
              onClick={() => navigatePhoto("prev")}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="max-h-full max-w-full object-contain"
            />
            
            <button
              onClick={() => navigatePhoto("next")}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="h-12 flex items-center justify-center gap-2 text-sm text-white/60">
            <Calendar size={14} />
            {selectedPhoto.date}
          </div>
        </div>
      )}
    </div>
  )
}
