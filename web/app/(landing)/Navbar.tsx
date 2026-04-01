"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#chat-section", label: "Test", active: true },
  { href: "#pricing", label: "Precios", active: false },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-xl shadow-indigo-500/5"
      style={{ borderBottom: "1px solid rgba(79,70,229,0.08)" }}
    >
      <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-screen-xl mx-auto h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-headline font-extrabold tracking-tight text-on-background text-xl"
          onClick={() => setOpen(false)}
        >
          <Sparkles className="w-5 h-5 text-primary fill-primary" />
          LumIA
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map(({ href, label, active }) => (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "text-primary font-bold text-sm border-b-2 border-primary pb-0.5"
                  : "text-on-surface-variant font-medium text-sm hover:text-primary transition-colors"
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="bg-primary text-[#64748B] hover:text-[#FFFFFF] px-5 py-2 rounded-full text-sm font-bold hover:bg-[#4F46E5] transition-all active:scale-95"
          >
            Ingresar
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? (
              <X className="w-5 h-5 text-on-surface" />
            ) : (
              <Menu className="w-5 h-5 text-on-surface" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
        style={{ borderTop: open ? "1px solid rgba(79,70,229,0.08)" : "none" }}
      >
        <nav className="flex flex-col px-6 py-4 gap-1 bg-white/95 backdrop-blur-md">
          {NAV_LINKS.map(({ href, label, active }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`py-3 text-base font-semibold rounded-xl px-3 transition-colors ${
                active
                  ? "text-primary bg-primary/5"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
