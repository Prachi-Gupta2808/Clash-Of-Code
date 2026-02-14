"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    name: "Divyanshi",
    platform: "COC",
    text: "Finally, a platform where coding feels",
    direction: "left",
  },
  {
    name: "Ankur",
    platform: "LinkedIn",
    text: "Learning through competition.",
    direction: "right",
  },
  {
    name: "Vanshika",
    platform: "LinkedIn",
    text: "Simple, sharp, competitive.",
    direction: "left",
  },
  {
    name: "Aman",
    platform: "LinkedIn",
    text: "Where Practice meets pressure.",
    direction: "right",
  },
  {
    name: "Lovepreet",
    platform: "LinkedIn",
    text: "Everything feels instant and focused.",
    direction: "left",
  },
];

const ScrollReview = ({ scrollRef }) => {
  const sectionRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (!scrollRef?.current) return;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, i) => {
        if (!row) return;

        const config = reviews[i];
        const isLeft = config.direction === "left";

        // Reduced movement range slightly (20 instead of 30)
        // so it feels less chaotic and more readable.
        const moveAmount = 25;

        gsap.fromTo(
          row,
          {
            xPercent: isLeft ? moveAmount : -moveAmount,
          },
          {
            xPercent: isLeft ? -moveAmount : moveAmount,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              scroller: scrollRef.current,

              // --- TIMING FIX ---
              // "top 85%" -> Start when the top of the text is 85% down the viewport
              // (It waits until it is well inside the screen before moving).
              start: "top 85%",

              // "bottom 15%" -> End when the bottom of the text is 15% from the top
              // (Stops moving just before it leaves the screen).
              end: "bottom 15%",

              scrub: 1, // Adds a little weight/delay to the movement
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [scrollRef]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-40 overflow-hidden flex flex-col gap-40"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[#F2613F] rounded-full blur-[150px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {reviews.map((review, i) => {
        return (
          <div
            key={i}
            className="w-full flex justify-center items-center relative"
          >
            <div
              ref={(el) => (rowsRef.current[i] = el)}
              className="flex flex-col items-start min-w-max"
            >
              {/* Badge */}
              <div
                className={`
                  mb-4 px-4 py-1 
                  bg-(--c4) text-white
                  text-sm md:text-xl font-bold uppercase tracking-wider
                  transform -skew-x-12 origin-bottom-left
                  ml-4 md:ml-10
                `}
              >
                {review.name}{" "}
                <span className="opacity-60 text-xs normal-case mx-1">via</span>{" "}
                {review.platform}
              </div>

              {/* Text */}
              <h2 className="text-[10vw] md:text-[8vw] leading-[0.9] font-black text-white whitespace-nowrap uppercase tracking-tighter opacity-90">
                "{review.text}"
              </h2>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ScrollReview;
