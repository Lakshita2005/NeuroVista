"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Layers,
  Network,
  Eye,
  MessageSquareText,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Info,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Zap
} from "lucide-react"

interface TimelineNode {
  id: string
  name: string
  year: string
  icon: React.ElementType
  color: string
  bgColor: string
  problem: string
  solution: string
  limitation: string
  realWorld: string
  description: string
  href: string
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    id: "perceptron",
    name: "Perceptron",
    year: "1958",
    icon: Brain,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    problem: "Need for a mathematical model of biological neurons",
    solution: "Single neuron with weighted inputs and threshold activation",
    limitation: "Cannot solve non-linear problems like XOR",
    realWorld: "Binary classification, Spam filtering",
    description: "The foundation of neural networks - a single artificial neuron that makes binary decisions",
    href: "/perceptron"
  },
  {
    id: "mlp",
    name: "MLP",
    year: "1986",
    icon: Layers,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    problem: "Perceptron cannot handle non-linear patterns",
    solution: "Multiple layers with non-linear activation functions",
    limitation: "Cannot remember previous inputs; struggles with sequential data",
    realWorld: "Image recognition, Credit scoring",
    description: "Multi-Layer Perceptron uses hidden layers to solve complex, non-linear problems",
    href: "/mlp"
  },
  {
    id: "hopfield",
    name: "Hopfield",
    year: "1982",
    icon: Network,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    problem: "Neural networks forget patterns after learning new ones",
    solution: "Associative memory network with recurrent connections",
    limitation: "Limited storage capacity; symmetric weights requirement",
    realWorld: "Pattern completion, Error correction",
    description: "Recurrent network that stores and recalls patterns from partial or noisy input",
    href: "/hopfield"
  },
  {
    id: "vision",
    name: "CNN / Vision",
    year: "1998",
    icon: Eye,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    problem: "Traditional networks fail on images due to too many parameters",
    solution: "Convolutional layers that preserve spatial relationships",
    limitation: "Requires fixed-size input; no understanding of temporal sequences",
    realWorld: "Facial recognition, Medical imaging",
    description: "Convolutional Neural Networks excel at extracting visual features hierarchically",
    href: "/vision"
  },
  {
    id: "sentiment",
    name: "NLP / Sentiment",
    year: "2013",
    icon: MessageSquareText,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    problem: "Computers struggle to understand human language context",
    solution: "Word embeddings and attention mechanisms",
    limitation: "Context window limitations; no true understanding of meaning",
    realWorld: "Chatbots, Sentiment analysis",
    description: "Natural Language Processing enables machines to understand and generate text",
    href: "/sentiment"
  },
  {
    id: "lstm",
    name: "LSTM",
    year: "1997",
    icon: Clock,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    problem: "Standard RNNs suffer from vanishing gradients in long sequences",
    solution: "Memory cells with gates that control information flow",
    limitation: "Computationally expensive; harder to parallelize than Transformers",
    realWorld: "Stock prediction, Language translation",
    description: "Long Short-Term Memory networks remember important information over long periods",
    href: "/lstm"
  },
  {
    id: "modern",
    name: "Modern AI",
    year: "2017+",
    icon: Sparkles,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    problem: "Need for models that can handle all data types at scale",
    solution: "Transformers and attention mechanisms; multi-modal learning",
    limitation: "Requires massive compute and data; energy consumption",
    realWorld: "GPT, DALL-E, Self-driving cars",
    description: "Transformer architectures and attention mechanisms revolutionized all AI domains",
    href: "#"
  }
]

