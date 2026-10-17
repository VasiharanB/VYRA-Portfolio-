import React, { useEffect, useState, useRef } from 'react'

export type CursorMode = 'default' | 'hover' | 'inspect' | 'orbit' | 'hidden'

export function CustomCursor() {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 })
  const [mode, setMode] = useState<CursorMode>('default')
  const [isTouch, setIsTouch] = useState(false)
  const [visible, setVisible] = useState(false)

  const posRef = useRef(pos)
  posRef.current = pos

  useEffect(() => {
    // Detect touch-only device and permanently disable custom cursor
    if (typeof window !== 'undefined') {
      const touchMatch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
      if (touchMatch) {
        setIsTouch(true)
        return
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)

      // Context-aware target inspection
      const target = e.target as HTMLElement | null
      if (!target) return

      if (target.closest('.project-card')) {
        setMode('inspect')
      } else if (target.closest('.gyroscope-3d-container') || target.closest('.hero-art')) {
        setMode('orbit')
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.nav-cta') ||
        target.closest('.project-open') ||
        target.closest('.social-link')
      ) {
        setMode('hover')
      } else {
        setMode('default')
      }
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    const handleMouseEnter = () => {
      setVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Smooth spring-lag loop for outer ring
    let animationFrameId: number
    const smoothFollow = () => {
      setRingPos((prev) => {
        const dx = posRef.current.x - prev.x
        const dy = posRef.current.y - prev.y
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        }
      })
      animationFrameId = requestAnimationFrame(smoothFollow)
    }
    animationFrameId = requestAnimationFrame(smoothFollow)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(animationFrameId)
    }
  }, [visible])

  if (isTouch || !visible) return null

  return (
    <div className={`vyra-custom-cursor cursor-${mode}`} aria-hidden="true">
      {/* Precision center point */}
      <div
        className="cursor-dot"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      />

      {/* Lagged outer reticle / ring */}
      <div
        className="cursor-ring"
        style={{
          transform: `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`,
        }}
      >
        {/* Reticle targeting crosshair ticks */}
        <span className="reticle-tick tick-top" />
        <span className="reticle-tick tick-bottom" />
        <span className="reticle-tick tick-left" />
        <span className="reticle-tick tick-right" />

        {/* Dynamic Context Badge */}
        {mode === 'inspect' && <span className="cursor-label">INSPECT ↗</span>}
        {mode === 'orbit' && <span className="cursor-label">ORBIT 3D</span>}
      </div>
    </div>
  )
}

export default CustomCursor
