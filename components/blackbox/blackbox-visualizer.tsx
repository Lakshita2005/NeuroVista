"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Brain, 
  Layers, 
  Network,
  Eye, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

type Stage = {
  id: string
  name: string
  icon: typeof Brain
  description: string
  color: string
  bgColor: string
  details: string
  example: string
}

const STAGES: Stage[] = [
  {
    id: "input",
    name: "Input",
    icon: Sparkles,
    description: "Raw data enters the system",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    details: "Data can be images, text, numbers, or any other format that the AI system can process.",
    example: "Example: A photo of a student, or text saying 'The student looks tired'"
  },
  {
    id: "perceptron",
    name: "Perceptron",
    icon: Brain,
    description: "Single neuron binary decision",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    details: "The perceptron makes a simple yes/no decision by weighing inputs and applying an activation function.",
    example: "Is there a face in the image? Yes or No."
  },
  {
    id: "mlp",
    name: "MLP",
    icon: Layers,
    description: "Multi-layer pattern recognition",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    details: "Multiple layers of neurons work together to recognize complex patterns that single neurons cannot handle.",
    example: "Recognizing facial features: eyes open, mouth position, head tilt."
  },
  {
    id: "hopfield",
    name: "Hopfield",
    icon: Network,
    description: "Memory-based pattern recovery",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    details: "Associative memory network that stores and recalls patterns, useful for remembering previous attention states.",
    example: "Recalling the student's typical engagement pattern."
  },
  {
    id: "cv",
    name: "Computer Vision",
    icon: Eye,
    description: "Visual feature extraction",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    details: "CNNs extract visual features like eye openness, head pose, and facial expressions from images.",
    example: "Measuring Eye Aspect Ratio (EAR), calculating head yaw/pitch."
  },
  {
    id: "nlp",
    name: "NLP",
    icon: MessageSquare,
    description: "Text understanding",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    details: "Natural Language Processing extracts meaning from text, detecting sentiment and context.",
    example: "Understanding: 'The student seems focused today' → positive sentiment."
  },
  {
    id: "output",
    name: "Output",
    icon: CheckCircle,
    description: "Final prediction",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    details: "All modules combine their insights to produce a final decision with confidence score.",
    example: "Final decision: Student is 'Focused' with 87% confidence."
  }
]

interface FlowState {
  stage: string
  status: "idle" | "processing" | "complete"
  data: any
}

