export default function PublierPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-primary mb-2">Publier une annonce</h1>
      <p className="text-gray-500 mb-8">Gratuit, rapide et sans frais d&apos;agence.</p>
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Type d&apos;annonce</label>
          <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
            <option>Vente</option>
            <option>Location</option>
            <option>Location Estivale</option>
            <option>Colocation</option>
            <option>Local Commercial</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Titre</label>
          <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Ex: Appartement 3 pièces, Casablanca" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ville</label>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Casablanca" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Prix (DH)</label>
            <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea rows={5} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Décrivez votre bien..." />
        </div>
        <button className="w-full bg-accent text-white font-semibold py-3 rounded-lg hover:bg-accent-dark transition-colors">
          Publier l&apos;annonce
        </button>
      </div>
    </div>
  );
}
