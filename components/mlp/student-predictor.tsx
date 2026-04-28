"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { NetworkCanvas } from "@/components/3d/network-canvas"
import { MLPVisualization } from "@/components/3d/mlp-visualization"
import { mlpForward, initializeMLP, generateStudentData, binaryAccuracy, sigmoid } from "@/lib/ml-utils"
import { GraduationCap, Play, RotateCcw, TrendingUp, CheckCircle, XCircle, Pause, Clock, BookOpen, Moon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function StudentPredictor() {
  // Student inputs
  const [studyHours, setStudyHours] = useState(5)
  const [attendance, setAttendance] = useState(0.8)
  const [previousGrade, setPreviousGrade] = useState(70)
  const [sleepHours, setSleepHours] = useState(7)
  
  // Model parameters
  const architecture = [4, 6, 4, 1]
  const [{ weights, biases }, setParams] = useState(() => initializeMLP(architecture))
  
  // Training state
  const [isTraining, setIsTraining] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [trainingHistory, setTrainingHistory] = useState<{ epoch: number; accuracy: number; loss: number }[]>([])
  const trainingRef = useRef<boolean>(false)
  
  // Generate training data
  const trainingData = useMemo(() => generateStudentData(200), [])
  
  // Normalize inputs for prediction
  const normalizedInputs = useMemo(() => [
    studyHours / 10,
    attendance,
    previousGrade / 100,
    sleepHours / 10
  ], [studyHours, attendance, previousGrade, sleepHours])

  // Calculate prediction
  const { activations, outputs } = useMemo(() => {
    return mlpForward(normalizedInputs, weights, biases)
  }, [normalizedInputs, weights, biases])

  const prediction = outputs[0]

  // Calculate current accuracy
  const currentAccuracy = useMemo(() => {
    const predictions = trainingData.inputs.map(inputs => 
      mlpForward(inputs, weights, biases).outputs[0]
    )
    return binaryAccuracy(predictions, trainingData.outputs)
  }, [trainingData, weights, biases])

  // Training function with backpropagation
  const trainEpoch = useCallback((currentWeights: number[][][], currentBiases: number[][]) => {
    const learningRate = 0.3
    const newWeights = currentWeights.map(layer => layer.map(neuron => [...neuron]))
    const newBiases = currentBiases.map(layer => [...layer])

    // Mini-batch gradient descent
    for (let sample = 0; sample < trainingData.inputs.length; sample++) {
      const inputs = trainingData.inputs[sample]
      const target = trainingData.outputs[sample]
      
      // Forward pass
      const layerInputs: number[][] = [inputs]
      const layerOutputs: number[][] = [inputs]
      
      for (let l = 0; l < newWeights.length; l++) {
        const prevOutput = layerOutputs[l]
        const outputs: number[] = []
        
        for (let j = 0; j < newBiases[l].length; j++) {
          let sum = newBiases[l][j]
          for (let i = 0; i < prevOutput.length; i++) {
            sum += prevOutput[i] * newWeights[l][i][j]
          }
          outputs.push(sigmoid(sum))
        }
        
        layerInputs.push(outputs.map((o, j) => {
          let sum = newBiases[l][j]
          for (let i = 0; i < prevOutput.length; i++) {
            sum += prevOutput[i] * newWeights[l][i][j]
          }
          return sum
        }))
        layerOutputs.push(outputs)
      }

      // Backward pass
      const deltas: number[][] = []
      
      // Output layer delta
      const outputLayer = layerOutputs[layerOutputs.length - 1]
      const outputDelta = outputLayer.map((o, i) => {
        const error = target - o
        return error * o * (1 - o)
      })
      deltas.unshift(outputDelta)
      
      // Hidden layer deltas
      for (let l = newWeights.length - 1; l > 0; l--) {
        const layerDelta: number[] = []
        const prevDelta = deltas[0]
        
        for (let i = 0; i < newWeights[l].length; i++) {
          let error = 0
          for (let j = 0; j < prevDelta.length; j++) {
            error += prevDelta[j] * newWeights[l][i][j]
          }
          const output = layerOutputs[l][i]
          layerDelta.push(error * output * (1 - output))
        }
        deltas.unshift(layerDelta)
      }

      // Update weights and biases
      for (let l = 0; l < newWeights.length; l++) {
        for (let i = 0; i < newWeights[l].length; i++) {
          for (let j = 0; j < newWeights[l][i].length; j++) {
            newWeights[l][i][j] += learningRate * deltas[l][j] * layerOutputs[l][i]
          }
        }
        for (let j = 0; j < newBiases[l].length; j++) {
          newBiases[l][j] += learningRate * deltas[l][j]
        }
      }
    }

    // Calculate metrics
    const predictions = trainingData.inputs.map(inputs => 
      mlpForward(inputs, newWeights, newBiases).outputs[0]
    )
    const accuracy = binaryAccuracy(predictions, trainingData.outputs)
    const loss = predictions.reduce((sum, p, i) => {
      const target = trainingData.outputs[i]
      return sum + Math.pow(target - p, 2)
    }, 0) / predictions.length

    return { weights: newWeights, biases: newBiases, accuracy, loss }
  }, [trainingData])

  // Start training
  const startTraining = useCallback(async () => {
    setIsTraining(true)
    trainingRef.current = true
    setTrainingHistory([])
    setEpoch(0)
    
    let currentWeights = initializeMLP(architecture).weights
    let currentBiases = initializeMLP(architecture).biases
    setParams({ weights: currentWeights, biases: currentBiases })
    
    for (let e = 0; e < 100; e++) {
      if (!trainingRef.current) break
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const result = trainEpoch(currentWeights, currentBiases)
      currentWeights = result.weights
      currentBiases = result.biases
      
      setParams({ weights: currentWeights, biases: currentBiases })
      setEpoch(e + 1)
      setTrainingHistory(prev => [...prev, { epoch: e + 1, accuracy: result.accuracy, loss: result.loss }])
    }
    
    setIsTraining(false)
    trainingRef.current = false
  }, [trainEpoch])

  // Stop training
  const stopTraining = useCallback(() => {
    trainingRef.current = false
    setIsTraining(false)
  }, [])

  // Reset
  const reset = useCallback(() => {
    stopTraining()
    setParams(initializeMLP(architecture))
    setTrainingHistory([])
    setEpoch(0)
    setStudyHours(5)
    setAttendance(0.8)
    setPreviousGrade(70)
    setSleepHours(7)
  }, [stopTraining])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Visualization & Inputs */}
      <div className="lg:col-span-2 space-y-6">
        {/* 3D Visualization */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              Student Performance Predictor
            </CardTitle>
            <CardDescription>
              An MLP that predicts whether a student will pass based on study habits and history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] rounded-lg overflow-hidden bg-background/50">
              <NetworkCanvas cameraPosition={[0, 0, 14]}>
                <MLPVisualization
                  architecture={architecture}
                  activations={activations}
                  weights={weights}
                  showLabels={false}
                />
              </NetworkCanvas>
            </div>
          </CardContent>
        </Card>

        {/* Student Profile Inputs */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>
              Adjust the student&apos;s characteristics to see how they affect the prediction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Study Hours / Day
                  </Label>
                  <span className="text-sm font-mono text-primary">{studyHours}h</span>
                </div>
                <Slider
                  value={[studyHours]}
                  onValueChange={([v]) => setStudyHours(v)}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Attendance Rate
                  </Label>
                  <span className="text-sm font-mono text-primary">{(attendance * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[attendance]}
                  onValueChange={([v]) => setAttendance(v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    Previous Grade
                  </Label>
                  <span className="text-sm font-mono text-primary">{previousGrade}%</span>
                </div>
                <Slider
                  value={[previousGrade]}
                  onValueChange={([v]) => setPreviousGrade(v)}
                  min={40}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-amber-400" />
                    Sleep Hours / Night
                  </Label>
                  <span className="text-sm font-mono text-primary">{sleepHours}h</span>
                </div>
                <Slider
                  value={[sleepHours]}
                  onValueChange={([v]) => setSleepHours(v)}
                  min={4}
                  max={10}
                  step={0.5}
                />
              </div>
            </div>

            {/* Prediction Result */}
            <motion.div
              key={prediction > 0.5 ? "pass" : "fail"}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-6 rounded-xl text-center ${
                prediction > 0.5 
                  ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30' 
                  : 'bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                {prediction > 0.5 ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400" />
                )}
                <span className={`text-2xl font-bold ${prediction > 0.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {prediction > 0.5 ? 'Likely to Pass' : 'At Risk of Failing'}
                </span>
              </div>
              <div className="text-muted-foreground">
                Confidence: {((prediction > 0.5 ? prediction : 1 - prediction) * 100).toFixed(1)}%
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Training History Chart */}
        {trainingHistory.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
              <CardDescription>
                Watch the model learn over {epoch} epochs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="epoch" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      domain={[0, 1]}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#34d399" 
                      strokeWidth={2}
                      dot={false}
                      name="Accuracy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="loss" 
                      stroke="#f87171" 
                      strokeWidth={2}
                      dot={false}
                      name="Loss"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right: Training Panel */}
      <div className="space-y-6">
        {/* Model Training */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Train the Model
            </CardTitle>
            <CardDescription>
              Train on 200 synthetic student records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              {isTraining ? (
                <Button 
                  onClick={stopTraining}
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Stop
                </Button>
              ) : (
                <Button 
                  onClick={startTraining}
                  className="flex-1 gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Training
                </Button>
              )}
              <Button onClick={reset} variant="outline" disabled={isTraining}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Training Progress */}
            {(isTraining || epoch > 0) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Epoch</span>
                  <span className="text-foreground">{epoch} / 100</span>
                </div>
                <Progress value={(epoch / 100) * 100} />
              </div>
            )}

            {/* Current Accuracy */}
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Accuracy</div>
              <div className="text-2xl font-bold text-emerald-400">
                {(currentAccuracy * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Architecture */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Network Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2">
              {architecture.map((neurons, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    i === 0 ? 'bg-cyan-500/20 text-cyan-400' :
                    i === architecture.length - 1 ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-violet-500/20 text-violet-400'
                  }`}>
                    {neurons}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {i === 0 ? 'In' : i === architecture.length - 1 ? 'Out' : `H${i}`}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              4 inputs - 6 hidden - 4 hidden - 1 output
            </p>
          </CardContent>
        </Card>

        {/* Feature Importance (simplified) */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">Input Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Study Hours</span>
              <span className="text-sm font-mono text-cyan-400">{normalizedInputs[0].toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Attendance</span>
              <span className="text-sm font-mono text-emerald-400">{normalizedInputs[1].toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Previous Grade</span>
              <span className="text-sm font-mono text-violet-400">{normalizedInputs[2].toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-background/50 rounded">
              <span className="text-sm text-muted-foreground">Sleep Hours</span>
              <span className="text-sm font-mono text-amber-400">{normalizedInputs[3].toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">Why MLPs Work Here</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Student performance depends on complex interactions between factors. 
              For example, studying 10 hours helps, but only if you also sleep well. 
              The MLP&apos;s hidden layers can learn these non-linear relationships that 
              a simple perceptron cannot capture.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
