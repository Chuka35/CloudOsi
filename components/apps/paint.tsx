'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  PencilLine, 
  Droplets, 
  Type, 
  Eraser, 
  Pipette,
  Minus,
  Square,
  Circle,
  Triangle
} from 'lucide-react'

const colors = [
  '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF',
  '#FF0000', '#800000', '#FFA500', '#FFFF00', '#FFFFE0',
  '#00FF00', '#008000', '#00FFFF', '#008080',
  '#0000FF', '#000080', '#FF00FF', '#FF69B4',
]

const tools = [
  { id: 'pencil', icon: PencilLine, label: 'Pencil' },
  { id: 'fill', icon: Droplets, label: 'Fill' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'picker', icon: Pipette, label: 'Color Picker' },
]

const brushSizes = [2, 4, 6, 8, 12]

export function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('pencil')
  const [color1, setColor1] = useState('#000000')
  const [color2, setColor2] = useState('#FFFFFF')
  const [brushSize, setBrushSize] = useState(4)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Fill with white
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])
  
  const getCanvasCoords = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }
  
  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    const { x, y } = getCanvasCoords(e)
    
    if (tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(true)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color1
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    } else if (tool === 'fill') {
      // Simple flood fill approximation (not perfect)
      ctx.fillStyle = color1
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }
  
  const draw = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoords(e)
    setCursorPos({ x: Math.round(x), y: Math.round(y) })
    
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  
  const stopDrawing = () => {
    setIsDrawing(false)
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Ribbon Toolbar */}
      <div 
        className="flex-shrink-0"
        style={{ 
          background: 'rgba(32, 32, 32, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Tab Bar */}
        <div className="h-7 flex items-center px-2 border-b border-white/6">
          {['Home', 'View', 'Help'].map((tab, i) => (
            <button
              key={tab}
              className={`h-7 px-3 text-[13px] ${i === 0 ? 'text-white' : 'text-white/60 hover:text-white/80'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Home Tab Content */}
        <div className="h-14 flex items-center gap-4 px-3">
          {/* Tools */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-white/40 mb-1">Tools</div>
            <div className="flex gap-1">
              {tools.map((t) => (
                <button
                  key={t.id}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                    tool === t.id ? 'bg-[var(--accent)]' : 'hover:bg-white/8'
                  }`}
                  onClick={() => setTool(t.id)}
                  title={t.label}
                >
                  <t.icon className="w-4 h-4 text-white" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-px h-10 bg-white/10" />
          
          {/* Brushes */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-white/40 mb-1">Size</div>
            <div className="flex gap-1">
              {brushSizes.map((size) => (
                <button
                  key={size}
                  className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                    brushSize === size ? 'bg-white/20' : 'hover:bg-white/8'
                  }`}
                  onClick={() => setBrushSize(size)}
                >
                  <div 
                    className="rounded-full bg-white"
                    style={{ width: size, height: size }}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-px h-10 bg-white/10" />
          
          {/* Shapes */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-white/40 mb-1">Shapes</div>
            <div className="flex gap-1">
              {[Minus, Square, Circle, Triangle].map((Icon, i) => (
                <button
                  key={i}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/8"
                >
                  <Icon className="w-4 h-4 text-white/70" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-px h-10 bg-white/10" />
          
          {/* Colors */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] text-white/40 mb-1">Colors</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div 
                  className="w-6 h-6 rounded border border-white/30"
                  style={{ background: color1 }}
                  title="Color 1"
                />
                <div 
                  className="w-6 h-6 rounded border border-white/30"
                  style={{ background: color2 }}
                  title="Color 2"
                />
              </div>
              <div className="flex flex-wrap gap-[2px] w-[152px]">
                {colors.map((c) => (
                  <button
                    key={c}
                    className="w-4 h-4 rounded-sm border border-white/10 hover:border-white/40"
                    style={{ background: c }}
                    onClick={() => setColor1(c)}
                    onContextMenu={(e) => { e.preventDefault(); setColor2(c) }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div 
        className="flex-1 overflow-auto p-5"
        style={{ background: '#808080' }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="block mx-auto cursor-crosshair"
          style={{ 
            background: '#FFFFFF',
            boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.30)',
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      
      {/* Status Bar */}
      <div 
        className="h-6 flex items-center justify-between px-3 text-[11px] text-white/40 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
      >
        <span>800 x 480px</span>
        <span>x: {cursorPos.x}, y: {cursorPos.y}</span>
        <span>No selection</span>
      </div>
    </div>
  )
}
