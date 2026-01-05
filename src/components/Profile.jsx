// src/components/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, Trophy, Target, Edit2, Camera, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const fileInputRef = useRef(null);
  
  const [stats] = useState({
    totalJournals: localStorage.getItem(`gratitude_${currentUser?.uid}`) 
      ? JSON.parse(localStorage.getItem(`gratitude_${currentUser?.uid}`)).length 
      : 0,
    totalMoods: localStorage.getItem(`mood_${currentUser?.uid}`)
      ? JSON.parse(localStorage.getItem(`mood_${currentUser?.uid}`)).length
      : 0,
    streak: 7,
    achievements: 3
  });

  useEffect(() => {
    if (currentUser) {
      const savedProfile = localStorage.getItem(`profile_${currentUser.uid}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setProfilePic(profile.profilePic || '');
        setUserName(profile.userName || '');
        setBio(profile.bio || '');
      }
    }
  }, [currentUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    const profile = {
      profilePic,
      userName,
      bio,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`profile_${currentUser.uid}`, JSON.stringify(profile));
    setIsEditing(false);
    toast.success('Profile updated successfully! ✨');
  };

  const handleExportData = () => {
    const data = {
      profile: {
        email: currentUser.email,
        userName,
        bio,
        joinedDate: currentUser.metadata?.creationTime
      },
      gratitude: JSON.parse(localStorage.getItem(`gratitude_${currentUser?.uid}`) || '[]'),
      moods: JSON.parse(localStorage.getItem(`mood_${currentUser?.uid}`) || '[]'),
      habits: JSON.parse(localStorage.getItem(`habits_${currentUser?.uid}`) || '[]'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindease-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Data exported successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold gradient-text flex items-center gap-3">
                <User className="w-8 h-8" />
                My Profile
              </CardTitle>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isEditing 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </motion.button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* User Info */}
              <div className="relative p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Profile Picture */}
                  <div className="relative group">
                    {profilePic ? (
                      <img 
                        src={profilePic} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                        {userName?.[0]?.toUpperCase() || currentUser?.email?.[0].toUpperCase()}
                      </div>
                    )}
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
                      >
                        <Camera className="w-5 h-5" />
                      </motion.button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* User Details */}
                  <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-4 py-2 text-xl font-semibold border-2 border-purple-300 dark:border-purple-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows="3"
                          className="w-full px-4 py-2 border-2 border-purple-300 dark:border-purple-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold dark:text-white mb-2">
                          {userName || 'Welcome back!'}
                        </h3>
                        {bio && (
                          <p className="text-gray-600 dark:text-gray-300 mb-3 italic">"{bio}"</p>
                        )}
                      </>
                    )}
                    <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-start gap-2 mt-2">
                      <Mail className="w-4 h-4" />
                      {currentUser?.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      Member since {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex justify-center md:justify-end"
                  >
                    <Button
                      onClick={handleSaveProfile}
                      className="btn-gradient flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center"
                >
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalJournals}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Gratitude Entries</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center"
                >
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalMoods}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Mood Entries</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center"
                >
                  <Target className="w-8 h-8 mx-auto text-orange-600 dark:text-orange-400 mb-2" />
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.streak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Day Streak</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center"
                >
                  <Trophy className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.achievements}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Achievements</div>
                </motion.div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 flex-wrap">
                <Button
                  onClick={handleExportData}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  📥 Export My Data
                </Button>
                <Button
                  onClick={() => toast.success('Feature coming soon!')}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                >
                  🎯 Set Goals
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
