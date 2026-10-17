import React, { useMemo } from 'react'
import * as THREE from 'three'

export type StrategicVector = 'APPLIED_AI' | 'REAL_TIME' | 'BUSINESS_SOFTWARE'

interface CircuitChessboardProps {
  activeVector: StrategicVector | null
  onVectorSelect: (vector: StrategicVector | null) => void
}

export function CircuitChessboard({ activeVector, onVectorSelect }: CircuitChessboardProps) {
  const palette = useMemo(() => ({
    // High-contrast alternating squares with brightened titanium tones
    tileLight: new THREE.Color('#5a6672'), // bright brushed titanium slate
    tileLightTop: new THREE.Color('#6e7c8a'), // specular top highlight plate
    tileDark: new THREE.Color('#20252b'),  // deep obsidian charcoal
    tileDarkBevel: new THREE.Color('#293038'), // subtle bevel rim
    gridSeam: new THREE.Color('#14171a'),  // recessed channel
    hairlineBus: new THREE.Color('#2d382c'), // secondary circuit trace
    acid: new THREE.Color('#b9f36a'),
    acidDim: new THREE.Color('#384c20'),
  }), [])

  // Board dimensions: 6x6 grid of 1.15 unit tiles
  const gridSize = 6
  const tileSize = 1.15
  const boardOffset = ((gridSize - 1) * tileSize) / 2

  // Strategic Knight Move Target Positions (mapped to real engineering domains)
  const vectors = useMemo(() => [
    {
      id: 'APPLIED_AI' as StrategicVector,
      label: '01 // APPLIED AI',
      tileCoord: 'C6',
      x: -tileSize,
      z: tileSize * 2,
    },
    {
      id: 'REAL_TIME' as StrategicVector,
      label: '02 // REAL-TIME',
      tileCoord: 'E6',
      x: tileSize,
      z: tileSize * 2,
    },
    {
      id: 'BUSINESS_SOFTWARE' as StrategicVector,
      label: '03 // BUSINESS ERP',
      tileCoord: 'F5',
      x: tileSize * 2,
      z: tileSize,
    },
  ], [tileSize])

  return (
    <group position={[0, -0.84, 0]} rotation={[-0.38, 0.35, 0]} scale={[0.88, 0.88, 0.88]}>
      {/* 6x6 PARTIAL CHESSBOARD TILES */}
      {Array.from({ length: gridSize }).map((_, r) => {
        return Array.from({ length: gridSize }).map((_, c) => {
          const posX = c * tileSize - boardOffset
          const posZ = r * tileSize - boardOffset
          const isLight = (r + c) % 2 === 0

          // Calculate radial falloff so perimeter tiles dissolve into the graphite background
          const distFromCenter = Math.hypot(posX, posZ)
          const opacity = Math.max(0.18, Math.min(0.98, 1.0 - (distFromCenter / (boardOffset * 1.5)) * 0.68))

          return (
            <group key={`tile-${r}-${c}`} position={[posX, -0.04, posZ]}>
              {/* Main tile slab */}
              <mesh>
                <boxGeometry args={[tileSize * 0.95, 0.08, tileSize * 0.95]} />
                <meshStandardMaterial
                  color={isLight ? palette.tileLight : palette.tileDark}
                  roughness={isLight ? 0.26 : 0.36}
                  metalness={0.80}
                  transparent
                  opacity={opacity}
                />
              </mesh>

              {/* Brushed metallic top face plate on light squares */}
              {isLight ? (
                <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[tileSize * 0.88, tileSize * 0.88]} />
                  <meshStandardMaterial
                    color={palette.tileLightTop}
                    roughness={0.22}
                    metalness={0.85}
                    transparent
                    opacity={opacity * 0.85}
                  />
                </mesh>
              ) : (
                <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[tileSize * 0.88, tileSize * 0.88]} />
                  <meshStandardMaterial
                    color={palette.tileDarkBevel}
                    roughness={0.34}
                    metalness={0.80}
                    transparent
                    opacity={opacity * 0.70}
                  />
                </mesh>
              )}
            </group>
          )
        })
      })}

      {/* RESTRAINED CIRCUIT SEAM CHANNELS & SECONDARY HAIRLINE TRACES */}
      {Array.from({ length: gridSize + 1 }).map((_, idx) => {
        const offset = idx * tileSize - boardOffset - tileSize / 2
        return (
          <React.Fragment key={`bus-${idx}`}>
            {/* Horizontal recessed seam */}
            <mesh position={[0, 0.002, offset]}>
              <boxGeometry args={[gridSize * tileSize, 0.006, 0.016]} />
              <meshStandardMaterial
                color={palette.hairlineBus}
                roughness={0.4}
                metalness={0.7}
                transparent
                opacity={0.45}
              />
            </mesh>
            {/* Vertical recessed seam */}
            <mesh position={[offset, 0.002, 0]}>
              <boxGeometry args={[0.016, 0.006, gridSize * tileSize]} />
              <meshStandardMaterial
                color={palette.hairlineBus}
                roughness={0.4}
                metalness={0.7}
                transparent
                opacity={0.45}
              />
            </mesh>
          </React.Fragment>
        )
      })}

      {/* INTERACTIVE STRATEGIC KNIGHT L-MOVE VECTORS */}
      {vectors.map((vec) => {
        const isHovered = activeVector === vec.id
        const midZ = vec.z
        const midX = 0

        return (
          <group key={vec.id}>
            {/* L-Path Step 1: Forward track from center */}
            <mesh position={[0, 0.015, midZ / 2]}>
              <boxGeometry args={[0.045, 0.015, Math.abs(midZ)]} />
              <meshStandardMaterial
                color={isHovered ? palette.acid : palette.acidDim}
                emissive={palette.acid}
                emissiveIntensity={isHovered ? 0.95 : 0.25}
                roughness={0.2}
              />
            </mesh>

            {/* L-Path Step 2: Lateral branch to destination square */}
            <mesh position={[vec.x / 2, 0.015, vec.z]}>
              <boxGeometry args={[Math.abs(vec.x), 0.015, 0.045]} />
              <meshStandardMaterial
                color={isHovered ? palette.acid : palette.acidDim}
                emissive={palette.acid}
                emissiveIntensity={isHovered ? 0.95 : 0.25}
                roughness={0.2}
              />
            </mesh>

            {/* Corner Junction Node */}
            <mesh position={[midX, 0.02, midZ]}>
              <cylinderGeometry args={[0.07, 0.07, 0.025, 16]} />
              <meshBasicMaterial color={isHovered ? palette.acid : palette.acidDim} />
            </mesh>

            {/* Target Destination Reticle & Interactive Trigger */}
            <group
              position={[vec.x, 0.025, vec.z]}
              onPointerOver={(e) => {
                e.stopPropagation()
                onVectorSelect(vec.id)
              }}
              onPointerOut={(e) => {
                e.stopPropagation()
                onVectorSelect(null)
              }}
            >
              {/* Outer targeting ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.3, 0.36, 32]} />
                <meshBasicMaterial
                  color={palette.acid}
                  transparent
                  opacity={isHovered ? 0.95 : 0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Inner target dot */}
              <mesh position={[0, 0.01, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.03, 16]} />
                <meshStandardMaterial
                  color={palette.acid}
                  emissive={palette.acid}
                  emissiveIntensity={isHovered ? 1.1 : 0.4}
                />
              </mesh>

              {/* Illuminated tile glow overlay */}
              {isHovered && (
                <mesh position={[0, -0.01, 0]}>
                  <boxGeometry args={[tileSize * 0.92, 0.02, tileSize * 0.92]} />
                  <meshBasicMaterial color={palette.acid} transparent opacity={0.18} />
                </mesh>
              )}
            </group>
          </group>
        )
      })}
    </group>
  )
}

export default CircuitChessboard
