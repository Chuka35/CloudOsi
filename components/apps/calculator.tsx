'use client'

import { useState, useEffect, useCallback } from 'react'
import { Menu, Delete } from 'lucide-react'

export function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  
  const clearAll = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setOperator(null)
    setPreviousValue(null)
    setWaitingForOperand(false)
  }, [])
  
  const clearEntry = useCallback(() => {
    setDisplay('0')
    setWaitingForOperand(false)
  }, [])
  
  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }, [display, waitingForOperand])
  
  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])
  
  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }, [display])
  
  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operator) {
      const result = calculate(previousValue, inputValue, operator)
      setDisplay(String(result))
      setPreviousValue(result)
    }
    
    setWaitingForOperand(true)
    setOperator(nextOperator)
    setExpression(`${previousValue ?? inputValue} ${nextOperator}`)
  }, [display, operator, previousValue])
  
  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b
      case '−': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : NaN
      default: return b
    }
  }
  
  const performEquals = useCallback(() => {
    if (operator && previousValue !== null) {
      const inputValue = parseFloat(display)
      const result = calculate(previousValue, inputValue, operator)
      
      setExpression(`${previousValue} ${operator} ${inputValue} =`)
      setDisplay(isNaN(result) || !isFinite(result) ? 'Error' : String(result))
      setPreviousValue(null)
      setOperator(null)
      setWaitingForOperand(true)
    }
  }, [display, operator, previousValue])
  
  const performPercent = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }, [display])
  
  const performReciprocal = useCallback(() => {
    const value = parseFloat(display)
    const result = 1 / value
    setDisplay(isNaN(result) || !isFinite(result) ? 'Error' : String(result))
  }, [display])
  
  const performSquare = useCallback(() => {
    const value = parseFloat(display)
    setDisplay(String(value * value))
  }, [display])
  
  const performSquareRoot = useCallback(() => {
    const value = parseFloat(display)
    const result = Math.sqrt(value)
    setDisplay(isNaN(result) ? 'Error' : String(result))
  }, [display])
  
  const toggleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1))
  }, [display])
  
  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key)
      else if (e.key === '.') inputDecimal()
      else if (e.key === '+') performOperation('+')
      else if (e.key === '-') performOperation('−')
      else if (e.key === '*') performOperation('×')
      else if (e.key === '/') { e.preventDefault(); performOperation('÷') }
      else if (e.key === 'Enter' || e.key === '=') performEquals()
      else if (e.key === 'Escape') clearAll()
      else if (e.key === 'Backspace') backspace()
      else if (e.key === 'Delete') clearEntry()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputDecimal, performOperation, performEquals, clearAll, backspace, clearEntry])
  
  const buttons = [
    ['%', 'CE', 'C', '⌫'],
    ['1/x', 'x²', '√x', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '='],
  ]
  
  const getButtonStyle = (btn: string) => {
    if (btn === '=') {
      return 'bg-[var(--accent)] hover:bg-[var(--accent)] active:bg-[#005A9E] text-white'
    }
    if (['÷', '×', '−', '+'].includes(btn)) {
      return 'bg-white/10 hover:bg-white/16 text-white'
    }
    if (['%', 'CE', 'C', '⌫'].includes(btn)) {
      return 'bg-white/5 hover:bg-white/10 text-white/80 text-base'
    }
    if (['1/x', 'x²', '√x'].includes(btn)) {
      return 'bg-white/5 hover:bg-white/10 text-white/80 text-base'
    }
    return 'bg-white/8 hover:bg-white/14 active:bg-white/6 text-white'
  }
  
  const handleButtonClick = (btn: string) => {
    switch (btn) {
      case 'C': clearAll(); break
      case 'CE': clearEntry(); break
      case '⌫': backspace(); break
      case '%': performPercent(); break
      case '1/x': performReciprocal(); break
      case 'x²': performSquare(); break
      case '√x': performSquareRoot(); break
      case '±': toggleSign(); break
      case '.': inputDecimal(); break
      case '=': performEquals(); break
      case '+':
      case '−':
      case '×':
      case '÷':
        performOperation(btn)
        break
      default:
        if (!isNaN(Number(btn))) inputDigit(btn)
    }
  }
  
  // Format display for large numbers
  const formatDisplay = (value: string) => {
    if (value === 'Error') return value
    const num = parseFloat(value)
    if (isNaN(num)) return '0'
    if (Math.abs(num) >= 1e10) return num.toExponential(4)
    return value.length > 12 ? num.toPrecision(10) : value
  }
  
  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(28, 28, 28, 0.97)' }}>
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-4 flex-shrink-0">
        <span className="text-base text-white">Standard</span>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/8">
          <Menu className="w-4 h-4 text-white/70" />
        </button>
      </div>
      
      {/* Display */}
      <div className="px-4 py-2 text-right" style={{ background: 'rgba(0, 0, 0, 0.20)' }}>
        <div className="h-5 text-sm text-white/50 truncate">{expression}</div>
        <div 
          className="text-5xl text-white font-light min-h-[60px] flex items-center justify-end"
          style={{ fontSize: display.length > 10 ? '2rem' : '3rem' }}
        >
          {formatDisplay(display)}
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex-1 p-2 grid grid-rows-6 gap-[1px]">
        {buttons.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-[1px]">
            {row.map((btn) => (
              <button
                key={btn}
                className={`flex items-center justify-center rounded text-xl transition-colors ${getButtonStyle(btn)} ${
                  btn === '0' ? 'col-span-1' : ''
                }`}
                onClick={() => handleButtonClick(btn)}
              >
                {btn === '⌫' ? <Delete className="w-5 h-5" /> : btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
