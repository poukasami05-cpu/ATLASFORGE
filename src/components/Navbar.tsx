import React, { useState } from 'react';
import { ShoppingBag, Server, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/95 border-b border-slate-200/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-6 lg:px-8 py-3">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="text-left flex items-center gap-2 group whitespace-nowrap shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1E4D2B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#163a20] transition-colors shrink-0">
            <span className="font-serif-heading font-bold text-sm tracking-tighter">AF</span>
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#14171A] font-serif-heading">
            Atlas<span className="text-[#1E4D2B]">Forge</span>
          </span>
        </button>

        {/* Zone 2: Desktop Navigation (lg+ so tablet 768px-1023px never overflows) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs font-semibold text-slate-700 min-w-0">
          <button
            type="button"
            onClick={() => handleLinkClick('product')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] cursor-pointer ${
              activeSection === 'product' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            Protéine 250g
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('collagen')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] cursor-pointer ${
              activeSection === 'collagen' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            Collagen Marine
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('megamass')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] cursor-pointer ${
              activeSection === 'megamass' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            Mega Mass
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('pack-duo')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] cursor-pointer ${
              activeSection === 'pack-duo' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            <span>Pack Duo</span>
            <span className="text-[10px] bg-[#1E4D2B] text-white px-1.5 py-0.5 rounded-full font-mono uppercase leading-none">
              419 DH
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('story')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] cursor-pointer ${
              activeSection === 'story' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            Histoire Bio
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('reviews')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] cursor-pointer ${
              activeSection === 'reviews' ? 'text-[#1E4D2B] font-bold underline underline-offset-4' : ''
            }`}
          >
            Avis
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('spaceseller')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-[#1E4D2B] cursor-pointer ${
              activeSection === 'spaceseller' ? 'text-[#1E4D2B] font-bold' : ''
            }`}
          >
            <Server className="w-3.5 h-3.5 text-[#1E4D2B]" />
            <span>Spaceseller</span>
          </button>
        </nav>

        {/* Zone 3: Cart Button + Responsive Mobile/Tablet Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs font-bold text-white bg-[#14171A] hover:bg-black rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            aria-label={`Voir le panier (${cartItemCount} articles)`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">Panier</span>
            <span
              className={`text-[10px] font-extrabold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full tabular-nums ${
                cartItemCount > 0 ? 'bg-[#1E4D2B] text-white' : 'bg-slate-700 text-slate-200'
              }`}
            >
              {cartItemCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-[#1E4D2B] hover:border-[#1E4D2B]/40 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Menu Drawer (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => handleLinkClick('product')}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#1E4D2B] transition-colors cursor-pointer"
            >
              Protéine 250g
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('collagen')}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#1E4D2B] transition-colors cursor-pointer"
            >
              Collagen Marine
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('megamass')}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#1E4D2B] transition-colors cursor-pointer"
            >
              Mega Mass
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('pack-duo')}
              className="text-left px-3 py-2.5 rounded-xl bg-emerald-50 text-[#1E4D2B] font-bold flex items-center justify-between cursor-pointer"
            >
              <span>Pack Duo</span>
              <span className="text-[10px] bg-[#1E4D2B] text-white px-1.5 py-0.5 rounded-full font-mono">
                419 DH
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('story')}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#1E4D2B] transition-colors cursor-pointer"
            >
              Notre Histoire Bio
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('reviews')}
              className="text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#1E4D2B] transition-colors cursor-pointer"
            >
              Avis Clients
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('spaceseller')}
              className="col-span-2 sm:col-span-3 text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#1E4D2B] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Server className="w-3.5 h-3.5 text-[#1E4D2B]" />
              <span>Google Sheets &amp; Spaceseller.ma</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
