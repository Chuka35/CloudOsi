'use client'

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import { DesktopState, WindowState, WindowAction, SnapType, NotificationState } from './types'

const initialState: DesktopState = {
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,
}

function desktopReducer(state: DesktopState, action: WindowAction): DesktopState {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const newWindow: WindowState = {
        ...action.payload,
        id: crypto.randomUUID(),
        zIndex: state.zIndexCounter + 1,
      }
      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: newWindow.id,
        zIndexCounter: state.zIndexCounter + 1,
      }
    }
    
    case 'CLOSE_WINDOW': {
      const windows = state.windows.filter(w => w.id !== action.payload)
      return {
        ...state,
        windows,
        activeWindowId: windows.length > 0 
          ? windows.reduce((a, b) => a.zIndex > b.zIndex ? a : b).id 
          : null,
      }
    }
    
    case 'MINIMIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMinimized: true } : w
        ),
        activeWindowId: state.activeWindowId === action.payload 
          ? state.windows.filter(w => w.id !== action.payload && !w.isMinimized)
              .reduce((a, b) => a?.zIndex > b?.zIndex ? a : b, null as WindowState | null)?.id || null
          : state.activeWindowId,
      }
    }
    
    case 'RESTORE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, isMinimized: false, zIndex: state.zIndexCounter + 1 } : w
        ),
        activeWindowId: action.payload,
        zIndexCounter: state.zIndexCounter + 1,
      }
    }
    
    case 'MAXIMIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w => {
          if (w.id !== action.payload) return w
          return {
            ...w,
            isMaximized: true,
            savedX: w.x,
            savedY: w.y,
            savedWidth: w.width,
            savedHeight: w.height,
            x: 0,
            y: 0,
            width: typeof window !== 'undefined' ? window.innerWidth : 1920,
            height: typeof window !== 'undefined' ? window.innerHeight - 48 : 1032,
          }
        }),
      }
    }
    
    case 'UNMAXIMIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w => {
          if (w.id !== action.payload) return w
          return {
            ...w,
            isMaximized: false,
            x: w.savedX,
            y: w.savedY,
            width: w.savedWidth,
            height: w.savedHeight,
          }
        }),
      }
    }
    
    case 'FOCUS_WINDOW': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload ? { ...w, zIndex: state.zIndexCounter + 1 } : w
        ),
        activeWindowId: action.payload,
        zIndexCounter: state.zIndexCounter + 1,
      }
    }
    
    case 'UPDATE_POSITION': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id ? { ...w, x: action.payload.x, y: action.payload.y } : w
        ),
      }
    }
    
    case 'UPDATE_SIZE': {
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.payload.id 
            ? { 
                ...w, 
                width: action.payload.width, 
                height: action.payload.height,
                ...(action.payload.x !== undefined && { x: action.payload.x }),
                ...(action.payload.y !== undefined && { y: action.payload.y }),
              } 
            : w
        ),
      }
    }
    
    case 'SNAP_WINDOW': {
      const snapPositions: Record<SnapType, (vw: number, vh: number) => { x: number; y: number; width: number; height: number }> = {
        'full': (vw, vh) => ({ x: 0, y: 0, width: vw, height: vh - 48 }),
        'left': (vw, vh) => ({ x: 0, y: 0, width: vw / 2, height: vh - 48 }),
        'right': (vw, vh) => ({ x: vw / 2, y: 0, width: vw / 2, height: vh - 48 }),
        'top-left': (vw, vh) => ({ x: 0, y: 0, width: vw / 2, height: (vh - 48) / 2 }),
        'top-right': (vw, vh) => ({ x: vw / 2, y: 0, width: vw / 2, height: (vh - 48) / 2 }),
        'left-2/3': (vw, vh) => ({ x: 0, y: 0, width: (vw * 2) / 3, height: vh - 48 }),
      }
      
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1920
      const vh = typeof window !== 'undefined' ? window.innerHeight : 1080
      const pos = snapPositions[action.payload.snapType](vw, vh)
      
      return {
        ...state,
        windows: state.windows.map(w => {
          if (w.id !== action.payload.id) return w
          return {
            ...w,
            isMaximized: action.payload.snapType === 'full',
            savedX: w.x,
            savedY: w.y,
            savedWidth: w.width,
            savedHeight: w.height,
            ...pos,
          }
        }),
      }
    }
    
    case 'MINIMIZE_ALL': {
      return {
        ...state,
        windows: state.windows.map(w => ({ ...w, isMinimized: true })),
        activeWindowId: null,
      }
    }
    
    default:
      return state
  }
}

