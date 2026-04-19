"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Activity, Cpu, Globe, Swords, Terminal, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    id: "duels",
    title: "Live Code Battles",
    description:
      "Challenge developers globally. Real-time keystroke synchronization with 12ms latency.",
    highlight: "1v1 REALTIME",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "elo",
    title: "Smart Ranking",
    description:
      "Your Rating evolves instantly. Beat higher-ranked players to climb the leaderboard faster.",
    highlight: "Rating +24",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "modes",
    title: "Complexity Wars",
    description:
      "Don't just code. Optimize. Your solution is judged on Big O time & space complexity.",
    highlight: "O(log n)",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "analytics",
    title: "Deep Analytics",
    description:
      "Visualize your growth. Heatmaps, weakness detection, and language mastery charts.",
    highlight: "TOP 1%",
    gradient: "from-emerald-400 to-green-600",
  },
];

export default function FantasticScrollSection() {
  const containerRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className="relative text-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 overflow-x-clip min-h-screen"
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px]" />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute top-[-10%] left-[-20%] md:left-[-10%] w-64 sm:w-96 md:w-150 h-64 sm:h-96 md:h-150 bg-orange-600/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen"
        />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute bottom-[-10%] right-[-20%] md:right-[-10%] w-56 sm:w-80 md:w-125 h-56 sm:h-80 md:h-125 bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] mix-blend-screen"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="px-3 sm:px-4 py-1.5 rounded-full border border-white/10 bg-white/10 text-xs sm:text-sm text-neutral-300 font-medium backdrop-blur-md">
              Next Gen Platform
            </span>
          </motion.div>
          <h1 className="mt-4 sm:mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-500">
            Code like it's <br className="sm:hidden" />{" "}
            <span className="text-[#F2613F]">2077</span>
          </h1>
        </div>

        <div className="hidden lg:flex flex-row gap-8 items-start relative">
          <div className="w-1/2 sticky top-0 h-screen flex items-center justify-center">
            <FeatureCard activeCard={activeCard} />
          </div>
          <div className="w-1/2 flex flex-col py-[20vh] gap-[30vh]">
            {FEATURES.map((feature, index) => (
              <FeatureTextCardDesktop
                key={feature.id}
                feature={feature}
                index={index}
                setActiveCard={setActiveCard}
              />
            ))}
          </div>
        </div>

        <div className="flex lg:hidden flex-col gap-16 sm:gap-20">
          {FEATURES.map((feature, index) => (
            <div key={feature.id} className="flex flex-col items-center gap-6 sm:gap-8">
              <FeatureCard activeCard={index} />
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 max-w-md">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shrink-0`}
                >
                  {index === 0 && <Swords className="text-white" size={24} />}
                  {index === 1 && <Trophy className="text-white" size={24} />}
                  {index === 2 && <Terminal className="text-white" size={24} />}
                  {index === 3 && <Activity className="text-white" size={24} />}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ activeCard }) {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm aspect-[4/5] rounded-[24px] border border-white/10 bg-neutral-900/80 backdrop-blur-xl shadow-2xl overflow-hidden shrink-0 mx-auto">
      <div
        className={`absolute inset-0 opacity-20 bg-gradient-to-br ${FEATURES[activeCard].gradient} transition-colors duration-700`}
      />
      <div className="relative h-full w-full p-5 sm:p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                activeCard % 2 === 0 ? "bg-green-500" : "bg-orange-500"
              } animate-pulse`}
            />
            <span className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-widest">
              System_Active
            </span>
          </div>
          <Cpu className="text-neutral-500" size={16} />
        </div>
        
        <div className="flex-1 flex items-center justify-center relative w-full h-full">
          <AnimatePresence mode="wait">
            {activeCard === 0 && <VisualDuels key="duels" />}
            {activeCard === 1 && <VisualElo key="elo" />}
            {activeCard === 2 && <VisualCode key="code" />}
            {activeCard === 3 && <VisualStats key="stats" />}
          </AnimatePresence>
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-neutral-500 text-[10px] sm:text-xs font-mono mb-1">
                METRIC_VAL
              </p>
              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tighter">
                {FEATURES[activeCard].highlight}
              </h4>
            </div>
            <Globe className="text-neutral-600 mb-1" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureTextCardDesktop = ({ feature, index, setActiveCard }) => {
  const ref = useRef(null);
  const isInView = useInViewHook(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) setActiveCard(index);
  }, [isInView, index, setActiveCard]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.2 }}
      animate={{ opacity: isInView ? 1 : 0.2 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center px-4 md:px-12 gap-4 md:gap-6"
    >
      <div className="flex flex-row items-center gap-4">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shrink-0`}
        >
          {index === 0 && <Swords className="text-white" size={24} />}
          {index === 1 && <Trophy className="text-white" size={24} />}
          {index === 2 && <Terminal className="text-white" size={24} />}
          {index === 3 && <Activity className="text-white" size={24} />}
        </div>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          {feature.title}
        </h3>
      </div>
      <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-md">
        {feature.description}
      </p>
    </motion.div>
  );
};

