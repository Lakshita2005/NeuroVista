"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { 
  Box, 
  Eye, 
  BookOpen, 
  GitBranch, 
  Play, 
  Target, 
  Clock, 
  Layers,
  Sparkles,
  Network
} from "lucide-react"
import { NeuralNetworkTimeline } from "@/components/blackbox/nn-timeline"
import { PipelineVisualizer } from "@/components/blackbox/pipeline-visualizer"
import { BlackBoxReveal } from "@/components/blackbox/blackbox-reveal"
import { ModuleNetworkGraph } from "@/components/blackbox/module-network"
import { StudentPerformanceSystem } from "@/components/blackbox/student-performance-system"
import { BlackBoxTheory } from "@/components/blackbox/blackbox-theory"

export default function BlackBoxPage() {
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
              <Box className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Neural Network Journey Explorer</h1>
              <p className="text-muted-foreground">Discover how neural networks evolved and how all modules connect</p>
            </div>
          </div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="bg-card border border-border flex-wrap h-auto">
            <TabsTrigger value="timeline" className="gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-cyan-foreground">
              <Clock className="w-4 h-4" />
              Evolution Timeline
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-emerald-foreground">
              <Layers className="w-4 h-4" />
              Pipeline Flow
            </TabsTrigger>
            <TabsTrigger value="reveal" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-purple-foreground">
              <Eye className="w-4 h-4" />
              Open the Box
            </TabsTrigger>
            <TabsTrigger value="network" className="gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-blue-foreground">
              <Network className="w-4 h-4" />
              Module Network
            </TabsTrigger>
            <TabsTrigger value="scenario" className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-amber-foreground">
              <Play className="w-4 h-4" />
              Real-World Story
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-pink-foreground">
              <BookOpen className="w-4 h-4" />
              Theory
            </TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <NeuralNetworkTimeline />
            </motion.div>
          </TabsContent>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PipelineVisualizer />
            </motion.div>
          </TabsContent>

          {/* Reveal Tab */}
          <TabsContent value="reveal">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BlackBoxReveal />
            </motion.div>
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ModuleNetworkGraph />
            </motion.div>
          </TabsContent>

          {/* Scenario Tab */}
          <TabsContent value="scenario">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StudentPerformanceSystem />
            </motion.div>
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BlackBoxTheory />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
