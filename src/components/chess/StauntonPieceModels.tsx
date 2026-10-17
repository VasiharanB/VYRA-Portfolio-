import React, { useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

export type ChessPieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'

// Preload the local Staunton GLB models
useGLTF.preload('/models/staunton-king.glb')
useGLTF.preload('/models/staunton-queen.glb')
useGLTF.preload('/models/staunton-bishop.glb')
useGLTF.preload('/models/staunton-knight.glb')
useGLTF.preload('/models/staunton-rook.glb')
useGLTF.preload('/models/staunton-pawn.glb')

interface StauntonModelProps {
  modelPath: string
  accentColor?: string
  pieceType: ChessPieceType
}

/**
 * Standard PBR material palette for all 6 Staunton pieces:
 * Refined brushed titanium / obsidian slate with subtle specular highlights
 * and signature VYRA acid-lime circuit accent inlay.
 */
function usePieceMaterials(accentColor = '#b9f36a') {
  return useMemo(() => {
    // High-visibility brushed titanium tone: catches highlights and retains clear surface volume
    const body = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#788594'),
      roughness: 0.32,
      metalness: 0.70,
      envMapIntensity: 1.4,
    })

    const bodyDark = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38414b'),
      roughness: 0.35,
      metalness: 0.75,
    })

    // Restrained hairline circuit inlay at base bevel
    const acidEmissive = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 1.2,
      roughness: 0.25,
    })

    const chromeBezel = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#48535f'),
      metalness: 0.88,
      roughness: 0.20,
    })

    return { body, bodyDark, acidEmissive, chromeBezel }
  }, [accentColor])
}

/**
 * Base Staunton piece mesh loader from GLB
 */
function StauntonGlbModel({ modelPath, accentColor = '#b9f36a', pieceType }: StauntonModelProps) {
  const gltf = useGLTF(modelPath)
  const materials = usePieceMaterials(accentColor)

  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.material = materials.body
      }
    })
    return clone
  }, [gltf, materials])

  // Base collar radius for the subtle acid-lime ring inlay
  const collarConfig = useMemo(() => {
    switch (pieceType) {
      case 'king':
        return { collarY: 0.18, collarRadius: 0.78 }
      case 'queen':
        return { collarY: 0.18, collarRadius: 0.76 }
      case 'bishop':
        return { collarY: 0.16, collarRadius: 0.65 }
      case 'knight':
        return { collarY: 0.18, collarRadius: 0.68 }
      case 'rook':
        return { collarY: 0.16, collarRadius: 0.68 }
      case 'pawn':
        return { collarY: 0.14, collarRadius: 0.52 }
    }
  }, [pieceType])

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Sculpted Staunton Mesh */}
      <primitive object={clonedScene} />

      {/* 2. Restrained VYRA Acid-Lime Telemetry Collar Inlay */}
      <mesh
        position={[0, collarConfig.collarY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry
          args={[collarConfig.collarRadius - 0.016, collarConfig.collarRadius, 64]}
        />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * Geometric fallback in case asset fails or is loading
 */
function PieceLoadingFallback({ pieceType, accentColor = '#b9f36a' }: { pieceType: ChessPieceType; accentColor?: string }) {
  const materials = usePieceMaterials(accentColor)
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 0.28, 36]} />
        <primitive object={materials.body} attach="material" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.35, 0.55, 1.1, 36]} />
        <primitive object={materials.body} attach="material" />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <primitive object={materials.bodyDark} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * Master Staunton Piece Component
 */
export function StauntonPiece({
  pieceType,
  accentColor = '#b9f36a',
}: {
  pieceType: ChessPieceType
  accentColor?: string
}) {
  const modelPath = useMemo(() => {
    switch (pieceType) {
      case 'king':
        return '/models/staunton-king.glb'
      case 'queen':
        return '/models/staunton-queen.glb'
      case 'bishop':
        return '/models/staunton-bishop.glb'
      case 'knight':
        return '/models/staunton-knight.glb'
      case 'rook':
        return '/models/staunton-rook.glb'
      case 'pawn':
        return '/models/staunton-pawn.glb'
    }
  }, [pieceType])

  return (
    <Suspense fallback={<PieceLoadingFallback pieceType={pieceType} accentColor={accentColor} />}>
      <StauntonGlbModel modelPath={modelPath} accentColor={accentColor} pieceType={pieceType} />
    </Suspense>
  )
}
