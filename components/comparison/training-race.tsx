"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Trophy, Timer } from "lucide-react";

interface TrainingState {
  epoch: number;
  accuracy: number;
  loss: number;
  isConverged: boolean;
  history: { epoch: number; accuracy: number; loss: number }[];
}

// Simulated training for XOR problem
function simulatePerceptronTraining(epoch: number): { accuracy: number; loss: number } {
  // Perceptron can't solve XOR - accuracy stays around 50%
  const noise = Math.random() * 0.1 - 0.05;
  return {
    accuracy: Math.min(0.5 + noise, 0.55),
    loss: 0.5 + Math.random() * 0.1,
  };
}

function simulateMLPTraining(epoch: number): { accuracy: number; loss: number } {
  // MLP converges to solve XOR
  const progress = 1 - Math.exp(-epoch / 30);
  const noise = Math.random() * 0.05 * (1 - progress);
  return {
    accuracy: Math.min(0.5 + progress * 0.5 + noise, 1),
    loss: Math.max(0.5 * (1 - progress) + noise, 0.01),
  };
}

export function TrainingRace() {
  const [isRunning, setIsRunning] = useState(false);
  const [perceptronState, setPerceptronState] = useState<TrainingState>({
    epoch: 0,
    accuracy: 0.5,
    loss: 0.5,
    isConverged: false,
    history: [],
  });
  const [mlpState, setMlpState] = useState<TrainingState>({
    epoch: 0,
    accuracy: 0.5,
    loss: 0.5,
    isConverged: false,
    history: [],
  });
  const [winner, setWinner] = useState<"perceptron" | "mlp" | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    setIsRunning(false);
    setWinner(null);
    setPerceptronState({
      epoch: 0,
      accuracy: 0.5,
      loss: 0.5,
      isConverged: false,
      history: [],
    });
    setMlpState({
      epoch: 0,
      accuracy: 0.5,
      loss: 0.5,
      isConverged: false,
      history: [],
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const runTrainingStep = useCallback(() => {
    setPerceptronState((prev) => {
      const newEpoch = prev.epoch + 1;
      const { accuracy, loss } = simulatePerceptronTraining(newEpoch);
      return {
        epoch: newEpoch,
        accuracy,
        loss,
        isConverged: false, // Perceptron never converges on XOR
        history: [...prev.history, { epoch: newEpoch, accuracy, loss }],
      };
    });

    setMlpState((prev) => {
      const newEpoch = prev.epoch + 1;
      const { accuracy, loss } = simulateMLPTraining(newEpoch);
      const isConverged = accuracy >= 0.95;
      
      if (isConverged && !winner) {
        setWinner("mlp");
        setIsRunning(false);
      }
      
      return {
        epoch: newEpoch,
        accuracy,
        loss,
        isConverged,
        history: [...prev.history, { epoch: newEpoch, accuracy, loss }],
      };
    });
  }, [winner]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(runTrainingStep, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, runTrainingStep]);

  // Stop after 200 epochs
  useEffect(() => {
    if (perceptronState.epoch >= 200) {
      setIsRunning(false);
      if (!winner) {
        setWinner("mlp");
      }
    }
  }, [perceptronState.epoch, winner]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Training Race: XOR Problem
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              Epoch: {perceptronState.epoch}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            disabled={winner !== null}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> {perceptronState.epoch === 0 ? "Start Race" : "Resume"}
              </>
            )}
          </Button>
          <Button onClick={reset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        {/* Race Track */}
        <div className="space-y-6">
          {/* Perceptron Track */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="font-medium text-foreground">Perceptron</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Accuracy: {(perceptronState.accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="relative h-8 bg-secondary/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${perceptronState.accuracy * 100}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-4">
                <span className="text-xs font-medium text-foreground">
                  {perceptronState.accuracy >= 0.95 ? "Converged!" : "Stuck at ~50%"}
                </span>
              </div>
            </div>
          </div>

          {/* MLP Track */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium text-foreground">MLP (2 Hidden Neurons)</span>
                {winner === "mlp" && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Winner!
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Accuracy: {(mlpState.accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="relative h-8 bg-secondary/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${mlpState.accuracy * 100}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-4">
                <span className="text-xs font-medium text-foreground">
                  {mlpState.isConverged ? "Converged!" : "Learning..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loss Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Perceptron Loss</div>
            <div className="text-2xl font-bold text-orange-400">
              {perceptronState.loss.toFixed(4)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Cannot minimize below ~0.5
            </div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">MLP Loss</div>
            <div className="text-2xl font-bold text-primary">
              {mlpState.loss.toFixed(4)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {mlpState.isConverged ? "Converged to near-zero" : "Decreasing steadily"}
            </div>
          </div>
        </div>

        {/* Explanation */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/20"
          >
            <h4 className="font-medium text-primary mb-2">Race Complete!</h4>
            <p className="text-sm text-muted-foreground">
              The MLP successfully learned the XOR pattern while the Perceptron remained stuck at 
              random guessing (~50% accuracy). This demonstrates why hidden layers are essential 
              for learning non-linearly separable patterns. The Perceptron can only draw a single 
              straight line, which cannot separate XOR outputs.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
