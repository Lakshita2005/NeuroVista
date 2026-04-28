# NeuroVista - Quick Setup Guide

## Quick Start (5 minutes)

### Step 1: Start the Frontend
```bash
cd neurovista_lovable
pnpm install    # or npm install
pnpm dev        # or npm run dev
```

Frontend will be available at: **http://localhost:3000**

### Step 2: Start the Backend (Optional, for full API features)
```bash
cd neurovista_lovable/backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**

## Module Summary

| Module | Features | Backend API |
|--------|----------|-------------|
| Perceptron | Binary classification, interactive weights, admission predictor | ❌ Frontend only |
| MLP | Hidden layers, training viz, student predictor | ❌ Frontend only |
| Comparison | XOR problem, decision boundaries | ❌ Frontend only |
| Hopfield | Pattern storage, memory recovery, energy landscape | ✅ `/hopfield/*` |
| Vision | Emotion detection, object recognition | ✅ `/cv/analyze` |
| Sentiment | Text analysis, aspect detection | ✅ `/nlp/*` |
| Black Box | Pipeline visualization, XAI | ❌ Frontend only |
| Quiz | 15 questions, scoring, weak areas | ❌ Frontend only |

## API Endpoints

### Hopfield Network
```bash
POST /hopfield/train     # Train on patterns
POST /hopfield/recover   # Recover corrupted patterns
POST /hopfield/add-noise # Add noise to pattern
```

### Computer Vision
```bash
POST /cv/analyze         # Analyze image (emotion/attention)
```

### NLP
```bash
POST /nlp/predict        # Predict sentiment
POST /nlp/train          # Train custom model
```

### Health
```bash
GET /health              # Check service status
GET /docs                # API documentation (Swagger UI)
```

## What's Been Built

### ✅ Completed Modules

1. **Hopfield Network**
   - Memory recovery system with 64-neuron grid
   - Pattern storage using Hebbian learning
   - Energy minimization visualization
   - Corrupted pattern recovery animation

2. **Computer Vision**
   - Emotion detection (7 emotions)
   - Object detection with bounding boxes
   - CNN architecture visualization
   - Attention area highlighting

3. **Sentiment Analysis**
   - Emotion detection (6 basic emotions)
   - Aspect-based sentiment analysis
   - Attention weight visualization
   - Real-time text analysis

4. **Black Box**
   - Complete pipeline visualization
   - Data flow through all modules
   - Explainable AI concepts
   - Stage-by-stage explanation

5. **Quiz Module**
   - 15 questions across all topics
   - Topic-wise filtering
   - Score tracking
   - Weak area detection

### 🔌 Backend Features

- **Hopfield API**: NumPy-based implementation with async updates
- **CV API**: Image analysis with simulated detection
- **NLP API**: Text sentiment and emotion analysis
- **CORS enabled**: Frontend can connect from any origin
- **Auto-docs**: Swagger UI at `/docs`

### 📱 Frontend Features

- 8 complete modules with theory + interactive components
- Dark UI with sidebar navigation
- 3D visualizations (Three.js)
- Smooth animations (Framer Motion)
- Responsive design
- API integration ready

## Next Steps

1. **Start the frontend**: `pnpm dev`
2. **Start the backend**: `uvicorn main:app --reload`
3. **Explore modules**: Navigate through sidebar
4. **Test APIs**: Visit `http://localhost:8000/docs`

## Troubleshooting

### Port conflicts
- Frontend: Change in `package.json` scripts
- Backend: Change `--port` flag

### API not connecting
- Check backend is running
- Verify CORS settings in `backend/main.py`
- Check browser console for errors

### Dependencies
- Frontend: Delete `node_modules` and reinstall
- Backend: Recreate virtual environment

## Project Stats

- **Frontend**: React + TypeScript + Next.js + Tailwind
- **Backend**: FastAPI + NumPy + Pillow
- **Modules**: 8 complete learning modules
- **Components**: 50+ React components
- **Lines of Code**: ~8000+ (frontend) + 400+ (backend)

Ready to explore neural networks! 🧠✨
