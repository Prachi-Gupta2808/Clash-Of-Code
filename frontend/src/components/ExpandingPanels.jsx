"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const panelsData = [
  {
    id: 1,
    key: "contest",
    title: "Code Knockout",
    image:
      "/codeknockout.png",
  },
  {
    id: 2,
    key: "mcqs",
    title: "Output Rush",
    image:
      "/predict.png",
  },
  {
    id: 3,
    key: "predict",
    title: "Complexity Clash",
    image:
      "/timecomplexity.png",
  },
];


function Panel({ panel, isActive, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl shrink-0"
      style={{ willChange: "transform, width" }}
      animate={{
        width: isActive ? "60%" : "20%",
        scale: isActive ? 1.02 : 1,
      }}
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
      <h2 className="absolute bottom-6 left-6 text-2xl font-semibold text-white drop-shadow-lg">
        {panel.title}
      </h2>
    </motion.div>
  );
}

export default function ExpandingPanels() {
  const [activeId, setActiveId] = useState(1);

  return (
    <motion.section
      className="flex min-h-screen flex-col items-center justify-center gap-10 px-6"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center gap-4 scale-80">
        <h1 className="text-center text-[100px] font-bold text-black dark:text-white py-10 text-wrap leading-24">
          Three modes designed for{" "}
          <span style={{ color: "#F2613F" }}>speed</span>,{" "}
          <span style={{ color: "#F2613F" }}>accuracy</span>, &{" "}
          <span style={{ color: "#F2613F" }}>logic</span>
        </h1>
      </div>

      <div className="flex h-[70vh] w-[80vw] gap-4">
        {panelsData.map((panel) => (
          <Panel
            key={panel.id}
            panel={panel}
            isActive={panel.id === activeId}
            onClick={() => setActiveId(panel.id)}
          />
        ))}
      </div>
    </motion.section>
  );
}
