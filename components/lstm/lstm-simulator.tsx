"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Send,
  Brain,
  Database,
  Trash2,
  DoorOpen,
  ArrowRight,
  Lightbulb,
  Sparkles
} from "lucide-react"

interface WordState {
  word: string
  embedding: number[] // Simplified word embedding (3 values for visualization)
  forgetGate: number
  inputGate: number
  candidateValue: number
  outputGate: number
  cellState: number
  hiddenState: number
  attention: number[] // Which previous words matter
  explanation: string
}

// Predefined example sentences with context
const EXAMPLE_SENTENCES = [
  {
    text: "The cat sat on the mat",
    context: "Simple spatial relationship"
  },
  {
    text: "I went to the bank to withdraw money",
    context: "Financial bank (not river bank)"
  },
  {
    text: "The movie was boring but the ending was amazing",
    context: "Changing sentiment over time"
  },
  {
    text: "She studied for hours and passed the exam",
    context: "Cause and effect relationship"
  }
]

// Simulate word embeddings (simplified for visualization)
function generateWordEmbedding(word: string): number[] {
  const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return [
    Math.sin(hash * 0.1) * 0.5 + 0.5, // Subject/Object relation
    Math.cos(hash * 0.15) * 0.5 + 0.5, // Action/State
    Math.sin(hash * 0.2) * 0.5 + 0.5,  // Sentiment
  ]
}

// Simulate LSTM processing for a word
function processWordLSTM(
  word: string,
  prevCellState: number,
  prevHiddenState: number,
  wordIndex: number,
  sentence: string[]
): WordState {
  const embedding = generateWordEmbedding(word)
  
  // Simulate gate values based on word characteristics
  const isNoun = ['cat', 'mat', 'bank', 'money', 'movie', 'ending', 'exam'].some(n => word.toLowerCase().includes(n))
  const isVerb = ['sat', 'went', 'withdraw', 'was', 'studied', 'passed'].some(v => word.toLowerCase().includes(v))
  const isImportant = ['money', 'amazing', 'passed', 'boring'].some(i => word.toLowerCase().includes(i))
  
  // Calculate gates (simulated)
  const forgetGate = isImportant ? 0.8 : (isVerb ? 0.4 : 0.2)
  const inputGate = isNoun ? 0.9 : (isImportant ? 0.8 : 0.5)
  const candidateValue = embedding[0] * 0.5 + embedding[1] * 0.3 - 0.4
  const outputGate = isImportant ? 0.9 : 0.6
  
  // Update cell state
  const cellState = prevCellState * forgetGate + candidateValue * inputGate
  const hiddenState = Math.tanh(cellState) * outputGate
  
  // Generate attention weights (which previous words matter)
  const attention = sentence.slice(0, wordIndex).map((_, i) => {
    const distance = wordIndex - i
    return isImportant && distance <= 2 ? 0.7 / distance : 0.1 / distance
  })
  
  // Generate explanation
  let explanation = ""
  if (wordIndex === 0) {
    explanation = `Processing "${word}" - Initializing memory with first word`
  } else if (isImportant) {
    explanation = `"${word}" is important! High input gate (${(inputGate * 100).toFixed(0)}%) adds it to memory. Keeping ${(forgetGate * 100).toFixed(0)}% of previous context.`
  } else if (isNoun) {
    explanation = `"${word}" is a noun. Strong memory update (${(inputGate * 100).toFixed(0)}%) for subject/object tracking.`
  } else if (isVerb) {
    explanation = `"${word}" is a verb. Moderate memory retention (${(forgetGate * 100).toFixed(0)}%) while updating action state.`
  } else {
    explanation = `Processing "${word}" - Functional word with ${(forgetGate * 100).toFixed(0)}% context retention.`
  }
  
  return {
    word,
    embedding,
    forgetGate,
    inputGate,
    candidateValue,
    outputGate,
    cellState,
    hiddenState,
    attention,
    explanation
  }
}

