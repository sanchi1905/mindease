// src/components/SleepSounds.jsx
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Cloud, Waves, Wind as WindIcon, Music, Moon } from "lucide-react";
import toast from "react-hot-toast";

const SOUNDS = [
  { id: "rain", name: "Rain", icon: Cloud, color: "from-blue-400 to-blue-600", url: "https://cdn.pixabay.com/download/audio/2022/05/13/audio_257112ce24.mp3" },
  { id: "ocean", name: "Ocean Waves", icon: Waves, color: "from-cyan-400 to-blue-500", url: "https://cdn.pixabay.com/download/audio/2022/06/07/audio_70588fae7c.mp3" },
  { id: "forest", name: "Forest", icon: WindIcon, color: "from-green-400 to-green-600", url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_4e3f2f1e7e.mp3" },
  { id: "piano", name: "Piano", icon: Music, color: "from-purple-400 to-purple-600", url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_4a36d2e70d.mp3" },
  { id: "whitenoise", name: "White Noise", icon: Moon, color: "from-gray-400 to-gray-600", url: "https://cdn.pixabay.com/download/audio/2021/12/07/audio_daa867ec6f.mp3" },
];

const SleepSounds = () => {
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const audioRef = useRef(new Audio());
  const timerRef = useRef(null);

  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.loop = true;
  }, [volume]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePlay = (sound) => {
    if (playing === sound.id) {
      audioRef.current.pause();
      setPlaying(null);
      toast.success("Sound paused");
    } else {
      audioRef.current.src = sound.url;
      audioRef.current.play().catch((error) => {
        console.error("Audio playback error:", error);
        toast.error("Unable to play sound. Check your internet connection.");
      });
      setPlaying(sound.id);
      toast.success(`Playing ${sound.name}`);
    }
  };

  const setTimerMinutes = (minutes) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (minutes === 0) {
      setTimer(null);
      setTimeLeft(0);
      return;
    }

    setTimer(minutes);
    setTimeLeft(minutes * 60);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          audioRef.current.pause();
          setPlaying(null);
          clearInterval(timerRef.current);
          toast.success("Sleep timer finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-2">
              <Moon className="w-6 h-6 md:w-8 md:h-8" />
              Sleep Sounds
            </CardTitle>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Relax and fall asleep with soothing sounds
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sound Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {SOUNDS.map((sound) => {
                const Icon = sound.icon;
                const isPlaying = playing === sound.id;
                return (
                  <motion.button
                    key={sound.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePlay(sound)}
                    className={`relative p-4 md:p-6 rounded-xl bg-gradient-to-br ${sound.color} text-white shadow-lg transition-all ${
                      isPlaying ? 'ring-4 ring-white/50' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className={`w-6 h-6 md:w-8 md:h-8 ${isPlaying ? 'animate-pulse' : ''}`} />
                      <span className="text-xs md:text-sm font-medium">{sound.name}</span>
                      {isPlaying && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <Pause className="w-4 h-4" fill="white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium">Volume</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Sleep Timer */}
            <div className="space-y-3">
              <h3 className="text-sm md:text-base font-semibold">Sleep Timer</h3>
              <div className="flex flex-wrap gap-2">
                {[0, 15, 30, 45, 60].map((mins) => (
                  <Button
                    key={mins}
                    onClick={() => setTimerMinutes(mins)}
                    className={`btn-gradient text-xs md:text-sm ${
                      timer === mins ? 'ring-2 ring-purple-400' : ''
                    }`}
                  >
                    {mins === 0 ? 'Off' : `${mins}m`}
                  </Button>
                ))}
              </div>
              {timeLeft > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-center font-medium text-purple-600 dark:text-purple-400"
                >
                  Stopping in {formatTime(timeLeft)}
                </motion.p>
              )}
            </div>

            {!playing && (
              <p className="text-xs md:text-sm text-center text-gray-500 dark:text-gray-400">
                Tap a sound to start playing
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SleepSounds;
