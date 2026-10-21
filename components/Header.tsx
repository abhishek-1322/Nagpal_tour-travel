"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "./Icons";
import Logo from "./Logo";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#fleet", label: "Fleet" },
  { href: "/#destinations", label: "Destinations" },
  { href: "/gallery", label: "Tours & Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = alwaysSolid || scrolled || open;

  return (
    <header className={`site-header${solid ? " solid" : ""}`}>
      <div className="wrap">
        <a href="/#home" aria-label="Nagpal Tour & Travels home" style={{ textDecoration: "none" }}>
          <Logo id="lm-head" />
        </a>
        <nav className={`nav${open ? " open" : ""}`} id="nav">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="head-cta">
          <a className="head-phone" href={`tel:${site.phoneE164}`} aria-label={`Call ${site.phoneDisplay}`}>
            <span className="ic"><Icon name="phone" /></span>
            <span className="num">{site.phoneDisplay}</span>
          </a>
          <a className="btn btn-primary" href="/#book">Book a cab</a>
          <button className="menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen((o) => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
