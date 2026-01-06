// src/components/MeditationLibrary.jsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Play, Pause, Clock, Tag, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const MEDITATIONS = [
  { id: 1, title: "Morning Calm", category: "Stress", duration: 5, description: "Start your day with peaceful energy", difficulty: "Beginner" },
  { id: 2, title: "Deep Sleep", category: "Sleep", duration: 15, description: "Drift into restful slumber", difficulty: "Beginner" },
  { id: 3, title: "Anxiety Relief", category: "Anxiety", duration: 10, description: "Release tension and worry", difficulty: "Intermediate" },
  { id: 4, title: "Focus Boost", category: "Focus", duration: 7, description: "Sharpen your concentration", difficulty: "Beginner" },
  { id: 5, title: "Body Scan", category: "Stress", duration: 20, description: "Progressive relaxation", difficulty: "Advanced" },
  { id: 6, title: "Loving Kindness", category: "Emotional", duration: 12, description: "Cultivate compassion", difficulty: "Intermediate" },
  { id: 7, title: "Breath Awareness", category: "Focus", duration: 5, description: "Simple breathing practice", difficulty: "Beginner" },
  { id: 8, title: "Pain Management", category: "Wellness", duration: 15, description: "Gentle relief techniques", difficulty: "Intermediate" },
  { id: 9, title: "Confidence Builder", category: "Emotional", duration: 10, description: "Boost self-esteem", difficulty: "Beginner" },
  { id: 10, title: "Gratitude Meditation", category: "Emotional", duration: 8, description: "Appreciate life's gifts", difficulty: "Beginner" },
  { id: 11, title: "Quick Recharge", category: "Stress", duration: 3, description: "Fast energy reset", difficulty: "Beginner" },
  { id: 12, title: "Night Unwind", category: "Sleep", duration: 25, description: "Deep relaxation for sleep", difficulty: "Advanced" },
];

const CATEGORIES = ["All", "Stress", "Sleep", "Anxiety", "Focus", "Emotional", "Wellness"];
const DURATIONS = ["All", "1-5 min", "6-10 min", "11-20 min", "20+ min"];

const MeditationLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState(null);

  const filterMeditations = () => {
    return MEDITATIONS.filter((med) => {
      const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
      const matchesSearch = med.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           med.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesDuration = true;
      if (selectedDuration !== "All") {
        if (selectedDuration === "1-5 min") matchesDuration = med.duration <= 5;
        else if (selectedDuration === "6-10 min") matchesDuration = med.duration >= 6 && med.duration <= 10;
        else if (selectedDuration === "11-20 min") matchesDuration = med.duration >= 11 && med.duration <= 20;
        else if (selectedDuration === "20+ min") matchesDuration = med.duration > 20;
      }

      return matchesCategory && matchesSearch && matchesDuration;
    });
  };

  const handlePlay = (id) => {
    if (playingId === id) {
      setPlayingId(null);
      toast.success("Meditation paused");
    } else {
      setPlayingId(id);
      toast.success("Meditation started - Add audio files to play actual content");
    }
  };

  const filteredMeditations = filterMeditations();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-3">
              <Play className="w-6 h-6 md:w-8 md:h-8" />
              Meditation Library
            </CardTitle>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {filteredMeditations.length} guided meditations to explore
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search meditations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs md:text-sm ${
                      selectedCategory === cat
                        ? "btn-gradient"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Duration Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Duration</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((dur) => (
                  <Button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`text-xs md:text-sm ${
                      selectedDuration === dur
                        ? "btn-gradient"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {dur}
                  </Button>
                ))}
              </div>
            </div>

            {/* Meditation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMeditations.map((meditation) => (
                <motion.div
                  key={meditation.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`glass-card cursor-pointer ${
                    playingId === meditation.id ? "ring-2 ring-purple-500" : ""
                  }`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-base md:text-lg mb-1">{meditation.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {meditation.category}
                          </span>
                        </div>
                        <Button
                          onClick={() => handlePlay(meditation.id)}
                          className="btn-gradient p-2 md:p-3 rounded-full touch-target"
                        >
                          {playingId === meditation.id ? (
                            <Pause className="w-4 h-4 md:w-5 md:h-5" />
                          ) : (
                            <Play className="w-4 h-4 md:w-5 md:h-5" />
                          )}
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {meditation.description}
                      </p>

                      <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{meditation.duration} min</span>
                        </div>
                        <span className="font-medium">{meditation.difficulty}</span>
                      </div>

                      {playingId === meditation.id && (
                        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: meditation.duration * 60, ease: "linear" }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredMeditations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No meditations found. Try different filters.
                </p>
              </div>
            )}

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                💡 <strong>Tip:</strong> Add meditation audio files to /public/meditations/ folder for actual playback functionality.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MeditationLibrary;
