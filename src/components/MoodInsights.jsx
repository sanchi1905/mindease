// src/components/MoodInsights.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Brain, Clock, Calendar, Lightbulb, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const MoodInsights = () => {
  const { currentUser } = useAuth();
  const [insights, setInsights] = useState({
    patterns: [],
    triggers: [],
    recommendations: [],
    prediction: null,
  });
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadMoodData();
    }
  }, [currentUser]);

  const loadMoodData = () => {
    const savedMoods = JSON.parse(localStorage.getItem(`moods_${currentUser?.uid}`) || "[]");
    setMoodData(savedMoods);
    analyzePatterns(savedMoods);
  };

  const analyzePatterns = (moods) => {
    if (moods.length < 3) {
      setInsights({
        patterns: [],
        triggers: [],
        recommendations: ["Log more moods to unlock AI-powered insights!"],
        prediction: null,
      });
      return;
    }

    // Analyze time-of-day patterns
    const morningMoods = moods.filter(m => {
      const hour = new Date(m.timestamp).getHours();
      return hour >= 6 && hour < 12;
    });
    const eveningMoods = moods.filter(m => {
      const hour = new Date(m.timestamp).getHours();
      return hour >= 18 && hour < 24;
    });

    // Analyze day-of-week patterns
    const weekdayMoods = moods.filter(m => {
      const day = new Date(m.timestamp).getDay();
      return day >= 1 && day <= 5;
    });
    const weekendMoods = moods.filter(m => {
      const day = new Date(m.timestamp).getDay();
      return day === 0 || day === 6;
    });

    // Calculate averages
    const getMoodValue = (mood) => {
      const values = { "😢": 1, "😕": 2, "😐": 3, "😊": 4, "😄": 5 };
      return values[mood] || 3;
    };

    const avgMorning = morningMoods.length > 0
      ? morningMoods.reduce((sum, m) => sum + getMoodValue(m.mood), 0) / morningMoods.length
      : 0;
    
    const avgEvening = eveningMoods.length > 0
      ? eveningMoods.reduce((sum, m) => sum + getMoodValue(m.mood), 0) / eveningMoods.length
      : 0;

    const avgWeekday = weekdayMoods.length > 0
      ? weekdayMoods.reduce((sum, m) => sum + getMoodValue(m.mood), 0) / weekdayMoods.length
      : 0;

    const avgWeekend = weekendMoods.length > 0
      ? weekendMoods.reduce((sum, m) => sum + getMoodValue(m.mood), 0) / weekendMoods.length
      : 0;

    // Generate patterns
    const patterns = [];
    if (avgMorning > 0 && avgEvening > 0) {
      if (avgMorning > avgEvening + 0.5) {
        patterns.push({
          icon: "🌅",
          title: "Morning Person",
          description: "Your mood tends to be better in the morning. Try scheduling important tasks early!",
        });
      } else if (avgEvening > avgMorning + 0.5) {
        patterns.push({
          icon: "🌙",
          title: "Night Owl",
          description: "You feel better in the evening. Consider evening meditation or reflection.",
        });
      }
    }

    if (avgWeekday > 0 && avgWeekend > 0) {
      if (avgWeekend > avgWeekday + 0.5) {
        patterns.push({
          icon: "🎉",
          title: "Weekend Recharge",
          description: "Your mood improves significantly on weekends. Ensure adequate rest during work week!",
        });
      }
    }

    // Count consecutive days
    const recentMoods = moods.slice(-7);
    const consecutiveLowDays = recentMoods.filter(m => getMoodValue(m.mood) <= 2).length;
    const consecutiveHighDays = recentMoods.filter(m => getMoodValue(m.mood) >= 4).length;

    if (consecutiveHighDays >= 3) {
      patterns.push({
        icon: "🎯",
        title: "Positive Streak",
        description: `You've had ${consecutiveHighDays} positive days recently! Keep up the good work!`,
      });
    }

    // Generate triggers
    const triggers = [];
    if (consecutiveLowDays >= 3) {
      triggers.push({
        icon: "⚠️",
        title: "Recent Low Period",
        time: "Past 7 days",
        description: "Notice a pattern of lower moods. Consider talking to someone or trying relaxation exercises.",
      });
    }

    if (avgWeekday < 3 && avgWeekday > 0) {
      triggers.push({
        icon: "💼",
        title: "Weekday Stress",
        time: "Monday - Friday",
        description: "Work week seems challenging. Try micro-breaks and mindfulness during the day.",
      });
    }

    // Generate recommendations
    const recommendations = [];
    
    if (avgMorning < 3 && avgMorning > 0) {
      recommendations.push("Try a morning meditation or gratitude practice to start your day positively");
    }

    if (consecutiveLowDays >= 2) {
      recommendations.push("Consider using the SOS Relief feature for quick mood boosts");
      recommendations.push("Physical activity or a short walk can improve mood significantly");
    }

    if (moods.length >= 7 && avgWeekend > avgWeekday) {
      recommendations.push("Incorporate weekend relaxation techniques into your weekday routine");
    }

    if (recommendations.length === 0) {
      recommendations.push("Keep logging your moods to get personalized insights!");
      recommendations.push("Try combining mood tracking with gratitude journaling");
    }

    // Predict tomorrow's mood (simple algorithm based on recent trend)
    const last3Moods = moods.slice(-3).map(m => getMoodValue(m.mood));
    const avgRecent = last3Moods.reduce((a, b) => a + b, 0) / last3Moods.length;
    
    let prediction = null;
    if (avgRecent >= 4) {
      prediction = { emoji: "😊", text: "Likely Positive", confidence: 75, color: "text-green-600" };
    } else if (avgRecent >= 3) {
      prediction = { emoji: "😐", text: "Neutral/Stable", confidence: 65, color: "text-blue-600" };
    } else {
      prediction = { emoji: "😕", text: "May Need Support", confidence: 70, color: "text-orange-600" };
    }

    setInsights({ patterns, triggers, recommendations, prediction });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-3">
              <Brain className="w-6 h-6 md:w-8 md:h-8" />
              Mood Insights
            </CardTitle>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              AI-powered analysis of your emotional patterns
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Mood Prediction */}
            {insights.prediction && (
              <Card className="glass-card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h3 className="font-bold text-lg">Tomorrow's Mood Prediction</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{insights.prediction.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-xl font-bold ${insights.prediction.color}`}>
                        {insights.prediction.text}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                            style={{ width: `${insights.prediction.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {insights.prediction.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patterns */}
            {insights.patterns.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg">Detected Patterns</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.patterns.map((pattern, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-card">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{pattern.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-bold mb-1">{pattern.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {pattern.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Triggers */}
            {insights.triggers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-lg">Potential Triggers</h3>
                </div>
                <div className="space-y-3">
                  {insights.triggers.map((trigger, index) => (
                    <Card key={index} className="glass-card border-l-4 border-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{trigger.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold">{trigger.title}</h4>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {trigger.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {trigger.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-lg">Personalized Recommendations</h3>
              </div>
              <div className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card bg-yellow-50 dark:bg-yellow-900/20">
                      <CardContent className="p-3 md:p-4 flex items-center gap-3">
                        <span className="text-xl">💡</span>
                        <p className="text-sm md:text-base">{rec}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <Card className="glass-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-purple-600">
                      {moodData.length}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Total Moods
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600">
                      {Math.min(moodData.length, 7)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      This Week
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-green-600">
                      {insights.patterns.length}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Patterns Found
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-orange-600">
                      {insights.triggers.length}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Triggers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                🤖 <strong>AI Analysis:</strong> These insights use pattern recognition algorithms to identify trends in your mood data. For professional mental health support, please consult a licensed therapist.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MoodInsights;
