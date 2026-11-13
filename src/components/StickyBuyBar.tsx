/**
 * AtlasForge Sports Nutrition - Sticky Conversion Bar (CRO Component)
 * Complies with the 15% Mobile Sticky Cap rule.
 * Persistent floating bar with product thumbnail, price, and instant 1-click COD checkout.
 */

import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { FlavorOption } from '../types';

interface StickyBuyBarProps {
  productPriceMAD: number;
  compareAtPriceMAD: number;
  activeFlavor: FlavorOption;
  onOpenCheckout: () => void;
}

export const StickyBuyBar: React.FC<StickyBuyBarProps> = ({
  productPriceMAD,
  compareAtPriceMAD,
  activeFlavor,
  onOpenCheckout,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 420px (past hero)
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > 420);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200/90 shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Product Info & Thumbnail */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FAF9F7] border border-slate-200 flex items-center justify-center p-0.5 shrink-0 shadow-xs">
            <img
              src="/assets/aistudio/image_789e9c1a.png"
              alt="AtlasForge Protéine Musculaire 250g"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate font-serif-heading">
                AtlasForge Protéine Musculaire 250g
              </h3>
              <span className="hidden md:inline-block text-[10px] font-mono bg-[#1E4D2B]/10 text-[#1E4D2B] font-bold px-2 py-0.2 rounded-full">
                {activeFlavor.name.split(' ')[0]}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5 font-sans-body">
              <span className="text-emerald-700 font-semibold">Tawssil 24h partout au Maroc</span>
              <span>·</span>
              <span>Paiement à la livraison (COD)</span>
            </p>
          </div>
        </div>

        {/* Pricing & High-Contrast Instant CTA */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="text-right">
            <div className="text-base sm:text-lg font-bold text-slate-900 font-serif-heading leading-tight tabular-nums">
              {productPriceMAD} MAD
            </div>
            {compareAtPriceMAD > productPriceMAD && (
              <div className="text-[10px] text-slate-400 line-through font-mono hidden xs:block">
                {compareAtPriceMAD} MAD
              </div>
            )}
          </div>

          <button
            onClick={onOpenCheckout}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#1E4D2B]/25 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Commander 250g</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </button>
        </div>
      </div>
    </div>
  );
};
