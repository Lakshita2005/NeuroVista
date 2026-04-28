"use client"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NetworkCanvas } from "@/components/3d/network-canvas"
import { MLPVisualization } from "@/components/3d/mlp-visualization"
import { mlpForward, initializeMLP } from "@/lib/ml-utils"
import { Shuffle, RotateCcw, Zap, Layers } from "lucide-react"

const ARCHITECTURES = {
  "2-3-1": [2, 3, 1],
  "2-4-2-1": [2, 4, 2, 1],
  "3-4-4-2": [3, 4, 4, 2],
  "4-6-4-1": [4, 6, 4, 1]
}

export function MLPPlayground() {
  // Architecture selection
  const [archKey, setArchKey] = useState<keyof typeof ARCHITECTURES>("2-4-2-1")
  const architecture = ARCHITECTURES[archKey]
  
  // Input values
  const [inputs, setInputs] = useState<number[]>([0.5, 0.7, 0.3, 0.8])
  
  // Weights and biases
  const [{ weights, biases }, setParams] = useState(() => initializeMLP(architecture))
  
  // Layer to highlight
  const [highlightLayer, setHighlightLayer] = useState<number | null>(null)

  // Calculate forward pass
  const { activations, outputs } = useMemo(() => {
    const activeInputs = inputs.slice(0, architecture[0])
    return mlpForward(activeInputs, weights, biases)
  }, [inputs, weights, biases, architecture])

  // Randomize weights
  const randomize = useCallback(() => {
    setParams(initializeMLP(architecture))
    setInputs(prev => prev.map(() => Math.random()))
  }, [architecture])

  // Reset to defaults
  const reset = useCallback(() => {
    setParams(initializeMLP(architecture))
    setInputs([0.5, 0.7, 0.3, 0.8])
    setHighlightLayer(null)
  }, [architecture])

  // Handle architecture change
  const handleArchChange = useCallback((value: string) => {
    const key = value as keyof typeof ARCHITECTURES
    setArchKey(key)
    const newArch = ARCHITECTURES[key]
    setParams(initializeMLP(newArch))
    setHighlightLayer(null)
  }, [])

  // Update single input
  const updateInput = useCallback((index: number, value: number) => {
    setInputs(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 3D Visualization */}
      <Card className="bg-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            3D Network Visualization
          </CardTitle>
          <CardDescription>
            Explore the multi-layer perceptron architecture. Click on layers to highlight signal flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] rounded-lg overflow-hidden bg-background/50">
            <NetworkCanvas cameraPosition={[0, 0, 14]} autoRotate autoRotateSpeed={0.3}>
              <MLPVisualization
                architecture={architecture}
                activations={activations}
                weights={weights}
                showLabels={false}
                highlightLayer={highlightLayer}
              />
            </NetworkCanvas>
          </div>
          
          {/* Layer selector */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Highlight Layer:</span>
            {architecture.map((_, i) => (
              <Button
                key={i}
                variant={highlightLayer === i ? "default" : "outline"}
                size="sm"
                onClick={() => setHighlightLayer(highlightLayer === i ? null : i)}
                className="w-10"
              >
                {i === 0 ? 'In' : i === architecture.length - 1 ? 'Out' : `H${i}`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Network Configuration</CardTitle>
          <CardDescription>
            Adjust the architecture and input values
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Architecture Selection */}
          <div className="space-y-2">
            <Label>Architecture</Label>
            <Select value={archKey} onValueChange={handleArchChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-3-1">2 - 3 - 1 (Simple)</SelectItem>
                <SelectItem value="2-4-2-1">2 - 4 - 2 - 1 (Medium)</SelectItem>
                <SelectItem value="3-4-4-2">3 - 4 - 4 - 2 (Complex)</SelectItem>
                <SelectItem value="4-6-4-1">4 - 6 - 4 - 1 (Deep)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Numbers represent neurons in each layer (input - hidden - output)
            </p>
          </div>

          {/* Input Values */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Input Values
            </Label>
            {Array.from({ length: architecture[0] }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Input x{i + 1}</Label>
                  <span className="text-sm font-mono text-primary">{inputs[i]?.toFixed(2) || '0.00'}</span>
                </div>
                <Slider
                  value={[inputs[i] || 0]}
                  onValueChange={([v]) => updateInput(i, v)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="[&_[role=slider]]:bg-cyan-400"
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={randomize} variant="outline" className="flex-1 gap-2">
              <Shuffle className="w-4 h-4" />
              Randomize
            </Button>
            <Button onClick={reset} variant="outline" className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Display */}
      <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
        <CardHeader>
          <CardTitle>Layer Activations</CardTitle>
          <CardDescription>
            Watch how signals propagate through the network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activations.map((layer, layerIndex) => (
            <motion.div
              key={layerIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: layerIndex * 0.1 }}
              className={`p-3 rounded-lg ${
                highlightLayer === layerIndex 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'bg-background/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {layerIndex === 0 
                    ? 'Input Layer' 
                    : layerIndex === activations.length - 1 
                      ? 'Output Layer' 
                      : `Hidden Layer ${layerIndex}`}
                </span>
                <span className="text-xs text-muted-foreground">
                  {layer.length} neurons
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.map((value, neuronIndex) => (
                  <div
                    key={neuronIndex}
                    className="px-2 py-1 rounded bg-card text-xs font-mono"
                    style={{
                      borderLeft: `3px solid ${
                        layerIndex === 0 
                          ? '#22d3ee' 
                          : layerIndex === activations.length - 1 
                            ? '#34d399' 
                            : '#a78bfa'
                      }`
                    }}
                  >
                    {value.toFixed(3)}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Final Output */}
          <div className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
            <div className="text-sm text-muted-foreground mb-2">Network Output</div>
            <div className="flex gap-3">
              {outputs.map((output, i) => (
                <div key={i} className="text-2xl font-bold text-emerald-400">
                  {output.toFixed(4)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
