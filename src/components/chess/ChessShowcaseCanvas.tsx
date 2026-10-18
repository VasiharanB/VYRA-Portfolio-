import React, { useRef, useEffect, useState, useMemo, Suspense, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { StauntonPiece, type ChessPieceType } from './StauntonPieceModels'
import { useTheme } from '../../context/ThemeContext'

interface ChessShowcaseCanvasProps {
  activePieceId: ChessPieceType
  accentColor: string
  reducedMotion: boolean
  isRotating?: boolean
  selectedAngle?: number // 0, 90, 180, 270 degrees in radians
}

/**
 * Tournament-grade 6x6 Chessboard as a spatial foundation
 * Tiles softly fade at the perimeter into background so the board
 * grounds the piece without dominating the foreground.
 */
function GroundedChessboard({ accentColor }: { accentColor: string }) {
  const { isDark } = useTheme()
  const tileSize = 0.88
  const gridSize = 6
  const boardOffset = ((gridSize - 1) * tileSize) / 2

  const palette = useMemo(() => isDark ? ({
    lightTile: new THREE.Color('#4a5664'), // refined brushed slate titanium
    darkTile: new THREE.Color('#161a1e'),  // deep graphite obsidian
    frame: new THREE.Color('#0f1215'),
  }) : ({
    lightTile: new THREE.Color('#ffffff'), // crisp ivory white
    darkTile: new THREE.Color('#828a7e'),  // warm charcoal stone
    frame: new THREE.Color('#b8beb2'),     // light border frame
  }), [isDark])

  return (
    <group position={[0, -0.02, 0]}>
      {/* 1. Recessed substrate plinth */}
      <mesh position={[0, -0.07, 0]} receiveShadow>
        <boxGeometry args={[gridSize * tileSize + 0.35, 0.10, gridSize * tileSize + 0.35]} />
        <meshStandardMaterial color={palette.frame} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* 2. 6x6 alternating squares with radial distance falloff */}
      {Array.from({ length: gridSize }).map((_, r) =>
        Array.from({ length: gridSize }).map((_, c) => {
          const posX = c * tileSize - boardOffset
          const posZ = r * tileSize - boardOffset
          const isLight = (r + c) % 2 === 0
          const isTargetSquare = (r === 2 || r === 3) && (c === 2 || c === 3)

          // Distance from board center to fade edge tiles
          const dist = Math.hypot(posX, posZ)
          const maxDist = boardOffset * 1.35
          const opacity = Math.max(0.35, Math.min(1.0, 1.15 - (dist / maxDist) * 0.75))

          return (
            <group key={`tile-${r}-${c}`} position={[posX, 0, posZ]}>
              <mesh receiveShadow>
                <boxGeometry args={[tileSize * 0.95, 0.04, tileSize * 0.95]} />
                <meshStandardMaterial
                  color={isLight ? palette.lightTile : palette.darkTile}
                  roughness={isLight ? 0.32 : 0.40}
                  metalness={0.70}
                  transparent
                  opacity={opacity}
                />
              </mesh>

              {/* Active Central Square Accent Ring */}
              {isTargetSquare && (
                <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[tileSize * 0.36, tileSize * 0.42, 32]} />
                  <meshBasicMaterial color={accentColor} transparent opacity={0.55} />
                </mesh>
              )}
            </group>
          )
        })
      )}

      {/* 3. Deep contact shadow disc under piece pedestal */}
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.72, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.72} />
      </mesh>
    </group>
  )
}

/**
 * 360° Turntable Piece Actor
 * - Short, elegant settling entrance (~0.5s)
 * - Continuous, smooth 360° rotation (constant angular velocity, ~22s per full turn)
 * - Board stays completely stable
 */
function TurntablePieceActor({
  pieceType,
  accentColor,
  reducedMotion,
  isRotating,
  selectedAngle,
}: {
  pieceType: ChessPieceType
  accentColor: string
  reducedMotion: boolean
  isRotating: boolean
  selectedAngle?: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const prevPieceRef = useRef<ChessPieceType>(pieceType)
  const animTimeRef = useRef<number>(0)
  const angleRef = useRef<number>(0.35) // base 3/4 presentation angle

  // Angular velocity: 360° (2*PI) in 22 seconds
  const TURNTABLE_SPEED = (Math.PI * 2) / 22

  // Reset entrance sequence when piece changes
  useEffect(() => {
    if (prevPieceRef.current !== pieceType) {
      prevPieceRef.current = pieceType
      animTimeRef.current = 0
      angleRef.current = 0.35 // restart at clean 3/4 front view
    }
  }, [pieceType])

  // If user picks a specific angle manually
  useEffect(() => {
    if (selectedAngle !== undefined && !isRotating) {
      angleRef.current = selectedAngle
    }
  }, [selectedAngle, isRotating])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (reducedMotion) {
      groupRef.current.position.set(0, 0, 0)
      groupRef.current.rotation.set(0, selectedAngle ?? 0.35, 0)
      return
    }

    animTimeRef.current += delta
    const t = animTimeRef.current

    // 1. Short, graceful settling drop on entrance (0.5s)
    let posY = 0
    if (t < 0.5) {
      const progress = t / 0.5
      // Cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3)
      posY = (1 - ease) * 0.28
    }

    // 2. Continuous 360° Turntable rotation
    if (isRotating && t >= 0.3) {
      angleRef.current += delta * TURNTABLE_SPEED
      // Keep within [0, 2*PI] without discontinuous jumps
      if (angleRef.current > Math.PI * 200) {
        angleRef.current %= Math.PI * 2
      }
    }

    groupRef.current.position.set(0, posY, 0)
    groupRef.current.rotation.set(0, angleRef.current, 0)
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <StauntonPiece pieceType={pieceType} accentColor={accentColor} />
    </group>
  )
}

