"use client"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NetworkCanvas } from "@/components/3d/network-canvas"
import { PerceptronVisualization } from "@/components/3d/perceptron-visualization"
import { perceptronPredict } from "@/lib/ml-utils"
import { Shuffle, RotateCcw, Zap } from "lucide-react"

export function PerceptronPlayground() {
  // Input values
  const [input1, setInput1] = useState(0.5)
  const [input2, setInput2] = useState(0.7)
  
  // Weights and bias
  const [weight1, setWeight1] = useState(0.8)
  const [weight2, setWeight2] = useState(-0.4)
  const [bias, setBias] = useState(0.1)

  // Calculate output
  const { weightedSum, output } = useMemo(() => {
    return perceptronPredict([input1, input2], [weight1, weight2], bias)
  }, [input1, input2, weight1, weight2, bias])

  // Randomize weights
  const randomize = useCallback(() => {
    setWeight1((Math.random() - 0.5) * 2)
    setWeight2((Math.random() - 0.5) * 2)
    setBias((Math.random() - 0.5) * 2)
    setInput1(Math.random())
    setInput2(Math.random())
  }, [])

  // Reset to defaults
  const reset = useCallback(() => {
    setInput1(0.5)
    setInput2(0.7)
    setWeight1(0.8)
    setWeight2(-0.4)
    setBias(0.1)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 3D Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>3D Perceptron Visualization</CardTitle>
          <CardDescription>
            Watch the signal flow from inputs through weights to the output neuron
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg overflow-hidden bg-background/50">
            <NetworkCanvas cameraPosition={[0, 0, 12]}>
              <PerceptronVisualization
                inputs={[input1, input2]}
                weights={[weight1, weight2]}
                bias={bias}
                output={output}
                inputLabels={["x₁", "x₂"]}
                showLabels={true}
              />
            </NetworkCanvas>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="space-y-6">
        {/* Input Controls */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Input Values
            </CardTitle>
            <CardDescription>
              Adjust the input signals sent to the perceptron
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Input x₁</Label>
                <span className="text-sm font-mono text-primary">{input1.toFixed(2)}</span>
              </div>
              <Slider
                value={[input1]}
                onValueChange={([v]) => setInput1(v)}
                min={0}
                max={1}
                step={0.01}
                className="[&_[role=slider]]:bg-cyan-400"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Input x₂</Label>
                <span className="text-sm font-mono text-primary">{input2.toFixed(2)}</span>
              </div>
              <Slider
                value={[input2]}
                onValueChange={([v]) => setInput2(v)}
                min={0}
                max={1}
                step={0.01}
                className="[&_[role=slider]]:bg-cyan-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Weight Controls */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Weights & Bias</CardTitle>
            <CardDescription>
              Control the strength and direction of connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Weight w₁</Label>
                <span className={`text-sm font-mono ${weight1 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {weight1.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[weight1]}
                onValueChange={([v]) => setWeight1(v)}
                min={-1}
                max={1}
                step={0.01}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Weight w₂</Label>
                <span className={`text-sm font-mono ${weight2 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {weight2.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[weight2]}
                onValueChange={([v]) => setWeight2(v)}
                min={-1}
                max={1}
                step={0.01}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Bias b</Label>
                <span className="text-sm font-mono text-amber-400">{bias.toFixed(2)}</span>
              </div>
              <Slider
                value={[bias]}
                onValueChange={([v]) => setBias(v)}
                min={-2}
                max={2}
                step={0.01}
              />
            </div>
          </CardContent>
        </Card>

        {/* Output Display */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardHeader>
            <CardTitle>Output Calculation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formula */}
            <div className="p-4 bg-background/50 rounded-lg font-mono text-sm">
              <div className="text-muted-foreground mb-2">Weighted Sum:</div>
              <div className="text-foreground">
                z = ({input1.toFixed(2)} × {weight1.toFixed(2)}) + ({input2.toFixed(2)} × {weight2.toFixed(2)}) + {bias.toFixed(2)}
              </div>
              <div className="text-primary mt-1">z = {weightedSum.toFixed(4)}</div>
            </div>

            <div className="p-4 bg-background/50 rounded-lg font-mono text-sm">
              <div className="text-muted-foreground mb-2">Sigmoid Activation:</div>
              <div className="text-foreground">
                {"σ(z) = 1 / (1 + e^(-z))"}
              </div>
              <div className="text-2xl text-primary font-bold mt-2">
                Output: {output.toFixed(4)}
              </div>
            </div>

            {/* Classification */}
            <motion.div
              key={output > 0.5 ? "yes" : "no"}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-lg text-center ${
                output > 0.5 
                  ? 'bg-emerald-500/20 border border-emerald-500/30' 
                  : 'bg-rose-500/20 border border-rose-500/30'
              }`}
            >
              <div className="text-sm text-muted-foreground mb-1">Binary Classification (threshold = 0.5)</div>
              <div className={`text-xl font-bold ${output > 0.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {output > 0.5 ? 'Class 1 (Positive)' : 'Class 0 (Negative)'}
              </div>
            </motion.div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  )
}
