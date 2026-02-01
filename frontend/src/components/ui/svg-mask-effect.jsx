"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const MaskContainer = ({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const updateMousePosition = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleMouseMove = (e) => updateMousePosition(e);

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const maskSize = isHovered ? revealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative h-screen", className)}
    >
      {/* Only show the masked cursor div when hovered */}
      {isHovered && (
        <motion.div
          className="absolute flex h-full w-full items-center justify-center bg-black text-6xl [mask-image:url(/mask.svg)] [mask-repeat:no-repeat] [mask-size:40px] dark:bg-white"
          animate={{
            maskPosition: `${mousePosition.x - maskSize / 2}px ${
              mousePosition.y - maskSize / 2
            }px`,
            maskSize: `${maskSize}px`,
          }}
          transition={{
            maskSize: { duration: 0.3, ease: "easeInOut" },
            maskPosition: { duration: 0.15, ease: "linear" },
          }}
        >
          <div className="absolute inset-0 z-0 h-full w-full bg-black opacity-50 dark:bg-white" />
          <div className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-bold">
            {children}
          </div>
        </motion.div>
      )}

      <div className="flex h-full w-full items-center justify-center">
        {revealText}
      </div>
    </motion.div>
  );
};
