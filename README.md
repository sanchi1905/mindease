# MindEase - Your Personal Wellness Companion 🌿✨

![MindEase Banner](https://img.shields.io/badge/MindEase-Wellness%20App-purple?style=for-the-badge&logo=react)

> **✨ Crafted with 💜 by Sanchi Sisodia**

A comprehensive mental health and wellness tracking application built with React, featuring mood tracking, gratitude journaling, voice journaling, meditation timers, habit tracking, and advanced analytics.

**🚀 Live Demo:** [Coming Soon]
**📦 Repository:** https://github.com/sanchi1905/mindease

---

## 🌟 Features

### Core Features
- **🔐 Authentication System** - Secure Firebase authentication with beautiful animated login/signup pages
- **😊 Mood Tracker** - Track daily moods with emoji selection and visual charts
- **🙏 Gratitude Journal** - Write and manage daily gratitude entries
- **🎤 Voice Journal** - Record voice notes with AI-powered transcription (AssemblyAI)
- **📊 Advanced Analytics** - Mood trends, distribution charts, and streak tracking
- **🎯 Habit Tracker** - Create and track custom daily habits with 7-day grid
- **🧘 Meditation Timer** - Customizable meditation sessions with breathing guides
- **🌟 Daily Quotes** - Inspiring motivational quotes with beautiful UI
- **👤 User Profile** - View statistics, export data, and track achievements
- **🌓 Dark Mode** - System-wide dark theme with smooth transitions

### UI/UX Enhancements
- ✨ Framer Motion animations throughout
- 🎨 Modern glassmorphism design
- 🔔 Toast notifications for feedback
- 🎯 Lucide icons for consistency
- 📱 Fully responsive design

---

## 🚀 Quick Start

### Installation

**1. Install dependencies**
```bash
npm install
cd server
npm install
cd ..
```

**2. Configure Firebase**
- Create a Firebase project at [firebase.google.com](https://firebase.google.com)
- Enable Email/Password authentication
- Update `src/firebase.js` with your credentials

**3. Configure AssemblyAI (for voice transcription)**
- Sign up at [AssemblyAI](https://www.assemblyai.com/)
- Get your API key
- Update `server/server.js` with your API key

**4. Start development servers**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd server
node server.js
```

**5. Open the app**
- Navigate to `http://localhost:5173`
- Create an account and start your wellness journey!

---

## 🎯 Usage Guide

### Getting Started
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
