"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Info,
  Brain,
  Trash2,
  DoorOpen,
  DoorClosed,
  Database,
  ArrowRight,
  Sigma,
  Activity
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface GateValues {
  forget: number
  input: number
  output: number
  candidate: number
}

interface CellState {
  cellState: number
  hiddenState: number
  input: number
}

export function LSTMVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [animationPhase, setAnimationPhase] = useState(0) // 0: forget, 1: input, 2: cell update, 3: output
  
  // Interactive gate values
  const [gates, setGates] = useState<GateValues>({
    forget: 0.3,
    input: 0.7,
    output: 0.8,
    candidate: 0.6
  })

  // Cell states
  const [cellState, setCellState] = useState<CellState>({
    cellState: 0.5,
    hiddenState: 0.4,
    input: 0.6
  })

  const [showMath, setShowMath] = useState(false)
  const [activeGate, setActiveGate] = useState<string | null>(null)

  // Calculate new cell state based on gates
  const calculateCellState = useCallback((prevCell: number, gates: GateValues): number => {
    const forgetComponent = prevCell * gates.forget
    const inputComponent = gates.candidate * gates.input
    return Math.max(-1, Math.min(1, forgetComponent + inputComponent))
  }, [])

  const calculateHiddenState = useCallback((cell: number, outputGate: number): number => {
    return Math.max(-1, Math.min(1, Math.tanh(cell) * outputGate))
  }, [])

  // Animation effect
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAnimationPhase((prev) => {
          if (prev >= 3) {
            setCurrentStep((step) => step + 1)
            // Update cell state
            setCellState((prev) => {
              const newCell = calculateCellState(prev.cellState, gates)
              const newHidden = calculateHiddenState(newCell, gates.output)
              return {
                ...prev,
                cellState: newCell,
                hiddenState: newHidden
              }
            })
            return 0
          }
          return prev + 1
        })
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [isPlaying, gates, calculateCellState, calculateHiddenState])

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setAnimationPhase(0)
    setCellState({
      cellState: 0.5,
      hiddenState: 0.4,
      input: 0.6
    })
  }

  const phaseLabels = [
    { name: "Forget Gate", color: "text-red-400", desc: "Decide what to forget" },
    { name: "Input Gate", color: "text-green-400", desc: "Decide what to remember" },
    { name: "Cell Update", color: "text-amber-400", desc: "Update cell state" },
    { name: "Output Gate", color: "text-blue-400", desc: "Decide what to output" }
  ]

  const currentPhase = phaseLabels[animationPhase]

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-pink-400" />
            Interactive LSTM Cell Controls
          </CardTitle>
          <CardDescription>
            Adjust gate values and watch how they affect memory flow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Animation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
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
                className={`text-lg px-4 py-2 ${currentPhase.color}`}
              >
                {currentPhase.name}
              </Badge>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {currentPhase.desc}
              </span>
            </div>
          </div>

          {/* Gate Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Forget Gate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  Forget Gate (fₜ)
                </label>
                <span className="text-sm font-mono text-red-400">{gates.forget.toFixed(2)}</span>
              </div>
              <Slider
                value={[gates.forget]}
                onValueChange={(v) => setGates({ ...gates, forget: v[0] })}
                min={0}
                max={1}
                step={0.05}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Keep {Math.round(gates.forget * 100)}% of previous memory
              </p>
            </div>

            {/* Input Gate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <DoorOpen className="w-4 h-4 text-green-400" />
                  Input Gate (iₜ)
                </label>
                <span className="text-sm font-mono text-green-400">{gates.input.toFixed(2)}</span>
              </div>
              <Slider
                value={[gates.input]}
                onValueChange={(v) => setGates({ ...gates, input: v[0] })}
                min={0}
                max={1}
                step={0.05}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Add {Math.round(gates.input * 100)}% of new information
              </p>
            </div>

            {/* Candidate Values Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Brain className="w-4 h-4 text-amber-400" />
                  Candidate (C̃ₜ)
                </label>
                <span className="text-sm font-mono text-amber-400">{gates.candidate.toFixed(2)}</span>
              </div>
              <Slider
                value={[gates.candidate]}
                onValueChange={(v) => setGates({ ...gates, candidate: v[0] })}
                min={-1}
                max={1}
                step={0.1}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Potential new value to add to memory
              </p>
            </div>

            {/* Output Gate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <DoorClosed className="w-4 h-4 text-blue-400" />
                  Output Gate (oₜ)
                </label>
                <span className="text-sm font-mono text-blue-400">{gates.output.toFixed(2)}</span>
              </div>
              <Slider
                value={[gates.output]}
                onValueChange={(v) => setGates({ ...gates, output: v[0] })}
                min={0}
                max={1}
                step={0.05}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Output {Math.round(gates.output * 100)}% of processed memory
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Visualization */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>LSTM Cell Architecture</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowMath(!showMath)}>
              {showMath ? "Hide" : "Show"} Math
            </Button>
          </div>
          <CardDescription>
            Watch how information flows through the gates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="relative h-[550px] bg-gradient-to-br from-slate-900/80 to-slate-950/90 rounded-xl p-6 overflow-hidden">
              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Input line */}
                <motion.line
                  x1="5%" y1="50%" x2="20%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-cyan-500"
                  animate={{ 
                    strokeWidth: isPlaying ? [3, 5, 3] : 3,
                    opacity: isPlaying ? [0.6, 1, 0.6] : 0.6
                  }}
                  transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
                />

                {/* Previous hidden state line */}
                <motion.line
                  x1="20%" y1="85%" x2="20%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="text-purple-500/60"
                />

                {/* Cell state horizontal line (conveyor belt) */}
                <motion.line
                  x1="35%" y1="50%" x2="65%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-amber-500/50"
                  animate={{ 
                    stroke: animationPhase >= 2 ? "#fbbf24" : "#64748b",
                    strokeWidth: animationPhase === 2 ? [6, 8, 6] : 6
                  }}
                />

                {/* Forget gate connection */}
                <motion.line
                  x1="28%" y1="25%" x2="35%" y2="45%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-red-500"
                  animate={{ 
                    opacity: animationPhase === 0 ? 1 : 0.3,
                    strokeWidth: animationPhase === 0 ? [3, 5, 3] : 3
                  }}
                />

                {/* Input gate connection */}
                <motion.line
                  x1="28%" y1="75%" x2="35%" y2="55%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-green-500"
                  animate={{ 
                    opacity: animationPhase === 1 ? 1 : 0.3,
                    strokeWidth: animationPhase === 1 ? [3, 5, 3] : 3
                  }}
                />

                {/* Output gate connection */}
                <motion.line
                  x1="65%" y1="50%" x2="75%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-blue-500"
                  animate={{ 
                    opacity: animationPhase === 3 ? 1 : 0.3,
                    strokeWidth: animationPhase === 3 ? [3, 5, 3] : 3
                  }}
                />

                {/* Hidden state output */}
                <motion.line
                  x1="75%" y1="50%" x2="95%" y2="50%"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-purple-500"
                />
                <motion.line
                  x1="75%" y1="50%" x2="75%" y2="85%"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  className="text-purple-500/50"
                />

                {/* Arrow markers */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="currentColor" className="text-cyan-500" />
                  </marker>
                </defs>
              </svg>

              {/* Input Node */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute left-[2%] top-1/2 -translate-y-1/2 w-16 h-16 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/60 flex flex-col items-center justify-center cursor-pointer z-10"
                    whileHover={{ scale: 1.1 }}
                    animate={{ 
                      boxShadow: isPlaying ? ["0 0 0px rgba(6,182,212,0)", "0 0 20px rgba(6,182,212,0.5)", "0 0 0px rgba(6,182,212,0)"] : "0 0 0px rgba(6,182,212,0)"
                    }}
                    transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
                  >
                    <span className="text-lg font-bold text-cyan-400">xₜ</span>
                    <span className="text-[10px] text-cyan-300/70">Input</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Current Input</p>
                  <p className="text-xs text-muted-foreground">The new information at time step t</p>
                </TooltipContent>
              </Tooltip>

              {/* Previous Hidden State */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute left-[15%] bottom-[5%] w-16 h-16 rounded-xl bg-purple-500/20 border-2 border-purple-500/60 flex flex-col items-center justify-center cursor-pointer z-10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-lg font-bold text-purple-400">hₜ₋₁</span>
                    <span className="text-[10px] text-purple-300/70">Previous</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Previous Hidden State</p>
                  <p className="text-xs text-muted-foreground">Short-term memory from previous step</p>
                </TooltipContent>
              </Tooltip>

              {/* Forget Gate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute left-[22%] top-[15%] w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer z-20 transition-all duration-300 ${
                      animationPhase === 0
                        ? "bg-red-500/30 border-2 border-red-500 shadow-lg shadow-red-500/50"
                        : "bg-red-500/10 border border-red-500/40"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveGate("forget")}
                    animate={animationPhase === 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: animationPhase === 0 ? Infinity : 0, duration: 0.8 }}
                  >
                    <Sigma className="w-6 h-6 text-red-400" />
                    <span className="text-xs text-red-300/70 mt-1">Forget</span>
                    <span className="text-sm font-mono text-red-400 font-bold">{gates.forget.toFixed(2)}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-semibold text-red-400">Forget Gate</p>
                  <p className="text-xs text-muted-foreground">fₜ = σ(Wf · [hₜ₋₁, xₜ] + bf)</p>
                  <p className="text-xs mt-1">Controls what to forget from cell state</p>
                  <p className="text-xs text-red-400">Value: {gates.forget.toFixed(2)}</p>
                </TooltipContent>
              </Tooltip>

              {/* Input Gate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute left-[22%] bottom-[15%] w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer z-20 transition-all duration-300 ${
                      animationPhase === 1
                        ? "bg-green-500/30 border-2 border-green-500 shadow-lg shadow-green-500/50"
                        : "bg-green-500/10 border border-green-500/40"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveGate("input")}
                    animate={animationPhase === 1 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: animationPhase === 1 ? Infinity : 0, duration: 0.8 }}
                  >
                    <Sigma className="w-6 h-6 text-green-400" />
                    <span className="text-xs text-green-300/70 mt-1">Input</span>
                    <span className="text-sm font-mono text-green-400 font-bold">{gates.input.toFixed(2)}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-semibold text-green-400">Input Gate</p>
                  <p className="text-xs text-muted-foreground">iₜ = σ(Wi · [hₜ₋₁, xₜ] + bi)</p>
                  <p className="text-xs mt-1">Controls what new info to add</p>
                  <p className="text-xs text-green-400">Value: {gates.input.toFixed(2)}</p>
                </TooltipContent>
              </Tooltip>

              {/* Candidate Values */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute left-[35%] bottom-[8%] w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer z-20 transition-all duration-300 ${
                      animationPhase === 1
                        ? "bg-amber-500/30 border-2 border-amber-500"
                        : "bg-amber-500/10 border border-amber-500/40"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm text-amber-400 font-bold">tanh</span>
                    <span className="text-[10px] text-amber-300/70">Candidate</span>
                    <span className="text-sm font-mono text-amber-400">{gates.candidate.toFixed(1)}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-semibold text-amber-400">Candidate Values</p>
                  <p className="text-xs text-muted-foreground">C̃ₜ = tanh(Wc · [hₜ₋₁, xₜ] + bc)</p>
                  <p className="text-xs mt-1">New candidate values to potentially add</p>
                </TooltipContent>
              </Tooltip>

              {/* Cell State (Center) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-2xl flex flex-col items-center justify-center cursor-pointer z-30 transition-all duration-300 ${
                      animationPhase === 2
                        ? "bg-amber-500/30 border-2 border-amber-500 shadow-xl shadow-amber-500/40"
                        : "bg-slate-700/60 border border-slate-500"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Database className="w-8 h-8 text-amber-400 mb-1" />
                    <span className="text-sm font-bold text-amber-400">Cₜ</span>
                    <span className="text-[10px] text-amber-300/70">Cell State</span>
                    <motion.span
                      className="text-2xl font-mono text-amber-400 font-bold mt-1"
                      key={cellState.cellState}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {cellState.cellState.toFixed(2)}
                    </motion.span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold text-amber-400">Cell State (Long-term Memory)</p>
                  <p className="text-xs text-muted-foreground">Cₜ = fₜ × Cₜ₋₁ + iₜ × C̃ₜ</p>
                  <p className="text-xs mt-1">The &quot;conveyor belt&quot; of memory</p>
                  <p className="text-xs text-amber-400 mt-1">Current: {cellState.cellState.toFixed(3)}</p>
                </TooltipContent>
              </Tooltip>

              {/* Output Gate */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute right-[18%] top-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer z-20 transition-all duration-300 ${
                      animationPhase === 3
                        ? "bg-blue-500/30 border-2 border-blue-500 shadow-lg shadow-blue-500/50"
                        : "bg-blue-500/10 border border-blue-500/40"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveGate("output")}
                    animate={animationPhase === 3 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: animationPhase === 3 ? Infinity : 0, duration: 0.8 }}
                  >
                    <Sigma className="w-6 h-6 text-blue-400" />
                    <span className="text-xs text-blue-300/70 mt-1">Output</span>
                    <span className="text-sm font-mono text-blue-400 font-bold">{gates.output.toFixed(2)}</span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold text-blue-400">Output Gate</p>
                  <p className="text-xs text-muted-foreground">oₜ = σ(Wo · [hₜ₋₁, xₜ] + bo)</p>
                  <p className="text-xs mt-1">Controls what to output from cell state</p>
                  <p className="text-xs text-blue-400">Value: {gates.output.toFixed(2)}</p>
                </TooltipContent>
              </Tooltip>

              {/* Hidden State Output */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`absolute right-[2%] top-1/2 -translate-y-1/2 w-20 h-20 rounded-xl flex flex-col items-center justify-center cursor-pointer z-20 transition-all duration-300 ${
                      animationPhase === 3
                        ? "bg-purple-500/30 border-2 border-purple-500 shadow-lg shadow-purple-500/50"
                        : "bg-purple-500/20 border border-purple-500/60"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-xl font-bold text-purple-400">hₜ</span>
                    <span className="text-[10px] text-purple-300/70">Hidden</span>
                    <motion.span
                      className="text-lg font-mono text-purple-400 font-bold"
                      key={cellState.hiddenState}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {cellState.hiddenState.toFixed(2)}
                    </motion.span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold text-purple-400">Hidden State</p>
                  <p className="text-xs text-muted-foreground">hₜ = oₜ × tanh(Cₜ)</p>
                  <p className="text-xs mt-1">Output passed to next step and for predictions</p>
                  <p className="text-xs text-purple-400">Value: {cellState.hiddenState.toFixed(3)}</p>
                </TooltipContent>
              </Tooltip>

              {/* Current Step Indicator */}
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-slate-800/80 text-cyan-400 border-cyan-500/30">
                  Step: {currentStep}
                </Badge>
              </div>

              {/* Active Gate Info Panel */}
              <AnimatePresence>
                {showMath && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-4 top-16 w-72 bg-slate-900/95 border border-slate-700 rounded-lg p-4 text-sm z-40"
                  >
                    <h4 className="font-semibold mb-3 text-pink-400 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      LSTM Equations
                    </h4>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
                        <span className="text-red-400">Forget:</span>
                        <p>fₜ = σ(Wf · [hₜ₋₁, xₜ] + bf)</p>
                      </div>
                      <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
                        <span className="text-green-400">Input:</span>
                        <p>iₜ = σ(Wi · [hₜ₋₁, xₜ] + bi)</p>
                        <p>C̃ₜ = tanh(Wc · [hₜ₋₁, xₜ] + bc)</p>
                      </div>
                      <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20">
                        <span className="text-amber-400">Cell State:</span>
                        <p>Cₜ = fₜ × Cₜ₋₁ + iₜ × C̃ₜ</p>
                      </div>
                      <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                        <span className="text-blue-400">Output:</span>
                        <p>oₜ = σ(Wo · [hₜ₋₁, xₜ] + bo)</p>
                        <p>hₜ = oₜ × tanh(Cₜ)</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
                {[
                  { color: "bg-red-500", label: "Forget" },
                  { color: "bg-green-500", label: "Input" },
                  { color: "bg-amber-500", label: "Cell State" },
                  { color: "bg-blue-500", label: "Output" },
                  { color: "bg-purple-500", label: "Hidden" },
                  { color: "bg-cyan-500", label: "Input x" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs text-slate-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* State Explanation */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm">Current Gate Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-400/70 mb-1">Forget Gate (fₜ)</p>
              <p className="text-2xl font-mono font-bold text-red-400">{gates.forget.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Keeping {Math.round(gates.forget * 100)}% of previous memory
              </p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-xs text-green-400/70 mb-1">Input Gate (iₜ)</p>
              <p className="text-2xl font-mono font-bold text-green-400">{gates.input.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Adding {Math.round(gates.input * 100)}% of new info
              </p>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-400/70 mb-1">Cell State (Cₜ)</p>
              <p className="text-2xl font-mono font-bold text-amber-400">{cellState.cellState.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Long-term memory value
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400/70 mb-1">Output Gate (oₜ)</p>
              <p className="text-2xl font-mono font-bold text-blue-400">{gates.output.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Outputting {Math.round(gates.output * 100)}% to hₜ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
