import { useEffect, useState } from "react";
import LetterGlitch from "./LetterGlitch";

export default function IntroLoader({ onFinish }) {
  const [expand, setExpand] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExpand(true), 2500);
    const t2 = setTimeout(() => setFadeOut(true), 3000);
    const t3 = setTimeout(() => onFinish(), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div className={`intro-wrapper${fadeOut ? " intro-fade-out" : ""}`}>
      {/* Glitch background */}
      <div className="glitch-bg">
        <LetterGlitch
          glitchColors={["#6a4424", "#e16614", "#ddaf6e", "#ffffff"]}
          glitchSpeed={150}
          centerVignette={false}
          outerVignette={false}
          smooth
        />
      </div>

      {/* Text */}
      <h1 className="intro-text">
        BUILDING YOUR <br /> FAVORITE SITE
      </h1>

      {/* Expanding white circle */}
      <div className={`circle ${expand ? "expand" : ""}`} />
    </div>
  );
}
