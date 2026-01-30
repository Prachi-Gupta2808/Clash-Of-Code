import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vortex } from "../components/ui/vortex";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/login", formData, {
        withCredentials: true,
      });

      const res = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) return alert("Google login failed");

      await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: credentialResponse.credential }, // ✅ FIX HERE
        { withCredentials: true },
      );

      const res = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <Vortex
          backgroundColor="black"
          className="flex items-center justify-center w-full h-full"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-black/30 backdrop-blur-md border border-white/20 text-white p-10 rounded-xl max-w-md w-full space-y-6 shadow-lg flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center text-white">Login</h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F]"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#F2613F] hover:bg-[#9B3922] py-2 rounded-md font-semibold transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="w-full flex justify-center mt-2">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed")}
              theme="filled_black"
              size="large"
              width="320"
            />
          </div>

          <p className="text-sm text-center text-gray-400 mt-4">
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#F2613F] hover:text-[#9B3922] cursor-pointer font-medium"
            >
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
