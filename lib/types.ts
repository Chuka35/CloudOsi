import type React from 'react'

export interface WindowState {
  id: string
  appId: string
  appName: string
  icon: React.ElementType
  iconColor: string
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  x: number
  y: number
  width: number
  height: number
  savedX: number
  savedY: number
  savedWidth: number
  savedHeight: number
  minWidth?: number
  minHeight?: number
  isResizable?: boolean
}

export interface AppDefinition {
  id: string
  name: string
  icon: React.ElementType
  color: string
  defaultWidth: number
  defaultHeight: number
  minWidth?: number
  minHeight?: number
  isResizable?: boolean
  isSingleton?: boolean
  component: React.ComponentType<{ windowId: string }>
}

export type WindowAction = 
  | { type: 'OPEN_WINDOW'; payload: Omit<WindowState, 'id' | 'zIndex'> }
  | { type: 'CLOSE_WINDOW'; payload: string }
  | { type: 'MINIMIZE_WINDOW'; payload: string }
  | { type: 'RESTORE_WINDOW'; payload: string }
  | { type: 'MAXIMIZE_WINDOW'; payload: string }
  | { type: 'UNMAXIMIZE_WINDOW'; payload: string }
  | { type: 'FOCUS_WINDOW'; payload: string }
  | { type: 'UPDATE_POSITION'; payload: { id: string; x: number; y: number } }
  | { type: 'UPDATE_SIZE'; payload: { id: string; width: number; height: number; x?: number; y?: number } }
  | { type: 'SNAP_WINDOW'; payload: { id: string; snapType: SnapType } }
  | { type: 'MINIMIZE_ALL' }

export type SnapType = 'full' | 'left' | 'right' | 'top-left' | 'top-right' | 'left-2/3'

export interface DesktopState {
  windows: WindowState[]
  activeWindowId: string | null
  zIndexCounter: number
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}
