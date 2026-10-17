import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface GyroscopeSceneProps {
  isMobile: boolean
  reducedMotion: boolean
  onNodeHover?: (label: string | null) => void
}

export function GyroscopeScene({ isMobile, reducedMotion, onNodeHover }: GyroscopeSceneProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const outerRingRef = useRef<THREE.Group>(null!)
  const midRingRef = useRef<THREE.Group>(null!)
  const innerRingRef = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Group>(null!)
  const node1Ref = useRef<THREE.Mesh>(null!)
  const node2Ref = useRef<THREE.Mesh>(null!)
  const node3Ref = useRef<THREE.Mesh>(null!)

  const { pointer } = useThree()

  // Acid lime brand color & muted palette
  const colors = useMemo(() => ({
    acid: new THREE.Color('#b9f36a'),
    acidGlow: new THREE.Color('#d2ffa0'),
    darkSurface: new THREE.Color('#11140e'),
    ringLine: new THREE.Color('#58624d'),
    ringAccent: new THREE.Color('#b9f36a'),
    particle: new THREE.Color('#d8fec0'),
  }), [])

  // Procedural particles for ambient telemetry field
  const particleCount = isMobile ? 36 : 80
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const scales = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      // Distribute in a sphere around the gyroscope
      const radius = 2.4 + Math.random() * 2.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      scales[i] = Math.random() * 0.04 + 0.015
    }
    return { positions, scales }
  }, [particleCount])

  // Custom ring geometry created procedurally
  const ringGeometries = useMemo(() => ({
    outer: new THREE.TorusGeometry(2.35, 0.014, 16, 100),
    mid: new THREE.TorusGeometry(1.85, 0.018, 16, 90),
    inner: new THREE.TorusGeometry(1.35, 0.014, 16, 80),
    coreIcosa: new THREE.IcosahedronGeometry(0.72, 0),
    coreInner: new THREE.OctahedronGeometry(0.48, 0),
  }), [])

  // Animation frame loop
  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Pointer parallax with inertia damping
    if (!reducedMotion) {
      const targetX = pointer.x * 0.35
      const targetY = pointer.y * 0.25
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.06)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.06)

      // Continuous gimbal spin on independent axes
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z += delta * 0.22
        outerRingRef.current.rotation.x += delta * 0.08
      }
      if (midRingRef.current) {
        midRingRef.current.rotation.y -= delta * 0.28
        midRingRef.current.rotation.z += delta * 0.12
      }
      if (innerRingRef.current) {
        innerRingRef.current.rotation.x += delta * 0.35
        innerRingRef.current.rotation.y += delta * 0.18
      }
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.4
        coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
      }

      // Orbital positions for satellite telemetry nodes
      const time = state.clock.elapsedTime
      if (node1Ref.current) {
        const a1 = time * 0.65
        node1Ref.current.position.set(Math.cos(a1) * 2.35, Math.sin(a1) * 2.35, Math.sin(a1 * 0.5) * 0.3)
      }
      if (node2Ref.current) {
        const a2 = -time * 0.85 + 1.2
        node2Ref.current.position.set(Math.cos(a2) * 1.85, Math.sin(a2 * 0.6) * 0.4, Math.sin(a2) * 1.85)
      }
      if (node3Ref.current) {
        const a3 = time * 1.1 + 2.5
        node3Ref.current.position.set(Math.sin(a3 * 0.8) * 0.3, Math.cos(a3) * 1.35, Math.sin(a3) * 1.35)
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lighting tailored to dark theme */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={1.8} color={colors.acid} distance={5} decay={2} />
      <pointLight position={[-3, -2, -2]} intensity={0.6} color="#8e7bf3" distance={6} decay={2} />

      {/* Outer Gimbal Ring */}
      <group ref={outerRingRef} rotation={[0.4, 0.2, 0]}>
        <mesh geometry={ringGeometries.outer}>
          <meshStandardMaterial
            color={colors.ringLine}
            roughness={0.3}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>
        {/* Ring segment ticks */}
        <mesh position={[2.35, 0, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.04]} />
          <meshBasicMaterial color={colors.acid} />
        </mesh>
        <mesh position={[-2.35, 0, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.04]} />
          <meshBasicMaterial color={colors.acid} />
        </mesh>
      </group>

      {/* Middle Gimbal Ring */}
      <group ref={midRingRef} rotation={[-0.5, 0.6, 0.4]}>
        <mesh geometry={ringGeometries.mid}>
          <meshStandardMaterial
            color={colors.acid}
            emissive={colors.acid}
            emissiveIntensity={0.25}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>
      </group>

      {/* Inner Gimbal Ring */}
      <group ref={innerRingRef} rotation={[0.8, -0.4, 0.2]}>
        <mesh geometry={ringGeometries.inner}>
          <meshStandardMaterial
            color={colors.ringLine}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      </group>

      {/* Telemetry Satellites / Nodes */}
      <mesh
        ref={node1Ref}
        onPointerOver={() => onNodeHover?.('NODE / 01 · IDEA → BUILD')}
        onPointerOut={() => onNodeHover?.(null)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={colors.acid}
          emissive={colors.acid}
          emissiveIntensity={0.8}
          roughness={0.1}
        />
      </mesh>

      <mesh
        ref={node2Ref}
        onPointerOver={() => onNodeHover?.('NODE / 02 · HUMAN FIRST')}
        onPointerOut={() => onNodeHover?.(null)}
      >
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial
          color="#f2f3eb"
          emissive="#f2f3eb"
          emissiveIntensity={0.5}
          roughness={0.2}
        />
      </mesh>

      <mesh
        ref={node3Ref}
        onPointerOver={() => onNodeHover?.('NODE / 03 · SYSTEMS MINDED')}
        onPointerOut={() => onNodeHover?.(null)}
      >
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color={colors.acid}
          emissive={colors.acid}
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* Central Monolithic Core */}
      <group ref={coreRef}>
        {/* Outer faceted shield (translucent dark obsidian + acid edges) */}
        <mesh geometry={ringGeometries.coreIcosa}>
          <meshStandardMaterial
            color={colors.darkSurface}
            roughness={0.2}
            metalness={0.9}
            wireframe={true}
            emissive={colors.acid}
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Solid faceted inner gem */}
        <mesh geometry={ringGeometries.coreInner}>
          <meshStandardMaterial
            color="#141812"
            emissive={colors.acid}
            emissiveIntensity={0.35}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>

        {/* Central glowing core nucleus */}
        <mesh>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshBasicMaterial color={colors.acidGlow} />
        </mesh>
      </group>

      {/* Ambient Particle Telemetry Field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={colors.particle}
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default GyroscopeScene
