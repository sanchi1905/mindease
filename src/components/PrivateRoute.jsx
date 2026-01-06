// src/components/PrivateRoute.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading MindEase...
        </div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" />;
}
