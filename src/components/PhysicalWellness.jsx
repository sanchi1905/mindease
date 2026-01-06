// src/components/PhysicalWellness.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Play, Pause, RotateCcw, Clock, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

const EXERCISES = [
  {
    id: 1,
    name: "Morning Sun Salutation",
    type: "Yoga",
    duration: 10,
    difficulty: "Beginner",
    calories: 45,
    steps: [
      "Stand in Mountain Pose (Tadasana) - feet together, arms at sides",
      "Inhale, raise arms overhead (Upward Salute)",
      "Exhale, fold forward (Standing Forward Bend)",
      "Inhale, lift halfway up (Halfway Lift)",
      "Exhale, step back to Plank Pose",
      "Lower down to Chaturanga (or knees-chest-chin)",
      "Inhale, lift to Upward-Facing Dog",
      "Exhale, press back to Downward-Facing Dog",
      "Hold for 5 breaths",
      "Step forward, fold, then rise back to standing",
    ],
  },
  {
    id: 2,
    name: "Desk Stretch Relief",
    type: "Stretching",
    duration: 5,
    difficulty: "Beginner",
    calories: 15,
    steps: [
      "Neck Rolls: Slowly roll head in circles, 5 times each direction",
      "Shoulder Shrugs: Lift shoulders to ears, hold 3 seconds, release - repeat 10 times",
      "Chest Opener: Clasp hands behind back, straighten arms, lift chest - hold 20 seconds",
      "Seated Spinal Twist: Sit tall, twist to right, hold 15 seconds, repeat left",
      "Wrist Circles: Extend arms, rotate wrists in circles - 10 times each way",
      "Forward Fold: Stand, bend forward, let arms dangle - hold 30 seconds",
    ],
  },
  {
    id: 3,
    name: "Energy Boost Flow",
    type: "Yoga",
    duration: 15,
    difficulty: "Intermediate",
    calories: 80,
    steps: [
      "Cat-Cow Pose: On hands/knees, arch and round spine - 10 rounds",
      "Downward Dog: Hold for 8 breaths, pedal feet",
      "Warrior I: Right leg forward, arms up - hold 5 breaths",
      "Warrior II: Open arms wide, gaze forward - hold 5 breaths",
      "Triangle Pose: Straighten front leg, reach side - hold 5 breaths",
      "Repeat Warrior sequence on left side",
      "Boat Pose: Balance on sit bones, lift legs - hold 5 breaths",
      "Bridge Pose: Lift hips, clasp hands - hold 8 breaths",
      "Child's Pose: Rest and breathe - 1 minute",
    ],
  },
  {
    id: 4,
    name: "Evening Wind Down",
    type: "Yoga",
    duration: 12,
    difficulty: "Beginner",
    calories: 35,
    steps: [
      "Seated Forward Bend: Sit, extend legs, fold forward - hold 1 minute",
      "Butterfly Pose: Soles together, gently press knees down - hold 1 minute",
      "Supine Twist: Lie down, drop knees to side - hold 1 minute each side",
      "Legs Up the Wall: Scoot close to wall, extend legs up - hold 5 minutes",
      "Happy Baby: Grab feet, gently rock side to side - 1 minute",
      "Savasana: Lie flat, close eyes, breathe deeply - 3 minutes",
    ],
  },
  {
    id: 5,
    name: "Core Strength Builder",
    type: "Exercise",
    duration: 8,
    difficulty: "Intermediate",
    calories: 60,
    steps: [
      "Plank Hold: Hold 30 seconds, rest 10 seconds - repeat 3 times",
      "Bicycle Crunches: 20 reps (10 each side)",
      "Russian Twists: 30 reps total (alternating sides)",
      "Leg Raises: Lie on back, lift legs up and down - 15 reps",
      "Mountain Climbers: Quick alternating knees to chest - 30 seconds",
      "Side Plank: Hold 20 seconds each side",
    ],
  },
  {
    id: 6,
    name: "Full Body Stretch",
    type: "Stretching",
    duration: 10,
    difficulty: "Beginner",
    calories: 25,
    steps: [
      "Standing Quad Stretch: Hold foot behind, 30 seconds each leg",
      "Hamstring Stretch: Sit, reach for toes, hold 30 seconds",
      "Hip Flexor Lunge: Low lunge position, hold 30 seconds each side",
      "Shoulder Cross-Body Stretch: Pull arm across chest, 20 seconds each",
      "Tricep Stretch: Arm overhead, bend elbow, pull gently - 20 seconds each",
      "Cobra Stretch: Lie on stomach, press up, arch back - hold 30 seconds",
      "Pigeon Pose: Hip opener, hold 45 seconds each side",
      "Spinal Twist: Seated twist, 30 seconds each direction",
    ],
  },
];

const PhysicalWellness = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [filter, setFilter] = useState("All");
  const [timerInterval, setTimerInterval] = useState(null);

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setCurrentStep(0);
    setTimeRemaining(exercise.duration * 60);
    setIsActive(false);
  };

  const startTimer = () => {
    if (isActive) {
      // Pause
      clearInterval(timerInterval);
      setIsActive(false);
    } else {
      // Start
      setIsActive(true);
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            toast.success("Exercise complete! Great job! 🎉");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const resetExercise = () => {
    clearInterval(timerInterval);
    setIsActive(false);
    setCurrentStep(0);
    setTimeRemaining(selectedExercise.duration * 60);
  };

  const closeExercise = () => {
    clearInterval(timerInterval);
    setSelectedExercise(null);
    setCurrentStep(0);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredExercises = filter === "All"
    ? EXERCISES
    : EXERCISES.filter((ex) => ex.type === filter);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-3">
              <Activity className="w-6 h-6 md:w-8 md:h-8" />
              Physical Wellness
            </CardTitle>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Yoga, stretching, and exercise routines for body & mind
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {["All", "Yoga", "Stretching", "Exercise"].map((type) => (
                <Button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`${
                    filter === type
                      ? "btn-gradient"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {type}
                </Button>
              ))}
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise) => (
                <motion.div
                  key={exercise.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="glass-card cursor-pointer h-full" onClick={() => startExercise(exercise)}>
                    <CardContent className="p-4 md:p-6">
                      <div className="mb-4">
                        <h3 className="font-bold text-base md:text-lg mb-2">{exercise.name}</h3>
                        <div className="flex gap-2 mb-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {exercise.type}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{exercise.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{exercise.calories} cal</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{exercise.steps.length} steps</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4 btn-gradient touch-target">
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeExercise}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                      {selectedExercise.name}
                    </h2>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {selectedExercise.type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {selectedExercise.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeExercise}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Timer */}
                <Card className="glass-card mb-6">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl md:text-6xl font-bold text-purple-600 mb-4">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={startTimer} className="btn-gradient touch-target">
                        {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <Button onClick={resetExercise} className="bg-gray-300 dark:bg-gray-700 touch-target">
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Steps */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Exercise Steps</h3>
                  <div className="space-y-3">
                    {selectedExercise.steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`glass-card ${
                          index === currentStep ? "ring-2 ring-purple-500" : ""
                        }`}>
                          <CardContent className="p-4 flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <p className="text-sm md:text-base flex-1">{step}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="flex-1 bg-gray-300 dark:bg-gray-700 disabled:opacity-50 touch-target"
                  >
                    Previous Step
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(Math.min(selectedExercise.steps.length - 1, currentStep + 1))}
                    disabled={currentStep === selectedExercise.steps.length - 1}
                    className="flex-1 btn-gradient disabled:opacity-50 touch-target"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhysicalWellness;