interface DesktopContextValue {
  state: DesktopState
  openWindow: (window: Omit<WindowState, 'id' | 'zIndex'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  unmaximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  updatePosition: (id: string, x: number, y: number) => void
  updateSize: (id: string, width: number, height: number, x?: number, y?: number) => void
  snapWindow: (id: string, snapType: SnapType) => void
  minimizeAll: () => void
  notifications: NotificationState[]
  addNotification: (notification: Omit<NotificationState, 'id'>) => void
  removeNotification: (id: string) => void
}

const DesktopContext = createContext<DesktopContextValue | null>(null)

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(desktopReducer, initialState)
  const [notifications, setNotifications] = useReducer(
    (state: NotificationState[], action: { type: 'add' | 'remove'; payload: NotificationState | string }) => {
      if (action.type === 'add') {
        return [...state, action.payload as NotificationState]
      }
      return state.filter(n => n.id !== action.payload)
    },
    []
  )
  
  const openWindow = useCallback((window: Omit<WindowState, 'id' | 'zIndex'>) => {
    dispatch({ type: 'OPEN_WINDOW', payload: window })
  }, [])
  
  const closeWindow = useCallback((id: string) => {
    dispatch({ type: 'CLOSE_WINDOW', payload: id })
  }, [])
  
  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MINIMIZE_WINDOW', payload: id })
  }, [])
  
  const restoreWindow = useCallback((id: string) => {
    dispatch({ type: 'RESTORE_WINDOW', payload: id })
  }, [])
  
  const maximizeWindow = useCallback((id: string) => {
    dispatch({ type: 'MAXIMIZE_WINDOW', payload: id })
  }, [])
  
  const unmaximizeWindow = useCallback((id: string) => {
    dispatch({ type: 'UNMAXIMIZE_WINDOW', payload: id })
  }, [])
  
  const focusWindow = useCallback((id: string) => {
    dispatch({ type: 'FOCUS_WINDOW', payload: id })
  }, [])
  
  const updatePosition = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: 'UPDATE_POSITION', payload: { id, x, y } })
  }, [])
  
  const updateSize = useCallback((id: string, width: number, height: number, x?: number, y?: number) => {
    dispatch({ type: 'UPDATE_SIZE', payload: { id, width, height, x, y } })
  }, [])
  
  const snapWindow = useCallback((id: string, snapType: SnapType) => {
    dispatch({ type: 'SNAP_WINDOW', payload: { id, snapType } })
  }, [])
  
  const minimizeAll = useCallback(() => {
    dispatch({ type: 'MINIMIZE_ALL' })
  }, [])
  
  const addNotification = useCallback((notification: Omit<NotificationState, 'id'>) => {
    const id = crypto.randomUUID()
    setNotifications({ type: 'add', payload: { ...notification, id } })
    
    const duration = notification.duration ?? 4000
    setTimeout(() => {
      setNotifications({ type: 'remove', payload: id })
    }, duration)
  }, [])
  
  const removeNotification = useCallback((id: string) => {
    setNotifications({ type: 'remove', payload: id })
  }, [])
  
  return (
    <DesktopContext.Provider value={{
      state,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      maximizeWindow,
      unmaximizeWindow,
      focusWindow,
      updatePosition,
      updateSize,
      snapWindow,
      minimizeAll,
      notifications,
      addNotification,
      removeNotification,
    }}>
      {children}
    </DesktopContext.Provider>
  )
}

export function useDesktop() {
  const context = useContext(DesktopContext)
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider')
  }
  return context
}
