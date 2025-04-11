'use client'

import { useState, useEffect } from 'react'

interface ResponsiveHelperProps {
  enabled?: boolean
}

export function ResponsiveHelper({ enabled = true }: ResponsiveHelperProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!enabled) return

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Initial dimensions
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [enabled])

  if (!enabled || !isVisible) return null

  // Determine which breakpoint is active
  const getBreakpoint = (width: number) => {
    if (width < 640) return 'xs (< 640px)'
    if (width < 768) return 'sm (640px - 767px)'
    if (width < 1024) return 'md (768px - 1023px)'
    if (width < 1280) return 'lg (1024px - 1279px)'
    if (width < 1536) return 'xl (1280px - 1535px)'
    return '2xl (≥ 1536px)'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/70 text-white p-2 rounded-md shadow-lg text-xs font-mono flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span>
          {dimensions.width} × {dimensions.height}
        </span>
        <button 
          onClick={() => setIsVisible(false)} 
          className="ml-4 bg-red-500 hover:bg-red-600 rounded px-1.5 text-white"
        >
          ×
        </button>
      </div>
      <div>
        Breakpoint: <span className="font-bold">{getBreakpoint(dimensions.width)}</span>
      </div>
    </div>
  )
} 