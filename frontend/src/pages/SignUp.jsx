import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vortex } from "../components/ui/vortex";

const SignUp = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
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
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
        { withCredentials: true }
      );

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) return alert("Google login failed");

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Google signup failed");
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
        <div className="bg-black/30 backdrop-blur-md border border-white/20 text-white p-10 rounded-xl max-w-md w-full space-y-4 shadow-lg flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F]"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F]"
              required
            />
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F]"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F2613F] hover:bg-[#9B3922] py-2 rounded-md font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="w-full flex justify-center mt-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google signup failed")}
              theme="filled_black"
              size="large"
              width="320"
            />
          </div>

          <p className="text-sm text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#F2613F] hover:text-[#9B3922] cursor-pointer font-medium"
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
