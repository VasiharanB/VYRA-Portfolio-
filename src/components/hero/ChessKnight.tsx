import React, { useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

interface ChessKnightProps {
  hoveredVector: string | null
  reducedMotion: boolean
}

// Preload the local Staunton Knight GLB model
useGLTF.preload('/models/staunton-knight.glb')

/**
 * Authentic 3D Staunton Chess Knight loaded from local GLB
 * Source: clarkerubber/Staunton-Pieces (MIT License, official Lichess 3D set)
 *
 * Configured with bright brushed titanium / gunmetal PBR finish,
 * retaining realistic 3D volume, organic horse head contours, and visible pedestal.
 */
function StauntonKnightModel({ hoveredVector }: { hoveredVector: string | null }) {
  const gltf = useGLTF('/models/staunton-knight.glb')

  // Curated PBR material palette: bright brushed titanium with silver highlights
  const palette = useMemo(() => ({
    // Brighter brushed titanium finish: visible silver-gray highlights that pop against graphite
    body: new THREE.Color('#58626c'),
    // High-refinement titanium bezel
    bezel: new THREE.Color('#2a3238'),
    // Signature VYRA acid-lime accent
    acid: new THREE.Color('#b9f36a'),
    acidGlow: new THREE.Color('#d4ff88'),
  }), [])

  // Clone the scene and apply the titanium material to all meshes in the hierarchy
  // Ensures no part of the knight or its stepped circular pedestal is ever discarded
  const sceneClone = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.material = new THREE.MeshStandardMaterial({
          color: palette.body,
          roughness: 0.28,
          metalness: 0.78,
          envMapIntensity: 1.4,
        })
      }
    })
    return clone
  }, [gltf, palette])

  return (
    <group position={[0, -0.84, 0]} rotation={[0, 2.65, 0]} scale={[1.12, 1.12, 1.12]}>
      {/* 1. SCULPTED 3D STAUNTON KNIGHT FULL SCENE (Horse + Stepped Pedestal) */}
      <primitive object={sceneClone} />

      {/* 2. RESTRAINED CYBERNETIC ACCENTS (Organic Sculpture + Software Metaphor) */}
      {/* Right Cybernetic Eye Aperture (Facing Camera & Headline in 3/4 view) */}
      <group position={[0.165, 2.30, -0.285]} rotation={[0, 0.45, 0]}>
        {/* Dark titanium bezel collar */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.028, 0.007, 16, 24]} />
          <meshStandardMaterial color={palette.bezel} metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Acid-lime illuminated sensor pupil */}
        <mesh position={[0, 0, 0.005]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial
            color={palette.acid}
            emissive={palette.acid}
            emissiveIntensity={hoveredVector ? 2.6 : 1.5}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Left Cybernetic Eye Aperture */}
      <group position={[-0.165, 2.30, -0.285]} rotation={[0, -0.45, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.028, 0.007, 16, 24]} />
          <meshStandardMaterial color={palette.bezel} metalness={0.92} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial
            color={palette.acid}
            emissive={palette.acid}
            emissiveIntensity={hoveredVector ? 2.6 : 1.5}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* 3. PEDESTAL COLLAR CIRCUIT INLAY RING */}
      {/* Fine hairline micro-bus ring etched into the base bevel */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.71, 0.724, 64]} />
        <meshStandardMaterial
          color={palette.acid}
          emissive={palette.acid}
          emissiveIntensity={hoveredVector ? 1.0 : 0.4}
          transparent
          opacity={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

/**
 * Procedural fallback mesh with titanium finish in case GLB asset fails to load
 */
function ProceduralKnightFallback({ hoveredVector }: { hoveredVector: string | null }) {
  return (
    <group position={[0, -0.84, 0]} rotation={[0, 2.65, 0]} scale={[1.0, 1.0, 1.0]}>
      {/* Base cylinder plinth */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[1.3, 1.45, 0.28, 48]} />
        <meshStandardMaterial color="#58626c" roughness={0.28} metalness={0.78} />
      </mesh>
      {/* Mid riser */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.95, 1.2, 0.3, 48]} />
        <meshStandardMaterial color="#4d5761" roughness={0.28} metalness={0.78} />
      </mesh>
      {/* Torso & Head block */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.8, 1.9, 32]} />
        <meshStandardMaterial color="#58626c" roughness={0.28} metalness={0.78} />
      </mesh>
    </group>
  )
}

export function ChessKnight({ hoveredVector, reducedMotion }: ChessKnightProps) {
  return (
    <Suspense fallback={<ProceduralKnightFallback hoveredVector={hoveredVector} />}>
      <StauntonKnightModel hoveredVector={hoveredVector} />
    </Suspense>
  )
}

export default ChessKnight
