// src/components/Login.jsx
import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      toast.success("Welcome back! 🎉");
      navigate("/");
    } catch (error) {
      const errorMsg = `Failed to log in: ${error.message}`;
      setError(errorMsg);
      toast.error(errorMsg);
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold gradient-text">Welcome Back!</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Log in to continue your wellness journey</p>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4"
              >
                {error}
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  ref={emailRef}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  ref={passwordRef}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button disabled={loading} className="w-full btn-gradient py-3 text-lg flex items-center justify-center gap-2" type="submit">
                  <LogIn className="w-5 h-5" />
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </motion.div>
            </form>
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-400">
                Need an account?{" "}
                <Link to="/signup" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
