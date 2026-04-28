"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Camera, RotateCcw, AlertCircle, CheckCircle, User, Eye, Target, Video, VideoOff, Bell, X, Brain, Play, Pause } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface FocusAnalysisResult {
  face_detected: boolean
  state: string
  attention_score: number
  confidence: number
  ear: number
  face_stability: number
  head_pose: {
    yaw: number
    pitch: number
    roll: number
  }
  num_eyes: number
  features?: any
  processed_image?: string
  message: string
  processing_time?: number
  consecutive_low?: number
  model_trained?: boolean
}

interface AttentionDataPoint {
  time: number
  score: number
  state: string
}

interface TrainingStats {
  total_samples: number
  by_class: { [key: string]: number }
  model_trained: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function MLFocusAnalyzer() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<FocusAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isWebcamMode, setIsWebcamMode] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [trainingLabel, setTrainingLabel] = useState<string | null>(null)
  // Training mode is active when a training label is selected
  const isTrainingMode = trainingLabel !== null
  const [trainingStats, setTrainingStats] = useState<TrainingStats | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [attentionHistory, setAttentionHistory] = useState<AttentionDataPoint[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Webcam functions
  const startWebcam = useCallback(async () => {
    console.log("[NeuroVista] Starting webcam...")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      })
      streamRef.current = stream
      console.log("[NeuroVista] Webcam stream obtained successfully")

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for video to be ready before marking as active
        videoRef.current.onloadedmetadata = () => {
          console.log("[NeuroVista] Video metadata loaded, starting playback")
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              console.log("[NeuroVista] Webcam started and playing")
              setIsWebcamActive(true)
            }).catch((err) => {
              console.error("[NeuroVista] Failed to play video:", err)
            })
          }
        }
      } else {
        console.error("[NeuroVista] Video ref not available")
      }
      startTimeRef.current = Date.now()
      setAttentionHistory([])
      setError(null)
    } catch (err) {
      console.error("[NeuroVista] Webcam access error:", err)
      setError("Could not access webcam. Please ensure camera permissions are granted.")
      setIsWebcamMode(false)
    }
  }, [])

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsWebcamActive(false)
    setTrainingLabel(null)
    setAttentionHistory([])
  }, [])

  const fetchTrainingStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cv/training-stats`)
      if (response.ok) {
        const data = await response.json()
        setTrainingStats(data)
      }
    } catch (err) {
      console.error("Failed to fetch training stats:", err)
    }
  }, [])

  // Store last selected state for sample collection
  const lastSelectedStateRef = useRef<string | null>(null)

  // Update ref when trainingLabel changes
  useEffect(() => {
    lastSelectedStateRef.current = trainingLabel
    if (trainingLabel) {
      console.log(`[NeuroVista] State selected: ${trainingLabel}`)
    }
  }, [trainingLabel])

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isWebcamActive) {
      console.log("[NeuroVista] Skipping frame: webcam not active or refs not ready")
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error("[NeuroVista] Failed to get canvas context")
      return
    }

    // Ensure video is playing and has valid dimensions
    if (video.readyState < 2) {
      console.log("[NeuroVista] Video not ready yet, skipping frame")
      return
    }

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    console.log("[NeuroVista] Frame captured from webcam")

    // Create blob for analysis
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85)
    })

    if (!blob) {
      console.error("[NeuroVista] Failed to create blob from canvas")
      return
    }

    setIsAnalyzing(true)
    try {
      // First, analyze the frame to check if face is detected
      const analyzeFormData = new FormData()
      analyzeFormData.append('file', blob, 'frame.jpg')

      console.log("[NeuroVista] Sending frame to /cv/analyze-frame...")
      const response = await fetch(`${API_BASE_URL}/cv/analyze-frame`, {
        method: 'POST',
        body: analyzeFormData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errorData.detail || 'Failed to analyze frame')
      }

      const data = await response.json()
      console.log("[NeuroVista] Analysis result:", {
        face_detected: data.face_detected,
        state: data.state,
        attention_score: data.attention_score
      })
      setResult(data)

      // If face detected, update attention history
      if (data.face_detected) {
        console.log("[NeuroVista] Face detected in frame")
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const newDataPoint: AttentionDataPoint = {
          time: elapsedSeconds,
          score: data.attention_score,
          state: data.state
        }
        setAttentionHistory(prev => [...prev.slice(-50), newDataPoint])

        if (data.consecutive_low >= 5) {
          setAlertMessage("You've been distracted for 5+ seconds. Please focus!")
          setShowAlert(true)
        }

        // === SAMPLE COLLECTION LOGIC (CRITICAL) ===
        // Only collect if: in training mode AND a state is selected AND face is detected
        const currentSelectedState = lastSelectedStateRef.current
        if (isTrainingMode && currentSelectedState) {
          console.log(`[NeuroVista] Attempting to collect sample for state: ${currentSelectedState}`)

          // Create a NEW blob for sample collection (don't reuse the consumed one)
          const sampleBlob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85)
          })

          if (sampleBlob) {
            const sampleFormData = new FormData()
            sampleFormData.append('file', sampleBlob, 'frame.jpg')

            // Use the new /cv/add-sample endpoint
            console.log(`[NeuroVista] Sending sample to /cv/add-sample?label=${currentSelectedState}`)
            const collectResponse = await fetch(`${API_BASE_URL}/cv/add-sample?label=${currentSelectedState}`, {
              method: 'POST',
              body: sampleFormData,
            })

            if (collectResponse.ok) {
              const collectData = await collectResponse.json()
              console.log(`[NeuroVista] Sample added successfully for [${currentSelectedState}]:`, collectData)
              fetchTrainingStats()
            } else {
              const errorData = await collectResponse.json().catch(() => ({ detail: 'Unknown error' }))
              console.error(`[NeuroVista] Failed to collect sample:`, errorData)
            }
          }
        } else if (isTrainingMode && !currentSelectedState) {
          console.log("[NeuroVista] Warning: In training mode but no state selected. Click Focused/Distracted/Sleepy to select a state.")
        }
      } else {
        console.log("[NeuroVista] Warning: No face detected in frame. Skipping sample collection.")
      }
    } catch (err) {
      console.error('[NeuroVista] Frame analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }, [isWebcamActive, isTrainingMode, fetchTrainingStats])

  useEffect(() => {
    if (isWebcamActive) {
      captureFrame()
      intervalRef.current = setInterval(captureFrame, 1500)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isWebcamActive, captureFrame])

  useEffect(() => {
    return () => {
      stopWebcam()
    }
  }, [stopWebcam])

  useEffect(() => {
    fetchTrainingStats()
  }, [fetchTrainingStats])

  const toggleWebcamMode = () => {
    if (isWebcamMode) {
      stopWebcam()
      setIsWebcamMode(false)
    } else {
      setIsWebcamMode(true)
      startWebcam()
    }
  }

  const trainModel = async () => {
    setIsTraining(true)
    try {
      const response = await fetch(`${API_BASE_URL}/cv/train`, { method: 'POST' })
      const data = await response.json()
      if (response.ok) {
        fetchTrainingStats()
        alert(`Model trained! Train accuracy: ${data.train_accuracy}%, Test accuracy: ${data.test_accuracy}%`)
      } else {
        setError(data.message || "Training failed")
      }
    } catch (err) {
      setError("Failed to train model")
    } finally {
      setIsTraining(false)
    }
  }

  const clearTraining = async () => {
    try {
      await fetch(`${API_BASE_URL}/cv/clear-training`, { method: 'POST' })
      fetchTrainingStats()
      setTrainingStats(null)
    } catch (err) {
      console.error("Failed to clear training data:", err)
    }
  }

  const reset = () => {
    setImage(null)
    setResult(null)
    setError(null)
    setAttentionHistory([])
    setShowAlert(false)
    setTrainingLabel(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "Focused": return "text-green-400 bg-green-500/20 border-green-500/50"
      case "Distracted": return "text-amber-400 bg-amber-500/20 border-amber-500/50"
      case "Sleepy": return "text-red-400 bg-red-500/20 border-red-500/50"
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/50"
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Focused": return <CheckCircle className="w-6 h-6" />
      case "Distracted": return <Target className="w-6 h-6" />
      case "Sleepy": return <Eye className="w-6 h-6" />
      default: return <User className="w-6 h-6" />
    }
  }

  const getLineColor = (score: number) => {
    if (score >= 70) return "#22c55e"
    if (score >= 40) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div className="space-y-6">
      {/* Alert Popup */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent className="bg-red-500/10 border-red-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Bell className="w-6 h-6 animate-bounce" />
              Attention Alert!
            </DialogTitle>
            <DialogDescription className="text-foreground">{alertMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowAlert(false)} variant="outline">
              <X className="w-4 h-4 mr-2" /> Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ML Status Banner */}
      <Card className={`border ${trainingStats?.model_trained ? 'bg-green-500/5 border-green-500/30' : 'bg-amber-500/5 border-amber-500/30'}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className={`w-6 h-6 ${trainingStats?.model_trained ? 'text-green-400' : 'text-amber-400'}`} />
              <div>
                <p className="font-medium">
                  {trainingStats?.model_trained ? 'ML Model Trained' : 'ML Model Not Trained'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {trainingStats?.model_trained 
                    ? 'Using trained RandomForest classifier for predictions' 
                    : 'Collect training samples to enable ML-based predictions'}
                </p>
              </div>
            </div>
            <Badge variant={trainingStats?.model_trained ? "default" : "secondary"}>
              {trainingStats?.total_samples || 0} samples
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="analyze" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze">Analyze Focus</TabsTrigger>
          <TabsTrigger value="train">Train Model</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-400" />
                  Webcam Feed
                </CardTitle>
                <CardDescription>Enable webcam for real-time ML-based analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  variant={isWebcamMode ? "default" : "outline"}
                  onClick={toggleWebcamMode}
                  className="w-full"
                >
                  {isWebcamMode ? (
                    <><VideoOff className="w-4 h-4 mr-2" /> Stop Webcam</>
                  ) : (
                    <><Video className="w-4 h-4 mr-2" /> Start Webcam</>
                  )}
                </Button>

                <canvas ref={canvasRef} className="hidden" />

                {isWebcamMode ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full rounded-lg bg-muted"
                      playsInline muted
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <motion.div
                          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    )}
                    {isWebcamActive && (
                      <div className="absolute bottom-2 right-2">
                        <span className="flex items-center gap-1 text-xs bg-black/70 text-white px-2 py-1 rounded">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          LIVE
                        </span>
                      </div>
                    )}
                    {result?.processed_image && (
                      <img src={result.processed_image} alt="Analyzed" className="w-full rounded-lg mt-2" />
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Start webcam to begin analysis</p>
                  </div>
                )}

                <Button variant="outline" onClick={reset} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  ML Prediction Results
                </CardTitle>
                <CardDescription>Real-time attention state prediction</CardDescription>
              </CardHeader>
              <CardContent>
                {result?.face_detected ? (
                  <div className="space-y-4">
                    <div className={`p-6 rounded-lg border-2 text-center ${getStateColor(result.state)}`}>
                      <div className="flex justify-center mb-2">{getStateIcon(result.state)}</div>
                      <p className="text-sm text-muted-foreground mb-1">Predicted State</p>
                      <p className="text-3xl font-bold">{result.state}</p>
                      <p className="text-sm mt-1">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                      {!result.model_trained && (
                        <p className="text-xs mt-2 text-amber-400">Using fallback rules - train model for better accuracy</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Attention Score</span>
                        <span className={`text-lg font-bold ${result.attention_score >= 70 ? "text-green-400" : result.attention_score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                          {result.attention_score}/100
                        </span>
                      </div>
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${result.attention_score}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">EAR</span>
                        <p className="font-mono">{result.ear.toFixed(3)}</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">Stability</span>
                        <p className="font-mono">{(result.face_stability * 100).toFixed(0)}%</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">Yaw</span>
                        <p className="font-mono">{result.head_pose.yaw.toFixed(2)}</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">Pitch</span>
                        <p className="font-mono">{result.head_pose.pitch.toFixed(2)}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{result.message}</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start webcam to see ML predictions</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attention Graph */}
            {attentionHistory.length > 0 && (
              <Card className="bg-card border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle>Attention Score Timeline</CardTitle>
                  <CardDescription>Real-time attention tracking with temporal smoothing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attentionHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#666" tickFormatter={(v) => `${v}s`} />
                        <YAxis domain={[0, 100]} stroke="#666" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                        <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="3 3" label="Focused" />
                        <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" label="Alert" />
                        <Line type="monotone" dataKey="score" stroke={getLineColor(attentionHistory[attentionHistory.length - 1]?.score || 50)} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="train" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Collection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Collect Training Samples
                </CardTitle>
                <CardDescription>Record samples for each attention state</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={trainingLabel === "focused" ? "default" : "outline"}
                    onClick={() => setTrainingLabel("focused")}
                    className="flex-col h-auto py-4"
                  >
                    <CheckCircle className="w-5 h-5 mb-1" />
                    <span className="text-xs">Focused</span>
                    <span className="text-xs text-muted-foreground">
                      {trainingStats?.by_class?.focused || 0} samples
                    </span>
                  </Button>
                  <Button
                    variant={trainingLabel === "distracted" ? "default" : "outline"}
                    onClick={() => setTrainingLabel("distracted")}
                    className="flex-col h-auto py-4"
                  >
                    <Target className="w-5 h-5 mb-1" />
                    <span className="text-xs">Distracted</span>
                    <span className="text-xs text-muted-foreground">
                      {trainingStats?.by_class?.distracted || 0} samples
                    </span>
                  </Button>
                  <Button
                    variant={trainingLabel === "sleepy" ? "default" : "outline"}
                    onClick={() => setTrainingLabel("sleepy")}
                    className="flex-col h-auto py-4"
                  >
                    <Eye className="w-5 h-5 mb-1" />
                    <span className="text-xs">Sleepy</span>
                    <span className="text-xs text-muted-foreground">
                      {trainingStats?.by_class?.sleepy || 0} samples
                    </span>
                  </Button>
                </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Instructions:</strong>
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                  <li>Click <strong>Start Webcam</strong> first</li>
                  <li>Then select a state: Focused / Distracted / Sleepy</li>
                  <li>Samples are collected automatically every ~1.5s</li>
                  <li>Ensure your face is visible in the camera</li>
                  <li>Collect at least 10 samples per state</li>
                </ul>
              </div>

                <div className="flex gap-2">
                  <Button
                    variant={isWebcamMode ? "default" : "outline"}
                    onClick={toggleWebcamMode}
                    className="flex-1"
                  >
                    {isWebcamMode ? <><Pause className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start Webcam</>}
                  </Button>
                </div>

        {isWebcamMode && trainingLabel && (
          <Alert className="bg-green-500/10 border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription>
              Recording samples for: <strong>{trainingLabel}</strong>
            </AlertDescription>
          </Alert>
        )}

        {isWebcamMode && !trainingLabel && (
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <AlertDescription>
              <strong>No state selected!</strong> Click Focused, Distracted, or Sleepy above to start collecting samples.
            </AlertDescription>
          </Alert>
        )}

                <canvas ref={canvasRef} className="hidden" />

                {isWebcamMode && (
                  <div className="relative">
                    <video ref={videoRef} className="w-full rounded-lg bg-muted" playsInline muted />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <motion.div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Model Training */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Train Model
                </CardTitle>
                <CardDescription>Train RandomForest classifier on collected data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Total Samples</span>
                    <span className="text-lg font-mono">{trainingStats?.total_samples || 0}</span>
                  </div>
                  <Progress value={Math.min((trainingStats?.total_samples || 0) / 30 * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Need at least 10 samples per class (30 total recommended)
                  </p>
                </div>

                {trainingStats?.by_class && (
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(trainingStats.by_class).map(([label, count]) => (
                      <div key={label} className="p-2 bg-muted/30 rounded text-center">
                        <p className="text-xs text-muted-foreground capitalize">{label}</p>
                        <p className="text-lg font-mono">{count}</p>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={trainModel}
                  disabled={isTraining || (trainingStats?.total_samples || 0) < 10}
                  className="w-full"
                >
                  {isTraining ? (
                    <><motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Training...</>
                  ) : (
                    <><Brain className="w-4 h-4 mr-2" /> Train Model</>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={clearTraining}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Clear Training Data
                </Button>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                  <p className="text-sm text-blue-400">
                    <strong>Model Info:</strong> RandomForestClassifier with temporal smoothing (majority vote over last 10 predictions)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
