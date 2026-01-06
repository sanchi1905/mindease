// src/components/Community.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Trophy, Target, Share2, Heart, MessageCircle, Award, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const CHALLENGES = [
  { id: 1, name: "7-Day Meditation Streak", participants: 234, daysLeft: 5, type: "meditation" },
  { id: 2, name: "Gratitude Challenge", participants: 189, daysLeft: 3, type: "gratitude" },
  { id: 3, name: "30-Day Mindfulness", participants: 412, daysLeft: 15, type: "mindfulness" },
];

const Community = () => {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [feed, setFeed] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [friendEmail, setFriendEmail] = useState("");
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    loadCommunityData();
  }, [currentUser]);

  const loadCommunityData = () => {
    // Load friends
    const savedFriends = JSON.parse(localStorage.getItem(`friends_${currentUser?.uid}`) || "[]");
    setFriends(savedFriends);

    // Load activity feed
    const savedFeed = JSON.parse(localStorage.getItem(`feed_${currentUser?.uid}`) || "[]");
    setFeed(savedFeed);

    // Generate leaderboard (mock data)
    const mockLeaderboard = [
      { name: "You", xp: 450, rank: 1, avatar: "🌟" },
      { name: "Alex M.", xp: 420, rank: 2, avatar: "🎯" },
      { name: "Sarah K.", xp: 380, rank: 3, avatar: "💫" },
      { name: "Mike R.", xp: 355, rank: 4, avatar: "🔥" },
      { name: "Emma L.", xp: 320, rank: 5, avatar: "⭐" },
    ];
    setLeaderboard(mockLeaderboard);
  };

  const addFriend = () => {
    if (!friendEmail.trim()) {
      toast.error("Please enter a friend's email");
      return;
    }

    if (friends.some(f => f.email === friendEmail)) {
      toast.error("Friend already added");
      return;
    }

    const newFriend = {
      id: Date.now(),
      email: friendEmail,
      name: friendEmail.split("@")[0],
      streak: Math.floor(Math.random() * 20),
      addedAt: new Date().toISOString(),
    };

    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    localStorage.setItem(`friends_${currentUser?.uid}`, JSON.stringify(updatedFriends));
    
    setFriendEmail("");
    toast.success(`Added ${newFriend.name} as friend!`);
  };

  const removeFriend = (id) => {
    const updatedFriends = friends.filter(f => f.id !== id);
    setFriends(updatedFriends);
    localStorage.setItem(`friends_${currentUser?.uid}`, JSON.stringify(updatedFriends));
    toast.success("Friend removed");
  };

  const shareAchievement = (achievement) => {
    const newPost = {
      id: Date.now(),
      user: currentUser?.email?.split("@")[0] || "You",
      type: "achievement",
      content: `Earned ${achievement} badge! 🎉`,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    const updatedFeed = [newPost, ...feed];
    setFeed(updatedFeed);
    localStorage.setItem(`feed_${currentUser?.uid}`, JSON.stringify(updatedFeed));
    toast.success("Achievement shared with community!");
  };

  const likePost = (postId) => {
    const updatedFeed = feed.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setFeed(updatedFeed);
    localStorage.setItem(`feed_${currentUser?.uid}`, JSON.stringify(updatedFeed));
  };

  const joinChallenge = (challengeId) => {
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    toast.success(`Joined "${challenge.name}"! Keep it up! 💪`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-3">
              <Users className="w-6 h-6 md:w-8 md:h-8" />
              Community Hub
            </CardTitle>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Connect, share achievements, and grow together
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
              {["feed", "friends", "challenges", "leaderboard"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm md:text-base font-semibold capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Activity Feed */}
            {activeTab === "feed" && (
              <div className="space-y-4">
                <div className="flex gap-2 md:gap-3">
                  <Button onClick={() => shareAchievement("Mood Master")} className="btn-gradient flex-1 touch-target">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Achievement
                  </Button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {feed.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No activities yet. Share your achievements to get started!
                      </p>
                    ) : (
                      feed.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <Card className="glass-card">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                  {post.user[0].toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">{post.user}</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(post.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm mb-3">{post.content}</p>
                                  <div className="flex items-center gap-4">
                                    <button
                                      onClick={() => likePost(post.id)}
                                      className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors"
                                    >
                                      <Heart className="w-4 h-4" />
                                      <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                                      <MessageCircle className="w-4 h-4" />
                                      <span>{post.comments.length}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Friends Tab */}
            {activeTab === "friends" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Friend's email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button onClick={addFriend} className="btn-gradient touch-target">
                    Add Friend
                  </Button>
                </div>

                <div className="space-y-2">
                  {friends.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No friends added yet. Invite your friends to join!
                    </p>
                  ) : (
                    friends.map((friend) => (
                      <Card key={friend.id} className="glass-card">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {friend.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold">{friend.name}</p>
                              <p className="text-xs text-gray-500">
                                🔥 {friend.streak} day streak
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeFriend(friend.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Challenges Tab */}
            {activeTab === "challenges" && (
              <div className="space-y-3">
                {CHALLENGES.map((challenge) => (
                  <Card key={challenge.id} className="glass-card">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            <h3 className="font-bold text-base md:text-lg">{challenge.name}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {challenge.participants} participants
                            </span>
                            <span>⏱️ {challenge.daysLeft} days left</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => joinChallenge(challenge.id)}
                          className="btn-gradient touch-target"
                        >
                          Join
                        </Button>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === "leaderboard" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Weekly Leaderboard
                  </h3>
                  <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="text-sm text-purple-600 dark:text-purple-400"
                  >
                    {showLeaderboard ? "Hide" : "Show"}
                  </button>
                </div>

                {showLeaderboard && (
                  <div className="space-y-2">
                    {leaderboard.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`glass-card ${user.name === "You" ? "ring-2 ring-purple-500" : ""}`}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`text-2xl font-bold ${
                                user.rank === 1 ? "text-yellow-500" :
                                user.rank === 2 ? "text-gray-400" :
                                user.rank === 3 ? "text-orange-600" :
                                "text-gray-600"
                              }`}>
                                #{user.rank}
                              </div>
                              <span className="text-2xl">{user.avatar}</span>
                              <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.xp} XP</p>
                              </div>
                            </div>
                            {user.rank <= 3 && (
                              <Trophy className={`w-6 h-6 ${
                                user.rank === 1 ? "text-yellow-500" :
                                user.rank === 2 ? "text-gray-400" :
                                "text-orange-600"
                              }`} />
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    💡 <strong>Note:</strong> Leaderboard is optional and can be toggled. Compete with friends or keep your progress private!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Community;
