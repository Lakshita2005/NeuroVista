"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, Eye, Brain, AlertTriangle, Lightbulb } from "lucide-react"

export function BlackBoxTheory() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            What is the Black Box Problem?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            The &quot;Black Box&quot; problem refers to the opacity of AI systems - while they can make 
            accurate predictions, understanding <span className="text-amber-400">why</span> they make 
            those decisions is often difficult. This is especially true for deep neural networks 
            with millions of parameters.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <span className="text-cyan-400 font-medium">Explainable AI (XAI)</span> aims to make 
            AI systems more transparent and interpretable, helping users understand, trust, and 
            effectively manage AI systems.
          </p>
        </CardContent>
      </Card>

      {/* Why It Matters */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              The Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                Complex neural networks have billions of parameters
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                Decisions emerge from distributed representations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                No single neuron encodes a specific concept
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                Non-linear transformations obscure reasoning
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Solutions & Approaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                Attention visualization shows what the model focuses on
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                Feature importance scores highlight key inputs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                LIME explains individual predictions locally
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                SHAP values provide consistent global explanations
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Interpretability Techniques */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Interpretability Techniques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Attention Visualization",
                description: "Shows which parts of input the model focuses on when making decisions.",
                color: "text-blue-400"
              },
              {
                title: "Gradient-based Methods",
                description: "Highlights input features that most influence the output.",
                color: "text-green-400"
              },
              {
                title: "Prototype Networks",
                description: "Finds similar training examples to explain predictions.",
                color: "text-purple-400"
              },
              {
                title: "Concept Activation",
                description: "Identifies high-level concepts learned by the network.",
                color: "text-cyan-400"
              },
              {
                title: "Surrogate Models",
                description: "Uses simpler, interpretable models to approximate complex ones.",
                color: "text-orange-400"
              },
              {
                title: "Counterfactuals",
                description: "Shows minimal changes needed to alter the prediction.",
                color: "text-pink-400"
              }
            ].map((tech, i) => (
              <motion.div
                key={tech.title}
                className="p-4 bg-muted/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <h4 className={`font-medium ${tech.color} mb-2`}>{tech.title}</h4>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trust & Ethics */}
      <Card className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-400" />
            Why Explainability Matters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { title: "Trust", desc: "Users need to trust AI before adopting it" },
              { title: "Debugging", desc: "Identify and fix model errors" },
              { title: "Fairness", desc: "Detect and mitigate biases" },
              { title: "Compliance", desc: "Meet regulatory requirements" }
            ].map((item, i) => (
              <div key={item.title} className="p-4 bg-muted/20 rounded-lg text-center">
                <h4 className="font-medium text-amber-400 mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
