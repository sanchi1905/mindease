# MindEase - Your Personal Wellness Companion 🌿✨

![MindEase Banner](https://img.shields.io/badge/MindEase-Wellness%20App-purple?style=for-the-badge&logo=react)

> **✨ Crafted with 💜 by Sanchi Sisodia**

A comprehensive mental health and wellness tracking application built with React, featuring 17+ powerful features including AI companion, mood insights, meditation library, community features, physical wellness routines, and smart notifications.

**🚀 Live Demo:** https://mindease-sanchi-sisodias-projects.vercel.app
**📦 Repository:** https://github.com/sanchi1905/mindease

---

## 🌟 Complete Feature List

### 🎯 Core Mental Health Features
- **😊 Mood Tracker** - Track daily moods with emoji selection and visual charts
- **🧠 Mood Insights AI** - Pattern recognition, trigger identification, mood predictions
- **🙏 Gratitude Journal** - Write and manage daily gratitude entries
- **🎤 Voice Journal** - Record voice notes with AI-powered transcription (AssemblyAI)
- **📊 Advanced Analytics** - Mood trends, distribution charts, and streak tracking
- **🎯 Habit Tracker** - Create and track custom daily habits with 7-day grid

### 🧘 Mindfulness & Relaxation
- **🧘 Meditation Timer** - Customizable meditation sessions with breathing guides
- **📚 Meditation Library** - 12+ guided meditations categorized by type (Stress, Sleep, Focus, Anxiety, Emotional, Wellness)
- **😴 Sleep Sounds** - 5 calming soundscapes (Rain, Ocean, Forest, Piano, White Noise) with sleep timer
- **🆘 SOS Quick Relief** - Emergency techniques: 5-4-3-2-1 Grounding, Box Breathing, Body Scan
- **🧘‍♀️ Physical Wellness** - 6 yoga/stretching/exercise routines with step-by-step instructions

### 🤖 AI-Powered Features
- **💬 AI Wellness Companion** - 24/7 chatbot for personalized mental health support
- **🔮 Mood Prediction** - AI analyzes patterns to predict tomorrow's mood
- **📈 Smart Insights** - Identifies triggers, time-of-day patterns, streak analysis

### 👥 Social & Community
- **👫 Friends System** - Add friends, view their streaks, support each other
- **🎉 Activity Feed** - Share achievements and celebrate milestones
- **🏆 Group Challenges** - Join community challenges (7-Day Meditation, Gratitude Challenge)
- **📊 Leaderboard** - Optional weekly rankings with XP scores (can be toggled)

### 🎮 Gamification & Engagement
- **🏅 Rewards System** - 8-level progression from "Seedling" to "Legend" (5000 XP)
- **🎖️ Achievement Badges** - 6 achievements to unlock (First Mood, 7-Day Streak, etc.)
- **🔥 Streak Tracking** - Daily login streaks with XP rewards
- **⭐ XP Points** - Earn points for every activity: Mood (+5), Gratitude (+10), Voice (+15), Meditation (+20)

### 🔔 Smart Notifications & Offline Support
- **⏰ Smart Reminders** - Personalized notifications: Morning Mood, Evening Gratitude, Daily Quote, Streak Reminder
- **📅 Weekly Insights** - Automated weekly summary of emotional patterns
- **📴 Offline Mode** - Full PWA support with service worker caching
- **🔄 Background Sync** - Auto-sync offline data when connection restored

### 🎨 Premium UI/UX
- **🌓 Dark Mode** - System-wide dark theme with smooth transitions
- **✨ Framer Motion Animations** - Smooth transitions and micro-interactions throughout
- **🎨 Glassmorphism Design** - Modern glass-card aesthetic
- **📱 Fully Responsive** - Mobile-first design optimized for all devices
- **🎯 Touch-Optimized** - 44px minimum touch targets (Apple HIG compliant)
- **🔔 Toast Notifications** - Real-time feedback for all actions
- **🌟 Daily Quotes** - Inspiring motivational quotes with beautiful UI

### 🔐 Security & Data
- **🔒 Firebase Authentication** - Secure email/password authentication
- **📊 Firebase Analytics** - Track user engagement (signup, login, features)
- **📥 Data Export** - Export all your data as JSON
- **💾 Local Storage** - Offline-first data persistence
- **👤 User Profile** - View statistics, export data, track achievements

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account
- AssemblyAI account (for voice transcription)

### Installation

**1. Clone and install dependencies**
```bash
git clone https://github.com/sanchi1905/mindease.git
cd mindease
npm install
cd server
npm install
cd ..
```

**2. Configure Environment Variables**

Create `.env` in root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Create `server/.env`:
```env
ASSEMBLYAI_API_KEY=your_assemblyai_key
```

**3. Setup Firebase**
- Create project at [firebase.google.com](https://firebase.google.com)
- Enable Email/Password authentication
- Enable Analytics
- Add your credentials to `.env`

**4. Setup AssemblyAI**
- Sign up at [AssemblyAI](https://www.assemblyai.com/)
- Get API key from dashboard
- Add to `server/.env`

**5. Start Development Servers**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd server
node server.js
```

**6. Access the App**
- Open `http://localhost:5173`
- Create account and explore all 17+ features!

---

## 🎯 Feature Usage Guide

### 🧠 AI Wellness Companion
Navigate to AI Chat → Ask questions about anxiety, sleep, stress, motivation, or loneliness → Get personalized AI responses → View conversation history

### 📚 Meditation Library
Browse 12 guided meditations → Filter by category (Stress/Sleep/Focus) → Filter by duration (1-5, 6-10, 11-20, 20+ min) → Play/pause sessions → Track progress

### 👥 Community Hub
Add friends by email → Share achievements to feed → Join group challenges → View optional leaderboard → Celebrate milestones together

### 🧘 Physical Wellness
Choose from 6 routines → Filter by type (Yoga/Stretching/Exercise) → Follow step-by-step instructions → Use built-in timer → Track calories burned

### 🔔 Smart Notifications
Enable browser notifications → Set reminder times → Choose notification types → Test notifications → Customize schedule

### 📴 Offline Support
Install as PWA (Add to Home Screen) → Use all features offline → Data syncs automatically when online → Cached meditations & sounds available offline

---
1. **Sign Up** - Create your account
2. **Track Mood** - Select how you're feeling
3. **Write Gratitude** - Add what you're thankful for
4. **Record Voice** - Share thoughts verbally
5. **Meditate** - Use guided breathing
6. **Build Habits** - Track daily goals
7. **View Analytics** - See your progress

---

## 💻 Tech Stack

### Frontend
- React 18.3.1
- Vite 7.3.0
- Tailwind CSS 3.4.4
- Framer Motion 11.18.0
- Recharts 3.6.0
- React Hot Toast 2.4.1
- Lucide React 0.468.0

### Backend
- Node.js & Express.js
- AssemblyAI API
- Multer

### Database & Auth
- Firebase 12.7.0
- localStorage (for performance)

---

## 📁 Project Structure

```
mindease/
├── src/
│   ├── components/        # React components
│   │   ├── Analytics.jsx
│   │   ├── GratitudeJournal.jsx
│   │   ├── HabitTracker.jsx
│   │   ├── MeditationTimer.jsx
│   │   ├── MoodTracker.jsx
│   │   ├── Profile.jsx
│   │   ├── VoiceJournal.jsx
│   │   └── ui/
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   └── App.jsx
├── server/                # Backend server
│   ├── server.js
│   └── package.json
└── package.json
```

---

## 🌟 Key Features Details

### Mood Tracker
- 5 mood options with emoji selection
- Visual charts using Recharts
- Historical mood data
- Animated mood selection

### Gratitude Journal
- Rich text entries
- Beautiful card-based layout
- Delete and manage entries
- Encourages positivity

### Voice Journal
- Instant recording
- AI transcription via AssemblyAI
- Playback functionality
- Local blob storage

### Habit Tracker
- Custom habit creation
- 7-day tracking grid
- Streak calculations
- Visual progress indicators

### Meditation Timer
- Multiple duration options (3-20 min)
- Animated breathing circle
- Guided breathing instructions
- Sound controls

### Analytics Dashboard
- Mood trend line charts
- Mood distribution pie charts
- Activity bar charts
- Streak tracking
- Statistical insights

---

## 🎨 Design Philosophy

- **Glassmorphism**: Modern frosted glass effects
- **Gradient Accents**: Purple, pink, and blue gradients
- **Smooth Animations**: Framer Motion throughout
- **Dark Mode**: Full dark theme support
- **Responsive**: Works on all devices

---

## 🐛 Troubleshooting

**Firebase not working?**
- Check config in `src/firebase.js`
- Enable Email/Password auth in Firebase Console

**Voice transcription failing?**
- Verify AssemblyAI API key in `server/server.js`
- Ensure backend server is running on port 3001

**Dark mode not saving?**
- Clear browser cache/localStorage
- Check localStorage is enabled

---

## � Deployment

### Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional)
```bash
npm i -g vercel
```

2. **Deploy via Vercel Dashboard**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository: `sanchi1905/mindease`
- Vercel will auto-detect Vite
- Add environment variables in Vercel dashboard:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_API_URL` (backend URL after deploying server)
- Click Deploy!

### Deploy Backend to Render

1. **Create New Web Service**
- Go to [render.com](https://render.com)
- Connect your GitHub repo
- Set **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

2. **Add Environment Variables**
- `ASSEMBLYAI_API_KEY` - Your AssemblyAI API key
- `PORT` - 3001 (or leave default)

3. **Update Frontend**
- After backend deploys, copy the Render URL
- Update `VITE_API_URL` in Vercel environment variables
- Redeploy frontend

---

## �📄 License

MIT License - feel free to use for personal or educational purposes

---

## 👏 Credits

**Developer**: Sanchi Sisodia 

**Technologies**:
- Firebase (Auth & Database)
- AssemblyAI (Voice Transcription)
- Quotable.io (Daily Quotes)
- Tailwind CSS, Framer Motion, Recharts

---

<div align="center">

### ✨ Crafted with 💜 by Sanchi Sisodia

**Your journey to mindfulness and wellness starts here** 🌿


</div>

```cmd
npm run dev
```

3. Build for production

```cmd
npm run build
npm run preview
```

Notes and structure
- `index.html` now mounts the React app via `<div id="root"></div>` and loads `/src/main.jsx`.
- React source: `src/` (components, `main.jsx`, `App.jsx`). Tailwind directives are in `src/index.css` and Tailwind config is at project root.
- Minimal UI components live in `src/components/ui/` (small `Card` and `Button` used by `QuoteBox`).
- Legacy/static scripts and pages were deprecated to avoid conflicts. If you need them preserved, they can be moved to a `legacy/` folder — ask me and I will do that.

Recommended next improvements (I can implement any of these):

- Persist recordings: use `localStorage` or a small backend API to save recordings beyond the session.
- Add ESLint + Prettier and a `format` npm script.
- Add a GitHub Actions workflow that runs tests/lint and builds the app on push.
- Add more robust audio handling (convert to `mp3`/`ogg` server-side or use `webm` consistently) and better file naming when downloading.
- Add tests and a simple Storybook for components (optional).
- Move legacy static pages to `legacy/` folder if you want to keep them.

If you'd like, I can commit these changes and create a branch/PR for review.
