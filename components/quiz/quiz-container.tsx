"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Layers, 
  Network, 
  Eye, 
  MessageSquare,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  Target,
  AlertCircle
} from "lucide-react"

type Topic = "all" | "perceptron" | "mlp" | "hopfield" | "vision" | "nlp"

type Question = {
  id: number
  topic: Topic
  question: string
  options: string[]
  correct: number
  explanation: string
}

const QUESTIONS: Question[] = [
  // Perceptron Questions
  {
    id: 1,
    topic: "perceptron",
    question: "What is the primary function of a Perceptron?",
    options: [
      "Binary classification",
      "Image generation",
      "Memory storage",
      "Natural language translation"
    ],
    correct: 0,
    explanation: "A Perceptron is a binary classifier that makes decisions by computing a weighted sum of inputs and applying an activation function."
  },
  {
    id: 2,
    topic: "perceptron",
    question: "What is the Perceptron Learning Rule based on?",
    options: [
      "Random weight updates",
      "Error correction",
      "Gradient descent",
      "Hebbian learning"
    ],
    correct: 1,
    explanation: "The Perceptron Learning Rule updates weights based on the error between predicted and actual outputs."
  },
  {
    id: 3,
    topic: "perceptron",
    question: "Can a single Perceptron solve the XOR problem?",
    options: [
      "Yes, with proper training",
      "Yes, with sigmoid activation",
      "No, it's not linearly separable",
      "Only with momentum"
    ],
    correct: 2,
    explanation: "A single Perceptron cannot solve XOR because XOR is not linearly separable - you need a multi-layer network."
  },
  
  // MLP Questions
  {
    id: 4,
    topic: "mlp",
    question: "What does MLP stand for?",
    options: [
      "Machine Learning Protocol",
      "Multi-Layer Perceptron",
      "Maximum Likelihood Probability",
      "Matrix Linear Processing"
    ],
    correct: 1,
    explanation: "MLP stands for Multi-Layer Perceptron, a feedforward neural network with multiple layers."
  },
  {
    id: 5,
    topic: "mlp",
    question: "What is the purpose of hidden layers in an MLP?",
    options: [
      "To increase model size",
      "To learn non-linear patterns",
      "To speed up training",
      "To reduce memory usage"
    ],
    correct: 1,
    explanation: "Hidden layers allow MLPs to learn non-linear patterns and solve problems that single-layer networks cannot."
  },
  {
    id: 6,
    topic: "mlp",
    question: "Which activation function helps solve the vanishing gradient problem?",
    options: [
      "Sigmoid",
      "Tanh",
      "ReLU",
      "Step function"
    ],
    correct: 2,
    explanation: "ReLU (Rectified Linear Unit) helps mitigate the vanishing gradient problem by not saturating for positive values."
  },
  
  // Hopfield Questions
  {
    id: 7,
    topic: "hopfield",
    question: "What type of network is a Hopfield Network?",
    options: [
      "Feedforward",
      "Convolutional",
      "Recurrent",
      "Transformer"
    ],
    correct: 2,
    explanation: "Hopfield Networks are recurrent networks where connections form a complete graph, allowing patterns to be stored as attractors."
  },
  {
    id: 8,
    topic: "hopfield",
    question: "What learning rule does Hopfield Network use?",
    options: [
      "Backpropagation",
      "Hebbian learning",
      "Q-learning",
      "Reinforcement learning"
    ],
    correct: 1,
    explanation: "Hopfield Networks use Hebbian learning: 'Neurons that fire together, wire together'."
  },
  {
    id: 9,
    topic: "hopfield",
    question: "What is the approximate storage capacity of a Hopfield Network?",
    options: [
      "N patterns",
      "2N patterns",
      "0.138N patterns",
      "log N patterns"
    ],
    correct: 2,
    explanation: "A Hopfield Network with N neurons can reliably store approximately 0.138N patterns."
  },
  
  // Computer Vision Questions
  {
    id: 10,
    topic: "vision",
    question: "What is the primary building block of CNNs?",
    options: [
      "Fully connected layers",
      "Convolutional layers",
      "Recurrent cells",
      "Attention heads"
    ],
    correct: 1,
    explanation: "Convolutional layers are the primary building blocks of CNNs, using filters to detect local patterns."
  },
  {
    id: 11,
    topic: "vision",
    question: "What does pooling do in a CNN?",
    options: [
      "Increases dimensions",
      "Reduces spatial size",
      "Adds non-linearity",
      "Normalizes weights"
    ],
    correct: 1,
    explanation: "Pooling reduces spatial dimensions, making the network more computationally efficient and translation-invariant."
  },
  {
    id: 12,
    topic: "vision",
    question: "Which layer detects edges and simple features in early CNN stages?",
    options: [
      "Fully connected",
      "First convolutional",
      "Last convolutional",
      "Output"
    ],
    correct: 1,
    explanation: "Early convolutional layers detect simple features like edges and textures, while deeper layers detect complex patterns."
  },
  
  // NLP Questions
  {
    id: 13,
    topic: "nlp",
    question: "What is the main goal of sentiment analysis?",
    options: [
      "Generate text",
      "Translate languages",
      "Determine emotional tone",
      "Correct grammar"
    ],
    correct: 2,
    explanation: "Sentiment analysis aims to determine the emotional tone or polarity (positive/negative/neutral) of text."
  },
  {
    id: 14,
    topic: "nlp",
    question: "What does tokenization do in NLP?",
    options: [
      "Translates text",
      "Splits text into units",
      "Corrects spelling",
      "Generates summaries"
    ],
    correct: 1,
    explanation: "Tokenization splits text into smaller units like words, subwords, or characters for processing."
  },
  {
    id: 15,
    topic: "nlp",
    question: "What is word embedding?",
    options: [
      "Spell checking",
      "Vector representation of words",
      "Text summarization",
      "Speech recognition"
    ],
    correct: 1,
    explanation: "Word embeddings are dense vector representations that capture semantic meaning and relationships between words."
  }
]

