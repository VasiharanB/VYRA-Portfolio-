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
    const body = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#525c66'),
      roughness: 0.28,
      metalness: 0.78,
      envMapIntensity: 1.3,
    })

    const bodyDark = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#22272e'),
      roughness: 0.32,
      metalness: 0.82,
    })

    const acidEmissive = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 1.4,
      roughness: 0.2,
    })

    const chromeBezel = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#384149'),
      metalness: 0.92,
      roughness: 0.18,
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

  // Height and scale adjustments so pieces match tournament Staunton proportions perfectly
  const pieceConfig = useMemo(() => {
    switch (pieceType) {
      case 'king':
        return { scale: 1.0, posY: 0, collarY: 0.22, collarRadius: 0.78 }
      case 'queen':
        return { scale: 1.0, posY: 0, collarY: 0.22, collarRadius: 0.76 }
      case 'bishop':
        return { scale: 1.0, posY: 0, collarY: 0.20, collarRadius: 0.65 }
      case 'knight':
        // Knight GLB is slightly larger, scale down to match proportions
        return { scale: 0.88, posY: 0, collarY: 0.20, collarRadius: 0.64 }
      case 'rook':
        return { scale: 1.0, posY: 0, collarY: 0.20, collarRadius: 0.68 }
      case 'pawn':
        return { scale: 1.0, posY: 0, collarY: 0.18, collarRadius: 0.52 }
    }
  }, [pieceType])

  return (
    <group scale={[pieceConfig.scale, pieceConfig.scale, pieceConfig.scale]}>
      {/* 1. Sculpted Staunton Mesh */}
      <primitive object={clonedScene} />

      {/* 2. Restrained VYRA Acid-Lime Telemetry Collar Inlay */}
      <mesh
        position={[0, pieceConfig.collarY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry
          args={[pieceConfig.collarRadius - 0.015, pieceConfig.collarRadius, 48]}
        />
        <primitive object={materials.acidEmissive} attach="material" />
      </mesh>

      {/* Extra subtle crown beacon on King / Queen / Bishop */}
      {pieceType === 'king' && (
        <mesh position={[0, 3.42, 0]}>
          <sphereGeometry args={[0.038, 16, 16]} />
          <primitive object={materials.acidEmissive} attach="material" />
        </mesh>
      )}
      {pieceType === 'queen' && (
        <mesh position={[0, 3.02, 0]}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <primitive object={materials.acidEmissive} attach="material" />
        </mesh>
      )}
      {pieceType === 'bishop' && (
        <mesh position={[0, 2.62, 0]}>
          <sphereGeometry args={[0.028, 16, 16]} />
          <primitive object={materials.acidEmissive} attach="material" />
        </mesh>
      )}
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
