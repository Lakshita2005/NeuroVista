"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { 
  Brain,
  Clock,
  Moon,
  Zap,
  Gauge,
  Send,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Database,
  ArrowRight,
  Trash2,
  DoorOpen,
  DoorClosed,
  TrendingUp,
  TrendingDown
} from "lucide-react"

interface PredictionStep {
  day: number
  studyHours: number
  sleepHours: number
  stressLevel: number
  forgetGate: number
  inputGate: number
  cellState: number
  hiddenState: number
  productivityScore: number
  burnoutRisk: number
  explanation: string
}

// Common word patterns for next word prediction
const WORD_PATTERNS: Record<string, string[]> = {
  "the": ["cat", "dog", "quick", "lazy", "fox", "moon", "sun", "weather", "stock", "market"],
  "a": ["cat", "dog", "quick", "lazy", "person", "man", "woman", "student", "good", "bad"],
  "i": ["am", "think", "feel", "went", "will", "can", "have", "like", "want", "need"],
  "to": ["the", "be", "have", "do", "go", "get", "make", "know", "take", "see"],
  "is": ["the", "a", "good", "bad", "great", "terrible", "amazing", "boring", "important", "difficult"],
  "and": ["the", "a", "then", "also", "it", "they", "we", "I", "you", "he"],
  "in": ["the", "a", "this", "that", "my", "your", "our", "their", "one", "two"],
  "of": ["the", "a", "my", "your", "course", "time", "life", "work", "data", "learning"],
  "it": ["is", "was", "will", "can", "should", "would", "could", "might", "seems", "looks"],
  "was": ["the", "a", "good", "bad", "great", "terrible", "amazing", "boring", "difficult", "easy"]
}

