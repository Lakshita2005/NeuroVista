"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { NetworkCanvas } from "@/components/3d/network-canvas"
import { PerceptronVisualization } from "@/components/3d/perceptron-visualization"
import { MLPVisualization } from "@/components/3d/mlp-visualization"
import { perceptronPredict, mlpForward, initializeMLP, XOR_DATA, sigmoid } from "@/lib/ml-utils"
import { Play, RotateCcw, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export function XORComparison() {
  // XOR inputs to test
  const [selectedInput, setSelectedInput] = useState(0)
  const currentInput = XOR_DATA.inputs[selectedInput]
  const expectedOutput = XOR_DATA.outputs[selectedInput]

  // Perceptron state
  const [perceptronWeights, setPerceptronWeights] = useState([0.5, 0.5])
  const [perceptronBias, setPerceptronBias] = useState(-0.25)
  const [perceptronEpoch, setPerceptronEpoch] = useState(0)
  const [perceptronTraining, setPerceptronTraining] = useState(false)
  
  // MLP state
  const [mlpParams, setMlpParams] = useState(() => initializeMLP([2, 4, 1]))
  const [mlpEpoch, setMlpEpoch] = useState(0)
  const [mlpTraining, setMlpTraining] = useState(false)
  
  // Training refs
  const perceptronRef = useRef<boolean>(false)
  const mlpRef = useRef<boolean>(false)

  // Perceptron prediction
  const perceptronOutput = useMemo(() => {
    return perceptronPredict(currentInput, perceptronWeights, perceptronBias).output
  }, [currentInput, perceptronWeights, perceptronBias])

  // MLP prediction
  const mlpOutput = useMemo(() => {
    return mlpForward(currentInput, mlpParams.weights, mlpParams.biases).outputs[0]
  }, [currentInput, mlpParams])

  // Calculate accuracy on all XOR samples
  const perceptronAccuracy = useMemo(() => {
    let correct = 0
    for (let i = 0; i < XOR_DATA.inputs.length; i++) {
      const pred = perceptronPredict(XOR_DATA.inputs[i], perceptronWeights, perceptronBias).output
      if ((pred > 0.5 ? 1 : 0) === XOR_DATA.outputs[i]) correct++
    }
    return correct / XOR_DATA.inputs.length
  }, [perceptronWeights, perceptronBias])

  const mlpAccuracy = useMemo(() => {
    let correct = 0
    for (let i = 0; i < XOR_DATA.inputs.length; i++) {
      const pred = mlpForward(XOR_DATA.inputs[i], mlpParams.weights, mlpParams.biases).outputs[0]
      if ((pred > 0.5 ? 1 : 0) === XOR_DATA.outputs[i]) correct++
    }
    return correct / XOR_DATA.inputs.length
  }, [mlpParams])

  // Train perceptron (will plateau and fail)
  const trainPerceptron = useCallback(async () => {
    setPerceptronTraining(true)
    perceptronRef.current = true
    setPerceptronEpoch(0)
    
    let weights = [Math.random() - 0.5, Math.random() - 0.5]
    let bias = Math.random() - 0.5
    
    for (let e = 0; e < 100; e++) {
      if (!perceptronRef.current) break
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const learningRate = 0.5
      for (const [i, inputs] of XOR_DATA.inputs.entries()) {
        const target = XOR_DATA.outputs[i]
        const { output } = perceptronPredict(inputs, weights, bias)
        const error = target - output
        const gradient = output * (1 - output)
        
        weights = weights.map((w, j) => w + learningRate * error * gradient * inputs[j])
        bias = bias + learningRate * error * gradient
      }
      
      setPerceptronWeights(weights)
      setPerceptronBias(bias)
      setPerceptronEpoch(e + 1)
    }
    
    setPerceptronTraining(false)
    perceptronRef.current = false
  }, [])

  // Train MLP (will succeed)
  const trainMLP = useCallback(async () => {
    setMlpTraining(true)
    mlpRef.current = true
    setMlpEpoch(0)
    
    let { weights, biases } = initializeMLP([2, 4, 1])
    
    for (let e = 0; e < 500; e++) {
      if (!mlpRef.current) break
      
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const learningRate = 1.0
      
      for (const [sampleIdx, inputs] of XOR_DATA.inputs.entries()) {
        const target = XOR_DATA.outputs[sampleIdx]
        
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
        
        // Output layer delta
        const outputLayer = layerOutputs[layerOutputs.length - 1]
        const outputDelta = outputLayer.map((o) => {
          const error = target - o
          return error * o * (1 - o)
        })
        deltas.unshift(outputDelta)
        
        // Hidden layer deltas
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

        // Update weights and biases
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
      
      if (e % 5 === 0) {
        setMlpParams({ weights: weights.map(l => l.map(n => [...n])), biases: biases.map(l => [...l]) })
        setMlpEpoch(e + 1)
      }
    }
    
    setMlpParams({ weights, biases })
    setMlpEpoch(500)
    setMlpTraining(false)
    mlpRef.current = false
  }, [])

  // Reset
  const reset = useCallback(() => {
    perceptronRef.current = false
    mlpRef.current = false
    setPerceptronTraining(false)
    setMlpTraining(false)
    setPerceptronWeights([0.5, 0.5])
    setPerceptronBias(-0.25)
    setPerceptronEpoch(0)
    setMlpParams(initializeMLP([2, 4, 1]))
    setMlpEpoch(0)
    setSelectedInput(0)
  }, [])

  // Train both
  const trainBoth = useCallback(() => {
    trainPerceptron()
    trainMLP()
  }, [trainPerceptron, trainMLP])

  return (
    <div className="space-y-6">
      {/* XOR Truth Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>The XOR Problem</CardTitle>
          <CardDescription>
            Select an input combination to see how each model performs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {XOR_DATA.inputs.map((input, i) => (
              <Button
                key={i}
                variant={selectedInput === i ? "default" : "outline"}
                onClick={() => setSelectedInput(i)}
                className="flex flex-col h-auto py-3 px-6"
              >
                <div className="text-xs text-muted-foreground mb-1">Input</div>
                <div className="font-mono text-lg">[{input.join(", ")}]</div>
                <div className="text-xs mt-1">
                  Expected: <span className={XOR_DATA.outputs[i] === 1 ? "text-emerald-400" : "text-rose-400"}>
                    {XOR_DATA.outputs[i]}
                  </span>
                </div>
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={trainBoth} disabled={perceptronTraining || mlpTraining} className="gap-2">
              <Play className="w-4 h-4" />
              Train Both Models
            </Button>
            <Button onClick={reset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Side by Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perceptron Side */}
        <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Single Perceptron
            </CardTitle>
            <CardDescription>
              Cannot solve XOR - it&apos;s not linearly separable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 3D Visualization */}
            <div className="h-[300px] rounded-lg overflow-hidden bg-background/50">
              <NetworkCanvas cameraPosition={[0, 0, 12]}>
                <PerceptronVisualization
                  inputs={currentInput}
                  weights={perceptronWeights}
                  bias={perceptronBias}
                  output={perceptronOutput}
                  inputLabels={["A", "B"]}
                  showLabels={true}
                />
              </NetworkCanvas>
            </div>

            {/* Training Progress */}
            {(perceptronTraining || perceptronEpoch > 0) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Epoch</span>
                  <span className="text-foreground">{perceptronEpoch} / 100</span>
                </div>
                <Progress value={(perceptronEpoch / 100) * 100} className="[&>div]:bg-rose-400" />
              </div>
            )}

            {/* Results */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Output</div>
                <div className="text-xl font-mono font-bold text-rose-400">
                  {perceptronOutput.toFixed(3)}
                </div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                <div className="text-xl font-bold text-rose-400">
                  {(perceptronAccuracy * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Prediction */}
            <motion.div
              key={`perceptron-${selectedInput}-${perceptronOutput > 0.5 ? 1 : 0}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`p-4 rounded-lg text-center ${
                (perceptronOutput > 0.5 ? 1 : 0) === expectedOutput
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-rose-500/20 border border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {(perceptronOutput > 0.5 ? 1 : 0) === expectedOutput ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className="font-medium">
                  Predicts: {perceptronOutput > 0.5 ? 1 : 0} (Expected: {expectedOutput})
                </span>
              </div>
            </motion.div>

            {/* Explanation */}
            <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                A single perceptron can only draw a straight line to separate classes. 
                XOR requires a curved or multi-part boundary, which is impossible with one neuron.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* MLP Side */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Multi-Layer Perceptron
            </CardTitle>
            <CardDescription>
              Solves XOR with a hidden layer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 3D Visualization */}
            <div className="h-[300px] rounded-lg overflow-hidden bg-background/50">
              <NetworkCanvas cameraPosition={[0, 0, 12]}>
                <MLPVisualization
                  architecture={[2, 4, 1]}
                  activations={mlpForward(currentInput, mlpParams.weights, mlpParams.biases).activations}
                  weights={mlpParams.weights}
                  showLabels={false}
                />
              </NetworkCanvas>
            </div>

            {/* Training Progress */}
            {(mlpTraining || mlpEpoch > 0) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Epoch</span>
                  <span className="text-foreground">{mlpEpoch} / 500</span>
                </div>
                <Progress value={(mlpEpoch / 500) * 100} className="[&>div]:bg-emerald-400" />
              </div>
            )}

            {/* Results */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Output</div>
                <div className="text-xl font-mono font-bold text-emerald-400">
                  {mlpOutput.toFixed(3)}
                </div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                <div className="text-xl font-bold text-emerald-400">
                  {(mlpAccuracy * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Prediction */}
            <motion.div
              key={`mlp-${selectedInput}-${mlpOutput > 0.5 ? 1 : 0}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className={`p-4 rounded-lg text-center ${
                (mlpOutput > 0.5 ? 1 : 0) === expectedOutput
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-rose-500/20 border border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {(mlpOutput > 0.5 ? 1 : 0) === expectedOutput ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className="font-medium">
                  Predicts: {mlpOutput > 0.5 ? 1 : 0} (Expected: {expectedOutput})
                </span>
              </div>
            </motion.div>

            {/* Explanation */}
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                The hidden layer transforms the inputs into a new representation where XOR 
                becomes linearly separable. The output neuron then draws a simple line in this new space.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
