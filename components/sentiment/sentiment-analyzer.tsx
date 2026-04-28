"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, RotateCcw, TrendingUp, TrendingDown, Minus } from "lucide-react"

// Emotion categories
const EMOTIONS = [
  { name: "Joy", color: "bg-yellow-500", textColor: "text-yellow-400" },
  { name: "Sadness", color: "bg-blue-500", textColor: "text-blue-400" },
  { name: "Anger", color: "bg-red-500", textColor: "text-red-400" },
  { name: "Fear", color: "bg-purple-500", textColor: "text-purple-400" },
  { name: "Surprise", color: "bg-orange-500", textColor: "text-orange-400" },
  { name: "Disgust", color: "bg-green-500", textColor: "text-green-400" }
]

interface AnalysisResult {
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  emotions: { name: string; score: number }[]
  keywords: { word: string; sentiment: "positive" | "negative" | "neutral"; score: number }[]
  attentionWeights: { word: string; weight: number }[]
}

// Simple keyword-based analysis for demo
function analyzeText(text: string): AnalysisResult {
  const words = text.toLowerCase().split(/\s+/)
  
  const positiveWords = ["love", "great", "amazing", "wonderful", "excellent", "happy", "good", "best", "beautiful", "fantastic", "awesome", "enjoy", "perfect", "brilliant"]
  const negativeWords = ["hate", "terrible", "awful", "bad", "worst", "horrible", "sad", "angry", "disappointed", "poor", "ugly", "boring", "waste", "annoying"]
  
  let positiveScore = 0
  let negativeScore = 0
  
  const keywords: { word: string; sentiment: "positive" | "negative" | "neutral"; score: number }[] = []
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "")
    if (positiveWords.includes(cleanWord)) {
      positiveScore++
      keywords.push({ word: cleanWord, sentiment: "positive", score: 0.8 + Math.random() * 0.2 })
    } else if (negativeWords.includes(cleanWord)) {
      negativeScore++
      keywords.push({ word: cleanWord, sentiment: "negative", score: 0.8 + Math.random() * 0.2 })
    }
  })
  
  const total = positiveScore + negativeScore
  let sentiment: "positive" | "negative" | "neutral"
  let confidence: number
  
  if (total === 0) {
    sentiment = "neutral"
    confidence = 0.5 + Math.random() * 0.2
  } else if (positiveScore > negativeScore) {
    sentiment = "positive"
    confidence = 0.6 + (positiveScore / total) * 0.35
  } else if (negativeScore > positiveScore) {
    sentiment = "negative"
    confidence = 0.6 + (negativeScore / total) * 0.35
  } else {
    sentiment = "neutral"
    confidence = 0.5 + Math.random() * 0.1
  }
  
  // Generate emotion scores
  const emotions = EMOTIONS.map(e => ({
    name: e.name,
    score: Math.random() * 0.5 + (
      (e.name === "Joy" && sentiment === "positive") ||
      (e.name === "Sadness" && sentiment === "negative") ||
      (e.name === "Anger" && sentiment === "negative")
        ? 0.3 : 0
    )
  })).sort((a, b) => b.score - a.score)
  
  // Generate attention weights
  const attentionWeights = words.slice(0, 20).map(word => ({
    word: word.replace(/[^a-z]/g, "") || word,
    weight: positiveWords.includes(word) || negativeWords.includes(word) 
      ? 0.7 + Math.random() * 0.3 
      : 0.1 + Math.random() * 0.3
  }))
  
  return {
    sentiment,
    confidence,
    emotions,
    keywords,
    attentionWeights
  }
}

const SAMPLE_TEXTS = [
  "I absolutely love this product! It exceeded all my expectations and the quality is amazing. Best purchase I've made this year!",
  "Terrible experience. The service was awful and I'm extremely disappointed. Would not recommend to anyone.",
  "The movie was okay. It had some good moments but also some boring parts. Not sure if I would watch it again.",
  "This restaurant has the most delicious food I've ever tasted! The staff was friendly and the atmosphere was perfect."
]

export function SentimentAnalyzer() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyze = useCallback(async () => {
    if (!text.trim()) return
    
    setIsAnalyzing(true)
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const analysis = analyzeText(text)
    setResult(analysis)
    setIsAnalyzing(false)
  }, [text])

  const loadSample = (sample: string) => {
    setText(sample)
    setResult(null)
  }

  const reset = () => {
    setText("")
    setResult(null)
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="w-5 h-5" />
      case "negative": return <TrendingDown className="w-5 h-5" />
      default: return <Minus className="w-5 h-5" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-400 bg-green-500/20"
      case "negative": return "text-red-400 bg-red-500/20"
      default: return "text-gray-400 bg-gray-500/20"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            Text Input
          </CardTitle>
          <CardDescription>
            Enter text to analyze sentiment and emotions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] bg-muted/30"
          />
          
          {/* Sample texts */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or try a sample:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TEXTS.map((sample, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample(sample)}
                  className="text-xs"
                >
                  Sample {i + 1}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex gap-2">
            <Button onClick={analyze} disabled={!text.trim() || isAnalyzing}>
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-12"
              >
                <motion.div
                  className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-4 text-muted-foreground">Processing text...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Overall sentiment */}
                <div className={`p-4 rounded-lg ${getSentimentColor(result.sentiment)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(result.sentiment)}
                      <span className="text-xl font-bold capitalize">{result.sentiment}</span>
                    </div>
                    <span className="text-lg font-mono">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Emotions */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Detected Emotions</p>
                  {result.emotions.slice(0, 4).map((emotion, i) => {
                    const emotionData = EMOTIONS.find(e => e.name === emotion.name)
                    return (
                      <div key={emotion.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className={emotionData?.textColor}>{emotion.name}</span>
                          <span>{(emotion.score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={emotionData?.color || "bg-gray-500"}
                            initial={{ width: 0 }}
                            animate={{ width: `${emotion.score * 100}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            style={{ height: "100%" }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Keywords */}
                {result.keywords.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Sentiment Words</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((kw, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className={kw.sentiment === "positive" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-red-500/20 text-red-400"}
                        >
                          {kw.word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter text to see analysis results</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Attention Visualization */}
      {result && (
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Attention Weights Visualization</CardTitle>
            <CardDescription>
              Word importance as determined by the attention mechanism
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {result.attentionWeights.map((item, i) => (
                <motion.span
                  key={i}
                  className="px-2 py-1 rounded"
                  style={{
                    backgroundColor: `rgba(34, 211, 238, ${item.weight * 0.5})`,
                    color: item.weight > 0.5 ? "white" : "inherit"
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  title={`Attention: ${(item.weight * 100).toFixed(1)}%`}
                >
                  {item.word}
                </motion.span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Higher opacity indicates stronger attention weight. The model focuses more on these words when determining sentiment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
