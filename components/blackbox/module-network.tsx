"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Brain,
  Layers,
  Network,
  Eye,
  MessageSquareText,
  Clock,
  Box,
  ArrowRight,
  Zap,
  GitBranch,
  Target,
  Activity,
  Lightbulb,
  Link2,
  Sparkles
} from "lucide-react"

interface ModuleNode {
  id: string
  name: string
  icon: React.ElementType
  color: string
  bgColor: string
  description: string
  useCase: string
  x: number
  y: number
  connections: string[]
}

const MODULES: ModuleNode[] = [
  {
    id: "perceptron",
    name: "Perceptron",
    icon: Brain,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    description: "Single neuron for binary decisions",
    useCase: "Binary classification, Yes/No decisions",
    x: 100,
    y: 150,
    connections: ["mlp", "hopfield"]
  },
  {
    id: "mlp",
    name: "MLP",
    icon: Layers,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    description: "Multi-layer pattern recognition",
    useCase: "Complex classification, Regression",
    x: 300,
    y: 150,
    connections: ["vision", "sentiment", "lstm", "blackbox"]
  },
  {
    id: "hopfield",
    name: "Hopfield",
    icon: Network,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    description: "Associative memory network",
    useCase: "Pattern recovery, Memory systems",
    x: 200,
    y: 300,
    connections: ["lstm", "blackbox"]
  },
  {
    id: "vision",
    name: "Vision",
    icon: Eye,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    description: "Convolutional neural networks",
    useCase: "Image recognition, Object detection",
    x: 500,
    y: 100,
    connections: ["blackbox"]
  },
  {
    id: "sentiment",
    name: "Sentiment",
    icon: MessageSquareText,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    description: "Natural language processing",
    useCase: "Text analysis, Emotion detection",
    x: 500,
    y: 200,
    connections: ["blackbox"]
  },
  {
    id: "lstm",
    name: "LSTM",
    icon: Clock,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    description: "Sequential data processing",
    useCase: "Time series, Language modeling",
    x: 400,
    y: 300,
    connections: ["blackbox"]
  },
  {
    id: "blackbox",
    name: "Black Box",
    icon: Box,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    description: "Complete AI pipeline",
    useCase: "System integration, Explainability",
    x: 650,
    y: 200,
    connections: []
  }
]

const MODULE_DETAILS: Record<string, { title: string; details: string[]; realWorld: string[] }> = {
  perceptron: {
    title: "Foundation of Neural Networks",
    details: [
      "The simplest neural network unit",
      "Makes binary yes/no decisions",
      "Learns by adjusting weights",
      "Cannot solve non-linear problems (XOR)"
    ],
    realWorld: [
      "Email spam detection",
      "Loan approval decisions",
      "Medical diagnosis (yes/no)",
      "Quality control pass/fail"
    ]
  },
  mlp: {
    title: "Universal Function Approximator",
    details: [
      "Multiple layers with non-linear activations",
      "Can learn any continuous function",
      "Uses backpropagation to learn",
      "Foundation for all deep learning"
    ],
    realWorld: [
      "Credit scoring",
      "Customer churn prediction",
      "Price prediction",
      "Fraud detection"
    ]
  },
  hopfield: {
    title: "Content-Addressable Memory",
    details: [
      "Recurrent network architecture",
      "Stores and recalls patterns",
      "Energy minimization principle",
      "Converges to learned patterns"
    ],
    realWorld: [
      "Error correction codes",
      "Pattern completion",
      "Associative memory systems",
      "Noise reduction"
    ]
  },
  vision: {
    title: "Visual Understanding",
    details: [
      "Convolutional layers extract features",
      "Hierarchical feature learning",
      "Translation invariant",
      "Mimics visual cortex"
    ],
    realWorld: [
      "Facial recognition",
      "Medical imaging analysis",
      "Self-driving cars",
      "Security systems"
    ]
  },
  sentiment: {
    title: "Language Understanding",
    details: [
      "Processes natural language text",
      "Uses embeddings for word representation",
      "Attention to context and semantics",
      "Multi-aspect sentiment analysis"
    ],
    realWorld: [
      "Social media monitoring",
      "Customer feedback analysis",
      "Brand reputation tracking",
      "Chatbots and virtual assistants"
    ]
  },
  lstm: {
    title: "Sequential Learning",
    details: [
      "Maintains long-term memory",
      "Gates control information flow",
      "Solves vanishing gradient problem",
      "Ideal for time-dependent data"
    ],
    realWorld: [
      "Stock price prediction",
      "Language translation",
      "Speech recognition",
      "Weather forecasting"
    ]
  },
  blackbox: {
    title: "Complete AI Pipeline",
    details: [
      "Integrates all module types",
      "End-to-end data flow",
      "Explainable AI interface",
      "Real-world application hub"
    ],
    realWorld: [
      "Complex decision systems",
      "Multi-modal AI applications",
      "Educational demonstrations",
      "Research and experimentation"
    ]
  }
}

