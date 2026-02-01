import gsap from "gsap";
import { useEffect, useRef } from "react";

const GlobalCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
    });

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power3.out",
      });
    };

    const expandCursor = () => {
      gsap.to(cursor, {
        width: 40, // expanded size on click
        height: 40,
        duration: 0.2,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(cursor, {
            width: 25,
            height: 25,
            duration: 0.2,
            ease: "power3.out",
          });
        },
      });
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", expandCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", expandCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="global-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        backgroundColor: "rgba(255,255,255,0.8)",
        mixBlendMode: "difference",
        zIndex: 9999,
      }}
    />
  );
};

export default GlobalCursor;
