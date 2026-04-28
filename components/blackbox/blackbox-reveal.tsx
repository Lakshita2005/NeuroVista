"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCcw,
  Eye,
  Scale,
  Zap,
  Layers,
  Activity,
  Target,
  ChevronRight,
  ChevronLeft,
  Info,
  Sparkles,
  Brain
} from "lucide-react"

interface RevealStep {
  id: number
  title: string
  subtitle: string
  icon: React.ElementType
  description: string
  details: string[]
  color: string
  bgColor: string
  visual: "input" | "weights" | "activation" | "hidden" | "output"
}

const REVEAL_STEPS: RevealStep[] = [
  {
    id: 1,
    title: "Input Layer",
    subtitle: "Data enters the network",
    icon: Eye,
    description: "The journey begins with raw data. Each input neuron represents a feature or dimension of the input data.",
    details: [
      "Each input value represents one feature",
      "Values are typically normalized between 0 and 1",
      "For images: each pixel is an input",
      "For text: each word embedding dimension is input"
    ],
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    visual: "input"
  },
  {
    id: 2,
    title: "Weights & Biases",
    subtitle: "Learning the importance of each connection",
    icon: Scale,
    description: "Every connection has a weight that determines how much influence one neuron has on another. Biases allow the activation function to shift.",
    details: [
      "Weights determine connection strength",
      "Positive weight: excitatory connection",
      "Negative weight: inhibitory connection",
      "Bias shifts the activation threshold",
      "Training adjusts weights to minimize error"
    ],
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    visual: "weights"
  },
  {
    id: 3,
    title: "Activation Function",
    subtitle: "Introducing non-linearity",
    icon: Zap,
    description: "Activation functions decide whether a neuron fires and how much. They introduce non-linearity, allowing networks to learn complex patterns.",
    details: [
      "Sigmoid: Smooth output 0 to 1",
      "ReLU: Simple threshold at 0",
      "Tanh: Centered around 0",
      "Without activation: network is just linear",
      "Non-linearity enables complex learning"
    ],
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    visual: "activation"
  },
  {
    id: 4,
    title: "Hidden Layers",
    subtitle: "Learning abstractions",
    icon: Layers,
    description: "Hidden layers extract increasingly abstract features. Early layers detect simple patterns; deeper layers combine them into complex concepts.",
    details: [
      "Layer 1: Edges, gradients, simple patterns",
      "Layer 2: Textures, shapes, contours",
      "Layer 3: Object parts, features",
      "Layer 4+: Complete objects, concepts",
      "More layers = more abstraction capability"
    ],
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    visual: "hidden"
  },
  {
    id: 5,
    title: "Output Layer",
    subtitle: "Making predictions",
    icon: Target,
    description: "The final layer produces the network's prediction. Each output neuron represents a possible class or a continuous value.",
    details: [
      "Classification: Probability for each class",
      "Regression: Predicted continuous value",
      "Sum of probabilities = 1 (softmax)",
      "Highest activation = predicted class",
      "Confidence = activation magnitude"
    ],
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    visual: "output"
  }
]

// Animated Neuron Component
function AnimatedNeuron({ 
  x, 
  y, 
  isActive, 
  value, 
  color, 
  size = 40,
  showValue = false 
}: { 
  x: number
  y: number
  isActive: boolean
  value: number
  color: string
  size?: number
  showValue?: boolean
}) {
  return (
    <motion.g>
      {/* Glow Effect */}
      {isActive && (
        <motion.circle
          cx={x}
          cy={y}
          r={size * 0.8}
          fill={color.replace("text-", "#")}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
      {/* Neuron Body */}
      <motion.circle
        cx={x}
        cy={y}
        r={size / 2}
        className={isActive ? color : "fill-muted"}
        stroke="currentColor"
        strokeWidth={2}
        animate={isActive ? {
          fillOpacity: [0.3, 1, 0.3],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      {/* Value Display */}
      {showValue && isActive && (
        <motion.text
          x={x}
          y={y + size + 15}
          textAnchor="middle"
          className="text-xs fill-current"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {value.toFixed(2)}
        </motion.text>
      )}
    </motion.g>
  )
}

// Weight Line Component
function WeightLine({ 
  x1, 
  y1, 
  x2, 
  y2, 
  weight, 
  isActive 
}: { 
  x1: number
  y1: number
  x2: number
  y2: number
  weight: number
  isActive: boolean
}) {
  const color = weight > 0 ? "#10b981" : "#ef4444"
  const width = Math.abs(weight) * 3

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isActive ? color : "#374151"}
      strokeWidth={isActive ? width : 1}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: isActive ? 1 : 0.3,
        opacity: isActive ? 1 : 0.3
      }}
      transition={{ duration: 0.5 }}
    />
  )
}

