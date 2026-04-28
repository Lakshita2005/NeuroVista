"use client"

import { motion } from "framer-motion"
import { 
  Brain, 
  Layers, 
  GitCompare, 
  ArrowRight, 
  Network, 
  Eye, 
  MessageSquareText, 
  Box, 
  HelpCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const modules = [
  {
    title: "Perceptron",
    description: "Start with the fundamental building block of neural networks. Learn how a single neuron makes decisions through weighted inputs and activation functions.",
    icon: Brain,
    href: "/perceptron",
    color: "from-cyan-500/20 to-cyan-500/5",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    features: ["Binary Classification", "Interactive Weights", "Admission Predictor Demo"]
  },
  {
    title: "Multi-Layer Perceptron",
    description: "Discover how multiple layers of neurons work together to solve complex problems that single neurons cannot handle.",
    icon: Layers,
    href: "/mlp",
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    features: ["Hidden Layers", "Training Visualization", "Student Performance Predictor"]
  },
  {
    title: "Comparison Lab",
    description: "See the limitations of single neurons and how multi-layer networks overcome them. The XOR problem comes alive.",
    icon: GitCompare,
    href: "/comparison",
    color: "from-violet-500/20 to-violet-500/5",
    borderColor: "border-violet-500/30",
    iconColor: "text-violet-400",
    features: ["Side-by-Side View", "XOR Problem", "Decision Boundaries"]
  },
  {
    title: "LSTM Time-Series",
    description: "Long Short-Term Memory networks for sequential data analysis. Predict student productivity and burnout risk from time-series patterns.",
    icon: Clock,
    href: "/lstm",
    color: "from-pink-500/20 to-pink-500/5",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-400",
    features: ["Productivity Prediction", "Burnout Detection", "Sequential Analysis"]
  },
  {
    title: "Hopfield Network",
    description: "Explore associative memory networks that can store and recover patterns. Watch corrupted inputs converge to stored memories.",
    icon: Network,
    href: "/hopfield",
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    features: ["Pattern Storage", "Memory Recovery", "Energy Minimization"]
  },
  {
    title: "Computer Vision",
    description: "Student Focus & Engagement Analyzer using OpenCV. Detect attention levels and engagement states in real-time.",
    icon: Eye,
    href: "/vision",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    features: ["Focus Detection", "Attention Scoring", "OpenCV Integration"]
  },
  {
    title: "Sentiment Analysis",
    description: "Analyze text emotions and sentiments. Understand how NLP models process and understand human language.",
    icon: MessageSquareText,
    href: "/sentiment",
    color: "from-green-500/20 to-green-500/5",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
    features: ["Emotion Detection", "Aspect Analysis", "Attention Weights"]
  },
  {
    title: "Black Box Unboxing",
    description: "Understand how AI systems make decisions. Visualize data flow through the complete neural network pipeline.",
    icon: Box,
    href: "/blackbox",
    color: "from-amber-500/20 to-amber-500/5",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    features: ["Pipeline Flow", "Decision Visualization", "Explainable AI"]
  },
  {
    title: "Knowledge Quiz",
    description: "Test your understanding with interactive quizzes. Track your progress and identify areas for improvement.",
    icon: HelpCircle,
    href: "/quiz",
    color: "from-rose-500/20 to-rose-500/5",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
    features: ["Topic-wise Quizzes", "Score Tracking", "Weak Area Detection"]
  }
]

export function ModuleCards() {
  return (
    <section className="px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Learning Modules</h2>
        <p className="text-muted-foreground max-w-2xl">
          Progress through interactive modules designed to build your understanding
          from basic neurons to complex networks.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon
          return (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`group h-full bg-gradient-to-br ${module.color} border ${module.borderColor} hover:border-primary/50 transition-all duration-300`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-card/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${module.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {module.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={module.href}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Explore Module
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