const VisualDuels = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="relative w-full h-full flex flex-col items-center justify-center"
  >
    <div className="absolute w-32 h-32 sm:w-40 sm:h-40 border border-orange-500/30 rounded-full animate-[spin_4s_linear_infinite]" />
    <div className="absolute w-20 h-20 sm:w-28 sm:h-28 border border-orange-500/20 rounded-full" />
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 bg-neutral-800 border border-orange-500/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-[0_0_30px_rgba(249,115,22,0.4)]"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral-700 rounded-full flex items-center justify-center">
          <span className="text-[10px] sm:text-xs">VS</span>
        </div>
        <div>
          <div className="h-1.5 sm:h-2 w-12 sm:w-16 bg-neutral-600 rounded mb-1" />
          <div className="h-1.5 sm:h-2 w-8 sm:w-10 bg-neutral-700 rounded" />
        </div>
      </div>
    </motion.div>
    <div className="mt-6 sm:mt-8 text-[10px] sm:text-xs font-mono text-orange-500 animate-pulse">
      SEARCHING MATCH...
    </div>
  </motion.div>
);

const VisualElo = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-center"
  >
    <div className="relative inline-block">
      <Trophy
        className="text-yellow-500 mx-auto drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] w-12 h-12 sm:w-14 sm:h-14"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="absolute -top-1 -right-2 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full"
      >
        NEW
      </motion.div>
    </div>
    <div className="mt-3 sm:mt-4 flex flex-col gap-1">
      <span className="text-2xl sm:text-3xl font-black text-white">1,420</span>
      <span className="text-xs sm:text-sm text-neutral-400 font-mono">Master</span>
    </div>
    <div className="mt-4 sm:mt-6 w-28 sm:w-36 h-1.5 bg-neutral-800 rounded-full overflow-hidden mx-auto">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "75%" }}
        transition={{ duration: 1, delay: 0.3 }}
        className="h-full bg-blue-500"
      />
    </div>
  </motion.div>
);

const VisualCode = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-[180px] sm:max-w-52 bg-neutral-900 rounded-lg p-3 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
  >
    <div className="flex gap-1.5 mb-3">
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500" />
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500" />
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500" />
    </div>
    <div className="space-y-2">
      <div className="h-1.5 sm:h-2 bg-neutral-700 rounded w-[80%]" />
      <div className="h-1.5 sm:h-2 bg-purple-500/50 rounded w-[60%]" />
      <div className="h-1.5 sm:h-2 bg-neutral-700 rounded w-[90%]" />
      <div className="flex gap-2 mt-2">
        <div className="h-1.5 sm:h-2 w-6 sm:w-8 bg-pink-500 rounded" />
        <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-neutral-700 rounded" />
      </div>
    </div>
    <div className="mt-4 pt-2 border-t border-white/5 flex justify-between">
      <span className="text-[8px] sm:text-[10px] text-neutral-500">Complexity</span>
      <span className="text-[8px] sm:text-[10px] text-green-400 font-mono">O(n)</span>
    </div>
  </motion.div>
);

const VisualStats = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-end gap-1 h-20 sm:h-28 w-full px-2 sm:px-4"
  >
    {[40, 70, 30, 85, 50, 95].map((h, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${h}%` }}
        transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
        className={`flex-1 rounded-t-sm ${
          i === 5 ? "bg-green-500" : "bg-[#59826964]"
        }`}
      />
    ))}
  </motion.div>
);

function useInViewHook(ref, options) {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      options
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);
  
  return isInView;
}