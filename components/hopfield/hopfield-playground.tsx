"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, RotateCcw, Zap, Grid3X3, Activity } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const GRID_SIZE = 10
const TOTAL_NEURONS = 100

interface HopfieldResult {
  status: string
  original_pattern: number[]
  noisy_pattern: number[]
  recovered_pattern: number[]
  energy_curve: number[]
  matched: boolean
  matched_label?: string
  similarity: number
  converged: boolean
  iterations: number
  final_energy: number
}

// Predefined patterns (10x10 = 100 neurons)
const PATTERNS: { [key: string]: number[] } = {
  A: Array(100).fill(-1).map((_, i) => {
    const row = Math.floor(i / 10)
    const col = i % 10
    // Draw letter A
    return (col === 2 || col === 7 || (row === 0 && col > 2 && col < 8) || (row === 4 && col > 2 && col < 8)) ? 1 : -1
  }),
  B: Array(100).fill(-1).map((_, i) => {
    const row = Math.floor(i / 10)
    const col = i % 10
    // Draw letter B
    return (col === 2 || (col === 8 && row !== 0 && row !== 4 && row !== 9) || 
            (row === 0 && col > 2 && col < 8) || 
            (row === 4 && col > 2 && col < 8) ||
            (row === 9 && col > 2 && col < 8)) ? 1 : -1
  }),
  C: Array(100).fill(-1).map((_, i) => {
    const row = Math.floor(i / 10)
    const col = i % 10
    // Draw letter C
    return ((col === 2 || col === 3) && row > 1 && row < 8) || 
           ((row === 1 || row === 8) && col > 2 && col < 8) ? 1 : -1
  }),
  D: Array(100).fill(-1).map((_, i) => {
    const row = Math.floor(i / 10)
    const col = i % 10
    // Draw letter D
    return (col === 2) || (col === 7 && row > 1 && row < 8) || 
           ((row === 1 || row === 8) && col > 2 && col < 7) ? 1 : -1
  })
}

