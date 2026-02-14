import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import GlobalCursor from "./components/GlobalCursor";
import IntroLoader from "./components/IntroLoader";
import AppLayout from "./layouts/AppLayout";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ThemeSelect from "./pages/ThemeSelect";
import Playground from "./pages/Playground";

function App() {
  const { user, loading } = useAuth();
  const [introDone, setIntroDone] = useState(false);

  if (loading || !introDone) {
    return <IntroLoader onFinish={() => setIntroDone(true)} />;
  }

  const isLoggedIn = Boolean(user);

  return (
    <>
      <GlobalCursor />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />

          <Route
            path="/admin"
            element={
              user && user.isAdmin ? <Admin /> : <Navigate to="/" replace />
            }
          />

          <Route
            path="/signup"
            element={isLoggedIn ? <Navigate to="/" /> : <SignUp />}
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/play" element={<ThemeSelect />} />
          <Route path="/lobby/:mode" element={<Lobby />} />
          <Route path="/match/:theme/:matchId" element={<Playground />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
