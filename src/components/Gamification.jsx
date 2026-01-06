// src/components/Gamification.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, Award, Target, Zap, Crown, Medal } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const ACHIEVEMENTS = [
  { id: "first-mood", name: "First Steps", desc: "Log your first mood", icon: Star, points: 10 },
  { id: "7-day-streak", name: "Week Warrior", desc: "7 day streak", icon: Flame, points: 50 },
  { id: "30-day-streak", name: "Month Master", desc: "30 day streak", icon: Crown, points: 200 },
  { id: "meditation-novice", name: "Zen Beginner", desc: "Complete 5 meditations", icon: Target, points: 25 },
  { id: "gratitude-guru", name: "Gratitude Guru", desc: "Write 20 gratitude entries", icon: Medal, points: 75 },
  { id: "voice-veteran", name: "Voice Veteran", desc: "Record 10 voice journals", icon: Award, points: 50 },
];

const LEVELS = [
  { level: 1, name: "Seedling", minXP: 0, color: "from-green-300 to-green-500" },
  { level: 2, name: "Sprout", minXP: 100, color: "from-green-400 to-green-600" },
  { level: 3, name: "Blossom", minXP: 300, color: "from-blue-400 to-blue-600" },
  { level: 4, name: "Tree", minXP: 600, color: "from-purple-400 to-purple-600" },
  { level: 5, name: "Forest", minXP: 1000, color: "from-indigo-400 to-indigo-600" },
  { level: 6, name: "Sage", minXP: 1500, color: "from-yellow-400 to-orange-500" },
  { level: 7, name: "Master", minXP: 2500, color: "from-pink-400 to-red-500" },
  { level: 8, name: "Legend", minXP: 5000, color: "from-purple-500 to-pink-500" },
];

const Gamification = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    xp: 0,
    streak: 0,
    achievements: [],
  });

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem(`gamification_${currentUser?.uid}`);
    if (saved) {
      setStats(JSON.parse(saved));
    } else {
      // Initialize with starter data
      addXP(10); // Welcome bonus
    }
  }, [currentUser]);

  const addXP = (amount) => {
    setStats((prev) => {
      const newStats = { ...prev, xp: prev.xp + amount };
      localStorage.setItem(`gamification_${currentUser?.uid}`, JSON.stringify(newStats));
      return newStats;
    });
  };

  const unlockAchievement = (achievementId) => {
    setStats((prev) => {
      if (prev.achievements.includes(achievementId)) return prev;
      
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      const newStats = {
        ...prev,
        achievements: [...prev.achievements, achievementId],
        xp: prev.xp + achievement.points
      };
      localStorage.setItem(`gamification_${currentUser?.uid}`, JSON.stringify(newStats));
      return newStats;
    });
  };

  const getCurrentLevel = () => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (stats.xp >= LEVELS[i].minXP) {
        return LEVELS[i];
      }
    }
    return LEVELS[0];
  };

  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const nextIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
    return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
  };

  const getProgressToNext = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();
    if (!nextLevel) return 100;
    
    const progress = ((stats.xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100;
    return Math.min(progress, 100);
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progress = getProgressToNext();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Level Card */}
        <Card className={`glass-card bg-gradient-to-br ${currentLevel.color} text-white mb-6`}>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                >
                  <Zap className="w-10 h-10 md:w-12 md:h-12" />
                </motion.div>
              </div>
              <div className="flex-1 text-center md:text-left w-full">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Level {currentLevel.level}: {currentLevel.name}</h2>
                <p className="text-lg md:text-xl mb-4">{stats.xp} XP</p>
                {nextLevel && (
                  <>
                    <div className="w-full bg-white/20 rounded-full h-3 md:h-4 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                        className="bg-white h-full rounded-full"
                      />
                    </div>
                    <p className="text-sm md:text-base opacity-90">
                      {nextLevel.minXP - stats.xp} XP to {nextLevel.name}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="glass-card mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold">Current Streak</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    Keep going!
                  </p>
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-orange-500">
                {stats.streak} days
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold gradient-text flex items-center gap-2">
              <Trophy className="w-6 h-6 md:w-7 md:h-7" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {ACHIEVEMENTS.map((achievement) => {
                const Icon = achievement.icon;
                const unlocked = stats.achievements.includes(achievement.id);
                return (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: unlocked ? 1.05 : 1 }}
                    className={`p-4 md:p-6 rounded-lg border-2 transition-all ${
                      unlocked
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-500'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <Icon className={`w-8 h-8 md:w-10 md:h-10 ${unlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
                      <h4 className="font-bold text-sm md:text-base">{achievement.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{achievement.desc}</p>
                      <span className={`text-xs md:text-sm font-medium ${unlocked ? 'text-yellow-600' : 'text-gray-500'}`}>
                        +{achievement.points} XP
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <h3 className="font-semibold mb-3 text-base md:text-lg">💡 Earn More XP:</h3>
            <ul className="space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
              <li>✨ Daily mood tracking: +5 XP</li>
              <li>📝 Gratitude entry: +10 XP</li>
              <li>🎤 Voice journal: +15 XP</li>
              <li>🧘 Complete meditation: +20 XP</li>
              <li>🎯 Complete habit: +5 XP</li>
              <li>🔥 Maintain daily streak: Bonus XP!</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Gamification;

// Export helper function for other components to add XP
export const addGameXP = (uid, amount) => {
  const saved = localStorage.getItem(`gamification_${uid}`);
  const stats = saved ? JSON.parse(saved) : { xp: 0, streak: 0, achievements: [] };
  stats.xp += amount;
  localStorage.setItem(`gamification_${uid}`, JSON.stringify(stats));
};