export function QuizContainer() {
  const [activeTopic, setActiveTopic] = useState<Topic>("all")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({})
  const [quizComplete, setQuizComplete] = useState(false)

  const filteredQuestions = activeTopic === "all" 
    ? QUESTIONS 
    : QUESTIONS.filter(q => q.topic === activeTopic)

  const currentQ = filteredQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100
  const score = Object.values(answers).filter(Boolean).length

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
    setAnswers(prev => ({ ...prev, [currentQ.id]: index === currentQ.correct }))
  }

  const nextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizComplete(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setAnswers({})
    setQuizComplete(false)
  }

  const getTopicIcon = (topic: Topic) => {
    switch (topic) {
      case "perceptron": return Brain
      case "mlp": return Layers
      case "hopfield": return Network
      case "vision": return Eye
      case "nlp": return MessageSquare
      default: return Target
    }
  }

  const getTopicColor = (topic: Topic) => {
    switch (topic) {
      case "perceptron": return "text-cyan-400"
      case "mlp": return "text-emerald-400"
      case "hopfield": return "text-purple-400"
      case "vision": return "text-blue-400"
      case "nlp": return "text-green-400"
      default: return "text-rose-400"
    }
  }

  if (quizComplete) {
    const percentage = Math.round((score / filteredQuestions.length) * 100)
    const weakAreas: Topic[] = []
    
    // Calculate weak areas
    const topicScores: { [key: string]: { correct: number; total: number } } = {}
    filteredQuestions.forEach(q => {
      if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 }
      topicScores[q.topic].total++
      if (answers[q.id]) topicScores[q.topic].correct++
    })
    
    Object.entries(topicScores).forEach(([topic, scores]) => {
      if (scores.correct / scores.total < 0.6) {
        weakAreas.push(topic as Topic)
      }
    })

    return (
      <Card className="bg-card border-border max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          <CardDescription className="text-xl">
            You scored {score} out of {filteredQuestions.length} ({percentage}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score breakdown */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Performance</span>
              <span className={percentage >= 80 ? "text-green-400" : percentage >= 60 ? "text-yellow-400" : "text-red-400"}>
                {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good job!" : "Keep practicing!"}
              </span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          {/* Weak areas */}
          {weakAreas.length > 0 && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-medium">Areas to review:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {weakAreas.map(topic => (
                  <span key={topic} className="text-sm px-2 py-1 bg-muted rounded capitalize">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button onClick={resetQuiz} className="w-full gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Topic Filter */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Select Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTopic} onValueChange={(v) => {
            setActiveTopic(v as Topic)
            setCurrentQuestion(0)
            setSelectedAnswer(null)
            setShowExplanation(false)
            setAnswers({})
          }}>
            <TabsList className="flex flex-wrap h-auto gap-2">
              <TabsTrigger value="all" className="gap-1">
                <Target className="w-4 h-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="perceptron" className="gap-1">
                <Brain className="w-4 h-4" />
                Perceptron
              </TabsTrigger>
              <TabsTrigger value="mlp" className="gap-1">
                <Layers className="w-4 h-4" />
                MLP
              </TabsTrigger>
              <TabsTrigger value="hopfield" className="gap-1">
                <Network className="w-4 h-4" />
                Hopfield
              </TabsTrigger>
              <TabsTrigger value="vision" className="gap-1">
                <Eye className="w-4 h-4" />
                Vision
              </TabsTrigger>
              <TabsTrigger value="nlp" className="gap-1">
                <MessageSquare className="w-4 h-4" />
                NLP
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = getTopicIcon(currentQ.topic)
                return <Icon className={`w-5 h-5 ${getTopicColor(currentQ.topic)}`} />
              })()}
              <span className={`text-sm font-medium capitalize ${getTopicColor(currentQ.topic)}`}>
                {currentQ.topic}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {filteredQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="text-lg font-medium">
            {currentQ.question}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQ.correct
              const showResult = selectedAnswer !== null

              let buttonClass = "w-full justify-start text-left p-4 h-auto "
              if (showResult) {
                if (isCorrect) {
                  buttonClass += "bg-green-500/20 border-green-500 hover:bg-green-500/30"
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-red-500/20 border-red-500 hover:bg-red-500/30"
                } else {
                  buttonClass += "bg-muted/30 opacity-50"
                }
              } else {
                buttonClass += "hover:bg-muted/50"
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      showResult 
                        ? isCorrect 
                          ? "bg-green-500 text-white" 
                          : isSelected 
                            ? "bg-red-500 text-white" 
                            : "bg-muted"
                        : "bg-muted"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                </Button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-muted/20 rounded-lg border-l-4 border-amber-500"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="text-amber-400 font-medium">Explanation: </span>
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {showExplanation && (
            <div className="flex justify-end">
              <Button onClick={nextQuestion} className="gap-2">
                {currentQuestion < filteredQuestions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Complete Quiz
                    <Trophy className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Score Summary */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Correct: {score}</span>
        <span>Incorrect: {Object.keys(answers).length - score}</span>
        <span>Remaining: {filteredQuestions.length - Object.keys(answers).length}</span>
      </div>
    </div>
  )
}
