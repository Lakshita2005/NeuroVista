"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, ChevronRight, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface GateState {
  forget: number
  input: number
  candidate: number
  output: number
  cellState: number
  hiddenState: number
}

const TIMESTEPS = 5

export function LSTMVisualization() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEquations, setShowEquations] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0) // 0: forget, 1: input, 2: update, 3: output

  const gateStates: GateState[] = [
    { forget: 0.1, input: 0.9, candidate: 0.7, output: 0.8, cellState: 0.7, hiddenState: 0.56 },
    { forget: 0.2, input: 0.8, candidate: 0.6, output: 0.7, cellState: 0.62, hiddenState: 0.43 },
    { forget: 0.3, input: 0.7, candidate: 0.5, output: 0.6, cellState: 0.49, hiddenState: 0.29 },
    { forget: 0.4, input: 0.6, candidate: 0.4, output: 0.5, cellState: 0.34, hiddenState: 0.17 },
    { forget: 0.5, input: 0.5, candidate: 0.3, output: 0.4, cellState: 0.22, hiddenState: 0.09 },
  ]

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAnimationPhase((prev) => {
          if (prev >= 3) {
            setCurrentStep((step) => {
              if (step >= TIMESTEPS - 1) {
                setIsPlaying(false)
                return 0
              }
              return step + 1
            })
            return 0
          }
          return prev + 1
        })
      }, 800)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const reset = () => {
    setCurrentStep(0)
    setAnimationPhase(0)
    setIsPlaying(false)
  }

  const currentState = gateStates[currentStep]

  const phaseLabels = ["Forget Gate", "Input Gate", "Update Cell State", "Output Gate"]
  const phaseColors = ["text-red-400", "text-green-400", "text-amber-400", "text-blue-400"]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-card border-border">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant={isPlaying ? "secondary" : "default"}
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Animate"}
              </Button>
              <Button variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className={`text-lg px-4 py-2 ${phaseColors[animationPhase]}`}
              >
                {phaseLabels[animationPhase]}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEquations(!showEquations)}
              >
                {showEquations ? "Hide" : "Show"} Equations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main LSTM Visualization */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm">
              {currentStep + 1}
            </span>
            LSTM Cell at Time Step t
          </CardTitle>
          <CardDescription>
            Watch how data flows through the gates - click on any gate for details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="relative h-[500px] bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-8">
              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Input line */}
                <motion.line
                  x1="10%" y1="50%" x2="25%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted-foreground"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isPlaying ? 1 : 0.3 }}
                />
                
                {/* Previous hidden state line */}
                <motion.line
                  x1="25%" y1="85%" x2="25%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="text-purple-500/50"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />

                {/* Cell state line (horizontal) */}
                <motion.line
                  x1="35%" y1="50%" x2="65%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="4"
                  className={`transition-colors duration-500 ${
                    animationPhase >= 2 ? "text-amber-400" : "text-slate-600"
                  }`}
                />

                {/* Forget gate to cell state */}
                <motion.line
                  x1="30%" y1="25%" x2="35%" y2="45%"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-colors duration-300 ${
                    animationPhase === 0 ? "text-red-400" : "text-slate-600"
                  }`}
                />

                {/* Input gate to cell state */}
                <motion.line
                  x1="30%" y1="75%" x2="35%" y2="55%"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-colors duration-300 ${
                    animationPhase === 1 ? "text-green-400" : "text-slate-600"
                  }`}
                />

                {/* Cell state to output */}
                <motion.line
                  x1="65%" y1="50%" x2="75%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-colors duration-300 ${
                    animationPhase === 3 ? "text-blue-400" : "text-slate-600"
                  }`}
                />

                {/* Output to hidden state */}
                <motion.line
                  x1="75%" y1="50%" x2="75%" y2="85%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={`transition-colors duration-300 ${
                    animationPhase === 3 ? "text-purple-400" : "text-slate-600"
                  }`}
                />

                {/* Output arrow */}
                <motion.line
                  x1="75%" y1="50%" x2="90%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  className="text-cyan-400"
                />

                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="currentColor" className="text-cyan-400" />
                  </marker>
                </defs>
              </svg>

              {/* Input */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute left-[5%] top-1/2 -translate-y-1/2 w-16 h-16 rounded-lg bg-cyan-500/20 border-2 border-cyan-500/50 flex flex-col items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-xs text-cyan-400 font-bold">x</span>
                    <span className="text-[10px] text-muted-foreground">Input</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current input x_t</p>
                  <p className="text-xs text-muted-foreground">The data at current time step</p>
                </TooltipContent>
              </Tooltip>

              {/* Previous Hidden State */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute left-[20%] bottom-[5%] w-16 h-16 rounded-lg bg-purple-500/20 border-2 border-purple-500/50 flex flex-col items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-xs text-purple-400 font-bold">h</span>
                    <span className="text-[10px] text-muted-foreground">t-1</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous hidden state h_{"{t-1}"}</p>
                  <p className="text-xs text-muted-foreground">Memory from previous time step</p>
                </TooltipContent>
              </Tooltip>

              {/* Forget Gate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute left-[25%] top-[15%] w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      animationPhase === 0
                        ? "bg-red-500/30 border-2 border-red-500 shadow-lg shadow-red-500/50"
                        : "bg-red-500/10 border border-red-500/30"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    animate={animationPhase === 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: animationPhase === 0 ? Infinity : 0, duration: 1 }}
                  >
                    <span className="text-lg text-red-400 font-bold">σ</span>
                    <span className="text-[10px] text-muted-foreground">Forget</span>
                    <span className="text-xs text-red-400 mt-1">{currentState.forget.toFixed(1)}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-semibold">Forget Gate</p>
                  <p className="text-xs text-muted-foreground">f_t = σ(W_f · [h_{"{t-1}"}, x_t] + b_f)</p>
                  <p className="text-xs text-red-400 mt-1">Value: {currentState.forget.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Keep {Math.round((1-currentState.forget)*100)}% of memory</p>
                </TooltipContent>
              </Tooltip>

              {/* Input Gate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute left-[25%] bottom-[15%] w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      animationPhase === 1
                        ? "bg-green-500/30 border-2 border-green-500 shadow-lg shadow-green-500/50"
                        : "bg-green-500/10 border border-green-500/30"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    animate={animationPhase === 1 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: animationPhase === 1 ? Infinity : 0, duration: 1 }}
                  >
                    <span className="text-lg text-green-400 font-bold">σ</span>
                    <span className="text-[10px] text-muted-foreground">Input</span>
                    <span className="text-xs text-green-400 mt-1">{currentState.input.toFixed(1)}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-semibold">Input Gate</p>
                  <p className="text-xs text-muted-foreground">i_t = σ(W_i · [h_{"{t-1}"}, x_t] + b_i)</p>
                  <p className="text-xs text-green-400 mt-1">Value: {currentState.input.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Add {Math.round(currentState.input*100)}% of new info</p>
                </TooltipContent>
              </Tooltip>

              {/* Candidate Values */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute left-[35%] bottom-[5%] w-16 h-16 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      animationPhase === 1
                        ? "bg-amber-500/30 border-2 border-amber-500 shadow-lg shadow-amber-500/50"
                        : "bg-amber-500/10 border border-amber-500/30"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm text-amber-400 font-bold">tanh</span>
                    <span className="text-[9px] text-muted-foreground">Candidate</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-semibold">Candidate Values</p>
                  <p className="text-xs text-muted-foreground">C̃_t = tanh(W_c · [h_{"{t-1}"}, x_t] + b_c)</p>
                  <p className="text-xs text-amber-400 mt-1">Candidate: {currentState.candidate.toFixed(2)}</p>
                </TooltipContent>
              </Tooltip>

              {/* Cell State */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      animationPhase === 2
                        ? "bg-amber-500/30 border-2 border-amber-500 shadow-lg shadow-amber-500/50"
                        : "bg-slate-700/50 border border-slate-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    animate={animationPhase === 2 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: animationPhase === 2 ? Infinity : 0, duration: 1 }}
                  >
                    <span className="text-sm text-amber-400 font-bold">C_t</span>
                    <span className="text-[10px] text-muted-foreground">Cell State</span>
                    <motion.span
                      className="text-lg text-amber-400 mt-1 font-mono"
                      key={currentState.cellState}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {currentState.cellState.toFixed(2)}
                    </motion.span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Cell State (Long-term Memory)</p>
                  <p className="text-xs text-muted-foreground">C_t = f_t * C_{"{t-1}"} + i_t * C̃_t</p>
                  <p className="text-xs text-amber-400 mt-1">Current Value: {currentState.cellState.toFixed(3)}</p>
                  <p className="text-xs text-muted-foreground">The &quot;conveyor belt&quot; of memory</p>
                </TooltipContent>
              </Tooltip>

              {/* Output Gate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute right-[20%] top-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      animationPhase === 3
                        ? "bg-blue-500/30 border-2 border-blue-500 shadow-lg shadow-blue-500/50"
                        : "bg-blue-500/10 border border-blue-500/30"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    animate={animationPhase === 3 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: animationPhase === 3 ? Infinity : 0, duration: 1 }}
                  >
                    <span className="text-lg text-blue-400 font-bold">σ</span>
                    <span className="text-[10px] text-muted-foreground">Output</span>
                    <span className="text-xs text-blue-400 mt-1">{currentState.output.toFixed(1)}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">Output Gate</p>
                  <p className="text-xs text-muted-foreground">o_t = σ(W_o · [h_{"{t-1}"}, x_t] + b_o)</p>
                  <p className="text-xs text-blue-400 mt-1">Value: {currentState.output.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Filter what to output</p>
                </TooltipContent>
              </Tooltip>

              {/* Hidden State */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute right-[5%] top-1/2 -translate-y-1/2 w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      animationPhase === 3
                        ? "bg-purple-500/30 border-2 border-purple-500 shadow-lg shadow-purple-500/50"
                        : "bg-purple-500/20 border border-purple-500/50"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-sm text-purple-400 font-bold">h_t</span>
                    <span className="text-[10px] text-muted-foreground">Hidden</span>
                    <motion.span
                      className="text-xs text-purple-400 mt-1 font-mono"
                      key={currentState.hiddenState}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {currentState.hiddenState.toFixed(2)}
                    </motion.span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">Hidden State (Short-term Memory)</p>
                  <p className="text-xs text-muted-foreground">h_t = o_t * tanh(C_t)</p>
                  <p className="text-xs text-purple-400 mt-1">Value: {currentState.hiddenState.toFixed(3)}</p>
                  <p className="text-xs text-muted-foreground">What we output and pass to next step</p>
                </TooltipContent>
              </Tooltip>

              {/* Info Panel */}
              <AnimatePresence>
                {showEquations && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-4 top-4 w-64 bg-slate-900/90 border border-slate-700 rounded-lg p-4 text-xs"
                  >
                    <h4 className="font-semibold mb-2 text-pink-400">LSTM Equations</h4>
                    <div className="space-y-2 font-mono">
                      <p><span className="text-red-400">f_t</span> = σ(W_f·[h_{"{t-1}"},x_t]+b_f)</p>
                      <p><span className="text-green-400">i_t</span> = σ(W_i·[h_{"{t-1}"},x_t]+b_i)</p>
                      <p><span className="text-amber-400">C̃_t</span> = tanh(W_c·[h_{"{t-1}"},x_t]+b_c)</p>
                      <p><span className="text-amber-400">C_t</span> = f_t*C_{"{t-1}"}+i_t*C̃_t</p>
                      <p><span className="text-blue-400">o_t</span> = σ(W_o·[h_{"{t-1}"},x_t]+b_o)</p>
                      <p><span className="text-purple-400">h_t</span> = o_t*tanh(C_t)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* State Progression */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm">Gate Values Across Time Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {gateStates.map((state, idx) => (
              <motion.div
                key={idx}
                className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                  idx === currentStep
                    ? "bg-pink-500/20 border-pink-500/50"
                    : "bg-muted/30 border-border"
                }`}
                onClick={() => setCurrentStep(idx)}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs text-muted-foreground mb-2">t={idx + 1}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-400">f:</span>
                    <span className="font-mono">{state.forget.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-400">i:</span>
                    <span className="font-mono">{state.input.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-400">o:</span>
                    <span className="font-mono">{state.output.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400">C:</span>
                    <span className="font-mono">{state.cellState.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm">Color Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500" />
              <span className="text-sm text-muted-foreground">Forget Gate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500" />
              <span className="text-sm text-muted-foreground">Input Gate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500/30 border border-amber-500" />
              <span className="text-sm text-muted-foreground">Cell State</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500" />
              <span className="text-sm text-muted-foreground">Output Gate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500" />
              <span className="text-sm text-muted-foreground">Hidden State</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-500/30 border border-cyan-500" />
              <span className="text-sm text-muted-foreground">Input</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
