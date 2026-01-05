// src/components/Mindfulness.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Sparkles } from "lucide-react";
import QuoteBox from "./QuoteBox";

const Mindfulness = ({ showWelcome = true, showQuote = false, showBreathing = true }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathState, setBreathState] = useState("Ready");

  useEffect(() => {
    let timer;
    if (isBreathing) {
      // Simple breathing cycle: 4s inhale, 4s hold, 6s exhale
      const cycle = () => {
        setBreathState("Inhale");
        timer = setTimeout(() => {
          setBreathState("Hold");
          timer = setTimeout(() => {
            setBreathState("Exhale");
            timer = setTimeout(() => {
              setBreathState("Rest");
            }, 6000);
          }, 4000);
        }, 4000);
      };

      cycle(); // Start the first cycle
      const interval = setInterval(cycle, 18000); // Repeat every 18 seconds

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setBreathState("Ready");
    }
  }, [isBreathing]);

  const getScale = () => {
    if (!isBreathing) return 1;
    switch (breathState) {
      case "Inhale": return 1.5;
      case "Hold": return 1.5;
      case "Exhale": return 0.8;
      case "Rest": return 1;
      default: return 1;
    }
  };

  const getColor = () => {
    switch (breathState) {
      case "Inhale": return "from-blue-400 to-cyan-500";
      case "Hold": return "from-purple-400 to-pink-500";
      case "Exhale": return "from-green-400 to-teal-500";
      case "Rest": return "from-gray-400 to-gray-500";
      default: return "from-gray-300 to-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {showWelcome && (
        <Card className="max-w-2xl mx-auto glass-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold gradient-text flex items-center gap-3 justify-center">
              <Sparkles className="w-8 h-8" />
              Welcome to MindEase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Your personal wellness companion for mental health and mindfulness.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Track your moods, practice gratitude, meditate, and build healthy habits.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      )}

      {showQuote && <QuoteBox />}

      {showBreathing && (
        <Card className="max-w-2xl mx-auto glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Wind className="w-7 h-7" />
            Guided Breathing Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">
            Follow the breathing guide to reduce stress and increase focus.
          </p>

          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              animate={{
                scale: getScale(),
              }}
              transition={{
                duration: breathState === "Inhale" ? 4 : breathState === "Exhale" ? 6 : 1,
                ease: "easeInOut"
              }}
              className={`w-64 h-64 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl bg-gradient-to-br ${getColor()}`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={breathState}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-center"
                >
                  {breathState}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.p
              key={breathState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-xl font-medium text-gray-800 dark:text-gray-200"
            >
              {isBreathing
                ? breathState === "Inhale"
                  ? "Breathe in slowly through your nose..."
                  : breathState === "Hold"
                  ? "Hold your breath gently..."
                  : breathState === "Exhale"
                  ? "Breathe out slowly through your mouth..."
                  : "Relax and prepare..."
                : "Press start to begin your breathing exercise"}
            </motion.p>

            <motion.div 
              className="mt-8"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsBreathing(!isBreathing)}
                className={`btn-gradient px-8 py-4 text-lg ${isBreathing ? "!bg-gradient-to-r !from-red-500 !to-orange-500 hover:!from-red-600 hover:!to-orange-600" : ""}`}
              >
                {isBreathing ? "⏸ Stop" : "▶ Start Breathing"}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default Mindfulness;
