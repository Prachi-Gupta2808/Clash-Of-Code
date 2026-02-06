import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const GsapMarquee = () => {
  const marqueeTween = useRef(null);

  useGSAP(() => {
    marqueeTween.current = gsap.to(".marquee", {
      xPercent: -100,
      duration: 7,
      repeat: -1,
      ease: "none",
    });

    const onWheel = (e) => {
      if (e.deltaY > 0) {
        marqueeTween.current.timeScale(1);

        gsap.to(".marquee img", {
          rotation: 0,
          duration: 0.8,
        });
      } else {
        marqueeTween.current.timeScale(-1);

        gsap.to(".marquee img", {
          rotation: 180,
          duration: 0.8,
        });
      }
    };

    window.addEventListener("wheel", onWheel);

    return () => window.removeEventListener("wheel", onWheel);
  });

  return (
    <div>
      <div className="bg-white flex py-[2vw] overflow-hidden whitespace-nowrap">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="marquee flex items-center gap-[3vw] px-[1.5vw]"
          >
            <h1 className="text-[70px] poppins-semibold text-(--c4)">
              CODE. SLEEP. REPEAT.
            </h1>
            <img
              src="/brandium_arrow.svg"
              alt="arrow"
              className="h-23.75"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GsapMarquee;
