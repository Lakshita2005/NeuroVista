"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Brain, Layers, Zap } from "lucide-react"

export function SentimentTheory() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            What is Sentiment Analysis?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Sentiment Analysis (or Opinion Mining) is the use of natural language processing (NLP) 
            and machine learning to identify and extract subjective information from text. It helps 
            determine whether the emotional tone of a piece of text is <span className="text-green-400">positive</span>, 
            <span className="text-red-400"> negative</span>, or <span className="text-gray-400">neutral</span>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Beyond simple polarity detection, modern sentiment analysis includes emotion detection, 
            aspect-based analysis, and fine-grained sentiment classification.
          </p>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-cyan-400" />
              Emotion Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Emotion detection goes beyond polarity to identify specific emotions like joy, anger, 
              sadness, fear, surprise, and disgust.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Joy", color: "bg-yellow-500/20 text-yellow-400" },
                { name: "Anger", color: "bg-red-500/20 text-red-400" },
                { name: "Sadness", color: "bg-blue-500/20 text-blue-400" },
                { name: "Fear", color: "bg-purple-500/20 text-purple-400" },
                { name: "Surprise", color: "bg-orange-500/20 text-orange-400" },
                { name: "Disgust", color: "bg-green-500/20 text-green-400" }
              ].map(emotion => (
                <div key={emotion.name} className={`p-2 rounded text-center text-sm ${emotion.color}`}>
                  {emotion.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="w-5 h-5 text-purple-400" />
              Aspect-Based Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Aspect-based sentiment analysis identifies specific features or aspects of a product/service 
              and determines sentiment for each aspect separately.
            </p>
            <div className="p-3 bg-muted/20 rounded text-sm font-mono">
              <p className="text-green-400">Quality: Positive (+)</p>
              <p className="text-red-400">Price: Negative (-)</p>
              <p className="text-green-400">Service: Positive (+)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            NLP Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "Input", desc: "Raw Text" },
              { name: "Tokenize", desc: "Words/Tokens" },
              { name: "Preprocess", desc: "Clean & Normalize" },
              { name: "Features", desc: "Embeddings" },
              { name: "Model", desc: "ML/Deep Learning" },
              { name: "Output", desc: "Sentiment" }
            ].map((step, i) => (
              <motion.div
                key={step.name}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 bg-muted/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-medium text-sm">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
                {i < 5 && (
                  <div className="hidden md:block absolute" style={{ marginLeft: "5rem" }}>
                    <div className="w-8 h-0.5 bg-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Real-World Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Brand Monitoring",
                description: "Track public perception of brands across social media and reviews.",
                color: "text-blue-400"
              },
              {
                title: "Customer Support",
                description: "Prioritize urgent issues by detecting frustration or anger in tickets.",
                color: "text-red-400"
              },
              {
                title: "Market Research",
                description: "Analyze product reviews to understand customer preferences.",
                color: "text-green-400"
              }
            ].map((app, i) => (
              <motion.div
                key={app.title}
                className="p-4 bg-muted/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className={`font-medium ${app.color} mb-2`}>{app.title}</h4>
                <p className="text-sm text-muted-foreground">{app.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
