// src/contexts/AuthContext.jsx
import React, { useContext, useState, useEffect } from "react";
import { auth, analytics } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { logEvent } from "firebase/analytics";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password).then((result) => {
      // Log signup event
      logEvent(analytics, 'sign_up', {
        method: 'email',
        timestamp: new Date().toISOString(),
      });
      return result;
    });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then((result) => {
      // Log login event
      logEvent(analytics, 'login', {
        method: 'email',
        timestamp: new Date().toISOString(),
      });
      return result;
    });
  }

  function logout() {
    logEvent(analytics, 'logout', {
      timestamp: new Date().toISOString(),
    });
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
