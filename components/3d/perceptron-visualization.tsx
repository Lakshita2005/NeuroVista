"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import * as THREE from "three"
import { Neuron3D } from "./neuron-3d"
import { Connection3D } from "./connection-3d"

interface PerceptronVisualizationProps {
  inputs: number[]
  weights: number[]
  bias: number
  output: number
  inputLabels?: string[]
  showLabels?: boolean
  animated?: boolean
}

export function PerceptronVisualization({
  inputs,
  weights,
  bias,
  output,
  inputLabels = [],
  showLabels = true,
  animated = true
}: PerceptronVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Calculate positions for input neurons
  const inputPositions = useMemo<[number, number, number][]>(() => {
    const spacing = 1.5
    const startY = ((inputs.length - 1) * spacing) / 2
    return inputs.map((_, i) => [-3, startY - i * spacing, 0] as [number, number, number])
  }, [inputs.length])

  // Output neuron position
  const outputPosition: [number, number, number] = [3, 0, 0]

  // Bias neuron position (above)
  const biasPosition: [number, number, number] = [0, 2.5, 0]

  // Calculate weighted sum and activation
  const weightedSum = useMemo(() => {
    return inputs.reduce((sum, input, i) => sum + input * weights[i], bias)
  }, [inputs, weights, bias])

  useFrame((state) => {
    if (groupRef.current && animated) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef}>
        {/* Input neurons */}
        {inputPositions.map((pos, i) => (
          <group key={`input-${i}`}>
            <Neuron3D
              position={pos}
              activation={Math.abs(inputs[i])}
              type="input"
              label={inputLabels[i] || `x${i + 1}`}
              showLabel={showLabels}
            />
            {/* Input value display */}
            <Text
              position={[pos[0] - 0.8, pos[1], pos[2]]}
              fontSize={0.2}
              color="#22d3ee"
              anchorX="right"
            >
              {inputs[i].toFixed(2)}
            </Text>
          </group>
        ))}

        {/* Bias neuron */}
        <group>
          <Neuron3D
            position={biasPosition}
            activation={Math.abs(bias)}
            type="hidden"
            label="Bias"
            showLabel={showLabels}
            color="#fbbf24"
          />
          <Text
            position={[biasPosition[0], biasPosition[1] + 0.6, biasPosition[2]]}
            fontSize={0.18}
            color="#fbbf24"
          >
            {bias.toFixed(2)}
          </Text>
        </group>

        {/* Output neuron */}
        <group>
          <Neuron3D
            position={outputPosition}
            activation={output}
            type="output"
            label="Output"
            showLabel={showLabels}
            size={1.3}
          />
          <Text
            position={[outputPosition[0] + 1, outputPosition[1], outputPosition[2]]}
            fontSize={0.25}
            color="#34d399"
          >
            {output.toFixed(3)}
          </Text>
        </group>

        {/* Connections from inputs to output */}
        {inputPositions.map((startPos, i) => (
          <Connection3D
            key={`conn-${i}`}
            start={startPos}
            end={outputPosition}
            weight={weights[i]}
            signal={Math.abs(inputs[i]) > 0.1 ? 1 : 0}
            showSignal={animated && Math.abs(inputs[i]) > 0.1}
          />
        ))}

        {/* Connection from bias to output */}
        <Connection3D
          start={biasPosition}
          end={outputPosition}
          weight={bias}
          signal={Math.abs(bias) > 0.1 ? 1 : 0}
          showSignal={animated}
        />

        {/* Summation symbol at output */}
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.35}
          color="#ffffff"
        >
          {"Σ"}
        </Text>

        {/* Weighted sum display */}
        <Text
          position={[0, -1, 0]}
          fontSize={0.15}
          color="#6b7280"
        >
          {`Sum: ${weightedSum.toFixed(3)}`}
        </Text>

        {/* Activation function label */}
        <Text
          position={[1.5, -1, 0]}
          fontSize={0.12}
          color="#a78bfa"
        >
          {"σ(x) = 1/(1+e^(-x))"}
        </Text>
      </group>
    </Float>
  )
}
