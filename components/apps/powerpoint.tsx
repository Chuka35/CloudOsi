"use client"

import { useState } from "react"
import { Plus, Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react"

interface Slide {
  id: number
  title: string
  subtitle?: string
  content?: string
  layout: "title" | "content" | "two-column" | "image" | "blank"
}

const initialSlides: Slide[] = [
  { id: 1, layout: "title", title: "CloudOS Presentation", subtitle: "Your computer. Anywhere." },
  { id: 2, layout: "content", title: "What is CloudOS?", content: "CloudOS is a full operating system that runs entirely in your browser. No downloads, no installations, no expensive hardware." },
  { id: 3, layout: "two-column", title: "Key Features", content: "Built-in apps\nCloud storage\nWorks anywhere\nAI assistant" },
  { id: 4, layout: "image", title: "Works on Any Device", content: "Phone, tablet, laptop, or desktop - if it has a browser, it runs CloudOS." },
  { id: 5, layout: "blank", title: "Thank You!", subtitle: "Questions?" },
]

const tabs = ["Home", "Insert", "Design", "Transitions", "Animations", "Slide Show", "Review", "View"]

export function PowerPointApp() {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedElement, setSelectedElement] = useState<"title" | "subtitle" | "content" | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      layout: "content",
      title: "New Slide",
      content: "Click to add content",
    }
    const newSlides = [...slides]
    newSlides.splice(currentSlide + 1, 0, newSlide)
    setSlides(newSlides)
    setCurrentSlide(currentSlide + 1)
  }

  const deleteSlide = () => {
    if (slides.length <= 1) return
    const newSlides = slides.filter((_, i) => i !== currentSlide)
    setSlides(newSlides)
    setCurrentSlide(Math.max(0, currentSlide - 1))
  }

  const duplicateSlide = () => {
    const newSlide = { ...slides[currentSlide], id: Date.now() }
    const newSlides = [...slides]
    newSlides.splice(currentSlide + 1, 0, newSlide)
    setSlides(newSlides)
    setCurrentSlide(currentSlide + 1)
  }

  const moveSlide = (direction: "up" | "down") => {
    const newIndex = direction === "up" ? currentSlide - 1 : currentSlide + 1
    if (newIndex < 0 || newIndex >= slides.length) return
    
    const newSlides = [...slides]
    const temp = newSlides[currentSlide]
    newSlides[currentSlide] = newSlides[newIndex]
    newSlides[newIndex] = temp
    setSlides(newSlides)
    setCurrentSlide(newIndex)
  }

  const updateSlideContent = (field: "title" | "subtitle" | "content", value: string) => {
    const newSlides = [...slides]
    newSlides[currentSlide] = { ...newSlides[currentSlide], [field]: value }
    setSlides(newSlides)
  }

  const slide = slides[currentSlide]

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Tab Bar */}
      <div className="h-7 flex items-end px-2 bg-[#2d2d2d] border-b border-white/6">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`h-full px-3 text-xs transition-colors ${
              i === 0
                ? "bg-[#1e1e1e] text-white border-b-2 border-[#C43E1C]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon */}
      <div className="h-[60px] flex items-center gap-4 px-4 bg-[#2d2d2d] border-b border-white/6">
        <button
          onClick={addSlide}
          className="flex items-center gap-2 px-3 py-2 bg-[#C43E1C] hover:bg-[#D94C2A] rounded text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Slide
        </button>
        <div className="flex items-center gap-1 px-3 border-l border-white/10">
          <button onClick={duplicateSlide} className="p-2 hover:bg-white/10 rounded" title="Duplicate">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={deleteSlide} className="p-2 hover:bg-white/10 rounded" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => moveSlide("up")} className="p-2 hover:bg-white/10 rounded" title="Move Up">
            <ChevronUp className="w-4 h-4" />
          </button>
          <button onClick={() => moveSlide("down")} className="p-2 hover:bg-white/10 rounded" title="Move Down">
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Slide Panel */}
        <div className="w-[200px] bg-[#252525] border-r border-white/6 overflow-y-auto p-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(i)}
              className={`w-full mb-2 rounded overflow-hidden border-2 transition-colors ${
                i === currentSlide ? "border-[#C43E1C]" : "border-transparent hover:border-white/20"
              }`}
            >
              <div className="relative">
                <div className="absolute top-1 left-1 w-5 h-5 bg-black/50 rounded text-[10px] flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="aspect-video bg-white p-2 flex flex-col items-center justify-center">
                  <div className="text-[8px] font-bold text-black truncate w-full text-center">{s.title}</div>
                  {s.subtitle && (
                    <div className="text-[6px] text-gray-500 truncate w-full text-center">{s.subtitle}</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Slide Canvas */}
          <div className="flex-1 bg-[#3d3d3d] p-8 overflow-auto flex items-center justify-center">
            <div 
              className="bg-white shadow-2xl relative"
              style={{ 
                width: "720px", 
                aspectRatio: "16/9",
              }}
            >
              {/* Title Slide */}
              {slide.layout === "title" && (
                <div className="h-full flex flex-col items-center justify-center p-12">
                  <div
                    onClick={() => setSelectedElement("title")}
                    onDoubleClick={() => setIsEditing(true)}
                    className={`w-full text-center cursor-text ${selectedElement === "title" ? "ring-2 ring-[#C43E1C]" : ""}`}
                  >
                    {isEditing && selectedElement === "title" ? (
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => updateSlideContent("title", e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        autoFocus
                        className="w-full text-center text-4xl font-bold text-black outline-none"
                      />
                    ) : (
                      <h1 className="text-4xl font-bold text-black">{slide.title}</h1>
                    )}
                  </div>
                  {slide.subtitle && (
                    <div
                      onClick={() => setSelectedElement("subtitle")}
                      onDoubleClick={() => setIsEditing(true)}
                      className={`w-full text-center mt-4 cursor-text ${selectedElement === "subtitle" ? "ring-2 ring-[#C43E1C]" : ""}`}
                    >
                      {isEditing && selectedElement === "subtitle" ? (
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => updateSlideContent("subtitle", e.target.value)}
                          onBlur={() => setIsEditing(false)}
                          autoFocus
                          className="w-full text-center text-xl text-gray-600 outline-none"
                        />
                      ) : (
                        <p className="text-xl text-gray-600">{slide.subtitle}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Content Slide */}
              {slide.layout === "content" && (
                <div className="h-full flex flex-col p-8">
                  <div
                    onClick={() => setSelectedElement("title")}
                    onDoubleClick={() => setIsEditing(true)}
                    className={`cursor-text ${selectedElement === "title" ? "ring-2 ring-[#C43E1C]" : ""}`}
                  >
                    {isEditing && selectedElement === "title" ? (
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => updateSlideContent("title", e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        autoFocus
                        className="w-full text-2xl font-bold text-black outline-none"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-black">{slide.title}</h2>
                    )}
                  </div>
                  <div
                    onClick={() => setSelectedElement("content")}
                    onDoubleClick={() => setIsEditing(true)}
                    className={`flex-1 mt-6 cursor-text ${selectedElement === "content" ? "ring-2 ring-[#C43E1C]" : ""}`}
                  >
                    {isEditing && selectedElement === "content" ? (
                      <textarea
                        value={slide.content || ""}
                        onChange={(e) => updateSlideContent("content", e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        autoFocus
                        className="w-full h-full text-lg text-gray-700 outline-none resize-none"
                      />
                    ) : (
                      <p className="text-lg text-gray-700 whitespace-pre-line">{slide.content}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Two Column Slide */}
              {slide.layout === "two-column" && (
                <div className="h-full flex flex-col p-8">
                  <div
                    onClick={() => setSelectedElement("title")}
                    onDoubleClick={() => setIsEditing(true)}
                    className={`cursor-text ${selectedElement === "title" ? "ring-2 ring-[#C43E1C]" : ""}`}
                  >
                    <h2 className="text-2xl font-bold text-black">{slide.title}</h2>
                  </div>
                  <div className="flex-1 mt-6 grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      {(slide.content || "").split("\n").slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#C43E1C]" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3">
                      {(slide.content || "").split("\n").slice(2).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#C43E1C]" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Image Slide */}
              {slide.layout === "image" && (
                <div className="h-full flex flex-col p-8">
                  <h2 className="text-2xl font-bold text-black">{slide.title}</h2>
                  <div className="flex-1 mt-6 flex items-center justify-center">
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <p className="text-lg">{slide.content}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Blank/Thank You Slide */}
              {slide.layout === "blank" && (
                <div className="h-full flex flex-col items-center justify-center p-12">
                  <h1 className="text-5xl font-bold text-black">{slide.title}</h1>
                  {slide.subtitle && (
                    <p className="mt-4 text-2xl text-gray-500">{slide.subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="h-[100px] bg-[#252525] border-t border-white/6 p-3">
            <textarea
              placeholder="Click to add notes..."
              className="w-full h-full bg-transparent text-sm text-white/60 outline-none resize-none placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-[200px] bg-[#252525] border-l border-white/6 p-4">
          <h3 className="text-sm font-medium mb-4">Properties</h3>
          {selectedElement && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60">Position</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" placeholder="X" className="w-full bg-white/10 rounded px-2 py-1 text-xs" />
                  <input type="number" placeholder="Y" className="w-full bg-white/10 rounded px-2 py-1 text-xs" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60">Size</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" placeholder="W" className="w-full bg-white/10 rounded px-2 py-1 text-xs" />
                  <input type="number" placeholder="H" className="w-full bg-white/10 rounded px-2 py-1 text-xs" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-5 flex items-center justify-between px-4 bg-[#C43E1C] text-xs">
        <span>Slide {currentSlide + 1} of {slides.length}</span>
        <span>CloudOS Presentation</span>
      </div>
    </div>
  )
}
