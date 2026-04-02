import Link from "next/link";
import { Search, Home, Building2, Umbrella, Users, Store, Sparkles, CheckCircle, Shield, Zap } from "lucide-react";

const categories = [
  { label: "Vente", icon: Home, href: "/annonces?type=vente", desc: "Achetez votre bien" },
  { label: "Location", icon: Building2, href: "/annonces?type=location", desc: "Trouvez à louer" },
  { label: "Location Estivale", icon: Umbrella, href: "/annonces?type=estivale", desc: "Vacances au Maroc" },
  { label: "Colocation", icon: Users, href: "/annonces?type=colocation", desc: "Partagez un logement" },
  { label: "Locaux Commerciaux", icon: Store, href: "/annonces?type=commercial", desc: "Bureaux & commerces" },
  { label: "Projets Neufs", icon: Sparkles, href: "/annonces?type=neuf", desc: "Programmes immobiliers" },
];

const valueProps = [
  {
    icon: CheckCircle,
    title: "100% Gratuit",
    desc: "Publiez et consultez toutes les annonces sans payer un dirham.",
  },
  {
    icon: Shield,
    title: "Sans agence",
    desc: "Traitez directement avec les propriétaires. Zéro commission.",
  },
  {
    icon: Zap,
    title: "Simple & rapide",
    desc: "Publiez en moins de 3 minutes, trouvez en quelques clics.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #D4A853 0%, transparent 50%), radial-gradient(circle at 80% 20%, #2D6A4F 0%, transparent 50%)" }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-24 text-center">
          <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-accent/30">
            🇲🇦 N°1 de l&apos;immobilier marocain en ligne
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Trouvez votre{" "}
            <span className="text-accent">chez-vous</span>
            {" "}au Maroc
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Des milliers d&apos;annonces gratuites, sans frais d&apos;agence.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-100">
              <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Ville, quartier..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder-gray-400 text-sm"
              />
            </div>
            <select className="flex-1 px-4 py-2 rounded-xl border border-gray-100 text-sm text-gray-700 bg-white outline-none cursor-pointer">
              <option value="">Toutes catégories</option>
              <option value="vente">Vente</option>
              <option value="location">Location</option>
              <option value="estivale">Location Estivale</option>
              <option value="colocation">Colocation</option>
              <option value="commercial">Locaux Commerciaux</option>
              <option value="neuf">Projets Neufs</option>
            </select>
            <Link
              href="/annonces"
              className="bg-accent hover:bg-accent-dark text-white font-bold px-8 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              Rechercher
            </Link>
          </div>

          <p className="text-white/50 text-sm mt-5">
            Casablanca · Rabat · Marrakech · Tanger · Fès · Agadir
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">Catégories</h2>
          <p className="text-gray-500">Explorez par type de bien</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all flex flex-col items-center text-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{cat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Skoun.ma */}
      <section className="bg-primary/5 border-y border-primary/10">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">Pourquoi Skoun.ma&nbsp;?</h2>
            <p className="text-gray-500">L&apos;immobilier marocain comme il devrait être</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((vp) => {
              const Icon = vp.icon;
              return (
                <div key={vp.title} className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{vp.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{vp.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Prêt à publier votre annonce&nbsp;?
        </h2>
        <p className="text-gray-500 mb-8">Gratuit, sans inscription préalable, en moins de 3 minutes.</p>
        <Link
          href="/publier"
          className="inline-block bg-accent hover:bg-accent-dark text-white font-bold px-10 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-accent/25"
        >
          Publier une annonce gratuitement
        </Link>
      </section>
    </div>
  );
}
