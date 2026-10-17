import React, { useRef } from 'react'
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
  useFrame((_, delta) => {
    if (!masterGroupRef.current) return

    if (!reducedMotion) {
      const targetRotationY = pointer.x * 0.18
      const targetRotationX = -pointer.y * 0.12

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

  return (
    <group ref={masterGroupRef} position={[0, -0.2, 0]}>
      {/* CONTROLLED ARCHITECTURAL STUDIO LIGHTING */}
      {/* 1. Subtle base ambient light */}
      <ambientLight intensity={0.52} />

      {/* 2. Key light: Crisp directional light illuminating the horse's brow, muzzle & chest */}
      <directionalLight
        position={[-3, 8, 6]}
        intensity={1.5}
        color="#ffffff"
        castShadow={false}
      />

      {/* 3. Rim light: Cool indigo/violet backlight catching the silhouetted dorsal crest & ears */}
      <directionalLight
        position={[6, 4, -4]}
        intensity={1.05}
        color="#7b6ff0"
      />

      {/* 4. Board under-glow: Acid-lime accent bounce from illuminated circuit traces */}
      <pointLight
        position={[0, -0.4, 0.8]}
        intensity={activeVector ? 2.6 : 1.6}
        color="#b9f36a"
        distance={5}
        decay={2}
      />

      {/* 5. Fill light from front-right */}
      <directionalLight
        position={[4, 4, 4]}
        intensity={0.45}
        color="#e4f5cc"
      />

      {/* THE STRATEGIC SYSTEMS KNIGHT */}
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
