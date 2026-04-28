"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Upload,
  Wand2,
  Brain,
  Layers,
  Network,
  Eye,
  MessageSquareText,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Cpu,
  Filter,
  Activity
} from "lucide-react"

interface PipelineStage {
  id: string
  name: string
  icon: React.ElementType
  description: string
  color: string
  bgColor: string
  gradient: string
  details: string[]
  transformation: string
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "input",
    name: "Input",
    icon: Upload,
    description: "Raw data enters the system",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    gradient: "from-gray-500/20 to-gray-600/20",
    details: [
      "Images captured as pixel arrays",
      "Text tokenized into vectors",
      "Numerical data normalized",
      "Data validated and cleaned"
    ],
    transformation: "Raw → Digital Representation"
  },
  {
    id: "preprocessing",
    name: "Preprocessing",
    icon: Wand2,
    description: "Data prepared for neural network",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    gradient: "from-purple-500/20 to-purple-600/20",
    details: [
      "Images: Resize, normalize, augment",
      "Text: Tokenize, embed, pad",
      "Numbers: Scale, encode, transform",
      "Feature extraction begins"
    ],
    transformation: "Raw Data → Processed Features"
  },
  {
    id: "feature-extraction",
    name: "Feature Extraction",
    icon: Filter,
    description: "Key patterns identified",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    gradient: "from-cyan-500/20 to-cyan-600/20",
    details: [
      "Edges, textures, shapes detected",
      "Semantic features extracted",
      "Hierarchical representations built",
      "Dimensionality reduced"
    ],
    transformation: "Pixels → High-Level Features"
  },
  {
    id: "hidden-layers",
    name: "Hidden Layers",
    icon: Layers,
    description: "Complex patterns learned",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    gradient: "from-emerald-500/20 to-emerald-600/20",
    details: [
      "Multiple abstraction levels",
      "Non-linear transformations",
      "Feature combinations learned",
      "Gradients flow backward"
    ],
    transformation: "Features → Abstract Concepts"
  },
  {
    id: "model-selection",
    name: "Model Selection",
    icon: Brain,
    description: "Specialized network activated",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    gradient: "from-blue-500/20 to-blue-600/20",
    details: [
      "CNN for visual tasks",
      "RNN/LSTM for sequences",
      "MLP for structured data",
      "Transformer for text"
    ],
    transformation: "Concepts → Specialized Processing"
  },
  {
    id: "memory",
    name: "Memory & Context",
    icon: Network,
    description: "Past information considered",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    gradient: "from-amber-500/20 to-amber-600/20",
    details: [
      "Hopfield recalls patterns",
      "LSTM maintains state",
      "Attention focuses on relevant parts",
      "Context enriches understanding"
    ],
    transformation: "Current + Past → Informed Decision"
  },
  {
    id: "decision",
    name: "Decision",
    icon: Activity,
    description: "Final prediction made",
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    gradient: "from-pink-500/20 to-pink-600/20",
    details: [
      "Output layer activated",
      "Probabilities calculated",
      "Confidence score assigned",
      "Decision threshold applied"
    ],
    transformation: "Processing → Prediction"
  },
  {
    id: "output",
    name: "Output",
    icon: CheckCircle,
    description: "Result delivered",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    gradient: "from-green-500/20 to-green-600/20",
    details: [
      "Classification: Category assigned",
      "Regression: Value predicted",
      "Generation: New content created",
      "Explanation: Reasoning provided"
    ],
    transformation: "Prediction → Actionable Result"
  }
]

interface Particle {
  id: number
  stage: number
  progress: number
}