export function ProductivityPredictor() {
  // Form state
  const [studyHours, setStudyHours] = useState(7)
  const [sleepHours, setSleepHours] = useState(7)
  const [stressLevel, setStressLevel] = useState(5)
  
  // Prediction state
  const [prediction, setPrediction] = useState<PredictionStep | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  
  // Next word prediction state
  const [inputText, setInputText] = useState("")
  const [nextWordPrediction, setNextWordPrediction] = useState<{
    context: string[]
    candidates: { word: string; score: number }[]
    selectedWord: string
  } | null>(null)

  const calculatePrediction = useCallback(() => {
    setIsPredicting(true)
    
    // Simulate LSTM processing delay
    setTimeout(() => {
      // Simulate LSTM gate calculations
      const forgetGate = Math.min(1, Math.max(0.1, sleepHours / 10))
      const inputGate = Math.min(1, Math.max(0.1, studyHours / 10))
      const outputGate = Math.min(1, Math.max(0.1, 1 - stressLevel / 15))
      
      // Simulate cell state update
      const prevCellState = 0.5
      const candidate = (studyHours - 5) / 5
      const cellState = prevCellState * forgetGate + candidate * inputGate
      
      // Calculate hidden state (output)
      const hiddenState = Math.tanh(cellState) * outputGate
      
      // Calculate productivity score based on simulated LSTM output
      const studyFactor = Math.min(1, studyHours / 8) * 40
      const sleepFactor = Math.min(1, sleepHours / 8) * 30
      const stressPenalty = (stressLevel / 10) * 25
      const productivityScore = Math.max(20, Math.min(100, studyFactor + sleepFactor - stressPenalty + (hiddenState * 20)))
      
      // Calculate burnout risk
      const sleepDebt = Math.max(0, 7 - sleepHours)
      const burnoutRisk = Math.min(100, (stressLevel > 6 ? 30 : 0) + sleepDebt * 15 + (studyHours > 9 ? 20 : 0) - (hiddenState * 10))
      
      const result: PredictionStep = {
        day: 1,
        studyHours,
        sleepHours,
        stressLevel,
        forgetGate,
        inputGate,
        cellState,
        hiddenState,
        productivityScore,
        burnoutRisk,
        explanation: generateExplanation(studyHours, sleepHours, stressLevel, forgetGate, inputGate)
      }
      
      setPrediction(result)
      setIsPredicting(false)
    }, 800)
  }, [studyHours, sleepHours, stressLevel])

  const generateExplanation = (study: number, sleep: number, stress: number, forget: number, input: number): string => {
    let explanation = "LSTM Analysis:\n\n"
    
    explanation += `• Forget Gate: ${(forget * 100).toFixed(0)}% - `
    if (sleep >= 7) explanation += "Good sleep means we retain most context.\n"
    else explanation += "Poor sleep means we forget more context.\n"
    
    explanation += `• Input Gate: ${(input * 100).toFixed(0)}% - `
    if (study >= 6) explanation += "High study time means more new information added.\n"
    else explanation += "Less study time means minimal new information.\n"
    
    explanation += `• Stress Impact: ${stress}/10 - `
    if (stress >= 7) explanation += "High stress significantly reduces productivity."
    else if (stress >= 4) explanation += "Moderate stress has manageable impact."
    else explanation += "Low stress allows optimal performance."
    
    return explanation
  }

  const predictNextWord = () => {
    const words = inputText.toLowerCase().trim().split(/\s+/)
    const lastWord = words[words.length - 1] || ""
    
    // Get candidates based on last word
    const candidates = WORD_PATTERNS[lastWord] || ["the", "a", "is", "and", "to"]
    
    // Simulate attention scores (how much each previous word matters)
    const context = words.slice(-3)
    
    // Score candidates (simulated LSTM output probabilities)
    const scoredCandidates = candidates.map((word, i) => ({
      word,
      score: Math.max(0.1, 0.9 - i * 0.15 + Math.random() * 0.2)
    })).sort((a, b) => b.score - a.score).slice(0, 5)
    
    setNextWordPrediction({
      context,
      candidates: scoredCandidates,
      selectedWord: scoredCandidates[0]?.word || "..."
    })
  }

  const reset = () => {
    setPrediction(null)
    setStudyHours(7)
    setSleepHours(7)
    setStressLevel(5)
  }

  return (
    <div className="space-y-6">
      {/* Next Word Predictor - NEW FEATURE */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Next Word Prediction Simulator
          </CardTitle>
          <CardDescription>
            See how LSTM uses context to predict the next word
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a sentence (e.g., 'The cat sat on the...')"
              onKeyDown={(e) => e.key === 'Enter' && predictNextWord()}
              className="flex-1"
            />
            <Button onClick={predictNextWord} className="gap-2">
              <Send className="w-4 h-4" />
              Predict
            </Button>
          </div>

          {nextWordPrediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Context */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Context (Recent Words):</p>
                <div className="flex gap-2">
                  {nextWordPrediction.context.map((word, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm"
                    >
                      {word}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Prediction Candidates */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">LSTM Output Probabilities:</p>
                <div className="space-y-2">
                  {nextWordPrediction.candidates.map((candidate, i) => (
                    <motion.div
                      key={candidate.word}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        i === 0 ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-800/30'
                      }`}
                    >
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      <span className={`font-medium ${i === 0 ? 'text-emerald-400' : ''}`}>
                        {candidate.word}
                      </span>
                      <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${i === 0 ? 'bg-emerald-500' : 'bg-slate-600'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${candidate.score * 100}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs font-mono w-12 text-right">
                        {(candidate.score * 100).toFixed(0)}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Selected Word */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted Next Word:</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {nextWordPrediction.selectedWord}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Input Sliders */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Daily Metrics Input
          </CardTitle>
          <CardDescription>
            Adjust values to see how LSTM would process and predict outcomes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Study Hours */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="study" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Study Hours
              </Label>
              <span className="text-sm text-muted-foreground">{studyHours}h</span>
            </div>
            <Slider
              id="study"
              value={[studyHours]}
              onValueChange={(v) => setStudyHours(v[0])}
              min={0}
              max={14}
              step={0.5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>7h (optimal)</span>
              <span>14h</span>
            </div>
          </div>

          {/* Sleep Hours */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="sleep" className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" />
                Sleep Hours
              </Label>
              <span className="text-sm text-muted-foreground">{sleepHours}h</span>
            </div>
            <Slider
              id="sleep"
              value={[sleepHours]}
              onValueChange={(v) => setSleepHours(v[0])}
              min={0}
              max={12}
              step={0.5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>7-9h (optimal)</span>
              <span>12h</span>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="stress" className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                Stress Level
              </Label>
              <span className="text-sm text-muted-foreground">{stressLevel}/10</span>
            </div>
            <Slider
              id="stress"
              value={[stressLevel]}
              onValueChange={(v) => setStressLevel(v[0])}
              min={0}
              max={10}
              step={0.5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Moderate</span>
              <span>Critical</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculatePrediction} className="flex-1 gap-2">
              <Brain className="w-4 h-4" />
              Simulate LSTM Prediction
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Gate Visualization */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">LSTM Gate Values</CardTitle>
              <CardDescription>How the gates processed your input</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Forget Gate */}
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Forget Gate</span>
                  <span className="text-lg font-mono text-red-400 ml-auto">
                    {prediction.forgetGate.toFixed(2)}
                  </span>
                </div>
                <Progress value={prediction.forgetGate * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Keeping {(prediction.forgetGate * 100).toFixed(0)}% of previous context
                </p>
              </div>

              {/* Input Gate */}
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DoorOpen className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Input Gate</span>
                  <span className="text-lg font-mono text-green-400 ml-auto">
                    {prediction.inputGate.toFixed(2)}
                  </span>
                </div>
                <Progress value={prediction.inputGate * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Adding {(prediction.inputGate * 100).toFixed(0)}% of new information
                </p>
              </div>

              {/* Cell State */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">Cell State</span>
                  <span className="text-lg font-mono text-amber-400 ml-auto">
                    {prediction.cellState.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(prediction.cellState + 1) * 50}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated long-term memory
                </p>
              </div>

              {/* Hidden State */}
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DoorClosed className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">Hidden State</span>
                  <span className="text-lg font-mono text-purple-400 ml-auto">
                    {prediction.hiddenState.toFixed(2)}
                  </span>
                </div>
                <Progress value={(prediction.hiddenState + 1) * 50} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Output to next layer/prediction
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Results */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">Prediction Results</CardTitle>
              <CardDescription>Final LSTM output based on your inputs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Productivity Score */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`p-4 rounded-lg border ${
                  prediction.productivityScore >= 70
                    ? 'bg-green-500/10 border-green-500/30'
                    : prediction.productivityScore >= 40
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className={`w-5 h-5 ${
                    prediction.productivityScore >= 70 ? 'text-green-400' :
                    prediction.productivityScore >= 40 ? 'text-amber-400' : 'text-red-400'
                  }`} />
                  <span className="text-sm text-muted-foreground">Predicted Productivity</span>
                </div>
                <p className={`text-4xl font-bold ${
                  prediction.productivityScore >= 70 ? 'text-green-400' :
                  prediction.productivityScore >= 40 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {prediction.productivityScore.toFixed(0)}%
                </p>
                <Progress 
                  value={prediction.productivityScore} 
                  className="mt-3 h-2"
                />
              </motion.div>

              {/* Burnout Risk */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-lg border ${
                  prediction.burnoutRisk < 40
                    ? 'bg-green-500/10 border-green-500/30'
                    : prediction.burnoutRisk < 70
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    prediction.burnoutRisk < 40 ? 'text-green-400' :
                    prediction.burnoutRisk < 70 ? 'text-amber-400' : 'text-red-400'
                  }`} />
                  <span className="text-sm text-muted-foreground">Burnout Risk</span>
                </div>
                <p className={`text-4xl font-bold ${
                  prediction.burnoutRisk < 40 ? 'text-green-400' :
                  prediction.burnoutRisk < 70 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {prediction.burnoutRisk.toFixed(0)}%
                </p>
                <Progress 
                  value={prediction.burnoutRisk} 
                  className="mt-3 h-2"
                />
              </motion.div>

              {/* Explanation */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                  {prediction.explanation}
                </pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Info Card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-6">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">About This Simulator</p>
              <p className="text-xs text-muted-foreground">
                This educational simulator demonstrates how an LSTM would process daily metrics to predict 
                productivity and burnout risk. The gate values are calculated based on input patterns, showing 
                how LSTMs make decisions about what to remember and forget. No actual machine learning model 
                is running - this is a visualization of the LSTM architecture and principles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
