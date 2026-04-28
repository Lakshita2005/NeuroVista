"""
NeuroVista Backend API - ML-Based Real-Time Attention Analyzer
Using MediaPipe Face Mesh + scikit-learn for accurate focus detection
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Tuple
import numpy as np
import cv2
import base64
import time
import pickle
import os
from collections import deque
from dataclasses import dataclass, asdict
import json

# ML imports
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import mediapipe as mp

app = FastAPI(
    title="NeuroVista ML Attention API",
    description="ML-based student focus and engagement analyzer using MediaPipe + scikit-learn",
    version="3.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Face Mesh landmarks indices
LEFT_EYE = [362, 385, 387, 263, 373, 380]
RIGHT_EYE = [33, 160, 158, 133, 153, 144]
MOUTH = [61, 291, 39, 181, 0, 17, 269, 405]
NOSE_TIP = 1
CHIN = 199

@dataclass
class ExtractedFeatures:
    """Features extracted from a single frame"""
    ear_left: float
    ear_right: float
    ear_avg: float
    mouth_openness: float
    head_yaw: float
    head_pitch: float
    head_roll: float
    face_center_x: float
    face_center_y: float
    blink_detected: int
    
    def to_array(self) -> np.ndarray:
        return np.array([
            self.ear_left,
            self.ear_right,
            self.ear_avg,
            self.mouth_openness,
            self.head_yaw,
            self.head_pitch,
            self.head_roll,
            self.face_center_x,
            self.face_center_y,
            self.blink_detected
        ])
    
    def to_dict(self) -> Dict:
        return asdict(self)


class MLAttentionAnalyzer:
    """ML-based attention analyzer with MediaPipe and scikit-learn"""
    
    def __init__(self, model_path: str = "attention_model.pkl"):
        self.model_path = model_path
        self.face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Model and scaler
        self.model: Optional[RandomForestClassifier] = None
        self.scaler: Optional[StandardScaler] = None
        self.is_model_trained = False
        
        # Training data collection
        self.training_data: List[Tuple[np.ndarray, str]] = []
        self.collecting_mode: Optional[str] = None  # "focused", "distracted", "sleepy"
        
        # Temporal smoothing
        self.prediction_history: deque = deque(maxlen=10)
        self.feature_history: deque = deque(maxlen=5)
        self.blink_history: deque = deque(maxlen=30)  # For blink detection
        
        # Attention tracking
        self.last_attention_score = 50
        
        # Load existing model if available
        self.load_model()
    
    def load_model(self) -> bool:
        """Load pre-trained model from disk"""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    saved_data = pickle.load(f)
                    self.model = saved_data['model']
                    self.scaler = saved_data['scaler']
                    self.is_model_trained = True
                    print(f"Loaded trained model from {self.model_path}")
                    return True
        except Exception as e:
            print(f"Could not load model: {e}")
        return False
    
    def save_model(self) -> bool:
        """Save trained model to disk"""
        try:
            if self.is_model_trained and self.model and self.scaler:
                with open(self.model_path, 'wb') as f:
                    pickle.dump({
                        'model': self.model,
                        'scaler': self.scaler
                    }, f)
                print(f"Model saved to {self.model_path}")
                return True
        except Exception as e:
            print(f"Could not save model: {e}")
        return False
    
    def calculate_ear(self, landmarks, eye_indices: List[int]) -> float:
        """Calculate Eye Aspect Ratio from landmarks"""
        try:
            # Get eye landmark points
            p1 = np.array([landmarks[eye_indices[1]].x, landmarks[eye_indices[1]].y])
            p2 = np.array([landmarks[eye_indices[2]].x, landmarks[eye_indices[2]].y])
            p3 = np.array([landmarks[eye_indices[0]].x, landmarks[eye_indices[0]].y])
            p4 = np.array([landmarks[eye_indices[3]].x, landmarks[eye_indices[3]].y])
            p5 = np.array([landmarks[eye_indices[4]].x, landmarks[eye_indices[4]].y])
            p6 = np.array([landmarks[eye_indices[5]].x, landmarks[eye_indices[5]].y])
            
            # Calculate distances
            vertical1 = np.linalg.norm(p2 - p6)
            vertical2 = np.linalg.norm(p3 - p5)
            horizontal = np.linalg.norm(p1 - p4)
            
            if horizontal == 0:
                return 0.0
            
            ear = (vertical1 + vertical2) / (2.0 * horizontal)
            return min(ear, 1.0)  # Cap at 1.0
        except:
            return 0.0
    
    def calculate_mouth_openness(self, landmarks) -> float:
        """Calculate mouth openness from landmarks"""
        try:
            upper_lip = np.array([landmarks[13].x, landmarks[13].y])
            lower_lip = np.array([landmarks[14].x, landmarks[14].y])
            left_corner = np.array([landmarks[61].x, landmarks[61].y])
            right_corner = np.array([landmarks[291].x, landmarks[291].y])
            
            mouth_height = np.linalg.norm(upper_lip - lower_lip)
            mouth_width = np.linalg.norm(left_corner - right_corner)
            
            if mouth_width == 0:
                return 0.0
            
            openness = mouth_height / mouth_width
            return min(openness, 1.0)
        except:
            return 0.0
    
    def calculate_head_pose(self, landmarks, image_shape) -> Tuple[float, float, float]:
        """Calculate head pose angles (yaw, pitch, roll)"""
        try:
            img_h, img_w = image_shape[:2]
            
            # Get key landmarks
            nose = np.array([landmarks[NOSE_TIP].x * img_w, landmarks[NOSE_TIP].y * img_h])
            left_eye_center = np.array([
                np.mean([landmarks[i].x for i in LEFT_EYE]) * img_w,
                np.mean([landmarks[i].y for i in LEFT_EYE]) * img_h
            ])
            right_eye_center = np.array([
                np.mean([landmarks[i].x for i in RIGHT_EYE]) * img_w,
                np.mean([landmarks[i].y for i in RIGHT_EYE]) * img_h
            ])
            chin = np.array([landmarks[CHIN].x * img_w, landmarks[CHIN].y * img_h])
            
            # Calculate face center
            face_center_x = (left_eye_center[0] + right_eye_center[0]) / 2
            face_center_y = (left_eye_center[1] + right_eye_center[1]) / 2
            
            # Normalize to image center (-1 to 1)
            img_center_x = img_w / 2
            img_center_y = img_h / 2
            
            yaw = (face_center_x - img_center_x) / img_center_x
            pitch = (face_center_y - img_center_y) / img_center_y
            
            # Calculate roll from eye line
            eye_line = right_eye_center - left_eye_center
            roll = np.arctan2(eye_line[1], eye_line[0]) * 180 / np.pi
            roll = roll / 45.0  # Normalize
            
            return float(yaw), float(pitch), float(roll)
        except:
            return 0.0, 0.0, 0.0
    
    def detect_blink(self, ear_avg: float) -> int:
        """Detect if eyes are closed (blink)"""
        BLINK_THRESHOLD = 0.18
        self.blink_history.append(ear_avg < BLINK_THRESHOLD)
        
        # Blink detected if EAR was low for 2+ frames
        if len(self.blink_history) >= 2:
            recent = list(self.blink_history)[-2:]
            if all(recent):
                return 1
        return 0
    
    def extract_features(self, frame: np.ndarray) -> Optional[ExtractedFeatures]:
        """Extract all features from a frame using MediaPipe"""
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        if not results.multi_face_landmarks:
            return None
        
        landmarks = results.multi_face_landmarks[0].landmark
        
        # Calculate EAR for both eyes
        ear_left = self.calculate_ear(landmarks, LEFT_EYE)
        ear_right = self.calculate_ear(landmarks, RIGHT_EYE)
        ear_avg = (ear_left + ear_right) / 2
        
        # Calculate mouth openness
        mouth_openness = self.calculate_mouth_openness(landmarks)
        
        # Calculate head pose
        yaw, pitch, roll = self.calculate_head_pose(landmarks, frame.shape)
        
        # Calculate face center
        img_h, img_w = frame.shape[:2]
        face_center_x = np.mean([landmarks[i].x for i in LEFT_EYE + RIGHT_EYE])
        face_center_y = np.mean([landmarks[i].y for i in LEFT_EYE + RIGHT_EYE])
        
        # Normalize to -1 to 1
        face_center_x = (face_center_x - 0.5) * 2
        face_center_y = (face_center_y - 0.5) * 2
        
        # Detect blink
        blink = self.detect_blink(ear_avg)
        
        features = ExtractedFeatures(
            ear_left=float(ear_left),
            ear_right=float(ear_right),
            ear_avg=float(ear_avg),
            mouth_openness=float(mouth_openness),
            head_yaw=float(yaw),
            head_pitch=float(pitch),
            head_roll=float(roll),
            face_center_x=float(face_center_x),
            face_center_y=float(face_center_y),
            blink_detected=int(blink)
        )
        
        return features
    
    def collect_training_sample(self, frame: np.ndarray, label: str) -> bool:
        """Collect a training sample with given label"""
        features = self.extract_features(frame)
        if features is None:
            return False
        
        self.training_data.append((features.to_array(), label))
        return True
    
    def train_model(self) -> Dict:
        """Train the Random Forest classifier on collected data"""
        if len(self.training_data) < 10:
            return {
                "status": "error",
                "message": f"Need at least 10 samples, have {len(self.training_data)}"
            }
        
        # Prepare data
        X = np.array([sample[0] for sample in self.training_data])
        y = np.array([sample[1] for sample in self.training_data])
        
        # Split for validation
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=2,
            random_state=42,
            class_weight='balanced'
        )
        self.model.fit(X_train_scaled, y_train)
        
        # Calculate accuracy
        train_acc = self.model.score(X_train_scaled, y_train)
        test_acc = self.model.score(X_test_scaled, y_test)
        
        self.is_model_trained = True
        self.save_model()
        
        return {
            "status": "success",
            "message": "Model trained successfully",
            "train_accuracy": round(train_acc * 100, 2),
            "test_accuracy": round(test_acc * 100, 2),
            "samples_used": len(self.training_data),
            "feature_importance": dict(zip([
                "ear_left", "ear_right", "ear_avg", "mouth_openness",
                "head_yaw", "head_pitch", "head_roll",
                "face_center_x", "face_center_y", "blink_detected"
            ], self.model.feature_importances_.tolist()))
        }
    
    def predict_state(self, frame: np.ndarray) -> Optional[Dict]:
        """Predict attention state using trained model"""
        # Extract features
        features = self.extract_features(frame)
        if features is None:
            return None
        
        # Store in history for temporal smoothing
        self.feature_history.append(features.to_array())
        
        state = "Unknown"
        confidence = 0.0
        attention_score = 50
        
        if self.is_model_trained and self.model and self.scaler:
            # Scale features
            features_scaled = self.scaler.transform(features.to_array().reshape(1, -1))
            
            # Get prediction and probabilities
            prediction = self.model.predict(features_scaled)[0]
            probabilities = self.model.predict_proba(features_scaled)[0]
            
            # Get confidence (max probability)
            confidence = float(np.max(probabilities))
            
            # Temporal smoothing: majority vote over last predictions
            self.prediction_history.append(prediction)
            if len(self.prediction_history) >= 5:
                recent_predictions = list(self.prediction_history)[-5:]
                # Count occurrences
                counts = {}
                for p in recent_predictions:
                    counts[p] = counts.get(p, 0) + 1
                # Get majority
                state = max(counts, key=counts.get)
            else:
                state = prediction
            
            # Calculate attention score from confidence and class
            class_names = self.model.classes_
            class_idx = np.where(class_names == state)[0][0]
            class_prob = probabilities[class_idx]
            
            # Map to attention score
            if state == "Focused":
                attention_score = int(40 + class_prob * 60)  # 40-100
            elif state == "Distracted":
                attention_score = int(20 + class_prob * 40)  # 20-60
            else:  # Sleepy
                attention_score = int(class_prob * 30)  # 0-30
        else:
            # Fallback to rule-based if model not trained
            state = self._rule_based_prediction(features)
            attention_score = self._calculate_heuristic_score(features)
            confidence = 0.5
        
        # Smooth attention score transitions
        attention_score = int(0.7 * self.last_attention_score + 0.3 * attention_score)
        self.last_attention_score = attention_score
        
        return {
            "state": state,
            "confidence": round(confidence, 3),
            "attention_score": attention_score,
            "features": features.to_dict()
        }
    
    def _rule_based_prediction(self, features: ExtractedFeatures) -> str:
        """Fallback rule-based prediction"""
        if features.ear_avg < 0.18:
            return "Sleepy"
        elif abs(features.head_yaw) > 0.4 or abs(features.head_pitch) > 0.4:
            return "Distracted"
        else:
            return "Focused"
    
    def _calculate_heuristic_score(self, features: ExtractedFeatures) -> int:
        """Fallback heuristic attention score"""
        eye_score = min(features.ear_avg / 0.25, 1.0) * 40
        pose_score = max(0, 1 - (abs(features.head_yaw) + abs(features.head_pitch)) / 2) * 30
        stability_score = 30  # Default
        return int(eye_score + pose_score + stability_score)
    
    def analyze_frame(self, frame: np.ndarray) -> Dict:
        """Main analysis function - process frame and return results"""
        prediction = self.predict_state(frame)
        
        if prediction is None:
            return {
                "face_detected": False,
                "state": "No Face",
                "attention_score": 0,
                "confidence": 0,
                "message": "No face detected"
            }
        
        # Draw landmarks on frame
        annotated_frame = self._draw_landmarks(frame.copy())
        
        # Convert to base64
        _, buffer = cv2.imencode('.jpg', annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
        processed_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Check for low attention alert
        consecutive_low = sum(1 for p in self.prediction_history if p in ["Distracted", "Sleepy"])
        
        return {
            "face_detected": True,
            "state": prediction["state"],
            "attention_score": prediction["attention_score"],
            "confidence": prediction["confidence"],
            "ear": prediction["features"]["ear_avg"],
            "face_stability": 1.0 - abs(prediction["features"]["face_center_x"]),
            "head_pose": {
                "yaw": round(prediction["features"]["head_yaw"], 3),
                "pitch": round(prediction["features"]["head_pitch"], 3),
                "roll": round(prediction["features"]["head_roll"], 3)
            },
            "num_eyes": 2 if prediction["features"]["ear_avg"] > 0.1 else 0,
            "features": prediction["features"],
            "processed_image": f"data:image/jpeg;base64,{processed_base64}",
            "message": f"Student is {prediction['state'].lower()} ({prediction['attention_score']}% attention)",
            "consecutive_low": consecutive_low,
            "model_trained": self.is_model_trained
        }
    
    def _draw_landmarks(self, frame: np.ndarray) -> np.ndarray:
        """Draw MediaPipe landmarks on frame"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                mp_drawing.draw_landmarks(
                    image=frame,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style()
                )
                mp_drawing.draw_landmarks(
                    image=frame,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_CONTOURS,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_contours_style()
                )
        
        return frame
    
    def get_training_stats(self) -> Dict:
        """Get training data statistics"""
        if not self.training_data:
            return {"status": "empty", "count": 0}
        
        counts = {}
        for _, label in self.training_data:
            counts[label] = counts.get(label, 0) + 1
        
        return {
            "status": "collecting",
            "total_samples": len(self.training_data),
            "by_class": counts,
            "model_trained": self.is_model_trained
        }
    
    def clear_training_data(self):
        """Clear all training data"""
        self.training_data = []
        self.training_data.clear()


