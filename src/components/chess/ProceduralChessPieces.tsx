import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export type ChessPieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'

interface PieceVisualProps {
  accentColor?: string
  hovered?: boolean
}

// Preload the authentic Staunton Knight GLB
useGLTF.preload('/models/staunton-knight.glb')

/**
 * Common PBR material palette for all Staunton pieces:
 * High-grade brushed titanium / obsidian with subtle specular reflection
 * and signature VYRA acid-lime circuit accent inlays.
 */
function usePieceMaterials(accentColor = '#b9f36a') {
  return useMemo(() => {
    const titanium = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#545d67'),
      metalness: 0.82,
      roughness: 0.26,
      envMapIntensity: 1.3,
    })

    const titaniumDark = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22282e'),
      metalness: 0.9,
      roughness: 0.22,
    })

    const acidEmissive = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 1.6,
      roughness: 0.2,
    })

    const chromeBezel = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#384148'),
      metalness: 0.95,
      roughness: 0.15,
    })

    return { titanium, titaniumDark, acidEmissive, chromeBezel }
  }, [accentColor])
}

/**
 * Standard Staunton Stepped Pedestal
 * Authentic tiered circular base shared across King, Queen, Rook, Bishop, Pawn
 */
function StauntonPedestal({ materials }: { materials: ReturnType<typeof usePieceMaterials> }) {
  return (
    <group position={[0, -1.1, 0]}>
      {/* Lower base foot with bevel */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.92, 0.96, 0.16, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Main concave tier collar */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.82, 0.90, 0.12, 48]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* Acid circuit inlay ring */}
      <mesh position={[0, 0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.81, 48]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>

      {/* Upper torus waist transition */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.72, 0.80, 0.12, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.62, 0.70, 0.08, 48]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * 01. KING: Ownership & Engineering Judgment
 * Tallest, commanding silhouette with tiered waist, imperial dome, and cross finial.
 */
export function King3D({ accentColor }: PieceVisualProps) {
  const materials = usePieceMaterials(accentColor)

  return (
    <group scale={[0.95, 0.95, 0.95]}>
      <StauntonPedestal materials={materials} />

      {/* Tapered column body */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.42, 0.60, 1.0, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Center waist torus ring */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.48, 0.43, 0.1, 48]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* Emissive telemetry ring */}
      <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.46, 0.49, 48]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>

      {/* Flared upper neck */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.54, 0.45, 0.58, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Imperial Crown Gallery */}
      <mesh position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.58, 0.52, 0.14, 48]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* Rounded Crown Dome */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.38, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Finial Pedestal */}
      <mesh position={[0, 1.48, 0]}>
        <cylinderGeometry args={[0.09, 0.14, 0.12, 24]} />
        <primitive object={materials.chromeBezel} attach="material" />
      </mesh>

      {/* Cross Finial Vertical Bar */}
      <mesh position={[0, 1.68, 0]}>
        <boxGeometry args={[0.07, 0.32, 0.07]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>

      {/* Cross Finial Horizontal Bar */}
      <mesh position={[0, 1.74, 0]}>
        <boxGeometry args={[0.26, 0.07, 0.07]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * 02. QUEEN: Full-Stack Versatility
 * Fluid, elegant curves with radiating fluted coronet and jewel sphere.
 */
export function Queen3D({ accentColor }: PieceVisualProps) {
  const materials = usePieceMaterials(accentColor)

  return (
    <group scale={[0.93, 0.93, 0.93]}>
      <StauntonPedestal materials={materials} />

      {/* Graceful tapered body */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.38, 0.58, 0.92, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Waist accent ring */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.44, 0.39, 0.09, 48]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* Upper flared collar */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.52, 0.42, 0.58, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Fluted Coronet Rim */}
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.58, 0.49, 0.15, 36]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* Coronet points / scallops around rim */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8
        const x = Math.cos(angle) * 0.53
        const z = Math.sin(angle) * 0.53
        return (
          <mesh key={i} position={[x, 1.08, z]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <primitive object={materials.acidEmissive} attach="material" />
          </mesh>
        )
      })}

      {/* Central Crown Jewel Sphere */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.22, 32, 24]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Apex Pearl */}
      <mesh position={[0, 1.40, 0]}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * 03. ROOK: Structured Systems & Reliability
 * Sturdy fortress battlement with crenellations, deep embrasures, and unyielding cylindrical body.
 */
