import React, { useEffect, useState, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export type CursorMode = 'default' | 'hover' | 'inspect' | 'orbit' | 'hidden'

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion()
  const [mode, setMode] = useState<CursorMode>('default')
  const [isEnabled, setIsEnabled] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Position tracking using refs to prevent React per-frame re-renders
  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const currentMode = useRef<CursorMode>('default')
  const isVisible = useRef(false)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    // Only activate custom cursor on desktop devices with fine pointer and hover support
    if (typeof window === 'undefined') return

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window

    if (!hasFinePointer || isTouchOnly) {
      setIsEnabled(false)
      return
    }

    setIsEnabled(true)

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY

      if (!isVisible.current) {
        isVisible.current = true
        if (containerRef.current) {
          containerRef.current.style.opacity = '1'
        }
      }

      // Immediately translate the precision dot without triggering a React re-render
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }

      // Context-aware target inspection for badge and ring sizing
      const target = e.target as HTMLElement | null
      if (!target) return

      let nextMode: CursorMode = 'default'

      // Native text inputs must retain native cursor and hide custom reticle
      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        nextMode = 'hidden'
      } else if (target.closest('.project-card')) {
        nextMode = 'inspect'
      } else if (target.closest('.gyroscope-3d-container') || target.closest('.hero-art') || target.closest('.orbital-stage')) {
        nextMode = 'orbit'
      } else if (
        target.closest('button, a, .nav-cta, .project-open, .social-link, [role="button"]')
      ) {
        nextMode = 'hover'
      }

      // Only trigger a React state change when the cursor mode actually transitions
      if (nextMode !== currentMode.current) {
        currentMode.current = nextMode
        setMode(nextMode)
      }
    }

    const handleMouseLeave = () => {
      isVisible.current = false
      if (containerRef.current) {
        containerRef.current.style.opacity = '0'
      }
    }

    const handleMouseEnter = () => {
      isVisible.current = true
      if (containerRef.current) {
        containerRef.current.style.opacity = '1'
      }
    }

    // High performance RAF loop directly manipulating DOM transform
    const updateRing = () => {
      if (prefersReducedMotion) {
        ringPos.current.x = mousePos.current.x
        ringPos.current.y = mousePos.current.y
      } else {
        const dx = mousePos.current.x - ringPos.current.x
        const dy = mousePos.current.y - ringPos.current.y
        ringPos.current.x += dx * 0.2
        ringPos.current.y += dy * 0.2
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
      }

      rafId.current = requestAnimationFrame(updateRing)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    rafId.current = requestAnimationFrame(updateRing)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [prefersReducedMotion])

  if (!isEnabled) return null

  return (
    <div
      ref={containerRef}
      className={`vyra-custom-cursor cursor-${mode}`}
      aria-hidden="true"
      style={{ opacity: 0 }}
    >
      {/* Precision center point */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Outer reticle / ring */}
      <div ref={ringRef} className="cursor-ring">
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
