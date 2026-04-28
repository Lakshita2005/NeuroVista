"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, ArrowRight, Layers, Zap, RotateCcw } from "lucide-react"

export function MLPTheory() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Introduction */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>What is a Multi-Layer Perceptron?</CardTitle>
            <CardDescription>The power of depth in neural networks</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              A Multi-Layer Perceptron (MLP) is a neural network with multiple layers of 
              neurons. Unlike a single perceptron, MLPs can learn complex, non-linear patterns 
              by stacking layers of neurons together.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              The key insight is that each layer transforms the data into a new representation. 
              Early layers might detect simple features, while deeper layers combine these into 
              more abstract concepts. This hierarchical learning is what makes deep learning so powerful.
            </p>
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Network Architecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Layers explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-semibold text-foreground">Input Layer</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receives raw input features. One neuron per feature. No computation 
                  happens here - just passes data to the next layer.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-violet-400" />
                  <h4 className="font-semibold text-foreground">Hidden Layers</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Where the magic happens! These layers learn intermediate representations. 
                  More layers = more complex patterns can be learned.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-semibold text-foreground">Output Layer</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Produces the final prediction. Number of neurons depends on the task 
                  (1 for binary classification, N for N classes).
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Forward Propagation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Forward Propagation</CardTitle>
            <CardDescription>How data flows through the network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Forward propagation is the process of computing the output of the network 
              given an input. Each layer performs two operations:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-background/50">
                <h4 className="font-semibold text-foreground mb-2">1. Linear Transformation</h4>
                <div className="font-mono text-primary text-center p-2 bg-card rounded">
                  z = W · x + b
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Multiply inputs by weights and add bias. W is the weight matrix, x is the 
                  input vector, b is the bias vector.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background/50">
                <h4 className="font-semibold text-foreground mb-2">2. Non-linear Activation</h4>
                <div className="font-mono text-primary text-center p-2 bg-card rounded">
                  a = σ(z)
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Apply activation function (sigmoid, ReLU, tanh) to introduce non-linearity. 
                  This is what allows MLPs to learn complex patterns!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backpropagation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              Backpropagation
            </CardTitle>
            <CardDescription>How the network learns from mistakes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Backpropagation is the algorithm that makes neural networks learn. It works by:
            </p>

            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Calculate Error</h4>
                  <p className="text-sm text-muted-foreground">
                    Compare the network&apos;s output to the expected output using a loss function.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Compute Gradients</h4>
                  <p className="text-sm text-muted-foreground">
                    Use chain rule to calculate how much each weight contributed to the error.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Update Weights</h4>
                  <p className="text-sm text-muted-foreground">
                    Adjust weights in the direction that reduces error (gradient descent).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 mt-4">
              <div className="font-mono text-center text-amber-400">
                w_new = w_old - learning_rate × gradient
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Key Concepts */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-emerald-400" />
              Key Concepts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shrink-0">
                Depth
              </Badge>
              <p className="text-sm text-muted-foreground">
                More layers allow learning more complex patterns
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30 shrink-0">
                Width
              </Badge>
              <p className="text-sm text-muted-foreground">
                More neurons per layer increase capacity
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 shrink-0">
                Non-linearity
              </Badge>
              <p className="text-sm text-muted-foreground">
                Activation functions enable complex decision boundaries
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shrink-0">
                Learning
              </Badge>
              <p className="text-sm text-muted-foreground">
                Backpropagation adjusts weights to minimize error
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activation Functions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">Activation Functions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="font-mono text-sm text-primary">Sigmoid</div>
              <div className="text-xs text-muted-foreground mt-1">
                σ(x) = 1/(1+e^-x)
              </div>
              <div className="text-xs text-muted-foreground">Output: (0, 1)</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="font-mono text-sm text-primary">ReLU</div>
              <div className="text-xs text-muted-foreground mt-1">
                f(x) = max(0, x)
              </div>
              <div className="text-xs text-muted-foreground">Output: [0, inf)</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="font-mono text-sm text-primary">Tanh</div>
              <div className="text-xs text-muted-foreground mt-1">
                tanh(x)
              </div>
              <div className="text-xs text-muted-foreground">Output: (-1, 1)</div>
            </div>
          </CardContent>
        </Card>

        {/* Why Depth Matters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm">Why Depth Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each layer learns different levels of abstraction:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Layer 1: Simple features (edges, colors)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Layer 2: Combinations (shapes, textures)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Layer 3+: Abstract concepts (objects, faces)
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* XOR Solution */}
        <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/30">
          <CardHeader>
            <CardTitle className="text-sm">Solving XOR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A single perceptron cannot solve XOR because it&apos;s not linearly separable. 
              But an MLP with just one hidden layer can! The hidden layer creates a new 
              representation where XOR becomes linearly separable.
            </p>
            <div className="mt-3 p-2 bg-background/50 rounded font-mono text-xs">
              <div className="text-muted-foreground">XOR Truth Table:</div>
              <div className="grid grid-cols-3 gap-1 mt-1 text-center">
                <span>A</span><span>B</span><span>Out</span>
                <span>0</span><span>0</span><span className="text-rose-400">0</span>
                <span>0</span><span>1</span><span className="text-emerald-400">1</span>
                <span>1</span><span>0</span><span className="text-emerald-400">1</span>
                <span>1</span><span>1</span><span className="text-rose-400">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
