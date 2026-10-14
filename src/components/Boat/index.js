import { useEffect, useRef } from "react";
import Waves from "./Waves";
import "./boat.css";

// Scroll window, as a fraction of the viewport height, over which the boat
// travels from the bottom of the hero up to its docked spot under the navbar.
const MORPH_START = 0.12;
const MORPH_END = 0.62;

// Eases both ends of the journey so it neither starts nor stops abruptly.
const smoothstep = (t) => t * t * (3 - 2 * t);

const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

export default function BoatComponent() {
  const boatRef = useRef(null);

  useEffect(() => {
    const boat = boatRef.current;
    if (!boat) return undefined;

    const hero = boat.parentElement;
    let frame = null;

    const update = () => {
      frame = null;

      const viewport = window.innerHeight;
      const start = viewport * MORPH_START;
      const end = viewport * MORPH_END;
      const progress = smoothstep(
        clamp01((window.scrollY - start) / (end - start)),
      );

      // Bottom edge of the hero in viewport coordinates. The boat lives on a
      // fixed layer, so this is what keeps the wave pinned to the hero while
      // the hero is still on screen.
      const anchor = hero ? hero.getBoundingClientRect().bottom : viewport;

      boat.style.setProperty("--boat-progress", progress.toFixed(4));
      boat.style.setProperty("--boat-anchor", `${anchor.toFixed(1)}px`);

      // Kept as a styling hook only — the visuals are driven entirely by the
      // progress value above.
      boat.classList.toggle("boat-badge", progress > 0.5);
      boat.classList.toggle("boat-full", progress <= 0.5);
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={boatRef} className="boat boat-full">
      {/* The wide hero wave — fades out as the page scrolls. */}
      <div className="wave-wrapper">
        <Waves id="hero" />
      </div>

      {/* The circular badge and its own waves — fade in as the ship arrives. */}
      <div className="boat-ring">
        <Waves id="badge" />
      </div>

      {/* The ship travels between the two, and never fades. */}
      <img src="/img/boat.svg" alt="boat" className="boat-ship" />
    </div>
  );
}
