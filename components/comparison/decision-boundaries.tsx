"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { perceptronPredict, mlpForward, initializeMLP, XOR_DATA, AND_DATA, OR_DATA, sigmoid } from "@/lib/ml-utils"
import { Play, RotateCcw, Layers, Brain } from "lucide-react"

type Problem = "AND" | "OR" | "XOR"

const PROBLEMS = {
  AND: AND_DATA,
  OR: OR_DATA,
  XOR: XOR_DATA
}

// Generate grid for decision boundary visualization
function generateGrid(resolution: number): number[][] {
  const grid: number[][] = []
  for (let y = 0; y <= resolution; y++) {
    for (let x = 0; x <= resolution; x++) {
      grid.push([x / resolution, y / resolution])
    }
  }
  return grid
}

export function DecisionBoundaries() {
  const [problem, setProblem] = useState<Problem>("XOR")
  const [isTraining, setIsTraining] = useState(false)
  const [perceptronWeights, setPerceptronWeights] = useState([0.5, 0.5])
  const [perceptronBias, setPerceptronBias] = useState(-0.25)
  const [mlpParams, setMlpParams] = useState(() => initializeMLP([2, 4, 1]))
  const [trained, setTrained] = useState(false)

  const data = PROBLEMS[problem]
  const resolution = 30
  const grid = useMemo(() => generateGrid(resolution), [])

  // Calculate predictions for grid
  const perceptronGrid = useMemo(() => {
    return grid.map(point => ({
      point,
      value: perceptronPredict(point, perceptronWeights, perceptronBias).output
    }))
  }, [grid, perceptronWeights, perceptronBias])

  const mlpGrid = useMemo(() => {
    return grid.map(point => ({
      point,
      value: mlpForward(point, mlpParams.weights, mlpParams.biases).outputs[0]
    }))
  }, [grid, mlpParams])

  // Train both models
  const trainBoth = useCallback(async () => {
    setIsTraining(true)
    setTrained(false)

    // Train perceptron
    let pWeights = [Math.random() - 0.5, Math.random() - 0.5]
    let pBias = Math.random() - 0.5

    for (let e = 0; e < 100; e++) {
      const learningRate = 0.5
      for (const [i, inputs] of data.inputs.entries()) {
        const target = data.outputs[i]
        const { output } = perceptronPredict(inputs, pWeights, pBias)
        const error = target - output
        const gradient = output * (1 - output)
        pWeights = pWeights.map((w, j) => w + learningRate * error * gradient * inputs[j])
        pBias = pBias + learningRate * error * gradient
      }
      if (e % 10 === 0) {
        setPerceptronWeights([...pWeights])
        setPerceptronBias(pBias)
        await new Promise(r => setTimeout(r, 20))
      }
    }
    setPerceptronWeights([...pWeights])
    setPerceptronBias(pBias)

    // Train MLP
    let { weights, biases } = initializeMLP([2, 4, 1])

    for (let e = 0; e < 500; e++) {
      const learningRate = 1.0
      for (const [sampleIdx, inputs] of data.inputs.entries()) {
        const target = data.outputs[sampleIdx]
        
        // Forward pass
        const layerOutputs: number[][] = [inputs]
        for (let l = 0; l < weights.length; l++) {
          const prevOutput = layerOutputs[l]
          const outputs: number[] = []
          for (let j = 0; j < biases[l].length; j++) {
            let sum = biases[l][j]
            for (let i = 0; i < prevOutput.length; i++) {
              sum += prevOutput[i] * weights[l][i][j]
            }
            outputs.push(sigmoid(sum))
          }
          layerOutputs.push(outputs)
        }

        // Backward pass
        const deltas: number[][] = []
        const outputLayer = layerOutputs[layerOutputs.length - 1]
        const outputDelta = outputLayer.map((o) => (target - o) * o * (1 - o))
        deltas.unshift(outputDelta)
        
        for (let l = weights.length - 1; l > 0; l--) {
          const layerDelta: number[] = []
          const prevDelta = deltas[0]
          for (let i = 0; i < weights[l].length; i++) {
            let error = 0
            for (let j = 0; j < prevDelta.length; j++) {
              error += prevDelta[j] * weights[l][i][j]
            }
            const output = layerOutputs[l][i]
            layerDelta.push(error * output * (1 - output))
          }
          deltas.unshift(layerDelta)
        }

        // Update
        for (let l = 0; l < weights.length; l++) {
          for (let i = 0; i < weights[l].length; i++) {
            for (let j = 0; j < weights[l][i].length; j++) {
              weights[l][i][j] += learningRate * deltas[l][j] * layerOutputs[l][i]
            }
          }
          for (let j = 0; j < biases[l].length; j++) {
            biases[l][j] += learningRate * deltas[l][j]
          }
        }
      }
      if (e % 25 === 0) {
        setMlpParams({ 
          weights: weights.map(l => l.map(n => [...n])), 
          biases: biases.map(l => [...l]) 
        })
        await new Promise(r => setTimeout(r, 10))
      }
    }
    setMlpParams({ weights, biases })
    
    setIsTraining(false)
    setTrained(true)
  }, [data])

  // Reset
  const reset = useCallback(() => {
    setPerceptronWeights([0.5, 0.5])
    setPerceptronBias(-0.25)
    setMlpParams(initializeMLP([2, 4, 1]))
    setTrained(false)
  }, [])

  // Get cell color based on prediction
  const getColor = (value: number) => {
    // Cyan for 1, dark for 0
    const intensity = Math.floor(value * 255)
    return `rgb(${intensity * 0.13}, ${intensity * 0.83}, ${intensity * 0.93})`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Decision Boundary Visualization</CardTitle>
          <CardDescription>
            See how each model divides the input space into regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Problem:</span>
              <Select value={problem} onValueChange={(v) => { setProblem(v as Problem); reset(); }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND Gate</SelectItem>
                  <SelectItem value="OR">OR Gate</SelectItem>
                  <SelectItem value="XOR">XOR Gate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={trainBoth} disabled={isTraining} className="gap-2">
              <Play className="w-4 h-4" />
              {isTraining ? "Training..." : "Train Models"}
            </Button>
            <Button onClick={reset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-400" />
              <span className="text-sm text-muted-foreground">Output = 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-900" />
              <span className="text-sm text-muted-foreground">Output = 0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-400" />
              <span className="text-sm text-muted-foreground">True = 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-rose-400" />
              <span className="text-sm text-muted-foreground">True = 0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side by Side Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perceptron Decision Boundary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              Perceptron Decision Boundary
            </CardTitle>
            <CardDescription>
              Can only draw a straight line
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square bg-background rounded-lg overflow-hidden">
              {/* Grid visualization */}
              <svg viewBox={`0 0 ${resolution + 1} ${resolution + 1}`} className="w-full h-full">
                {perceptronGrid.map(({ point, value }, i) => (
                  <rect
                    key={i}
                    x={point[0] * resolution}
                    y={(1 - point[1]) * resolution}
                    width={1.1}
                    height={1.1}
                    fill={getColor(value)}
                  />
                ))}
                {/* Data points */}
                {data.inputs.map((input, i) => (
                  <circle
                    key={`point-${i}`}
                    cx={input[0] * resolution + 0.5}
                    cy={(1 - input[1]) * resolution + 0.5}
                    r={1.5}
                    fill={data.outputs[i] === 1 ? "#34d399" : "#f87171"}
                    stroke="#fff"
                    strokeWidth={0.3}
                  />
                ))}
              </svg>
              {/* Axis labels */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                Input A
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
                Input B
              </div>
            </div>

            {/* Status */}
            <div className={`mt-4 p-3 rounded-lg text-center ${
              problem === "XOR" ? "bg-rose-500/20 border border-rose-500/30" : "bg-emerald-500/20 border border-emerald-500/30"
            }`}>
              {problem === "XOR" ? (
                <span className="text-rose-400">Cannot solve XOR - needs curved boundary</span>
              ) : (
                <span className="text-emerald-400">Can solve {problem} - linearly separable</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* MLP Decision Boundary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              MLP Decision Boundary
            </CardTitle>
            <CardDescription>
              Can learn complex, non-linear boundaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square bg-background rounded-lg overflow-hidden">
              {/* Grid visualization */}
              <svg viewBox={`0 0 ${resolution + 1} ${resolution + 1}`} className="w-full h-full">
                {mlpGrid.map(({ point, value }, i) => (
                  <rect
                    key={i}
                    x={point[0] * resolution}
                    y={(1 - point[1]) * resolution}
                    width={1.1}
                    height={1.1}
                    fill={getColor(value)}
                  />
                ))}
                {/* Data points */}
                {data.inputs.map((input, i) => (
                  <circle
                    key={`point-${i}`}
                    cx={input[0] * resolution + 0.5}
                    cy={(1 - input[1]) * resolution + 0.5}
                    r={1.5}
                    fill={data.outputs[i] === 1 ? "#34d399" : "#f87171"}
                    stroke="#fff"
                    strokeWidth={0.3}
                  />
                ))}
              </svg>
              {/* Axis labels */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                Input A
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
                Input B
              </div>
            </div>

            {/* Status */}
            <div className="mt-4 p-3 rounded-lg text-center bg-emerald-500/20 border border-emerald-500/30">
              <span className="text-emerald-400">
                Can solve all problems including {problem}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explanation */}
      <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/30">
        <CardHeader>
          <CardTitle>Understanding Decision Boundaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Linear Boundaries (Perceptron)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A perceptron computes a weighted sum of inputs and applies a threshold. 
                This creates a straight line (or hyperplane in higher dimensions) that 
                divides the input space into two regions. Problems like AND and OR have 
                data that can be separated by such a line, but XOR cannot.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Non-Linear Boundaries (MLP)</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hidden layers transform the input space, effectively &quot;bending&quot; it so that 
                previously inseparable data becomes separable. Each hidden neuron creates a 
                boundary, and combining them creates complex shapes that can classify any pattern.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
