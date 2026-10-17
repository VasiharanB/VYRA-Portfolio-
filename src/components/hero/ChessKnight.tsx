import React, { useMemo } from 'react'
import * as THREE from 'three'

interface ChessKnightProps {
  hoveredVector: string | null
  reducedMotion: boolean
}

export function ChessKnight({ hoveredVector, reducedMotion }: ChessKnightProps) {
  // Curated PBR palette tailored strictly to VYRA identity
  const palette = useMemo(() => ({
    knightBody: new THREE.Color('#141813'),
    knightRim: new THREE.Color('#7b6ff0'),
    acidAccent: new THREE.Color('#b9f36a'),
    acidGlow: new THREE.Color('#d8ff9c'),
    darkGraphite: new THREE.Color('#0c0f0b'),
    metalSeam: new THREE.Color('#283024'),
  }), [])

  // Procedural Staunton Knight Silhouette Shape
  const { headGeometry, baseGeometries } = useMemo(() => {
    const shape = new THREE.Shape()

    // Start at bottom rear neck (relative to base)
    shape.moveTo(-0.65, 0.0)

    // Arched dorsal spine with segmented crest notches
    shape.bezierCurveTo(-0.85, 0.6, -0.95, 1.2, -0.85, 1.7)
    // Mane notch 1
    shape.lineTo(-1.02, 2.05)
    shape.lineTo(-0.86, 2.22)
    // Mane notch 2
    shape.lineTo(-1.05, 2.5)
    shape.lineTo(-0.82, 2.68)
    // Mane notch 3
    shape.lineTo(-0.95, 2.95)
    shape.lineTo(-0.7, 3.12)

    // Apex between alert ears
    shape.lineTo(-0.52, 3.32)
    // Left ear tip
    shape.lineTo(-0.42, 3.78)
    shape.lineTo(-0.22, 3.42)

    // Forehead slope & brow
    shape.bezierCurveTo(0.08, 3.3, 0.38, 2.92, 0.58, 2.68)

    // Snout bridge down to muzzle
    shape.bezierCurveTo(0.85, 2.45, 1.08, 2.25, 1.25, 2.02)
    // Muzzle tip & nostril undercut
    shape.lineTo(1.28, 1.88)
    shape.lineTo(1.12, 1.78)

    // Chin and jawline arch
    shape.bezierCurveTo(0.85, 1.68, 0.55, 1.62, 0.32, 1.45)

    // Throat and chest curve down to base
    shape.bezierCurveTo(0.25, 1.15, 0.36, 0.7, 0.48, 0.0)

    // Bottom base closure
    shape.lineTo(-0.65, 0.0)

    // Smooth beveled extrusion
    const head = new THREE.ExtrudeGeometry(shape, {
      depth: 0.56,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    })
    // Center extrusion on Z
    head.translate(0, 0, -0.38)

    // Stepped multi-tiered circular pedestal base
    const basePlate = new THREE.CylinderGeometry(1.35, 1.48, 0.28, 48)
    const baseCollar = new THREE.TorusGeometry(1.28, 0.08, 16, 48)
    baseCollar.rotateX(Math.PI / 2)
    const midRiser = new THREE.CylinderGeometry(0.98, 1.22, 0.32, 48)
    const upperCollar = new THREE.TorusGeometry(1.02, 0.065, 16, 48)
    upperCollar.rotateX(Math.PI / 2)

    return {
      headGeometry: head,
      baseGeometries: {
        basePlate,
        baseCollar,
        midRiser,
        upperCollar,
      },
    }
  }, [])

  return (
    <group position={[0, -0.65, 0]} rotation={[0, 2.65, 0]} scale={[0.82, 0.82, 0.82]}>
      {/* STEPPED PEDESTAL BASE */}
      <group position={[0, -0.15, 0]}>
        {/* Tier 1: Heavy Chamfered Base Plate */}
        <mesh geometry={baseGeometries.basePlate}>
          <meshStandardMaterial
            color={palette.knightBody}
            roughness={0.22}
            metalness={0.9}
          />
        </mesh>
        {/* Torus Lower Ring */}
        <mesh geometry={baseGeometries.baseCollar} position={[0, 0.14, 0]}>
          <meshStandardMaterial
            color={palette.metalSeam}
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>
        {/* Tier 2: Mid Riser */}
        <mesh geometry={baseGeometries.midRiser} position={[0, 0.28, 0]}>
          <meshStandardMaterial
            color={palette.knightBody}
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>
        {/* Upper Ring Collar */}
        <mesh geometry={baseGeometries.upperCollar} position={[0, 0.44, 0]}>
          <meshStandardMaterial
            color={palette.acidAccent}
            emissive={palette.acidAccent}
            emissiveIntensity={hoveredVector ? 0.4 : 0.2}
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* SCULPTED STAUNTON KNIGHT HEAD & TORSO */}
      <group position={[0, 0.32, 0]}>
        <mesh geometry={headGeometry}>
          <meshStandardMaterial
            color={palette.knightBody}
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>

        {/* BILATERAL CHEEK PLATES (3D Muscular Anatomy) */}
        {[-0.38, 0.38].map((zPos, idx) => (
          <group key={`cheek-${idx}`} position={[0.42, 2.05, zPos]} scale={[1.35, 0.95, 0.35]}>
            <mesh>
              <sphereGeometry args={[0.34, 24, 24]} />
              <meshStandardMaterial
                color={palette.darkGraphite}
                roughness={0.18}
                metalness={0.94}
              />
            </mesh>
          </group>
        ))}

        {/* BILATERAL 3D ALERT EARS */}
        {[-0.22, 0.22].map((zPos, idx) => (
          <group
            key={`ear-${idx}`}
            position={[-0.36, 3.52, zPos]}
            rotation={[zPos > 0 ? 0.18 : -0.18, 0, -0.12]}
          >
            <mesh>
              <coneGeometry args={[0.13, 0.5, 16]} />
              <meshStandardMaterial
                color={palette.knightBody}
                roughness={0.22}
                metalness={0.9}
              />
            </mesh>
          </group>
        ))}

        {/* CYBERNETIC SENSOR EYES (Almond Sockets with Acid-Lime Pupils) */}
        {[-0.39, 0.39].map((zPos, idx) => (
          <group key={`eye-${idx}`} position={[0.34, 2.72, zPos]} rotation={[0, zPos > 0 ? 0.3 : -0.3, 0]}>
            {/* Eye socket bezel ring */}
            <mesh>
              <torusGeometry args={[0.075, 0.02, 16, 24]} />
              <meshStandardMaterial color={palette.metalSeam} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Emissive cybernetic pupil */}
            <mesh position={[0, 0, 0.015]}>
              <sphereGeometry args={[0.038, 16, 16]} />
              <meshBasicMaterial color={palette.acidGlow} />
            </mesh>
          </group>
        ))}

        {/* DORSAL CIRCUIT BUS RIBBON (Connecting Chess to Software Systems) */}
        <group position={[-0.72, 1.7, 0]} rotation={[0, 0, 0.2]}>
          <mesh>
            <boxGeometry args={[0.04, 1.8, 0.06]} />
            <meshStandardMaterial
              color={palette.acidAccent}
              emissive={palette.acidAccent}
              emissiveIntensity={hoveredVector ? 0.65 : 0.35}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* SNOUT NOSTRIL ACCENTS */}
        {[-0.14, 0.14].map((zPos, idx) => (
          <mesh key={`nostril-${idx}`} position={[1.15, 1.96, zPos]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.05, 0.08, 0.025]} />
            <meshBasicMaterial color={palette.acidAccent} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default ChessKnight
