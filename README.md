# 🧠 NeuroVista - Interactive Neural Network Learning Platform

A comprehensive, interactive platform for learning neural networks through hands-on experimentation, real-time visualization, and practical demos.

---

## 🌐 Live Demo

🚀 Frontend (Vercel):  
https://neuro-vista.vercel.app/

⚙️ Backend (Render):  
https://neurovista-oc1q.onrender.com/

📘 API Docs (FastAPI Swagger):  
https://neurovista-oc1q.onrender.com/docs

---

## 🚀 Features

🔬 Perceptron  
- Interactive playground for single neuron understanding  
- Binary classification demos  
- Admission predictor application  
- Real-time weight visualization  

🧬 Multi-Layer Perceptron (MLP)  
- Deep network exploration with hidden layers  
- Training visualization  
- Student performance predictor  
- Non-linear problem solving  

⚖️ Comparison Lab  
- Side-by-side Perceptron vs MLP  
- XOR problem demonstration  
- Decision boundary visualization  

🧠 Hopfield Network  
- Pattern storage and recovery  
- Memory visualization with energy landscapes  
- Corrupted pattern recovery demo  
- Hebbian learning visualization  

👁️ Computer Vision  
- Emotion detection from images  
- Attention monitoring (real-time webcam support)  
- ML-based classification (MediaPipe + Scikit-learn)  
- Real-time inference simulation  

💬 Sentiment Analysis  
- Text sentiment classification  
- Aspect-based sentiment analysis  
- Emotion detection (6 basic emotions)  
- Attention weight visualization  

📦 Black Box Unboxing  
- Neural network evolution (Perceptron → Deep Learning)  
- AI pipeline visualization  
- Explainable AI (XAI) concepts  
- Decision transparency demo  

🎯 Knowledge Quiz  
- 15+ questions across all topics  
- Score tracking  
- Weak area detection  
- Detailed explanations  

---

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

## 🛠️ Tech Stack

Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Three.js / React Three Fiber
- Recharts

Backend:
- FastAPI
- NumPy
- Pillow
- Scikit-learn
- MediaPipe
- Uvicorn

---

## 🔌 API Endpoints

Hopfield Network:
- POST /hopfield/train
- POST /hopfield/recover
- POST /hopfield/add-noise

Computer Vision:
- POST /cv/analyze

NLP / Sentiment:
- POST /nlp/predict
- POST /nlp/train

Health:
- GET /health

---

## ⚙️ Local Setup

Frontend:

npm install  
npm run dev  

Runs on: http://localhost:3000  

Backend:

cd backend  
python -m venv venv  
venv\Scripts\activate  
pip install -r requirements.txt  
uvicorn main:app --reload --port 8000  

Runs on: http://localhost:8000  

---

## 🔗 Environment Variables (Frontend)

Create a file named .env.local and add:

NEXT_PUBLIC_API_URL=https://neurovista-oc1q.onrender.com

---

## 🚀 Deployment

Frontend:
- Deployed on Vercel
- Auto-deploy via GitHub

Backend:
- Deployed on Render
- FastAPI server running on cloud

---

## 🎨 Key Highlights

- Interactive ML playgrounds  
- Real-time visualizations  
- Webcam-based attention detection  
- Modular architecture  
- Beginner to advanced learning  
- Fully deployed full-stack AI project  

---

## 🎯 Learning Outcomes

After using NeuroVista, you will understand:

- How perceptrons work  
- Why deep networks are needed  
- How Hopfield memory works  
- Basics of computer vision  
- NLP and sentiment analysis  
- Explainable AI concepts  

---

## 🤝 Contributing

Feel free to extend with:
- New ML models  
- Better datasets  
- Improved visualizations  
- Performance optimizations  

---

## 📄 License

MIT License

---

## ⭐ Final Note

This project is a complete interactive AI learning system combining:
- Theory
- Visualization
- Real-world applications

Happy Learning 🚀