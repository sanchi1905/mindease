// src/components/GratitudeJournal.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const GratitudeJournal = () => {
  const [entryText, setEntryText] = useState("");
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load entries from localStorage
    if (currentUser) {
      const storageKey = `gratitude_${currentUser.uid}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setGratitudeEntries(JSON.parse(stored));
        } catch (error) {
          console.error("Error loading gratitude entries:", error);
        }
      }
    }
  }, [currentUser]);

  const saveToStorage = (entries) => {
    if (currentUser) {
      const storageKey = `gratitude_${currentUser.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(entries));
    }
  };

  const addGratitudeEntry = async () => {
    if (entryText.trim()) {
      const newEntry = {
        id: `entry_${Date.now()}`,
        userId: currentUser.uid,
        text: entryText.trim(),
        createdAt: new Date().toISOString(),
      };
      const updatedEntries = [newEntry, ...gratitudeEntries];
      setGratitudeEntries(updatedEntries);
      saveToStorage(updatedEntries);
      setEntryText("");
      toast.success("Gratitude entry added! 🙏", { icon: "✨" });
    }
  };

  const deleteEntry = async (id) => {
    const updatedEntries = gratitudeEntries.filter((entry) => entry.id !== id);
    setGratitudeEntries(updatedEntries);
    saveToStorage(updatedEntries);
    toast.success("Entry deleted");
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
          <Heart className="w-7 h-7 fill-pink-500 text-pink-500" />
          Gratitude Journal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            What are you grateful for today?
          </p>
          <textarea
            className="w-full p-4 border-2 border-purple-200 dark:border-purple-700 dark:bg-gray-800 dark:text-white rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            rows="4"
            placeholder="I am grateful for..."
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
        ></textarea>

        <div className="flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={addGratitudeEntry}
              disabled={!entryText.trim()}
              className="btn-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Save Entry
            </Button>
          </motion.div>
        </div>
        </motion.div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 gradient-text">
            Past Entries
          </h3>
          <AnimatePresence>
            {gratitudeEntries.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 dark:text-gray-400 py-8"
              >
                No gratitude entries yet. Start your gratitude journey! 🙏
              </motion.p>
            ) : (
              <ul className="space-y-4">
                {gratitudeEntries.map((entry, index) => (
                  <motion.li
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                        {getFormattedDate(entry.createdAt)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{entry.text}</p>
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

export default GratitudeJournal;
