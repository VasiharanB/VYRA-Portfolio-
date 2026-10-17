import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import ChessKnight from './ChessKnight'
import CircuitChessboard, { type StrategicVector } from './CircuitChessboard'

interface StrategicChessSceneProps {
  isMobile: boolean
  reducedMotion: boolean
  activeVector: StrategicVector | null
  onVectorSelect: (vector: StrategicVector | null) => void
}

export function StrategicChessScene({
  isMobile,
  reducedMotion,
  activeVector,
  onVectorSelect,
}: StrategicChessSceneProps) {
  const masterGroupRef = useRef<THREE.Group>(null!)
  const { pointer } = useThree()

  // Restrained, subtle cursor-reactive camera parallax (±4 degrees max, NO wild spinning)
  useFrame(() => {
    if (!masterGroupRef.current) return

    if (!reducedMotion) {
      const targetRotationY = pointer.x * 0.16
      const targetRotationX = -pointer.y * 0.10

      masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.y,
        targetRotationY,
        0.04
      )
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        targetRotationX,
        0.04
      )
    }
  })

  // Dynamic light position based on active strategic vector
  const accentLightPos = useMemo<[number, number, number]>(() => {
    if (activeVector === 'STRATEGY') return [-1.15, -0.2, 2.3]
    if (activeVector === 'ARCHITECTURE') return [1.15, -0.2, 2.3]
    if (activeVector === 'EXECUTION') return [2.3, -0.2, 1.15]
    return [0, -0.4, 0.8]
  }, [activeVector])

  return (
    <group ref={masterGroupRef} position={[0, -0.15, 0]}>
      {/* CINEMATIC ARCHITECTURAL STUDIO LIGHTING */}
      {/* 1. Base ambient fill light: ensures deep recesses stay rich dark graphite */}
      <ambientLight intensity={0.46} color="#181c20" />

      {/* 2. Key light: Crisp studio directional light illuminating the horse's brow, muzzle & neck curves */}
      <directionalLight
        position={[-4.5, 7.5, 5.5]}
        intensity={2.6}
        color="#ffffff"
        castShadow={false}
      />

      {/* 3. Rim light: Cool steel/slate rim light catching the silhouetted dorsal crest, mane notches & ears */}
      <directionalLight
        position={[5.5, 4.5, -4.5]}
        intensity={1.6}
        color="#9db4dc"
      />

      {/* 4. Soft board fill light: upward bounce from the chessboard into the throat and pedestal */}
      <directionalLight
        position={[0, -2, 3]}
        intensity={0.5}
        color="#d8e8d0"
      />

      {/* 5. Substrate active vector accent light */}
      <pointLight
        position={accentLightPos}
        intensity={activeVector ? 2.6 : 0.9}
        color="#b9f36a"
        distance={4.8}
        decay={2}
      />

      {/* THE 3D STAUNTON KNIGHT SCULPTURE */}
      <ChessKnight
        hoveredVector={activeVector}
        reducedMotion={reducedMotion}
      />

      {/* THE CIRCUIT CHESSBOARD WITH 3 STRATEGIC L-MOVE VECTORS */}
      <CircuitChessboard
        activeVector={activeVector}
        onVectorSelect={onVectorSelect}
      />
    </group>
  )
}

export default StrategicChessScene
