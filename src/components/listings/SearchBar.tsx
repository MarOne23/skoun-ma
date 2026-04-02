"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("ville", city);
    if (category) params.set("type", category);
    router.push(`/annonces?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
        <Search className="text-white/50 w-4 h-4 flex-shrink-0" />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ville, quartier..."
          className="flex-1 bg-transparent outline-none text-white placeholder-white/50 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="sm:w-48 bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none cursor-pointer"
      >
        <option value="" className="text-gray-800">Toutes catégories</option>
        <option value="vente" className="text-gray-800">Vente</option>
        <option value="location" className="text-gray-800">Location</option>
        <option value="estivale" className="text-gray-800">Location Estivale</option>
        <option value="colocation" className="text-gray-800">Colocation</option>
        <option value="commercial" className="text-gray-800">Locaux Commerciaux</option>
        <option value="neuf" className="text-gray-800">Projets Neufs</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-accent hover:bg-accent-dark text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
      >
        Rechercher
      </button>
    </div>
  );
}
