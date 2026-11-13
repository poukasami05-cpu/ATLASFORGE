import React from 'react';
import { Star, CheckCircle, Quote, ThumbsUp } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  date: string;
  verifiedPurchase: boolean;
  flavor: string;
  comment: string;
}

const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    name: 'Yassine Bennani',
    role: 'Coach Fitness & Athlète Haltérophilie',
    city: 'Casablanca',
    rating: 5,
    date: 'Il y a 3 jours',
    verifiedPurchase: true,
    flavor: 'Chocolat Noir Brut',
    comment:
      'La miscibilité de cette Protéine Musculaire 250g est immédiate, même dans de l’eau glacée sans boule mélangeuse. Zéro ballonnement, goût de vrai cacao non écœurant. Le format 250g garde la poudre toujours sèche.',
  },
  {
    id: 'rev-2',
    name: 'Dr. Salma Kadiri',
    role: 'Médecin du Sport & Triathlète',
    city: 'Rabat',
    rating: 5,
    date: 'Il y a 1 semaine',
    verifiedPurchase: true,
    flavor: 'Vanille Bourbon',
    comment:
      'En tant que médecin du sport, j’analyse systématiquement les certificats d’analyse. Avec 93% d’isolat natif CFM et 0g de sucre ajouté, c’est exactement ce qu’il faut pour reconstruire les fibres musculaires sans surcharger le foie.',
  },
  {
    id: 'rev-3',
    name: 'Mehdi Tazi',
    role: 'Préparateur Physique & Boxeur',
    city: 'Marrakech',
    rating: 5,
    date: 'Il y a 2 semaines',
    verifiedPurchase: true,
    flavor: 'Matcha Uji & Menthe',
    comment:
      'Colis reçu à Marrakech en moins de 48h grâce au partenariat avec spaceseller.ma. Paiement effectué en espèces à la livraison sans aucun souci. Produit d’une élégance rare et d’une efficacité redoutable.',
  },
  {
    id: 'rev-4',
    name: 'Amina Radi',
    role: 'Athlète CrossFit & Hyrox',
    city: 'Tanger',
    rating: 5,
    date: 'Il y a 2 semaines',
    verifiedPurchase: true,
    flavor: 'Chocolat Noir Brut',
    comment:
      'L’assimilation est ultra rapide après mes WODs. On sent la qualité supérieure de l’isolat bio. Le packaging noir avec l’étiquette blanche et le logo vert forêt est sublime sur l’étagère.',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-[#FAFAFA] border-t border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono font-bold text-[#1E4D2B] uppercase tracking-widest mb-1.5">
              TÉMOIGNAGES ATHLÉTIQUES VÉRIFIÉS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#14171A] font-serif-heading tracking-tight">
              Adoptée par l'Élite Sportive au Maroc
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl font-sans-body">
              Retour d’expérience de préparateurs physiques, coachs et athlètes qui intègrent la Protéine Musculaire 250g à leur routine quotidienne.
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs shrink-0">
            <div className="text-3xl font-extrabold text-[#14171A] font-serif-heading">4.95</div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Basé sur 340+ commandes livrées au Maroc
              </div>
            </div>
          </div>
        </div>

        {/* 4 Review Cards in 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header of review */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#14171A] font-serif-heading">
                      {rev.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-sans-body">
                      {rev.role} · <span className="font-semibold text-slate-700">{rev.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>

                {/* Flavor Tag & Date */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mb-3">
                  <span className="bg-[#1E4D2B]/10 text-[#1E4D2B] font-bold px-2 py-0.5 rounded">
                    Saveur: {rev.flavor}
                  </span>
                  <span>·</span>
                  <span>{rev.date}</span>
                </div>

                {/* Review Body */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans-body italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Verified badge */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-[#1E4D2B] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Achat Vérifié & Livré par spaceseller.ma</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Recommandé</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
