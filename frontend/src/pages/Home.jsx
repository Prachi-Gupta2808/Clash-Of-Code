"use client";

import ExpandingPanels from "@/components/ExpandingPanels";
import { MaskContainer } from "@/components/ui/svg-mask-effect";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { useAuth } from "@/auth/AuthContext";
import { logout } from "../api/auth";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const isLoggedIn = Boolean(user);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔴 LOGOUT
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setProfileOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen relative bg-transparent overflow-x-hidden overflow-y-auto">
      <div className="top-container mb-25">
        <div className="hero w-full h-screen flex justify-center items-center relative">
          {/* Heading */}
          <div className="main-text absolute left-1/2 -translate-x-1/2 top-[40%] -translate-y-[70%] z-10">
            <h1 className="text-[50px] md:text-[180px] text-white poppins-bold-italic tracking-tighter whitespace-nowrap">
              Clash of Code
            </h1>
            <div className="under-text flex gap-5 text-(--c4) text-3xl absolute bottom-5 right-0">
              <h1 className="drop-shadow-[0_2px_10px_rgba(242,97,63,0.8)]">
                Outthink.
              </h1>
              <h1 className="drop-shadow-[0_2px_10px_rgba(242,97,63,0.8)]">
                Outcode.
              </h1>
              <h1 className="drop-shadow-[0_2px_10px_rgba(242,97,63,0.8)]">
                Outrank.
              </h1>
            </div>
          </div>

          {/* Spline */}
          <div className="robot w-full h-full relative mt-22 z-10">
            <spline-viewer url="https://prod.spline.design/w1QjstIemdP3Q4nn/scene.splinecode"></spline-viewer>
            <div className="absolute w-40 h-20 bottom-20 right-10 md:bottom-0 md:right-0 bg-[#0C0C0C] z-10" />
          </div>

          {/* ================= PROFILE / AUTH ================= */}
          <div className="absolute top-5 right-10 z-20" ref={profileRef}>
            {isLoggedIn ? (
              <div className="relative">
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full cursor-pointer object-cover
                    border-2 border-(--c4)
                    shadow-[0_0_15px_rgba(242,97,63,0.6)]"
                  onClick={() => setProfileOpen((p) => !p)}
                />

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 rounded-xl
                    bg-[#111] border border-white/10
                    shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                    animate-in fade-in zoom-in-95"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm text-white font-semibold">
                        Signed in as
                      </p>
                      <p className="text-sm text-(--c4) truncate">
                        {user?.username || "Coder"}
                      </p>
                    </div>

                    <button
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/dashboard");
                      }}
                    >
                      Dashboard
                    </button>

                    <button
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/contact");
                      }}
                    >
                      Contact Us
                    </button>

                    <div className="border-t border-white/10 mt-1">
                      <button
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-10">
                <button
                  className="text-white poppins-bold-italic text-xl duration-300 hover:bg-white hover:text-black px-4 py-3 rounded-xl cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="bg-(--c4) text-white px-4 py-3 text-xl poppins-bold-italic rounded-xl cursor-pointer duration-300 hover:bg-(--c3)"
                  onClick={() => navigate("/signup")}
                >
                  SignUp
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lower flex flex-col items-center absolute bottom-10 w-full gap-5 z-10">
          <button
            className="bg-(--c4) hover:bg-(--c3) duration-300
              text-white px-4 py-3 text-2xl poppins-bold-italic rounded-xl
              flex gap-2 items-center
              shadow-[0_0_20px_rgba(242,97,63,0.6)] cursor-pointer"
            onClick={() => navigate(isLoggedIn ? "/play" : "/login")}
          >
            <FaPlay className="text-[20px]" />
            Play Now
          </button>

          <h1 className="text-lg text-white poppins-regular">
            Coding platform like never before!
          </h1>
        </div>
      </div>

      {/* ================= EXPANDING PANELS ================= */}
      <ExpandingPanels />

      {/* ================= MASK ================= */}
      <div className="relative w-full min-h-screen">
        <MaskContainer
          revealText={
            <p className="text-center text-[50px] max-w-250 font-semibold text-black dark:text-white">
              Sharpen thinking under{" "}
              <span style={{ color: "#F2613F" }}>pressure</span> with{" "}
              <span style={{ color: "#F2613F" }}>live duels</span> and{" "}
              <span style={{ color: "#F2613F" }}>fair rankings</span>.
            </p>
          }
          size={20}
          revealSize={500}
          className="flex items-center justify-center"
        >
          <div className="space-y-10 text-[50px] max-w-250">
            Skip long contests — jump into a{" "}
            <span className="font-bold text-(--c4)">quick duel</span> and win
            fast.
          </div>
        </MaskContainer>
      </div>
    </div>
  );
};

export default Home;
