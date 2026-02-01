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

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setFetched(true);
      }
    };

    fetchUser();
  }, []);

  if (loading || !fetched) {
    return <IntroLoader onFinish={() => setLoading(false)} />;
  }

  const isLoggedIn = Boolean(user);

  return (
    <>
      <GlobalCursor />
      <Routes>
        <Route element={<AppLayout />}>
          {/* ✅ Pass setUser to Home */}
          <Route path="/" element={<Home user={user} setUser={setUser} />} />

          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Login setUser={setUser} />
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? <Navigate to="/" /> : <SignUp setUser={setUser} />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard user={user} setUser={setUser} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