export function LSTMSimulator() {
  const [inputText, setInputText] = useState("")
  const [words, setWords] = useState<WordState[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const processSentence = useCallback((text: string) => {
    const wordList = text.toLowerCase().split(/\s+/).filter(w => w.length > 0)
    const processed: WordState[] = []
    let prevCellState = 0
    let prevHiddenState = 0
    
    wordList.forEach((word, index) => {
      const state = processWordLSTM(word, prevCellState, prevHiddenState, index, wordList)
      processed.push(state)
      prevCellState = state.cellState
      prevHiddenState = state.hiddenState
    })
    
    setWords(processed)
    setCurrentIndex(0)
    setIsComplete(false)
  }, [])

  const handleSubmit = () => {
    if (inputText.trim()) {
      processSentence(inputText)
      setIsPlaying(false)
    }
  }

  const handleExample = (text: string) => {
    setInputText(text)
    processSentence(text)
    setIsPlaying(false)
  }

  const reset = () => {
    setCurrentIndex(0)
    setIsPlaying(false)
    setIsComplete(false)
  }

  // Auto-play animation
  useEffect(() => {
    if (isPlaying && words.length > 0 && currentIndex < words.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => {
          if (prev >= words.length - 1) {
            setIsPlaying(false)
            setIsComplete(true)
            return prev
          }
          return prev + 1
        })
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentIndex, words.length])

  const currentWord = words[currentIndex]
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-pink-400" />
            Sentence Input
          </CardTitle>
          <CardDescription>
            Enter a sentence to see how LSTM processes it word by word
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a sentence..."
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="flex-1"
            />
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="w-4 h-4" />
              Process
            </Button>
          </div>
          
          {/* Example sentences */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Examples:</span>
            {EXAMPLE_SENTENCES.map((example) => (
              <button
                key={example.text}
                onClick={() => handleExample(example.text)}
                className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full transition-colors text-muted-foreground"
              >
                {example.text}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {words.length > 0 && (
        <>
          {/* Word Timeline */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Word Processing Timeline</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
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
              <Progress value={progress} className="mt-2" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {words.map((word, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      setIsPlaying(false)
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      index === currentIndex
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                        : index < currentIndex
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    animate={index === currentIndex ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {word.word}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Word Processing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Word Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Processing: "{currentWord?.word}"
                </CardTitle>
                <CardDescription>
                  {currentWord?.explanation}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Word Embedding Visualization */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Word Embedding (simplified)</label>
                  <div className="flex gap-2">
                    {currentWord?.embedding.map((val, i) => (
                      <div key={i} className="flex-1">
                        <div className="h-24 bg-slate-800 rounded-lg overflow-hidden relative">
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-400"
                            initial={{ height: 0 }}
                            animate={{ height: `${val * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-1">
                          {i === 0 ? 'Entity' : i === 1 ? 'Action' : 'Sentiment'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gate Values */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400">Forget Gate</span>
                    </div>
                    <p className="text-xl font-mono font-bold text-red-400">
                      {currentWord?.forgetGate.toFixed(2)}
                    </p>
                    <Progress value={currentWord?.forgetGate * 100} className="mt-2 h-1.5" />
                  </div>

                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DoorOpen className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">Input Gate</span>
                    </div>
                    <p className="text-xl font-mono font-bold text-green-400">
                      {currentWord?.inputGate.toFixed(2)}
                    </p>
                    <Progress value={currentWord?.inputGate * 100} className="mt-2 h-1.5" />
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-400">Output Gate</span>
                    </div>
                    <p className="text-xl font-mono font-bold text-blue-400">
                      {currentWord?.outputGate.toFixed(2)}
                    </p>
                    <Progress value={currentWord?.outputGate * 100} className="mt-2 h-1.5" />
                  </div>

                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-purple-400">Cell State</span>
                    </div>
                    <p className="text-xl font-mono font-bold text-purple-400">
                      {currentWord?.cellState.toFixed(2)}
                    </p>
                    <div className="mt-2 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentWord?.cellState + 1) * 50}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Memory Timeline */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  Memory Evolution
                </CardTitle>
                <CardDescription>
                  How the cell state changes across words
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {words.slice(0, currentIndex + 1).map((word, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        index === currentIndex 
                          ? 'bg-pink-500/10 border border-pink-500/30' 
                          : 'bg-muted/30'
                      }`}
                    >
                      <span className="text-xs text-muted-foreground w-6">{index + 1}</span>
                      <span className="font-medium w-20">{word.word}</span>
                      
                      {/* Memory visualization */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-8 bg-slate-800 rounded-full overflow-hidden relative">
                          {/* Cell state bar */}
                          <motion.div
                            className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-500 to-amber-400"
                            initial={{ left: '50%', right: '50%' }}
                            animate={{ 
                              left: `${50 - Math.abs(word.cellState) * 25}%`,
                              right: `${50 - Math.abs(word.cellState) * 25}%`
                            }}
                            style={{
                              opacity: 0.3 + Math.abs(word.cellState) * 0.7
                            }}
                          />
                          {/* Center marker */}
                          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-600" />
                        </div>
                        <span className="text-xs font-mono w-12 text-right">
                          {word.cellState.toFixed(2)}
                        </span>
                      </div>

                      {/* Attention indicator */}
                      <div className="flex gap-0.5">
                        {word.attention.slice(-3).map((att, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-6 rounded-full"
                            style={{
                              backgroundColor: att > 0.3 ? '#f472b6' : '#475569',
                              opacity: 0.3 + att
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Memory Summary */}
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Processing Complete</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Final cell state: <span className="text-amber-400 font-mono">{words[words.length - 1]?.cellState.toFixed(3)}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Final hidden state: <span className="text-purple-400 font-mono">{words[words.length - 1]?.hiddenState.toFixed(3)}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          The LSTM has processed all words, maintaining important context through its gates.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Attention Visualization */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">Attention Pattern</CardTitle>
              <CardDescription>
                Which previous words influence the current understanding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-1">
                {words.slice(0, currentIndex + 1).map((word, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <motion.div
                      className={`w-16 h-16 rounded-lg flex items-center justify-center text-sm font-medium ${
                        index === currentIndex
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                      animate={index === currentIndex ? { scale: [1, 1.05, 1] } : {}}
                    >
                      {word.word}
                    </motion.div>
                    {index < currentIndex && (
                      <div className="flex flex-col items-center gap-0.5">
                        <div 
                          className="w-0.5 bg-gradient-to-b from-pink-500 to-transparent"
                          style={{ height: `${word.attention[currentIndex - 1] * 40 || 5}px` }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {(word.attention[currentIndex - 1] || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
