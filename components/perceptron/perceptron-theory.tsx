"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react"

export function PerceptronTheory() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Introduction */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>What is a Perceptron?</CardTitle>
            <CardDescription>The simplest form of a neural network</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              A perceptron is the fundamental building block of neural networks, inspired by 
              biological neurons in the brain. Invented by Frank Rosenblatt in 1958, it was 
              one of the first algorithms that could learn from data.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Think of a perceptron as a simple decision-maker. It takes multiple inputs, 
              weighs them by importance, adds them together, and produces a single output 
              that determines a classification.
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>How Does It Work?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex gap-4 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Receive Inputs</h4>
                  <p className="text-sm text-muted-foreground">
                    The perceptron receives multiple input values (x₁, x₂, ..., xₙ), each representing 
                    a feature of the data you want to classify.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex gap-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Weight Each Input</h4>
                  <p className="text-sm text-muted-foreground">
                    Each input is multiplied by a weight (w₁, w₂, ..., wₙ). Weights determine 
                    the importance of each input. Positive weights excite, negative weights inhibit.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Sum with Bias</h4>
                  <p className="text-sm text-muted-foreground">
                    All weighted inputs are summed together, plus a bias term (b). The bias 
                    shifts the decision boundary, allowing the model to fit the data better.
                  </p>
                  <div className="mt-2 p-2 bg-background/50 rounded font-mono text-sm">
                    z = (x₁ × w₁) + (x₂ × w₂) + ... + b
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Apply Activation Function</h4>
                  <p className="text-sm text-muted-foreground">
                    The weighted sum is passed through an activation function (like sigmoid) 
                    to produce the final output, typically squashed between 0 and 1.
                  </p>
                  <div className="mt-2 p-2 bg-background/50 rounded font-mono text-sm">
                    {"output = σ(z) = 1 / (1 + e^(-z))"}
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* The Math */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>The Mathematics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-background/50 rounded-lg border border-border">
              <div className="text-center space-y-4">
                <div className="text-muted-foreground text-sm">Full Perceptron Equation</div>
                <div className="text-2xl font-mono text-primary">
                  y = σ(Σ(xᵢ × wᵢ) + b)
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-6">
                  <div className="p-3 bg-card rounded-lg">
                    <div className="text-primary font-mono">y</div>
                    <div className="text-muted-foreground">Output</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg">
                    <div className="text-primary font-mono">xᵢ</div>
                    <div className="text-muted-foreground">Inputs</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg">
                    <div className="text-primary font-mono">wᵢ</div>
                    <div className="text-muted-foreground">Weights</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg">
                    <div className="text-primary font-mono">b</div>
                    <div className="text-muted-foreground">Bias</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Key Concepts */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Key Concepts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                Weights
              </Badge>
              <p className="text-sm text-muted-foreground">
                Learnable parameters that determine input importance
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                Bias
              </Badge>
              <p className="text-sm text-muted-foreground">
                Allows the model to shift its decision boundary
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
                Activation
              </Badge>
              <p className="text-sm text-muted-foreground">
                Non-linear function that enables complex learning
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What It Can Do */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              What It Can Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Binary classification (yes/no decisions)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Linearly separable problems
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AND, OR logic gates
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Simple pattern recognition
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              Limitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Cannot solve XOR problem
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Only linear decision boundaries
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Limited to simple patterns
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Needs multiple layers for complexity
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Historical Note */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">Historical Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The perceptron was invented by Frank Rosenblatt in 1958 at Cornell University. 
              While revolutionary, Minsky and Papert&apos;s 1969 book highlighted its limitations, 
              leading to the &quot;AI Winter.&quot; Multi-layer perceptrons (MLPs) later solved these issues.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
