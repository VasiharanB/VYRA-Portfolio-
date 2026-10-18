import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface GyroscopeSceneProps {
  isMobile: boolean
  reducedMotion: boolean
  onNodeHover?: (label: string | null) => void
}

export function GyroscopeScene({ isMobile, reducedMotion, onNodeHover }: GyroscopeSceneProps) {
  const masterGroupRef = useRef<THREE.Group>(null!)
  const outerRingRef = useRef<THREE.Group>(null!)
  const midRingRef = useRef<THREE.Group>(null!)
  const innerRingRef = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Group>(null!)
  const satellite1Ref = useRef<THREE.Group>(null!)
  const satellite2Ref = useRef<THREE.Group>(null!)
  const satellite3Ref = useRef<THREE.Group>(null!)

  const { pointer } = useThree()

  // Curated palette tailored strictly to VYRA identity
  const palette = useMemo(() => ({
    acid: new THREE.Color('#b9f36a'),
    acidBright: new THREE.Color('#d8ff9c'),
    acidGlow: new THREE.Color('#b9f36a'),
    coolRim: new THREE.Color('#7a6ef5'),
    darkMetallic: new THREE.Color('#141713'),
    ringLineMuted: new THREE.Color('#383e33'),
    stardust: new THREE.Color('#d4f7b0'),
  }), [])

  // Procedural ambient telemetry stardust particles for volumetric depth
  const particleCount = isMobile ? 50 : 130
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.9 + Math.random() * 3.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  }, [particleCount])

  // Custom procedural ring geometries with bevels & fine engineering profile
  const geometries = useMemo(() => ({
    outerGimbal: new THREE.TorusGeometry(2.5, 0.022, 16, 120),
    midGimbal: new THREE.TorusGeometry(2.0, 0.024, 16, 100),
    innerGimbal: new THREE.TorusGeometry(1.5, 0.02, 16, 80),
    equatorBelt: new THREE.TorusGeometry(2.25, 0.012, 12, 90),
    coreCage: new THREE.IcosahedronGeometry(0.82, 0),
    coreInnerGem: new THREE.OctahedronGeometry(0.54, 0),
    coreNucleus: new THREE.SphereGeometry(0.24, 24, 24),
    nodeSphere: new THREE.SphereGeometry(0.08, 16, 16),
    nodeHalo: new THREE.RingGeometry(0.12, 0.16, 32),
  }), [])

  // Smooth frame loop with damped parallax & multi-axis gimbal mechanics
  useFrame((state, delta) => {
    if (!masterGroupRef.current) return

    // Smooth cursor-reactive camera & object tilt
    if (!reducedMotion) {
      const targetRotationY = pointer.x * 0.4
      const targetRotationX = -pointer.y * 0.3
      masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.y,
        targetRotationY,
        0.05
      )
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        targetRotationX,
        0.05
      )

      // Gimbal rotation choreography on independent axes
      const time = state.clock.elapsedTime

      if (outerRingRef.current) {
        outerRingRef.current.rotation.z += delta * 0.18
        outerRingRef.current.rotation.x += delta * 0.06
      }
      if (midRingRef.current) {
        midRingRef.current.rotation.y -= delta * 0.24
        midRingRef.current.rotation.z += delta * 0.12
      }
      if (innerRingRef.current) {
        innerRingRef.current.rotation.x += delta * 0.3
        innerRingRef.current.rotation.y -= delta * 0.16
      }
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.35
        coreRef.current.rotation.z = Math.sin(time * 0.7) * 0.16
        // Subtle breathing pulse
        const pulse = 1 + Math.sin(time * 1.8) * 0.035
        coreRef.current.scale.set(pulse, pulse, pulse)
      }

      // Orbiting telemetry satellites
      if (satellite1Ref.current) {
        const a1 = time * 0.55
        satellite1Ref.current.position.set(
          Math.cos(a1) * 2.5,
          Math.sin(a1) * 2.5,
          Math.sin(a1 * 0.8) * 0.4
        )
      }
      if (satellite2Ref.current) {
        const a2 = -time * 0.7 + 1.4
        satellite2Ref.current.position.set(
          Math.cos(a2) * 2.0,
          Math.sin(a2 * 0.5) * 0.6,
          Math.sin(a2) * 2.0
        )
      }
      if (satellite3Ref.current) {
        const a3 = time * 0.88 + 2.8
        satellite3Ref.current.position.set(
          Math.sin(a3 * 0.6) * 0.4,
          Math.cos(a3) * 1.5,
          Math.sin(a3) * 1.5
        )
      }
    }
  })

  return (
    <group ref={masterGroupRef}>
      {/* Precision multi-directional lighting creating rich depth & specular edges */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 5]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-6, -4, -4]} intensity={0.65} color={palette.coolRim} />
      <pointLight position={[0, 0, 0]} intensity={2.6} color={palette.acid} distance={6} decay={2} />
      <pointLight position={[2.5, -2, 2.5]} intensity={0.9} color={palette.acidBright} distance={4} decay={2} />

      {/* OUTER GIMBAL RING (Technical Coordinate Ring) */}
      <group ref={outerRingRef} rotation={[0.42, 0.18, 0]}>
        <mesh geometry={geometries.outerGimbal}>
          <meshStandardMaterial
            color={palette.ringLineMuted}
            roughness={0.22}
            metalness={0.9}
          />
        </mesh>
        {/* Fine coordinate notches at 90-degree marks */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
          <mesh key={idx} position={[Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0]}>
            <boxGeometry args={[0.08, 0.035, 0.035]} />
            <meshBasicMaterial color={palette.acid} />
          </mesh>
        ))}
      </group>

      {/* MIDDLE GIMBAL RING (Emissive Acid Line) */}
      <group ref={midRingRef} rotation={[-0.52, 0.6, 0.32]}>
        <mesh geometry={geometries.midGimbal}>
          <meshStandardMaterial
            color={palette.acid}
            emissive={palette.acid}
            emissiveIntensity={0.32}
            roughness={0.16}
            metalness={0.88}
          />
        </mesh>
      </group>

      {/* EQUATORIAL BELT RING */}
      <group rotation={[1.15, -0.28, 0.75]}>
        <mesh geometry={geometries.equatorBelt}>
          <meshStandardMaterial
            color={palette.ringLineMuted}
            roughness={0.3}
            metalness={0.85}
            wireframe={true}
          />
        </mesh>
      </group>

      {/* INNER GIMBAL RING */}
      <group ref={innerRingRef} rotation={[0.82, -0.42, 0.22]}>
        <mesh geometry={geometries.innerGimbal}>
          <meshStandardMaterial
            color={palette.darkMetallic}
            emissive={palette.acid}
            emissiveIntensity={0.16}
            roughness={0.28}
            metalness={0.88}
          />
        </mesh>
      </group>

      {/* SATELLITE TELEMETRY NODES (Interactive Raycast Targets) */}
      <group
        ref={satellite1Ref}
        onPointerOver={() => onNodeHover?.('NODE / 01 · IDEA → BUILD')}
        onPointerOut={() => onNodeHover?.(null)}
      >
        <mesh geometry={geometries.nodeSphere}>
          <meshStandardMaterial
            color={palette.acid}
            emissive={palette.acid}
            emissiveIntensity={0.95}
            roughness={0.1}
          />
        </mesh>
        <mesh geometry={geometries.nodeHalo} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={palette.acid} transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group
        ref={satellite2Ref}
        onPointerOver={() => onNodeHover?.('NODE / 02 · HUMAN FIRST')}
        onPointerOut={() => onNodeHover?.(null)}
      >
        <mesh geometry={geometries.nodeSphere}>
          <meshStandardMaterial
            color="#f2f3eb"
            emissive="#f2f3eb"
            emissiveIntensity={0.7}
            roughness={0.2}
          />
        </mesh>
      </group>

      <group
        ref={satellite3Ref}
        onPointerOver={() => onNodeHover?.('NODE / 03 · SYSTEMS MINDED')}
        onPointerOut={() => onNodeHover?.(null)}
      >
        <mesh geometry={geometries.nodeSphere}>
          <meshStandardMaterial
            color={palette.acid}
            emissive={palette.acid}
            emissiveIntensity={0.9}
          />
        </mesh>
      </group>

      {/* CENTRAL MONOLITHIC CORE */}
      <group ref={coreRef}>
        {/* Outer faceted structural cage (Acid-edged geometric polyhedron) */}
        <mesh geometry={geometries.coreCage}>
          <meshStandardMaterial
            color={palette.darkMetallic}
            emissive={palette.acid}
            emissiveIntensity={0.28}
            wireframe={true}
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>

        {/* Inner solid obsidian crystal */}
        <mesh geometry={geometries.coreInnerGem}>
          <meshStandardMaterial
            color="#0d110b"
            emissive={palette.acid}
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>

        {/* Central glowing nuclear core */}
        <mesh geometry={geometries.coreNucleus}>
          <meshBasicMaterial color={palette.acidBright} />
        </mesh>
      </group>

      {/* AMBIENT STARDUST / TELEMETRY PARTICLES */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.03 : 0.038}
          color={palette.stardust}
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default GyroscopeScene
