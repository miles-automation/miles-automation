import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>
          <svg
            className={styles.logoMark}
            width="48"
            height="36"
            viewBox="0 0 160 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* [ bracket */}
            <polyline
              points="20,16 8,16 8,104 20,104"
              stroke="var(--color-text)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* M */}
            <polyline
              points="36,96 36,24 60,60 84,24 84,96"
              stroke="var(--color-text)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* A */}
            <polyline
              points="96,96 114,24 132,96"
              stroke="var(--color-text)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="103"
              y1="68"
              x2="125"
              y2="68"
              stroke="var(--color-text)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* ] bracket */}
            <polyline
              points="140,16 152,16 152,104 140,104"
              stroke="var(--color-text)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.logoText}>Miles Automation</span>
        </a>

        <button
          className={styles.toggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
