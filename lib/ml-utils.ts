// Activation functions
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

export function sigmoidDerivative(x: number): number {
  const s = sigmoid(x)
  return s * (1 - s)
}

export function relu(x: number): number {
  return Math.max(0, x)
}

export function reluDerivative(x: number): number {
  return x > 0 ? 1 : 0
}

export function tanh(x: number): number {
  return Math.tanh(x)
}

export function tanhDerivative(x: number): number {
  const t = Math.tanh(x)
  return 1 - t * t
}

// Step function for basic perceptron
export function step(x: number): number {
  return x >= 0 ? 1 : 0
}

// Perceptron forward pass
export function perceptronPredict(
  inputs: number[],
  weights: number[],
  bias: number
): { weightedSum: number; output: number } {
  const weightedSum = inputs.reduce((sum, input, i) => sum + input * weights[i], bias)
  const output = sigmoid(weightedSum)
  return { weightedSum, output }
}

// MLP forward pass
export function mlpForward(
  inputs: number[],
  weights: number[][][],
  biases: number[][]
): { activations: number[][]; outputs: number[] } {
  const activations: number[][] = [inputs]
  let currentInputs = inputs

  for (let l = 0; l < weights.length; l++) {
    const layerOutputs: number[] = []
    
    for (let j = 0; j < weights[l][0].length; j++) {
      let sum = biases[l][j]
      for (let i = 0; i < currentInputs.length; i++) {
        sum += currentInputs[i] * weights[l][i][j]
      }
      layerOutputs.push(sigmoid(sum))
    }
    
    activations.push(layerOutputs)
    currentInputs = layerOutputs
  }

  return { activations, outputs: currentInputs }
}

// Generate random weights
export function randomWeights(inputSize: number, outputSize: number): number[][] {
  return Array.from({ length: inputSize }, () =>
    Array.from({ length: outputSize }, () => (Math.random() - 0.5) * 2)
  )
}

// Generate random biases
export function randomBiases(size: number): number[] {
  return Array.from({ length: size }, () => (Math.random() - 0.5) * 0.5)
}

// Initialize MLP weights and biases
export function initializeMLP(architecture: number[]): {
  weights: number[][][]
  biases: number[][]
} {
  const weights: number[][][] = []
  const biases: number[][] = []

  for (let l = 0; l < architecture.length - 1; l++) {
    const layerWeights: number[][] = []
    const layerBiases: number[] = []
    
    // Xavier initialization
    const scale = Math.sqrt(2 / (architecture[l] + architecture[l + 1]))
    
    for (let i = 0; i < architecture[l]; i++) {
      const neuronWeights: number[] = []
      for (let j = 0; j < architecture[l + 1]; j++) {
        neuronWeights.push((Math.random() - 0.5) * 2 * scale)
      }
      layerWeights.push(neuronWeights)
    }
    
    for (let j = 0; j < architecture[l + 1]; j++) {
      layerBiases.push((Math.random() - 0.5) * 0.1)
    }
    
    weights.push(layerWeights)
    biases.push(layerBiases)
  }

  return { weights, biases }
}

// Calculate MSE loss
export function mseLoss(predicted: number[], actual: number[]): number {
  return predicted.reduce((sum, p, i) => sum + Math.pow(p - actual[i], 2), 0) / predicted.length
}

// Calculate binary cross-entropy loss
export function binaryCrossEntropyLoss(predicted: number[], actual: number[]): number {
  const epsilon = 1e-7
  return -predicted.reduce((sum, p, i) => {
    const clampedP = Math.max(epsilon, Math.min(1 - epsilon, p))
    return sum + actual[i] * Math.log(clampedP) + (1 - actual[i]) * Math.log(1 - clampedP)
  }, 0) / predicted.length
}

// Normalize data to 0-1 range
export function normalize(data: number[], min?: number, max?: number): { 
  normalized: number[]
  min: number
  max: number 
} {
  const dataMin = min ?? Math.min(...data)
  const dataMax = max ?? Math.max(...data)
  const range = dataMax - dataMin || 1
  
  return {
    normalized: data.map(x => (x - dataMin) / range),
    min: dataMin,
    max: dataMax
  }
}

// Denormalize data
export function denormalize(normalized: number[], min: number, max: number): number[] {
  const range = max - min
  return normalized.map(x => x * range + min)
}

// Calculate accuracy for binary classification
export function binaryAccuracy(predicted: number[], actual: number[], threshold = 0.5): number {
  const correct = predicted.reduce((sum, p, i) => {
    const predClass = p >= threshold ? 1 : 0
    return sum + (predClass === actual[i] ? 1 : 0)
  }, 0)
  return correct / predicted.length
}

// XOR dataset
export const XOR_DATA = {
  inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
  outputs: [0, 1, 1, 0]
}

// AND dataset
export const AND_DATA = {
  inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
  outputs: [0, 0, 0, 1]
}

// OR dataset
export const OR_DATA = {
  inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
  outputs: [0, 1, 1, 1]
}

// Generate admission prediction dataset
export function generateAdmissionData(count: number): {
  inputs: number[][]
  outputs: number[]
  labels: string[]
} {
  const inputs: number[][] = []
  const outputs: number[] = []

  for (let i = 0; i < count; i++) {
    const gpa = 2.0 + Math.random() * 2.0 // 2.0 - 4.0
    const testScore = 400 + Math.random() * 400 // 400 - 800
    
    // Simple decision boundary
    const admitted = (gpa / 4.0) * 0.6 + (testScore / 800) * 0.4 > 0.55 ? 1 : 0
    // Add some noise
    const finalAdmitted = Math.random() > 0.1 ? admitted : 1 - admitted
    
    inputs.push([gpa / 4.0, testScore / 800]) // Normalized inputs
    outputs.push(finalAdmitted)
  }

  return {
    inputs,
    outputs,
    labels: ["GPA (normalized)", "Test Score (normalized)"]
  }
}

// Generate student performance dataset
export function generateStudentData(count: number): {
  inputs: number[][]
  outputs: number[]
  labels: string[]
} {
  const inputs: number[][] = []
  const outputs: number[] = []

  for (let i = 0; i < count; i++) {
    const studyHours = Math.random() * 10 // 0-10 hours
    const attendance = Math.random() // 0-1
    const previousGrade = 40 + Math.random() * 60 // 40-100
    const sleepHours = 4 + Math.random() * 6 // 4-10 hours
    
    // Non-linear combination with interaction effects
    const basePerformance = 
      studyHours * 5 +
      attendance * 30 +
      previousGrade * 0.4 +
      sleepHours * 3 +
      (studyHours * attendance) * 5 - // Interaction term
      Math.pow(Math.max(0, studyHours - 8), 2) // Diminishing returns
    
    // Add noise and clamp to 0-100
    const finalPerformance = Math.max(0, Math.min(100, basePerformance + (Math.random() - 0.5) * 20))
    
    inputs.push([
      studyHours / 10,
      attendance,
      previousGrade / 100,
      sleepHours / 10
    ])
    outputs.push(finalPerformance >= 60 ? 1 : 0) // Pass/Fail threshold
  }

  return {
    inputs,
    outputs,
    labels: ["Study Hours", "Attendance", "Previous Grade", "Sleep Hours"]
  }
}
