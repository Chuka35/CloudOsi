"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, IndentDecrease, IndentIncrease,
  Clipboard, Scissors, Copy, Undo, Redo, Search,
  ChevronDown
} from "lucide-react"

const tabs = ["Home", "Insert", "Design", "Layout", "References", "Review", "View"]

const fontFamilies = ["Calibri", "Arial", "Times New Roman", "Georgia", "Verdana"]
const fontSizes = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "36", "48", "72"]

const styles = [
  { name: "Normal", size: "12px", weight: "normal" },
  { name: "Heading 1", size: "24px", weight: "bold" },
  { name: "Heading 2", size: "18px", weight: "bold" },
  { name: "Title", size: "28px", weight: "bold" },
  { name: "Subtitle", size: "14px", weight: "normal" },
]

export function WordApp() {
  const [activeTab, setActiveTab] = useState("Home")
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [fontSize, setFontSize] = useState("12")
  const [fontFamily, setFontFamily] = useState("Calibri")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [zoom, setZoom] = useState(100)
  const editorRef = useRef<HTMLDivElement>(null)

  const updateCounts = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || ""
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      setWordCount(words)
      const height = editorRef.current.scrollHeight
      setPageCount(Math.max(1, Math.ceil(height / 880)))
    }
  }, [])

  useEffect(() => {
    updateCounts()
  }, [content, updateCounts])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault()
          setIsBold(!isBold)
          execCommand("bold")
          break
        case "i":
          e.preventDefault()
          setIsItalic(!isItalic)
          execCommand("italic")
          break
        case "u":
          e.preventDefault()
          setIsUnderline(!isUnderline)
          execCommand("underline")
          break
        case "z":
          e.preventDefault()
          execCommand("undo")
          break
        case "y":
          e.preventDefault()
          execCommand("redo")
          break
        case "a":
          e.preventDefault()
          execCommand("selectAll")
          break
        case "s":
          e.preventDefault()
          alert("Document saved!")
          break
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden">
      {/* Tab Bar */}
      <div className="h-7 flex items-end px-2 bg-[#2d2d2d] border-b border-white/6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-full px-4 text-xs transition-colors ${
              activeTab === tab
                ? "bg-[#1e1e1e] text-white border-b-2 border-[#185ABD]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon */}
      {activeTab === "Home" && (
        <div className="h-[80px] flex items-center gap-4 px-4 bg-[#2d2d2d] border-b border-white/6">
          {/* Clipboard Group */}
          <div className="flex flex-col items-center gap-1 px-3 border-r border-white/10">
            <div className="flex gap-1">
              <button className="p-2 hover:bg-white/10 rounded" title="Paste">
                <Clipboard className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded" title="Cut">
                <Scissors className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded" title="Copy">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[9px] text-white/40">Clipboard</span>
          </div>

          {/* Font Group */}
          <div className="flex flex-col gap-1 px-3 border-r border-white/10">
            <div className="flex items-center gap-1">
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value)
                  execCommand("fontName", e.target.value)
                }}
                className="h-6 px-2 bg-white/10 rounded text-xs outline-none w-28"
              >
                {fontFamilies.map((f) => (
                  <option key={f} value={f} className="bg-[#2d2d2d]">{f}</option>
                ))}
              </select>
              <select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value)
                  execCommand("fontSize", "7")
                  const sel = window.getSelection()
                  if (sel && sel.rangeCount > 0) {
                    const span = sel.anchorNode?.parentElement
                    if (span) span.style.fontSize = e.target.value + "px"
                  }
                }}
                className="h-6 px-2 bg-white/10 rounded text-xs outline-none w-14"
              >
                {fontSizes.map((s) => (
                  <option key={s} value={s} className="bg-[#2d2d2d]">{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => { setIsBold(!isBold); execCommand("bold") }}
                className={`w-7 h-7 flex items-center justify-center rounded ${isBold ? "bg-white/20" : "hover:bg-white/10"}`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setIsItalic(!isItalic); execCommand("italic") }}
                className={`w-7 h-7 flex items-center justify-center rounded ${isItalic ? "bg-white/20" : "hover:bg-white/10"}`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setIsUnderline(!isUnderline); execCommand("underline") }}
                className={`w-7 h-7 flex items-center justify-center rounded ${isUnderline ? "bg-white/20" : "hover:bg-white/10"}`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand("strikeThrough")}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[9px] text-white/40 text-center">Font</span>
          </div>

          {/* Paragraph Group */}
          <div className="flex flex-col gap-1 px-3 border-r border-white/10">
            <div className="flex items-center gap-0.5">
              <button onClick={() => execCommand("insertUnorderedList")} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10" title="Bullets">
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => execCommand("insertOrderedList")} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10" title="Numbering">
                <ListOrdered className="w-4 h-4" />
              </button>
              <button onClick={() => execCommand("outdent")} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10" title="Decrease Indent">
                <IndentDecrease className="w-4 h-4" />
              </button>
              <button onClick={() => execCommand("indent")} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10" title="Increase Indent">
                <IndentIncrease className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => execCommand("justifyLeft")} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10" title="Align Left">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button onClick={() => execCommand("justifyCenter")} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10" title="Center">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button onClick={() => execCommand("justifyRight")} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10" title="Align Right">
                <AlignRight className="w-4 h-4" />
              </button>
              <button onClick={() => execCommand("justifyFull")} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10" title="Justify">
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[9px] text-white/40 text-center">Paragraph</span>
          </div>

          {/* Styles Group */}
          <div className="flex flex-col gap-1 px-3">
            <div className="flex gap-1">
              {styles.map((style) => (
                <button
                  key={style.name}
                  onClick={() => {
                    execCommand("fontSize", "7")
                    const sel = window.getSelection()
                    if (sel && sel.rangeCount > 0 && sel.anchorNode?.parentElement) {
                      sel.anchorNode.parentElement.style.fontSize = style.size
                      sel.anchorNode.parentElement.style.fontWeight = style.weight
                    }
                  }}
                  className="px-2 py-1 text-[10px] bg-white/5 hover:bg-white/10 rounded border border-white/10 truncate"
                >
                  {style.name}
                </button>
              ))}
            </div>
            <span className="text-[9px] text-white/40 text-center">Styles</span>
          </div>

          {/* Edit Group */}
          <div className="flex items-center gap-1 ml-auto">
            <button onClick={() => execCommand("undo")} className="p-2 hover:bg-white/10 rounded" title="Undo (Ctrl+Z)">
              <Undo className="w-4 h-4" />
            </button>
            <button onClick={() => execCommand("redo")} className="p-2 hover:bg-white/10 rounded" title="Redo (Ctrl+Y)">
              <Redo className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded" title="Find">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Area */}
      <div className="flex-1 overflow-auto bg-[#808080] p-8">
        <div 
          className="mx-auto bg-white shadow-lg"
          style={{
            width: "680px",
            minHeight: "880px",
            padding: "72px",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              setContent(e.currentTarget.innerText)
              updateCounts()
            }}
            onKeyDown={handleKeyDown}
            className="min-h-full outline-none text-black leading-relaxed"
            style={{
              fontFamily: fontFamily,
              fontSize: `${fontSize}px`,
              lineHeight: 1.5,
            }}
            data-placeholder="Start typing your document..."
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 flex items-center justify-between px-4 bg-[#185ABD] text-xs">
        <div className="flex items-center gap-6">
          <span>Page {pageCount} of {pageCount}</span>
          <span>{wordCount} words</span>
          <span>English (US)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{zoom}%</span>
          <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="px-1 hover:bg-white/20 rounded">-</button>
          <input
            type="range"
            min="50"
            max="200"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-20 h-1 accent-white"
          />
          <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="px-1 hover:bg-white/20 rounded">+</button>
        </div>
      </div>

      <style jsx>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
