"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

interface Neuron3DProps {
  position: [number, number, number]
  activation?: number
  label?: string
  type?: "input" | "hidden" | "output"
  showLabel?: boolean
  size?: number
  color?: string
  pulseSpeed?: number
}

export function Neuron3D({
  position,
  activation = 0,
  label,
  type = "hidden",
  showLabel = false,
  size = 1,
  color,
  pulseSpeed = 2
}: Neuron3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Default colors based on type
  const defaultColors = {
    input: "#22d3ee",    // Cyan
    hidden: "#a78bfa",   // Purple
    output: "#34d399"    // Green
  }

  const neuronColor = color || defaultColors[type]

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse effect based on activation
      const pulse = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.05 * activation
      meshRef.current.scale.setScalar(size * pulse)
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.1 + activation * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef} scale={size * 1.8}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={neuronColor}
          transparent
          opacity={0.1 + activation * 0.3}
        />
      </mesh>

      {/* Main neuron body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.25 * size, 32, 32]} />
        <meshStandardMaterial
          color={neuronColor}
          emissive={neuronColor}
          emissiveIntensity={0.3 + activation * 0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner core */}
      <mesh scale={size * 0.6}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={activation * 0.5}
          transparent
          opacity={0.3 + activation * 0.4}
        />
      </mesh>

      {/* Label */}
      {showLabel && label && (
        <Text
          position={[0, -0.5 * size, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
        >
          {label}
        </Text>
      )}
    </group>
  )
}
