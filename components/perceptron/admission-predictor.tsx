"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { NetworkCanvas } from "@/components/3d/network-canvas"
import { PerceptronVisualization } from "@/components/3d/perceptron-visualization"
import { perceptronPredict, generateAdmissionData, binaryAccuracy } from "@/lib/ml-utils"
import { GraduationCap, Play, RotateCcw, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from "recharts"

export function AdmissionPredictor() {
  // Student inputs
  const [gpa, setGpa] = useState(3.5)
  const [testScore, setTestScore] = useState(650)
  
  // Model parameters (will be trained)
  const [weights, setWeights] = useState([1.5, 1.2])
  const [bias, setBias] = useState(-1.0)
  
  // Training state
  const [isTraining, setIsTraining] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [trainingHistory, setTrainingHistory] = useState<{ epoch: number; accuracy: number; loss: number }[]>([])
  
  // Generate training data
  const trainingData = useMemo(() => generateAdmissionData(100), [])
  
  // Normalize inputs for prediction
  const normalizedInputs = useMemo(() => [
    gpa / 4.0,
    testScore / 800
  ], [gpa, testScore])

  // Calculate prediction
  const { output } = useMemo(() => {
    return perceptronPredict(normalizedInputs, weights, bias)
  }, [normalizedInputs, weights, bias])

  // Calculate current accuracy on training data
  const currentAccuracy = useMemo(() => {
    const predictions = trainingData.inputs.map(inputs => 
      perceptronPredict(inputs, weights, bias).output
    )
    return binaryAccuracy(predictions, trainingData.outputs)
  }, [trainingData, weights, bias])

  // Training step
  const trainStep = useCallback(() => {
    const learningRate = 0.5
    let newWeights = [...weights]
    let newBias = bias

    // Stochastic gradient descent over all samples
    for (let i = 0; i < trainingData.inputs.length; i++) {
      const inputs = trainingData.inputs[i]
      const target = trainingData.outputs[i]
      
      const { output: predicted } = perceptronPredict(inputs, newWeights, newBias)
      const error = target - predicted
      const gradient = predicted * (1 - predicted) // Sigmoid derivative
      
      // Update weights
      newWeights = newWeights.map((w, j) => 
        w + learningRate * error * gradient * inputs[j]
      )
      newBias = newBias + learningRate * error * gradient
    }

    setWeights(newWeights)
    setBias(newBias)
    
    // Calculate metrics
    const predictions = trainingData.inputs.map(inputs => 
      perceptronPredict(inputs, newWeights, newBias).output
    )
    const accuracy = binaryAccuracy(predictions, trainingData.outputs)
    const loss = predictions.reduce((sum, p, i) => {
      const target = trainingData.outputs[i]
      return sum + Math.pow(target - p, 2)
    }, 0) / predictions.length

    return { accuracy, loss }
  }, [weights, bias, trainingData])

  // Train for multiple epochs
  const startTraining = useCallback(async () => {
    setIsTraining(true)
    setTrainingHistory([])
    setEpoch(0)
    
    // Reset weights
    setWeights([Math.random() - 0.5, Math.random() - 0.5])
    setBias(Math.random() - 0.5)
    
    for (let e = 0; e < 50; e++) {
      await new Promise(resolve => setTimeout(resolve, 100))
      const metrics = trainStep()
      setEpoch(e + 1)
      setTrainingHistory(prev => [...prev, { epoch: e + 1, ...metrics }])
    }
    
    setIsTraining(false)
  }, [trainStep])

  // Reset everything
  const reset = useCallback(() => {
    setWeights([1.5, 1.2])
    setBias(-1.0)
    setTrainingHistory([])
    setEpoch(0)
    setGpa(3.5)
    setTestScore(650)
  }, [])

  // Create scatter plot data
  const scatterData = useMemo(() => {
    return trainingData.inputs.map((inputs, i) => ({
      gpa: inputs[0] * 4,
      testScore: inputs[1] * 800,
      admitted: trainingData.outputs[i],
      fill: trainingData.outputs[i] === 1 ? "#34d399" : "#f87171"
    }))
  }, [trainingData])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Visualization & Inputs */}
      <div className="lg:col-span-2 space-y-6">
        {/* 3D Visualization */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              College Admission Predictor
            </CardTitle>
            <CardDescription>
              A perceptron model that predicts college admission based on GPA and test scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] rounded-lg overflow-hidden bg-background/50">
              <NetworkCanvas cameraPosition={[0, 0, 12]}>
                <PerceptronVisualization
                  inputs={normalizedInputs}
                  weights={weights}
                  bias={bias}
                  output={output}
                  inputLabels={["GPA", "Test"]}
                  showLabels={true}
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
              Enter a student&apos;s academic profile to predict admission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>GPA (0.0 - 4.0)</Label>
                  <span className="text-sm font-mono text-primary">{gpa.toFixed(2)}</span>
                </div>
                <Slider
                  value={[gpa]}
                  onValueChange={([v]) => setGpa(v)}
                  min={0}
                  max={4}
                  step={0.1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Test Score (400 - 800)</Label>
                  <span className="text-sm font-mono text-primary">{testScore}</span>
                </div>
                <Slider
                  value={[testScore]}
                  onValueChange={([v]) => setTestScore(v)}
                  min={400}
                  max={800}
                  step={10}
                />
              </div>
            </div>

            {/* Prediction Result */}
            <motion.div
              key={output > 0.5 ? "admitted" : "rejected"}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-6 rounded-xl text-center ${
                output > 0.5 
                  ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30' 
                  : 'bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                {output > 0.5 ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-rose-400" />
                )}
                <span className={`text-2xl font-bold ${output > 0.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {output > 0.5 ? 'Likely Admitted' : 'Likely Rejected'}
                </span>
              </div>
              <div className="text-muted-foreground">
                Confidence: {(output > 0.5 ? output : 1 - output).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Raw output: {output.toFixed(4)}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Training Data Visualization */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Training Data Distribution</CardTitle>
            <CardDescription>
              100 historical admission records (green = admitted, red = rejected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    type="number" 
                    dataKey="gpa" 
                    name="GPA" 
                    domain={[2, 4]} 
                    stroke="#6b7280"
                    label={{ value: 'GPA', position: 'bottom', fill: '#6b7280' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="testScore" 
                    name="Test Score" 
                    domain={[400, 800]} 
                    stroke="#6b7280"
                    label={{ value: 'Test Score', angle: -90, position: 'left', fill: '#6b7280' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  />
                  <Scatter 
                    name="Students" 
                    data={scatterData} 
                    fill="#22d3ee"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Training Panel */}
      <div className="space-y-6">
        {/* Model Training */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Train the Model
            </CardTitle>
            <CardDescription>
              Train the perceptron on 100 historical admission records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button 
                onClick={startTraining} 
                disabled={isTraining}
                className="flex-1 gap-2"
              >
                <Play className="w-4 h-4" />
                {isTraining ? 'Training...' : 'Start Training'}
              </Button>
              <Button onClick={reset} variant="outline" disabled={isTraining}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Training Progress */}
            {(isTraining || epoch > 0) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Epoch</span>
                  <span className="text-foreground">{epoch} / 50</span>
                </div>
                <Progress value={(epoch / 50) * 100} />
              </div>
            )}

            {/* Current Accuracy */}
            <div className="p-4 bg-background/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Accuracy</div>
              <div className="text-2xl font-bold text-primary">
                {(currentAccuracy * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learned Parameters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Learned Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between p-3 bg-background/50 rounded-lg">
              <span className="text-muted-foreground">Weight (GPA)</span>
              <span className={`font-mono ${weights[0] >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {weights[0].toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-background/50 rounded-lg">
              <span className="text-muted-foreground">Weight (Test)</span>
              <span className={`font-mono ${weights[1] >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {weights[1].toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-background/50 rounded-lg">
              <span className="text-muted-foreground">Bias</span>
              <span className="font-mono text-amber-400">{bias.toFixed(4)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Training History Chart */}
        {trainingHistory.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
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

        {/* Insights */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">What&apos;s Happening?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The perceptron learns by adjusting weights to minimize prediction errors. 
              Watch how the weights change during training - larger weights mean that 
              feature is more important for the admission decision.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              After training, try different GPA and test score combinations to see 
              how the model makes predictions based on the learned decision boundary.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
