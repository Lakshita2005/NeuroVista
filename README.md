# NeuroVista - Interactive Neural Network Learning Platform

A comprehensive, interactive platform for learning neural networks through hands-on experimentation and visualization.

## 🚀 Features

### Core Modules

1. **🔬 Perceptron**
   - Interactive playground for understanding single neurons
   - Binary classification demos
   - Admission predictor application
   - Real-time weight visualization

2. **🧬 Multi-Layer Perceptron (MLP)**
   - Deep network exploration with hidden layers
   - Training visualization
   - Student performance predictor
   - Non-linear problem solving

3. **⚖️ Comparison Lab**
   - Side-by-side Perceptron vs MLP
   - XOR problem demonstration
   - Decision boundary visualization

4. **🧠 Hopfield Network**
   - Pattern storage and recovery
   - Memory visualization with energy landscapes
   - Corrupted pattern recovery demo
   - Hebbian learning visualization

5. **👁️ Computer Vision**
   - Emotion detection from images
   - Object recognition
   - CNN architecture visualization
   - Real-time inference simulation

6. **💬 Sentiment Analysis**
   - Text sentiment classification
   - Aspect-based sentiment analysis
   - Emotion detection (6 basic emotions)
   - Attention weight visualization

7. **📦 Black Box Unboxing**
   - Complete AI pipeline visualization
   - Data flow through all network types
   - Explainable AI concepts
   - Decision transparency demo

8. **🎯 Knowledge Quiz**
   - 15 questions across all topics
   - Score tracking and weak area detection
   - Explanations for each question
   - Topic-wise filtering

## 📁 Project Structure

```
neurovista_lovable/
├── app/                          # Next.js app router pages
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── perceptron/
│   │   └── page.tsx              # Perceptron module
│   ├── mlp/
│   │   └── page.tsx              # MLP module
│   ├── comparison/
│   │   └── page.tsx              # Comparison module
│   ├── hopfield/
│   │   └── page.tsx              # Hopfield module
│   ├── vision/
│   │   └── page.tsx              # Computer Vision module
│   ├── sentiment/
│   │   └── page.tsx              # NLP/Sentiment module
│   ├── blackbox/
│   │   └── page.tsx              # Black Box module
│   └── quiz/
│       └── page.tsx              # Quiz module
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── 3d/                       # 3D visualization components
│   ├── layout/                   # Layout components
│   ├── home/                     # Home page components
│   ├── perceptron/               # Perceptron components
│   ├── mlp/                      # MLP components
│   ├── comparison/               # Comparison components
│   ├── hopfield/                 # Hopfield components
│   ├── vision/                   # Vision components
│   ├── sentiment/                # Sentiment components
│   ├── blackbox/                 # Black Box components
│   └── quiz/                     # Quiz components
├── lib/                          # Utility functions
│   ├── utils.ts                  # General utilities
│   ├── ml-utils.ts               # ML utilities
│   └── api.ts                    # API client
├── backend/                      # FastAPI backend
│   ├── main.py                   # FastAPI application
│   └── requirements.txt          # Python dependencies
├── public/                       # Static assets
├── package.json                  # Node.js dependencies
├── next.config.mjs               # Next.js config
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.8+ (for backend)

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run FastAPI server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **API documentation available at [http://localhost:8000/docs](http://localhost:8000/docs)**

## 🔌 Backend API Endpoints

### Hopfield Network

- `POST /hopfield/train` - Train network on patterns
- `POST /hopfield/recover` - Recover pattern from noisy input
- `POST /hopfield/add-noise` - Add noise to pattern

### Computer Vision

- `POST /cv/analyze` - Analyze image (emotion/attention detection)

### NLP / Sentiment

- `POST /nlp/predict` - Predict sentiment from text
- `POST /nlp/train` - Train custom sentiment model

### Health

- `GET /health` - Health check endpoint

## 🎨 Design System

- **Dark theme** with vibrant accent colors
- **Glass morphism** effects on cards
- **Smooth animations** using Framer Motion
- **3D visualizations** with Three.js/React Three Fiber
- **Responsive design** for all screen sizes

## 🧪 Technologies Used

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Three.js / React Three Fiber** - 3D graphics
- **Recharts** - Charts and visualizations
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **NumPy** - Numerical computing
- **Pillow** - Image processing
- **Uvicorn** - ASGI server

## 📝 Key Features

### Interactive Visualizations
- 3D neuron and network visualizations
- Real-time training animations
- Decision boundary plots
- Energy landscape graphs
- Attention weight heatmaps

### Educational Content
- Theory explanations with LaTeX math
- Step-by-step walkthroughs
- Interactive playgrounds
- Sample datasets for experimentation

### Assessment
- Topic-wise quizzes
- Score tracking
- Weak area identification
- Detailed explanations

## 🔄 Running Both Services

For full functionality with backend integration:

```bash
# Terminal 1 - Frontend
cd neurovista_lovable
pnpm dev

# Terminal 2 - Backend
cd neurovista_lovable/backend
uvicorn main:app --reload --port 8000
```

## 📦 Build for Production

### Frontend
```bash
npm run build
# or
pnpm build
```

### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

This is a learning platform. Feel free to extend with:
- New neural network architectures
- Additional datasets
- More interactive demos
- Enhanced visualizations

## 📄 License

MIT License - Feel free to use and modify.

## 🎯 Learning Outcomes

After completing all modules, you will understand:
- ✅ How single neurons make decisions
- ✅ Why multiple layers are needed for complex problems
- ✅ How associative memory networks work
- ✅ Computer vision fundamentals with CNNs
- ✅ NLP and sentiment analysis concepts
- ✅ How to interpret AI decisions (XAI)

Happy Learning! 🚀
