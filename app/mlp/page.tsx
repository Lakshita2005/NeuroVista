"use client"

import { AppShell } from "@/components/layout/app-shell"
import { MLPPlayground } from "@/components/mlp/mlp-playground"
import { MLPTheory } from "@/components/mlp/mlp-theory"
import { StudentPredictor } from "@/components/mlp/student-predictor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Layers, BookOpen, GraduationCap } from "lucide-react"

export default function MLPPage() {
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
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Layers className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Multi-Layer Perceptron</h1>
              <p className="text-muted-foreground">Deep networks that can solve complex, non-linear problems</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="playground" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="playground" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-emerald-foreground">
              <Layers className="w-4 h-4" />
              Interactive Playground
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-emerald-foreground">
              <BookOpen className="w-4 h-4" />
              Learn the Theory
            </TabsTrigger>
            <TabsTrigger value="demo" className="gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-emerald-foreground">
              <GraduationCap className="w-4 h-4" />
              Student Predictor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground">
            <MLPPlayground />
          </TabsContent>

          <TabsContent value="theory">
            <MLPTheory />
          </TabsContent>

          <TabsContent value="demo">
            <StudentPredictor />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