export function NeuralNetworkTimeline() {
  const [activeNode, setActiveNode] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [showEvolution, setShowEvolution] = useState(false)

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveNode((prev) => (prev + 1) % TIMELINE_NODES.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying])

  const activeData = TIMELINE_NODES[activeNode]
  const prevData = activeNode > 0 ? TIMELINE_NODES[activeNode - 1] : null

  return (
    <div className="space-y-8">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">The Evolution of Neural Networks</h2>
          <p className="text-muted-foreground">
            Click on each milestone to understand why it was introduced and what problem it solved
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="gap-2"
        >
          {isAutoPlaying ? (
            <><Clock className="w-4 h-4" /> Pause</>
          ) : (
            <><Zap className="w-4 h-4" /> Auto-Play</>
          )}
        </Button>
      </div>

      {/* Interactive Timeline */}
      <div className="relative">
        {/* Timeline Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 rounded-full" />
        
        {/* Animated Flow Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 via-purple-500 via-blue-500 via-green-500 to-amber-500 -translate-y-1/2 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((activeNode) / (TIMELINE_NODES.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Timeline Nodes */}
        <div className="relative flex justify-between items-center py-8">
          {TIMELINE_NODES.map((node, index) => {
            const Icon = node.icon
            const isActive = index === activeNode
            const isComplete = index < activeNode

            return (
              <motion.button
                key={node.id}
                onClick={() => setActiveNode(index)}
                className="relative flex flex-col items-center gap-2 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Node Circle */}
                <motion.div
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${
                    isActive
                      ? `${node.bgColor} border-current ${node.color} shadow-lg shadow-${node.color}/50`
                      : isComplete
                      ? "bg-muted border-green-500"
                      : "bg-muted/50 border-muted group-hover:border-muted-foreground"
                  }`}
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            `0 0 0px ${node.color}`,
                            `0 0 30px ${node.color}`,
                            `0 0 0px ${node.color}`
                          ]
                        }
                      : {}
                  }
                  transition={{
                    repeat: isActive ? Infinity : 0,
                    duration: 2
                  }}
                >
                  <Icon className={`w-6 h-6 ${isActive ? node.color : isComplete ? "text-green-400" : "text-muted-foreground"}`} />
                  
                  {/* Glow Effect */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${node.bgColor}`}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <div className="text-center">
                  <p className={`text-sm font-medium ${isActive ? node.color : "text-muted-foreground"}`}>
                    {node.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{node.year}</p>
                </div>

                {/* Flow Particles */}
                {isComplete && index < TIMELINE_NODES.length - 1 && (
                  <motion.div
                    className="absolute top-1/2 -right-8 w-2 h-2 rounded-full bg-green-400"
                    animate={{
                      x: [0, 20, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: index * 0.2
                    }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Active Node Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeData.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Left: Node Information */}
          <div className={`p-6 rounded-xl border-2 ${activeData.bgColor} border-current ${activeData.color} bg-card`}>
            <div className="flex items-center gap-3 mb-4">
              <activeData.icon className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">{activeData.name}</h3>
                <p className="text-sm opacity-80">{activeData.year}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6">{activeData.description}</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">What it solved</p>
                  <p className="text-sm text-muted-foreground">{activeData.solution}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Problem addressed</p>
                  <p className="text-sm text-muted-foreground">{activeData.problem}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Cpu className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Real-world applications</p>
                  <p className="text-sm text-muted-foreground">{activeData.realWorld}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Evolution Context */}
          <div className="space-y-4">
            {prevData && (
              <div className="p-6 rounded-xl border border-border bg-card">
                <h4 className="flex items-center gap-2 font-medium mb-3">
                  <ArrowRight className="w-5 h-5 text-amber-400" />
                  Why {prevData.name} → {activeData.name}?
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-sm text-red-400 font-medium mb-2">The Problem</p>
                    <p className="text-sm text-muted-foreground">{prevData.limitation}</p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm text-green-400 font-medium mb-2">The Solution</p>
                    <p className="text-sm text-muted-foreground">{activeData.solution}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveNode(Math.max(0, activeNode - 1))}
                disabled={activeNode === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {TIMELINE_NODES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveNode(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeNode ? "bg-cyan-400 w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setActiveNode(Math.min(TIMELINE_NODES.length - 1, activeNode + 1))}
                disabled={activeNode === TIMELINE_NODES.length - 1}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Link */}
            {activeData.href !== "#" && (
              <Button
                asChild
                className={`w-full gap-2 ${activeData.bgColor} ${activeData.color} hover:opacity-90`}
              >
                <a href={activeData.href}>
                  Explore {activeData.name} Module
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
