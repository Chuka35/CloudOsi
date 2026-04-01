"use client"

import { useState } from "react"
import { 
  Search, 
  Download, 
  Star,
  TrendingUp,
  Gamepad2,
  Palette,
  Briefcase,
  Music,
  Video,
  BookOpen,
  ChevronRight,
  Home
} from "lucide-react"

interface StoreApp {
  id: string
  name: string
  developer: string
  rating: number
  reviews: string
  category: string
  color: string
  icon: React.ElementType
}

const storeApps: StoreApp[] = [
  { id: "1", name: "Spotify", developer: "Spotify AB", rating: 4.5, reviews: "2.3M", category: "Entertainment", color: "#1db954", icon: Music },
  { id: "2", name: "Netflix", developer: "Netflix Inc", rating: 4.3, reviews: "1.8M", category: "Entertainment", color: "#e50914", icon: Video },
  { id: "3", name: "Adobe Photoshop", developer: "Adobe Inc", rating: 4.6, reviews: "890K", category: "Productivity", color: "#31a8ff", icon: Palette },
  { id: "4", name: "Minecraft", developer: "Mojang", rating: 4.8, reviews: "3.2M", category: "Games", color: "#62b341", icon: Gamepad2 },
  { id: "5", name: "Discord", developer: "Discord Inc", rating: 4.4, reviews: "1.5M", category: "Social", color: "#5865f2", icon: Briefcase },
  { id: "6", name: "Kindle", developer: "Amazon", rating: 4.2, reviews: "560K", category: "Books", color: "#ff9900", icon: BookOpen },
  { id: "7", name: "VS Code", developer: "Microsoft", rating: 4.9, reviews: "2.1M", category: "Developer", color: "#007acc", icon: Briefcase },
  { id: "8", name: "Zoom", developer: "Zoom Video", rating: 4.1, reviews: "1.2M", category: "Productivity", color: "#2d8cff", icon: Video },
]

const categories = [
  { id: "home", icon: Home, label: "Home" },
  { id: "games", icon: Gamepad2, label: "Games" },
  { id: "apps", icon: Briefcase, label: "Apps" },
  { id: "entertainment", icon: Video, label: "Entertainment" },
]

export function StoreApp() {
  const [activeCategory, setActiveCategory] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredApps = searchQuery 
    ? storeApps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : storeApps

  return (
    <div className="h-full flex bg-[#1a1a1a] text-white">
      {/* Sidebar */}
      <div className="w-56 bg-[#252525] p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#0078d4] rounded-lg flex items-center justify-center">
            <Download size={18} />
          </div>
          <span className="font-semibold">Microsoft Store</span>
        </div>

        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
              activeCategory === cat.id 
                ? "bg-[#0078d4] text-white" 
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <cat.icon size={18} />
            {cat.label}
          </button>
        ))}

        <div className="mt-auto pt-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/5 w-full">
            <Download size={18} />
            Library
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-4 bg-[#252525] rounded-lg px-4 py-2.5 max-w-xl">
            <Search size={18} className="text-white/50" />
            <input
              type="text"
              placeholder="Search apps, games, movies, and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="p-6">
          {/* Featured Banner */}
          {!searchQuery && (
            <div className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0078d4] to-[#00b4d8] p-8">
              <div className="relative z-10">
                <span className="text-xs bg-white/20 px-2 py-1 rounded mb-3 inline-block">Featured</span>
                <h2 className="text-3xl font-bold mb-2">Discover new apps</h2>
                <p className="text-white/80 mb-4 max-w-md">
                  Explore thousands of apps and games for your Windows device
                </p>
                <button className="px-6 py-2 bg-white text-[#0078d4] rounded-md font-medium text-sm hover:bg-white/90 transition-colors">
                  Explore Now
                </button>
              </div>
              <div className="absolute right-8 bottom-0 opacity-20">
                <Download size={200} />
              </div>
            </div>
          )}

          {/* Trending Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-[#0078d4]" />
                <h3 className="text-lg font-semibold">
                  {searchQuery ? `Results for "${searchQuery}"` : "Trending Now"}
                </h3>
              </div>
              {!searchQuery && (
                <button className="flex items-center gap-1 text-sm text-[#0078d4] hover:underline">
                  See all <ChevronRight size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {filteredApps.map(app => (
                <div key={app.id} className="bg-[#252525] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer group">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: app.color }}
                  >
                    <app.icon size={28} className="text-white" />
                  </div>
                  <h4 className="font-medium mb-1 truncate">{app.name}</h4>
                  <p className="text-xs text-white/50 mb-2 truncate">{app.developer}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-yellow-500 text-yellow-500" />
                      <span className="text-xs">{app.rating}</span>
                    </div>
                    <span className="text-xs text-white/40">({app.reviews})</span>
                  </div>
                  <button className="mt-3 w-full py-2 bg-[#0078d4] hover:bg-[#006cbd] rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Get
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          {!searchQuery && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
              <div className="grid grid-cols-6 gap-3">
                {[
                  { name: "Games", color: "#22c55e", icon: Gamepad2 },
                  { name: "Productivity", color: "#3b82f6", icon: Briefcase },
                  { name: "Entertainment", color: "#ef4444", icon: Video },
                  { name: "Music", color: "#f59e0b", icon: Music },
                  { name: "Design", color: "#8b5cf6", icon: Palette },
                  { name: "Books", color: "#06b6d4", icon: BookOpen },
                ].map(cat => (
                  <button
                    key={cat.name}
                    className="flex flex-col items-center gap-2 p-4 bg-[#252525] rounded-xl hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <cat.icon size={24} style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
