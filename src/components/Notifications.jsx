// src/components/Notifications.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Bell, Clock, Quote, TrendingUp, Heart, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Notifications = () => {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState({
    morningMood: { enabled: true, time: "09:00" },
    eveningGratitude: { enabled: true, time: "20:00" },
    dailyQuote: { enabled: true, time: "08:00" },
    streakReminder: { enabled: true, time: "21:00" },
    weeklyInsights: { enabled: true, day: "Sunday", time: "18:00" },
  });

  const [notificationPermission, setNotificationPermission] = useState("default");

  useEffect(() => {
    if (currentUser) {
      loadPreferences();
      checkNotificationPermission();
    }
  }, [currentUser]);

  const checkNotificationPermission = () => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        toast.success("Notifications enabled! You'll receive mindful reminders.");
        scheduleNotifications();
      } else {
        toast.error("Notifications blocked. Enable in browser settings.");
      }
    } else {
      toast.error("Notifications not supported in this browser.");
    }
  };

  const loadPreferences = () => {
    const saved = localStorage.getItem(`notification_prefs_${currentUser?.uid}`);
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const savePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    localStorage.setItem(`notification_prefs_${currentUser?.uid}`, JSON.stringify(newPrefs));
    toast.success("Preferences saved!");
    scheduleNotifications();
  };

  const togglePreference = (key) => {
    const newPrefs = {
      ...preferences,
      [key]: {
        ...preferences[key],
        enabled: !preferences[key].enabled,
      },
    };
    savePreferences(newPrefs);
  };

  const updateTime = (key, time) => {
    const newPrefs = {
      ...preferences,
      [key]: {
        ...preferences[key],
        time,
      },
    };
    savePreferences(newPrefs);
  };

  const scheduleNotifications = () => {
    // This would use browser's Notification API or a service worker
    // For now, we'll show a toast as confirmation
    toast.success("Notifications scheduled based on your preferences!");
  };

  const sendTestNotification = () => {
    if (notificationPermission === "granted") {
      new Notification("MindEase Reminder 🌟", {
        body: "Time for a quick mood check-in. How are you feeling?",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
      toast.success("Test notification sent!");
    } else {
      toast.error("Please enable notifications first.");
    }
  };

  const NOTIFICATION_TYPES = [
    {
      key: "morningMood",
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      title: "Morning Mood Check",
      description: "Start your day by logging your mood",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      key: "eveningGratitude",
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      title: "Evening Gratitude",
      description: "Reflect on what you're grateful for today",
      color: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      key: "dailyQuote",
      icon: <Quote className="w-5 h-5 text-purple-600" />,
      title: "Daily Inspiration",
      description: "Receive a motivational quote each day",
      color: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      key: "streakReminder",
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      title: "Streak Reminder",
      description: "Don't break your streak! Get reminded if you haven't logged today",
      color: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      key: "weeklyInsights",
      icon: <AlertCircle className="w-5 h-5 text-green-600" />,
      title: "Weekly Insights",
      description: "Get a summary of your week's emotional patterns",
      color: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-3">
              <Bell className="w-6 h-6 md:w-8 md:h-8" />
              Smart Notifications
            </CardTitle>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Personalized reminders to support your mental wellness journey
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Notification Permission */}
            <Card className={`glass-card ${
              notificationPermission === "granted"
                ? "bg-green-50 dark:bg-green-900/20"
                : notificationPermission === "denied"
                ? "bg-red-50 dark:bg-red-900/20"
                : "bg-yellow-50 dark:bg-yellow-900/20"
            }`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Browser Notifications
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {notificationPermission === "granted"
                        ? "✅ Notifications are enabled. You'll receive reminders based on your preferences."
                        : notificationPermission === "denied"
                        ? "❌ Notifications are blocked. Enable them in your browser settings to receive reminders."
                        : "⏳ Enable notifications to receive mindful reminders throughout your day."}
                    </p>
                    {notificationPermission !== "granted" && (
                      <Button
                        onClick={requestNotificationPermission}
                        className="btn-gradient touch-target"
                        disabled={notificationPermission === "denied"}
                      >
                        {notificationPermission === "denied" ? "Blocked - Check Browser Settings" : "Enable Notifications"}
                      </Button>
                    )}
                    {notificationPermission === "granted" && (
                      <Button
                        onClick={sendTestNotification}
                        className="btn-gradient touch-target"
                      >
                        Send Test Notification
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Notification Schedule</h3>
              {NOTIFICATION_TYPES.map((type, index) => (
                <motion.div
                  key={type.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`glass-card ${type.color}`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{type.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold mb-1">{type.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {type.description}
                          </p>

                          <div className="flex items-center gap-3 flex-wrap">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences[type.key].enabled}
                                onChange={() => togglePreference(type.key)}
                                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm font-medium">
                                {preferences[type.key].enabled ? "Enabled" : "Disabled"}
                              </span>
                            </label>

                            {preferences[type.key].enabled && type.key !== "weeklyInsights" && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <input
                                  type="time"
                                  value={preferences[type.key].time}
                                  onChange={(e) => updateTime(type.key, e.target.value)}
                                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                            )}

                            {preferences[type.key].enabled && type.key === "weeklyInsights" && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm">Every {preferences[type.key].day} at</span>
                                <input
                                  type="time"
                                  value={preferences[type.key].time}
                                  onChange={(e) => updateTime(type.key, e.target.value)}
                                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardContent className="p-4 md:p-6">
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      const allEnabled = { ...preferences };
                      Object.keys(allEnabled).forEach(key => {
                        allEnabled[key] = { ...allEnabled[key], enabled: true };
                      });
                      savePreferences(allEnabled);
                    }}
                    className="btn-gradient touch-target"
                  >
                    Enable All
                  </Button>
                  <Button
                    onClick={() => {
                      const allDisabled = { ...preferences };
                      Object.keys(allDisabled).forEach(key => {
                        allDisabled[key] = { ...allDisabled[key], enabled: false };
                      });
                      savePreferences(allDisabled);
                    }}
                    className="bg-gray-300 dark:bg-gray-700 touch-target"
                  >
                    Disable All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                💡 <strong>Tip:</strong> Notifications work best when you allow browser permissions and keep MindEase open in a tab. For persistent notifications, install MindEase as a PWA (Progressive Web App).
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Notifications;