// Visualization Components
function InputVisualization({ step }: { step: RevealStep }) {
  const inputs = [0.8, 0.3, 0.9, 0.5, 0.7]
  
  return (
    <div className="relative h-64 flex items-center justify-center">
      <svg width="300" height="200" viewBox="0 0 300 200">
        <text x="150" y="30" textAnchor="middle" className="fill-current text-sm">Input Neurons</text>
        {inputs.map((val, i) => (
          <AnimatedNeuron
            key={i}
            x={150}
            y={60 + i * 30}
            isActive={true}
            value={val}
            color={step.color}
            size={35}
            showValue={true}
          />
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-sm text-muted-foreground text-center">
          5 input neurons with feature values
        </p>
      </div>
    </div>
  )
}

function WeightsVisualization({ step }: { step: RevealStep }) {
  const weights = [
    [0.5, -0.3, 0.8, 0.2, -0.4],
    [-0.2, 0.6, -0.1, 0.9, 0.3],
    [0.7, 0.4, -0.5, 0.1, 0.8]
  ]

  return (
    <div className="relative h-64 flex items-center justify-center">
      <svg width="350" height="200" viewBox="0 0 350 200">
        <text x="175" y="20" textAnchor="middle" className="fill-current text-sm">Weighted Connections</text>
        {/* Input Layer */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={`in-${i}`} cx="50" cy={50 + i * 35} r="15" className="fill-cyan-500/50" />
        ))}
        {/* Hidden Layer */}
        {[0, 1, 2].map(i => (
          <circle key={`hid-${i}`} cx="300" cy={60 + i * 50} r="15" className="fill-purple-500/50" />
        ))}
        {/* Weights */}
        {weights.map((row, i) =>
          row.map((w, j) => (
            <WeightLine
              key={`w-${i}-${j}`}
              x1={65}
              y1={50 + j * 35}
              x2={285}
              y2={60 + i * 50}
              weight={w}
              isActive={true}
            />
          ))
        )}
        {/* Weight Labels */}
        <text x="20" y="170" className="fill-emerald-400 text-xs">Green = Positive weight</text>
        <text x="20" y="185" className="fill-red-400 text-xs">Red = Negative weight</text>
      </svg>
    </div>
  )
}

function ActivationVisualization({ step }: { step: RevealStep }) {
  const [x, setX] = useState(0)
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))
  const relu = (x: number) => Math.max(0, x)

  const points = Array.from({ length: 100 }, (_, i) => {
    const xVal = (i - 50) / 10
    return { x: xVal, sigmoid: sigmoid(xVal), relu: relu(xVal) }
  })

  return (
    <div className="relative h-64 flex items-center justify-center">
      <svg width="300" height="180" viewBox="0 0 300 180">
        <text x="150" y="15" textAnchor="middle" className="fill-current text-sm">Activation Functions</text>
        {/* Axes */}
        <line x1="30" y1="150" x2="280" y2="150" stroke="#374151" strokeWidth="2" />
        <line x1="155" y1="20" x2="155" y2="150" stroke="#374151" strokeWidth="2" />
        <text x="150" y="170" textAnchor="middle" className="fill-current text-xs">Input</text>
        <text x="15" y="90" textAnchor="middle" className="fill-current text-xs" transform="rotate(-90 15 90)">Output</text>
        
        {/* Sigmoid */}
        <motion.path
          d={`M 30 ${150 - points[0].sigmoid * 100} ${points.map((p, i) => `L ${30 + i * 2.5} ${150 - p.sigmoid * 100}`).join(' ')}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />
        {/* ReLU */}
        <motion.path
          d={`M 30 ${150 - points[0].relu * 10} ${points.map((p, i) => `L ${30 + i * 2.5} ${150 - p.relu * 10}`).join(' ')}`}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        {/* Legend */}
        <text x="200" y="35" className="fill-emerald-400 text-xs">Sigmoid</text>
        <text x="200" y="50" className="fill-blue-400 text-xs">ReLU</text>
      </svg>
    </div>
  )
}

function HiddenVisualization({ step }: { step: RevealStep }) {
  return (
    <div className="relative h-64 flex items-center justify-center">
      <svg width="400" height="200" viewBox="0 0 400 200">
        <text x="200" y="15" textAnchor="middle" className="fill-current text-sm">Layer-by-Layer Abstraction</text>
        {/* Layer 1 - Simple features */}
        {[0, 1, 2].map(i => (
          <motion.g key={`l1-${i}`}>
            <rect x="50" y={60 + i * 40} width="60" height="25" rx="4" fill="#06b6d4" fillOpacity="0.3" />
            <text x="80" y={77 + i * 40} textAnchor="middle" className="fill-current text-xs">Edge {i + 1}</text>
          </motion.g>
        ))}
        {/* Layer 2 - Combinations */}
        {[0, 1].map(i => (
          <motion.g key={`l2-${i}`}>
            <rect x="170" y={70 + i * 50} width="60" height="25" rx="4" fill="#a855f7" fillOpacity="0.3" />
            <text x="200" y={87 + i * 50} textAnchor="middle" className="fill-current text-xs">Shape {i + 1}</text>
          </motion.g>
        ))}
        {/* Layer 3 - Complex features */}
        <motion.g>
          <rect x="290" y="85" width="60" height="30" rx="4" fill="#f472b6" fillOpacity="0.3" />
          <text x="320" y="105" textAnchor="middle" className="fill-current text-xs">Object</text>
        </motion.g>
        {/* Connections */}
        <motion.path
          d="M 110 72 Q 140 80 170 82 M 110 102 Q 140 95 170 82 M 110 102 Q 140 120 170 120"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M 230 82 Q 260 90 290 100 M 230 120 Q 260 110 290 100"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </svg>
      <div className="absolute bottom-4 flex gap-8 text-xs text-muted-foreground">
        <span>Layer 1: Simple</span>
        <span>Layer 2: Combined</span>
        <span>Layer 3: Complex</span>
      </div>
    </div>
  )
}

function OutputVisualization({ step }: { step: RevealStep }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const outputs = [
    { label: "Class A", prob: 0.15 },
    { label: "Class B", prob: 0.65 },
    { label: "Class C", prob: 0.20 }
  ]

  return (
    <div className="relative h-64 flex items-center justify-center">
      <svg width="300" height="200" viewBox="0 0 300 200">
        <text x="150" y="20" textAnchor="middle" className="fill-current text-sm">Final Prediction</text>
        {outputs.map((out, i) => (
          <motion.g key={i}>
            <rect
              x="80"
              y={50 + i * 45}
              width="140"
              height="35"
              rx="4"
              className={i === 1 ? "fill-emerald-500/30" : "fill-muted"}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            <text x="95" y={72 + i * 45} className="fill-current text-sm">{out.label}</text>
            <text x="200" y={72 + i * 45} textAnchor="end" className="fill-current text-sm font-bold">
              {(out.prob * 100).toFixed(0)}%
            </text>
            {/* Confidence Bar */}
            <motion.rect
              x="80"
              y={50 + i * 45}
              width={140 * out.prob}
              height="35"
              rx="4"
              className={i === 1 ? "fill-emerald-500" : "fill-cyan-500"}
              fillOpacity="0.5"
              initial={{ width: 0 }}
              animate={{ width: 140 * out.prob }}
              transition={{ duration: 1, delay: i * 0.2 }}
            />
          </motion.g>
        ))}
      </svg>
      <div className="absolute bottom-4 text-center">
        <p className="text-sm text-emerald-400 font-medium">
          Predicted: Class B with 65% confidence
        </p>
      </div>
    </div>
  )
}

export function BlackBoxReveal() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const currentStepData = REVEAL_STEPS[currentStep]
  const progress = ((currentStep + 1) / REVEAL_STEPS.length) * 100

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= REVEAL_STEPS.length - 1) {
            setIsAutoPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying])

  const nextStep = () => {
    if (currentStep < REVEAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const reset = () => {
    setCurrentStep(0)
    setIsAutoPlaying(false)
  }

  const renderVisualization = () => {
    switch (currentStepData.visual) {
      case "input":
        return <InputVisualization step={currentStepData} />
      case "weights":
        return <WeightsVisualization step={currentStepData} />
      case "activation":
        return <ActivationVisualization step={currentStepData} />
      case "hidden":
        return <HiddenVisualization step={currentStepData} />
      case "output":
        return <OutputVisualization step={currentStepData} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Open the Black Box</h2>
          <p className="text-muted-foreground">
            Step-by-step reveal of how neural networks make decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? <><Activity className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Auto</>}
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Explanation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`h-full ${currentStepData.bgColor} border-current`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-background/50`}>
                    <currentStepData.icon className={`w-6 h-6 ${currentStepData.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Step {currentStepData.id} of {REVEAL_STEPS.length}</span>
                    </div>
                    <CardTitle className={`text-xl ${currentStepData.color}`}>
                      {currentStepData.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base text-foreground">
                  {currentStepData.subtitle}
                </CardDescription>
                <p className="text-muted-foreground">
                  {currentStepData.description}
                </p>
                <div className="space-y-2">
                  {currentStepData.details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${currentStepData.color}`} />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Right: Visualization */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full border-border bg-card">
              <CardContent className="p-6">
                {renderVisualization()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </Button>

        {/* Step Indicators */}
        <div className="flex gap-2">
          {REVEAL_STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? `bg-current ${step.color} w-8`
                  : index < currentStep
                  ? "bg-green-500"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={nextStep}
          disabled={currentStep === REVEAL_STEPS.length - 1}
          className="gap-2"
        >
          Next Step
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Summary when complete */}
      {currentStep === REVEAL_STEPS.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/30"
        >
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            You opened the black box!
          </h4>
          <p className="text-sm text-muted-foreground">
            You now understand how data flows through a neural network: from inputs, through weighted connections, 
            activated by non-linear functions, processed by hidden layers, and finally to predictions. 
            This is how all the modules in NeuroVista work!
          </p>
        </motion.div>
      )}
    </div>
  )
}
