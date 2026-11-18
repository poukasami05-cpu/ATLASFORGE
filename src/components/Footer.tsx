import React from 'react';
import { ShieldCheck, Truck, MapPin, Leaf } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#F4F5F7] border-t border-slate-200 text-slate-600 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1E4D2B] flex items-center justify-center text-white font-bold text-xs font-serif-heading">
                AF
              </div>
              <span className="text-base font-bold text-[#14171A] font-serif-heading tracking-tight">
                Atlas<span className="text-[#1E4D2B]">Forge</span>
              </span>
            </div>
            <p className="text-slate-500 text-[12px] leading-relaxed font-sans-body">
              Nutrition sportive d'élite bio-inspirée. Formulation pure sans solvant, isolat natif 250g sous flacon noir protecteur et étiquette blanche intemporelle.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 font-serif-heading">Navigation</h4>
            <ul className="space-y-2 font-sans-body">
              <li>
                <button
                  onClick={() => onNavigate('product')}
                  className="hover:text-[#1E4D2B] transition-colors cursor-pointer"
                >
                  Protéine Musculaire 250g
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('collagen')}
                  className="hover:text-[#1E4D2B] transition-colors cursor-pointer"
                >
                  Collagen Marine 250g
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('megamass')}
                  className="hover:text-[#1E4D2B] transition-colors cursor-pointer"
                >
                  Mega Mass 125g
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('story')}
                  className="hover:text-[#1E4D2B] transition-colors"
                >
                  Notre Histoire Bio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-[#1E4D2B] transition-colors"
                >
                  Avis Athlètes Vérifiés
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('spaceseller')}
                  className="hover:text-[#1E4D2B] transition-colors"
                >
                  Partenariat Spaceseller.ma
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Fulfillment Spaceseller */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 font-serif-heading">Fulfillment Officiel</h4>
            <div className="space-y-2 text-[12px] font-sans-body">
              <p className="text-slate-700 font-semibold">Opéré au Maroc par :</p>
              <p className="text-[#1E4D2B] font-bold font-mono text-sm">spaceseller.ma</p>
              <p className="text-slate-500">
                Stockage thermorégulé, emballage certifié & livraison Cash-on-Delivery depuis le Hub de Bouskoura, Casablanca.
              </p>
            </div>
          </div>

          {/* Col 4: Conformité */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 font-serif-heading">Conformité & Pureté</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-500 font-sans-body">
              <li>· Certifié Bonnes Pratiques de Fabrication (BPF / GMP)</li>
              <li>· Conforme aux exigences sanitaires ONSSA Maroc</li>
              <li>· Zéro substance dopante (WADA / AMA)</li>
              <li className="pt-2 text-slate-700 font-medium">Service Client : contact@atlasforge.ma</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AtlasForge Sports Nutrition SARL. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Mentions Légales</span>
            <span>·</span>
            <span>Charte Éthique Bio</span>
            <span>·</span>
            <span className="text-[#1E4D2B] font-medium">Fulfillment certifié spaceseller.ma</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