// Animated connection line with particles
function ConnectionLine({ 
  from, 
  to, 
  isActive,
  onClick 
}: { 
  from: ModuleNode
  to: ModuleNode
  isActive: boolean
  onClick: () => void
}) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  
  return (
    <g className="cursor-pointer" onClick={onClick}>
      {/* Base line */}
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={isActive ? "#22d3ee" : "#374151"}
        strokeWidth={isActive ? 3 : 1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Animated particles flowing along the connection */}
      {isActive && (
        <motion.circle
          r="4"
          fill="#22d3ee"
          filter="url(#glow)"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
          />
        </motion.circle>
      )}
      
      {/* Second particle with delay */}
      {isActive && (
        <motion.circle
          r="3"
          fill="#f472b6"
          filter="url(#glow)"
        >
          <animateMotion
            dur="2s"
            begin="1s"
            repeatCount="indefinite"
            path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
          />
        </motion.circle>
      )}
    </g>
  )
}

export function ModuleNetworkGraph() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)
  const [showPaths, setShowPaths] = useState(false)

  const activeModule = selectedModule || hoveredModule

  // Get connected modules
  const getConnectedModules = (moduleId: string): string[] => {
    const connected: string[] = []
    MODULES.forEach(m => {
      if (m.connections.includes(moduleId)) connected.push(m.id)
    })
    return connected
  }

  // Check if connection is active
  const isConnectionActive = (from: ModuleNode, to: ModuleNode): boolean => {
    if (!activeModule) return false
    return from.id === activeModule || to.id === activeModule
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Where Each Module Fits</h2>
          <p className="text-muted-foreground">
            Interactive network showing how all NeuroVista modules connect and complement each other
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPaths(!showPaths)}
          className="gap-2"
        >
          <GitBranch className="w-4 h-4" />
          {showPaths ? "Hide Paths" : "Show All Paths"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Network Graph */}
        <Card className="lg:col-span-2 bg-card border-border overflow-hidden">
          <CardContent className="p-6">
            <div className="relative h-[400px] w-full">
              <svg width="100%" height="100%" viewBox="0 0 750 350" className="w-full h-full">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>

                {/* Connection Lines */}
                {MODULES.map(module =>
                  module.connections.map(targetId => {
                    const target = MODULES.find(m => m.id === targetId)
                    if (!target) return null
                    return (
                      <ConnectionLine
                        key={`${module.id}-${targetId}`}
                        from={module}
                        to={target}
                        isActive={showPaths || isConnectionActive(module, target)}
                        onClick={() => setSelectedModule(module.id)}
                      />
                    )
                  })
                )}

                {/* Module Nodes */}
                {MODULES.map(module => {
                  const Icon = module.icon
                  const isActive = activeModule === module.id
                  const isHighlighted = activeModule && (module.id === activeModule || 
                    MODULES.find(m => m.id === activeModule)?.connections.includes(module.id) ||
                    getConnectedModules(activeModule).includes(module.id))

                  return (
                    <motion.g
                      key={module.id}
                      onClick={() => setSelectedModule(module.id === selectedModule ? null : module.id)}
                      onMouseEnter={() => setHoveredModule(module.id)}
                      onMouseLeave={() => setHoveredModule(null)}
                      className="cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Node Circle */}
                      <motion.circle
                        cx={module.x}
                        cy={module.y}
                        r={35}
                        className={`${module.bgColor} ${isActive ? "stroke-current stroke-4" : "stroke-muted-foreground/30"}`}
                        fillOpacity={isHighlighted ? 1 : 0.7}
                        animate={isActive ? {
                          scale: [1, 1.15, 1],
                          boxShadow: ["0 0 0px", "0 0 30px", "0 0 0px"]
                        } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      
                      {/* Glow Effect */}
                      {(isActive || isHighlighted) && (
                        <motion.circle
                          cx={module.x}
                          cy={module.y}
                          r={40}
                          fill={module.color.replace("text-", "#")}
                          fillOpacity="0.3"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      )}

                      {/* Icon */}
                      <foreignObject
                        x={module.x - 12}
                        y={module.y - 12}
                        width={24}
                        height={24}
                      >
                        <div className={`flex items-center justify-center w-full h-full ${isActive || isHighlighted ? module.color : "text-muted-foreground"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </foreignObject>

                      {/* Label */}
                      <text
                        x={module.x}
                        y={module.y + 50}
                        textAnchor="middle"
                        className={`text-sm font-medium ${isActive || isHighlighted ? module.color : "fill-muted-foreground"}`}
                      >
                        {module.name}
                      </text>
                    </motion.g>
                  )
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-cyan-400" />
                  <span>Foundation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span>Core</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span>Vision</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Sequential</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full bg-pink-400" />
                  <span>Integration</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Details Panel */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Module Details
            </CardTitle>
            <CardDescription>
              {activeModule ? "Click a module to learn more" : "Hover over or click a module to see details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {activeModule ? (
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {(() => {
                    const module = MODULES.find(m => m.id === activeModule)
                    const details = MODULE_DETAILS[activeModule]
                    if (!module || !details) return null
                    const Icon = module.icon

                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${module.bgColor}`}>
                            <Icon className={`w-6 h-6 ${module.color}`} />
                          </div>
                          <div>
                            <h3 className="font-bold">{module.name}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-amber-400" />
                              Key Characteristics
                            </h4>
                            <ul className="space-y-1">
                              {details.details.map((detail, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <Sparkles className="w-3 h-3 mt-0.5 shrink-0 text-cyan-400" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 bg-muted/50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-emerald-400" />
                              Real-World Applications
                            </h4>
                            <ul className="space-y-1">
                              {details.realWorld.map((app, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <Zap className="w-3 h-3 mt-0.5 shrink-0 text-amber-400" />
                                  {app}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Connected Modules */}
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Link2 className="w-4 h-4 text-blue-400" />
                              Connects To
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {module.connections.map(connId => {
                                const conn = MODULES.find(m => m.id === connId)
                                if (!conn) return null
                                const ConnIcon = conn.icon
                                return (
                                  <a
                                    key={connId}
                                    href={connId === "blackbox" ? "/blackbox" : `/${connId}`}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${conn.bgColor} ${conn.color} hover:opacity-80 transition-opacity`}
                                  >
                                    <ConnIcon className="w-3 h-3" />
                                    {conn.name}
                                  </a>
                                )
                              })}
                              {module.connections.length === 0 && (
                                <span className="text-xs text-muted-foreground">End of chain</span>
                              )}
                            </div>
                          </div>

                          <Button asChild className={`w-full gap-2 ${module.bgColor} ${module.color}`}>
                            <a href={module.id === "blackbox" ? "/blackbox" : `/${module.id}`}>
                              Explore {module.name}
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </>
                    )
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Box className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Click or hover on any module<br />in the network graph</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Learning Path */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Recommended Learning Path
          </CardTitle>
          <CardDescription>
            Follow this sequence to build your understanding from basics to advanced
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: "Perceptron", href: "/perceptron", color: "bg-cyan-500/20 text-cyan-400" },
              { name: "MLP", href: "/mlp", color: "bg-emerald-500/20 text-emerald-400" },
              { name: "Comparison", href: "/comparison", color: "bg-blue-500/20 text-blue-400" },
              { name: "Hopfield", href: "/hopfield", color: "bg-purple-500/20 text-purple-400" },
              { name: "Vision", href: "/vision", color: "bg-blue-500/20 text-blue-400" },
              { name: "Sentiment", href: "/sentiment", color: "bg-green-500/20 text-green-400" },
              { name: "LSTM", href: "/lstm", color: "bg-amber-500/20 text-amber-400" },
              { name: "Black Box", href: "/blackbox", color: "bg-pink-500/20 text-pink-400" }
            ].map((step, i, arr) => (
              <div key={step.name} className="flex items-center">
                <a
                  href={step.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${step.color} hover:opacity-80 transition-opacity`}
                >
                  {step.name}
                </a>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
