"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/layout/app-shell"
import { HopfieldPlayground } from "@/components/hopfield/hopfield-playground"
import { HopfieldTheory } from "@/components/hopfield/hopfield-theory"
import { MemoryRecovery } from "@/components/hopfield/memory-recovery"
import { motion } from "framer-motion"
import { Network, BookOpen, Sparkles } from "lucide-react"

export default function HopfieldPage() {
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
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Network className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Hopfield Network</h1>
              <p className="text-muted-foreground">Associative memory and pattern recovery through energy minimization</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="playground" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="playground" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-purple-foreground">
              <Network className="w-4 h-4" />
              Interactive Playground
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-purple-foreground">
              <Sparkles className="w-4 h-4" />
              Memory Recovery
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-purple-foreground">
              <BookOpen className="w-4 h-4" />
              Learn the Theory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground">
            <HopfieldPlayground />
          </TabsContent>

          <TabsContent value="memory">
            <MemoryRecovery />
          </TabsContent>

          <TabsContent value="theory">
            <HopfieldTheory />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