# Global analyzer instance
analyzer = MLAttentionAnalyzer()


# ==================== API ENDPOINTS ====================

class TrainingLabelRequest(BaseModel):
    label: str  # "focused", "distracted", "sleepy"


@app.post("/cv/analyze-frame")
async def cv_analyze_frame(file: UploadFile = File(...)):
    """Analyze frame and return ML-based prediction"""
    try:
        start_time = time.time()
        contents = await file.read()
        
        # Decode image
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image frame")
        
        # Process frame
        result = analyzer.analyze_frame(frame)
        result["processing_time"] = round(time.time() - start_time, 3)
        
        # If in training collection mode, also collect sample
        if analyzer.collecting_mode:
            analyzer.collect_training_sample(frame, analyzer.collecting_mode)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/cv/add-sample")
async def cv_add_sample(file: UploadFile = File(...), label: str = "focused"):
    """
    Add training sample with features and label.
    Body: multipart/form-data with file (image) and label (focused/distracted/sleepy)
    """
    print(f"[NeuroVista Backend] Received add-sample request for label: {label}")
    try:
        contents = await file.read()
        print(f"[NeuroVista Backend] File received: {len(contents)} bytes")

        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            print("[NeuroVista Backend] ERROR: Failed to decode image")
            raise HTTPException(status_code=400, detail="Invalid image - could not decode")

        print(f"[NeuroVista Backend] Image decoded: {frame.shape}")

        # Extract features first to check if face is detected
        features = analyzer.extract_features(frame)

        if features is None:
            print("[NeuroVista Backend] No face detected in sample")
            return {
                "status": "error",
                "message": "No face detected in sample",
                "face_detected": False
            }

        print(f"[NeuroVista Backend] Face detected, EAR: {features.ear_avg:.3f}")

        # Collect the training sample
        success = analyzer.collect_training_sample(frame, label)

        if success:
            stats = analyzer.get_training_stats()
            print(f"[NeuroVista Backend] Sample added for [{label}]. Total samples: {stats.get('total_samples', 0)}")
            return {
                "status": "success",
                "message": f"Sample added for '{label}'",
                "label": label,
                "face_detected": True,
                "features": features.to_dict(),
                "stats": stats,
                "total_count": stats.get("total_samples", 0)
            }
        else:
            return {
                "status": "error",
                "message": "Failed to collect sample",
                "face_detected": False
            }

    except Exception as e:
        print(f"[NeuroVista Backend] ERROR in add-sample: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/cv/collect-sample")
