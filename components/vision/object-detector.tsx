"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ScanLine, Sparkles, RotateCcw } from "lucide-react"

// Simulated object detection
const OBJECTS = ["Person", "Car", "Dog", "Cat", "Chair", "Table", "Phone", "Book", "Bottle", "Laptop"]

interface DetectedObject {
  label: string
  confidence: number
  bbox: { x: number; y: number; width: number; height: number }
}

function generateSimulatedDetections(): DetectedObject[] {
  const numObjects = Math.floor(Math.random() * 3) + 1
  const detections: DetectedObject[] = []
  
  for (let i = 0; i < numObjects; i++) {
    const label = OBJECTS[Math.floor(Math.random() * OBJECTS.length)]
    detections.push({
      label,
      confidence: 0.6 + Math.random() * 0.35,
      bbox: {
        x: 0.1 + Math.random() * 0.5,
        y: 0.1 + Math.random() * 0.5,
        width: 0.2 + Math.random() * 0.3,
        height: 0.2 + Math.random() * 0.3
      }
    })
  }
  
  return detections.sort((a, b) => b.confidence - a.confidence)
}

export function ObjectDetector() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detections, setDetections] = useState<DetectedObject[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setDetections([])
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const analyzeImage = useCallback(async () => {
    if (!image) return

    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const results = generateSimulatedDetections()
    setDetections(results)
    setIsAnalyzing(false)
  }, [image])

  const reset = () => {
    setImage(null)
    setDetections([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-blue-400" />
            Image Input
          </CardTitle>
          <CardDescription>
            Upload an image to detect objects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              {/* Bounding boxes */}
              {detections.map((det, i) => (
                <motion.div
                  key={i}
                  className="absolute border-2 border-blue-400 rounded-md"
                  style={{
                    left: `${det.bbox.x * 100}%`,
                    top: `${det.bbox.y * 100}%`,
                    width: `${det.bbox.width * 100}%`,
                    height: `${det.bbox.height * 100}%`
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {det.label} {(det.confidence * 100).toFixed(0)}%
                  </span>
                </motion.div>
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
              <ScanLine className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Detecting..." : "Detect Objects"}
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
            Detection Results
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
                  className="grid grid-cols-4 gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-muted rounded" />
                  ))}
                </motion.div>
                <p className="mt-4 text-muted-foreground text-sm">
                  Running object detection...
                </p>
              </motion.div>
            ) : detections.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  {detections.map((det, i) => (
                    <div key={i} className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{det.label}</span>
                        <span className="text-sm text-blue-400">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${det.confidence * 100}%` }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
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
                <ScanLine className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload an image to detect objects</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
