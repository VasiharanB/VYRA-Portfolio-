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

  // Dynamic substrate point-light position based on active strategic vector
  const accentLightPos = useMemo<[number, number, number]>(() => {
    if (activeVector === 'STRATEGY') return [-1.15, -0.2, 2.3]
    if (activeVector === 'ARCHITECTURE') return [1.15, -0.2, 2.3]
    if (activeVector === 'EXECUTION') return [2.3, -0.2, 1.15]
    return [0, -0.4, 0.8]
  }, [activeVector])

  return (
    <group ref={masterGroupRef} position={[0, -0.15, 0]}>
      {/* 1. ATMOSPHERIC GRADIENT BACKDROP (Separates sculpture from #0b0c0d graphite canvas) */}
      <mesh position={[0.2, 0.6, -2.2]}>
        <planeGeometry args={[7.0, 7.0]} />
        <meshBasicMaterial
          color="#161f18"
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>

      {/* 2. BASE AMBIENT FILL LIGHT: ensures recesses remain soft silver-charcoal instead of black */}
      <ambientLight intensity={0.65} color="#262f38" />

      {/* 3. BROAD, SOFT FRONTAL KEY LIGHT: reveals muzzle, forehead, mane notches, and circular base */}
      <directionalLight
        position={[-2.5, 6.0, 6.5]}
        intensity={3.2}
        color="#ffffff"
        castShadow={false}
      />

      {/* 4. SECONDARY FRONTAL FILL LIGHT: softens shadows on the lateral cheek and neck */}
      <directionalLight
        position={[3.0, 3.5, 5.0]}
        intensity={1.8}
        color="#e2ebf4"
      />

      {/* 5. RESTRAINED COOL RIM LIGHT: crisp steel-blue rim separating dorsal crest and ears from background */}
      <directionalLight
        position={[4.8, 4.2, -4.5]}
        intensity={2.6}
        color="#a0c2f0"
      />

      {/* 6. SOFT BOARD BOUNCE: upward reflection off the brightened chessboard into throat & chin */}
      <directionalLight
        position={[0, -2.5, 3.0]}
        intensity={0.85}
        color="#d4e4d8"
      />

      {/* 7. DYNAMIC SUBSTRATE ACCENT LIGHT */}
      <pointLight
        position={accentLightPos}
        intensity={activeVector ? 2.8 : 0.9}
        color="#b9f36a"
        distance={5.0}
        decay={2}
      />

      {/* THE 3D BRUSHED TITANIUM STAUNTON KNIGHT SCULPTURE */}
      <ChessKnight
        hoveredVector={activeVector}
        reducedMotion={reducedMotion}
      />

      {/* THE HIGH-CONTRAST CIRCUIT CHESSBOARD WITH 3 STRATEGIC VECTORS */}
      <CircuitChessboard
        activeVector={activeVector}
        onVectorSelect={onVectorSelect}
      />
    </group>
  )
}

export default StrategicChessScene