async def cv_collect_sample(file: UploadFile = File(...), label: str = "focused"):
    """Collect training sample with label (alias for add-sample for backward compatibility)"""
    return await cv_add_sample(file, label)


@app.post("/cv/train")
async def cv_train_model():
    """Train the ML model on collected samples"""
    result = analyzer.train_model()
    return result


@app.get("/cv/training-stats")
async def cv_training_stats():
    """Get training data statistics"""
    return analyzer.get_training_stats()


@app.post("/cv/clear-training")
async def cv_clear_training():
    """Clear all training data"""
    analyzer.clear_training_data()
    return {"status": "success", "message": "Training data cleared"}


@app.get("/cv/status")
async def cv_status():
    """Get CV service status"""
    return {
        "status": "success",
        "model_trained": analyzer.is_model_trained,
        "mediapipe_available": True,
        "training_samples": len(analyzer.training_data),
        "prediction_history_size": len(analyzer.prediction_history)
    }


# ==================== HEALTH CHECK ====================

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "NeuroVista ML API",
        "version": "3.0.0",
        "model_trained": analyzer.is_model_trained
    }


@app.get("/")
async def root():
    return {
        "message": "NeuroVista ML Attention API",
        "docs": "/docs",
        "endpoints": {
            "analyze": "POST /cv/analyze-frame",
            "collect": "POST /cv/collect-sample?label=focused",
            "train": "POST /cv/train",
            "stats": "GET /cv/training-stats"
        }
    }


