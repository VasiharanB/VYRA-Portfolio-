import React, { useRef, useEffect, useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import type * as THREE from 'three'
import StrategicChessScene from './StrategicChessScene'
import { type StrategicVector } from './CircuitChessboard'

interface StrategicChessCanvasProps {
  reducedMotion: boolean
  onContextLoss: (reason: string) => void
}

// Concise, authentic connections to Vasiharan's actual engineering projects
const VECTOR_DETAILS: Record<StrategicVector, { domain: string; project: string; description: string }> = {
  APPLIED_AI: {
    domain: 'APPLIED AI',
    project: 'Smart Issue Tracker',
    description: 'Semantic duplicate detection and AI-assisted verification.',
  },
  REAL_TIME: {
    domain: 'REAL-TIME SYSTEMS',
    project: 'Cricket Conquest',
    description: 'Live IPL auction workflows and role-based access.',
  },
  BUSINESS_SOFTWARE: {
    domain: 'BUSINESS SOFTWARE',
    project: 'JGC Construction ERP',
    description: 'Project operations, CRM and inventory workflows.',
  },
}

export function StrategicChessCanvas({ reducedMotion, onContextLoss }: StrategicChessCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeVector, setActiveVector] = useState<StrategicVector | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Track mobile responsive breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track scroll position through hero for subtle perspective shifts without pinning
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const height = rect.height || 600
      const progress = Math.max(0, Math.min(1.5, -rect.top / height))
      scrollProgressRef.current = progress
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Pause rendering when hero is scrolled out of viewport
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.05 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Handle WebGL context loss and restore
  const handleCreated = useCallback(
    ({ gl }: { gl: THREE.WebGLRenderer }) => {
      const canvas = gl.domElement
      const handleContextLost = (event: Event) => {
        event.preventDefault()
        onContextLoss('WebGL context lost by graphics driver')
      }
      const handleContextRestored = () => {
        setIsReady(true)
      }
      canvas.addEventListener('webglcontextlost', handleContextLost, false)
      canvas.addEventListener('webglcontextrestored', handleContextRestored, false)
      requestAnimationFrame(() => setIsReady(true))
    },
    [onContextLoss]
  )

  const activeInfo = activeVector ? VECTOR_DETAILS[activeVector] : null

  return (
    <div
      ref={containerRef}
      className={`strategic-3d-container ${isReady ? 'scene-ready' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: isMobile ? '360px' : '520px',
        overflow: 'hidden',
        opacity: isReady ? 1 : 0.4,
        transition: 'opacity 0.4s ease-out',
      }}
      aria-label="Interactive Strategic Systems 3D Chess Knight"
    >
      {/* Background circuit grid */}
      <div className="strategic-grid" style={{ pointerEvents: 'none' }} />

      {/* Minimal HUD: Strategic Domain Controls connected directly to real portfolio */}
      <div
        className="strategic-hud"
        style={{
          position: 'absolute',
          top: '12px',
          left: '10px',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          maxWidth: '340px',
          pointerEvents: 'none',
        }}
      >
        {/* Clean domain buttons */}
        <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto' }}>
          {([
            { id: 'APPLIED_AI', label: 'Applied AI' },
            { id: 'REAL_TIME', label: 'Real-time' },
            { id: 'BUSINESS_SOFTWARE', label: 'Business ERP' },
          ] as const).map(({ id, label }) => {
            const isActive = activeVector === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveVector((prev) => (prev === id ? null : id))}
                onMouseEnter={() => setActiveVector(id)}
                style={{
                  background: isActive ? 'var(--acid)' : 'rgba(17, 19, 17, 0.75)',
                  color: isActive ? '#11150b' : '#a2a79c',
                  border: `1px solid ${isActive ? 'var(--acid)' : 'rgba(240, 243, 231, 0.14)'}`,
                  backdropFilter: 'blur(8px)',
                  borderRadius: '4px',
                  padding: '4px 9px',
                  fontFamily: 'var(--mono)',
                  fontSize: '8px',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                aria-label={`Highlight engineering domain: ${label}`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Active project callout: concise, authentic, and visually secondary */}
        {activeInfo ? (
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '11px',
              color: '#dbe1d3',
              lineHeight: 1.45,
              background: 'rgba(11, 12, 13, 0.82)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(185, 243, 106, 0.22)',
              padding: '6px 10px',
              borderRadius: '4px',
              marginTop: '2px',
            }}
          >
            <span style={{ color: 'var(--acid)', fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.1em', display: 'block', marginBottom: '2px' }}>
              {activeInfo.domain} // {activeInfo.project}
            </span>
            {activeInfo.description}
          </div>
        ) : null}
      </div>

      <Canvas
        camera={{ position: [0, 0.8, isMobile ? 8.2 : 7.2], fov: 42, near: 0.1, far: 100 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        frameloop={isVisible && !reducedMotion ? 'always' : 'demand'}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={handleCreated}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      >
        <Suspense fallback={null}>
          <StrategicChessScene
            isMobile={isMobile}
            reducedMotion={reducedMotion}
            activeVector={activeVector}
            onVectorSelect={setActiveVector}
            scrollProgressRef={scrollProgressRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default StrategicChessCanvas
