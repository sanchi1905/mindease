// src/components/SOSRelief.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Heart, Brain, Hand, Eye, Wind } from "lucide-react";

const TECHNIQUES = [
  {
    id: "54321",
    name: "5-4-3-2-1 Grounding",
    icon: Hand,
    color: "from-red-400 to-pink-500",
    steps: [
      "Name 5 things you can SEE around you",
      "Name 4 things you can TOUCH",
      "Name 3 things you can HEAR",
      "Name 2 things you can SMELL",
      "Name 1 thing you can TASTE"
    ]
  },
  {
    id: "box-breathing",
    name: "Box Breathing",
    icon: Wind,
    color: "from-blue-400 to-cyan-500",
    steps: [
      "Breathe in for 4 counts",
      "Hold for 4 counts",
      "Breathe out for 4 counts",
      "Hold for 4 counts",
      "Repeat 4 times"
    ]
  },
  {
    id: "progressive",
    name: "Quick Body Scan",
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    steps: [
      "Relax your jaw and face",
      "Drop your shoulders",
      "Unclench your hands",
      "Release tension in your legs",
      "Take 3 deep breaths"
    ]
  }
];

const SOSRelief = () => {
  const [activeTechnique, setActiveTechnique] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [breathPhase, setBreathPhase] = useState("");
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (activeTechnique?.id === "box-breathing" && breathPhase) {
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const phases = ["Breathe in", "Hold", "Breathe out", "Hold"];
            const currentIndex = phases.indexOf(breathPhase);
            const nextIndex = (currentIndex + 1) % phases.length;
            setBreathPhase(phases[nextIndex]);
            return 4;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeTechnique, breathPhase]);

  const startTechnique = (technique) => {
    setActiveTechnique(technique);
    setCurrentStep(0);
    if (technique.id === "box-breathing") {
      setBreathPhase("Breathe in");
      setCount(4);
    }
  };

  const nextStep = () => {
    if (currentStep < activeTechnique.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setActiveTechnique(null);
      setCurrentStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* SOS Header */}
        <Card className="glass-card border-2 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 md:w-8 md:h-8 animate-pulse" />
              SOS Quick Relief
            </CardTitle>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Feeling overwhelmed? These techniques provide instant relief for anxiety and panic.
            </p>
          </CardHeader>
        </Card>

        <AnimatePresence mode="wait">
          {!activeTechnique ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              {TECHNIQUES.map((technique) => {
                const Icon = technique.icon;
                return (
                  <motion.button
                    key={technique.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startTechnique(technique)}
                    className="touch-target"
                  >
                    <Card className={`glass-card h-full bg-gradient-to-br ${technique.color} text-white hover:shadow-2xl transition-shadow`}>
                      <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
                        <Icon className="w-12 h-12 md:w-16 md:h-16" />
                        <h3 className="text-lg md:text-xl font-bold">{technique.name}</h3>
                        <p className="text-sm md:text-base opacity-90">
                          {technique.steps.length} steps
                        </p>
                      </CardContent>
                    </Card>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="technique"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className={`glass-card bg-gradient-to-br ${activeTechnique.color}`}>
                <CardContent className="p-6 md:p-12 text-white">
                  <div className="text-center space-y-6 md:space-y-8">
                    <h2 className="text-2xl md:text-4xl font-bold">{activeTechnique.name}</h2>
                    
                    {activeTechnique.id === "box-breathing" ? (
                      <div className="space-y-8">
                        <motion.div
                          animate={{
                            scale: breathPhase.includes("in") || breathPhase.includes("out") ? [1, 1.3, 1] : 1
                          }}
                          transition={{ duration: 4 }}
                          className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                        >
                          <div className="text-5xl md:text-7xl font-bold">{count}</div>
                        </motion.div>
                        <div className="text-2xl md:text-4xl font-semibold">{breathPhase}</div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-xl md:text-2xl font-medium mb-4">
                          Step {currentStep + 1} of {activeTechnique.steps.length}
                        </div>
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-2xl md:text-4xl font-bold min-h-[100px] md:min-h-[150px] flex items-center justify-center"
                        >
                          {activeTechnique.steps[currentStep]}
                        </motion.div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-6">
                      <Button
                        onClick={() => setActiveTechnique(null)}
                        className="bg-white/20 hover:bg-white/30 text-white border-2 border-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg touch-target"
                      >
                        Exit
                      </Button>
                      {activeTechnique.id !== "box-breathing" && (
                        <Button
                          onClick={nextStep}
                          className="bg-white hover:bg-white/90 text-gray-900 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold touch-target"
                        >
                          {currentStep === activeTechnique.steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emergency Resources */}
        <Card className="glass-card">
          <CardContent className="p-4 md:p-6 text-center">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-2">
              If you're in crisis and need immediate help:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm md:text-base">
              <span className="font-semibold">National Crisis Hotline:</span>
              <a href="tel:988" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                988
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SOSRelief;