# ==================== HOPFIELD NETWORK - SECURE AUTHENTICATION ====================

class SecureHopfieldNetwork:
    """
    Advanced Hopfield Network for Secure Pattern Authentication & Error Correction
    Implements proper Hebbian learning with symmetric weight matrix
    """
    
    def __init__(self, size: int = 100):
        self.size = size
        self.weights = np.zeros((size, size))
        self.stored_patterns: List[np.ndarray] = []
        self.pattern_labels: List[str] = []
        self.max_capacity = int(0.138 * size)  # Theoretical limit
        self.energy_history: List[float] = []
        self.update_history: List[np.ndarray] = []
        
    def clear(self):
        """Clear all stored patterns"""
        self.weights = np.zeros((self.size, self.size))
        self.stored_patterns = []
        self.pattern_labels = []
        self.energy_history = []
        self.update_history = []
    
    def bipolarize(self, pattern: np.ndarray) -> np.ndarray:
        """Convert pattern to bipolar format (-1, +1)"""
        return np.where(pattern > 0, 1, -1).astype(np.float64)
    
    def train(self, patterns: List[np.ndarray], labels: List[str] = None) -> Dict:
        """
        Train network using Hebbian learning rule
        W = sum of outer products of patterns
        """
        if len(patterns) > self.max_capacity:
            return {
                "status": "error",
                "message": f"Too many patterns. Max capacity: {self.max_capacity}, got: {len(patterns)}"
            }
        
        # Clear existing weights
        self.weights = np.zeros((self.size, self.size))
        self.stored_patterns = []
        self.pattern_labels = labels if labels else [f"Pattern_{i}" for i in range(len(patterns))]
        
        # Convert to bipolar and store
        bipolar_patterns = [self.bipolarize(p) for p in patterns]
        self.stored_patterns = bipolar_patterns
        
        # Hebbian learning: W = sum of outer products
        for pattern in bipolar_patterns:
            self.weights += np.outer(pattern, pattern)
        
        # Normalize by number of patterns
        if len(patterns) > 0:
            self.weights /= len(patterns)
        
        # Ensure no self-connections (diagonal = 0)
        np.fill_diagonal(self.weights, 0)
        
        # Ensure symmetric matrix
        self.weights = (self.weights + self.weights.T) / 2
        
        return {
            "status": "success",
            "patterns_stored": int(len(patterns)),
            "capacity_used": f"{len(patterns)}/{self.max_capacity}",
            "weight_matrix_shape": list(self.weights.shape),
            "sparsity": float(np.mean(self.weights == 0))
        }
    
    def add_noise(self, pattern: np.ndarray, noise_level: float) -> np.ndarray:
        """Add controlled noise by flipping random bits"""
        noisy = pattern.copy()
        num_flips = int(noise_level * len(pattern))
        flip_indices = np.random.choice(len(pattern), num_flips, replace=False)
        noisy[flip_indices] *= -1
        return noisy
    
    def energy(self, state: np.ndarray) -> float:
        """
        Calculate energy: E = -0.5 * sum(W_ij * s_i * s_j)
        Energy always decreases or stays constant during updates
        """
        return -0.5 * np.dot(state.T, np.dot(self.weights, state))
    
    def update_async(self, state: np.ndarray, max_iterations: int = 100) -> Tuple[np.ndarray, List[float], bool]:
        """
        Asynchronous update: update neurons one at a time randomly
        Returns: (final_state, energy_curve, converged)
        """
        current_state = self.bipolarize(state).copy()
        energy_curve = [self.energy(current_state)]
        
        for iteration in range(max_iterations):
            # Pick random neuron
            i = np.random.randint(0, self.size)
            
            # Calculate local field
            h = np.dot(self.weights[i], current_state)
            
            # Update rule
            new_value = 1 if h >= 0 else -1
            
            if new_value != current_state[i]:
                current_state[i] = new_value
                energy_curve.append(self.energy(current_state))
        
        # Check if stable (one more full sweep)
        converged = True
        for i in range(self.size):
            h = np.dot(self.weights[i], current_state)
            new_value = 1 if h >= 0 else -1
            if new_value != current_state[i]:
                converged = False
                break
        
        return current_state, energy_curve, converged
    
    def update_sync(self, state: np.ndarray, max_iterations: int = 50) -> Tuple[np.ndarray, List[float], bool]:
        """
        Synchronous update: update all neurons simultaneously
        May not converge, useful for observing dynamics
        """
        current_state = self.bipolarize(state).copy()
        energy_curve = [self.energy(current_state)]
        
        for iteration in range(max_iterations):
            # Calculate all local fields
            h = np.dot(self.weights, current_state)
            new_state = np.where(h >= 0, 1, -1)
            
            # Check convergence
            if np.array_equal(new_state, current_state):
                energy_curve.append(self.energy(new_state))
                return new_state, energy_curve, True
            
            current_state = new_state
            energy_curve.append(self.energy(current_state))
        
        return current_state, energy_curve, False
    
    def authenticate(self, pattern: np.ndarray) -> Dict:
        """
        Authenticate pattern: recover and match against stored patterns
        """
        if len(self.stored_patterns) == 0:
            return {
                "status": "error",
                "message": "No patterns stored in network"
            }
        
        # Recover pattern
        recovered, energy_curve, converged = self.update_async(pattern)
        
        # Find best matching stored pattern
        best_match_idx = -1
        best_similarity = -1
        similarities = []
        
        for idx, stored in enumerate(self.stored_patterns):
            similarity = np.mean(recovered == stored)
            similarities.append({
                "label": self.pattern_labels[idx],
                "similarity": float(similarity)
            })
            
            if similarity > best_similarity:
                best_similarity = similarity
                best_match_idx = idx
        
        # Determine match
        threshold = 0.85  # 85% similarity threshold
        matched = best_similarity >= threshold
        
        return {
            "status": "success",
            "matched": bool(matched),
            "matched_label": self.pattern_labels[best_match_idx] if matched else None,
            "similarity": float(best_similarity),
            "all_similarities": similarities,
            "converged": bool(converged),
            "final_energy": float(energy_curve[-1]),
            "iterations": len(energy_curve) - 1,
            "recovered_pattern": recovered.tolist(),
            "energy_curve": [float(e) for e in energy_curve]
        }
    
    def get_pattern_template(self, pattern_type: str) -> np.ndarray:
        """Generate predefined pattern templates"""
        size = int(np.sqrt(self.size))
        pattern = np.zeros(self.size)
        
        if pattern_type == "A":
            # Letter A pattern
            for i in range(size):
                for j in range(size):
                    idx = i * size + j
                    if i == 0 or i == size // 2 or j == 0 or j == size - 1:
                        if 0 < i < size - 1 and 0 < j < size - 1:
                            pattern[idx] = 1
        elif pattern_type == "B":
            # Letter B pattern
            for i in range(size):
                for j in range(size):
                    idx = i * size + j
                    if j == 0 or (i == 0 and j < size - 1) or \
                       (i == size // 2 and j < size - 1) or \
                       (i == size - 1 and j < size - 1):
                        pattern[idx] = 1
        elif pattern_type == "C":
            # Letter C pattern
            for i in range(size):
                for j in range(size):
                    idx = i * size + j
                    if j == 0 or i == 0 or i == size - 1:
                        if 0 < j < size - 1:
                            pattern[idx] = 1
        elif pattern_type == "square":
            # Square pattern
            for i in range(size):
                for j in range(size):
                    idx = i * size + j
                    if i < 2 or i >= size - 2 or j < 2 or j >= size - 2:
                        pattern[idx] = 1
        elif pattern_type == "cross":
            # Cross pattern
            for i in range(size):
                for j in range(size):
                    idx = i * size + j
                    if i == size // 2 or j == size // 2:
                        pattern[idx] = 1
        
        return self.bipolarize(pattern)


# Global Hopfield instance (10x10 grid = 100 neurons)
hopfield_auth = SecureHopfieldNetwork(size=100)

class HopfieldStoreRequest(BaseModel):
    patterns: List[List[int]]
    labels: List[str] = []

class HopfieldRecoverRequest(BaseModel):
    pattern: List[int]
    noise_level: float = 0.2
    update_mode: str = "async" # "async" or "sync"


class HopfieldNoiseRequest(BaseModel):
    pattern: List[int]
    noise_level: float = 0.2


class HopfieldStepRequest(BaseModel):
    state: List[int]


@app.post("/hopfield/store")
async def hopfield_store(request: HopfieldStoreRequest):
    """Store patterns in Hopfield network for authentication"""
    try:
        # Convert patterns to numpy arrays
        patterns = [np.array(p) for p in request.patterns]
        
        result = hopfield_auth.train(patterns, request.labels)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/hopfield/recover")
async def hopfield_recover(request: HopfieldRecoverRequest):
    """Recover pattern and authenticate against stored patterns"""
    try:
        pattern = np.array(request.pattern)
        
        # Add noise if specified
        noisy_pattern = hopfield_auth.add_noise(pattern, request.noise_level)
        
        # Update and recover
        if request.update_mode == "sync":
            recovered, energy_curve, converged = hopfield_auth.update_sync(noisy_pattern)
        else:
            recovered, energy_curve, converged = hopfield_auth.update_async(noisy_pattern)
        
        # Authenticate
        auth_result = hopfield_auth.authenticate(noisy_pattern)
        
        return {
            "status": "success",
            "original_pattern": pattern.tolist(),
            "noisy_pattern": noisy_pattern.tolist(),
            "recovered_pattern": recovered.tolist(),
            "energy_curve": [float(e) for e in energy_curve],
            "converged": bool(converged),
            "matched": bool(auth_result["matched"]),
            "matched_label": auth_result.get("matched_label"),
            "similarity": float(auth_result["similarity"]),
            "all_similarities": auth_result["all_similarities"],
            "iterations": int(auth_result["iterations"]),
            "final_energy": float(auth_result["final_energy"])
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/hopfield/templates")
async def hopfield_templates():
    """Get predefined pattern templates"""
    templates = {}
    for name in ["A", "B", "C", "square", "cross"]:
        templates[name] = hopfield_auth.get_pattern_template(name).tolist()
    
    return {
        "status": "success",
        "templates": templates,
        "grid_size": int(np.sqrt(hopfield_auth.size)),
        "max_patterns": int(hopfield_auth.max_capacity)
    }


@app.get("/hopfield/status")
async def hopfield_status():
    """Get Hopfield network status"""
    return {
        "status": "success",
        "network_size": int(hopfield_auth.size),
        "patterns_stored": int(len(hopfield_auth.stored_patterns)),
        "max_capacity": int(hopfield_auth.max_capacity),
        "capacity_used": float(len(hopfield_auth.stored_patterns) / hopfield_auth.max_capacity),
        "labels": hopfield_auth.pattern_labels
    }


@app.post("/hopfield/noise")
async def hopfield_noise(request: HopfieldNoiseRequest):
    """Add noise to a pattern without recovery"""
    try:
        pattern = np.array(request.pattern)
        noisy = hopfield_auth.add_noise(pattern, request.noise_level)
        return {
            "status": "success",
            "original_pattern": pattern.tolist(),
            "noisy_pattern": noisy.tolist(),
            "noise_level": float(request.noise_level),
            "energy": float(hopfield_auth.energy(noisy))
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/hopfield/step")
async def hopfield_step(request: HopfieldStepRequest):
    """Perform single asynchronous update step"""
    try:
        state = np.array(request.state)
        state = hopfield_auth.bipolarize(state)

        # Pick random neuron to update
        i = np.random.randint(0, hopfield_auth.size)

        # Calculate local field
        h = np.dot(hopfield_auth.weights[i], state)

        # Update rule
        new_value = 1 if h >= 0 else -1

        # Update if changed
        if new_value != state[i]:
            state[i] = new_value
            changed = True
        else:
            changed = False

        # Calculate new energy
        energy = hopfield_auth.energy(state)

        # Check convergence (if no neuron would change)
        converged = True
        for j in range(hopfield_auth.size):
            h_j = np.dot(hopfield_auth.weights[j], state)
            new_j = 1 if h_j >= 0 else -1
            if new_j != state[j]:
                converged = False
                break

        return {
            "status": "success",
            "state": state.tolist(),
            "updated_index": int(i) if changed else None,
            "changed": bool(changed),
            "energy": float(energy),
            "converged": bool(converged)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/hopfield/clear")
async def hopfield_clear():
    """Clear all stored patterns"""
    hopfield_auth.clear()
    return {"status": "success", "message": "Network cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
