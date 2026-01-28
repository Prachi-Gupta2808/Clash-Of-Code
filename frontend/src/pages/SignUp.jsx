import { useState } from "react";
import { Vortex } from "../components/ui/vortex";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <form
          onSubmit={handleSubmit}
          className="bg-black/30 backdrop-blur-[12px] backdrop-saturate-150 border border-white/20 text-white p-10 rounded-xl max-w-md w-full space-y-6 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-[#ffffff]">
            Sign Up
          </h2>

          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F] text-white placeholder-gray-300"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F] text-white placeholder-gray-300"
          />
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F] text-white placeholder-gray-300"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#F2613F] text-white placeholder-gray-300"
          />

          <button
            type="submit"
            className="w-full bg-[#F2613F] hover:bg-[#9B3922] py-2 rounded-md font-semibold transition-colors"
          >
            Sign Up
          </button>

          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <span className="text-[#F2613F] hover:text-[#9B3922] cursor-pointer font-medium">
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
