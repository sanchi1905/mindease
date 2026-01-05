// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import VoiceJournal from "./components/VoiceJournal";
import MoodTracker from "./components/MoodTracker";
import QuoteBox from "./components/QuoteBox";
import GratitudeJournal from "./components/GratitudeJournal";
import Mindfulness from "./components/Mindfulness";
import Profile from "./components/Profile";
import Analytics from "./components/Analytics";
import HabitTracker from "./components/HabitTracker";
import MeditationTimer from "./components/MeditationTimer";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Mindfulness showWelcome={true} showQuote={true} showBreathing={true} />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mood"
          element={
            <PrivateRoute>
              <MainLayout>
                <MoodTracker />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/gratitude"
          element={
            <PrivateRoute>
              <MainLayout>
                <GratitudeJournal />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/voice"
          element={
            <PrivateRoute>
              <MainLayout>
                <VoiceJournal />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <MainLayout>
                <Analytics />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <PrivateRoute>
              <MainLayout>
                <HabitTracker />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/meditation"
          element={
            <PrivateRoute>
              <MainLayout>
                <MeditationTimer />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
