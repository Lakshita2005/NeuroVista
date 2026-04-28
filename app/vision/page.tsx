"use client"

import { AppShell } from "@/components/layout/app-shell"
import { MLFocusAnalyzer } from "@/components/vision/ml-focus-analyzer"
import { VisionTheory } from "@/components/vision/vision-theory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Eye, Brain, BookOpen } from "lucide-react"

export default function VisionPage() {
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
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Computer Vision</h1>
              <p className="text-muted-foreground">ML-Based Student Focus & Engagement Analyzer</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="analyzer" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="analyzer" className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-blue-foreground">
              <Brain className="w-4 h-4" />
              ML Focus Analyzer
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-blue-foreground">
              <BookOpen className="w-4 h-4" />
              Learn the Theory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer">
            <MLFocusAnalyzer />
          </TabsContent>

          <TabsContent value="theory">
            <VisionTheory />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
