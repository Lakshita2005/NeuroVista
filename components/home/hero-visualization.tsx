"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Float, Environment } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function Neuron({ position, scale = 1, color = "#22d3ee" }: { 
  position: [number, number, number]
  scale?: number
  color?: string 
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1))
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3 * scale, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

function Connection({ start, end, color = "#22d3ee" }: { 
  start: [number, number, number]
  end: [number, number, number]
  color?: string 
}) {
  const lineRef = useRef<THREE.Line>(null)

  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5)
    mid.z += 0.5

    return new THREE.QuadraticBezierCurve3(startVec, mid, endVec)
  }, [start, end])

  const points = useMemo(() => curve.getPoints(30), [curve])
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={2} />
    </line>
  )
}

function SignalParticle({ curve, speed = 1 }: { 
  curve: THREE.QuadraticBezierCurve3
  speed?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const progress = useRef(Math.random())

  useFrame((state, delta) => {
    if (meshRef.current) {
      progress.current = (progress.current + delta * speed * 0.5) % 1
      const point = curve.getPoint(progress.current)
      meshRef.current.position.copy(point)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#22d3ee"
        emissiveIntensity={2}
      />
    </mesh>
  )
}

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null)

  // Define network layers
  const layers = useMemo(() => [
    // Input layer
    [[-3, 1.5, 0], [-3, 0, 0], [-3, -1.5, 0]],
    // Hidden layer 1
    [[-1, 2, 0], [-1, 0.7, 0], [-1, -0.7, 0], [-1, -2, 0]],
    // Hidden layer 2
    [[1, 1.2, 0], [1, 0, 0], [1, -1.2, 0]],
    // Output layer
    [[3, 0.5, 0], [3, -0.5, 0]]
  ] as [number, number, number][][], [])

  // Generate connections
  const connections = useMemo(() => {
    const conns: { start: [number, number, number]; end: [number, number, number] }[] = []
    for (let l = 0; l < layers.length - 1; l++) {
      for (const start of layers[l]) {
        for (const end of layers[l + 1]) {
          conns.push({ start: start as [number, number, number], end: end as [number, number, number] })
        }
      }
    }
    return conns
  }, [layers])

  // Create curves for signal particles
  const curves = useMemo(() => {
    return connections.slice(0, 8).map(({ start, end }) => {
      const startVec = new THREE.Vector3(...start)
      const endVec = new THREE.Vector3(...end)
      const mid = startVec.clone().add(endVec).multiplyScalar(0.5)
      mid.z += 0.3
      return new THREE.QuadraticBezierCurve3(startVec, mid, endVec)
    })
  }, [connections])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  const colors = ["#22d3ee", "#34d399", "#a78bfa", "#fbbf24"]

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Connections */}
        {connections.map((conn, i) => (
          <Connection 
            key={`conn-${i}`} 
            start={conn.start} 
            end={conn.end}
            color={colors[Math.floor(i / 12) % colors.length]}
          />
        ))}

        {/* Neurons */}
        {layers.map((layer, li) =>
          layer.map((pos, ni) => (
            <Neuron
              key={`neuron-${li}-${ni}`}
              position={pos as [number, number, number]}
              scale={li === 0 || li === layers.length - 1 ? 0.9 : 1}
              color={colors[li % colors.length]}
            />
          ))
        )}

        {/* Signal particles */}
        {curves.map((curve, i) => (
          <SignalParticle key={`signal-${i}`} curve={curve} speed={0.8 + Math.random() * 0.4} />
        ))}
      </group>
    </Float>
  )
}

export function HeroVisualization() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-card to-background border border-border">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
        
        <NeuralNetwork />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
        />
        <Environment preset="night" />
      </Canvas>
    </div>
  )
}
