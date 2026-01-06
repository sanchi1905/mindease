// src/components/MainLayout.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, LogOut, Home, Smile, BookOpen, Mic, BarChart3, Target, Clock, User, Music, AlertCircle, Trophy, MessageCircle, Play, Users, Brain, Activity, Bell, Menu, X, ChevronDown, Heart, Sparkles } from "lucide-react";
import { Toaster } from "react-hot-toast";

const MainLayout = ({ children }) => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Organized navigation with categories
  const navCategories = [
    {
      label: "Track",
      icon: Heart,
      color: "text-pink-600",
      items: [
        { to: "/mood", label: "Mood Tracker", icon: Smile, color: "bg-yellow-50 dark:bg-yellow-900/20" },
        { to: "/insights", label: "Mood Insights", icon: Brain, color: "bg-purple-50 dark:bg-purple-900/20" },
        { to: "/gratitude", label: "Gratitude", icon: BookOpen, color: "bg-green-50 dark:bg-green-900/20" },
        { to: "/voice", label: "Voice Journal", icon: Mic, color: "bg-blue-50 dark:bg-blue-900/20" },
      ]
    },
    {
      label: "Relax",
      icon: Sparkles,
      color: "text-purple-600",
      items: [
        { to: "/library", label: "Meditation Library", icon: Play, color: "bg-indigo-50 dark:bg-indigo-900/20" },
        { to: "/meditation", label: "Meditation Timer", icon: Clock, color: "bg-teal-50 dark:bg-teal-900/20" },
        { to: "/sleep", label: "Sleep Sounds", icon: Music, color: "bg-blue-50 dark:bg-blue-900/20" },
        { to: "/wellness", label: "Yoga & Wellness", icon: Activity, color: "bg-orange-50 dark:bg-orange-900/20" },
      ]
    },
    {
      label: "Connect",
      icon: Users,
      color: "text-blue-600",
      items: [
        { to: "/ai", label: "AI Companion", icon: MessageCircle, color: "bg-purple-50 dark:bg-purple-900/20" },
        { to: "/community", label: "Community", icon: Users, color: "bg-pink-50 dark:bg-pink-900/20" },
      ]
    },
  ];

  const quickLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/sos", label: "SOS Relief", icon: AlertCircle },
    { to: "/rewards", label: "Rewards", icon: Trophy },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Modern Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-nav sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline">MindEase</span>
            </Link>
            
            {/* Desktop Navigation - Dropdown Menus */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Quick Links */}
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive(item.to)
                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Dropdown Categories */}
              {navCategories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <div
                    key={category.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(category.label)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    <button
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        dropdownOpen === category.label
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <CategoryIcon className={`w-4 h-4 ${category.color}`} />
                      <span>{category.label}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {dropdownOpen === category.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                        >
                          {category.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                                  isActive(item.to)
                                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg ${item.color}`}>
                                  <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                </div>
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* More Options */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen('more')}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    dropdownOpen === 'more'
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>More</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {dropdownOpen === 'more' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/habits"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      >
                        <Target className="w-4 h-4" />
                        <span>Habits Tracker</span>
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      >
                        <Bell className="w-4 h-4" />
                        <span>Notifications</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-4 space-y-3">
                {/* Quick Links */}
                <div className="space-y-1">
                  {quickLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive(item.to)
                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Categories */}
                {navCategories.map((category) => (
                  <div key={category.label} className="space-y-1">
                    <div className={`text-xs font-semibold uppercase tracking-wider px-3 py-2 ${category.color}`}>
                      {category.label}
                    </div>
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            isActive(item.to)
                              ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}

                {/* More */}
                <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    to="/habits"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg"
                  >
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Habits Tracker</span>
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">Notifications</span>
                  </Link>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={toggleTheme}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                      {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                      <span className="text-sm font-medium">Theme</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
