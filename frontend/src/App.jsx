import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import IntroLoader from "./components/IntroLoader";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <IntroLoader onFinish={() => setLoading(false)} />;
  }
  return (
    <Routes>
      {/* Home should be default */}
      <Route path="/" element={<Home />} />

      {/* Login page */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : <Login />}
      />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
