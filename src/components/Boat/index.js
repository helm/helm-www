import { useState, useEffect } from "react";
import "./boat.css";

export default function BoatComponent() {
  const [isBadgeMode, setIsBadgeMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Switch to badge mode when scrolled down more than the viewport height
      const scrollPosition = window.scrollY;
      const triggerPoint = window.innerHeight * 0.7; // Trigger at 70% of viewport height

      setIsBadgeMode(scrollPosition > triggerPoint);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`boat ${isBadgeMode ? "boat-badge" : "boat-full"}`}>
      <img src="/img/boat.svg" alt="boat" className="boat-ship" />
      <div className="wave-wrapper">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(27,83,194,0.7)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(27,83,194,0.5)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(27,83,194,0.3)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="7"
              fill="rgba(27,83,194,1)"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
