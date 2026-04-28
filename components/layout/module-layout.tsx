"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModuleLayoutProps {
  title: string;
  subtitle: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  children: ReactNode;
}

const difficultyConfig = {
  beginner: { label: "Beginner", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  intermediate: { label: "Intermediate", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  advanced: { label: "Advanced", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function ModuleLayout({ title, subtitle, difficulty, children }: ModuleLayoutProps) {
  const diffConfig = difficultyConfig[difficulty];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">{title}</h1>
                  <Badge className={diffConfig.color}>{diffConfig.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
