"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";

const navLinks = [
  { label: "Parcourir", href: "/annonces" },
  { label: "Vendre / Louer", href: "/publier" },
  { label: "S'identifier", href: "/login" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-accent fill-accent" />
            </div>
            <span className="text-xl font-extrabold text-primary tracking-tight">
              Skoun<span className="text-accent">.ma</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-primary/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/publier"
              className="bg-accent hover:bg-accent-dark text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-accent/20"
            >
              Publier une annonce
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 shadow-lg">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/publier"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center bg-accent hover:bg-accent-dark text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors"
          >
            Publier une annonce
          </Link>
        </div>
      )}
    </header>
  );
}
