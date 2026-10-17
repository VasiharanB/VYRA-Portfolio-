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
 */
function StauntonKnightModel({ hoveredVector }: { hoveredVector: string | null }) {
  const gltf = useGLTF('/models/staunton-knight.glb')

  // Curated PBR material palette for VYRA Strategic Systems
  const palette = useMemo(() => ({
    // Obsidian brushed gunmetal: deep graphite body with specular edge sheen
    body: new THREE.Color('#14171a'),
    // High-refinement bezel
    bezel: new THREE.Color('#252b30'),
    // Signature VYRA acid-lime accent
    acid: new THREE.Color('#b9f36a'),
    acidGlow: new THREE.Color('#cbf888'),
  }), [])

  // Extract the high-density geometry from the loaded GLB
  const geometry = useMemo(() => {
    let mesh: THREE.Mesh | null = null
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !mesh) {
        mesh = child as THREE.Mesh
      }
    })
    return mesh ? (mesh as THREE.Mesh).geometry : (gltf.scene.children[0] as THREE.Mesh).geometry
  }, [gltf])

  return (
    <group position={[0, -0.84, 0]} rotation={[0, 2.65, 0]} scale={[1.08, 1.08, 1.08]}>
      {/* 1. SCULPTED 3D STAUNTON KNIGHT SOLID MESH */}
      <mesh
        geometry={geometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={palette.body}
          roughness={0.32}
          metalness={0.85}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* 2. RESTRAINED CYBERNETIC ACCENTS (Organic Sculpture + Software Systems) */}
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
            emissiveIntensity={hoveredVector ? 2.4 : 1.3}
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
            emissiveIntensity={hoveredVector ? 2.4 : 1.3}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* 3. PEDESTAL COLLAR CIRCUIT INLAY RING */}
      {/* Delicate circular micro-bus etched into the base bevel */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.71, 0.724, 64]} />
        <meshStandardMaterial
          color={palette.acid}
          emissive={palette.acid}
          emissiveIntensity={hoveredVector ? 0.9 : 0.35}
          transparent
          opacity={0.75}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

/**
 * Procedural fallback mesh in case GLB asset fails to load
 */
function ProceduralKnightFallback({ hoveredVector }: { hoveredVector: string | null }) {
  return (
    <group position={[0, -0.84, 0]} rotation={[0, 2.65, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* Base cylinder plinth */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[1.3, 1.45, 0.28, 48]} />
        <meshStandardMaterial color="#14171a" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Mid riser */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.95, 1.2, 0.3, 48]} />
        <meshStandardMaterial color="#181c20" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Torso & Head block */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.8, 1.9, 32]} />
        <meshStandardMaterial color="#14171a" roughness={0.3} metalness={0.85} />
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
