"use client";

import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner footer-inner">
        <div className="footer-brand">
          <a href="/" className="nav-logo" aria-label="StreamStellar">
            <Logo variant="footer" />
          </a>
          <p className="footer-tagline">High-performance 3D asset engineering.</p>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <span className="footer-col-head">Capability</span>
            <a href="#services">3D Visuals</a>
            <a href="#services">Configurators</a>
            <a href="#services">WebAR</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-head">Architecture</span>
            <a href="#pipeline">CAD Pipeline</a>
            <a href="#specs">WebGL Specs</a>
            <a href="#specs">Draw Performance</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-head">Studio</span>
            <a href="#contact">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="section-inner footer-bottom-inner">
          <p>&copy; 2026 StreamStellar. All rights reserved.</p>
          <p>Engineered for the Web.</p>
        </div>
      </div>
    </footer>
  );
}
