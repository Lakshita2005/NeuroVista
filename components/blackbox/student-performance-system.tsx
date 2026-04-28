"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  User,
  Brain,
  Layers,
  Eye,
  MessageSquareText,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  BookOpen,
  Video,
  Mic,
  BarChart3,
  Zap,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Users,
  GraduationCap
} from "lucide-react"

interface ScenarioStage {
  id: number
  title: string
  subtitle: string
  icon: React.ElementType
  description: string
  inputs: { label: string; value: number; min: number; max: number }[]
  processingModules: { name: string; icon: React.ElementType; color: string }[]
  animation: string
  result: {
    prediction: string
    confidence: number
    factors: string[]
    recommendation: string
  }
}

const SCENARIO_STAGES: ScenarioStage[] = [
  {
    id: 1,
    title: "Student Data Collection",
    subtitle: "Multi-modal data gathering",
    icon: User,
    description: "The system collects various types of data about the student: academic records, behavioral patterns, and real-time engagement metrics.",
    inputs: [
      { label: "Attendance Rate", value: 85, min: 0, max: 100 },
      { label: "Assignment Completion", value: 78, min: 0, max: 100 },
      { label: "Test Average", value: 82, min: 0, max: 100 }
    ],
    processingModules: [
      { name: "Input Layer", icon: User, color: "text-cyan-400" },
      { name: "Preprocessing", icon: Sparkles, color: "text-purple-400" }
    ],
    animation: "data-collection",
    result: {
      prediction: "Raw data collected",
      confidence: 0,
      factors: ["Attendance", "Assignments", "Tests"],
      recommendation: "Processing..."
    }
  },
  {
    id: 2,
    title: "Performance Prediction",
    subtitle: "MLP analyzes historical data",
    icon: Layers,
    description: "The Multi-Layer Perceptron analyzes structured data patterns to predict the student's academic performance trend.",
    inputs: [
      { label: "Study Hours/Week", value: 15, min: 0, max: 40 },
      { label: "Previous Grade", value: 78, min: 0, max: 100 },
      { label: "Extra Credit", value: 12, min: 0, max: 20 }
    ],
    processingModules: [
      { name: "MLP", icon: Layers, color: "text-emerald-400" },
      { name: "Hidden Layers", icon: Brain, color: "text-purple-400" }
    ],
    animation: "mlp-processing",
    result: {
      prediction: "B+ Grade Expected",
      confidence: 0.82,
      factors: ["Historical performance pattern detected", "Study hours correlate with success"],
      recommendation: "Continue current study habits"
    }
  },
  {
    id: 3,
    title: "Progress Tracking",
    subtitle: "LSTM tracks learning over time",
    icon: Clock,
    description: "Long Short-Term Memory network analyzes the student's learning trajectory and identifies patterns in their academic journey.",
    inputs: [
      { label: "Weeks Tracked", value: 12, min: 1, max: 24 },
      { label: "Improvement Rate", value: 65, min: 0, max: 100 },
      { label: "Consistency", value: 72, min: 0, max: 100 }
    ],
    processingModules: [
      { name: "LSTM", icon: Clock, color: "text-amber-400" },
      { name: "Memory Gates", icon: Brain, color: "text-purple-400" }
    ],
    animation: "lstm-sequence",
    result: {
      prediction: "Upward Trend Detected",
      confidence: 0.88,
      factors: ["Steady improvement over 12 weeks", "Consistency increasing"],
      recommendation: "Student is on positive trajectory"
    }
  },
  {
    id: 4,
    title: "Attention Analysis",
    subtitle: "Vision module checks engagement",
    icon: Eye,
    description: "Computer Vision analyzes the student's facial expressions and eye movements during video lectures to measure engagement.",
    inputs: [
      { label: "Eye Contact %", value: 78, min: 0, max: 100 },
      { label: "Focus Score", value: 82, min: 0, max: 100 },
      { label: "Distraction Events", value: 4, min: 0, max: 20 }
    ],
    processingModules: [
      { name: "CNN", icon: Eye, color: "text-blue-400" },
      { name: "Feature Extraction", icon: Brain, color: "text-cyan-400" }
    ],
    animation: "vision-analysis",
    result: {
      prediction: "Highly Engaged",
      confidence: 0.85,
      factors: ["Sustained eye contact", "Minimal distractions", "Active facial expressions"],
      recommendation: "Student is attentively following lessons"
    }
  },
  {
    id: 5,
    title: "Sentiment Analysis",
    subtitle: "NLP analyzes student feedback",
    icon: MessageSquareText,
    description: "Natural Language Processing analyzes written feedback, chat messages, and discussion forum posts to gauge student sentiment.",
    inputs: [
      { label: "Positive Sentiment", value: 70, min: 0, max: 100 },
      { label: "Question Frequency", value: 8, min: 0, max: 20 },
      { label: "Help Requests", value: 3, min: 0, max: 10 }
    ],
    processingModules: [
      { name: "NLP", icon: MessageSquareText, color: "text-green-400" },
      { name: "Sentiment Model", icon: Brain, color: "text-emerald-400" }
    ],
    animation: "sentiment-processing",
    result: {
      prediction: "Positive Mindset",
      confidence: 0.79,
      factors: ["Positive language patterns", "Curious and engaged", "Seeks help when needed"],
      recommendation: "Encourage continued participation"
    }
  },
  {
    id: 6,
    title: "Integrated Assessment",
    subtitle: "All modules combine insights",
    icon: Target,
    description: "The Black Box integrates predictions from all modules to create a comprehensive student assessment with actionable recommendations.",
    inputs: [
      { label: "MLP Confidence", value: 82, min: 0, max: 100 },
      { label: "LSTM Confidence", value: 88, min: 0, max: 100 },
      { label: "Vision Confidence", value: 85, min: 0, max: 100 }
    ],
    processingModules: [
      { name: "Integration Layer", icon: Brain, color: "text-pink-400" },
      { name: "Decision Fusion", icon: Target, color: "text-cyan-400" }
    ],
    animation: "final-integration",
    result: {
      prediction: "Successful Outcome Likely",
      confidence: 0.85,
      factors: [
        "Academic performance: B+ predicted",
        "Learning trajectory: Improving",
        "Engagement: High attention",
        "Sentiment: Positive and curious"
      ],
      recommendation: "Student is on track for success. Continue current support level."
    }
  }
]

