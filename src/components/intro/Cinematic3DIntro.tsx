import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext'

interface Cinematic3DIntroProps {
  onProgress: (ratio: number, stepText: string, statusText: string) => void
  onReady: () => void
  onComplete: () => void
}

// Preload the local Staunton Knight GLB model
useGLTF.preload('/models/staunton-knight.glb')

/**
 * Procedural fallback actor: keeps the scene visually populated if the GLB is resolving
 */
function IntroKnightFallbackActor({
  timeRef,
  isDark,
}: {
  timeRef: React.MutableRefObject<number>
  isDark: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const color = useMemo(() => isDark ? '#58626c' : '#505862', [isDark])

  useFrame(() => {
    if (!groupRef.current) return
    const t = timeRef.current
    if (t < 0.75) {
      groupRef.current.position.y = 2.8
    } else if (t >= 0.75 && t < 1.65) {
      const p = (t - 0.75) / 0.90
      const ease = 1 - Math.pow(1 - p, 3)
      groupRef.current.position.y = THREE.MathUtils.lerp(2.8, 0.0, ease)
    } else {
      groupRef.current.position.y = 0.0
    }
  })

  return (
    <group ref={groupRef} position={[0, 2.8, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Plinth */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 0.28, 32]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.78} />
      </mesh>
      {/* Torso & Head silhouette */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.6, 1.8, 24]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.78} />
      </mesh>
    </group>
  )
}

/**
 * 3D Realistic Staunton Knight Actor with animated descent and material response
 */
function IntroKnightActor({
  timeRef,
  isDark,
  onModelLoaded,
}: {
  timeRef: React.MutableRefObject<number>
  isDark: boolean
  onModelLoaded: () => void
}) {
  const gltf = useGLTF('/models/staunton-knight.glb')
  const knightGroupRef = useRef<THREE.Group>(null!)
  const rippleMeshRef = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    onModelLoaded()
  }, [onModelLoaded])

  const palette = useMemo(() => ({
    body: isDark ? new THREE.Color('#58626c') : new THREE.Color('#505862'),
    bezel: isDark ? new THREE.Color('#22282e') : new THREE.Color('#384048'),
    acid: isDark ? new THREE.Color('#b9f36a') : new THREE.Color('#1b5e12'),
  }), [isDark])

  // Clone scene with PBR metallic finish
  const sceneClone = useMemo(() => {
    const clone = gltf.scene.clone(true)
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.material = new THREE.MeshStandardMaterial({
          color: palette.body,
          roughness: 0.26,
          metalness: 0.82,
          envMapIntensity: 1.4,
        })
      }
    })
    return clone
  }, [gltf, palette])

  useFrame(() => {
    if (!knightGroupRef.current) return
    const t = timeRef.current

    // STAGE 2: Knight Arrives (0.75s -> 1.65s)
    // Starts at Y = 2.8, eases down to Y = 0.0 with physically convincing weight
    if (t < 0.75) {
      knightGroupRef.current.position.y = 2.8
      knightGroupRef.current.rotation.y = 2.95
    } else if (t >= 0.75 && t < 1.65) {
      const p = (t - 0.75) / 0.90
      // Smooth cubic deceleration (ease-out)
      const ease = 1 - Math.pow(1 - p, 3)
      knightGroupRef.current.position.y = THREE.MathUtils.lerp(2.8, 0.0, ease)
      knightGroupRef.current.rotation.y = THREE.MathUtils.lerp(2.95, 2.55, ease)
    } else {
      // Settled cleanly on the board square
      const microIdle = Math.sin((t - 1.65) * 2.0) * 0.006
      knightGroupRef.current.position.y = microIdle
      knightGroupRef.current.rotation.y = 2.55
    }

    // Impact contact ripple ring at t >= 1.60s
    if (rippleMeshRef.current) {
      if (t >= 1.60 && t < 2.50) {
        const rp = (t - 1.60) / 0.90
        rippleMeshRef.current.visible = true
        const scale = THREE.MathUtils.lerp(0.8, 2.6, rp)
        rippleMeshRef.current.scale.set(scale, scale, 1)
        const mat = rippleMeshRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = (1 - rp) * 0.75
      } else {
        rippleMeshRef.current.visible = false
      }
    }
  })

  return (
    <group ref={knightGroupRef} position={[0, 2.8, 0]} scale={[1.15, 1.15, 1.15]}>
      <primitive object={sceneClone} />

      {/* Cybernetic sensor eye aperture */}
      <group position={[0.165, 2.30, -0.285]} rotation={[0, 0.45, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.028, 0.007, 16, 24]} />
          <meshStandardMaterial color={palette.bezel} metalness={0.92} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <sphereGeometry args={[0.018, 16, 16]} />
          <meshStandardMaterial
            color={palette.acid}
            emissive={palette.acid}
            emissiveIntensity={1.8}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Pedestal circuit inlay ring */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.71, 0.724, 64]} />
        <meshStandardMaterial
          color={palette.acid}
          emissive={palette.acid}
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Contact Landing Ripple Ring */}
      <mesh
        ref={rippleMeshRef}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[0.42, 0.52, 48]} />
        <meshBasicMaterial
          color={palette.acid}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

