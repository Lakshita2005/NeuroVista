"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import * as THREE from "three"
import { Neuron3D } from "./neuron-3d"
import { Connection3D } from "./connection-3d"

interface MLPVisualizationProps {
  architecture: number[] // e.g., [2, 4, 3, 1] for 2 inputs, 4 hidden, 3 hidden, 1 output
  activations?: number[][] // activation values for each layer
  weights?: number[][][] // weights between layers
  showLabels?: boolean
  animated?: boolean
  highlightLayer?: number | null
}

export function MLPVisualization({
  architecture,
  activations,
  weights,
  showLabels = false,
  animated = true,
  highlightLayer = null
}: MLPVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Calculate neuron positions for each layer
  const layerPositions = useMemo(() => {
    const totalLayers = architecture.length
    const layerSpacing = 3
    const startX = -((totalLayers - 1) * layerSpacing) / 2

    return architecture.map((neuronCount, layerIndex) => {
      const x = startX + layerIndex * layerSpacing
      const verticalSpacing = 1.2
      const startY = ((neuronCount - 1) * verticalSpacing) / 2

      return Array.from({ length: neuronCount }, (_, neuronIndex) => {
        const y = startY - neuronIndex * verticalSpacing
        return [x, y, 0] as [number, number, number]
      })
    })
  }, [architecture])

  // Generate default activations if not provided
  const defaultActivations = useMemo(() => {
    return architecture.map(count => 
      Array.from({ length: count }, () => Math.random() * 0.5 + 0.3)
    )
  }, [architecture])

  const currentActivations = activations || defaultActivations

  // Generate default weights if not provided
  const defaultWeights = useMemo(() => {
    const w: number[][][] = []
    for (let l = 0; l < architecture.length - 1; l++) {
      const layerWeights: number[][] = []
      for (let i = 0; i < architecture[l]; i++) {
        const neuronWeights: number[] = []
        for (let j = 0; j < architecture[l + 1]; j++) {
          neuronWeights.push((Math.random() - 0.5) * 2)
        }
        layerWeights.push(neuronWeights)
      }
      w.push(layerWeights)
    }
    return w
  }, [architecture])

  const currentWeights = weights || defaultWeights

  // Determine neuron type based on layer
  const getNeuronType = (layerIndex: number): "input" | "hidden" | "output" => {
    if (layerIndex === 0) return "input"
    if (layerIndex === architecture.length - 1) return "output"
    return "hidden"
  }

  // Get layer label
  const getLayerLabel = (layerIndex: number): string => {
    if (layerIndex === 0) return "Input"
    if (layerIndex === architecture.length - 1) return "Output"
    return `Hidden ${layerIndex}`
  }

  useFrame((state) => {
    if (groupRef.current && animated) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={groupRef}>
        {/* Layer labels */}
        {layerPositions.map((layer, layerIndex) => (
          <Text
            key={`layer-label-${layerIndex}`}
            position={[layer[0][0], 3.5, 0]}
            fontSize={0.2}
            color={highlightLayer === layerIndex ? "#22d3ee" : "#6b7280"}
          >
            {getLayerLabel(layerIndex)}
          </Text>
        ))}

        {/* Connections */}
        {layerPositions.slice(0, -1).map((currentLayer, layerIndex) => {
          const nextLayer = layerPositions[layerIndex + 1]
          
          return currentLayer.map((startPos, fromIndex) => 
            nextLayer.map((endPos, toIndex) => {
              const weight = currentWeights[layerIndex]?.[fromIndex]?.[toIndex] ?? 0.5
              const isHighlighted = highlightLayer === layerIndex || highlightLayer === layerIndex + 1
              
              return (
                <Connection3D
                  key={`conn-${layerIndex}-${fromIndex}-${toIndex}`}
                  start={startPos}
                  end={endPos}
                  weight={weight}
                  signal={isHighlighted ? 1 : 0}
                  showSignal={animated && isHighlighted}
                />
              )
            })
          )
        })}

        {/* Neurons */}
        {layerPositions.map((layer, layerIndex) =>
          layer.map((pos, neuronIndex) => {
            const activation = currentActivations[layerIndex]?.[neuronIndex] ?? 0.5
            const isHighlighted = highlightLayer === layerIndex
            
            return (
              <Neuron3D
                key={`neuron-${layerIndex}-${neuronIndex}`}
                position={pos}
                activation={isHighlighted ? 1 : activation}
                type={getNeuronType(layerIndex)}
                label={showLabels ? `L${layerIndex}N${neuronIndex}` : undefined}
                showLabel={showLabels}
                size={layerIndex === 0 || layerIndex === architecture.length - 1 ? 0.9 : 1}
              />
            )
          })
        )}

        {/* Architecture info */}
        <Text
          position={[0, -4, 0]}
          fontSize={0.15}
          color="#6b7280"
        >
          {`Architecture: ${architecture.join(" → ")}`}
        </Text>
      </group>
    </Float>
  )
}
