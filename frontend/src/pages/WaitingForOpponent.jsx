"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

const TIPS = [
  "Pro Tip: Always check for edge cases like empty arrays or null values.",
  "Did you know? Python was named after Monty Python's Flying Circus.",
  "Flex those fingers! The faster you type, the faster you debug... sometimes.",
  "Remember to breathe. A calm coder is a dangerous coder.",
  "Algorithm stuck? Try rubber duck debugging. Explain it to an inanimate object.",
];

const WaitingForOpponent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(tipTimer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="absolute top-12 flex flex-col items-center gap-2 z-20">
        <div className="flex items-center gap-3 text-[#F2613F] font-semibold tracking-wider uppercase text-sm bg-[#F2613F]/10 px-4 py-2 rounded-full border border-[#F2613F]/20">
          <Search size={16} className="animate-pulse" />
          Searching the Arena
        </div>
        <p className="text-white text-3xl font-bold mt-4 font-mono">
          {formatTime(elapsedTime)}
        </p>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64 z-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-[#F2613F] rounded-full"
            initial={{ width: 80, height: 80, opacity: 0.8 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut",
            }}
          />
        ))}

        <div className="relative z-20 bg-black p-2 rounded-full border-2 border-[#F2613F] shadow-[0_0_30px_rgba(242,97,63,0.4)]">
          <img
            src={
              user?.avatar ||
              "https://riqieznxfrbdfcyfoxss.supabase.co/storage/v1/object/public/avatars/defaultPic.webp"
            }
            alt="Your Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="mt-16 text-center z-20">
        <h2 className="text-xl text-white font-semibold">
          {user?.username || "You"}{" "}
          <span className="text-neutral-500 mx-2">VS</span>{" "}
          <span className="text-[#F2613F] animate-pulse">Opponent</span>
        </h2>
      </div>

      <div className="absolute bottom-32 h-12 flex items-center justify-center w-full max-w-lg px-6 z-20 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-neutral-400 text-sm md:text-base italic"
          >
            {TIPS[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 z-20">
        <button
          onClick={handleCancel}
          className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300"
        >
          <X
            size={18}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="font-medium text-sm">Cancel Matchmaking</span>
        </button>
      </div>
    </div>
  );
};

export default WaitingForOpponent;