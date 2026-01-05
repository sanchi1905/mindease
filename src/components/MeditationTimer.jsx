// src/components/MeditationTimer.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';

const MeditationTimer = () => {
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.success('🧘 Meditation complete! Great job!', {
              duration: 5000,
              icon: '✨',
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.success('Meditation started. Take deep breaths...');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <Card className="max-w-2xl mx-auto mt-8 glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text text-center">
          🧘 Meditation Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timer Display */}
          <motion.div
            className="relative w-64 h-64 mx-auto"
            animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: isRunning ? Infinity : 0, duration: 4 }}
          >
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-6xl font-bold gradient-text"
                animate={{ opacity: isRunning ? [1, 0.7, 1] : 1 }}
                transition={{ repeat: isRunning ? Infinity : 0, duration: 2 }}
              >
                {formatTime(timeLeft)}
              </motion.div>
            </div>
          </motion.div>

          {/* Duration Selector */}
          {!isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-2 flex-wrap"
            >
              {[3, 5, 10, 15, 20].map((min) => (
                <button
                  key={min}
                  onClick={() => setDuration(min)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    duration === min
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {min} min
                </button>
              ))}
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={handleStartPause}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={handleReset}
                className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </Button>
            </motion.div>
          </div>

          {/* Breathing Guide */}
          {isRunning && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.p
                  className="text-xl font-medium text-gray-700 dark:text-gray-300"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  Breathe in... Hold... Breathe out...
                </motion.p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationTimer;
