import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const Home = () => {
  const navigate = useNavigate();

  // auth check
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    document.querySelector(".spline-watermark")?.remove();
  }, []);

  return (
    <div className="w-full h-screen relative bg-[#0C0C0C]">
      <div className="hero w-full h-screen flex justify-center items-center relative">
        <h1 className="text-[50px] md:text-[150px] text-white absolute left-[50%] translate-x-[-50%] top-[40%] poppins-bold-italic tracking-tighter translate-y-[-50%] text-nowrap">
          Clash of Code
        </h1>

        <div className="robot w-full h-full relative mt-40">
          <spline-viewer
            url="https://prod.spline.design/w1QjstIemdP3Q4nn/scene.splinecode"
            class="absolute scale-75 md:scale-100"
          ></spline-viewer>

          <div className="absolute w-40 h-20 z-100 bottom-20 right-10 md:bottom-0 md:right-0 bg-[#0C0C0C]"></div>
        </div>

        {/* Top Right */}
        <div className="absolute top-5 right-10">
          {isLoggedIn ? (
            <img
              src={user?.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              onClick={() => navigate("/profile")}
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

      <div className="lower flex flex-col justify-center w-full items-center absolute bottom-10 gap-5">
        <button
          className="bg-[#F2613F] text-white px-4 py-3 text-2xl poppins-bold-italic rounded-xl w-fit"
          onClick={() => navigate(isLoggedIn ? "/play" : "/login")}
        >
          Play Now
        </button>

        <div className="tagline flex flex-row gap-5 text-white poppins-regular">
          <h1>Outthink.</h1>
          <h1>Outcode.</h1>
          <h1>Outrank.</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
