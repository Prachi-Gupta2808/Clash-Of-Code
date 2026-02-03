import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getMe } from "./api/auth";
import GlobalCursor from "./components/GlobalCursor";
import IntroLoader from "./components/IntroLoader";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ThemeSelect from "./pages/ThemeSelect";
import Lobby from "./pages/Lobby";
import { useAuth } from "./auth/AuthContext";

function App() {
  const { user, loading } = useAuth() ;

  if (loading) return <IntroLoader />;

  const isLoggedIn = Boolean(user);
  
  return (
    <>
      <GlobalCursor />
      <Routes>
        <Route element={<AppLayout />}>
          {/* ✅ Pass setUser to Home */}
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Login />
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? <Navigate to="/" /> : <SignUp />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/play"
            element={<ThemeSelect />}
          />
          <Route
            path="/lobby/:mode"
            element={<Lobby />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
