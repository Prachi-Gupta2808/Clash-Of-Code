"use client";

import { useAuth } from "@/auth/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket/socket";

const panelsData = [
  {
    id: 1,
    key: "contest",
    title: "Code Knockout",
    image: "/codeknockout.png",
  },
  {
    id: 2,
    key: "mcqs",
    title: "Output Rush",
    image: "/predictoutput.png",
  },
  {
    id: 3,
    key: "predict",
    title: "Complexity Clash",
    image: "/timecomplexity.png",
  },
];

function Panel({ panel, isActive, onHover, onClick }) {
  return (
    <motion.div
      onHoverStart={onHover}
      className="relative cursor-pointer overflow-hidden rounded-2xl shrink-0"
      style={{ willChange: "transform, width" }}
      animate={{
        width: isActive ? "60%" : "20%",
        scale: isActive ? 1.02 : 1,
      }}
      onClick={onClick}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.img
        src={panel.image}
        alt={panel.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <h2 className="absolute bottom-6 left-6 text-lg font-semibold backdrop-blur-md text-white drop-shadow-lg bg-white/30 px-3 py-2 rounded-md">
        {panel.title}
      </h2>
    </motion.div>
  );
}

export default function ExpandingPanelsHover() {
  const { user } = useAuth();
  const [activeId, setActiveId] = useState(1);
  const navigate = useNavigate();

  const handleClick = (panelkey) => {
    console.log(user);
    socket.connect();
    document.documentElement.requestFullscreen();
    navigate(`/lobby/${panelkey}`);
  };

  return (
    <motion.section
      className="flex min-h-screen flex-col items-center justify-center gap-10 px-6"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex h-[70vh] w-[80vw] gap-4">
        {panelsData.map((panel) => (
          <Panel
            key={panel.id}
            panel={panel}
            isActive={panel.id === activeId}
            onHover={() => setActiveId(panel.id)}
            onClick={() => {
              handleClick(panel.key);
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}
