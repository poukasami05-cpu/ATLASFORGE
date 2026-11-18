import React from 'react';
import { ArrowRight, Leaf, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';

interface HeroProps {
  onExploreProduct: () => void;
  onOpenSpaceseller: () => void;
  onOpenOrderModal: () => void;
  onExploreCollagen?: () => void;
  onExploreMegaMass?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProduct,
  onOpenSpaceseller,
  onOpenOrderModal,
  onExploreCollagen,
  onExploreMegaMass,
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-18 md:pb-24 bg-[#FAFAFA] overflow-hidden">
      {/* Soft botanical warm glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[#1E4D2B]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial & Copy */}
          <div className="lg:col-span-7">
            {/* Unboxed Brand Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#1E4D2B] mb-4 tracking-wider uppercase">
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" />
                <span>BIO-INSPIRED SPORTS NUTRITION</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>3 PRODUITS SIGNATURES</span>
              {onExploreMegaMass && (
                <button
                  onClick={onExploreMegaMass}
                  className="bg-emerald-100/80 hover:bg-emerald-200 text-[#1E4D2B] px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#1E4D2B]" />
                  <span>Nouveau : Mega Mass (Prise de Masse)</span>
                </button>
              )}
              {onExploreCollagen && (
                <button
                  onClick={onExploreCollagen}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Collagen Marine 250g</span>
                </button>
              )}
            </div>

            {/* Classic Serif Hero Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#14171A] font-serif-heading tracking-tight leading-[1.12] mb-6 text-balance">
              La Pureté de l'Isolat Natif. La Rigueur de l'Élite Athlétique.
            </h1>

            {/* Body Prose */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl font-sans-body">
              Découvrez <strong className="text-slate-900 font-bold">AtlasForge Protéine Musculaire 250g</strong> : un isolat de lactosérum natif filtré à froid sans solvant chimique ni sucre ajouté. Présentée dans notre flacon noir signature avec étiquette blanche et logo montagne vert forêt, elle est expédiée en 24h avec paiement à la livraison via <strong className="text-[#1E4D2B] font-bold">spaceseller.ma</strong>.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onOpenOrderModal}
                className="px-6 py-3.5 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Commander 250g · 299 DH</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreProduct}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Inspecter le Flacon 3D
              </button>

              <button
                onClick={onOpenSpaceseller}
                className="px-4 py-3.5 text-xs text-slate-600 hover:text-[#1E4D2B] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Fulfillment Spaceseller.ma</span>
                <span className="text-[#1E4D2B]">→</span>
              </button>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-7 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E4D2B]/10 flex items-center justify-center text-[#1E4D2B] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">24.2g Isolat CFM</p>
                  <p className="text-[11px] text-slate-500 font-sans-body">Extraction membranaire à froid</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E4D2B]/10 flex items-center justify-center text-[#1E4D2B] shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">24h Express & COD</p>
                  <p className="text-[11px] text-slate-500 font-sans-body">Paiement à la livraison au Maroc</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1E4D2B]/10 flex items-center justify-center text-[#1E4D2B] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Clean Label 0% Sucre</p>
                  <p className="text-[11px] text-slate-500 font-sans-body">Sans additifs de synthèse</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Official Product Bottle Packshot */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onClick={onExploreProduct}
              className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col items-center"
            >
              {/* Product Badge */}
              <div className="w-full flex items-center justify-between text-xs font-mono mb-2">
                <span className="bg-[#1E4D2B]/10 text-[#1E4D2B] font-bold px-2.5 py-1 rounded-full text-[11px]">
                  Flacon Signature 250g
                </span>
                <span className="text-slate-900 font-bold font-serif-heading text-sm">
                  299 MAD
                </span>
              </div>

              {/* Exact Uploaded Product Bottle */}
              <div className="relative w-full aspect-square flex items-center justify-center my-2 overflow-hidden">
                <img
                  src="/assets/aistudio/image_789e9c1a.png"
                  alt="AtlasForge Protéine Musculaire 250g - Flacon officiel"
                  className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Sub-label */}
              <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 font-serif-heading text-sm">
                    Protéine Musculaire
                  </p>
                  <p className="text-[11px] text-slate-500 font-sans-body">
                    مكمل غذائي عالي الجودة لبناء العضلات
                  </p>
                </div>
                <span className="text-[#1E4D2B] text-xs font-bold font-mono group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Voir en 3D</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
