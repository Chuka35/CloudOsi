"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Gamepad2, 
  RotateCcw,
  Trophy,
  Play,
  Pause,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from "lucide-react"

type GameType = "snake" | "2048" | null

// Snake Game
const GRID_SIZE = 20
const CELL_SIZE = 15

interface Point {
  x: number
  y: number
}

function SnakeGame({ onBack }: { onBack: () => void }) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Point>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(true)
  const [score, setScore] = useState(0)

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    return newFood
  }, [])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection({ x: 1, y: 0 })
    setGameOver(false)
    setScore(0)
    setIsPaused(true)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return
      
      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 })
          break
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 })
          break
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 })
          break
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 })
          break
        case " ":
          setIsPaused(p => !p)
          break
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [direction, gameOver])

  useEffect(() => {
    if (isPaused || gameOver) return

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0]
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood())
          setScore(s => s + 10)
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, 100)

    return () => clearInterval(interval)
  }, [direction, food, isPaused, gameOver, generateFood])

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#1a1a1a] p-4">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">Snake</h2>
        <div className="flex items-center gap-2 ml-4">
          <Trophy size={16} className="text-yellow-500" />
          <span>{score}</span>
        </div>
      </div>

      <div 
        className="border-2 border-[#0078d4] rounded-lg overflow-hidden mb-4"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        <div className="relative w-full h-full bg-[#0a0a0a]">
          {/* Food */}
          <div
            className="absolute bg-red-500 rounded-sm"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2
            }}
          />
          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className={`absolute rounded-sm ${i === 0 ? "bg-[#0078d4]" : "bg-[#00b4d8]"}`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2
              }}
            />
          ))}
          
          {/* Overlay */}
          {(gameOver || isPaused) && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
              <span className="text-lg font-bold mb-2">
                {gameOver ? "Game Over!" : "Paused"}
              </span>
              {gameOver && <span className="text-sm text-white/60 mb-4">Score: {score}</span>}
              <button
                onClick={gameOver ? resetGame : () => setIsPaused(false)}
                className="px-4 py-2 bg-[#0078d4] hover:bg-[#006cbd] rounded text-sm"
              >
                {gameOver ? "Play Again" : "Resume"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 text-xs text-white/50">
        <span>Arrow keys to move</span>
        <span>|</span>
        <span>Space to pause</span>
      </div>
    </div>
  )
}

