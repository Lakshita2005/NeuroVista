"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Camera, Sparkles, RotateCcw } from "lucide-react"

// Simulated emotion detection results
const EMOTIONS = ["Happy", "Sad", "Angry", "Surprised", "Neutral", "Fearful", "Disgusted"]

interface DetectionResult {
  emotion: string
  confidence: number
  faceBox: { x: number; y: number; width: number; height: number }
  attentionAreas: { x: number; y: number; label: string }[]
}

// Simulated CNN feature extraction visualization
function generateSimulatedResults(): DetectionResult {
  const primaryEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]
  
  return {
    emotion: primaryEmotion,
    confidence: 0.7 + Math.random() * 0.25,
    faceBox: {
      x: 0.2 + Math.random() * 0.2,
      y: 0.1 + Math.random() * 0.1,
      width: 0.4 + Math.random() * 0.2,
      height: 0.5 + Math.random() * 0.2
    },
    attentionAreas: [
      { x: 0.35, y: 0.3, label: "Eyes" },
      { x: 0.5, y: 0.5, label: "Mouth" },
      { x: 0.3, y: 0.45, label: "Eyebrows" }
    ]
  }
}

export function EmotionDetector() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [allEmotions, setAllEmotions] = useState<{ emotion: string; score: number }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setResult(null)
        setAllEmotions([])
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const analyzeImage = useCallback(async () => {
    if (!image) return
    
    setIsAnalyzing(true)
    
    // Simulate processing time with steps
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Generate simulated results
    const detection = generateSimulatedResults()
    setResult(detection)
    
    // Generate all emotion scores
    const scores = EMOTIONS.map(emotion => ({
      emotion,
      score: emotion === detection.emotion 
        ? detection.confidence 
        : Math.random() * 0.3
    })).sort((a, b) => b.score - a.score)
    
    setAllEmotions(scores)
    setIsAnalyzing(false)
  }, [image])

  const reset = () => {
    setImage(null)
    setResult(null)
    setAllEmotions([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const loadSampleImage = () => {
    // Use a placeholder for demo
    setImage("/api/placeholder/400/400")
    setResult(null)
    setAllEmotions([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            Image Input
          </CardTitle>
          <CardDescription>
            Upload an image to detect facial emotions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload area */}
          {!image ? (
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={image} 
                alt="Uploaded" 
                className="w-full rounded-lg"
              />
              {/* Face bounding box overlay */}
              {result && (
                <motion.div
                  className="absolute border-2 border-blue-400 rounded-md"
                  style={{
                    left: `${result.faceBox.x * 100}%`,
                    top: `${result.faceBox.y * 100}%`,
                    width: `${result.faceBox.width * 100}%`,
                    height: `${result.faceBox.height * 100}%`
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Face Detected
                  </span>
                </motion.div>
              )}
              {/* Attention areas */}
              {result?.attentionAreas.map((area, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-green-400 rounded-full"
                  style={{
                    left: `${area.x * 100}%`,
                    top: `${area.y * 100}%`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ delay: i * 0.2, repeat: Infinity, duration: 2 }}
                  title={area.label}
                />
              ))}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button 
              onClick={analyzeImage}
              disabled={!image || isAnalyzing}
            >
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
          <CardDescription>
            CNN-based emotion classification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Processing animation */}
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square bg-muted rounded"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        delay: i * 0.05,
                        duration: 1,
                        repeat: Infinity
                      }}
                    />
                  ))}
                </div>
                <p className="text-center text-muted-foreground text-sm">
                  Running through convolutional layers...
                </p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Primary emotion */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Detected Emotion</p>
                  <p className="text-4xl font-bold text-foreground mb-2">
                    {result.emotion}
                  </p>
                  <p className="text-lg text-blue-400">
                    {(result.confidence * 100).toFixed(1)}% confidence
                  </p>
                </div>

                {/* All emotions bar chart */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">All Emotions</p>
                  {allEmotions.map(({ emotion, score }) => (
                    <div key={emotion} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{emotion}</span>
                        <span className={emotion === result.emotion ? "text-blue-400" : ""}>
                          {(score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            emotion === result.emotion 
                              ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                              : "bg-muted-foreground/30"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-blue-400 font-medium">How it works: </span>
                    The CNN extracts features from facial regions (eyes, mouth, eyebrows) 
                    through multiple convolutional layers, then classifies the expression.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload an image to begin analysis</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* CNN Visualization */}
      <Card className="bg-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle>CNN Feature Extraction Pipeline</CardTitle>
          <CardDescription>
            Visualization of how the network processes facial features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "Input", size: "224x224x3", color: "bg-blue-500" },
              { name: "Conv1", size: "112x112x64", color: "bg-purple-500" },
              { name: "Conv2", size: "56x56x128", color: "bg-pink-500" },
              { name: "Conv3", size: "28x28x256", color: "bg-red-500" },
              { name: "Pool", size: "14x14x256", color: "bg-orange-500" },
              { name: "FC", size: "1024", color: "bg-yellow-500" },
              { name: "Output", size: "7", color: "bg-green-500" }
            ].map((layer, i) => (
              <motion.div
                key={layer.name}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-16 h-16 ${layer.color} rounded-lg flex items-center justify-center text-white font-medium shadow-lg`}>
                  {layer.name}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{layer.size}</span>
                {i < 6 && (
                  <div className="hidden sm:block absolute" style={{ marginLeft: "5rem" }}>
                    <motion.div
                      className="w-8 h-0.5 bg-muted-foreground/30"
                      animate={isAnalyzing ? { backgroundColor: ["#666", "#0ea5e9", "#666"] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
