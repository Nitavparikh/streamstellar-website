"use client";

import { useState } from "react";

export function FinalCta() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "validation-error" | "server-error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) {
      setStatus("validation-error");
      return;
    }
    setStatus("submitting");

    // FORMSPREE CONFIGURATION
    // 1. Once you click "Create Form" on Formspree, copy your Form ID (e.g. "mqkvpkyk")
    // 2. Replace the placeholder value below with your Form ID
    const FORMSPREE_FORM_ID: string = "d427c5dc-6dae-4a07-853a-6090e981bea1";

    // Simulation mode for local testing if the Form ID is not replaced yet
    if (FORMSPREE_FORM_ID === "YOUR_FORMSPREE_FORM_ID_HERE") {
      setTimeout(() => {
        setStatus("success");
        console.log("StreamStellar Form Simulation Success:", { name, email, company, message });
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
      }, 1000);
      return;
    }
    
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          company: company,
          message: message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        // Clear fields
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
      } else {
        setStatus("server-error");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus("server-error");
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-inner section-inner--narrow">
        <div className="contact-container glass-panel">
          <div className="contact-header">
            <span className="eyebrow">Start a project</span>
            <h2 className="contact-title">Ready to launch in 3D?</h2>
            <p className="contact-desc">
              Provide details about your project. Our team will prepare a custom interactive prototype within 3-5 business days. You can also reach us directly at{" "}
              <a href="mailto:partners@streamstellar.com" style={{ color: "inherit", textDecoration: "underline", opacity: 0.8 }}>
                partners@streamstellar.com
              </a>
              .
            </p>
          </div>

          <form className="contact-form" id="ctaForm" onSubmit={handleSubmit} noValidate>
            <div className="form-row-two">
              <div className="form-field">
                <label htmlFor="ctaName">Your Name</label>
                <input
                  type="text"
                  id="ctaName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="ctaEmail">Work Email</label>
                <input
                  type="email"
                  id="ctaEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="ctaCompany">Company &amp; Industry</label>
              <input
                type="text"
                id="ctaCompany"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Horizon Design — E-commerce"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="ctaMessage">Project Brief</label>
              <textarea
                id="ctaMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Briefly describe the products you want to visualize (e.g., modular furniture, surgical tools)..."
              />
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className="btn-primary btn-large"
                id="ctaSubmitBtn"
              >
                {status === "submitting" ? "Submitting..." : status === "success" ? "Submitted ✓" : "Submit Project Details"}
              </button>
            </div>

            <div className="form-status" id="ctaStatus" role="status" aria-live="polite">
              {status === "success" && (
                <span className="text-green" style={{ color: "var(--green)" }}>
                  ✓ Your project inquiry was received. We will be in touch!
                </span>
              )}
              {status === "validation-error" && (
                <span className="text-red" style={{ color: "var(--red)" }}>
                  ⚠ Please fill out all required fields.
                </span>
              )}
              {status === "server-error" && (
                <span className="text-red" style={{ color: "var(--red)" }}>
                  ⚠ Submission failed. Please try again or email us directly at partners@streamstellar.com.
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
