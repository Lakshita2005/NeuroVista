"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight, Layers, Brain, Zap } from "lucide-react";

const comparisonData = [
  {
    feature: "Architecture",
    perceptron: "Single layer (input → output)",
    mlp: "Multiple layers with hidden neurons",
    icon: Layers,
  },
  {
    feature: "Decision Boundary",
    perceptron: "Linear only (straight line)",
    mlp: "Non-linear (curves, regions)",
    icon: Brain,
  },
  {
    feature: "Learning Capability",
    perceptron: "Linearly separable problems",
    mlp: "Any continuous function (Universal Approximator)",
    icon: Zap,
  },
  {
    feature: "XOR Problem",
    perceptron: "Cannot solve",
    mlp: "Solves easily",
    icon: XCircle,
  },
];

const problemTypes = [
  {
    name: "AND Gate",
    canPerceptron: true,
    canMLP: true,
    description: "Output 1 only when both inputs are 1",
  },
  {
    name: "OR Gate",
    canPerceptron: true,
    canMLP: true,
    description: "Output 1 when at least one input is 1",
  },
  {
    name: "NOT Gate",
    canPerceptron: true,
    canMLP: true,
    description: "Invert the input",
  },
  {
    name: "XOR Gate",
    canPerceptron: false,
    canMLP: true,
    description: "Output 1 when inputs differ",
  },
  {
    name: "XNOR Gate",
    canPerceptron: false,
    canMLP: true,
    description: "Output 1 when inputs are same",
  },
  {
    name: "Image Classification",
    canPerceptron: false,
    canMLP: true,
    description: "Recognize patterns in images",
  },
];

export function ComparisonTheory() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Understanding the Difference
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The key difference between a Perceptron and a Multi-Layer Perceptron lies in their 
          ability to create complex decision boundaries. While both are neural networks, the 
          addition of hidden layers gives MLPs the power to solve problems that are impossible 
          for single-layer perceptrons.
        </p>
      </motion.div>

      {/* Feature Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              Feature Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Feature</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Perceptron</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">MLP</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <row.icon className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">{row.feature}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{row.perceptron}</td>
                      <td className="py-4 px-4 text-primary">{row.mlp}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Problem Compatibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Problem Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problemTypes.map((problem, index) => (
                <motion.div
                  key={problem.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{problem.name}</span>
                    <div className="flex gap-2">
                      <Badge 
                        variant={problem.canPerceptron ? "default" : "destructive"}
                        className={problem.canPerceptron ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}
                      >
                        P: {problem.canPerceptron ? "Yes" : "No"}
                      </Badge>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        MLP: Yes
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{problem.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* The XOR Problem Explained */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Why XOR Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              The XOR (exclusive OR) problem became historically significant because it demonstrated 
              the limitations of single-layer perceptrons. In 1969, Minsky and Papert published 
              {"\"Perceptrons\""} showing that a perceptron cannot solve XOR because the data points 
              are not linearly separable.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 rounded-lg bg-background/50">
                <div className="text-lg font-mono text-foreground">0,0 → 0</div>
                <div className="text-xs text-muted-foreground mt-1">Both off = off</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <div className="text-lg font-mono text-foreground">0,1 → 1</div>
                <div className="text-xs text-muted-foreground mt-1">Different = on</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <div className="text-lg font-mono text-foreground">1,0 → 1</div>
                <div className="text-xs text-muted-foreground mt-1">Different = on</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <div className="text-lg font-mono text-foreground">1,1 → 0</div>
                <div className="text-xs text-muted-foreground mt-1">Both on = off</div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              This limitation led to reduced interest in neural networks for nearly two decades 
              (the {"\"AI Winter\""}). The breakthrough came with the discovery of backpropagation, 
              which enabled training of multi-layer networks that could easily solve XOR and 
              far more complex problems.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Universal Approximation Theorem */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              The Universal Approximation Theorem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              The Universal Approximation Theorem states that a neural network with at least one 
              hidden layer containing a finite number of neurons can approximate any continuous 
              function on compact subsets of R^n. In simpler terms:
            </p>
            
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-primary font-medium text-center">
                An MLP with enough hidden neurons can learn ANY pattern
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              This is why MLPs are so powerful - they are theoretically capable of learning 
              any input-output mapping, given sufficient neurons and training data. This makes 
              them suitable for tasks ranging from image recognition to language understanding.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
