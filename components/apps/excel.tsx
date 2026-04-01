"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronDown, Plus } from "lucide-react"

const COLS = 26
const ROWS = 100
const COL_WIDTH = 100
const ROW_HEIGHT = 24

const getColName = (index: number): string => {
  let name = ""
  while (index >= 0) {
    name = String.fromCharCode((index % 26) + 65) + name
    index = Math.floor(index / 26) - 1
  }
  return name
}

const getCellRef = (row: number, col: number): string => `${getColName(col)}${row + 1}`

const initialData: Record<string, string> = {
  "A1": "Month", "B1": "Revenue", "C1": "Expenses", "D1": "Profit",
  "A2": "Jan", "B2": "12000", "C2": "8000", "D2": "=B2-C2",
  "A3": "Feb", "B3": "15000", "C3": "9500", "D3": "=B3-C3",
  "A4": "Mar", "B4": "13500", "C4": "8200", "D4": "=B4-C4",
  "A5": "Apr", "B5": "16000", "C5": "9000", "D5": "=B5-C5",
  "A6": "May", "B6": "18500", "C6": "10500", "D6": "=B6-C6",
  "A7": "Jun", "B7": "17000", "C7": "9800", "D7": "=B7-C7",
  "A8": "Total", "B8": "=SUM(B2:B7)", "C8": "=SUM(C2:C7)", "D8": "=SUM(D2:D7)",
}

