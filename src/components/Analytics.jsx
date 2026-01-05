// src/components/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Smile, BookOpen } from 'lucide-react';

const Analytics = () => {
  const { currentUser } = useAuth();
  const [moodData, setMoodData] = useState([]);
  const [gratitudeData, setGratitudeData] = useState([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    avgMood: 0,
    mostFrequentMood: '',
    streak: 0
  });

  useEffect(() => {
    if (currentUser) {
      // Load mood data
      const moods = JSON.parse(localStorage.getItem(`mood_${currentUser.uid}`) || '[]');
      const gratitude = JSON.parse(localStorage.getItem(`gratitude_${currentUser.uid}`) || '[]');

      // Process mood data for charts
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        const dayMoods = moods.filter(m => 
          new Date(m.timestamp).toLocaleDateString() === dateStr
        );
        
        last7Days.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count: dayMoods.length,
          avgMood: dayMoods.length > 0 
            ? dayMoods.reduce((acc, m) => acc + getMoodValue(m.mood), 0) / dayMoods.length 
            : 0
        });
      }

      setMoodData(last7Days);

      // Calculate stats
      const moodCounts = {};
      moods.forEach(m => {
        moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      });

      const mostFrequent = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
      
      setStats({
        totalEntries: moods.length + gratitude.length,
        avgMood: moods.length > 0 
          ? (moods.reduce((acc, m) => acc + getMoodValue(m.mood), 0) / moods.length).toFixed(1)
          : 0,
        mostFrequentMood: mostFrequent ? mostFrequent[0] : '😊',
        streak: calculateStreak(moods, gratitude)
      });

      // Mood distribution
      const moodDist = Object.entries(moodCounts).map(([mood, count]) => ({
        name: mood,
        value: count
      }));
      setGratitudeData(moodDist);
    }
  }, [currentUser]);

  const getMoodValue = (emoji) => {
    const values = { '😢': 1, '😞': 2, '😐': 3, '😊': 4, '😄': 5 };
    return values[emoji] || 3;
  };

  const calculateStreak = (moods, gratitude) => {
    const allDates = [
      ...moods.map(m => new Date(m.timestamp).toDateString()),
      ...gratitude.map(g => new Date(g.timestamp).toDateString())
    ];
    
    const uniqueDates = [...new Set(allDates)].sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      if (uniqueDates.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a78bfa'];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-white"
          >
            <BookOpen className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{stats.totalEntries}</div>
            <div className="text-sm opacity-90">Total Entries</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-xl text-white"
          >
            <Smile className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{stats.avgMood}</div>
            <div className="text-sm opacity-90">Avg Mood Score</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl text-white"
          >
            <Calendar className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{stats.streak}</div>
            <div className="text-sm opacity-90">Day Streak 🔥</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl text-white"
          >
            <TrendingUp className="w-8 h-8 mb-2" />
            <div className="text-3xl font-bold">{stats.mostFrequentMood}</div>
            <div className="text-sm opacity-90">Most Frequent</div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mood Trend */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Mood Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgMood" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    name="Avg Mood"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Mood Distribution */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text">Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gratitudeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gratitudeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card className="glass-card md:col-span-2">
            <CardHeader>
              <CardTitle className="gradient-text">Daily Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8b5cf6" name="Entries" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
