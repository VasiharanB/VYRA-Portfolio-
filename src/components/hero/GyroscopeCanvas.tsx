import React, { useRef, useEffect, useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import type * as THREE from 'three'
import GyroscopeScene from './GyroscopeScene'

interface GyroscopeCanvasProps {
  reducedMotion: boolean
  onContextLoss: (reason: string) => void
}

export function GyroscopeCanvas({ reducedMotion, onContextLoss }: GyroscopeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Track responsive mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Pause rendering loop when Hero is out of viewport to conserve battery & GPU
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

  // Handle WebGL Context Loss gracefully
  const handleCreated = useCallback(
    ({ gl }: { gl: THREE.WebGLRenderer }) => {
      const canvas = gl.domElement
      const handleContextLost = (event: Event) => {
        event.preventDefault()
        onContextLoss('WebGL context lost by graphics driver')
      }
      canvas.addEventListener('webglcontextlost', handleContextLost, false)
    },
    [onContextLoss]
  )

  return (
    <div
      ref={containerRef}
      className="gyroscope-3d-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: isMobile ? '300px' : '390px',
        overflow: 'hidden',
      }}
      aria-label="Interactive 3D Gyroscope Engine"
    >
      {/* Subtle orbital grid background matching VYRA aesthetic */}
      <div className="orbital-grid" style={{ pointerEvents: 'none' }} />

      {/* Real-time Telemetry HUD overlay in 3D space */}
      <div
        className="gyroscope-hud"
        style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          zIndex: 4,
          pointerEvents: 'none',
          fontFamily: 'var(--mono)',
          fontSize: '8px',
          letterSpacing: '0.12em',
          color: '#a5ad98',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <span style={{ color: 'var(--acid)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
          GYRO / REAL-TIME 3D
        </span>
        <span style={{ opacity: 0.75 }}>
          {hoveredNode ? hoveredNode : 'MODE: INTERACTIVE GIMBAL'}
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 48, near: 0.1, far: 100 }}
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
          <GyroscopeScene
            isMobile={isMobile}
            reducedMotion={reducedMotion}
            onNodeHover={setHoveredNode}
          />
        </Suspense>
      </Canvas>

      {/* Corner telemetry coordinates */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '14px',
          zIndex: 4,
          pointerEvents: 'none',
          fontFamily: 'var(--mono)',
          fontSize: '7px',
          letterSpacing: '0.1em',
          color: '#777f70',
        }}
      >
        R3F · 3D WEBGL ENGINE
      </div>
    </div>
  )
}

export default GyroscopeCanvas
