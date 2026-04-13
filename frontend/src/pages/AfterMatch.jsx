import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from '@/auth/AuthContext';
import { getMatchDuration } from '@/api/auth';

const slides = [
  {
    title: "Graph Theory",
    concept: "Dijkstra's Algorithm",
    complexity: "O((E + V) log V)",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Dynamic Programming",
    concept: "Longest Common Subsequence",
    complexity: "O(n * m)",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Data Structures",
    concept: "Segment Trees",
    complexity: "O(log N) per query",
    image: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*lUfJ6dK1yGT5UUWZR8pigQ.jpeg",
  }
];

const AfterMatch = ({ matchId }) => {
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [matchStatus, setMatchStatus] = useState("SYNCING MATCH DATA...");
  
  const contentRef = useRef(null);
  const imgRef = useRef(null);
  const leftBtnRef = useRef(null);
  const rightBtnRef = useRef(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    let timerInterval;

    const syncTimer = async () => {
      try {
        let data = await getMatchDuration(matchId);
        data = data.data ;
        const bufferSeconds = 3; 
        const targetEndTime = new Date(data.endTime).getTime() + (bufferSeconds * 1000);

        const tick = () => {
          const now = Date.now();
          const diffInSeconds = Math.floor((targetEndTime - now) / 1000);

          if (data.opponentFinished) {
            setTimeLeft(0);
            setMatchStatus("OPPONENT FINISHED. REDIRECTING...");
            clearInterval(timerInterval);
            // Handle redirect to results page here
          } else if (diffInSeconds <= 0) {
            setTimeLeft(0);
            setMatchStatus("TIME UP. PROCESSING RESULTS...");
            clearInterval(timerInterval);
            // Handle time-up logic here
          } else {
            setTimeLeft(diffInSeconds);
            setMatchStatus("YOUR OPPONENT IS STILL CODING...");
          }
        };

        tick(); 
        timerInterval = setInterval(tick, 1000);
      } catch (error) {
        console.error("Failed to sync match timer", error);
        setMatchStatus("CONNECTION LOST. RECONNECTING...");
      }
    };

    syncTimer();

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const animateButton = (ref) => {
    gsap.fromTo(ref.current, 
      { scale: 0.9, backgroundColor: "rgba(var(--c4-rgb), 0.2)" }, 
      { scale: 1, backgroundColor: "rgba(255, 255, 255, 0.02)", duration: 0.2, ease: "power2.out" }
    );
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 20;
    const yPos = (clientY / window.innerHeight - 0.5) * 20;
    gsap.to(imgRef.current, { x: xPos, y: yPos, duration: 1.2, ease: "power2.out" });
  };

  const moveSlide = (direction) => {
    const nextIndex = direction === 'next' 
      ? (index + 1) % slides.length 
      : (index - 1 + slides.length) % slides.length;

    animateButton(direction === 'next' ? rightBtnRef : leftBtnRef);

    const tl = gsap.timeline();
    tl.to(contentRef.current, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: () => setIndex(nextIndex) });
    tl.fromTo(contentRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === 'd') moveSlide('next');
      if (e.key.toLowerCase() === 'a') moveSlide('prev');
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [index]);

  return (
    <div className="h-screen w-full text-white flex flex-col items-center justify-center p-8 overflow-hidden font-mono">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-(--c4)/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative w-full max-w-6xl h-full flex flex-col">
        
        <div className="flex justify-between items-end pb-4 border-b border-white/5">
          <div className="space-y-1">
            <h2 className="text-(--c4) text-xs font-bold tracking-[0.6em] drop-shadow-[0_0_8px_var(--c4)] uppercase">Awaiting_Opponent</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-white/40 text-[10px] tracking-widest uppercase">
                Time Remaining: <span className="text-white font-bold">{formatTime(timeLeft)}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-white/40 text-xs tracking-widest uppercase font-bold">
              {loading ? "LOAD..." : user?.username || "GUEST_CODER"}
            </span>
          </div>
        </div>

        <div className="relative grow my-6 rounded-[32px] overflow-hidden border border-white/10 bg-[#0d0d10] group">
          <div className="absolute inset-0 scale-110">
            <img ref={imgRef} src={slides[index].image} className="w-full h-full object-cover opacity-30 grayscale-20" alt="slide-bg" />
          </div>
          
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-transparent" />
          
          <div className="absolute top-8 left-12 flex flex-col gap-1">
            <span className="text-[10px] text-white/20 tracking-[0.3em] uppercase">Status</span>
            <p className={`text-xs tracking-tighter italic ${timeLeft === 0 ? 'text-(--c4) font-bold' : 'text-white/60'}`}>
              {matchStatus}
            </p>
          </div>

          <div ref={contentRef} className="absolute inset-0 flex flex-col justify-end p-12 pointer-events-none">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-(--c4) shadow-[0_0_15px_var(--c4)]" />
                <span className="text-(--c4) font-bold tracking-widest text-sm italic">INSIGHT_0{index + 1}</span>
              </div>
              <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-none drop-shadow-2xl">{slides[index].title}</h1>
              <p className="text-xl text-white/40 font-light italic max-w-xl">{slides[index].concept}</p>
              <div className="pt-4">
                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10">
                  <span className="text-(--c4) text-xs font-bold tracking-widest">COMPLEXITY: <span className="text-white">{slides[index].complexity}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-6 pb-2">
          <div className="flex gap-2 mr-auto">
            {slides.map((_, i) => (
              <div key={i} className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-12 bg-(--c4)' : 'w-4 bg-white/10'}`} />
            ))}
          </div>

          <div className="flex flex-col items-end gap-2 group">
            <button 
              ref={leftBtnRef}
              onClick={() => moveSlide('prev')}
              className="w-24 h-14 rounded-xl border border-white/10 bg-white/2 flex items-center justify-center text-xl hover:border-(--c4)/50 hover:bg-(--c4)/5 transition-all cursor-pointer"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
            </button>
            <span className="text-[9px] text-white/20 tracking-widest uppercase font-bold group-hover:text-(--c4)">[A] PREV</span>
          </div>

          <div className="flex flex-col items-end gap-2 group">
            <button 
              ref={rightBtnRef}
              onClick={() => moveSlide('next')}
              className="w-24 h-14 rounded-xl border border-white/10 bg-white/2 flex items-center justify-center text-xl hover:border-(--c4)/50 hover:bg-(--c4)/5 transition-all cursor-pointer"
            >
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <span className="text-[9px] text-white/20 tracking-widest uppercase font-bold group-hover:text-(--c4)">[D] NEXT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterMatch;