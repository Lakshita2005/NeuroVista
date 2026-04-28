"use client"

import { AppShell } from "@/components/layout/app-shell"
import { PerceptronPlayground } from "@/components/perceptron/perceptron-playground"
import { PerceptronTheory } from "@/components/perceptron/perceptron-theory"
import { AdmissionPredictor } from "@/components/perceptron/admission-predictor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Brain, BookOpen, GraduationCap } from "lucide-react"

export default function PerceptronPage() {
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
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">The Perceptron</h1>
              <p className="text-muted-foreground">The fundamental building block of neural networks</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="playground" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="playground" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Brain className="w-4 h-4" />
              Interactive Playground
            </TabsTrigger>
            <TabsTrigger value="theory" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="w-4 h-4" />
              Learn the Theory
            </TabsTrigger>
            <TabsTrigger value="demo" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <GraduationCap className="w-4 h-4" />
              Admission Predictor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playground">
            <PerceptronPlayground />
          </TabsContent>

          <TabsContent value="theory">
            <PerceptronTheory />
          </TabsContent>

          <TabsContent value="demo">
            <AdmissionPredictor />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
