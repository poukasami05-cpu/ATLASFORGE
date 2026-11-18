import React from 'react';
import { ShoppingBag, Box, Server, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

interface NavbarProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount,
  onOpenCart,
  onNavigate,
  activeSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/95 border-b border-slate-200/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Brand Wordmark in Classic Serif */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left flex items-center gap-2.5 group whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1E4D2B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#163a20] transition-colors">
            <span className="font-serif-heading font-bold text-sm tracking-tighter">AF</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#14171A] font-serif-heading">
            Atlas<span className="text-[#1E4D2B]">Forge</span>
          </span>
        </button>

        {/* Zone 2: Concise navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-700">
          <button
            onClick={() => onNavigate('product')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] ${
              activeSection === 'product' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            Protéine 250g
          </button>
          <button
            onClick={() => onNavigate('collagen')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] ${
              activeSection === 'collagen' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            <span>Collagen Marine 250g</span>
          </button>
          <button
            onClick={() => onNavigate('megamass')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] ${
              activeSection === 'megamass' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            <span>Mega Mass</span>
          </button>
          <button
            onClick={() => onNavigate('pack-duo')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] ${
              activeSection === 'pack-duo' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            <span>Pack Duo</span>
            <span className="text-[10px] bg-[#1E4D2B] text-white px-1.5 py-0.2 rounded-full font-mono uppercase">
              419 DH
            </span>
          </button>
          <button
            onClick={() => onNavigate('story')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] ${
              activeSection === 'story' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            Notre Histoire Bio
          </button>
          <button
            onClick={() => onNavigate('reviews')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] ${
              activeSection === 'reviews' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            Avis Clients
          </button>
          <button
            onClick={() => onNavigate('spaceseller')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] ${
              activeSection === 'spaceseller' ? 'text-[#1E4D2B] font-bold' : ''
            }`}
          >
            <Server className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Fulfillment Spaceseller</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#14171A] hover:bg-black rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Voir le panier"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Panier</span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
                cartItemCount > 0 ? 'bg-[#1E4D2B] text-white' : 'bg-slate-700 text-slate-200'
              }`}
            >
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
