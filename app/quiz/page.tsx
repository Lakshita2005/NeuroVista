"use client"

import { AppShell } from "@/components/layout/app-shell"
import { QuizContainer } from "@/components/quiz/quiz-container"
import { motion } from "framer-motion"
import { HelpCircle, GraduationCap, Trophy } from "lucide-react"

export default function QuizPage() {
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
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Knowledge Quiz</h1>
              <p className="text-muted-foreground">Test your understanding of neural networks</p>
            </div>
          </div>
        </motion.div>

        {/* Quiz Container */}
        <QuizContainer />
      </div>
    </AppShell>
  )
}
