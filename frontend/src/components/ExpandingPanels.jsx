"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const panelsData = [
  {
    id: 1,
    key: "contest",
    title: "Code Knockout",
    image: "/codeknockout.png",
    description:
      "Compete 1v1 in real-time coding battles. Solve algorithmic problems faster than your opponent and climb the leaderboard.",
  },
  {
    id: 2,
    key: "mcqs",
    title: "Output Rush",
    image: "/predictoutput.png",
    description:
      "Predict outputs of tricky code snippets. Test your logical thinking and speed in this rapid-fire challenge mode.",
  },
  {
    id: 3,
    key: "predict",
    title: "Complexity Clash",
    image: "/timecomplexity.png",
    description:
      "Analyze algorithms and select the correct complexity. Strengthen your fundamentals and win with smart decisions.",
  },
];

function Panel({ panel, isActive, onActivate, isMobile }) {
  return (
    <motion.div
      onHoverStart={!isMobile ? onActivate : undefined}
      onClick={onActivate}
      className="relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl shrink-0"
      animate={{
        width: isMobile ? "100%" : isActive ? "55%" : "22%",
        height: isMobile ? (isActive ? "60%" : "18%") : "100%",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.img
        src={panel.image}
        alt={panel.title}
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ scale: isActive ? 1.08 : 1 }}
        transition={{ duration: 0.5 }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:from-black md:via-black/60 md:to-transparent" />

      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-6 text-white flex flex-col justify-end h-full">
        <h2 className="text-xl md:text-2xl font-bold tracking-wide">
          {panel.title}
        </h2>

        {isActive && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 md:mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md line-clamp-3 md:line-clamp-none"
          >
            {panel.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default function ExpandingPanels() {
  const [activeId, setActiveId] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <section className="flex min-h-[90vh] md:min-h-screen items-center justify-center px-4 md:px-8 py-10 md:py-0">
      <div className="flex flex-col md:flex-row h-[75vh] md:h-[70vh] w-full md:w-[85vw] max-w-7xl gap-3 md:gap-6">
        {panelsData.map((panel) => (
          <Panel
            key={panel.id}
            panel={panel}
            isActive={panel.id === activeId}
            onActivate={() => setActiveId(panel.id)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}