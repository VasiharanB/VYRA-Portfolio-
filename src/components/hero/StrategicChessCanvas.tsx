import React, { useRef, useEffect, useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import type * as THREE from 'three'
import StrategicChessScene from './StrategicChessScene'
import { type StrategicVector } from './CircuitChessboard'

interface StrategicChessCanvasProps {
  reducedMotion: boolean
  onContextLoss: (reason: string) => void
}

const VECTOR_DETAILS: Record<StrategicVector, { title: string; subtitle: string }> = {
  STRATEGY: {
    title: 'VECTOR 01 // FIRST-PRINCIPLES STRATEGY',
    subtitle: 'Problem decomposition · Outcome-driven modeling · Rigorous constraints',
  },
  ARCHITECTURE: {
    title: 'VECTOR 02 // SYSTEMS ARCHITECTURE',
    subtitle: 'Modular topologies · Resilient distributed APIs · High concurrency',
  },
  EXECUTION: {
    title: 'VECTOR 03 // PRODUCTION EXECUTION',
    subtitle: 'Type-safe implementation · Verified testing · Rapid measured shipping',
  },
}

export function StrategicChessCanvas({ reducedMotion, onContextLoss }: StrategicChessCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
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

      {/* Top Telemetry Header with Clean Left-Aligned Strategic Vector Selectors */}
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
          maxWidth: '380px',
          pointerEvents: 'none',
        }}
      >
        <span style={{ color: 'var(--acid)', fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.12em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <i
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--acid)',
              display: 'inline-block',
              boxShadow: '0 0 6px var(--acid)',
            }}
          />
          VYRA // STRATEGIC SYSTEMS
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '8px', color: '#a5ad98', opacity: 0.85 }}>
          {activeInfo ? activeInfo.title : 'KNIGHT DYNAMICS · CIRCUIT CHESSBOARD'}
        </span>

        {/* Vector Toggle Buttons — positioned below title to avoid top-right HUD collision */}
        <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto', marginTop: '2px' }}>
          {(['STRATEGY', 'ARCHITECTURE', 'EXECUTION'] as StrategicVector[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setActiveVector((prev) => (prev === v ? null : v))}
              onMouseEnter={() => setActiveVector(v)}
              style={{
                background: activeVector === v ? 'var(--acid)' : 'rgba(17, 19, 17, 0.8)',
                color: activeVector === v ? '#11150b' : '#a0a49b',
                border: `1px solid ${activeVector === v ? 'var(--acid)' : 'rgba(240, 243, 231, 0.16)'}`,
                borderRadius: '4px',
                padding: '3px 8px',
                fontFamily: 'var(--mono)',
                fontSize: '7.5px',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              aria-label={`Highlight strategic vector: ${v}`}
            >
              {v}
            </button>
          ))}
        </div>

        {activeInfo && (
          <span style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: '#d8ddce', marginTop: '2px', lineHeight: 1.4, background: 'rgba(11, 12, 13, 0.65)', backdropFilter: 'blur(4px)', padding: '3px 6px', borderRadius: '3px' }}>
            {activeInfo.subtitle}
          </span>
        )}
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
          />
        </Suspense>
      </Canvas>

      {/* Bottom Telemetry Stamp */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '8px',
          zIndex: 4,
          pointerEvents: 'none',
          fontFamily: 'var(--mono)',
          fontSize: '7px',
          letterSpacing: '0.1em',
          color: '#777f70',
        }}
      >
        STAUNTON DYNAMICS · THREE.JS
      </div>
    </div>
  )
}

export default StrategicChessCanvas
