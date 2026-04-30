import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'

function Avatar({ visemeWeights, emotionWeights, config }) {
  const groupRef = useRef(null)
  const headRef = useRef(null)
  const torsoRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)
  const leftLegRef = useRef(null)
  const rightLegRef = useRef(null)
  const mouthRef = useRef(null)
  const leftEyeRef = useRef(null)
  const rightEyeRef = useRef(null)
  
  // Use config values or defaults
  const skin = config?.skinTone || "#e8b8a0"
  const hair = config?.hairColor || "#2c1810"
  const shirt = config?.shirtColor || "#1e40af"
  const pants = config?.pantsColor || "#2d2d2d"
  const eyeColor = config?.eyeColor || "#5b4d3d"
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Main body sway and lean
    if (groupRef.current) {
      // Gentle side-to-side sway
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.12
      // Front-to-back lean
      groupRef.current.rotation.x = Math.cos(time * 0.35) * 0.05
      // Vertical bob (breathing)
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.08
    }
    
    // Head movements - independent from body
    if (headRef.current) {
      // Head sway (more pronounced than body)
      headRef.current.rotation.y = Math.sin(time * 0.6) * 0.15
      // Head nod/tilt
      headRef.current.rotation.x = Math.sin(time * 0.45) * 0.08
      // Head turn
      headRef.current.rotation.z = Math.cos(time * 0.4) * 0.06
    }
    
    // Torso breathing animation
    if (torsoRef.current) {
      const breathingScale = 1 + Math.sin(time * 0.6) * 0.05
      torsoRef.current.scale.y = breathingScale
      torsoRef.current.position.y = Math.sin(time * 0.6) * 0.05
    }
    
    // Left arm gesturing
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(time * 0.5) * 0.25
      leftArmRef.current.rotation.x = Math.cos(time * 0.45) * 0.15
      leftArmRef.current.position.y = Math.sin(time * 0.6) * 0.1
    }
    
    // Right arm gesturing (opposite phase)
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = Math.sin(time * 0.5 + Math.PI) * 0.25
      rightArmRef.current.rotation.x = Math.cos(time * 0.45 + Math.PI) * 0.15
      rightArmRef.current.position.y = Math.sin(time * 0.6 + Math.PI) * 0.1
    }
    
    // Leg subtle sway
    if (leftLegRef.current) {
      leftLegRef.current.rotation.z = Math.sin(time * 0.4) * 0.08
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.z = Math.sin(time * 0.4 + Math.PI) * 0.08
    }
    
    // Blinking animation with variable blink rate
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkCycle = (time * 1.5) % 4
      const blink = blinkCycle < 0.3 || (blinkCycle > 2 && blinkCycle < 2.3) 
        ? Math.sin((time * 15) % Math.PI) 
        : 0
      leftEyeRef.current.scale.y = Math.max(0.1, 1 - blink * 0.9)
      rightEyeRef.current.scale.y = Math.max(0.1, 1 - blink * 0.9)
    }
    
    // Mouth animation
    if (mouthRef.current) {
      const mouthOpen = Object.values(visemeWeights).reduce((a, b) => Math.max(a, b), 0)
      mouthRef.current.scale.y = 1 + mouthOpen * 0.7
    }
  })

  return (
    <group ref={groupRef}>
      {/* Head - better shape */}
      <mesh ref={headRef} position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.38, 48, 48]} />
        <meshStandardMaterial 
          color={skin}
          roughness={0.35} 
          metalness={0.05}
        />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.42, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={skin} roughness={0.4} />
      </mesh>
      <mesh position={[0.42, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={skin} roughness={0.4} />
      </mesh>

      {/* Eyes - white */}
      <mesh position={[-0.15, 0.65, 0.32]} castShadow>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} />
      </mesh>
      <mesh position={[0.15, 0.65, 0.32]} castShadow>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.15} />
      </mesh>

      {/* Eyes - iris/pupil */}
      <mesh ref={leftEyeRef} position={[-0.15, 0.65, 0.37]} castShadow>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.15, 0.65, 0.37]} castShadow>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial color={eyeColor} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Eye shine/highlights */}
      <mesh position={[-0.14, 0.67, 0.4]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.16, 0.67, 0.4]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.55, 0.35]} castShadow>
        <boxGeometry args={[0.08, 0.12, 0.08]} />
        <meshStandardMaterial color={skin} roughness={0.35} />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 0.35, 0.36]} castShadow>
        <boxGeometry args={[0.18, 0.06, 0.02]} />
        <meshStandardMaterial color="#c86a6a" roughness={0.4} />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.15, 0.75, 0.3]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial color={hair} roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 0.75, 0.3]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial color={hair} roughness={0.6} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.3, 20]} />
        <meshStandardMaterial color={skin} roughness={0.35} />
      </mesh>

      {/* Shoulders/Upper torso */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.35, 0.3]} />
        <meshStandardMaterial color={shirt} roughness={0.5} />
      </mesh>

      {/* Left shoulder detail */}
      <mesh position={[-0.35, 0, 0]} castShadow>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color={skin} roughness={0.35} />
      </mesh>

      {/* Right shoulder detail */}
      <mesh position={[0.35, 0, 0]} castShadow>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color={skin} roughness={0.35} />
      </mesh>

      {/* Left arm */}
      <mesh ref={leftArmRef} position={[-0.52, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.55, 16]} />
        <meshStandardMaterial color={skin} roughness={0.35} />
      </mesh>

      {/* Right arm */}
      <mesh ref={rightArmRef} position={[0.52, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.55, 16]} />
        <meshStandardMaterial color={skin} roughness={0.35} />
      </mesh>

      {/* Main torso */}
      <mesh ref={torsoRef} position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[0.55, 0.7, 0.32]} />
        <meshStandardMaterial color={shirt} roughness={0.5} />
      </mesh>

      {/* Left leg */}
      <mesh ref={leftLegRef} position={[-0.18, -1.1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.6, 16]} />
        <meshStandardMaterial color={pants} roughness={0.6} />
      </mesh>

      {/* Right leg */}
      <mesh ref={rightLegRef} position={[0.18, -1.1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.6, 16]} />
        <meshStandardMaterial color={pants} roughness={0.6} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>

      {/* Hair front cover */}
      <mesh position={[0, 0.7, 0.38]} castShadow>
        <boxGeometry args={[0.76, 0.35, 0.15]} />
        <meshStandardMaterial color={hair} roughness={0.7} />
      </mesh>
    </group>
  )
}

export function AvatarScene({ visemeWeights, emotionWeights, avatarConfig }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 2], fov: 50 }} shadows>
      <Environment preset="studio" intensity={1.2} />
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[3, 4, 5]} 
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-3, 2, 3]} intensity={0.6} />
      <Avatar
        visemeWeights={visemeWeights}
        emotionWeights={emotionWeights}
        config={avatarConfig}
      />
      <OrbitControls
        target={[0, 0.2, 0]}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
      />
    </Canvas>
  )
}