export function HopfieldPlayground() {
  const [state, setState] = useState<number[]>(Array(TOTAL_NEURONS).fill(-1))
  const [energyHistory, setEnergyHistory] = useState<number[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [noiseLevel, setNoiseLevel] = useState(20)
  const [updatedIndex, setUpdatedIndex] = useState(-1)
  const [iterations, setIterations] = useState(0)
  const [storedPatterns, setStoredPatterns] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentResult, setCurrentResult] = useState<HopfieldResult | null>(null)
  const [networkTrained, setNetworkTrained] = useState(false)

  // Train network with patterns on mount
  useEffect(() => {
    trainNetwork()
  }, [])

  const trainNetwork = async () => {
    try {
      const patterns = Object.values(PATTERNS)
      const labels = Object.keys(PATTERNS)
      
      const response = await fetch(`${API_BASE_URL}/hopfield/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patterns: patterns,
          labels: labels
        })
      })

      const data = await response.json()
      
      if (response.ok && data.status === "success") {
        setStoredPatterns(labels)
        setNetworkTrained(true)
        setError(null)
      } else {
        setError(data.message || "Failed to train network")
        // Fallback: still work with local patterns
        setStoredPatterns(labels)
        setNetworkTrained(true)
      }
    } catch (err) {
      console.error("Network training error:", err)
      // Fallback to local mode
      setStoredPatterns(Object.keys(PATTERNS))
      setNetworkTrained(true)
    }
  }

  const toggleCell = (index: number) => {
    if (isRunning) return
    const newState = [...state]
    newState[index] = newState[index] === 1 ? -1 : 1
    setState(newState)
    setIterations(0)
    setEnergyHistory([])
    setCurrentResult(null)
  }

  const addNoise = useCallback(async () => {
    if (!networkTrained) {
      setError("Network not trained yet")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/hopfield/noise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern: state,
          noise_level: noiseLevel / 100
        })
      })

      const data = await response.json()
      
      if (response.ok && data.status === "success") {
        setState(data.noisy_pattern)
        setCurrentResult(null)
        setIterations(0)
        setEnergyHistory([data.energy])
      } else {
        // Fallback: local noise addition
        const newState = [...state]
        const numFlips = Math.floor((noiseLevel / 100) * TOTAL_NEURONS)
        const indices = Array.from({ length: TOTAL_NEURONS }, (_, i) => i)
        for (let i = 0; i < numFlips; i++) {
          const randIdx = Math.floor(Math.random() * indices.length)
          const idx = indices[randIdx]
          newState[idx] = -newState[idx]
          indices.splice(randIdx, 1)
        }
        setState(newState)
        setIterations(0)
        setEnergyHistory([])
      }
    } catch (err) {
      console.error("Add noise error:", err)
      // Fallback: local noise
      const newState = [...state]
      const numFlips = Math.floor((noiseLevel / 100) * TOTAL_NEURONS)
      const indices = Array.from({ length: TOTAL_NEURONS }, (_, i) => i)
      for (let i = 0; i < numFlips; i++) {
        const randIdx = Math.floor(Math.random() * indices.length)
        const idx = indices[randIdx]
        newState[idx] = -newState[idx]
        indices.splice(randIdx, 1)
      }
      setState(newState)
    }
  }, [state, noiseLevel, networkTrained])

  const loadPattern = async (pattern: number[]) => {
    setState([...pattern])
    setIterations(0)
    setEnergyHistory([])
    setCurrentResult(null)
  }

  const runStep = useCallback(async () => {
    if (!networkTrained) {
      setError("Network not trained yet")
      return false
    }

    try {
      const response = await fetch(`${API_BASE_URL}/hopfield/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: state
        })
      })

      const data = await response.json()
      
      if (response.ok && data.status === "success") {
        setState(data.state)
        setIterations(prev => prev + 1)
        setEnergyHistory(prev => [...prev, data.energy])
        
        // Show which neuron changed
        if (data.changed && data.updated_index !== null) {
          setUpdatedIndex(data.updated_index)
          setTimeout(() => setUpdatedIndex(-1), 300)
        }
        
        return data.converged
      }
    } catch (err) {
      console.error("Run step error:", err)
    }
    return false
  }, [state, networkTrained])

  const runUntilConvergence = useCallback(async () => {
    if (!networkTrained) {
      setError("Network not trained yet")
      return
    }

    setIsRunning(true)
    setError(null)
    setCurrentResult(null)

    try {
      // Step-by-step recovery with animation
      const energyCurve: number[] = [...energyHistory]
      let currentState = [...state]
      let stepCount = iterations
      let converged = false
      
      // Run up to 100 iterations
      for (let step = 0; step < 100; step++) {
        const response = await fetch(`${API_BASE_URL}/hopfield/step`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            state: currentState
          })
        })

        const data = await response.json()
        
        if (!response.ok || data.status !== "success") {
          break
        }
        
        currentState = data.state
        energyCurve.push(data.energy)
        stepCount++
        
        // Update UI
        setState([...currentState])
        setIterations(stepCount)
        setEnergyHistory([...energyCurve])
        
        // Show which neuron changed
        if (data.changed && data.updated_index !== null) {
          setUpdatedIndex(data.updated_index)
        }
        
        // Small delay for animation
        await new Promise(resolve => setTimeout(resolve, 50))
        
        converged = data.converged
        if (converged) {
          break
        }
      }
      
      setUpdatedIndex(-1)
      
      // Get final authentication result
      const authResponse = await fetch(`${API_BASE_URL}/hopfield/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pattern: state,  // Original starting pattern
          noise_level: 0,
          update_mode: "async"
        })
      })

      const authData = await authResponse.json()
      if (authResponse.ok && authData.status === "success") {
        setCurrentResult(authData)
      }
    } catch (err) {
      setError("Network error - is backend running?")
    } finally {
      setIsRunning(false)
      setUpdatedIndex(-1)
    }
  }, [state, networkTrained, energyHistory, iterations])

  const reset = () => {
    setState(Array(TOTAL_NEURONS).fill(-1))
    setEnergyHistory([])
    setIterations(0)
    setUpdatedIndex(-1)
    setCurrentResult(null)
    setError(null)
  }

  const currentEnergy = energyHistory.length > 0 ? energyHistory[energyHistory.length - 1] : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pattern Grid */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-purple-400" />
            Network State
            {!networkTrained && (
              <span className="text-xs text-amber-400 ml-2">(Training...)</span>
            )}
          </CardTitle>
          <CardDescription>
            Click cells to toggle, or load a pattern and add noise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            {/* Grid */}
            <div
              className="grid gap-1 p-4 bg-muted/30 rounded-lg"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
              {state.map((value, index) => (
                <motion.button
                  key={index}
                  onClick={() => toggleCell(index)}
                  className={`w-8 h-8 rounded-md transition-colors ${
                    value === 1
                      ? "bg-purple-500 shadow-lg shadow-purple-500/30"
                      : "bg-muted hover:bg-muted/80"
                  } ${updatedIndex === index ? "ring-2 ring-yellow-400" : ""}`}
                  animate={{
                    scale: updatedIndex === index ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  disabled={isRunning}
                />
              ))}
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pattern buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Load:</span>
              {Object.entries(PATTERNS).map(([name, pattern]) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => loadPattern(pattern)}
                  disabled={isRunning}
                >
                  {name}
                </Button>
              ))}
            </div>

            {/* Noise control */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Noise Level</span>
                <span className="text-foreground">{noiseLevel}%</span>
              </div>
              <Slider
                value={[noiseLevel]}
                onValueChange={([v]) => setNoiseLevel(v)}
                min={0}
                max={50}
                step={5}
                disabled={isRunning}
              />
              <Button
                variant="outline"
                onClick={addNoise}
                disabled={isRunning || !networkTrained}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Add Noise
              </Button>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <Button onClick={runStep} disabled={isRunning || !networkTrained}>
                Step
              </Button>
              <Button onClick={runUntilConvergence} disabled={isRunning || !networkTrained}>
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
              <Button variant="outline" onClick={reset} disabled={isRunning}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-yellow-400" />
            Energy Landscape
          </CardTitle>
          <CardDescription>
            Watch the network minimize energy to find stable states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Energy</p>
                <p className="text-2xl font-mono text-purple-400">
                  {currentEnergy.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Iterations</p>
                <p className="text-2xl font-mono text-cyan-400">{iterations}</p>
              </div>
            </div>

            {/* Match info */}
            {currentResult && (
              <div className={`p-4 rounded-lg border ${
                currentResult.matched 
                  ? "bg-green-500/10 border-green-500/30" 
                  : "bg-amber-500/10 border-amber-500/30"
              }`}>
                <p className="text-sm font-medium">
                  {currentResult.matched 
                    ? `✓ Converged to: ${currentResult.matched_label}` 
                    : "⚠ Partial convergence"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Similarity: {(currentResult.similarity * 100).toFixed(1)}%
                </p>
              </div>
            )}

            {/* Energy history chart */}
            <div className="h-48 bg-muted/20 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute inset-0 p-4">
                <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[0, 25, 50].map(y => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="100"
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity="0.1"
                      strokeWidth="0.5"
                    />
                  ))}

                  {/* Energy line */}
                  {energyHistory.length > 1 && (
                    <motion.polyline
                      fill="none"
                      stroke="url(#energyGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={energyHistory
                        .map((e, i) => {
                          const x = (i / (energyHistory.length - 1)) * 100
                          const minE = Math.min(...energyHistory)
                          const maxE = Math.max(...energyHistory)
                          const range = maxE - minE || 1
                          const y = 50 - ((e - minE) / range) * 45
                          return `${x},${y}`
                        })
                        .join(" ")}
                    />
                  )}

                  <defs>
                    <linearGradient id="energyGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {energyHistory.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Run the network to see energy changes
                </div>
              )}
            </div>

            {/* Stored patterns preview */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Stored Patterns</p>
              <div className="flex flex-wrap gap-4">
                {Object.entries(PATTERNS).map(([name, pattern], pIdx) => (
                  <div
                    key={pIdx}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-xs text-muted-foreground">{name}</span>
                    <div
                      className="grid gap-px bg-muted/50 p-1 rounded"
                      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                    >
                      {pattern.map((v, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-sm ${
                            v === 1 ? "bg-purple-500/70" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Convergence info */}
            {currentResult && (
              <div className="p-3 bg-muted/20 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Converged:</span>
                  <span className={currentResult.converged ? "text-green-400" : "text-amber-400"}>
                    {currentResult.converged ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">Final Energy:</span>
                  <span className="font-mono">{currentResult.final_energy.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