export function ExcelApp() {
  const [data, setData] = useState<Record<string, string>>(initialData)
  const [selectedCell, setSelectedCell] = useState<string>("A1")
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [activeSheet, setActiveSheet] = useState(0)
  const [selection, setSelection] = useState<{ start: string; end: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const parseFormula = useCallback((formula: string, cellData: Record<string, string>): string => {
    if (!formula.startsWith("=")) return formula

    const expr = formula.substring(1).toUpperCase()
    
    // Handle range functions
    const rangeMatch = expr.match(/^(SUM|AVERAGE|MAX|MIN|COUNT)\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/)
    if (rangeMatch) {
      const [, func, startCol, startRow, endCol, endRow] = rangeMatch
      const startColIdx = startCol.charCodeAt(0) - 65
      const endColIdx = endCol.charCodeAt(0) - 65
      const startRowIdx = parseInt(startRow) - 1
      const endRowIdx = parseInt(endRow) - 1
      
      const values: number[] = []
      for (let r = startRowIdx; r <= endRowIdx; r++) {
        for (let c = startColIdx; c <= endColIdx; c++) {
          const ref = getCellRef(r, c)
          const val = cellData[ref]
          if (val) {
            const parsed = parseFormula(val, cellData)
            const num = parseFloat(parsed)
            if (!isNaN(num)) values.push(num)
          }
        }
      }
      
      if (values.length === 0) return "0"
      
      switch (func) {
        case "SUM": return values.reduce((a, b) => a + b, 0).toString()
        case "AVERAGE": return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
        case "MAX": return Math.max(...values).toString()
        case "MIN": return Math.min(...values).toString()
        case "COUNT": return values.length.toString()
      }
    }

    // Handle simple arithmetic: =B2-C2, =B2+C2, etc.
    const simpleMatch = expr.match(/^([A-Z]+\d+)([\+\-\*\/])([A-Z]+\d+)$/)
    if (simpleMatch) {
      const [, ref1, op, ref2] = simpleMatch
      const val1 = parseFloat(parseFormula(cellData[ref1] || "0", cellData))
      const val2 = parseFloat(parseFormula(cellData[ref2] || "0", cellData))
      
      if (isNaN(val1) || isNaN(val2)) return "#VALUE!"
      
      switch (op) {
        case "+": return (val1 + val2).toString()
        case "-": return (val1 - val2).toString()
        case "*": return (val1 * val2).toString()
        case "/": return val2 !== 0 ? (val1 / val2).toString() : "#DIV/0!"
      }
    }

    return formula
  }, [])

  const getCellDisplay = useCallback((ref: string): string => {
    const value = data[ref]
    if (!value) return ""
    return parseFormula(value, data)
  }, [data, parseFormula])

  const handleCellClick = (ref: string) => {
    setSelectedCell(ref)
    setEditingCell(null)
  }

  const handleCellDoubleClick = (ref: string) => {
    setEditingCell(ref)
    setEditValue(data[ref] || "")
  }

  const handleCellBlur = () => {
    if (editingCell) {
      setData(prev => ({ ...prev, [editingCell]: editValue }))
      setEditingCell(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return

    const match = selectedCell.match(/([A-Z]+)(\d+)/)
    if (!match) return

    const col = match[1].charCodeAt(0) - 65
    const row = parseInt(match[2]) - 1

    if (editingCell) {
      if (e.key === "Enter") {
        e.preventDefault()
        setData(prev => ({ ...prev, [editingCell]: editValue }))
        setEditingCell(null)
        if (row < ROWS - 1) {
          setSelectedCell(getCellRef(row + 1, col))
        }
      } else if (e.key === "Escape") {
        setEditingCell(null)
      }
      return
    }

    switch (e.key) {
      case "Enter":
        e.preventDefault()
        if (row < ROWS - 1) setSelectedCell(getCellRef(row + 1, col))
        break
      case "Tab":
        e.preventDefault()
        if (col < COLS - 1) setSelectedCell(getCellRef(row, col + 1))
        break
      case "ArrowUp":
        e.preventDefault()
        if (row > 0) setSelectedCell(getCellRef(row - 1, col))
        break
      case "ArrowDown":
        e.preventDefault()
        if (row < ROWS - 1) setSelectedCell(getCellRef(row + 1, col))
        break
      case "ArrowLeft":
        e.preventDefault()
        if (col > 0) setSelectedCell(getCellRef(row, col - 1))
        break
      case "ArrowRight":
        e.preventDefault()
        if (col < COLS - 1) setSelectedCell(getCellRef(row, col + 1))
        break
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          setEditingCell(selectedCell)
          setEditValue(e.key)
        }
    }
  }

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])

  const selectedCol = selectedCell.match(/([A-Z]+)/)?.[1].charCodeAt(0) - 65
  const selectedRow = parseInt(selectedCell.match(/(\d+)/)?.[1] || "1") - 1

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Ribbon */}
      <div className="h-[60px] flex items-center gap-3 px-4 bg-[#2d2d2d] border-b border-white/6">
        <div className="flex items-center gap-2 px-3 border-r border-white/10">
          {["Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "View"].map((tab, i) => (
            <button
              key={tab}
              className={`px-3 py-1 text-xs rounded ${i === 0 ? "bg-[#107C41] text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Bar */}
      <div className="h-8 flex items-center bg-[#2d2d2d] border-b border-white/6">
        <div className="w-[120px] px-3 border-r border-white/10 text-sm font-medium">
          {selectedCell}
        </div>
        <div className="px-3 text-white/60 text-sm">fx</div>
        <input
          type="text"
          value={editingCell ? editValue : (data[selectedCell] || "")}
          onChange={(e) => {
            if (editingCell) {
              setEditValue(e.target.value)
            } else {
              setEditingCell(selectedCell)
              setEditValue(e.target.value)
            }
          }}
          onBlur={handleCellBlur}
          className="flex-1 bg-transparent px-2 text-sm outline-none"
        />
      </div>

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          {/* Column Headers */}
          <div className="flex sticky top-0 z-10">
            <div className="w-[50px] h-[26px] bg-[#2d2d2d] border-r border-b border-white/10 flex-shrink-0" />
            {Array.from({ length: COLS }, (_, i) => (
              <div
                key={i}
                className={`h-[26px] flex items-center justify-center text-xs font-medium border-r border-b border-white/10 flex-shrink-0 ${
                  i === selectedCol ? "bg-[#107C41]/30" : "bg-[#2d2d2d]"
                }`}
                style={{ width: COL_WIDTH }}
              >
                {getColName(i)}
              </div>
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: ROWS }, (_, rowIdx) => (
            <div key={rowIdx} className="flex">
              {/* Row Header */}
              <div
                className={`w-[50px] h-[24px] flex items-center justify-center text-xs font-medium border-r border-b border-white/10 flex-shrink-0 sticky left-0 z-10 ${
                  rowIdx === selectedRow ? "bg-[#107C41]/30" : "bg-[#2d2d2d]"
                }`}
              >
                {rowIdx + 1}
              </div>

              {/* Cells */}
              {Array.from({ length: COLS }, (_, colIdx) => {
                const ref = getCellRef(rowIdx, colIdx)
                const isSelected = ref === selectedCell
                const isEditing = ref === editingCell

                return (
                  <div
                    key={colIdx}
                    className={`h-[24px] border-r border-b border-white/6 flex-shrink-0 relative ${
                      isSelected ? "ring-2 ring-[#107C41] ring-inset bg-[#107C41]/10" : "hover:bg-white/5"
                    }`}
                    style={{ width: COL_WIDTH }}
                    onClick={() => handleCellClick(ref)}
                    onDoubleClick={() => handleCellDoubleClick(ref)}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        className="absolute inset-0 w-full h-full px-1 bg-white text-black text-sm outline-none"
                      />
                    ) : (
                      <div className="px-1 text-sm truncate leading-[24px]">
                        {getCellDisplay(ref)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sheet Tabs */}
      <div className="h-6 flex items-center bg-[#2d2d2d] border-t border-white/6">
        {["Sheet1", "Sheet2", "Sheet3"].map((sheet, i) => (
          <button
            key={sheet}
            onClick={() => setActiveSheet(i)}
            className={`h-full px-4 text-xs ${
              i === activeSheet
                ? "bg-[#107C41]/20 text-white border-t-2 border-[#107C41]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {sheet}
          </button>
        ))}
        <button className="px-3 text-white/40 hover:text-white">
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Status Bar */}
      <div className="h-5 flex items-center justify-between px-4 bg-[#107C41] text-xs">
        <span>Ready</span>
        <div className="flex items-center gap-4">
          <span>Average:</span>
          <span>Count:</span>
          <span>Sum:</span>
        </div>
      </div>
    </div>
  )
}
