import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, googleAuth, login } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import { Vortex } from "../components/ui/vortex";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

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
      await login(formData);
      const res = await getMe();
      setUser(res.data.user);
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
      if (!credentialResponse.credential) {
        return alert("Google login failed");
      }
      await googleAuth(credentialResponse.credential);
      const res = await getMe();
      setUser(res.data.user);
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

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-black/30 backdrop-blur-md border border-white/20 text-white p-6 sm:p-10 rounded-xl w-full max-w-sm sm:max-w-md space-y-6 shadow-lg flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Login</h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-md bg-gray-800/50 focus:ring-2 focus:ring-[#F2613F] text-sm sm:text-base outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-md bg-gray-800/50 focus:ring-2 focus:ring-[#F2613F] text-sm sm:text-base outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#F2613F] hover:bg-[#9B3922] py-2.5 rounded-md font-semibold text-sm sm:text-base transition-all active:scale-95 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="w-full flex justify-center">
            <div className="w-full flex justify-center overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => alert("Google login failed")}
                theme="filled_black"
                size="large"
                width="260"
              />
            </div>
          </div>

          <p className="text-sm text-center text-gray-400">
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#F2613F] cursor-pointer font-medium hover:underline"
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
