import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { StauntonPiece, type ChessPieceType } from './StauntonPieceModels'

interface ChessShowcaseCanvasProps {
  activePieceId: ChessPieceType
  accentColor: string
  reducedMotion: boolean
}

/**
 * Tournament-grade 6x6 Chessboard with high-contrast titanium/obsidian squares,
 * beveled perimeter rim, and active square highlight.
 */
function RealisticChessboard({ accentColor }: { accentColor: string }) {
  const tileSize = 1.15
  const gridSize = 6
  const boardOffset = ((gridSize - 1) * tileSize) / 2

  const palette = useMemo(() => ({
    lightTile: new THREE.Color('#4c5864'), // brushed titanium slate
    lightPlate: new THREE.Color('#5f6d7a'), // top face highlight
    darkTile: new THREE.Color('#1a1f24'),  // deep obsidian charcoal
    darkBevel: new THREE.Color('#22282f'),
    frame: new THREE.Color('#101316'),     // perimeter beveled rim
    seam: new THREE.Color('#0c0e10'),      // recessed channels
  }), [])

  return (
    <group position={[0, -0.04, 0]}>
      {/* 1. Substrate Border Frame */}
      <mesh position={[0, -0.10, 0]} receiveShadow>
        <boxGeometry args={[gridSize * tileSize + 0.5, 0.16, gridSize * tileSize + 0.5]} />
        <meshStandardMaterial color={palette.frame} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* 2. Grid of Alternating Tiles */}
      {Array.from({ length: gridSize }).map((_, r) =>
        Array.from({ length: gridSize }).map((_, c) => {
          const posX = c * tileSize - boardOffset
          const posZ = r * tileSize - boardOffset
          const isLight = (r + c) % 2 === 0
          // The center square where the piece sits
          const isTargetSquare = r === 2 && c === 2

          return (
            <group key={`tile-${r}-${c}`} position={[posX, 0, posZ]}>
              {/* Tile Body */}
              <mesh receiveShadow>
                <boxGeometry args={[tileSize * 0.94, 0.08, tileSize * 0.94]} />
                <meshStandardMaterial
                  color={isLight ? palette.lightTile : palette.darkTile}
                  roughness={isLight ? 0.28 : 0.36}
                  metalness={0.75}
                />
              </mesh>

              {/* Active Square Highlight Ring */}
              {isTargetSquare && (
                <mesh position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[tileSize * 0.38, tileSize * 0.44, 32]} />
                  <meshBasicMaterial color={accentColor} transparent opacity={0.65} />
                </mesh>
              )}
            </group>
          )
        })
      )}

      {/* 3. Soft Contact Shadow Disc under active piece */}
      <mesh position={[0, 0.043, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

/**
 * Animated Chess Piece Actor
 * Performs piece-specific physical entrance, settling, and pointer-parallax
 */
function AnimatedPieceActor({
  pieceType,
  accentColor,
  reducedMotion,
}: {
  pieceType: ChessPieceType
  accentColor: string
  reducedMotion: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const animTimeRef = useRef<number>(0)
  const prevPieceRef = useRef<ChessPieceType>(pieceType)
  const { pointer } = useThree()

  // Track piece changes to trigger physical entrance
  useEffect(() => {
    if (prevPieceRef.current !== pieceType) {
      prevPieceRef.current = pieceType
      animTimeRef.current = 0
    }
  }, [pieceType])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (reducedMotion) {
      groupRef.current.position.set(0, 0, 0)
      groupRef.current.rotation.set(0, 0.35, 0)
      return
    }

    animTimeRef.current += delta
    const t = Math.min(animTimeRef.current, 1.2) // clamp entrance to 1.2s

    // Calculate normalized easing (cubic ease out)
    const progress = Math.min(1, t / 0.85)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    // Base target position on board: central square [0, 0, 0]
    let posX = 0
    let posY = 0
    let posZ = 0
    let rotY = 0.35 // base 3/4 presentation angle

    // Piece-specific physical movement trajectories
    switch (pieceType) {
      case 'king':
        // Imperial descent from above with grounded micro-compression
        posY = THREE.MathUtils.lerp(1.5, 0, easeOut)
        // Subtle bounce/settle on landing
        if (progress > 0.8 && progress < 1.0) {
          const bounceT = (progress - 0.8) / 0.2
          posY += Math.sin(bounceT * Math.PI) * 0.04
        }
        break

      case 'queen':
        // Sweeping diagonal arrival with graceful curve
        posX = THREE.MathUtils.lerp(-1.4, 0, easeOut)
        posZ = THREE.MathUtils.lerp(-1.4, 0, easeOut)
        posY = Math.sin(easeOut * Math.PI) * 0.35
        rotY = THREE.MathUtils.lerp(0.8, 0.35, easeOut)
        break

      case 'rook':
        // Direct, orthogonal slide along straight file
        posZ = THREE.MathUtils.lerp(-2.0, 0, easeOut)
        posY = Math.sin(easeOut * Math.PI) * 0.12
        rotY = 0.35
        break

      case 'bishop':
        // Crisp diagonal translation slicing across squares
        posX = THREE.MathUtils.lerp(-1.6, 0, easeOut)
        posZ = THREE.MathUtils.lerp(1.2, 0, easeOut)
        posY = Math.sin(easeOut * Math.PI) * 0.22
        break

      case 'knight':
        // Authentic parabolic L-hop arc
        posX = THREE.MathUtils.lerp(1.3, 0, easeOut)
        posZ = THREE.MathUtils.lerp(1.8, 0, easeOut)
        // High parabolic leap
        posY = Math.sin(easeOut * Math.PI) * 0.85
        rotY = THREE.MathUtils.lerp(0.9, 0.35, easeOut)
        break

      case 'pawn':
        // Steady, disciplined single-square step forward
        posZ = THREE.MathUtils.lerp(1.2, 0, easeOut)
        posY = Math.sin(easeOut * Math.PI) * 0.18
        break
    }

    // Pointer-parallax response when cursor moves over the stage
    const parallaxYaw = pointer.x * 0.12
    const parallaxPitch = -pointer.y * 0.06

    // Smoothly apply position and rotation
    groupRef.current.position.set(posX, posY, posZ)
    groupRef.current.rotation.set(parallaxPitch, rotY + parallaxYaw, 0)
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <StauntonPiece pieceType={pieceType} accentColor={accentColor} />
    </group>
  )
}

/**
 * Camera Dolly and Studio Scene
 */
function StudioScene({
  activePieceId,
  accentColor,
  reducedMotion,
}: {
  activePieceId: ChessPieceType
  accentColor: string
  reducedMotion: boolean
}) {
  const { camera } = useThree()

  // Target camera position based on piece height
  useEffect(() => {
    if (reducedMotion) {
      camera.position.set(2.8, 3.2, 4.4)
      camera.lookAt(0, 1.1, 0)
      return
    }

    // Adjust camera slightly for King/Queen vs Rook/Pawn
    const targetCamY = activePieceId === 'king' || activePieceId === 'queen' ? 3.4 : 3.0
    camera.position.set(2.7, targetCamY, 4.2)
    camera.lookAt(0, 1.1, 0)
  }, [activePieceId, camera, reducedMotion])

  return (
    <>
      {/* 1. Studio Lighting Rig */}
      <ambientLight intensity={0.6} color="#303842" />

      {/* Key Directional Light with Soft Shadows */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0005}
      />

      {/* Soft Fill Light */}
      <directionalLight position={[-4, 3, -3]} intensity={0.7} color="#788a9c" />

      {/* Rim Backlight to catch silhouette crowns and crenellations */}
      <directionalLight position={[0, 4, -5]} intensity={1.2} color="#ffffff" />

      {/* Substrate Accent Light from Active Tile */}
      <pointLight position={[0, 0.4, 0]} intensity={1.5} color={accentColor} distance={4} />

      {/* 2. Realistic Chessboard */}
      <RealisticChessboard accentColor={accentColor} />

      {/* 3. Physical Piece Actor */}
      <AnimatedPieceActor
        pieceType={activePieceId}
        accentColor={accentColor}
        reducedMotion={reducedMotion}
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
          camera={{ position: [2.7, 3.2, 4.3], fov: 40 }}
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
          />
        </Canvas>
      )}
    </div>
  )
}

export default ChessShowcaseCanvas
