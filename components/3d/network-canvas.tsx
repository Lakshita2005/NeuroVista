"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import { Suspense, ReactNode } from "react"

interface NetworkCanvasProps {
  children: ReactNode
  className?: string
  cameraPosition?: [number, number, number]
  enableZoom?: boolean
  enablePan?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#22d3ee" wireframe />
    </mesh>
  )
}

export function NetworkCanvas({
  children,
  className = "",
  cameraPosition = [0, 0, 10],
  enableZoom = true,
  enablePan = false,
  autoRotate = false,
  autoRotateSpeed = 0.5
}: NetworkCanvasProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
        <pointLight position={[0, 10, -10]} intensity={0.3} color="#34d399" />

        <Suspense fallback={<Loader />}>
          {children}
          <Environment preset="night" />
        </Suspense>

        <OrbitControls
          enableZoom={enableZoom}
          enablePan={enablePan}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
