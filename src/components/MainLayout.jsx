// src/components/MainLayout.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { Moon, Sun, LogOut, Home, Smile, BookOpen, Mic, BarChart3, Target, Clock, User, Music, AlertCircle, Trophy } from "lucide-react";
import { Toaster } from "react-hot-toast";

const MainLayout = ({ children }) => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/mood", label: "Mood", icon: Smile },
    { to: "/gratitude", label: "Gratitude", icon: BookOpen },
    { to: "/voice", label: "Voice", icon: Mic },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/habits", label: "Habits", icon: Target },
    { to: "/meditation", label: "Meditation", icon: Clock },
    { to: "/sleep", label: "Sleep", icon: Music },
    { to: "/sos", label: "SOS", icon: AlertCircle },
    { to: "/rewards", label: "Rewards", icon: Trophy },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-nav sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline">MindEase</span>
            </Link>
            
            {/* Navigation - Centered */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.to}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 whitespace-nowrap"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden lg:inline">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 glass-card border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-gray-600 dark:text-gray-400">
              ✨ Crafted with 💜 by{" "}
              <span className="gradient-text font-bold text-lg">Sanchi Sisodia</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Your journey to mindfulness and wellness starts here
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
