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
    description:
      "Compete 1v1 in real-time coding battles. Solve problems faster than your opponent and climb the leaderboard.",
  },
  {
    id: 2,
    key: "predict",
    title: "Output Rush",
    image: "/predictoutput.png",
    description:
      "Predict outputs of tricky code snippets. Test your logical thinking and reaction speed under pressure.",
  },
  {
    id: 3,
    key: "mcq",
    title: "Complexity Clash",
    image: "/timecomplexity.png",
    description:
      "Analyze algorithms and choose the correct time or space complexity. Win with strong fundamentals.",
  },
];

function Panel({ panel, isActive, onHover, onClick }) {
  return (
    <motion.div
      onHoverStart={onHover}
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-3xl shrink-0"
      animate={{
        width: isActive ? "55%" : "22%",
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image */}
      <motion.img
        src={panel.image}
        alt={panel.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ scale: isActive ? 1.08 : 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Clean Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-8 left-8 right-6 text-white">
        <h2 className="text-2xl font-bold tracking-wide">{panel.title}</h2>

        {isActive && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 text-sm text-gray-300 leading-relaxed max-w-md"
          >
            {panel.description}
          </motion.p>
        )}
      </div>
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
    //document.documentElement.requestFullscreen();
    navigate(`/lobby/${panelkey}`);
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-8">
      <div className="flex h-[70vh] w-[85vw] gap-6">
        {panelsData.map((panel) => (
          <Panel
            key={panel.id}
            panel={panel}
            isActive={panel.id === activeId}
            onHover={() => setActiveId(panel.id)}
            onClick={() => handleClick(panel.key)}
          />
        ))}
      </div>
    </section>
  );
}
