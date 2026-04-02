export default function ListingPage({ params }: { params: { slug: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-400">
          Photo principale
        </div>
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Appartement 3 pièces — Casablanca</h1>
              <p className="text-gray-500">Réf: {params.slug}</p>
            </div>
            <span className="text-2xl font-bold text-primary">2 500 DH/mois</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Beau appartement lumineux de 3 pièces situé au cœur de Casablanca. Proche de toutes commodités.
          </p>
        </div>
      </div>
    </div>
  );
}
