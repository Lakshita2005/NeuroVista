import {
  Brain,
  Layers,
  GitCompare,
  Home,
  Network,
  Eye,
  MessageSquareText,
  Box,
  HelpCircle,
  Clock,
  type LucideIcon
} from "lucide-react"

export interface Module {
  name: string
  href: string
  icon: LucideIcon
  description: string
}

/**
 * Centralized list of all interactive learning modules.
 * Used by sidebar navigation and homepage stats.
 */
export const modules: Module[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    description: "Overview & Getting Started"
  },
  {
    name: "Perceptron",
    href: "/perceptron",
    icon: Brain,
    description: "Single Neuron Fundamentals"
  },
  {
    name: "MLP",
    href: "/mlp",
    icon: Layers,
    description: "Multi-Layer Networks"
  },
  {
    name: "Comparison",
    href: "/comparison",
    icon: GitCompare,
    description: "Perceptron vs MLP"
  },
  {
    name: "Hopfield",
    href: "/hopfield",
    icon: Network,
    description: "Memory Recovery System"
  },
  {
    name: "Vision",
    href: "/vision",
    icon: Eye,
    description: "Focus & Engagement Analyzer"
  },
  {
    name: "Sentiment",
    href: "/sentiment",
    icon: MessageSquareText,
    description: "Advanced Text Analysis"
  },
  {
    name: "Black Box",
    href: "/blackbox",
    icon: Box,
    description: "Unboxing AI Pipeline"
  },
  {
    name: "LSTM",
    href: "/lstm",
    icon: Clock,
    description: "Sequence Learning"
  },
  {
    name: "Quiz",
    href: "/quiz",
    icon: HelpCircle,
    description: "Test Your Knowledge"
  }
]

/**
 * Get only the interactive learning modules (excludes Home).
 * Used for displaying module count statistics.
 */
export const interactiveModules = modules.filter(m => m.name !== "Home")

/**
 * Total count of interactive learning modules.
 */
export const interactiveModuleCount = interactiveModules.length
