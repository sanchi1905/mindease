// src/components/HabitTracker.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Target } from 'lucide-react';
import toast from 'react-hot-toast';

const HabitTracker = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`habits_${currentUser.uid}`);
      if (saved) {
        setHabits(JSON.parse(saved));
      }
    }
  }, [currentUser]);

  const saveHabits = (updatedHabits) => {
    localStorage.setItem(`habits_${currentUser.uid}`, JSON.stringify(updatedHabits));
    setHabits(updatedHabits);
  };

  const addHabit = () => {
    if (!newHabit.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    const habit = {
      id: Date.now(),
      name: newHabit,
      createdAt: new Date().toISOString(),
      completions: []
    };

    saveHabits([...habits, habit]);
    setNewHabit('');
    toast.success('Habit added! 🎯');
  };

  const toggleHabit = (habitId) => {
    const today = new Date().toDateString();
    const updated = habits.map((habit) => {
      if (habit.id === habitId) {
        const completions = habit.completions || [];
        if (completions.includes(today)) {
          return {
            ...habit,
            completions: completions.filter((d) => d !== today)
          };
        } else {
          toast.success('Great job! Keep it up! 🌟', { icon: '✅' });
          return {
            ...habit,
            completions: [...completions, today]
          };
        }
      }
      return habit;
    });
    saveHabits(updated);
  };

  const deleteHabit = (habitId) => {
    saveHabits(habits.filter((h) => h.id !== habitId));
    toast.success('Habit deleted');
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toDateString(),
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
      });
    }
    return days;
  };

  const getStreak = (completions) => {
    if (!completions || completions.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      if (completions.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const last7Days = getLast7Days();

  return (
    <Card className="max-w-4xl mx-auto mt-8 glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Target className="w-7 h-7" />
          Habit Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add Habit */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              placeholder="Enter a new habit..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <Button
              onClick={addHabit}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Habits List */}
          <AnimatePresence>
            {habits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No habits yet. Add your first habit to get started!</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit, index) => {
                  const streak = getStreak(habit.completions);
                  return (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold dark:text-white">{habit.name}</h3>
                          {streak > 0 && (
                            <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-400 text-white text-sm rounded-full font-medium">
                              🔥 {streak} day streak
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Last 7 Days Grid */}
                      <div className="grid grid-cols-7 gap-2">
                        {last7Days.map((day) => {
                          const isCompleted = habit.completions?.includes(day.date);
                          return (
                            <motion.button
                              key={day.date}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleHabit(habit.id)}
                              className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg'
                                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {isCompleted && <Check className="w-5 h-5 mb-1" />}
                              <span className="text-xs font-medium">{day.label.split(' ')[0]}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitTracker;
