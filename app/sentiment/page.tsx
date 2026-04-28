"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/layout/app-shell"
import { SentimentAnalyzer } from "@/components/sentiment/sentiment-analyzer"
import { AspectAnalysis } from "@/components/sentiment/aspect-analysis"
import { SentimentTheory } from "@/components/sentiment/sentiment-theory"
import { motion } from "framer-motion"
import { MessageSquareText, GitBranch, BookOpen } from "lucide-react"

export default function SentimentPage() {
  return (
    <AppShell>
      <div className="min-h-screen p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <MessageSquareText className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sentiment Analysis</h1>
              <p className="text-muted-foreground">Emotion detection and aspect-based sentiment analysis</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="analyzer" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="analyzer" className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-green-foreground">
              <MessageSquareText className="w-4 h-4" />
              Text Analyzer
            </TabsTrigger>
            <TabsTrigger value="aspect" className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-green-foreground">
              <GitBranch className="w-4 h-4" />
              Aspect Analysis
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-green-foreground">
              <BookOpen className="w-4 h-4" />
              Learn the Theory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer">
            <SentimentAnalyzer />
          </TabsContent>

          <TabsContent value="aspect">
            <AspectAnalysis />
          </TabsContent>

          <TabsContent value="theory">
            <SentimentTheory />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
