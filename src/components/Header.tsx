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
            width="36"
            height="36"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="128"
              height="128"
              rx="16"
              fill="var(--color-surface)"
            />
            <polyline
              points="24,104 24,24 48,60 72,24 72,104"
              stroke="var(--color-primary)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="104" r="4.5" fill="var(--color-primary)" />
            <circle cx="24" cy="24" r="4.5" fill="var(--color-primary)" />
            <circle cx="48" cy="60" r="4.5" fill="var(--color-primary)" />
            <circle cx="72" cy="24" r="4.5" fill="var(--color-primary)" />
            <circle cx="72" cy="104" r="4.5" fill="var(--color-primary)" />
            <polyline
              points="84,104 106,24 128,104"
              stroke="var(--color-text-muted)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="92"
              y1="68"
              x2="120"
              y2="68"
              stroke="var(--color-text-muted)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="84" cy="104" r="4.5" fill="var(--color-text-muted)" />
            <circle cx="106" cy="24" r="4.5" fill="var(--color-text-muted)" />
            <circle cx="128" cy="104" r="4.5" fill="var(--color-text-muted)" />
            <circle cx="92" cy="68" r="4.5" fill="var(--color-text-muted)" />
            <circle cx="120" cy="68" r="4.5" fill="var(--color-text-muted)" />
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
