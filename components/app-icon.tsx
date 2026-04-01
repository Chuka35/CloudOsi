'use client'

import React from 'react'

interface AppIconProps {
  appId: string
  size?: number
  className?: string
}

export function AppIcon({ appId, size = 48, className = '' }: AppIconProps) {
  const Icon = APP_ICONS[appId]
  if (!Icon) return <DefaultIcon size={size} />
  return <Icon size={size} className={className} />
}

const r = (size: number) => Math.round(size * 0.22)

function DefaultIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect width="48" height="48" rx={r(48)} fill="#555" />
      <rect x="12" y="12" width="24" height="24" rx="4" fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

const APP_ICONS: Record<string, React.FC<{ size: number; className?: string }>> = {

  'file-explorer': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="fe-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD75E" />
          <stop offset="100%" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#fe-bg)" />
      <rect x="7" y="20" width="34" height="20" rx="3" fill="#E8961A" />
      <path d="M7 23C7 20.8 8.8 19 11 19H22L25 23H41V34C41 36.2 39.2 38 37 38H11C8.8 38 7 36.2 7 34V23Z" fill="#FFC947" />
      <path d="M7 25H41V34C41 36.2 39.2 38 37 38H11C8.8 38 7 36.2 7 34V25Z" fill="#FFDA6B" />
      <rect x="9" y="17" width="16" height="4" rx="2" fill="#E8961A" />
    </svg>
  ),

  'browser': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="edge-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F6CBD" />
          <stop offset="100%" stopColor="#2EAEDD" />
        </linearGradient>
        <linearGradient id="edge-wave" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#36DFF1" />
          <stop offset="100%" stopColor="#1E8CB3" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#edge-bg)" />
      <path d="M24 10C16.3 10 10 16.3 10 24C10 27.7 11.4 31 13.8 33.5C15.5 29.5 19.4 26.8 24 26.8C26.1 26.8 28 27.3 29.7 28.2C30.5 26.2 31 24 31 21.7C31 15.3 27.6 10 24 10Z" fill="url(#edge-wave)" />
      <path d="M24 26.8C19.4 26.8 15.5 29.5 13.8 33.5C16.4 36.1 19.9 37.7 23.8 37.7C30.8 37.7 36.5 33 38 26.8C35.8 28.1 33.2 28.8 30.4 28.8C28.2 28.8 26.2 27.5 24 26.8Z" fill="#166FAB" />
      <path d="M38 26.8C36.5 33 30.8 37.7 23.8 37.7C28.1 37.7 31.8 35.8 34.2 32.8C36.2 31 37.7 28 38 26.8Z" fill="#3CADD4" />
    </svg>
  ),

  'notepad': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="np-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2B88D8" />
          <stop offset="100%" stopColor="#0063B1" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#np-bg)" />
      <rect x="10" y="10" width="28" height="34" rx="3" fill="white" opacity="0.95" />
      <rect x="14" y="17" width="20" height="2" rx="1" fill="#0063B1" opacity="0.6" />
      <rect x="14" y="22" width="20" height="2" rx="1" fill="#0063B1" opacity="0.6" />
      <rect x="14" y="27" width="20" height="2" rx="1" fill="#0063B1" opacity="0.6" />
      <rect x="14" y="32" width="14" height="2" rx="1" fill="#0063B1" opacity="0.6" />
      <path d="M30 8L36 14L30 14L30 8Z" fill="#FFD700" />
      <path d="M30 8L36 8L36 14L30 14Z" fill="#FFC107" transform="rotate(-45 33 11)" />
      <line x1="34" y1="8" x2="40" y2="14" stroke="#F9A825" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  'calculator': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect width="48" height="48" rx="10" fill="#1E1E1E" />
      <rect x="8" y="8" width="32" height="16" rx="3" fill="#2D2D2D" />
      <text x="36" y="21" textAnchor="end" fill="white" fontSize="9" fontFamily="Segoe UI,Arial" fontWeight="300">0</text>
      {[0,1,2,3].map(col => [0,1,2,3].map(row => (
        <rect key={`${col}-${row}`} x={8+col*9} y={28+row*5} width="7" height="3.5" rx="1"
          fill={row === 0 && col >= 2 ? '#0078D4' : row === 3 ? '#E74C3C' : '#3A3A3A'} />
      )))}
    </svg>
  ),

  'terminal': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="term-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0C0C0C" />
          <stop offset="100%" stopColor="#1C1C5E" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#term-bg)" />
      <path d="M10 20L19 24L10 28" stroke="#29D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="22" y1="28" x2="35" y2="28" stroke="#29D" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  'settings': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="set-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9E9E9E" />
          <stop offset="100%" stopColor="#5E5E5E" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#set-bg)" />
      <g transform="translate(24,24)">
        <circle r="7" fill="white" opacity="0.95" />
        <circle r="4" fill="#757575" />
        {[0,45,90,135,180,225,270,315].map(angle => (
          <rect key={angle} x="-2.5" y="-13" width="5" height="5" rx="1.5" fill="white" opacity="0.95"
            transform={`rotate(${angle})`} />
        ))}
      </g>
    </svg>
  ),

  'task-manager': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="tm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#004E8C" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#tm-bg)" />
      <rect x="10" y="30" width="6" height="10" rx="2" fill="white" opacity="0.9" />
      <rect x="20" y="22" width="6" height="18" rx="2" fill="white" opacity="0.9" />
      <rect x="30" y="15" width="6" height="25" rx="2" fill="white" opacity="0.9" />
      <polyline points="10,25 21,16 33,10" stroke="#7FDEFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="10" cy="25" r="2.5" fill="#7FDEFF" />
      <circle cx="21" cy="16" r="2.5" fill="#7FDEFF" />
      <circle cx="33" cy="10" r="2.5" fill="#7FDEFF" />
    </svg>
  ),

  'paint': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="pt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8F0FE" />
          <stop offset="100%" stopColor="#C2D4FB" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#pt-bg)" />
      <circle cx="16" cy="18" r="5" fill="#E74C3C" />
      <circle cx="28" cy="14" r="5" fill="#27AE60" />
      <circle cx="36" cy="24" r="5" fill="#2980B9" />
      <circle cx="30" cy="33" r="5" fill="#F39C12" />
      <path d="M22 36 Q18 30 14 34 Q10 38 16 40 Q22 42 22 36Z" fill="#8B4513" />
      <rect x="22" y="26" width="4" height="14" rx="2" fill="#7B3F00" transform="rotate(-30 24 30)" />
    </svg>
  ),

  'calendar': ({ size }) => {
    const now = new Date()
    const day = now.getDate()
    const month = now.toLocaleString('default', { month: 'short' }).toUpperCase()
    return (
      <svg width={size} height={size} viewBox="0 0 48 48">
        <defs>
          <linearGradient id="cal-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0078D4" />
            <stop offset="100%" stopColor="#005A9E" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="10" fill="url(#cal-bg)" />
        <rect x="8" y="16" width="32" height="26" rx="4" fill="white" />
        <rect x="8" y="10" width="32" height="10" rx="4" fill="#0067C0" />
        <rect x="8" y="16" width="32" height="4" fill="#0067C0" />
        <text x="24" y="12.5" textAnchor="middle" fill="white" fontSize="6" fontFamily="Segoe UI,Arial" fontWeight="600">{month}</text>
        <text x="24" y="36" textAnchor="middle" fill="#0078D4" fontSize="16" fontFamily="Segoe UI,Arial" fontWeight="700">{day}</text>
      </svg>
    )
  },

  'mail': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="mail-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#005A9E" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#mail-bg)" />
      <rect x="8" y="14" width="32" height="22" rx="3" fill="white" opacity="0.95" />
      <path d="M8 17L24 26L40 17" stroke="#0078D4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M8 17L16 24M40 17L32 24" stroke="#0078D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),

  'photos': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="ph-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#55ACEE" />
          <stop offset="100%" stopColor="#2C6FAD" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#ph-bg)" />
      <rect x="7" y="12" width="34" height="26" rx="4" fill="white" opacity="0.15" />
      <rect x="7" y="12" width="34" height="26" rx="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
      <path d="M7 30L17 22L24 28L31 20L41 32V36C41 37.1 40.1 38 39 38H9C7.9 38 7 37.1 7 36V30Z" fill="white" opacity="0.25" />
      <path d="M9 35L19 24L27 32L33 25L41 35" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15" cy="19" r="3.5" fill="#FFC107" />
    </svg>
  ),

  'weather': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="w-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64B5F6" />
          <stop offset="100%" stopColor="#1976D2" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#w-bg)" />
      <circle cx="20" cy="20" r="8" fill="#FDD835" />
      {[0,45,90,135,180,225,270,315].map((a, i) => (
        <line key={i} x1={20+Math.cos(a*Math.PI/180)*10} y1={20+Math.sin(a*Math.PI/180)*10}
          x2={20+Math.cos(a*Math.PI/180)*13} y2={20+Math.sin(a*Math.PI/180)*13}
          stroke="#FDD835" strokeWidth="2" strokeLinecap="round" />
      ))}
      <ellipse cx="30" cy="30" rx="9" ry="6" fill="white" opacity="0.95" />
      <ellipse cx="24" cy="31" rx="7" ry="5" fill="white" opacity="0.95" />
      <ellipse cx="27" cy="27" rx="6" ry="6" fill="white" />
    </svg>
  ),

  'music': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="mu-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#880E4F" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#mu-bg)" />
      <path d="M32 12V30" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 15V33" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 15L32 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="34" r="4" fill="white" />
      <circle cx="32" cy="31" r="4" fill="white" />
    </svg>
  ),

  'video-player': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="vp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1E1E" />
          <stop offset="100%" stopColor="#3A3A3A" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#vp-bg)" />
      <rect x="8" y="13" width="32" height="22" rx="4" fill="#2D2D2D" />
      <polygon points="20,18 20,30 32,24" fill="white" opacity="0.9" />
      <rect x="10" y="37" width="28" height="3" rx="1.5" fill="#555" />
      <rect x="10" y="37" width="16" height="3" rx="1.5" fill="#0078D4" />
    </svg>
  ),

  'clock': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="ck-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#16213E" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#ck-bg)" />
      <circle cx="24" cy="24" r="15" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <circle cx="24" cy="24" r="14" fill="#1A1A2E" />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
        <line key={i} x1={24+Math.sin(a*Math.PI/180)*11} y1={24-Math.cos(a*Math.PI/180)*11}
          x2={24+Math.sin(a*Math.PI/180)*(i%3===0?9:11.5)} y2={24-Math.cos(a*Math.PI/180)*(i%3===0?9:11.5)}
          stroke="white" strokeWidth={i%3===0?2:1} opacity="0.7" />
      ))}
      <line x1="24" y1="24" x2="24" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="24" x2="30" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2" fill="white" />
    </svg>
  ),

  'store': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="st-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#005FB8" />
          <stop offset="100%" stopColor="#003C75" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#st-bg)" />
      <path d="M15 14H33C34.1 14 35 14.9 35 16L37 36C37 37.1 36.1 38 35 38H13C11.9 38 11 37.1 11 36L13 16C13 14.9 13.9 14 15 14Z" fill="white" opacity="0.95" />
      <path d="M19 14C19 11.2 21.2 9 24 9C26.8 9 29 11.2 29 14" stroke="#005FB8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  ),

  'games': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="gm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#107C10" />
          <stop offset="100%" stopColor="#0A5A0A" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#gm-bg)" />
      <path d="M8 24C8 18.5 12.5 14 18 14H30C35.5 14 40 18.5 40 24V28C40 32.4 36.4 36 32 36H16C11.6 36 8 32.4 8 28V24Z" fill="white" opacity="0.2" />
      <path d="M8 24C8 18.5 12.5 14 18 14H30C35.5 14 40 18.5 40 24V28C40 32.4 36.4 36 32 36H16C11.6 36 8 32.4 8 28V24Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="17" y1="21" x2="17" y2="29" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="13" y1="25" x2="21" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="33" cy="23" r="2" fill="white" />
      <circle cx="33" cy="27" r="2" fill="white" />
      <circle cx="31" cy="25" r="2" fill="white" />
      <circle cx="35" cy="25" r="2" fill="white" />
    </svg>
  ),

  'word': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="wd-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#185ABD" />
          <stop offset="100%" stopColor="#103F85" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#wd-bg)" />
      <rect x="22" y="10" width="20" height="28" rx="2" fill="white" opacity="0.95" />
      <rect x="25" y="15" width="14" height="1.5" rx="0.75" fill="#185ABD" opacity="0.5" />
      <rect x="25" y="19" width="14" height="1.5" rx="0.75" fill="#185ABD" opacity="0.5" />
      <rect x="25" y="23" width="14" height="1.5" rx="0.75" fill="#185ABD" opacity="0.5" />
      <rect x="25" y="27" width="9" height="1.5" rx="0.75" fill="#185ABD" opacity="0.5" />
      <path d="M8 13H24V35H8C7 35 6 34.1 6 33.1V14.9C6 13.9 7 13 8 13Z" fill="#2B7CD3" />
      <text x="15" y="29" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial" fontWeight="700">W</text>
    </svg>
  ),

  'excel': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="xl-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#217346" />
          <stop offset="100%" stopColor="#0F4D28" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#xl-bg)" />
      <rect x="22" y="10" width="20" height="28" rx="2" fill="white" opacity="0.95" />
      <line x1="31.5" y1="10" x2="31.5" y2="38" stroke="#217346" strokeWidth="1" opacity="0.3" />
      <line x1="22" y1="19" x2="42" y2="19" stroke="#217346" strokeWidth="1" opacity="0.3" />
      <line x1="22" y1="25" x2="42" y2="25" stroke="#217346" strokeWidth="1" opacity="0.3" />
      <line x1="22" y1="31" x2="42" y2="31" stroke="#217346" strokeWidth="1" opacity="0.3" />
      <path d="M8 13H24V35H8C7 35 6 34.1 6 33.1V14.9C6 13.9 7 13 8 13Z" fill="#33A660" />
      <text x="15" y="29" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial" fontWeight="700">X</text>
    </svg>
  ),

  'powerpoint': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="pp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C43E1C" />
          <stop offset="100%" stopColor="#8B2500" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#pp-bg)" />
      <rect x="22" y="10" width="20" height="28" rx="2" fill="white" opacity="0.95" />
      <path d="M8 13H24V35H8C7 35 6 34.1 6 33.1V14.9C6 13.9 7 13 8 13Z" fill="#E35A27" />
      <text x="15" y="29" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial" fontWeight="700">P</text>
    </svg>
  ),

  'chrome': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="#4285F4" />
      <path d="M24 4C13 4 4 13 4 24S13 44 24 44 44 35 44 24 35 4 24 4Z" fill="none" />
      <path d="M24 15A9 9 0 1 1 24 33A9 9 0 1 1 24 15Z" fill="white" />
      <path d="M24 15H42C40 9 33 4 24 4 17 4 11 7 7 12L16 27A9 9 0 0 1 24 15Z" fill="#EA4335" />
      <path d="M24 33A9 9 0 0 1 16 27L7 12C4 17 4 23 7 28L20 37A9 9 0 0 1 24 33Z" fill="#34A853" />
      <path d="M24 33A9 9 0 0 0 32 27L42 24C42 31 38 37 32 40L20 37A9 9 0 0 0 24 33Z" fill="#FBBC05" />
      <circle cx="24" cy="24" r="6" fill="white" />
    </svg>
  ),

  'teams': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="tm-bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5B5EA6" />
          <stop offset="100%" stopColor="#3B3B8A" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#tm-bg2)" />
      <circle cx="30" cy="16" r="6" fill="white" opacity="0.9" />
      <path d="M38 30C38 25.6 34.4 22 30 22H26C24 22 22.2 22.7 20.8 23.9" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <circle cx="18" cy="22" r="8" fill="white" />
      <path d="M8 36C8 30.5 12.5 26 18 26C23.5 26 28 30.5 28 36" fill="white" />
    </svg>
  ),

  'onedrive': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="od-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#004E8C" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#od-bg)" />
      <path d="M29 22C28.2 22 27.5 22.1 26.8 22.3C25.5 19.7 22.8 18 19.5 18C14.8 18 11 21.8 11 26.5C11 27 11.1 27.5 11.1 28C8.2 28.8 6 31.5 6 34.5C6 38.1 8.9 41 12.5 41H36.5C40.1 41 43 38.1 43 34.5C43 31.2 40.6 28.5 37.5 28.1C37.5 25 33.6 22 29 22Z" fill="white" opacity="0.95" />
    </svg>
  ),

  'outlook': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="ol-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#004E8C" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#ol-bg)" />
      <rect x="22" y="10" width="20" height="28" rx="2" fill="white" opacity="0.95" />
      <line x1="22" y1="20" x2="42" y2="20" stroke="#0078D4" strokeWidth="1" opacity="0.3" />
      <line x1="22" y1="26" x2="42" y2="26" stroke="#0078D4" strokeWidth="1" opacity="0.3" />
      <rect x="24" y="12" width="16" height="6" rx="1" fill="#0078D4" opacity="0.15" />
      <path d="M24 22L32 26L40 22" stroke="#0078D4" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M8 13H24V35H8C7 35 6 34.1 6 33.1V14.9C6 13.9 7 13 8 13Z" fill="#1B8AE8" />
      <text x="15" y="29" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial" fontWeight="700">O</text>
    </svg>
  ),

  'spotify': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="#1DB954" />
      <path d="M33 30C27 27 18 26 11 29" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M35 24C28 21 17 20 10 23" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M37 18C29 15 15 14 9 17" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  ),

  'whatsapp': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" fill="#25D366" />
      <path d="M24 10C16.3 10 10 16.3 10 24C10 26.5 10.7 28.9 11.9 31L9 39L17.3 36.2C19.4 37.3 21.6 37.9 24 37.9C31.7 37.9 38 31.6 38 23.9C38 16.3 31.7 10 24 10Z" fill="white" opacity="0.2" />
      <path d="M24 11C16.8 11 11 16.8 11 24C11 26.5 11.7 28.9 13 30.9L10.5 38.5L18.3 36.1C20.2 37.2 22 37.8 24 37.8C31.2 37.8 37 32 37 24.8C37 17.3 31.2 11 24 11Z" fill="white" />
      <path d="M20 17.5C19.5 17.5 18.8 17.7 18.2 18.4C17.6 19.1 16 20.6 16 23.6C16 26.6 18.3 29.5 18.6 29.9C18.9 30.3 22.7 36 28.1 38.1C32.4 39.8 33.5 39.4 34.2 39.3C35 39.2 36.6 38.2 37 37C37.4 35.8 37.4 34.9 37.3 34.7C37.1 34.5 36.7 34.4 36.2 34.2C35.7 34 33 32.7 32.5 32.5C32 32.3 31.7 32.2 31.3 32.7C31 33.2 30 34.4 29.7 34.7C29.4 35 29.1 35 28.7 34.8C28.2 34.6 26.7 34.1 24.9 32.5C23.5 31.3 22.5 29.8 22.2 29.3C21.9 28.8 22.2 28.5 22.4 28.3C22.6 28.1 22.9 27.8 23.1 27.5C23.3 27.2 23.4 27 23.5 26.6C23.7 26.2 23.6 25.9 23.5 25.7C23.4 25.5 22.4 22.8 22 21.8C21.6 20.9 21.2 21 20.9 21H20Z" fill="#25D366" />
    </svg>
  ),

  'maps': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="mp-bg" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#66BB6A" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="#E8F5E9" />
      <rect x="8" y="24" width="34" height="16" rx="2" fill="url(#mp-bg)" opacity="0.7" />
      <line x1="16" y1="24" x2="16" y2="40" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="32" y1="24" x2="32" y2="40" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <line x1="8" y1="32" x2="40" y2="32" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <path d="M24 8C20.1 8 17 11.1 17 15C17 20.3 24 30 24 30C24 30 31 20.3 31 15C31 11.1 27.9 8 24 8Z" fill="#EA4335" />
      <circle cx="24" cy="15" r="3" fill="white" />
    </svg>
  ),

  'cloudia': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect width="48" height="48" rx="10" fill="#06122b" />
      {/* Layered cloud — Layer 4 (back, lightest) */}
      <circle cx="17" cy="21" r="9" fill="#93C5FD" />
      <circle cx="30" cy="24" r="6" fill="#93C5FD" />
      <rect x="8" y="24" width="28" height="10" rx="5" fill="#93C5FD" />
      {/* Layer 3 */}
      <circle cx="17" cy="21" r="8" fill="#60A5FA" />
      <circle cx="29" cy="24" r="6" fill="#60A5FA" />
      <rect x="9" y="24" width="26" height="9" rx="4.5" fill="#60A5FA" />
      {/* Layer 2 */}
      <circle cx="17" cy="21" r="7" fill="#2563EB" />
      <circle cx="29" cy="24" r="5" fill="#2563EB" />
      <rect x="10" y="24" width="24" height="8" rx="4" fill="#2563EB" />
      {/* Layer 1 (front, darkest) */}
      <circle cx="17" cy="22" r="6" fill="#1D4ED8" />
      <circle cx="28" cy="25" r="4.5" fill="#1D4ED8" />
      <rect x="11" y="25" width="21" height="7" rx="3.5" fill="#1D4ED8" />
    </svg>
  ),

  'snipping-tool': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="sn-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F6CBD" />
          <stop offset="100%" stopColor="#0A4A96" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#sn-bg)" />
      <circle cx="17" cy="20" r="6" fill="white" opacity="0.9" />
      <circle cx="31" cy="20" r="6" fill="white" opacity="0.9" />
      <line x1="17" y1="20" x2="31" y2="20" stroke="white" strokeWidth="2" opacity="0.9" />
      <path d="M20 24L24 40L28 24" fill="white" opacity="0.8" />
    </svg>
  ),

  'voice-recorder': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect width="48" height="48" rx="10" fill="#E91E63" />
      <rect x="19" y="10" width="10" height="20" rx="5" fill="white" />
      <path d="M13 26C13 31.5 18 36 24 36C30 36 35 31.5 35 26" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="24" y1="36" x2="24" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  'sound-recorder': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect width="48" height="48" rx="10" fill="#E91E63" />
      <rect x="19" y="10" width="10" height="20" rx="5" fill="white" />
      <path d="M13 26C13 31.5 18 36 24 36C30 36 35 31.5 35 26" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="24" y1="36" x2="24" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  'security': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="sec-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00897B" />
          <stop offset="100%" stopColor="#00695C" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#sec-bg)" />
      <path d="M24 9L12 14V24C12 31.4 17.3 38.4 24 40C30.7 38.4 36 31.4 36 24V14L24 9Z" fill="white" opacity="0.9" />
      <path d="M18 24L22 28L30 20" stroke="#00897B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  'disk-management': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="dm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5C6BC0" />
          <stop offset="100%" stopColor="#3949AB" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#dm-bg)" />
      <rect x="8" y="11" width="32" height="10" rx="3" fill="white" opacity="0.2" />
      <rect x="8" y="11" width="32" height="10" rx="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <rect x="11" y="14" width="4" height="4" rx="1" fill="white" opacity="0.8" />
      <circle cx="37" cy="16" r="2" fill="#4CAF50" />
      <rect x="8" y="25" width="32" height="10" rx="3" fill="white" opacity="0.2" />
      <rect x="8" y="25" width="32" height="10" rx="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <rect x="11" y="28" width="4" height="4" rx="1" fill="white" opacity="0.8" />
      <circle cx="37" cy="30" r="2" fill="#FF9800" />
      <rect x="8" y="38" width="14" height="4" rx="2" fill="white" opacity="0.3" />
      <rect x="26" y="38" width="14" height="4" rx="2" fill="white" opacity="0.6" />
    </svg>
  ),

  'system-info': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="si-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#29B6F6" />
          <stop offset="100%" stopColor="#0288D1" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#si-bg)" />
      <rect x="8" y="10" width="32" height="22" rx="3" fill="white" opacity="0.2" />
      <rect x="8" y="10" width="32" height="22" rx="3" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <rect x="10" y="12" width="28" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="12" y="17" width="10" height="10" rx="2" fill="white" opacity="0.6" />
      <rect x="25" y="17" width="11" height="2" rx="1" fill="white" opacity="0.5" />
      <rect x="25" y="21" width="8" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="25" y="25" width="9" height="2" rx="1" fill="white" opacity="0.4" />
      <rect x="16" y="32" width="16" height="3" rx="1" fill="white" opacity="0.5" />
      <rect x="10" y="36" width="28" height="5" rx="2" fill="white" opacity="0.3" />
    </svg>
  ),

  'sticky-notes': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect width="48" height="48" rx="10" fill="#FDD835" />
      <rect x="10" y="10" width="28" height="28" rx="2" fill="#FFF176" />
      <path d="M30 10V24L38 32V10Z" fill="#F9A825" opacity="0.7" />
      <path d="M30 24L38 32H30Z" fill="#F57F17" opacity="0.5" />
      <line x1="15" y1="20" x2="33" y2="20" stroke="#F57F17" strokeWidth="1.5" opacity="0.7" />
      <line x1="15" y1="25" x2="28" y2="25" stroke="#F57F17" strokeWidth="1.5" opacity="0.7" />
      <line x1="15" y1="30" x2="26" y2="30" stroke="#F57F17" strokeWidth="1.5" opacity="0.7" />
    </svg>
  ),

  'mail-app': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="ma-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#005A9E" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#ma-bg)" />
      <rect x="8" y="14" width="32" height="22" rx="3" fill="white" opacity="0.95" />
      <path d="M8 17L24 26L40 17" stroke="#0078D4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
}
