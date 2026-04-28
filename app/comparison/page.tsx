"use client"

import { AppShell } from "@/components/layout/app-shell"
import { XORComparison } from "@/components/comparison/xor-comparison"
import { DecisionBoundaries } from "@/components/comparison/decision-boundaries"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { GitCompare, Grid3X3, Layers } from "lucide-react"

export default function ComparisonPage() {
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
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <GitCompare className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Perceptron vs MLP</h1>
              <p className="text-muted-foreground">See why single neurons fail and how multiple layers succeed</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="xor" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="xor" className="gap-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <Grid3X3 className="w-4 h-4" />
              XOR Problem
            </TabsTrigger>
            <TabsTrigger value="boundaries" className="gap-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white">
              <Layers className="w-4 h-4" />
              Decision Boundaries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="xor">
            <XORComparison />
          </TabsContent>

          <TabsContent value="boundaries">
            <DecisionBoundaries />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