/**
 * Camera & Studio Lighting Rig
 * - Camera pulled back and targeted at piece mid-height ([0, 1.45, 0])
 * - Piece occupies 50-60% of canvas height with generous breathing room
 * - Soft key light + fill light + rim backlight guarantees visibility from all 360° angles
 */
function StudioScene({
  activePieceId,
  accentColor,
  reducedMotion,
  isRotating,
  selectedAngle,
}: {
  activePieceId: ChessPieceType
  accentColor: string
  reducedMotion: boolean
  isRotating: boolean
  selectedAngle?: number
}) {
  const { camera } = useThree()
  const { isDark } = useTheme()

  // Setup comfortable framing: complete piece at 50-60% usable stage height
  useEffect(() => {
    // Camera positioned back with deliberate three-quarter inclination
    // Target is midpoint of Staunton piece (y ≈ 1.45)
    camera.position.set(3.4, 4.4, 6.2)
    camera.lookAt(0, 1.40, 0)
  }, [camera])

  const effectiveAccent = isDark ? accentColor : '#226e17'

  return (
    <>
      {/* 1. Ambient Lighting: ensures recesses retain clear slate tones instead of black */}
      <ambientLight intensity={isDark ? 0.58 : 0.82} color={isDark ? '#384350' : '#8e968a'} />

      {/* 2. Main Key Directional Light: casts soft, realistic shadows */}
      <directionalLight
        position={[4.5, 7.0, 5.0]}
        intensity={isDark ? 1.7 : 2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={22}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={5}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0004}
      />

      {/* 3. Soft Front-Left Fill Light: prevents unlit side from disappearing into dark */}
      <directionalLight position={[-4.0, 3.5, 4.0]} intensity={isDark ? 0.9 : 1.1} color={isDark ? '#92a4b8' : '#cbd5e1'} />

      {/* 4. Strong Rim Backlight: in light mode, deep rim carves metallic silhouette against light backdrop */}
      <directionalLight position={[-2.5, 5.0, -5.5]} intensity={isDark ? 1.5 : 2.0} color={isDark ? '#dbe7f5' : '#3d4652'} />

      {/* 5. Secondary Side Kicker Light: specular highlights on opposite flanks during 360° rotation */}
      <directionalLight position={[4.0, 3.0, -4.0]} intensity={isDark ? 0.75 : 0.9} color={isDark ? '#8595a8' : '#727e8d'} />

      {/* 6. Substrate Accent Glow from active square */}
      <pointLight position={[0, 0.3, 0]} intensity={isDark ? 1.2 : 0.85} color={effectiveAccent} distance={3.8} />

      {/* 7. Stationary Grounded Chessboard */}
      <GroundedChessboard accentColor={effectiveAccent} />

      {/* 8. 360° Turntable Piece Actor */}
      <TurntablePieceActor
        pieceType={activePieceId}
        accentColor={effectiveAccent}
        reducedMotion={reducedMotion}
        isRotating={isRotating}
        selectedAngle={selectedAngle}
      />
    </>
  )
}

/**
 * Master Canvas Component for the 3D Chess Skills Showcase
 */
export function ChessShowcaseCanvas({
  activePieceId,
  accentColor,
  reducedMotion,
  isRotating = true,
  selectedAngle,
}: ChessShowcaseCanvasProps) {
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
    <div ref={containerRef} className="chess-showcase-canvas-container" aria-hidden="true">
      {inView && (
        <Canvas
          shadows
          camera={{ position: [3.4, 4.4, 6.2], fov: 36 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <StudioScene
            activePieceId={activePieceId}
            accentColor={accentColor}
            reducedMotion={reducedMotion}
            isRotating={isRotating && !reducedMotion}
            selectedAngle={selectedAngle}
          />
        </Canvas>
      )}
    </div>
  )
}

export default ChessShowcaseCanvas
