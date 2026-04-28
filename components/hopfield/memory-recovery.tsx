"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, RotateCcw, Upload, Sparkles, ArrowRight } from "lucide-react"

// 8x8 letter patterns
const LETTER_PATTERNS: { [key: string]: number[] } = {
  A: [
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 1, 0, 0, 0, 0, 1, 0,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
  ].map(v => v === 1 ? 1 : -1),
  B: [
    1, 1, 1, 1, 1, 1, 0, 0,
    1, 0, 0, 0, 0, 0, 1, 0,
    1, 0, 0, 0, 0, 0, 1, 0,
    1, 1, 1, 1, 1, 1, 0, 0,
    1, 0, 0, 0, 0, 0, 1, 0,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 0,
  ].map(v => v === 1 ? 1 : -1),
  C: [
    0, 0, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 0, 0, 1,
    0, 0, 1, 1, 1, 1, 1, 0,
  ].map(v => v === 1 ? 1 : -1),
  H: [
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
  ].map(v => v === 1 ? 1 : -1),
}

// Hopfield Network for 64 neurons
class HopfieldNetwork64 {
  size: number = 64
  weights: number[][] = []
  
  constructor() {
    this.weights = Array(64).fill(null).map(() => Array(64).fill(0))
  }
  
  train(patterns: number[][]) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (i === j) continue
        let sum = 0
        for (const pattern of patterns) {
          sum += pattern[i] * pattern[j]
        }
        this.weights[i][j] = sum / patterns.length
      }
    }
  }
  
  updateAsync(state: number[]): number[] {
    const newState = [...state]
    const i = Math.floor(Math.random() * this.size)
    let sum = 0
    for (let j = 0; j < this.size; j++) {
      sum += this.weights[i][j] * state[j]
    }
    newState[i] = sum >= 0 ? 1 : -1
    return newState
  }
  
  energy(state: number[]): number {
    let E = 0
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        E -= this.weights[i][j] * state[i] * state[j]
      }
    }
    return E / 2
  }
}

