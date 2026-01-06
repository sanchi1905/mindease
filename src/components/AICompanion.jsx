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
  anxious: "I'm really glad you reached out. Anxiety can feel overwhelming, but you're not alone in this. Let's work through it together.\n\n🌿 **Immediate Relief:**\n• Try the 5-4-3-2-1 grounding technique (visit our SOS Relief page)\n• Take 5 slow, deep breaths - inhale for 4, hold for 4, exhale for 6\n• Place your hand on your heart and feel your heartbeat\n\n💡 **What helps:**\n• Our SOS Quick Relief has guided exercises specifically for anxiety\n• Physical movement - even a 2-minute walk can help\n• Journaling your worries can provide clarity\n\nWould you like me to guide you through a breathing exercise, or shall we talk about what's triggering this feeling?",
  
  sleep: "Sleep is so important, and I understand how frustrating it is when it doesn't come easily. Let's create a plan to help you rest better.\n\n🌙 **Tonight's Strategy:**\n• Try our Sleep Sounds (Rain, Ocean, or White Noise work great)\n• Keep your room cool (60-67°F is ideal)\n• No screens 30 mins before bed - try our Gratitude Journal instead\n• Progressive muscle relaxation: tense and release each muscle group\n\n📚 **Long-term habits:**\n• Consistent sleep schedule (even on weekends)\n• Our 'Deep Sleep' or 'Night Unwind' meditations in the Library\n• Morning sunlight exposure helps regulate your sleep cycle\n• Limit caffeine after 2 PM\n\nHave you tried our sleep timer? You can set sounds to auto-stop after you drift off. What time are you usually trying to sleep?",
  
  stress: "I hear you - work stress can be really draining. Let's break this down and find ways to lighten your load.\n\n🎯 **Right Now:**\n• Take a 5-minute break - you've earned it\n• Try box breathing: 4 counts in, hold 4, out 4, hold 4 (repeat 5 times)\n• Desk stretches from our Wellness page can release physical tension\n• Close your eyes and do a 1-minute body scan\n\n💼 **Managing Work Stress:**\n• Set micro-breaks: 5 mins every hour\n• Prioritize tasks: urgent vs important\n• Set boundaries: it's okay to say \"I'll get to that tomorrow\"\n• Use our Meditation Timer during lunch break\n\n🌟 **Remember:**\nYour worth isn't measured by productivity. You're doing your best, and that's enough. What specific aspect of work is most stressful right now?",
  
  motivation: "First of all - you being here shows strength! Reaching out when motivation is low takes courage. Let's reignite that spark together! ✨\n\n🔥 **Tiny Wins Strategy:**\n• Start with ONE micro-goal today (seriously, just one)\n• Make it ridiculously small - can't fail small\n• Celebrate it! Check your Rewards page - track your XP\n• Small wins create momentum\n\n💪 **Energy Boosters:**\n• 5-minute 'Energy Boost Flow' yoga routine (Wellness page)\n• Uplifting music + 2-minute dance break\n• Call someone who makes you laugh\n• Watch your progress in Analytics - you've done more than you think!\n\n🌱 **Truth Bomb:**\nMotivation is a feeling, not a requirement. You can take action even without it. Discipline + tiny habits > waiting for motivation.\n\nWhat's one small thing you could do in the next 10 minutes? Let's make it happen together! 🚀",
  
  lonely: "Thank you for sharing this with me. Loneliness is one of the hardest feelings, but you're not alone in feeling alone - and you're definitely not alone now. 💜\n\n🤗 **Connection Options:**\n• Join our Community Challenges - connect with others on similar journeys\n• Share an achievement on the Community feed\n• Voice journal your thoughts - sometimes hearing your own voice helps\n• Reach out to one person (text, call, or just 'thinking of you')\n\n💭 **For Right Now:**\n• Self-compassion: treat yourself like you'd treat a good friend\n• Gratitude journal: write 3 things, even tiny ones\n• Our Loving Kindness meditation in the Library\n• Remember: alone time ≠ loneliness (both can coexist)\n\n🌈 **Building Connection:**\n• Consistent small interactions > rare big hangouts\n• Volunteer work creates purpose + community\n• Join a class/group for something you enjoy\n• Quality over quantity in relationships\n\nI'm here to listen. What would connection look like for you right now? What do you need most?",
  
  grateful: "That's beautiful! 💚 Gratitude is such a powerful practice. Studies show it literally rewires your brain for positivity.\n\n✨ **Deepen Your Practice:**\n• Try our Gratitude Journal feature - tracking creates patterns\n• Our 'Gratitude Meditation' in the Library\n• Share gratitude in our Community - it multiplies when shared\n• Weekly challenge: tell someone why you're grateful for them\n\nWhat are you grateful for today? I'd love to celebrate with you! 🌟",
  
  sad: "I'm sorry you're going through this. Sadness is heavy, and it's okay to sit with it. You don't have to rush to 'fix' it. I'm here with you. 🫂\n\n🌧️ **Being With Sadness:**\n• It's okay to cry - tears release stress hormones\n• Journal it out - our Voice Journal if you can't find words\n• Sad playlist + feel it fully (20 min limit, then shift)\n• Reach out to someone safe - don't suffer alone\n\n🌱 **Gentle Support:**\n• Our SOS Relief has comforting techniques\n• Body Scan meditation helps process emotions\n• Move your body gently - walk, stretch, yoga\n• If it lasts 2+ weeks, please talk to someone professional\n\n💙 **You're Not Alone:**\nCrisis support is always available: Call/text 988 (Suicide & Crisis Lifeline)\n\nDo you want to talk about what's making you sad, or would you prefer suggestions for gentle activities?",
  
  happy: "I love this energy! 🎉 Let's bottle this feeling and make it last!\n\n✨ **Capture This Moment:**\n• Quick gratitude entry - what made this happen?\n• Share on Community feed - spread the joy!\n• Voice journal this moment - listen back on tough days\n• Check your Rewards - celebrate your progress!\n\n🌟 **Ride the Wave:**\n• Do something kind for someone\n• Try something new while you feel good\n• Connect with people - joy is contagious\n• Physical activity amplifies good feelings\n\nWhat's bringing you joy today? I'm celebrating with you! 🎊",
  
  overwhelmed: "Pause. Take a breath. You're carrying a lot right now, and that's exhausting. Let's break this down into manageable pieces.\n\n🛑 **Emergency Brake:**\n• Stop. Breathe. 4-7-8 breathing: in 4, hold 7, out 8\n• Brain dump: write EVERYTHING down (doesn't need to make sense)\n• Pick ONE thing. Just one. Do that. Ignore the rest for now.\n• Our SOS Relief page has quick overwhelm techniques\n\n📋 **Declutter Your Mind:**\n• What MUST be done today? (probably less than you think)\n• What can wait?\n• What can you delegate/delete?\n• Use our Habit Tracker to focus on one thing at a time\n\n💆 **Restore Mode:**\n• 10-minute meditation break (Meditation Timer)\n• Walk outside - even 5 minutes helps\n• Say no to one thing today\n• You don't have to do it all, and you don't have to do it all perfectly\n\nWhat's the one thing overwhelming you most? Let's tackle just that first. 🌿",
  
  default: "I'm here for you, and I'm listening. 💜\n\n**How can I support you?**\n\n💭 I can help with:\n• Managing anxiety or stress\n• Sleep troubles and relaxation\n• Motivation and goal-setting\n• Loneliness and connection\n• Processing difficult emotions\n• Building healthy habits\n• Celebrating wins and progress\n\n🧰 **Quick Tools:**\n• **SOS Relief** - anxiety/panic techniques\n• **Sleep Sounds** - calming audio\n• **Meditation Library** - guided sessions\n• **Wellness** - yoga & exercise\n• **Community** - connect with others\n\nTell me what's on your mind, or ask about any of our features. I'm here to listen and guide. What matters most to you right now?",
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
    
    // Anxiety & Panic
    if (lowerMsg.match(/anxious|anxiety|panic|nervous|worried|fear|scared|terror|dread/)) {
      return AI_RESPONSES.anxious;
    } 
    // Sleep Issues
    else if (lowerMsg.match(/sleep|insomnia|tired|exhausted|can't sleep|sleepy|rest|fatigue/)) {
      return AI_RESPONSES.sleep;
    } 
    // Overwhelm (specific check before general stress)
    else if (lowerMsg.match(/overwhelm|too much|can't handle|drowning|buried|swamped/)) {
      return AI_RESPONSES.overwhelmed;
    }
    // Stress
    else if (lowerMsg.match(/stress|pressure|tense|work|busy|deadline|burden/)) {
      return AI_RESPONSES.stress;
    } 
    // Sadness & Depression
    else if (lowerMsg.match(/sad|depress|down|blue|hopeless|empty|numb|cry|tears/)) {
      return AI_RESPONSES.sad;
    }
    // Loneliness
    else if (lowerMsg.match(/lonely|alone|isolated|disconnect|nobody|no one cares/)) {
      return AI_RESPONSES.lonely;
    } 
    // Low Motivation
    else if (lowerMsg.match(/motivat|lazy|procrastinat|stuck|unmotivat|don't want|can't start/)) {
      return AI_RESPONSES.motivation;
    } 
    // Happiness & Gratitude
    else if (lowerMsg.match(/happy|joy|great|wonderful|grateful|thankful|amazing|excited|good/)) {
      return AI_RESPONSES.happy;
    }
    // Gratitude specific
    else if (lowerMsg.match(/grateful|gratitude|appreciate|blessing|fortunate/)) {
      return AI_RESPONSES.grateful;
    }
    // Greetings
    else if (lowerMsg.match(/^(hi|hello|hey|good morning|good evening|good afternoon|what's up|sup)$/)) {
      return "Hello! 👋 I'm so glad you're here. How are you feeling today? I'm here to listen and support you however I can.";
    }
    // Thanks
    else if (lowerMsg.match(/thank|thanks|appreciate/)) {
      return "You're so welcome! 💜 I'm here for you anytime. Is there anything else I can help you with today?";
    }
    // Feature questions
    else if (lowerMsg.match(/what can you do|how.*work|features|help me with/)) {
      return "I'm your personal wellness companion! I can help you with:\n\n💭 **Emotional Support:**\n• Anxiety & stress management\n• Sleep troubles\n• Motivation & goal-setting\n• Processing difficult feelings\n\n🧰 **MindEase Tools:**\n• SOS Relief - quick anxiety techniques\n• Sleep Sounds - calming audio\n• Meditation Library - 12 guided sessions\n• Physical Wellness - yoga & exercise\n• Mood Insights - track patterns\n• Community - connect with others\n\nWhat would you like to explore?";
    }
    // Default - conversational
    else {
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
