// src/components/MoodTracker.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Smile } from "lucide-react";
import toast from "react-hot-toast";
import MoodChart from "./MoodChart";

const MOOD_EMOJIS = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  angry: "😡",
  excited: "🤩",
};

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodEntries, setMoodEntries] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load entries from localStorage
    if (currentUser) {
      const storageKey = `mood_${currentUser.uid}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setMoodEntries(JSON.parse(stored));
        } catch (error) {
          console.error("Error loading mood entries:", error);
        }
      }
    }
  }, [currentUser]);

  const saveToStorage = (entries) => {
    if (currentUser) {
      const storageKey = `mood_${currentUser.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(entries));
    }
  };

  const addMoodEntry = async () => {
    if (selectedMood) {
      const newEntry = {
        id: `mood_${Date.now()}`,
        userId: currentUser.uid,
        mood: selectedMood,
        createdAt: new Date().toISOString(),
      };
      const updatedEntries = [newEntry, ...moodEntries];
      setMoodEntries(updatedEntries);
      saveToStorage(updatedEntries);
      setSelectedMood(null);
      toast.success(`Mood logged: ${selectedMood}`, { icon: selectedMood });
    }
  };

  const deleteMoodEntry = async (id) => {
    const updatedEntries = moodEntries.filter((entry) => entry.id !== id);
    setMoodEntries(updatedEntries);
    saveToStorage(updatedEntries);
    toast.success('Mood entry deleted');
  };

  const getFormattedDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8 glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Smile className="w-7 h-7" />
          How are you feeling today?
        </CardTitle>
        <CardTitle className="text-2xl font-bold text-blue-700 mb-4">
          😊 Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {Object.entries(MOOD_EMOJIS).map(([moodKey, emoji], index) => (
            <motion.button
              key={moodKey}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedMood(moodKey)}
              className={`text-5xl p-4 rounded-full transition-all duration-300
                ${selectedMood === moodKey
                  ? "bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 ring-4 ring-purple-400 scale-110 shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              aria-label={`Select ${moodKey} mood`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={addMoodEntry}
              disabled={!selectedMood}
              className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Mood
            </Button>
          </motion.div>
        </div>

        <MoodChart moodEntries={moodEntries} />

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 gradient-text">
            Mood History
          </h3>
          <AnimatePresence>
            {moodEntries.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 dark:text-gray-400 py-8"
              >
                No mood entries yet. Start tracking your mood! 😊
              </motion.p>
            ) : (
              <ul className="space-y-3">
                {moodEntries.map((entry, index) => (
                  <motion.li
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <span className="text-2xl">
                      {MOOD_EMOJIS[entry.mood]}
                    </span>
                    <span className="flex-1 mx-4 font-medium dark:text-white capitalize">
                      {entry.mood}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {getFormattedDate(entry.createdAt)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteMoodEntry(entry.id)}
                      className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
