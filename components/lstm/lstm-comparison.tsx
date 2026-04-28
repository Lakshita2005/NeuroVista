"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  GitCompare,
  ArrowRight,
  XCircle,
  CheckCircle,
  Activity,
  Brain
} from "lucide-react"

interface TimelineStep {
  step: number
  title: string
  description: string
}

const timelineSteps: TimelineStep[] = [
  { step: 0, title: "Initial Input", description: "Both RNN and LSTM receive the same input sequence" },
  { step: 1, title: "First Processing", description: "Information starts flowing through both networks" },
  { step: 2, title: "Context Building", description: "Short-term context is captured in both" },
  { step: 3, title: "Gradient Begins to Vanish", description: "RNN starts losing signal strength" },
  { step: 4, title: "Severe Information Loss", description: "RNN barely remembers initial input" },
  { step: 5, title: "Long-term Dependency", description: "LSTM retains information through cell state" }
]

export function LSTMComparison() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // RNN state simulation - memory fades
  const rnnStates = Array.from({ length: 6 }, (_, i) => ({
    memoryStrength: Math.max(0.1, 1 - i * 0.18)
  }))

  // LSTM state simulation - memory preserved
  const lstmStates = Array.from({ length: 6 }, (_, i) => ({
    cellStrength: i < 3 ? 0.3 + i * 0.15 : 0.85,
    hiddenStrength: 0.5 + Math.sin(i * 0.5) * 0.2
  }))

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= 5) {
            setIsPlaying(false)
            return 5
          }
          return prev + 1
        })
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const currentStepData = timelineSteps.find(s => s.step === currentStep)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-pink-400" />
            RNN vs LSTM: The Vanishing Gradient Problem
          </CardTitle>
          <CardDescription>
            See why LSTM was invented to solve RNN&apos;s memory limitations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Comparison Animation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Long-term Memory Challenge</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={isPlaying ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-1"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Progress value={((currentStep + 1) / 6) * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Step explanation */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-muted/50 rounded-lg"
          >
            <p className="text-sm">
              <span className="font-semibold text-pink-400">Step {currentStep}:</span>{' '}
              {currentStepData?.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentStepData?.description}
            </p>
          </motion.div>

          {/* RNN Side */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-rose-400 border-rose-500/30">
                RNN
              </Badge>
              <span className="text-sm text-muted-foreground">
                Simple recurrent network
              </span>
            </div>
            <div className="flex items-center gap-2">
              {rnnStates.slice(0, currentStep + 1).map((state, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
                      state.memoryStrength < 0.3
                        ? 'bg-rose-500/20 border-2 border-rose-500/50'
                        : 'bg-slate-700 border border-slate-600'
                    }`}
                    animate={{
                      opacity: state.memoryStrength,
                      scale: 0.8 + state.memoryStrength * 0.2
                    }}
                  >
                    <span className="text-lg font-bold text-rose-400">
                      {state.memoryStrength > 0.3 ? 'h' : '×'}
                    </span>
                    <span className="text-[10px] text-rose-300/70">
                      {(state.memoryStrength * 100).toFixed(0)}%
                    </span>
                  </motion.div>
                  {index < currentStep && (
                    <ArrowRight className="w-4 h-4 text-slate-600 mx-1" />
                  )}
                </motion.div>
              ))}
              {/* Faded future nodes */}
              {Array.from({ length: Math.max(0, 6 - currentStep - 1) }).map((_, i) => (
                <div key={`future-${i}`} className="flex items-center">
                  <div className="w-16 h-16 rounded-lg bg-slate-800/30 border border-slate-700/30" />
                  <ArrowRight className="w-4 h-4 text-slate-700/30 mx-1" />
                </div>
              ))}
            </div>
          </div>

          {/* LSTM Side */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                LSTM
              </Badge>
              <span className="text-sm text-muted-foreground">
                Long Short-Term Memory
              </span>
            </div>
            <div className="flex items-center gap-2">
              {lstmStates.slice(0, currentStep + 1).map((state, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center ${
                      state.cellStrength > 0.7
                        ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                        : 'bg-slate-700 border border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-amber-400">
                        {(state.cellStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <div 
                        className="w-1.5 h-4 rounded-full bg-amber-400"
                        style={{ opacity: state.cellStrength }}
                      />
                      <div 
                        className="w-1.5 h-4 rounded-full bg-emerald-400"
                        style={{ opacity: state.hiddenStrength }}
                      />
                    </div>
                  </motion.div>
                  {index < currentStep && (
                    <ArrowRight className="w-4 h-4 text-emerald-500/50 mx-1" />
                  )}
                </motion.div>
              ))}
              {/* Faded future nodes */}
              {Array.from({ length: Math.max(0, 6 - currentStep - 1) }).map((_, i) => (
                <div key={`future-lstm-${i}`} className="flex items-center">
                  <div className="w-16 h-16 rounded-lg bg-slate-800/30 border border-slate-700/30" />
                  <ArrowRight className="w-4 h-4 text-slate-700/30 mx-1" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-rose-400" />
            <span className="font-medium text-rose-400">RNN Problem</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Information gets diluted through repeated multiplication with small weights.
            By step 5, the signal is almost gone (vanishing gradient).
          </p>
        </div>

        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-medium text-emerald-400">LSTM Solution</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The cell state acts as a &quot;conveyor belt&quot; with minimal changes.
            The forget gate keeps information intact until explicitly cleared.
          </p>
        </div>
      </div>

      {/* Gradient Flow Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm">Gradient Flow Visualization</CardTitle>
          <CardDescription>
            How error gradients propagate back through time during training
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* RNN Gradient */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-rose-400">RNN Gradient</Badge>
            </div>
            <div className="h-12 bg-slate-800/50 rounded-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 bg-gradient-to-r from-rose-500 to-rose-500/20"
                animate={{
                  width: isPlaying ? ['0%', '100%'] : '0%',
                  opacity: [1, 0.3]
                }}
                transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
              />
              <div className="absolute inset-0 flex items-center px-4">
                <span className="text-xs text-muted-foreground">
                  Gradient weakens exponentially through time steps
                </span>
              </div>
            </div>
          </div>

          {/* LSTM Gradient */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-emerald-400">LSTM Gradient</Badge>
            </div>
            <div className="h-12 bg-slate-800/50 rounded-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 bg-gradient-to-r from-emerald-500 to-emerald-500/60"
                animate={{
                  width: isPlaying ? ['0%', '100%'] : '0%',
                }}
                transition={{ duration: 1.5, repeat: isPlaying ? Infinity : 0 }}
              />
              <div className="absolute inset-0 flex items-center px-4">
                <span className="text-xs text-muted-foreground">
                  Gradient flows unchanged through cell state (constant error carousel)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Mechanism */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm">Memory Mechanism Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-rose-500/10 rounded border border-rose-500/20 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-medium text-rose-400">RNN</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">Hidden state gets overwritten</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20 flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">LSTM</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">Cell state + 3 gates control flow</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-rose-500/10 via-slate-800/50 to-emerald-500/10 border-border">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center shrink-0">
              <GitCompare className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Takeaway</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                While RNNs struggle to maintain long-term dependencies due to vanishing gradients, 
                LSTMs solve this through their gating mechanism and cell state that acts as a 
                &quot;conveyor belt&quot; of information. The cell state can maintain information indefinitely 
                until the forget gate decides to remove it, making LSTMs much better at tasks requiring 
                understanding of long-range dependencies like language translation, text summarization, 
                and time series prediction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
