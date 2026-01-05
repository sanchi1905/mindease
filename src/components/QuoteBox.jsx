import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, RefreshCw, Sparkles } from "lucide-react";

const QuoteBox = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.quotable.io/random");
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error("Error fetching quote:", error);
      // Fallback quotes if API fails
      const fallbackQuotes = [
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { content: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
      ];
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Card className="max-w-xl mx-auto mt-8 glass-card overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 p-1">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold text-center mb-6 gradient-text flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            Daily Motivation
          </h2>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <RefreshCw className="w-8 h-8 text-purple-500" />
                </motion.div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Loading inspiration...</p>
              </motion.div>
            ) : quote ? (
              <motion.div
                key={quote.content}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <CardContent className="text-center space-y-4">
                  <Quote className="w-12 h-12 mx-auto text-purple-400 opacity-50" />
                  <p className="text-xl italic text-gray-800 dark:text-gray-200 leading-relaxed px-4">
                    "{quote.content}"
                  </p>
                  <p className="text-base text-purple-600 dark:text-purple-400 font-medium">
                    — {quote.author}
                  </p>
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CardContent className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">Failed to load quote. Try again!</p>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={fetchQuote} 
                disabled={loading}
                className="btn-gradient flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Quote
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuoteBox;
