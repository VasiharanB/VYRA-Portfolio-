import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { ActiveChessPiece, type ChessPieceType } from './ProceduralChessPieces'

interface ChessScrollCanvasProps {
  activePieceId: ChessPieceType
  accentColor: string
  reducedMotion: boolean
}

function ChessScene({
  activePieceId,
  accentColor,
}: {
  activePieceId: ChessPieceType
  accentColor: string
}) {
  return (
    <>
      {/* Studio Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 7, 5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -3]} intensity={0.7} color="#8a9ba8" />
      <pointLight position={[0, -0.6, 2]} intensity={1.2} color={accentColor} distance={6} />

      {/* Subtle Ground Platform Disc */}
      <group position={[0, -1.25, 0]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.8, 64]} />
          <meshStandardMaterial
            color="#141716"
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>
        {/* Glowing halo ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
          <ringGeometry args={[1.72, 1.76, 64]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.006]}>
          <ringGeometry args={[1.18, 1.20, 48]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Active Piece */}
      <Suspense fallback={null}>
        <ActiveChessPiece pieceType={activePieceId} accentColor={accentColor} />
      </Suspense>
    </>
  )
}

export function ChessScrollCanvas({
  activePieceId,
  accentColor,
  reducedMotion,
}: ChessScrollCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  // Pause rendering when outside viewport
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting)
        })
      },
      { threshold: 0.05 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="chess-scroll-canvas-container" aria-hidden="true">
      {inView && (
        <Canvas
          camera={{ position: [0, 0.25, 4.3], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <ChessScene activePieceId={activePieceId} accentColor={accentColor} />
        </Canvas>
      )}
    </div>
  )
}

export default ChessScrollCanvas
