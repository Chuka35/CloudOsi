"use client"

// Layered blue cloud logo — transparent background, no white fill
// Matches the brand logo (image 4) with concentric layered cloud silhouette

interface CloudLogoProps {
  size?: number
  className?: string
}

export function CloudLogo({ size = 40, className = '' }: CloudLogoProps) {
  // Cloud shape built from: left big circle + right smaller circle + bottom rounded rect
  // Four layers from dark blue (front) to light teal (back), creating the 3D stacked effect
  const cloud = (ox: number, oy: number, color: string) => (
    <g transform={`translate(${ox},${oy})`} key={color}>
      {/* Left big hump */}
      <circle cx="30" cy="34" r="19" fill={color} />
      {/* Right smaller hump */}
      <circle cx="55" cy="41" r="13" fill={color} />
      {/* Cloud base */}
      <rect x="11" y="41" width="57" height="20" rx="10" fill={color} />
    </g>
  )

  return (
    <svg
      width={size}
      height={Math.round(size * 0.82)}
      viewBox="0 0 86 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Layer 4 — back, lightest teal, furthest offset */}
      {cloud(8, 8, '#93C5FD')}
      {/* Layer 3 — light blue */}
      {cloud(5, 5, '#60A5FA')}
      {/* Layer 2 — medium blue */}
      {cloud(2, 2, '#2563EB')}
      {/* Layer 1 — front, dark navy, no offset */}
      {cloud(0, 0, '#1D4ED8')}
    </svg>
  )
}
