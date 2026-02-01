"use client";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export const FloatingNav = ({ navItems, className }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  const hasUserScrolled = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      hasUserScrolled.current = true;
    };
    window.addEventListener("scroll", onScroll, { once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", () => {
    if (!hasUserScrolled.current) return;

    const currentScrollY = window.scrollY;
    const direction = currentScrollY - lastScrollY.current;

    if (currentScrollY < 50) {
      setVisible(true);
    } else if (direction < 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }

    lastScrollY.current = currentScrollY;
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "flex gap-4 fixed top-10 mt-10 inset-x-0 mx-auto max-w-fit rounded-full bg-white dark:bg-black border border-transparent dark:border-white/[0.2] shadow z-[5000] px-6 py-3 items-center",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <a
            key={`icon-${idx}`}
            href={navItem.link}
            className="text-neutral-600 dark:text-neutral-200 hover:text-black dark:hover:text-white transition"
          >
            <span className="text-xl">{navItem.icon}</span>
          </a>
        ))}

        <button className="ml-2 border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
          Login
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
