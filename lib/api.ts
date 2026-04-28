"""
NeuroVista API Client
Frontend API service for connecting to the FastAPI backend
"""

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }))
    throw new Error(error.detail || error.message || "API request failed")
  }

  return response.json()
}

// ==================== HOPFIELD NETWORK API ====================

export interface HopfieldTrainRequest {
  patterns: number[][]
  name?: string
}

export interface HopfieldTrainResponse {
  status: string
  message: string
  network_size: number
  patterns_stored: number
}

export interface HopfieldRecoverRequest {
  pattern: number[]
  network_name?: string
  max_iterations?: number
}

export interface HopfieldRecoverResponse {
  status: string
  original_pattern: number[]
  recovered_pattern: number[]
  energy_values: number[]
  iterations: number
  converged: boolean
  best_match_index: number
  similarity: number
  states_history: number[][]
}

export interface HopfieldNoiseRequest {
  pattern: number[]
  noise_level: number
}

export interface HopfieldNoiseResponse {
  status: string
  original_pattern: number[]
  noisy_pattern: number[]
  noise_level: number
  flipped_bits: number
}

export const hopfieldAPI = {
  train: (data: HopfieldTrainRequest): Promise<HopfieldTrainResponse> =>
    fetchAPI("/hopfield/train", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  recover: (data: HopfieldRecoverRequest): Promise<HopfieldRecoverResponse> =>
    fetchAPI("/hopfield/recover", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  addNoise: (data: HopfieldNoiseRequest): Promise<HopfieldNoiseResponse> =>
    fetchAPI("/hopfield/add-noise", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// ==================== COMPUTER VISION API ====================

export interface CVAnalysisResponse {
  status: string
  task: string
  detections: Array<{
    emotion?: string
    label?: string
    attention_level?: string
    confidence: number
    bbox: { x: number; y: number; width: number; height: number }
    attention_areas?: Array<{ x: number; y: number; label: string }>
    gaze_direction?: string
    head_pose?: { pitch: number; yaw: number; roll: number }
  }>
  emotion_scores?: { [key: string]: number }
  confidence: number
  image_size: [number, number]
  processing_time: number
}

export interface FocusAnalysisResponse {
  face_detected: boolean
  state: string
  confidence: number
  attention_score: number
  bbox?: { x: number; y: number; width: number; height: number }
  num_eyes_detected?: number
  eye_openness_score?: number
  face_size_ratio?: number
  position_score?: number
  processed_image?: string
  message: string
  processing_time?: number
}

export const cvAPI = {
  analyze: async (file: File, task: "emotion" | "attention" = "emotion"): Promise<CVAnalysisResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("task", task)

    const response = await fetch(`${API_BASE_URL}/cv/analyze`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }))
      throw new Error(error.detail || "CV analysis failed")
    }

    return response.json()
  },
  
  analyzeFocus: async (file: File): Promise<FocusAnalysisResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("task", "focus")

    const response = await fetch(`${API_BASE_URL}/cv/analyze`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }))
      throw new Error(error.detail || "Focus analysis failed")
    }

    return response.json()
  },
}

// ==================== NLP / SENTIMENT ANALYSIS API ====================

export interface NLPPredictRequest {
  text: string
}

export interface NLPPredictResponse {
  status: string
  text: string
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  emotions: { [key: string]: number }
  aspects: { [key: string]: string }
  keywords: Array<{ word: string; weight: number; sentiment: string }>
  tokens: number
  entities: Array<{ text: string; label: string }>
}

export interface NLPTrainRequest {
  texts: string[]
  labels: number[]
  model_type?: string
}

export interface NLPTrainResponse {
  status: string
  model_type: string
  training_samples: number
  accuracy: number
  f1_score: number
  confusion_matrix: number[][]
  message: string
}

export const nlpAPI = {
  predict: (data: NLPPredictRequest): Promise<NLPPredictResponse> =>
    fetchAPI("/nlp/predict", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  train: (data: NLPTrainRequest): Promise<NLPTrainResponse> =>
    fetchAPI("/nlp/train", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// ==================== HEALTH CHECK ====================

export interface HealthResponse {
  status: string
  service: string
  version: string
  modules: string[]
}

export const healthAPI = {
  check: (): Promise<HealthResponse> => fetchAPI("/health"),
}

// ==================== LSTM TIME-SERIES API ====================

export interface LSTMTrainRequest {
  data: Array<{
    day: number
    study_hours: number
    sleep_hours: number
    attention_score?: number
    stress_level: number
  }>
}

export interface LSTMTrainResponse {
  status: string
  message: string
  epochs: number
  final_loss: number
  train_accuracy?: number
  val_accuracy?: number
}

export interface LSTMPrediction {
  productivity_score: number
  burnout_risk: number
  trend: "increasing" | "decreasing" | "stable"
  recommendations: string[]
  hidden_state: number[]
  confidence: number
}

export interface LSTMPredictResponse {
  status: string
  predictions: LSTMPrediction[]
}

export interface LSTMStatusResponse {
  status: string
  model_trained: boolean
  pytorch_available: boolean
  hidden_size?: number
  num_layers?: number
  sequence_length?: number
}

export const lstmAPI = {
  train: (data: LSTMTrainRequest): Promise<LSTMTrainResponse> =>
    fetchAPI("/lstm/train", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  predict: (data: LSTMTrainRequest): Promise<LSTMPredictResponse> =>
    fetchAPI("/lstm/predict", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  status: (): Promise<LSTMStatusResponse> =>
    fetchAPI("/lstm/status"),
}

// Export all APIs
export const API = {
  hopfield: hopfieldAPI,
  cv: cvAPI,
  nlp: nlpAPI,
  lstm: lstmAPI,
  health: healthAPI,
}

export default API