// 2048 Game
function Game2048({ onBack }: { onBack: () => void }) {
  const [grid, setGrid] = useState<number[][]>(() => initGrid())
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  function initGrid(): number[][] {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0))
    addRandomTile(newGrid)
    addRandomTile(newGrid)
    return newGrid
  }

  function addRandomTile(grid: number[][]) {
    const empty: [number, number][] = []
    grid.forEach((row, i) => row.forEach((cell, j) => {
      if (cell === 0) empty.push([i, j])
    }))
    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)]
      grid[i][j] = Math.random() < 0.9 ? 2 : 4
    }
  }

  function move(dir: "up" | "down" | "left" | "right") {
    if (gameOver) return

    const newGrid = JSON.parse(JSON.stringify(grid))
    let moved = false
    let newScore = 0

    const rotate = (grid: number[][]) => grid[0].map((_, i) => grid.map(row => row[i]).reverse())

    let rotations = { up: 1, right: 2, down: 3, left: 0 }[dir]
    for (let r = 0; r < rotations; r++) newGrid.splice(0, 4, ...rotate(newGrid))

    for (let i = 0; i < 4; i++) {
      const row = newGrid[i].filter((x: number) => x !== 0)
      const merged: number[] = []
      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1]) {
          merged.push(row[j] * 2)
          newScore += row[j] * 2
          j++
        } else {
          merged.push(row[j])
        }
      }
      while (merged.length < 4) merged.push(0)
      if (newGrid[i].toString() !== merged.toString()) moved = true
      newGrid[i] = merged
    }

    for (let r = 0; r < (4 - rotations) % 4; r++) newGrid.splice(0, 4, ...rotate(newGrid))

    if (moved) {
      addRandomTile(newGrid)
      setGrid(newGrid)
      setScore(s => s + newScore)

      // Check game over
      let canMove = false
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (newGrid[i][j] === 0) canMove = true
          if (i < 3 && newGrid[i][j] === newGrid[i + 1][j]) canMove = true
          if (j < 3 && newGrid[i][j] === newGrid[i][j + 1]) canMove = true
        }
      }
      if (!canMove) setGameOver(true)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        move(e.key.replace("Arrow", "").toLowerCase() as "up" | "down" | "left" | "right")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [grid, gameOver])

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: "#3c3a32",
      2: "#eee4da",
      4: "#ede0c8",
      8: "#f2b179",
      16: "#f59563",
      32: "#f67c5f",
      64: "#f65e3b",
      128: "#edcf72",
      256: "#edcc61",
      512: "#edc850",
      1024: "#edc53f",
      2048: "#edc22e",
    }
    return colors[value] || "#3c3a32"
  }

  const getTextColor = (value: number) => value <= 4 ? "#776e65" : "#f9f6f2"

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#faf8ef] p-4">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-black/10 rounded text-[#776e65]">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-3xl font-bold text-[#776e65]">2048</h2>
        <div className="flex items-center gap-4 ml-4">
          <div className="bg-[#bbada0] rounded px-4 py-2 text-center">
            <div className="text-xs text-white/70">SCORE</div>
            <div className="text-white font-bold">{score}</div>
          </div>
          <button
            onClick={() => {
              setGrid(initGrid())
              setScore(0)
              setGameOver(false)
            }}
            className="p-2 bg-[#8f7a66] hover:bg-[#9f8b77] rounded text-white"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="bg-[#bbada0] rounded-lg p-2 relative">
        <div className="grid grid-cols-4 gap-2">
          {grid.flat().map((value, i) => (
            <div
              key={i}
              className="w-16 h-16 rounded flex items-center justify-center text-2xl font-bold transition-all"
              style={{
                backgroundColor: getTileColor(value),
                color: getTextColor(value),
                fontSize: value >= 1000 ? "18px" : value >= 100 ? "24px" : "28px"
              }}
            >
              {value || ""}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-white/80 rounded-lg flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#776e65] mb-2">Game Over!</span>
            <button
              onClick={() => {
                setGrid(initGrid())
                setScore(0)
                setGameOver(false)
              }}
              className="px-4 py-2 bg-[#8f7a66] hover:bg-[#9f8b77] rounded text-white"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1">
        <div />
        <button onClick={() => move("up")} className="p-2 bg-[#8f7a66] rounded text-white">
          <ArrowUp size={20} />
        </button>
        <div />
        <button onClick={() => move("left")} className="p-2 bg-[#8f7a66] rounded text-white">
          <ArrowLeft size={20} />
        </button>
        <button onClick={() => move("down")} className="p-2 bg-[#8f7a66] rounded text-white">
          <ArrowDown size={20} />
        </button>
        <button onClick={() => move("right")} className="p-2 bg-[#8f7a66] rounded text-white">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

// Main Games Hub
export function GamesApp() {
  const [activeGame, setActiveGame] = useState<GameType>(null)

  if (activeGame === "snake") {
    return <SnakeGame onBack={() => setActiveGame(null)} />
  }

  if (activeGame === "2048") {
    return <Game2048 onBack={() => setActiveGame(null)} />
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] text-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <Gamepad2 size={28} className="text-[#0078d4]" />
        <h1 className="text-2xl font-bold">Games</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setActiveGame("snake")}
          className="bg-[#252525] rounded-xl p-6 hover:bg-[#2a2a2a] transition-colors text-left"
        >
          <div className="w-16 h-16 bg-[#0078d4] rounded-xl flex items-center justify-center mb-4">
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-sm ${i < 5 ? "bg-[#00b4d8]" : "bg-transparent"}`} />
              ))}
            </div>
          </div>
          <h3 className="font-semibold mb-1">Snake</h3>
          <p className="text-xs text-white/50">Classic snake game</p>
        </button>

        <button
          onClick={() => setActiveGame("2048")}
          className="bg-[#252525] rounded-xl p-6 hover:bg-[#2a2a2a] transition-colors text-left"
        >
          <div className="w-16 h-16 bg-[#edc22e] rounded-xl flex items-center justify-center mb-4 text-[#776e65] font-bold text-xl">
            2048
          </div>
          <h3 className="font-semibold mb-1">2048</h3>
          <p className="text-xs text-white/50">Merge tiles puzzle</p>
        </button>

        <div className="bg-[#252525] rounded-xl p-6 opacity-50">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <Gamepad2 size={28} className="text-white/30" />
          </div>
          <h3 className="font-semibold mb-1">More Games</h3>
          <p className="text-xs text-white/50">Coming soon...</p>
        </div>
      </div>
    </div>
  )
}