/**
 * 3D Chessboard Stage with progressive assembly animation
 */
function IntroChessboard({
  timeRef,
  isDark,
}: {
  timeRef: React.MutableRefObject<number>
  isDark: boolean
}) {
  const boardGroupRef = useRef<THREE.Group>(null!)
  const gridSize = 6
  const tileSize = 1.15
  const boardOffset = ((gridSize - 1) * tileSize) / 2

  const palette = useMemo(() => isDark ? ({
    tileLight: new THREE.Color('#5a6672'),
    tileLightTop: new THREE.Color('#708090'),
    tileDark: new THREE.Color('#1c2026'),
    tileDarkBevel: new THREE.Color('#252b33'),
    gridSeam: new THREE.Color('#14171a'),
    hairlineBus: new THREE.Color('#2e382c'),
    acid: new THREE.Color('#b9f36a'),
  }) : ({
    tileLight: new THREE.Color('#ffffff'),
    tileLightTop: new THREE.Color('#f4f6ee'),
    tileDark: new THREE.Color('#5a636e'),
    tileDarkBevel: new THREE.Color('#48505a'),
    gridSeam: new THREE.Color('#bcc4b6'),
    hairlineBus: new THREE.Color('#889282'),
    acid: new THREE.Color('#1b5e12'),
  }), [isDark])

  // Build grid tile data
  const tiles = useMemo(() => {
    const list: Array<{ r: number; c: number; posX: number; posZ: number; isLight: boolean; dist: number }> = []
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const posX = c * tileSize - boardOffset
        const posZ = r * tileSize - boardOffset
        const isLight = (r + c) % 2 === 0
        const dist = Math.hypot(posX, posZ)
        list.push({ r, c, posX, posZ, isLight, dist })
      }
    }
    return list
  }, [gridSize, tileSize, boardOffset])

  useFrame(() => {
    if (!boardGroupRef.current) return
    const t = timeRef.current

    // STAGE 1: The Board Awakens (0.0s -> 0.8s)
    // Tiles emerge and elevate into position based on distance from center
    boardGroupRef.current.children.forEach((child, idx) => {
      const tile = tiles[idx]
      if (!tile) return
      const delay = (tile.dist / (boardOffset * 1.6)) * 0.45
      const tileTime = Math.max(0, t - delay)
      const p = Math.min(1.0, tileTime / 0.40)
      const ease = 1 - Math.pow(1 - p, 2)

      child.position.y = THREE.MathUtils.lerp(-0.40, 0.0, ease)
      const scale = THREE.MathUtils.lerp(0.65, 1.0, ease)
      child.scale.set(scale, 1, scale)
    })
  })

  return (
    <group ref={boardGroupRef} position={[0, -0.04, 0]}>
      {tiles.map((tile) => (
        <group key={`intro-tile-${tile.r}-${tile.c}`} position={[tile.posX, 0, tile.posZ]}>
          <mesh>
            <boxGeometry args={[tileSize * 0.95, 0.08, tileSize * 0.95]} />
            <meshStandardMaterial
              color={tile.isLight ? palette.tileLight : palette.tileDark}
              roughness={tile.isLight ? 0.24 : 0.34}
              metalness={0.82}
            />
          </mesh>

          {/* Top plate */}
          <mesh position={[0, 0.041, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[tileSize * 0.88, tileSize * 0.88]} />
            <meshStandardMaterial
              color={tile.isLight ? palette.tileLightTop : palette.tileDarkBevel}
              roughness={tile.isLight ? 0.20 : 0.32}
              metalness={0.86}
            />
          </mesh>
        </group>
      ))}

      {/* Central Target Square Indicator */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.48, 0.52, 32]} />
        <meshBasicMaterial color={palette.acid} transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/**
 * Cinematic 3D Scene Manager: Orchestrates Camera Orbit, Sweeping Lights & Choreography
 */
function CinematicScene({
  onProgress,
  onReady,
  onComplete,
}: Cinematic3DIntroProps) {
  const { camera } = useThree()
  const { isDark } = useTheme()
  const timeRef = useRef<number>(0)
  const sweepLightRef = useRef<THREE.PointLight>(null!)
  const hasTriggeredComplete = useRef<boolean>(false)
  const [modelReady, setModelReady] = useState(false)

  useEffect(() => {
    onReady()
  }, [onReady])

  useFrame((state, delta) => {
    // Increment animation timer with stable delta clamp
    timeRef.current += Math.min(delta, 0.045)
    const t = timeRef.current

    // Normalized progress ratio (0 to 1 over 3.2s)
    const ratio = Math.min(1.0, t / 3.2)

    // Stage Telemetry and Steps
    if (t < 0.75) {
      onProgress(ratio, 'SYS // THE CHESSBOARD AWAKENS · ASSEMBLING SPATIAL GRID', '[INITIALIZING]')
    } else if (t < 1.65) {
      onProgress(ratio, 'CORE // THE KNIGHT ARRIVES · GROUNDING STAUNTON SCULPTURE', '[CALIBRATING]')
    } else if (t < 2.70) {
      onProgress(ratio, 'TELEMETRY // CINEMATIC REVEAL · ALIGNING STRATEGIC VECTORS', '[SYNCING]')
    } else {
      onProgress(ratio, 'INTERFACE // VYRA SYSTEMS POSITIONED · STANDBY FOR LAUNCH', '[SYSTEMS ALIGNED]')
    }

    // CINEMATIC CAMERA CHOREOGRAPHY:
    // Stage A (0 -> 0.75s): High angle 3/4 perspective observing board assembly
    // Stage B (0.75 -> 1.65s): Smooth dolly-in tracking the descending Knight into place
    // Stage C (1.65 -> 3.3s): Restrained, perceptible ~28 degree orbital arc revealing contours and highlights
    if (t < 0.75) {
      camera.position.set(0, 3.4, 5.0)
      camera.lookAt(0, 0.1, 0)
    } else if (t < 1.65) {
      const p = (t - 0.75) / 0.90
      const ease = 1 - Math.pow(1 - p, 2)
      camera.position.x = THREE.MathUtils.lerp(0.0, 0.35, ease)
      camera.position.y = THREE.MathUtils.lerp(3.4, 2.7, ease)
      camera.position.z = THREE.MathUtils.lerp(5.0, 4.5, ease)
      camera.lookAt(0, THREE.MathUtils.lerp(0.1, 0.35, ease), 0)
    } else {
      // Smooth cinematic orbital sweep (approx 28 degrees yaw)
      const p = Math.min(1.0, (t - 1.65) / 1.55)
      const ease = Math.sin((p * Math.PI) / 2)
      const angle = 0.40 + ease * 0.48
      const radius = 4.4 - ease * 0.25

      camera.position.x = Math.sin(angle) * radius
      camera.position.z = Math.cos(angle) * radius
      camera.position.y = 2.65 - ease * 0.15
      camera.lookAt(0, 0.42, 0)
    }

    // LIGHT SWEEP: Traveling point light sweeps across board tiles
    if (sweepLightRef.current) {
      if (t >= 1.5 && t <= 2.9) {
        const lp = (t - 1.5) / 1.4
        sweepLightRef.current.position.x = THREE.MathUtils.lerp(-2.5, 2.5, lp)
        sweepLightRef.current.position.z = THREE.MathUtils.lerp(-1.5, 2.0, lp)
        sweepLightRef.current.intensity = Math.sin(lp * Math.PI) * (isDark ? 3.5 : 2.5)
      } else {
        sweepLightRef.current.intensity = 0
      }
    }

    // Sequence Completion at 3.3s
    if (t >= 3.3 && !hasTriggeredComplete.current) {
      hasTriggeredComplete.current = true
      onComplete()
    }
  })

  return (
    <>
      {/* BASE AMBIENT LIGHT */}
      <ambientLight intensity={isDark ? 0.7 : 0.95} color={isDark ? '#262f38' : '#f0f4ee'} />

      {/* BROAD KEY LIGHT */}
      <directionalLight
        position={[-3.0, 6.5, 6.0]}
        intensity={isDark ? 3.2 : 2.7}
        color="#ffffff"
        castShadow
      />

      {/* LATERAL FILL LIGHT */}
      <directionalLight
        position={[4.0, 3.5, 4.0]}
        intensity={isDark ? 1.6 : 1.3}
        color={isDark ? '#e2ebf4' : '#eaf0f2'}
      />

      {/* RESTRAINED RIM LIGHT */}
      <directionalLight
        position={[4.5, 4.0, -4.5]}
        intensity={isDark ? 2.5 : 2.0}
        color={isDark ? '#a0c2f0' : '#8294a2'}
      />

      {/* SWEEPING BRAND ACCENT POINT LIGHT */}
      <pointLight
        ref={sweepLightRef}
        position={[0, 0.4, 0]}
        color={isDark ? '#b9f36a' : '#1b5e12'}
        intensity={0}
        distance={4.5}
        decay={2}
      />

      {/* 3D CHESSBOARD WITH EXPANDING ASSEMBLY (Renders Immediately without Suspending) */}
      <IntroChessboard timeRef={timeRef} isDark={isDark} />

      {/* ISOLATED SUSPENSE BOUNDARY FOR THE KNIGHT MODEL */}
      <Suspense fallback={<IntroKnightFallbackActor timeRef={timeRef} isDark={isDark} />}>
        <IntroKnightActor
          timeRef={timeRef}
          isDark={isDark}
          onModelLoaded={() => setModelReady(true)}
        />
      </Suspense>
    </>
  )
}

/**
 * Top-Level Cinematic 3D Canvas for the Loading Intro
 */
export function Cinematic3DIntro({
  onProgress,
  onReady,
  onComplete,
}: Cinematic3DIntroProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 3.4, 5.0], fov: 38, near: 0.1, far: 50 }}
        dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      >
        <CinematicScene
          onProgress={onProgress}
          onReady={onReady}
          onComplete={onComplete}
        />
      </Canvas>
    </div>
  )
}

export default Cinematic3DIntro