export function BlackBoxVisualizer() {
  const [input, setInput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [results, setResults] = useState<{ [key: string]: any }>({})
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [expandedStage, setExpandedStage] = useState<string | null>(null)

  const runPipeline = useCallback(async () => {
    if (!input.trim()) return
    
    setIsRunning(true)
    setCurrentStage(0)
    setResults({})
    
    for (let i = 0; i < STAGES.length; i++) {
      setCurrentStage(i)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const stage = STAGES[i]
      let result = null
      
      switch (stage.id) {
        case "input":
          result = { 
            text: input, 
            tokens: input.split(/\s+/).length,
            type: input.length > 50 ? "text" : "short_text"
          }
          break
        case "perceptron":
          result = { 
            hasInput: input.length > 0,
            decision: input.length > 0 ? "Process" : "Reject",
            confidence: 0.95
          }
          break
        case "mlp":
          result = {
            hidden_activations: [0.7, 0.3, 0.9, 0.4, 0.6],
            features: ["face_present", "eyes_visible", "posture_detected"],
            confidence: 0.88
          }
          break
        case "hopfield":
          result = {
            pattern_match: "Student_A",
            similarity: 0.92,
            previous_state: "Focused",
            energy: -15.5
          }
          break
        case "cv":
          result = {
            features: {
              ear: 0.28,
              head_yaw: 0.15,
              head_pitch: -0.05,
              eyes_open: true
            },
            confidence: 0.91
          }
          break
        case "nlp":
          const isPositive = input.toLowerCase().includes("focus") || 
                              input.toLowerCase().includes("alert") ||
                              input.toLowerCase().includes("attentive")
          result = {
            sentiment: isPositive ? "positive" : "neutral",
            keywords: ["student", "focus", "attention"],
            confidence: isPositive ? 0.85 : 0.65
          }
          break
        case "output":
          const cvConf = results["cv"]?.confidence || 0.5
          const nlpConf = results["nlp"]?.confidence || 0.5
          const avgConfidence = (cvConf + nlpConf) / 2
          
          let finalState = "Distracted"
          if (avgConfidence > 0.75) finalState = "Focused"
          else if (avgConfidence < 0.4) finalState = "Sleepy"
          
          result = {
            final_prediction: finalState,
            confidence: avgConfidence,
            attention_score: Math.round(avgConfidence * 100),
            contributing_modules: ["CV", "NLP", "MLP"],
            explanation: "Based on visual features and text sentiment analysis"
          }
          break
      }
      
      setResults(prev => ({ ...prev, [stage.id]: result }))
    }
    
    setIsRunning(false)
  }, [input, results])

  const reset = () => {
    setInput("")
    setCurrentStage(0)
    setResults({})
    setShowDetails(null)
    setExpandedStage(null)
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Visualization */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-amber-400" />
            AI Pipeline Flow
          </CardTitle>
          <CardDescription>
            Watch data flow through the complete neural network pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pipeline Stages */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon
              const isActive = index === currentStage
              const isComplete = index < currentStage
              
              return (
                <div key={stage.id} className="flex items-center">
                  <motion.button
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      isActive 
                        ? `${stage.bgColor} border-current ${stage.color} ring-2 ring-current` 
                        : isComplete
                          ? "bg-muted/50 border-green-500/50"
                          : "bg-muted/20 border-muted hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: isRunning ? Infinity : 0, duration: 1 }}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? stage.color : isComplete ? "text-green-400" : ""}`} />
                    <p className={`text-xs mt-1 font-medium ${isActive ? stage.color : ""}`}>{stage.name}</p>
                    
                    {isComplete && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </motion.button>
                  
                  {index < STAGES.length - 1 && (
                    <ArrowRight className={`w-6 h-6 mx-2 ${
                      isComplete ? "text-green-400" : "text-muted-foreground/30"
                    }`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto space-y-4">
            <Textarea
              placeholder="Enter text to process through the AI pipeline..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px] bg-muted/30"
              disabled={isRunning}
            />
            
            <div className="flex justify-center gap-2">
              <Button 
                onClick={runPipeline} 
                disabled={!input.trim() || isRunning}
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                {isRunning ? "Processing..." : "Run Pipeline"}
              </Button>
              <Button variant="outline" onClick={reset} disabled={isRunning}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Details */}
      <AnimatePresence>
        {expandedStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const stage = STAGES.find(s => s.id === expandedStage)
                    if (!stage) return null
                    const Icon = stage.icon
                    return (
                      <>
                        <Icon className={`w-5 h-5 ${stage.color}`} />
                        <span>{stage.name} - {stage.description}</span>
                      </>
                    )
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      How it works
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {STAGES.find(s => s.id === expandedStage)?.details}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Example</h4>
                    <p className="text-sm text-muted-foreground">
                      {STAGES.find(s => s.id === expandedStage)?.example}
                    </p>
                  </div>

                  {results[expandedStage] && (
                    <div className="p-4 bg-muted/30 rounded-lg font-mono text-sm">
                      <pre>{JSON.stringify(results[expandedStage], null, 2)}</pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      {Object.keys(results).length > 0 && !isRunning && (
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Pipeline Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Final Prediction</p>
                <p className="text-xl font-bold text-amber-400">
                  {results.output?.final_prediction || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                <p className="text-xl font-bold text-green-400">
                  {results.output?.confidence ? `${(results.output.confidence * 100).toFixed(1)}%` : "N/A"}
                </p>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Attention Score</p>
                <p className="text-xl font-bold text-cyan-400">
                  {results.output?.attention_score || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Breakdown */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>How Each Module Contributes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                <span className="font-medium text-cyan-400">Perceptron & MLP</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Extract basic features and recognize patterns in the input data. The MLP's hidden layers 
                identify complex relationships that simpler models cannot capture.
              </p>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-blue-400">Computer Vision</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Analyzes visual features like eye openness, head pose, and facial expressions. 
                CNNs extract hierarchical features from raw pixel data.
              </p>
            </div>
            
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <span className="font-medium text-green-400">NLP</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Processes text input to understand sentiment, extract keywords, and 
                provide contextual understanding of descriptions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unboxing Concept */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Why "Unboxing"?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Traditional AI systems are often called "black boxes" because their internal decision-making 
            process is opaque. This module helps you understand:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-amber-400 mt-0.5" />
              <span>How data flows through different network architectures</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-amber-400 mt-0.5" />
              <span>How each module contributes to the final prediction</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-amber-400 mt-0.5" />
              <span>Why different network types are needed for different tasks</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-5 h-5 text-amber-400 mt-0.5" />
              <span>How confidence scores are calculated from multiple sources</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