export function StudentPerformanceSystem() {
  const [currentStage, setCurrentStage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [stageValues, setStageValues] = useState<Record<number, number[]>>({})

  const stage = SCENARIO_STAGES[currentStage]

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentStage < SCENARIO_STAGES.length - 1) {
          setCurrentStage(prev => prev + 1)
        } else {
          setIsPlaying(false)
        }
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStage])

  const startSimulation = () => {
    setCurrentStage(0)
    setIsPlaying(true)
    setShowDetails(true)
  }

  const reset = () => {
    setCurrentStage(0)
    setIsPlaying(false)
    setShowDetails(false)
    setStageValues({})
  }

  const nextStage = () => {
    if (currentStage < SCENARIO_STAGES.length - 1) {
      setCurrentStage(prev => prev + 1)
    }
  }

  const prevStage = () => {
    if (currentStage > 0) {
      setCurrentStage(prev => prev - 1)
    }
  }

  const updateStageValue = (stageId: number, inputIndex: number, value: number) => {
    setStageValues(prev => ({
      ...prev,
      [stageId]: prev[stageId]?.map((v, i) => i === inputIndex ? value : v) || 
        SCENARIO_STAGES[stageId].inputs.map((inp, i) => i === inputIndex ? value : inp.value)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Student Performance Prediction System</h2>
          </div>
          <p className="text-muted-foreground">
            See how ALL NeuroVista modules work together in a real-world application
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!showDetails ? (
            <Button onClick={startSimulation} className="gap-2">
              <Play className="w-4 h-4" />
              Start Simulation
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                className="gap-2"
              >
                {isPlaying ? "Pause" : "Continue"}
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      {showDetails && (
        <div className="flex items-center justify-between gap-2">
          {SCENARIO_STAGES.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentStage(index)}
              className={`flex-1 h-2 rounded-full transition-all ${
                index === currentStage
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500"
                  : index < currentStage
                  ? "bg-emerald-500"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      )}

      {showDetails ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Scenario Controls */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-1 space-y-4"
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${currentStage === 0 ? 'bg-cyan-500/20' : currentStage === 1 ? 'bg-emerald-500/20' : currentStage === 2 ? 'bg-amber-500/20' : currentStage === 3 ? 'bg-blue-500/20' : currentStage === 4 ? 'bg-green-500/20' : 'bg-pink-500/20'}`}>
                      <stage.icon className={`w-6 h-6 ${currentStage === 0 ? 'text-cyan-400' : currentStage === 1 ? 'text-emerald-400' : currentStage === 2 ? 'text-amber-400' : currentStage === 3 ? 'text-blue-400' : currentStage === 4 ? 'text-green-400' : 'text-pink-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stage {currentStage + 1} of {SCENARIO_STAGES.length}</p>
                      <CardTitle className="text-lg">{stage.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{stage.description}</p>

                  {/* Input Sliders */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Adjustable Parameters
                    </h4>
                    {stage.inputs.map((input, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{input.label}</span>
                          <span className="font-medium">
                            {stageValues[stage.id]?.[i] ?? input.value}
                            {input.label.includes('%') ? '%' : ''}
                          </span>
                        </div>
                        <Slider
                          value={[stageValues[stage.id]?.[i] ?? input.value]}
                          min={input.min}
                          max={input.max}
                          step={1}
                          onValueChange={(value) => updateStageValue(stage.id, i, value[0])}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Processing Modules */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Active Modules
                    </h4>
                    <div className="space-y-2">
                      {stage.processingModules.map((mod, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className="flex items-center gap-2"
                        >
                          <mod.icon className={`w-4 h-4 ${mod.color}`} />
                          <span className="text-sm">{mod.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Center: Visualization */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="lg:col-span-1"
            >
              <Card className="h-full bg-card border-border overflow-hidden">
                <CardContent className="p-6 flex items-center justify-center h-full min-h-[400px]">
                  {stage.id === 1 && (
                    <div className="text-center space-y-4">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <User className="w-24 h-24 mx-auto text-cyan-400" />
                      </motion.div>
                      <div className="flex justify-center gap-4">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          className="p-3 bg-cyan-500/20 rounded-lg"
                        >
                          <BookOpen className="w-6 h-6 text-cyan-400" />
                        </motion.div>
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="p-3 bg-purple-500/20 rounded-lg"
                        >
                          <BarChart3 className="w-6 h-6 text-purple-400" />
                        </motion.div>
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="p-3 bg-emerald-500/20 rounded-lg"
                        >
                          <Activity className="w-6 h-6 text-emerald-400" />
                        </motion.div>
                      </div>
                      <p className="text-muted-foreground">Collecting student data...</p>
                    </div>
                  )}

                  {stage.id === 2 && (
                    <div className="relative w-full h-64">
                      <svg width="100%" height="100%" viewBox="0 0 300 200">
                        {/* MLP Architecture */}
                        {[0, 1, 2, 3].map(i => (
                          <motion.circle
                            key={`input-${i}`}
                            cx={50}
                            cy={40 + i * 45}
                            r="12"
                            fill="#06b6d4"
                            fillOpacity="0.5"
                            animate={{ fillOpacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                          />
                        ))}
                        {[0, 1, 2].map(i => (
                          <motion.circle
                            key={`hidden-${i}`}
                            cx={150}
                            cy={55 + i * 50}
                            r="12"
                            fill="#a855f7"
                            fillOpacity="0.5"
                            animate={{ fillOpacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.3 + i * 0.1 }}
                          />
                        ))}
                        <motion.circle
                          cx="250"
                          cy="100"
                          r="15"
                          fill="#10b981"
                          fillOpacity="0.5"
                          animate={{ fillOpacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        {/* Connections */}
                        <motion.path
                          d="M 62 52 Q 100 75 138 67 M 62 97 Q 100 75 138 67 M 62 142 Q 100 75 138 67 M 62 142 Q 100 125 138 105 M 62 97 Q 100 125 138 105 M 62 52 Q 100 125 138 105 M 62 52 Q 100 175 138 155 M 62 97 Q 100 175 138 155 M 62 142 Q 100 175 138 155"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="1"
                          strokeOpacity="0.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1 }}
                        />
                        <motion.path
                          d="M 162 67 L 235 100 M 162 105 L 235 100 M 162 155 L 235 100"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 1 }}
                        />
                        <text x="250" y="130" textAnchor="middle" className="fill-emerald-400 text-sm font-medium">B+</text>
                      </svg>
                    </div>
                  )}

                  {stage.id === 3 && (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock className="w-8 h-8 text-amber-400" />
                      </div>
                      <div className="space-y-2">
                        {[
                          { week: "Week 1-4", score: 72, color: "bg-cyan-500" },
                          { week: "Week 5-8", score: 76, color: "bg-blue-500" },
                          { week: "Week 9-12", score: 82, color: "bg-emerald-500" }
                        ].map((period, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.3 }}
                            className="flex items-center gap-4"
                          >
                            <span className="text-xs text-muted-foreground w-20">{period.week}</span>
                            <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${period.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${period.score}%` }}
                                transition={{ duration: 0.8, delay: i * 0.3 + 0.2 }}
                              />
                            </div>
                            <span className="text-xs font-medium w-8">{period.score}%</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-amber-400">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm font-medium">Upward trend detected</span>
                      </div>
                    </div>
                  )}

                  {stage.id === 4 && (
                    <div className="text-center space-y-6">
                      <div className="relative w-32 h-32 mx-auto">
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-blue-400/30"
                          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <motion.div
                          className="absolute inset-4 rounded-full border-4 border-blue-400/50"
                          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                        />
                        <Eye className="w-16 h-16 mx-auto text-blue-400 absolute inset-0 m-auto" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Eye Contact", value: "78%", color: "text-blue-400" },
                          { label: "Focus", value: "82%", color: "text-emerald-400" },
                          { label: "Distractions", value: "4", color: "text-amber-400" }
                        ].map((stat, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="p-3 bg-muted/50 rounded-lg text-center"
                          >
                            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {stage.id === 5 && (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <MessageSquareText className="w-8 h-8 text-green-400" />
                      </div>
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                        <p className="text-sm text-green-400 font-medium mb-2">Sample Feedback:</p>
                        <p className="text-sm text-muted-foreground italic">
                          "I'm really enjoying this course! The material is challenging but engaging. 
                          I had some questions about the last assignment..."
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <motion.div
                            className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center mx-auto mb-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <span className="text-xl font-bold text-emerald-400">70%</span>
                          </motion.div>
                          <span className="text-xs text-muted-foreground">Positive</span>
                        </div>
                        <div className="text-center">
                          <motion.div
                            className="w-20 h-20 rounded-full border-4 border-amber-400 flex items-center justify-center mx-auto mb-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <span className="text-xl font-bold text-amber-400">8</span>
                          </motion.div>
                          <span className="text-xs text-muted-foreground">Questions</span>
                        </div>
                        <div className="text-center">
                          <motion.div
                            className="w-20 h-20 rounded-full border-4 border-cyan-400 flex items-center justify-center mx-auto mb-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                          >
                            <span className="text-xl font-bold text-cyan-400">3</span>
                          </motion.div>
                          <span className="text-xs text-muted-foreground">Help Req</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {stage.id === 6 && (
                    <div className="text-center space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-cyan-400 rounded-full flex items-center justify-center"
                      >
                        <Target className="w-12 h-12 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-emerald-400">Success Predicted</h3>
                        <p className="text-muted-foreground">85% Confidence</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">MLP: B+</span>
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">LSTM: ↗️</span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Vision: Engaged</span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">NLP: Positive</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Right: Results */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-1 space-y-4"
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Prediction */}
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Prediction</p>
                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xl font-bold text-emerald-400"
                    >
                      {stage.result.prediction}
                    </motion.p>
                    {stage.result.confidence > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-medium">{(stage.result.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={stage.result.confidence * 100} className="h-2" />
                      </div>
                    )}
                  </div>

                  {/* Key Factors */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      Key Factors
                    </h4>
                    <ul className="space-y-2">
                      {stage.result.factors.map((factor, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Zap className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" />
                          {factor}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-lg border border-cyan-500/30">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-cyan-400" />
                      Recommendation
                    </h4>
                    <p className="text-sm text-muted-foreground">{stage.result.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Initial State - Before Starting */
        <Card className="bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-emerald-500/5 border-dashed border-cyan-500/30">
          <CardContent className="p-12 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full flex items-center justify-center"
            >
              <Users className="w-12 h-12 text-cyan-400" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4">Student Performance Prediction System</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              This interactive simulation demonstrates how NeuroVista's neural network modules work together 
              in a real-world educational application. See how MLP, LSTM, Vision, and Sentiment modules 
              combine to predict student success and provide actionable insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "MLP", desc: "Performance Prediction", icon: Layers, color: "text-emerald-400" },
                { name: "LSTM", desc: "Progress Tracking", icon: Clock, color: "text-amber-400" },
                { name: "Vision", desc: "Attention Analysis", icon: Eye, color: "text-blue-400" },
                { name: "NLP", desc: "Sentiment Analysis", icon: MessageSquareText, color: "text-green-400" }
              ].map((mod, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <mod.icon className={`w-5 h-5 ${mod.color}`} />
                  <div className="text-left">
                    <p className="text-sm font-medium">{mod.name}</p>
                    <p className="text-xs text-muted-foreground">{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Controls */}
      {showDetails && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStage}
            disabled={currentStage === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Stage
          </Button>

          <div className="flex gap-1">
            {SCENARIO_STAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStage ? "bg-cyan-400 w-4" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextStage}
            disabled={currentStage === SCENARIO_STAGES.length - 1}
            className="gap-2"
          >
            Next Stage
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
