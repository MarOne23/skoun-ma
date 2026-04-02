import Link from "next/link";
import { MapPin } from "lucide-react";

const footerLinks = [
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "CGU", href: "/cgu" },
  { label: "Politique de confidentialité", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-accent fill-accent" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Skoun<span className="text-accent">.ma</span>
              </span>
            </div>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
              L&apos;immobilier marocain, simplifié.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-white/80">
                Annonces gratuites • Sans frais d&apos;agence
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/40 text-xs">
          © 2026 Skoun.ma — Tous droits réservés. Plateforme indépendante, sans frais d&apos;agence.
        </div>
      </div>
    </footer>
  );
}
