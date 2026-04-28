"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain,
  Clock,
  Database,
  Trash2,
  DoorOpen,
  DoorClosed,
  MessageSquare,
  Mic,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Layers
} from "lucide-react"

const applications = [
  {
    icon: MessageSquare,
    title: "Text Prediction",
    description: "Predicting the next word in a sentence based on previous context",
    example: "Type 'The cat sat on the...' → LSTM predicts 'mat' or 'chair'",
    color: "text-blue-400"
  },
  {
    icon: Mic,
    title: "Speech Recognition",
    description: "Converting audio signals to text by understanding phoneme sequences",
    example: "Processing audio frames to recognize spoken words",
    color: "text-purple-400"
  },
  {
    icon: TrendingUp,
    title: "Time Series Forecasting",
    description: "Predicting future values based on historical patterns",
    example: "Stock prices, weather forecasting, energy demand",
    color: "text-green-400"
  },
  {
    icon: Database,
    title: "Machine Translation",
    description: "Translating sentences while preserving meaning across languages",
    example: "English → French, maintaining grammatical structure",
    color: "text-amber-400"
  }
]

const whyRNNFails = [
  {
    title: "Short-term Memory Only",
    description: "RNNs can only remember the most recent inputs effectively",
    icon: Clock
  },
  {
    title: "Vanishing Gradients",
    description: "Gradients become exponentially small during backpropagation through time",
    icon: AlertTriangle
  },
  {
    title: "Cannot Learn Long Dependencies",
    description: "Information from 10+ steps ago is essentially lost",
    icon: Layers
  }
]

const lstmSolutions = [
  {
    title: "Forget Gate",
    description: "Decides what information to throw away from the cell state",
    icon: Trash2,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20"
  },
  {
    title: "Input Gate",
    description: "Decides what new information to store in the cell state",
    icon: DoorOpen,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
  },
  {
    title: "Output Gate",
    description: "Decides what parts of the cell state to output",
    icon: DoorClosed,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  }
]

export function LSTMEducation() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-cyan-500/10 border-pink-500/20">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-pink-500/20 flex items-center justify-center shrink-0">
              <Brain className="w-10 h-10 text-pink-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">What is LSTM?</h2>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-pink-400 font-semibold">Long Short-Term Memory</span> networks are a special 
                kind of Recurrent Neural Network (RNN) designed to remember information for long periods. 
                They solve the problem of &quot;short-term memory&quot; that plagues traditional RNNs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Problem: Why RNN Fails */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <CardTitle>Why RNN Fails</CardTitle>
              <CardDescription>The vanishing gradient problem</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Imagine reading a long paragraph and trying to remember the first sentence by the time 
            you reach the last. For humans it&apos;s easy, but for basic RNNs, it&apos;s nearly impossible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whyRNNFails.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-rose-400" />
                </div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Analogy */}
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-rose-400">The Whispering Game Analogy</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Like the telephone game where a message gets distorted as it passes through people, 
                  RNNs lose information as it flows through time steps. By the end, the message 
                  is barely recognizable!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Solution: LSTM Gates */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle>The LSTM Solution</CardTitle>
              <CardDescription>Three gates that control information flow</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            LSTMs solve the memory problem by introducing a <span className="text-amber-400 font-semibold">cell state</span> 
            (like a conveyor belt) that runs through the entire chain with minimal interactions, 
            and <span className="text-pink-400 font-semibold">three gates</span> that carefully regulate what information passes through.
          </p>

          <div className="space-y-3">
            {lstmSolutions.map((gate, index) => (
              <motion.div
                key={gate.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`p-4 ${gate.bgColor} border ${gate.borderColor} rounded-lg cursor-pointer hover:scale-[1.02] transition-transform`}
                onClick={() => setActiveSection(activeSection === gate.title ? null : gate.title)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${gate.bgColor} flex items-center justify-center shrink-0`}>
                    <gate.icon className={`w-6 h-6 ${gate.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${gate.color} mb-1`}>{gate.title}</h4>
                    <p className="text-sm text-muted-foreground">{gate.description}</p>
                    
                    <AnimatePresence>
                      {activeSection === gate.title && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-white/10"
                        >
                          <p className="text-xs text-muted-foreground">
                            {gate.title === "Forget Gate" && 
                              "Uses a sigmoid function to output numbers between 0 and 1 for each number in the cell state. 1 means 'keep this completely' while 0 means 'forget this completely'."}
                            {gate.title === "Input Gate" && 
                              "Has two parts: a sigmoid layer that decides which values to update, and a tanh layer that creates candidate values that could be added to the state."}
                            {gate.title === "Output Gate" && 
                              "First runs a sigmoid layer to decide what parts of the cell state to output, then puts the cell state through tanh and multiplies it by the sigmoid output."}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <ArrowRight className={`w-5 h-5 ${gate.color} transition-transform ${activeSection === gate.title ? 'rotate-90' : ''}`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* The Conveyor Belt Analogy */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-400">The Conveyor Belt Analogy</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Think of the cell state as a conveyor belt running through the LSTM. Information 
                  can ride along it unchanged, or the gates can add/remove items. This allows 
                  information to flow through hundreds of time steps without degradation!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Applications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle>Real-World Applications</CardTitle>
              <CardDescription>Where LSTMs shine in practice</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app, index) => (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <app.icon className={`w-5 h-5 ${app.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      {app.title}
                      <Badge variant="outline" className="text-xs">Popular</Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">{app.description}</p>
                    <p className="text-xs text-slate-400 italic">{app.example}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-pink-400" />
            Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {[
              "LSTMs remember long-term dependencies better than regular RNNs",
              "Three gates (forget, input, output) control information flow",
              "The cell state acts as a 'conveyor belt' for information",
              "LSTMs are widely used in NLP, speech recognition, and time series forecasting",
              "They solve the vanishing gradient problem that plagued earlier RNNs"
            ].map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {point}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Interactive Prompt */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-3">
          Ready to see LSTM in action?
        </p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" className="gap-2">
            <Brain className="w-4 h-4" />
            Try the Cell Visualizer
          </Button>
          <Button className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Try Word Simulator
          </Button>
        </div>
      </div>
    </div>
  )
}