export function MemoryRecovery() {
  const [network] = useState(() => {
    const net = new HopfieldNetwork64()
    net.train(Object.values(LETTER_PATTERNS))
    return net
  })
  
  const [originalPattern, setOriginalPattern] = useState<number[]>(LETTER_PATTERNS.A)
  const [noisyPattern, setNoisyPattern] = useState<number[]>([])
  const [currentState, setCurrentState] = useState<number[]>([])
  const [noiseLevel, setNoiseLevel] = useState(25)
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoverySteps, setRecoverySteps] = useState<number[][]>([])
  const [similarity, setSimilarity] = useState(0)
  const animationRef = useRef<number>()

  const selectPattern = (letter: string) => {
    setOriginalPattern(LETTER_PATTERNS[letter])
    setNoisyPattern([])
    setCurrentState([])
    setRecoverySteps([])
  }

  const addNoise = useCallback(() => {
    const noisy = [...originalPattern]
    const numFlips = Math.floor((noiseLevel / 100) * 64)
    const indices = Array.from({ length: 64 }, (_, i) => i)
    
    for (let i = 0; i < numFlips; i++) {
      const randIdx = Math.floor(Math.random() * indices.length)
      const idx = indices[randIdx]
      noisy[idx] = -noisy[idx]
      indices.splice(randIdx, 1)
    }
    
    setNoisyPattern(noisy)
    setCurrentState(noisy)
    setRecoverySteps([noisy])
    setSimilarity(calculateSimilarity(noisy, originalPattern))
  }, [originalPattern, noiseLevel])

  const calculateSimilarity = (a: number[], b: number[]) => {
    let matches = 0
    for (let i = 0; i < a.length; i++) {
      if (a[i] === b[i]) matches++
    }
    return (matches / a.length) * 100
  }

  const startRecovery = useCallback(async () => {
    if (currentState.length === 0) return
    
    setIsRecovering(true)
    let state = [...currentState]
    const steps: number[][] = [[...state]]
    
    for (let i = 0; i < 200; i++) {
      await new Promise(resolve => setTimeout(resolve, 30))
      state = network.updateAsync(state)
      
      if (i % 5 === 0) {
        steps.push([...state])
        setCurrentState([...state])
        setRecoverySteps([...steps])
        setSimilarity(calculateSimilarity(state, originalPattern))
      }
    }
    
    setIsRecovering(false)
  }, [currentState, network, originalPattern])

  const reset = () => {
    setNoisyPattern([])
    setCurrentState([])
    setRecoverySteps([])
    setSimilarity(0)
  }

  const PatternGrid = ({ pattern, label, highlight = false }: { 
    pattern: number[], 
    label: string,
    highlight?: boolean 
  }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div 
        className={`grid gap-px p-2 rounded-lg ${highlight ? "bg-purple-500/20 ring-2 ring-purple-500" : "bg-muted/30"}`}
        style={{ gridTemplateColumns: "repeat(8, 1fr)" }}
      >
        {pattern.map((v, i) => (
          <motion.div
            key={i}
            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm ${
              v === 1 ? "bg-purple-400" : "bg-muted/50"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.005 }}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Pattern Selection */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Memory Recovery Demo
          </CardTitle>
          <CardDescription>
            Watch the network recover corrupted patterns from stored memories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pattern selector */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Select a stored pattern:</p>
            <div className="flex flex-wrap gap-3">
              {Object.keys(LETTER_PATTERNS).map(letter => (
                <Button
                  key={letter}
                  variant={originalPattern === LETTER_PATTERNS[letter] ? "default" : "outline"}
                  onClick={() => selectPattern(letter)}
                  disabled={isRecovering}
                  className="w-12 h-12 text-lg font-bold"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>

          {/* Noise control */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Corruption Level</span>
              <span className="text-foreground">{noiseLevel}%</span>
            </div>
            <Slider
              value={[noiseLevel]}
              onValueChange={([v]) => setNoiseLevel(v)}
              min={10}
              max={40}
              step={5}
              disabled={isRecovering}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={addNoise} disabled={isRecovering}>
              <Upload className="w-4 h-4 mr-2" />
              Corrupt Pattern
            </Button>
            <Button 
              onClick={startRecovery} 
              disabled={isRecovering || currentState.length === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              {isRecovering ? "Recovering..." : "Recover"}
            </Button>
            <Button variant="outline" onClick={reset} disabled={isRecovering}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recovery Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
            {/* Original */}
            <PatternGrid pattern={originalPattern} label="Original" highlight />
            
            {noisyPattern.length > 0 && (
              <>
                <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 lg:rotate-0" />
                <PatternGrid pattern={noisyPattern} label="Corrupted" />
              </>
            )}
            
            {currentState.length > 0 && currentState !== noisyPattern && (
              <>
                <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 lg:rotate-0" />
                <PatternGrid pattern={currentState} label="Recovered" highlight={similarity > 90} />
              </>
            )}
          </div>

          {/* Similarity meter */}
          {currentState.length > 0 && (
            <div className="mt-8 max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Similarity to Original</span>
                <span className={similarity > 90 ? "text-green-400" : "text-foreground"}>
                  {similarity.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    similarity > 90 ? "bg-green-500" : 
                    similarity > 70 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${similarity}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Empty state */}
          {noisyPattern.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Select a pattern and click &quot;Corrupt Pattern&quot; to begin
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>How Memory Recovery Works</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">1. Pattern Storage</h4>
              <p className="text-sm text-muted-foreground">
                The network learns patterns using Hebbian learning: neurons that fire together, wire together. 
                Connection strengths encode the stored memories.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="text-cyan-400 font-medium mb-2">2. Energy Minimization</h4>
              <p className="text-sm text-muted-foreground">
                When given a corrupted input, the network iteratively updates neurons to minimize its 
                energy function, naturally converging to the nearest stored pattern.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">3. Content-Addressable</h4>
              <p className="text-sm text-muted-foreground">
                Unlike traditional memory that uses addresses, Hopfield networks retrieve memories 
                based on content similarity - partial info retrieves the full pattern.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
