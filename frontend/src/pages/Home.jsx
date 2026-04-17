import { useAuth } from "@/auth/AuthContext";
import Footer from "@/components/Footer";
import { socket } from "@/components/socket/socket";
import { MaskContainer } from "@/components/ui/svg-mask-effect";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import "./HomePage.css";

// Lazy loaded components
const ExpandingPanels = lazy(() => import("@/components/ExpandingPanels"));
const TwoPhotos = lazy(() => import("@/components/ProfileCards"));
const ScrollReview = lazy(() => import("@/components/ScrollReview"));
const ScrollStatsSection = lazy(() =>
  import("@/components/ScrollStatsSection")
);

const LazySection = ({ children, placeholderHeight = "300px" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ minHeight: isVisible ? "auto" : placeholderHeight }}
    >
      {isVisible ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const isLoggedIn = Boolean(user);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      socket.disconnect();
      setUser(null);
      setProfileOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div
      ref={scrollRef}
      className="w-full h-screen relative bg-transparent overflow-x-hidden overflow-y-auto"
    >
      {/* ABOVE THE FOLD: Loads Immediately */}
      <div className="top-container mb-25">
        <div className="hero w-full h-screen flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-[18%] sm:top-[25%] md:top-[30%] z-0 flex flex-col pointer-events-none px-4">
            <h1 className="text-[13vw] sm:text-[80px] md:text-[140px] xl:text-[180px] text-white poppins-bold-italic tracking-tighter whitespace-nowrap leading-[0.9] drop-shadow-xl text-center">
              Clash of Code
            </h1>
            <div className="flex gap-2 sm:gap-4 text-(--c4) text-[3.8vw] sm:text-xl md:text-3xl justify-center md:justify-end w-full md:pr-10 mt-2">
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

          <div className="absolute inset-0 top-[25%] md:top-[10%] w-full h-[65vh] md:h-full z-10 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full relative pointer-events-auto">
              <spline-viewer url="https://prod.spline.design/w1QjstIemdP3Q4nn/scene.splinecode"></spline-viewer>
              <div className="absolute w-40 h-12 sm:w-40 sm:h-20 bottom-5 right-2 bg-[#0C0C0C] z-10" />
            </div>
          </div>

          <div
            className="fixed top-4 right-4 sm:top-5 sm:right-10 z-50"
            ref={profileRef}
          >
            {isLoggedIn ? (
              <div className="relative">
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full cursor-pointer object-cover border-2 border-(--c4) shadow-[0_0_15px_rgba(242,97,63,0.6)]"
                  onClick={() => setProfileOpen((p) => !p)}
                />
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-48 sm:w-56 rounded-xl bg-[#111] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm text-white font-semibold">
                        Signed in as
                      </p>
                      <p className="text-sm text-(--c4) truncate">
                        {user?.username || "Coder"}
                      </p>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 text-sm transition-colors cursor-pointer"
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 text-sm transition-colors cursor-pointer"
                      onClick={() => navigate("/contact")}
                    >
                      Contact Us
                    </button>
                    <div className="border-t border-white/10 mt-1">
                      <button
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 text-sm transition-colors rounded-b-xl cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3 sm:gap-10">
                <button
                  className="text-white poppins-bold-italic text-sm sm:text-xl duration-300 hover:bg-white hover:text-black px-3 py-2 sm:px-4 sm:py-3 rounded-xl cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="bg-(--c4) text-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-xl poppins-bold-italic rounded-xl cursor-pointer duration-300 hover:bg-(--c3)"
                  onClick={() => navigate("/signup")}
                >
                  SignUp
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lower flex flex-col items-center absolute bottom-6 sm:bottom-10 w-full gap-3 sm:gap-5 z-30">
          <button
            className="bg-(--c4) hover:bg-(--c3) duration-300 text-white px-5 py-3 sm:px-6 sm:py-4 text-lg sm:text-2xl poppins-bold-italic rounded-xl flex gap-2 items-center shadow-[0_0_20px_rgba(242,97,63,0.6)] cursor-pointer"
            onClick={() => navigate(isLoggedIn ? "/play" : "/login")}
          >
            <FaPlay className="text-[16px] sm:text-[20px]" />
            Play Now
          </button>
          <h1 className="text-xs sm:text-lg text-white poppins-regular text-center px-4 font-medium">
            Coding platform like never before!
          </h1>
        </div>
      </div>

      {/* BELOW THE FOLD: Lazy Loaded Sections */}

      <LazySection placeholderHeight="500px">
        <ExpandingPanels />
      </LazySection>

      <div className="relative w-full min-h-screen">
        <MaskContainer
          revealText={
            <p className="text-center text-[28px] sm:text-[40px] md:text-[50px] max-w-250 font-semibold text-black dark:text-white px-4">
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
          <div className="space-y-10 text-[28px] sm:text-[40px] md:text-[50px] max-w-250 px-4">
            Skip long contests — jump into a{" "}
            <span className="font-bold text-(--c4)">quick duel</span> and win
            fast.
          </div>
        </MaskContainer>
      </div>

      <LazySection placeholderHeight="400px">
        <ScrollStatsSection scrollRef={scrollRef} />
      </LazySection>

      <div className="flex flex-col items-center gap-4 pt-32 pb-10 px-4 z-10 relative">
        <h1 className="text-center text-4xl sm:text-5xl md:text-7xl lg:text-[90px] font-bold text-black dark:text-white leading-[1.1] tracking-tight">
          What our users say <br className="hidden md:block" />
          <span className="text-[#F2613F]">about</span>{" "}
          <span className="text-[#F2613F]">us</span>
        </h1>
      </div>

      <LazySection placeholderHeight="400px">
        <ScrollReview scrollRef={scrollRef} />
      </LazySection>

      <div className="flex flex-col items-center pt-32 px-4 z-10 relative">
        <h1 className="text-center text-4xl sm:text-5xl md:text-7xl lg:text-[90px] font-bold text-black dark:text-white leading-[1.1] tracking-tight">
          Who created this <br className="hidden md:block" />
          <span className="text-[#F2613F]">cool</span>{" "}
          <span className="text-[#F2613F]">platform</span>
        </h1>
      </div>

      <LazySection placeholderHeight="600px">
        <TwoPhotos />
      </LazySection>

      <Footer />
    </div>
  );
};

export default Home;
