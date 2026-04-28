"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Sparkles, RotateCcw, Star, ThumbsUp, ThumbsDown, Minus } from "lucide-react"

// Aspect categories
const ASPECTS = [
  "Quality", "Price", "Service", "Design", "Performance", "Reliability", "Ease of Use", "Features"
]

interface AspectResult {
  aspect: string
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  keywords: string[]
}

interface AnalysisResult {
  overall: "positive" | "negative" | "neutral"
  confidence: number
  aspects: AspectResult[]
}

// Simple aspect-based sentiment analysis
function analyzeAspects(text: string): AnalysisResult {
  const words = text.toLowerCase().split(/\s+/)
  
  const aspectKeywords: { [key: string]: { positive: string[], negative: string[] } } = {
    "Quality": {
      positive: ["quality", "high-quality", "premium", "durable", "excellent"],
      negative: ["cheap", "flimsy", "poor", "low-quality", "fragile"]
    },
    "Price": {
      positive: ["affordable", "cheap", "value", "worth", "reasonable"],
      negative: ["expensive", "overpriced", "costly", "pricey", "steep"]
    },
    "Service": {
      positive: ["helpful", "friendly", "responsive", "supportive", "excellent"],
      negative: ["rude", "unhelpful", "slow", "terrible", "poor"]
    },
    "Design": {
      positive: ["beautiful", "elegant", "sleek", "modern", "stylish"],
      negative: ["ugly", "outdated", "clunky", "boring", "plain"]
    },
    "Performance": {
      positive: ["fast", "powerful", "efficient", "smooth", "responsive"],
      negative: ["slow", "laggy", "unresponsive", "sluggish", "weak"]
    },
    "Reliability": {
      positive: ["reliable", "stable", "consistent", "dependable", "trustworthy"],
      negative: ["unreliable", "unstable", "buggy", "glitchy", "inconsistent"]
    },
    "Ease of Use": {
      positive: ["easy", "intuitive", "user-friendly", "simple", "straightforward"],
      negative: ["difficult", "complicated", "confusing", "complex", "hard"]
    },
    "Features": {
      positive: ["feature-rich", "versatile", "comprehensive", "packed", "loaded"],
      negative: ["basic", "limited", "missing", "lacking", "sparse"]
    }
  }
  
  const aspects: AspectResult[] = []
  let positiveCount = 0
  let negativeCount = 0
  
  for (const [aspect, keywords] of Object.entries(aspectKeywords)) {
    let posScore = 0
    let negScore = 0
    const foundKeywords: string[] = []
    
    for (const word of words) {
      if (keywords.positive.includes(word)) {
        posScore++
        if (!foundKeywords.includes(word)) foundKeywords.push(word)
      }
      if (keywords.negative.includes(word)) {
        negScore++
        if (!foundKeywords.includes(word)) foundKeywords.push(word)
      }
    }
    
    if (posScore > 0 || negScore > 0) {
      const total = posScore + negScore
      const sentiment = posScore > negScore ? "positive" : negScore > posScore ? "negative" : "neutral"
      const confidence = 0.5 + (Math.max(posScore, negScore) / total) * 0.4
      
      aspects.push({
        aspect,
        sentiment,
        confidence,
        keywords: foundKeywords.slice(0, 3)
      })
      
      if (sentiment === "positive") positiveCount++
      else if (sentiment === "negative") negativeCount++
    }
  }
  
  const totalAspects = aspects.length
  const overall = positiveCount > negativeCount ? "positive" : 
                  negativeCount > positiveCount ? "negative" : "neutral"
  
  return {
    overall,
    confidence: 0.6 + Math.random() * 0.2,
    aspects: aspects.sort((a, b) => b.confidence - a.confidence)
  }
}

const SAMPLE_REVIEWS = [
  "The product has excellent quality and beautiful design, but it's a bit expensive. The service was very helpful though!",
  "Great performance and easy to use, but lacks some important features. Still worth the price.",
  "Terrible reliability - keeps crashing. Customer service was unhelpful. Would not recommend.",
  "Sleek design and affordable price, but the quality feels cheap. Good value for money overall."
]

export function AspectAnalysis() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyze = useCallback(async () => {
    if (!text.trim()) return
    
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const analysis = analyzeAspects(text)
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
      case "positive": return <ThumbsUp className="w-4 h-4" />
      case "negative": return <ThumbsDown className="w-4 h-4" />
      default: return <Minus className="w-4 h-4" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-500 text-white"
      case "negative": return "bg-red-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-green-500/10 border-green-500/30"
      case "negative": return "bg-red-500/10 border-red-500/30"
      default: return "bg-gray-500/10 border-gray-500/30"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-green-400" />
            Review Input
          </CardTitle>
          <CardDescription>
            Enter a product review to analyze sentiment by aspect
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your review here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] bg-muted/30"
          />

          {/* Sample reviews */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Or try a sample:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_REVIEWS.map((sample, i) => (
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
              {isAnalyzing ? "Analyzing..." : "Analyze Aspects"}
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
            <Star className="w-5 h-5 text-yellow-400" />
            Aspect Breakdown
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
                <p className="mt-4 text-muted-foreground">Analyzing aspects...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Overall sentiment */}
                <div className={`p-4 rounded-lg border ${getSentimentBg(result.overall)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(result.overall)}
                      <span className="font-bold capitalize">{result.overall} Overall</span>
                    </div>
                    <span className="font-mono text-sm">
                      {(result.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>

                {/* Aspects */}
                <div className="space-y-3">
                  {result.aspects.map((aspect, i) => (
                    <motion.div
                      key={aspect.aspect}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{aspect.aspect}</span>
                        <Badge className={getSentimentColor(aspect.sentiment)}>
                          {aspect.sentiment}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              aspect.sentiment === "positive" ? "bg-green-500" :
                              aspect.sentiment === "negative" ? "bg-red-500" : "bg-gray-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${aspect.confidence * 100}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {(aspect.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      {aspect.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {aspect.keywords.map((kw, j) => (
                            <span key={j} className="text-xs px-2 py-0.5 bg-muted rounded">
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a review to analyze aspects</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Explanation Card */}
      <Card className="bg-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle>How Aspect-Based Analysis Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">1. Identify Aspects</h4>
              <p className="text-sm text-muted-foreground">
                The system identifies specific product aspects mentioned in the review, such as quality, price, or design.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">2. Aspect Sentiment</h4>
              <p className="text-sm text-muted-foreground">
                Each aspect is analyzed independently to determine if it's mentioned in a positive or negative context.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">3. Overall Score</h4>
              <p className="text-sm text-muted-foreground">
                The individual aspect sentiments are combined to produce an overall sentiment score for the review.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
