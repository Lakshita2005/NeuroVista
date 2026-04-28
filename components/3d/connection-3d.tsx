"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface Connection3DProps {
  start: [number, number, number]
  end: [number, number, number]
  weight?: number
  signal?: number // 0-1 for signal traveling along connection
  animated?: boolean
  showSignal?: boolean
}

export function Connection3D({
  start,
  end,
  weight = 0.5,
  signal = 0,
  animated = true,
  showSignal = true
}: Connection3DProps) {
  const lineRef = useRef<THREE.Line>(null)
  const signalRef = useRef<THREE.Mesh>(null)
  const signalProgress = useRef(Math.random())

  // Determine color based on weight
  const color = useMemo(() => {
    if (weight > 0) {
      // Positive weight: cyan to green
      const intensity = Math.min(Math.abs(weight), 1)
      return new THREE.Color().setHSL(0.45 - intensity * 0.1, 0.8, 0.5)
    } else {
      // Negative weight: orange to red
      const intensity = Math.min(Math.abs(weight), 1)
      return new THREE.Color().setHSL(0.05 - intensity * 0.05, 0.8, 0.5)
    }
  }, [weight])

  // Create curved path
  const { curve, points, geometry } = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    
    // Create control point for bezier curve
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5)
    const direction = endVec.clone().sub(startVec).normalize()
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, direction.z * 0.3)
    mid.add(perpendicular.multiplyScalar(0.3))

    const quadCurve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec)
    const curvePoints = quadCurve.getPoints(30)
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints)

    return { curve: quadCurve, points: curvePoints, geometry: lineGeometry }
  }, [start, end])

  // Line thickness based on weight
  const thickness = 0.015 + Math.abs(weight) * 0.03

  useFrame((state, delta) => {
    // Animate line opacity
    if (lineRef.current && animated) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }

    // Animate signal particle
    if (signalRef.current && showSignal && signal > 0) {
      signalProgress.current = (signalProgress.current + delta * 0.8) % 1
      const point = curve.getPoint(signalProgress.current)
      signalRef.current.position.copy(point)
      signalRef.current.scale.setScalar(0.8 + Math.sin(signalProgress.current * Math.PI) * 0.4)
    }
  })

  return (
    <group>
      {/* Connection line using tube geometry for thickness */}
      <mesh>
        <tubeGeometry args={[curve, 20, thickness, 8, false]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4 + Math.abs(weight) * 0.3}
        />
      </mesh>

      {/* Signal particle */}
      {showSignal && signal > 0 && (
        <mesh ref={signalRef} position={start}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#22d3ee"
            emissiveIntensity={2}
          />
        </mesh>
      )}
    </group>
  )
}

// Batch connection renderer for performance
interface ConnectionBatchProps {
  connections: Array<{
    start: [number, number, number]
    end: [number, number, number]
    weight: number
  }>
  activeSignals?: number[] // Indices of active connections
}

export function ConnectionBatch({ connections, activeSignals = [] }: ConnectionBatchProps) {
  return (
    <group>
      {connections.map((conn, i) => (
        <Connection3D
          key={i}
          start={conn.start}
          end={conn.end}
          weight={conn.weight}
          signal={activeSignals.includes(i) ? 1 : 0}
          showSignal={activeSignals.includes(i)}
        />
      ))}
    </group>
  )
}
