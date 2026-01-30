import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user);

  return (
    <div className="w-full h-screen relative bg-[#0C0C0C] overflow-hidden">
      <BackgroundRippleEffect className="absolute z-0" />
      <div className="hero w-full h-screen flex justify-center items-center relative">
        <div className="main-text absolute left-[50%] translate-x-[-50%] top-[40%] translate-y-[-70%] z-10">
          <h1 className="z-10 text-[50px] md:text-[180px] text-white poppins-bold-italic tracking-tighter text-nowrap relative">
            Clash of Code
          </h1>
          <div className="under-text flex flex-row gap-5 text-(--c4) text-3xl absolute bottom-5 right-0">
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

        <div className="robot w-full h-full relative mt-22 z-10">
          <spline-viewer url="https://prod.spline.design/w1QjstIemdP3Q4nn/scene.splinecode"></spline-viewer>

          <div className="absolute w-40 h-20 z-100 bottom-20 right-10 md:bottom-0 md:right-0 bg-[#0C0C0C]"></div>
        </div>

        <div className="absolute top-5 right-10 z-10">
          {isLoggedIn ? (
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover cursor-pointer 
             border-2 border-[#F2613F] 
             shadow-[0_0_15px_rgba(242,97,63,0.6)]"
              onClick={() => navigate("/dashboard")}
            />
          ) : (
            <div className="flex flex-row gap-10">
              <button
                className="text-white poppins-bold-italic text-xl"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="bg-[#F2613F] text-white px-4 py-3 text-xl poppins-bold-italic rounded-xl"
                onClick={() => navigate("/signup")}
              >
                SignUp
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lower flex flex-col justify-center w-full items-center absolute bottom-10 gap-5 z-10">
        <button
          className="bg-[#F2613F] hover:bg-(--c3) cursor-pointer duration-300 bg- text-white px-4 py-3 text-2xl poppins-bold-italic rounded-xl w-fit flex flex-row gap-2 items-center shadow-[0_0_20px_rgba(242,97,63,0.6)]"
          onClick={() => navigate(isLoggedIn ? "/play" : "/login")}
        >
          <FaPlay className="text-[20px]" />
          Play Now
        </button>

        <div className="tagline flex flex-row gap-5 text-white poppins-regular">
          <h1 className="text-lg">Coding platform like never before!</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
