import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

const PHRASES = [
  "Agentic Systems",
  "Production Infrastructure",
  "AI-Powered Products",
  "Developer Tooling",
];

const LONGEST = PHRASES.reduce((a, b) => (a.length >= b.length ? a : b));

export default function Hero() {
  const [displayed, setDisplayed] = useState("");
  const state = useRef({ phraseIndex: 0, deleting: false });

  useEffect(() => {
    const { phraseIndex, deleting } = state.current;
    const target = PHRASES[phraseIndex];

    if (!deleting) {
      if (displayed.length < target.length) {
        const timeout = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          60,
        );
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          state.current.deleting = true;
          setDisplayed((d) => d.slice(0, -1));
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayed.length > 0) {
        const timeout = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          30,
        );
        return () => clearTimeout(timeout);
      } else {
        state.current.deleting = false;
        state.current.phraseIndex = (phraseIndex + 1) % PHRASES.length;
        const timeout = setTimeout(
          () => setDisplayed(PHRASES[state.current.phraseIndex].slice(0, 1)),
          60,
        );
        return () => clearTimeout(timeout);
      }
    }
  }, [displayed]);

  return (
    <section className={styles.hero} id="hero">
      <div className={`container ${styles.content}`}>
        <h1 className={styles.heading}>
          <span>Build &amp; Ship</span>
          <br />
          <span className={styles.typedWrap}>
            <span className={styles.sizer} aria-hidden="true">
              {LONGEST}
            </span>
            <span className={styles.typed}>
              {displayed}
              <span className={styles.cursor}>|</span>
            </span>
          </span>
        </h1>
        <p className={styles.sub}>
          We design, build, and operate AI-driven software products &mdash; from
          prototype to production fleet.
        </p>
        <div className={styles.buttons}>
          <a href="#portfolio" className="btn btn-primary">
            See Our Work
          </a>
          <a href="#contact" className="btn btn-outline">
            Start a Conversation
          </a>
        </div>
      </div>
    </section>
  );
}
