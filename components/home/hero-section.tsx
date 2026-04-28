"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroVisualization } from "./hero-visualization"
import { interactiveModuleCount } from "@/lib/modules"

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative w-full px-8 py-12 flex items-center gap-12">
        {/* Text Content */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Interactive 3D Learning</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6 text-balance">
              Understand Neural Networks{" "}
              <span className="text-primary">Visually</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
              Explore the fascinating world of artificial intelligence through interactive 
              3D visualizations. Watch neurons fire, connections form, and models learn 
              in real-time as you build intuition for how AI really works.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/perceptron">
                <Button size="lg" className="gap-2">
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/comparison">
                <Button variant="outline" size="lg">
                  View Comparison
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-8 mt-12 pt-8 border-t border-border"
          >
      <div>
          <div className="text-3xl font-bold text-primary">{interactiveModuleCount}</div>
          <div className="text-sm text-muted-foreground">Interactive Modules</div>
        </div>
            <div>
              <div className="text-3xl font-bold text-primary">Real-time</div>
              <div className="text-sm text-muted-foreground">3D Visualizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Hands-on</div>
              <div className="text-sm text-muted-foreground">ML Experimentation</div>
            </div>
          </motion.div>
        </div>

        {/* 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 h-[500px] relative"
        >
          <HeroVisualization />
        </motion.div>
      </div>
    </section>
  )
}