export function PipelineVisualizer() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [speed, setSpeed] = useState(1)
  const particleIdRef = useRef(0)

  // Add particles continuously when running
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev,
        { id: particleIdRef.current++, stage: 0, progress: 0 }
      ])
    }, 1000 / speed)

    return () => clearInterval(interval)
  }, [isRunning, speed])

  // Update particles
  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            progress: p.progress + 0.02 * speed
          }))
          .filter(p => {
            if (p.progress >= 1) {
              if (p.stage < PIPELINE_STAGES.length - 1) {
                return { ...p, stage: p.stage + 1, progress: 0 }
              }
              return false
            }
            return true
          })
          .map(p => {
            if (p.progress >= 1) {
              return { ...p, stage: p.stage + 1, progress: 0 }
            }
            return p
          })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [particles.length, speed])

  // Update current stage based on particles
  useEffect(() => {
    if (particles.length > 0) {
      const maxStage = Math.max(...particles.map(p => p.stage))
      setCurrentStage(maxStage)
    }
  }, [particles])

  const reset = () => {
    setIsRunning(false)
    setCurrentStage(0)
    setParticles([])
    particleIdRef.current = 0
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Complete Neural Network Pipeline</h2>
          <p className="text-muted-foreground">
            See how data flows and transforms through every stage of a neural network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSpeed(0.5)}
            className={speed === 0.5 ? "bg-muted" : ""}
          >
            0.5x
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSpeed(1)}
            className={speed === 1 ? "bg-muted" : ""}
          >
            1x
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSpeed(2)}
            className={speed === 2 ? "bg-muted" : ""}
          >
            2x
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className="gap-2"
          >
            {isRunning ? (
              <><Pause className="w-4 h-4" /> Pause</>
            ) : (
              <><Play className="w-4 h-4" /> Start Flow</>
            )}
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Pipeline Flow Visualization */}
      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-6">
          {/* Horizontal Pipeline */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2" />
            
            {/* Active Flow */}
            <motion.div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 via-emerald-500 to-amber-500 -translate-y-1/2"
              animate={{
                width: isRunning ? `${(currentStage / (PIPELINE_STAGES.length - 1)) * 100}%` : "0%"
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Stages */}
            <div className="relative flex justify-between items-center">
              {PIPELINE_STAGES.map((stage, index) => {
                const Icon = stage.icon
                const isActive = index <= currentStage && isRunning
                const isSelected = selectedStage === stage.id

                return (
                  <div key={stage.id} className="relative flex flex-col items-center">
                    {/* Stage Node */}
                    <motion.button
                      onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                      className={`relative z-10 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? `${stage.bgColor} border-current ${stage.color} ring-2 ring-offset-2 ring-offset-background ring-current`
                          : isActive
                          ? `${stage.bgColor} border-green-500`
                          : "bg-muted border-muted hover:border-muted-foreground"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? stage.color : "text-muted-foreground"}`} />
                      
                      {/* Pulse Effect for Active */}
                      {isActive && !isSelected && (
                        <motion.div
                          className={`absolute inset-0 rounded-xl ${stage.bgColor}`}
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                    </motion.button>

                    {/* Stage Label */}
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-medium ${isActive ? stage.color : "text-muted-foreground"}`}>
                        {stage.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[100px]">
                        {stage.description}
                      </p>
                    </div>

                    {/* Data Particles */}
                    {particles
                      .filter(p => p.stage === index)
                      .map(particle => (
                        <motion.div
                          key={particle.id}
                          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${stage.color.replace("text-", "bg-")}`}
                          initial={{ left: "0%", opacity: 0 }}
                          animate={{
                            left: `${particle.progress * 100}%`,
                            opacity: [0, 1, 1, 0]
                          }}
                          transition={{ duration: 0.05 }}
                          style={{
                            boxShadow: `0 0 10px currentColor`
                          }}
                        />
                      ))}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Stage Details */}
      <AnimatePresence mode="wait">
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`bg-gradient-to-br ${PIPELINE_STAGES.find(s => s.id === selectedStage)?.gradient} border-current`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const stage = PIPELINE_STAGES.find(s => s.id === selectedStage)
                    if (!stage) return null
                    const Icon = stage.icon
                    return (
                      <>
                        <div className={`p-3 rounded-xl ${stage.bgColor}`}>
                          <Icon className={`w-6 h-6 ${stage.color}`} />
                        </div>
                        <div>
                          <CardTitle className={stage.color}>{stage.name}</CardTitle>
                          <CardDescription>{stage.description}</CardDescription>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* What Happens Here */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      What Happens Here?
                    </h4>
                    <ul className="space-y-2">
                      {PIPELINE_STAGES.find(s => s.id === selectedStage)?.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/50" />
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Transformation */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      Data Transformation
                    </h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">
                        {PIPELINE_STAGES.find(s => s.id === selectedStage)?.transformation}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Type Examples */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            type: "Image Data",
            icon: Eye,
            color: "text-blue-400",
            bgColor: "bg-blue-500/20",
            path: "Pixels → CNN → Features → Classification",
            example: "Facial recognition: Image → Face detected → Identity verified"
          },
          {
            type: "Sequential Data",
            icon: Clock,
            color: "text-amber-400",
            bgColor: "bg-amber-500/20",
            path: "Tokens → Embedding → LSTM → Prediction",
            example: "Sentiment analysis: Text → Context understood → Mood detected"
          },
          {
            type: "Structured Data",
            icon: Layers,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/20",
            path: "Features → MLP → Hidden → Output",
            example: "Credit scoring: Data → Patterns found → Risk calculated"
          }
        ].map((dataType, i) => (
          <Card key={i} className="bg-card border-border hover:border-cyan-500/50 transition-colors">
            <CardContent className="p-6">
              <div className={`p-3 rounded-lg ${dataType.bgColor} w-fit mb-4`}>
                <dataType.icon className={`w-6 h-6 ${dataType.color}`} />
              </div>
              <h4 className="font-medium mb-2">{dataType.type}</h4>
              <p className="text-sm text-muted-foreground mb-3">{dataType.path}</p>
              <p className="text-xs text-muted-foreground opacity-70">{dataType.example}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
