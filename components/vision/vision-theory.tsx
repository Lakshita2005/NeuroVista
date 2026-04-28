"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Layers, Zap, Grid3X3 } from "lucide-react"

export function VisionTheory() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Computer Vision & Deep Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Computer Vision enables machines to derive meaningful information from digital images, 
            videos, and other visual inputs. Combined with deep learning, modern CV systems can 
            perform tasks like object detection, facial recognition, emotion detection, and scene understanding.
          </p>
        </CardContent>
      </Card>

      {/* CNN Architecture */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-purple-400" />
            Convolutional Neural Networks (CNNs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            CNNs are the backbone of computer vision. They use convolutional layers to automatically 
            learn spatial hierarchies of features from images.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Input", desc: "224×224×3", color: "bg-blue-500" },
              { name: "Conv1", desc: "112×112×64", color: "bg-purple-500" },
              { name: "Pool", desc: "56×56×64", color: "bg-pink-500" },
              { name: "Conv2", desc: "28×28×128", color: "bg-red-500" },
              { name: "Conv3", desc: "14×14×256", color: "bg-orange-500" },
              { name: "Pool2", desc: "7×7×256", color: "bg-yellow-500" },
              { name: "FC", desc: "4096", color: "bg-green-500" },
              { name: "Output", desc: "Classes", color: "bg-cyan-500" }
            ].map((layer, i) => (
              <motion.div
                key={layer.name}
                className="p-4 bg-muted/20 rounded-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`w-12 h-12 ${layer.color} rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                  {layer.name}
                </div>
                <p className="text-xs text-muted-foreground">{layer.desc}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="w-5 h-5 text-cyan-400" />
              Feature Extraction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Early layers detect simple features like edges and corners. Deeper layers combine 
              these to detect complex patterns like shapes, textures, and object parts.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              Transfer Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pre-trained models like ResNet, VGG, or MobileNet can be fine-tuned for specific 
              tasks, significantly reducing training time and data requirements.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { title: "Face Detection", desc: "Identify faces in images", color: "text-blue-400" },
              { title: "Emotion Recognition", desc: "Detect facial expressions", color: "text-purple-400" },
              { title: "Object Detection", desc: "Locate and classify objects", color: "text-green-400" },
              { title: "Medical Imaging", desc: "Assist in diagnosis", color: "text-red-400" }
            ].map((app, i) => (
              <motion.div
                key={app.title}
                className="p-4 bg-muted/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className={`font-medium ${app.color} mb-2`}>{app.title}</h4>
                <p className="text-xs text-muted-foreground">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
