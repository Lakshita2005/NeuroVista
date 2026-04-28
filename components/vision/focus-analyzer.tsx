"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Camera, RotateCcw, AlertCircle, CheckCircle, User, Eye, Target, Video, VideoOff, Bell, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface FocusAnalysisResult {
  face_detected: boolean
  state: string
  attention_score: number
  ear: number
  face_stability: number
  head_pose: {
    yaw: number
    pitch: number
    roll: number
  }
  bbox?: {
    x: number
    y: number
    width: number
    height: number
  }
  num_eyes: number
  processed_image?: string
  message: string
  processing_time?: number
  alert_triggered?: boolean
  consecutive_low?: number
}

interface AttentionDataPoint {
  time: number
  score: number
  state: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function FocusAnalyzer() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<FocusAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isWebcamMode, setIsWebcamMode] = useState(false)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setIsWebcamActive(true)
      startTimeRef.current = Date.now()
      setAttentionHistory([]) // Clear history when starting
      setError(null)
    } catch (err) {
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
    setAttentionHistory([])
  }, [])

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isWebcamActive) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85)
    })

    if (!blob) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('file', blob, 'frame.jpg')

      const response = await fetch(`${API_BASE_URL}/cv/analyze-frame`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errorData.detail || 'Failed to analyze frame')
      }

      const data = await response.json()
      setResult(data)
      
      // Add to attention history
      if (data.face_detected) {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const newDataPoint: AttentionDataPoint = {
          time: elapsedSeconds,
          score: data.attention_score,
          state: data.state
        }
        setAttentionHistory(prev => [...prev.slice(-50), newDataPoint]) // Keep last 50 points
        
        // Check for alert condition (score < 40 for 5+ seconds)
        if (data.consecutive_low >= 5) {
          setAlertMessage("You've been distracted for 5+ seconds. Please focus!")
          setShowAlert(true)
        }
      }
    } catch (err) {
      console.error('Frame analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }, [isWebcamActive])

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

  const toggleWebcamMode = () => {
    if (isWebcamMode) {
      stopWebcam()
      setIsWebcamMode(false)
    } else {
      setIsWebcamMode(true)
      startWebcam()
    }
  }

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file (PNG, JPG, JPEG)")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB")
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setResult(null)
        setError(null)
        setAttentionHistory([])
      }
      reader.onerror = () => {
        setError("Failed to read image file")
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const analyzeImage = useCallback(async () => {
    if (!image) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const base64Data = image.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/png' })
      
      const formData = new FormData()
      formData.append('file', blob, 'image.png')

      const response = await fetch(`${API_BASE_URL}/cv/analyze-frame`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errorData.detail || 'Failed to analyze image')
      }

      const data = await response.json()
      setResult(data)
      
      // Add single point to history for uploaded images
      if (data.face_detected) {
        setAttentionHistory([{ time: 0, score: data.attention_score, state: data.state }])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }, [image])

  const reset = () => {
    setImage(null)
    setResult(null)
    setError(null)
    setAttentionHistory([])
    setShowAlert(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "Focused":
        return "text-green-400 bg-green-500/20 border-green-500/50"
      case "Distracted":
        return "text-amber-400 bg-amber-500/20 border-amber-500/50"
      case "Sleepy":
        return "text-red-400 bg-red-500/20 border-red-500/50"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/50"
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Focused":
        return <CheckCircle className="w-6 h-6" />
      case "Distracted":
        return <Target className="w-6 h-6" />
      case "Sleepy":
        return <Eye className="w-6 h-6" />
      default:
        return <User className="w-6 h-6" />
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-green-500"
    if (score >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  const getLineColor = (score: number) => {
    if (score >= 70) return "#22c55e"
    if (score >= 40) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alert Popup Dialog */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent className="bg-red-500/10 border-red-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <Bell className="w-6 h-6 animate-bounce" />
              Attention Alert!
            </DialogTitle>
            <DialogDescription className="text-foreground">
              {alertMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowAlert(false)} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Input Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            Student Photo
          </CardTitle>
          <CardDescription>
            Upload an image or use webcam for real-time focus analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Webcam Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={isWebcamMode ? "default" : "outline"}
              onClick={toggleWebcamMode}
              className="flex-1"
            >
              {isWebcamMode ? (
                <><VideoOff className="w-4 h-4 mr-2" /> Stop Webcam</>
              ) : (
                <><Video className="w-4 h-4 mr-2" /> Use Webcam</>
              )}
            </Button>
            {!isWebcamMode && (
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            )}
          </div>

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Webcam Video or Upload Area */}
          {isWebcamMode ? (
            <div className="relative">
              {result?.processed_image ? (
                <img
                  src={result.processed_image}
                  alt="Analyzed"
                  className="w-full rounded-lg"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="w-full rounded-lg bg-muted"
                  playsInline
                  muted
                />
              )}
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
            </div>
          ) : (
            <>
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
                  {result?.processed_image ? (
                    <img
                      src={result.processed_image}
                      alt="Analyzed"
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <img
                      src={image}
                      alt="Uploaded"
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              )}
            </>
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
            {!isWebcamMode && (
              <>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {image ? "Change Image" : "Upload"}
                </Button>
                {image && (
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "Analyzing..." : "Analyze Focus"}
                  </Button>
                )}
              </>
            )}
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
            <Target className="w-5 h-5 text-purple-400" />
            Focus Analysis Results
          </CardTitle>
          <CardDescription>
            {isWebcamMode ? "Real-time webcam analysis" : "Single image analysis"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isAnalyzing && !result ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-12"
              >
                <motion.div
                  className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-4 text-muted-foreground">Analyzing student engagement...</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {!result.face_detected ? (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{result.message}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* State Badge */}
                    <div className={`p-6 rounded-lg border-2 text-center ${getStateColor(result.state)}`}>
                      <div className="flex justify-center mb-2">
                        {getStateIcon(result.state)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Engagement State</p>
                      <p className="text-3xl font-bold">{result.state}</p>
                    </div>

                    {/* Attention Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Attention Score</span>
                        <span className={`text-lg font-bold ${
                          result.attention_score >= 70 ? "text-green-400" :
                          result.attention_score >= 40 ? "text-amber-400" : "text-red-400"
                        }`}>
                          {result.attention_score}/100
                        </span>
                      </div>
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${getProgressColor(result.attention_score)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.attention_score}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Eye Aspect Ratio (EAR)</p>
                        <p className="text-lg font-mono">{result.ear.toFixed(3)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.ear < 0.18 ? "Eyes likely closed" : "Eyes open"}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Face Stability</p>
                        <p className="text-lg font-mono">{(result.face_stability * 100).toFixed(0)}%</p>
                      </div>
                      
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Head Yaw</p>
                        <p className="text-lg font-mono">{(result.head_pose.yaw * 100).toFixed(0)}%</p>
                      </div>
                      
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Head Pitch</p>
                        <p className="text-lg font-mono">{(result.head_pose.pitch * 100).toFixed(0)}%</p>
                      </div>
                      
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Eyes Detected</p>
                        <p className="text-lg font-mono">{result.num_eyes}</p>
                      </div>
                      
                      {result.consecutive_low !== undefined && result.consecutive_low > 0 && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">Low Attention Frames</p>
                          <p className={`text-lg font-mono ${result.consecutive_low >= 5 ? "text-red-400" : ""}`}>
                            {result.consecutive_low}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Message */}
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">Analysis: </span>
                        {result.message}
                      </p>
                    </div>

                    {result.processing_time && (
                      <p className="text-xs text-muted-foreground text-right">
                        Processed in {result.processing_time}s
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{isWebcamMode ? "Webcam active - analyzing..." : "Upload a photo to analyze student focus"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Attention Score Graph */}
      {attentionHistory.length > 0 && (
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Attention Score Over Time
            </CardTitle>
            <CardDescription>
              Real-time tracking of attention levels (last {attentionHistory.length} samples)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attentionHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#666"
                    tickFormatter={(value) => `${value}s`}
                    label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="#666" 
                    domain={[0, 100]}
                    label={{ value: 'Attention Score', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                    labelFormatter={(value) => `Time: ${value}s`}
                    formatter={(value: number) => [`${value}`, 'Attention Score']}
                  />
                  <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="3 3" label="Focused" />
                  <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" label="Alert" />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke={getLineColor(attentionHistory[attentionHistory.length - 1]?.score || 50)}
                    strokeWidth={2}
                    dot={{ fill: getLineColor(attentionHistory[attentionHistory.length - 1]?.score || 50), r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Alert Threshold Indicator */}
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Bell className="w-4 h-4 text-red-400" />
                <span>Alert triggers when attention score is below 40 for 5+ seconds</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card className="bg-card border-border lg:col-span-2">
        <CardHeader>
          <CardTitle>How Focus Analysis Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {[{
              title: "1. Face Detection",
              desc: "OpenCV Haar Cascade classifier detects faces in the image",
              color: "text-blue-400"
            }, {
              title: "2. Eye Detection",
              desc: "Eye Aspect Ratio (EAR) is calculated from detected eye regions",
              color: "text-cyan-400"
            }, {
              title: "3. Head Orientation",
              desc: "Face position relative to frame center determines head pose (yaw/pitch)",
              color: "text-purple-400"
            }, {
              title: "4. Attention Score",
              desc: "Score = EAR×40% + Orientation×30% + Stability×30% (0-100)",
              color: "text-green-400"
            }].map((step, i) => (
              <motion.div
                key={step.title}
                className="p-4 bg-muted/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className={`font-medium ${step.color} mb-2`}>{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
