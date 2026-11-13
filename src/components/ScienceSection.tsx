import React from 'react';
import { Microscope, ShieldCheck, Award, Flame, Leaf } from 'lucide-react';

export const ScienceSection: React.FC = () => {
  return (
    <section id="science" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E4D2B] uppercase tracking-widest mb-1.5">
            <Microscope className="w-4 h-4" />
            <span>BIO-TECHNOLOGIE PHARMACEUTIQUE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#14171A] tracking-tight font-serif-heading">
            Extraction Membranaire Douce. Intégrité Peptidique Préservée.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed font-sans-body">
            Notre isolat natif est obtenu par micro-filtration céramique tangentielle à froid (CFM 0.1μm). Cette technologie préserve la structure tridimensionnelle des protéines et assure une bio-disponibilité cellulaire maximale sans dénaturation.
          </p>
        </div>

        {/* 2-Column Visual Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* Card 1: Lab Science */}
          <div className="bg-[#FAF9F7] border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs group">
            <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/atlasforge_whey_lab_quality_1794172662849.jpg"
                alt="Laboratoire de formulation bio et pureté de l'isolat AtlasForge"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#1E4D2B] font-bold">
                <span>FILTRATION CÉRAMIQUE 0.1μm</span>
                <span className="text-slate-600">PURETÉ 93.4%</span>
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 text-[#1E4D2B] text-xs font-bold uppercase tracking-wider mb-2">
                <Leaf className="w-4 h-4" />
                <span>Procédé Sans Chaleur Dénaturante</span>
              </div>
              <h3 className="text-xl font-bold text-[#14171A] mb-2 font-serif-heading">
                Micro-Filtration à Froid CFM
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-body">
                Les procédés industriels traditionnels utilisent des acides et des températures élevées qui dégradent les liaisons peptidiques. Notre filtration douce conserve les immunoglobulines et lactoferrines essentielles à l'immunité et à l'assimilation.
              </p>
            </div>
          </div>

          {/* Card 2: Athletic Performance */}
          <div className="bg-[#FAF9F7] border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs group">
            <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
              <img
                src="/src/assets/images/atlasforge_athletic_performance_1794172661038.jpg"
                alt="Athlète à l'entraînement utilisant l'isolat bio AtlasForge"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#1E4D2B] font-bold">
                <span>INDEX DE DIGESTIBILITÉ MAXIMAL</span>
                <span className="text-slate-600">RÉCUPÉRATION 20 MIN</span>
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 text-[#1E4D2B] text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4" />
                <span>Assimilation Rapide & Confort Digestif</span>
              </div>
              <h3 className="text-xl font-bold text-[#14171A] mb-2 font-serif-heading">
                Zéro Ballonnement, 100% Puissance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-body">
                En réduisant le taux de lactose à moins de 0.2% et en éliminant les graisses résiduelles, la digestion s'effectue en douceur. Vous profitez d'une recharge rapide en acides aminés sans pesanteur gastrique.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Quantitative Proof Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-xl shadow-xs">
            <div className="text-3xl font-bold text-[#1E4D2B] font-mono tabular-nums mb-1">
              93.4<span className="text-lg font-bold">%</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 font-serif-heading">
              Pureté Protéique
            </h4>
            <p className="text-[12px] text-slate-600 font-sans-body">
              Analyse par chromatographie HPLC attestant d'une teneur native sans agents de charge.
            </p>
          </div>

          <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-xl shadow-xs">
            <div className="text-3xl font-bold text-[#1E4D2B] font-mono tabular-nums mb-1">
              0.00<span className="text-lg font-bold">g</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 font-serif-heading">
              Sucre Ajouté
            </h4>
            <p className="text-[12px] text-slate-600 font-sans-body">
              Pureté totale adaptée aux programmes de définition musculaire et de sèche exigeante.
            </p>
          </div>

          <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-xl shadow-xs">
            <div className="text-3xl font-bold text-[#1E4D2B] font-mono tabular-nums mb-1">
              5.6<span className="text-lg font-bold">g</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 font-serif-heading">
              BCAA Natifs 4:1:1
            </h4>
            <p className="text-[12px] text-slate-600 font-sans-body">
              Riche en L-Leucine végétale pour stimuler la synthèse des protéines musculaires.
            </p>
          </div>

          <div className="p-6 bg-[#FAFAF8] border border-slate-200 rounded-xl shadow-xs">
            <div className="text-3xl font-bold text-[#1E4D2B] font-mono tabular-nums mb-1">
              &lt; 0.2<span className="text-lg font-bold">%</span>
            </div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 font-serif-heading">
              Lactose Résiduel
            </h4>
            <p className="text-[12px] text-slate-600 font-sans-body">
              Tolérance digestive optimale sans fermentation ni inconfort gastrique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