export function Rook3D({ accentColor }: PieceVisualProps) {
  const materials = usePieceMaterials(accentColor)

  return (
    <group scale={[0.92, 0.92, 0.92]}>
      <StauntonPedestal materials={materials} />

      {/* Solid cylindrical tower body with subtle taper */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.46, 0.58, 0.88, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Cornice support ring */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.54, 0.47, 0.12, 48]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* Emissive circuit band */}
      <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.52, 0.55, 48]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>

      {/* Flared parapet base */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.58, 0.52, 0.22, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Crenellated battlements (4 merlons with cut embrasures) */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i * Math.PI) / 2 + Math.PI / 4
        const x = Math.cos(angle) * 0.44
        const z = Math.sin(angle) * 0.44
        return (
          <mesh key={i} position={[x, 0.72, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.32, 0.28, 0.16]} />
            <primitive object={materials.titaniumDark} attach="material" />
          </mesh>
        )
      })}

      {/* Recessed parapet roof floor with emissive beacon */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 32]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>
      <mesh position={[0, 0.61, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * 04. BISHOP: Strategic Thinking & Architecture
 * Slender mitre body with diagonal slash and pointed finial.
 */
export function Bishop3D({ accentColor }: PieceVisualProps) {
  const materials = usePieceMaterials(accentColor)

  return (
    <group scale={[0.92, 0.92, 0.92]}>
      <StauntonPedestal materials={materials} />

      {/* Slender tapered waist */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.36, 0.54, 0.92, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Collar rings */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.42, 0.37, 0.09, 48]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* Flared upper neck */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.44, 0.40, 0.40, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Mitre head (teardrop ellipsoid) */}
      <mesh position={[0, 0.88, 0]} scale={[1.0, 1.35, 0.9]}>
        <sphereGeometry args={[0.34, 32, 24]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Diagonal Mitre Slash (Emissive accent slice cutting through the head) */}
      <mesh position={[0.12, 0.95, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.04, 0.28, 0.45]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>

      {/* Mitre finial sphere */}
      <mesh position={[0, 1.38, 0]}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * 05. KNIGHT: Creative Problem-Solving & Adaptability
 * The authentic Staunton Knight loaded from public/models/staunton-knight.glb (MIT)
 */
export function Knight3D({ accentColor }: PieceVisualProps) {
  const gltf = useGLTF('/models/staunton-knight.glb')
  const materials = usePieceMaterials(accentColor)

  const sceneClone = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.material = materials.titanium
      }
    })
    return clone
  }, [gltf, materials])

  return (
    <group position={[0, -0.65, 0]} rotation={[0, 2.65, 0]} scale={[0.96, 0.96, 0.96]}>
      <primitive object={sceneClone} />

      {/* Right Cybernetic Eye Inlay */}
      <group position={[0.165, 2.30, -0.285]} rotation={[0, 0.45, 0]}>
        <mesh position={[0, 0, 0.005]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <primitive object={materials.acidEmissive} attach="material" />
        </mesh>
      </group>

      {/* Left Cybernetic Eye Inlay */}
      <group position={[-0.165, 2.30, -0.285]} rotation={[0, -0.45, 0]}>
        <mesh position={[0, 0, 0.005]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <primitive object={materials.acidEmissive} attach="material" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 06. PAWN: Fundamentals, Consistency & Iteration
 * Solid, compact foundation piece with rounded head and clean stepped collar.
 */
export function Pawn3D({ accentColor }: PieceVisualProps) {
  const materials = usePieceMaterials(accentColor)

  return (
    <group scale={[0.88, 0.88, 0.88]}>
      <StauntonPedestal materials={materials} />

      {/* Tapered column body */}
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.34, 0.52, 0.72, 48]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Torus waist collar */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.42, 0.35, 0.09, 48]} />
        <primitive object={materials.titaniumDark} attach="material" />
      </mesh>

      {/* Emissive collar ring */}
      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.40, 0.43, 48]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>

      {/* Neck ring */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.30, 0.38, 0.18, 36]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Smooth Spherical Head */}
      <mesh position={[0, 0.68, 0]}>
        <sphereGeometry args={[0.32, 32, 24]} />
        <primitive object={materials.titanium} attach="material" />
      </mesh>

      {/* Tiny apex beacon pip */}
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * Master Active Piece Dispatcher
 * Rotates slowly in the active stage and switches piece smoothly
 */
export function ActiveChessPiece({
  pieceType,
  accentColor,
}: {
  pieceType: ChessPieceType
  accentColor: string
}) {
  const groupRef = useRef<THREE.Group>(null)

  // Gentle, continuous rotation around the Y axis
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45
    }
  })

  return (
    <group ref={groupRef}>
      {pieceType === 'king' && <King3D accentColor={accentColor} />}
      {pieceType === 'queen' && <Queen3D accentColor={accentColor} />}
      {pieceType === 'rook' && <Rook3D accentColor={accentColor} />}
      {pieceType === 'bishop' && <Bishop3D accentColor={accentColor} />}
      {pieceType === 'knight' && <Knight3D accentColor={accentColor} />}
      {pieceType === 'pawn' && <Pawn3D accentColor={accentColor} />}
    </group>
  )
}
