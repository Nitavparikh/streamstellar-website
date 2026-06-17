"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`nav-bar ${scrolled ? "scrolled" : ""}`} id="nav">
      <div className="nav-inner">
        <a href="/" className="nav-logo" aria-label="StreamStellar">
          <Logo variant="nav" />
        </a>

        <div className="hidden md:flex items-center gap-2">
          <nav className="nav-links" style={{ display: "flex", alignItems: "center" }} aria-label="Main navigation">
            <div className="nav-item-has-dropdown group">
              <a href="#services" className="nav-link flex items-center gap-1">
                Services
                <svg className="w-2 h-2 opacity-60 transition-transform group-hover:rotate-180" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <div className="nav-dropdown">
                {/* Column 1: Core Services */}
                <div className="flex flex-col gap-1">
                  <span className="dropdown-col-title">Core Services</span>
                  <a href="#services" className="dropdown-link">
                    <span className="dropdown-link-title">Product Visuals</span>
                  </a>
                  <a href="#services" className="dropdown-link">
                    <span className="dropdown-link-title">Interactive 3D</span>
                  </a>
                  <a href="#services" className="dropdown-link">
                    <span className="dropdown-link-title">WebAR Commerce</span>
                  </a>
                  <a href="#services" className="dropdown-link">
                    <span className="dropdown-link-title">Digital Twins</span>
                  </a>
                </div>

                {/* Column 2: Capabilities */}
                <div className="flex flex-col gap-1">
                  <span className="dropdown-col-title">Capabilities</span>
                  <a href="#services" className="dropdown-link">
                    <span className="dropdown-link-title">Lifestyle Renders</span>
                  </a>
                  <a href="#services" className="dropdown-link">
                    <span className="dropdown-link-title">Exploded Animations</span>
                  </a>
                  <a href="#pipeline" className="dropdown-link">
                    <span className="dropdown-link-title">CAD Pipeline</span>
                  </a>
                  <a href="#specs" className="dropdown-link">
                    <span className="dropdown-link-title">Tech Stack</span>
                  </a>
                </div>

                {/* Column 3: Visual Cards */}
                <div className="flex flex-col">
                  <span className="dropdown-col-title">Showcases</span>
                  <div className="dropdown-cards-grid">
                    <div className="dropdown-card" onClick={() => window.location.href = "#services"}>
                      <svg className="dropdown-card-bg" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                        <defs>
                          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                      </svg>
                      <span className="dropdown-card-title">Configurators</span>
                      <span className="dropdown-card-desc">Interactive real-time 3D styling.</span>
                    </div>

                    <div className="dropdown-card" onClick={() => window.location.href = "#services"}>
                      <svg className="dropdown-card-bg" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" />
                      </svg>
                      <span className="dropdown-card-title">AR Commerce</span>
                      <span className="dropdown-card-desc">Deploy assets to mobile WebAR.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a href="#pipeline" className="nav-link">Pipeline</a>
            <a href="#specs" className="nav-link">Technology</a>
            <a href="/viewer" className="nav-link">Viewer</a>
            <a href="#contact" className="nav-link">Inquire</a>
          </nav>

          <div className="nav-actions" style={{ display: "block" }}>
            <a href="#contact" className="btn-nav">Get Started</a>
          </div>
        </div>

        <button
          className={`nav-mobile-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`nav-mobile-menu ${menuOpen ? "open" : ""}`}
        id="mobileMenu"
        aria-hidden={!menuOpen}
      >
        <a href="#services" className="nav-link" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="#pipeline" className="nav-link" onClick={() => setMenuOpen(false)}>Pipeline</a>
        <a href="#specs" className="nav-link" onClick={() => setMenuOpen(false)}>Technology</a>
        <a href="/viewer" className="nav-link" onClick={() => setMenuOpen(false)}>Viewer</a>
        <a href="#contact" className="nav-link" onClick={() => setMenuOpen(false)}>Inquire</a>
        <a href="#contact" className="btn-primary btn-full" onClick={() => setMenuOpen(false)}>Get Started</a>
      </div>
    </header>
  );
}
