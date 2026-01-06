// src/components/AICompanion.jsx
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const QUICK_PROMPTS = [
  "I'm feeling anxious",
  "Can't sleep tonight",
  "Feeling stressed at work",
  "Need motivation",
  "Feeling lonely",
];

const AI_RESPONSES = {
  anxious: "I hear you. Anxiety can be overwhelming. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. Would you like to try our SOS Quick Relief exercises?",
  sleep: "Sleep troubles are challenging. Consider creating a bedtime routine: dim lights 30 minutes before bed, try our Sleep Sounds, avoid screens, and practice gentle breathing. Have you tried our guided sleep meditation?",
  stress: "Work stress is common. Remember to take breaks every hour, practice deep breathing, and set boundaries. Our meditation timer can help you recharge. Would you like a 5-minute stress relief session?",
  motivation: "You're doing great by being here! Small steps matter. Set one tiny goal for today. Check out your Rewards page to see your progress - you've come so far! 🌟",
  lonely: "Feeling lonely is valid. Connection matters. Consider journaling your thoughts, joining our community challenges, or reaching out to someone. I'm here to listen. What's on your mind?",
  default: "I'm here to support you. Could you tell me more about how you're feeling? I can suggest mindfulness exercises, breathing techniques, or simply listen.",
};

const AICompanion = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load conversation history
    const saved = localStorage.getItem(`ai_chat_${currentUser?.uid}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Welcome message
      setMessages([{
        id: Date.now(),
        role: "ai",
        content: "Hi there! 👋 I'm your wellness companion. I'm here to listen, support, and guide you. How are you feeling today?",
        timestamp: new Date().toISOString()
      }]);
    }
  }, [currentUser]);

  useEffect(() => {
    // Scroll to bottom with slight delay to ensure DOM updates
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const saveMessages = (msgs) => {
    localStorage.setItem(`ai_chat_${currentUser?.uid}`, JSON.stringify(msgs));
  };

  const getAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes("anxious") || lowerMsg.includes("anxiety") || lowerMsg.includes("panic")) {
      return AI_RESPONSES.anxious;
    } else if (lowerMsg.includes("sleep") || lowerMsg.includes("insomnia") || lowerMsg.includes("tired")) {
      return AI_RESPONSES.sleep;
    } else if (lowerMsg.includes("stress") || lowerMsg.includes("overwhelm") || lowerMsg.includes("work")) {
      return AI_RESPONSES.stress;
    } else if (lowerMsg.includes("motivat") || lowerMsg.includes("lazy") || lowerMsg.includes("energy")) {
      return AI_RESPONSES.motivation;
    } else if (lowerMsg.includes("lonely") || lowerMsg.includes("alone") || lowerMsg.includes("sad")) {
      return AI_RESPONSES.lonely;
    } else {
      return AI_RESPONSES.default;
    }
  };

  const sendMessage = (text = input) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAIResponse(text);
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...newMessages, aiMsg];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    if (confirm("Clear all conversation history?")) {
      setMessages([]);
      localStorage.removeItem(`ai_chat_${currentUser?.uid}`);
      toast.success("Chat cleared");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 md:p-6"
      >
        <Card className="flex-1 flex flex-col glass-card">
          <CardHeader className="flex-shrink-0 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-3">
                <Bot className="w-7 h-7 md:w-8 h-8" />
                AI Wellness Companion
              </CardTitle>
              <Button
                onClick={clearChat}
                variant="ghost"
                className="text-xs md:text-sm"
              >
                Clear Chat
              </Button>
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Your personal mental health support assistant
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: "calc(100vh - 450px)", minHeight: "300px" }}>
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] md:max-w-[70%] p-3 md:p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                          : "bg-white dark:bg-gray-800 shadow-md"
                      }`}
                    >
                      <p className="text-sm md:text-base whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {msg.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick start:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <Button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      variant="outline"
                      className="text-xs md:text-sm"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                disabled={isTyping}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="btn-gradient px-4 md:px-6 touch-target"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
              This is a supportive companion. For crisis support, call 988.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AICompanion;
