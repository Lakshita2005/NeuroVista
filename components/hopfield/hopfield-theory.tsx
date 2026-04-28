"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, RefreshCw, Database } from "lucide-react"

export function HopfieldTheory() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            What is a Hopfield Network?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            A Hopfield Network is a form of recurrent artificial neural network that serves as 
            <span className="text-purple-400"> content-addressable memory</span>. Invented by John Hopfield 
            in 1982, it can store patterns and recall them from partial or corrupted inputs.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Unlike feedforward networks, Hopfield networks have connections between every pair of neurons, 
            and the network evolves over time until it reaches a stable state (attractor) that represents 
            a stored memory.
          </p>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-cyan-400" />
              Hebbian Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The network learns using Hebbian plasticity: &quot;Neurons that fire together, wire together.&quot;
            </p>
            <div className="p-4 bg-muted/20 rounded-lg font-mono text-sm">
              <p className="text-purple-400 mb-2">Weight Update Rule:</p>
              <p className="text-foreground">$$w_{'{ij}'} = \frac{'{1}'}{'{N}'} \sum_{'{\\mu}'} x_i^{'{\\mu}'} x_j^{'{\\mu}'}$$</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Where x represents pattern values and N is the number of patterns.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              Energy Function
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The network has an energy function that always decreases (or stays the same) with each update.
            </p>
            <div className="p-4 bg-muted/20 rounded-lg font-mono text-sm">
              <p className="text-yellow-400 mb-2">Energy Function:</p>
              <p className="text-foreground">$$E = -\frac{'{1}'}{'{2}'} \sum_{'{i,j}'} w_{'{ij}'} s_i s_j$$</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Stored patterns correspond to local minima in the energy landscape.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <RefreshCw className="w-5 h-5 text-green-400" />
              Update Rule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Each neuron updates its state based on the weighted sum of all other neurons:
            </p>
            <div className="p-4 bg-muted/20 rounded-lg font-mono text-sm">
              <p className="text-green-400 mb-2">Neuron Update:</p>
              <p className="text-foreground">$$s_i = \text{'{sign}'}\left(\sum_j w_{'{ij}'} s_j\right)$$</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Updates can be asynchronous (one neuron at a time) or synchronous (all at once).
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-pink-400" />
              Storage Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The network can reliably store approximately 0.138N patterns, where N is the number of neurons.
            </p>
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm">25 neurons</span>
                <span className="text-pink-400 font-mono">~3 patterns</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm">64 neurons</span>
                <span className="text-pink-400 font-mono">~9 patterns</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm">100 neurons</span>
                <span className="text-pink-400 font-mono">~14 patterns</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Key Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4 className="font-medium text-green-400">Advantages</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">+</span>
                  Content-addressable: retrieve by similarity, not address
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">+</span>
                  Fault-tolerant: works with partial or noisy inputs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">+</span>
                  Guaranteed convergence to stable states
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">+</span>
                  Simple, biologically plausible learning rule
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4 className="font-medium text-red-400">Limitations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">-</span>
                  Limited storage capacity (~0.138N patterns)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">-</span>
                  May converge to spurious states (false memories)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">-</span>
                  Only stores binary patterns
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">-</span>
                  Similar patterns can interfere with each other
                </li>
              </ul>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Real-World Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Pattern Recognition",
                description: "Recognizing handwritten characters, faces, or other patterns from partial or noisy inputs.",
                color: "text-purple-400"
              },
              {
                title: "Optimization Problems",
                description: "Solving combinatorial optimization like the Traveling Salesman Problem by finding energy minima.",
                color: "text-cyan-400"
              },
              {
                title: "Error Correction",
                description: "Correcting errors in transmitted data by recovering the original pattern from corrupted bits.",
                color: "text-green-400"
              }
            ].map((app, i) => (
              <motion.div
                key={app.title}
                className="p-4 bg-muted/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className={`font-medium ${app.color} mb-2`}>{app.title}</h4>
                <p className="text-sm text-muted-foreground">{app.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Note */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20">
        <CardContent className="pt-6">
          <blockquote className="text-center">
            <p className="text-lg italic text-muted-foreground mb-4">
              &quot;The brain is a system of many interacting components, and its computational 
              abilities emerge from the collective behavior of these components.&quot;
            </p>
            <footer className="text-sm text-purple-400">
              - John Hopfield, Nobel Prize in Physics 2024
            </footer>
          </blockquote>
        </CardContent>
      </Card>
    </div>
  )
}
