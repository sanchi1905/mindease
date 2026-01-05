// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { Users, UserCheck, MapPin, Activity } from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    recentSignups: [],
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Note: For production, you'd want to create a Cloud Function
      // that runs on user signup/login to store analytics data
      
      // Example: Get mood entries to estimate active users
      const moodQuery = query(
        collection(db, "moods"),
        orderBy("timestamp", "desc"),
        limit(100)
      );
      const moodSnapshot = await getDocs(moodQuery);
      
      const today = new Date().setHours(0, 0, 0, 0);
      const activeToday = new Set();
      
      moodSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.timestamp?.toDate().setHours(0, 0, 0, 0) === today) {
          activeToday.add(data.userId);
        }
      });

      setStats({
        totalUsers: "Check Firebase Console",
        activeToday: activeToday.size,
        recentSignups: [],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold gradient-text mb-6">
          User Analytics Dashboard
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Check Firebase Console
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Go to Authentication → Users
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeToday}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Users who logged activity
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Firebase Analytics</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Enabled for tracking
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Firebase Console</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Analytics → User Demographics
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>How to View Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">📊 Firebase Console</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Authentication Analytics:</strong>
                <p className="ml-6 text-sm">
                  Go to Firebase Console → Authentication → Users
                  <br />
                  See all users, emails, UIDs, sign-up dates, last sign-in times
                </p>
              </li>
              <li className="mt-2">
                <strong>Google Analytics (Location & Demographics):</strong>
                <p className="ml-6 text-sm">
                  Go to Firebase Console → Analytics → Dashboard
                  <br />
                  View: Countries, Cities, Device types, Active users, Engagement
                </p>
              </li>
              <li className="mt-2">
                <strong>Events (Sign-ups, Logins):</strong>
                <p className="ml-6 text-sm">
                  Go to Analytics → Events
                  <br />
                  Track: 'sign_up', 'login', 'logout' events with timestamps
                </p>
              </li>
            </ol>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🔗 Quick Links:</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="https://console.firebase.google.com/project/mindease-app-187b0/authentication/users"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  → View All Users
                </a>
              </li>
              <li>
                <a
                  href="https://console.firebase.google.com/project/mindease-app-187b0/analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  → Analytics Dashboard
                </a>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
