"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Clock, ArrowRight, Database, Trash2, DoorOpen, DoorClosed, Activity, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimeStep {
  id: number
  input: number
  cellState: number
  forget: number
  input_gate: number
  output: number
  hidden: number
}

export function LSTMTheory() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const sequence = [
    { day: "Day 1", activity: "Study 8h", sleep: "6h", stress: "High", productivity: "85%" },
    { day: "Day 2", activity: "Study 6h", sleep: "5h", stress: "High", productivity: "72%" },
    { day: "Day 3", activity: "Study 4h", sleep: "4h", stress: "Very High", productivity: "45%" },
    { day: "Day 4", activity: "Study 2h", sleep: "3h", stress: "Critical", productivity: "25%" },
    { day: "Day 5", activity: "Rest", sleep: "9h", stress: "Low", productivity: "60%" },
    { day: "Day 6", activity: "Study 7h", sleep: "7h", stress: "Medium", productivity: "88%" },
    { day: "Day 7", activity: "Study 8h", sleep: "8h", stress: "Low", productivity: "95%" },
  ]

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= sequence.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Introduction */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>What is LSTM?</CardTitle>
            <CardDescription>Long Short-Term Memory networks explained simply</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              LSTMs are a special kind of Recurrent Neural Network (RNN) designed to remember
              information for long periods. Unlike regular neural networks, LSTMs can learn patterns
              from sequences of data - like time series, text, or speech.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Think of an LSTM like a smart diary that remembers important things and forgets
              irrelevant details. It uses special "gates" to decide what to keep, what to forget,
              and what to output at each step.
            </p>
          </CardContent>
        </Card>

        {/* Interactive Sequence Animation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-400" />
                  Sequence Processing Over Time
                </CardTitle>
                <CardDescription>See how LSTM processes time-series data step by step</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isPlaying ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button variant="outline" size="sm" onClick={reset}>
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500/20 via-pink-500/40 to-pink-500/20 -translate-y-1/2" />
                {sequence.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`relative z-10 flex flex-col items-center cursor-pointer transition-all ${
                      index <= currentStep ? "opacity-100" : "opacity-40"
                    }`}
                    onClick={() => setCurrentStep(index)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === currentStep
                          ? "bg-pink-500 text-white shadow-lg shadow-pink-500/50"
                          : index < currentStep
                          ? "bg-pink-500/60 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                      animate={index === currentStep ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {index + 1}
                    </motion.div>
                    <span className="text-xs mt-2 text-muted-foreground">{step.day}</span>
                  </motion.div>
                ))}
              </div>

              {/* Current Step Details */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Study Hours</p>
                  <p className="text-lg font-semibold text-blue-400">{sequence[currentStep].activity}</p>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Sleep</p>
                  <p className="text-lg font-semibold text-purple-400">{sequence[currentStep].sleep}</p>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Stress Level</p>
                  <p className="text-lg font-semibold text-amber-400">{sequence[currentStep].stress}</p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Productivity</p>
                  <p className="text-lg font-semibold text-green-400">{sequence[currentStep].productivity}</p>
                </div>
              </motion.div>

              {/* Memory State */}
              <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-medium">LSTM Memory State</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentStep === 0 && "Initializing: Learning baseline patterns from first day"}
                  {currentStep === 1 && "Remembering: Student is studying hard but sleep is decreasing"}
                  {currentStep === 2 && "Pattern detected: Sleep deprivation affecting performance"}
                  {currentStep === 3 && "Alert: Critical stress level, burnout risk increasing!"}
                  {currentStep === 4 && "Recovery: Rest day detected, stress levels decreasing"}
                  {currentStep === 5 && "Learning: Balanced schedule leads to good performance"}
                  {currentStep === 6 && "Optimal: Healthy balance achieved!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Three Gates */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>The Three Gates of LSTM</CardTitle>
            <CardDescription>How LSTM decides what to remember and forget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Forget Gate */}
            <motion.div
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                showDetails === "forget"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-muted/30 border-border hover:border-red-500/30"
              }`}
              onClick={() => setShowDetails(showDetails === "forget" ? null : "forget")}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    Forget Gate
                    <Badge variant="outline" className="text-xs">Decides what to forget</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Looks at current input and previous hidden state, outputs a number between 0 and 1
                    for each number in the cell state. 0 = forget completely, 1 = keep entirely.
                  </p>
                  {showDetails === "forget" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 p-3 bg-red-500/5 rounded text-sm text-muted-foreground"
                    >
                      <strong>Example:</strong> If yesterday you had 10 hours of sleep but today you only slept 5 hours,
                      the forget gate might output 0.3 for the old sleep pattern, meaning "mostly forget the old pattern".
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Input Gate */}
            <motion.div
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                showDetails === "input"
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-muted/30 border-border hover:border-green-500/30"
              }`}
              onClick={() => setShowDetails(showDetails === "input" ? null : "input")}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                  <DoorOpen className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    Input Gate
                    <Badge variant="outline" className="text-xs">Decides what to remember</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Decides which new information to store in the cell state. Has two parts:
                    a sigmoid layer that decides which values to update, and a tanh layer that creates
                    candidate values to add.
                  </p>
                  {showDetails === "input" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 p-3 bg-green-500/5 rounded text-sm text-muted-foreground"
                    >
                      <strong>Example:</strong> Seeing stress level increasing, the input gate might decide
                      to update the "burnout risk" memory with a new high value.
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Output Gate */}
            <motion.div
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                showDetails === "output"
                  ? "bg-blue-500/10 border-blue-500/30"
                  : "bg-muted/30 border-border hover:border-blue-500/30"
              }`}
              onClick={() => setShowDetails(showDetails === "output" ? null : "output")}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <DoorClosed className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center gap-2">
                    Output Gate
                    <Badge variant="outline" className="text-xs">Decides what to output</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Decides what to output based on the cell state. First applies sigmoid to decide
                    which parts of the cell state to output, then passes the cell state through tanh
                    and multiplies by the sigmoid output.
                  </p>
                  {showDetails === "output" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 p-3 bg-blue-500/5 rounded text-sm text-muted-foreground"
                    >
                      <strong>Example:</strong> Based on all remembered patterns, output a productivity
                      score of 75% and a burnout risk of 60%.
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Why LSTM? */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Why LSTM Over Regular RNN?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-rose-400 mb-2">The Vanishing Gradient Problem</h4>
                <p className="text-sm text-muted-foreground">
                  Regular RNNs struggle to learn from long sequences because gradients become
                  extremely small during backpropagation, making early time steps hard to learn.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-emerald-400 mb-2">LSTM Solution</h4>
                <p className="text-sm text-muted-foreground">
                  LSTMs use a &quot;constant error carousel&quot; - the cell state runs through the chain
                  with only linear interactions, making it easy for information to flow unchanged.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
              <p className="text-sm text-muted-foreground">
                <strong>Think of it this way:</strong> A regular RNN is like trying to remember a phone number
                by repeating it over and over. An LSTM is like writing it down and referring to it when needed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Key Concepts */}
        <Card className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border-pink-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-pink-400" />
              Key Concepts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/30 shrink-0">
                Cell State
              </Badge>
              <p className="text-sm text-muted-foreground">
                The &quot;conveyor belt&quot; that runs through the chain with minor linear interactions
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 shrink-0">
                Hidden State
              </Badge>
              <p className="text-sm text-muted-foreground">
                The output that is passed to the next step and used for predictions
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 shrink-0">
                Gates
              </Badge>
              <p className="text-sm text-muted-foreground">
                Sigmoid neural net layers that output numbers between 0 and 1
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 shrink-0">
                Long-term Memory
              </Badge>
              <p className="text-sm text-muted-foreground">
                Ability to remember patterns from hundreds of time steps ago
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Real-World Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Stock Prediction", desc: "Predicting market trends from historical data" },
              { name: "Speech Recognition", desc: "Understanding spoken words from audio sequences" },
              { name: "Language Translation", desc: "Translating sentences word by word" },
              { name: "Health Monitoring", desc: "Detecting anomalies in patient vital signs" },
              { name: "Weather Forecasting", desc: "Predicting weather from historical patterns" },
            ].map((app) => (
              <div key={app.name} className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-sm">{app.name}</p>
                <p className="text-xs text-muted-foreground">{app.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* LSTM vs Other Models */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              LSTM vs Other Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                <span>Regular NN</span>
                <Badge variant="outline" className="text-xs">No memory</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                <span>RNN</span>
                <Badge variant="outline" className="text-xs">Short memory</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-pink-500/20 rounded border border-pink-500/30">
                <span className="font-medium text-pink-400">LSTM</span>
                <Badge className="bg-pink-500 text-xs">Long memory</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                <span>Transformer</span>
                <Badge variant="outline" className="text-xs">Parallel attention</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Cell Anatomy */}
        <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/30">
          <CardHeader>
            <CardTitle className="text-sm">Memory Cell Anatomy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span>Forget Gate (f_t)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Input Gate (i_t)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Candidate Values (C̃_t)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Output Gate (o_t)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span>Cell State (C_t)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Hidden State (h_t)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
