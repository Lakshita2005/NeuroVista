"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/layout/app-shell"
import { LSTMTheory } from "@/components/lstm/lstm-theory"
import { LSTMVisualizer } from "@/components/lstm/lstm-visualizer"
import { LSTMSimulator } from "@/components/lstm/lstm-simulator"
import { LSTMComparison } from "@/components/lstm/lstm-comparison"
import { LSTMEducation } from "@/components/lstm/lstm-education"
import { motion } from "framer-motion"
import { Clock, BookOpen, Activity, GitCompare, Brain, Play } from "lucide-react"

export default function LSTMPage() {
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
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">LSTM Visual Learning Lab</h1>
              <p className="text-muted-foreground">
                Interactive educational module for understanding Long Short-Term Memory networks
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="visualizer" className="space-y-6">
          <TabsList className="bg-card border border-border flex-wrap h-auto">
            <TabsTrigger value="visualizer" className="gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-pink-foreground">
              <Activity className="w-4 h-4" />
              Cell Visualizer
            </TabsTrigger>
            <TabsTrigger value="simulator" className="gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-pink-foreground">
              <Play className="w-4 h-4" />
              Word Simulator
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-pink-foreground">
              <GitCompare className="w-4 h-4" />
              RNN vs LSTM
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-pink-foreground">
              <Brain className="w-4 h-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-pink-foreground">
              <BookOpen className="w-4 h-4" />
              Theory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizer">
            <LSTMVisualizer />
          </TabsContent>

          <TabsContent value="simulator">
            <LSTMSimulator />
          </TabsContent>

          <TabsContent value="comparison">
            <LSTMComparison />
          </TabsContent>

          <TabsContent value="education">
            <LSTMEducation />
          </TabsContent>

          <TabsContent value="theory">
            <LSTMTheory />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
