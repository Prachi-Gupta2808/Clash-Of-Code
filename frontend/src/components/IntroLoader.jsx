import { useEffect, useState } from "react";
import LetterGlitch from "./LetterGlitch";

export default function IntroLoader({ onFinish }) {
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    // start circle expansion after text is visible
    const t1 = setTimeout(() => setExpand(true), 2500);

    // remove loader completely
    const t2 = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className="intro-wrapper">
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
