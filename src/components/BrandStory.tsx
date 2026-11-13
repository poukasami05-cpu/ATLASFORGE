import React from 'react';
import { Mountain, Leaf, Shield, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="story" className="py-20 bg-[#F9F9FB] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#1E4D2B] uppercase mb-3">
            <Leaf className="w-3.5 h-3.5" />
            <span>BIO & PURE SPORTS NUTRITION</span>
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14171A] font-serif-heading tracking-tight text-balance">
            Née de la Pureté de l'Atlas. Forgée pour l'Excellence Athlétique.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-sans-body">
            AtlasForge est née d’une conviction sans compromis : la nutrition sportive d’élite doit s'harmoniser avec la pureté biologique de la nature. Pas d'agents de charge, pas d'édulcorants de synthèse, seulement la plus pure extraction peptidique.
          </p>
        </div>

        {/* 3 Core Philosophical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#1E4D2B]/10 border border-[#1E4D2B]/20 flex items-center justify-center text-[#1E4D2B] mb-5">
              <Mountain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#14171A] font-serif-heading mb-2">
              Lait Natif de Pâturage
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-sans-body">
              Notre lactosérum n'est jamais un sous-produit fromager chauffé ou traité avec des enzymes coagulantes. Nous extrayons directement nos protéines à partir de lait liquide frais issu d'élevages respectueux en pâturage durable.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#1E4D2B]/10 border border-[#1E4D2B]/20 flex items-center justify-center text-[#1E4D2B] mb-5">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#14171A] font-serif-heading mb-2">
              Clean Label Sans Solvant
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-sans-body">
              Une charte drastique : zéro sucralose, zéro aspartame, zéro huile de palme et zéro colorant azoïque. L'aromatisation repose uniquement sur des fèves de cacao brut, de véritables gousses de vanille et du matcha purifié.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#1E4D2B]/10 border border-[#1E4D2B]/20 flex items-center justify-center text-[#1E4D2B] mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#14171A] font-serif-heading mb-2">
              Format Nomade 250g
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-sans-body">
              Pourquoi des seaux géants de 2kg qui s'oxydent après quelques ouvertures ? Notre flacon noir 250g assure 10 portions ultra-fraîches, préservées de la lumière et de l'humidité jusqu'au dernier shaker.
            </p>
          </div>
        </div>

        {/* Commitment Badge Strip */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <div className="text-2xl font-bold font-serif-heading text-[#1E4D2B]">100%</div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-0.5">Bio-Disponibilité</div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-2xl font-bold font-serif-heading text-[#1E4D2B]">0%</div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-0.5">Additifs Artificiels</div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-2xl font-bold font-serif-heading text-[#1E4D2B]">24h</div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-0.5">Livraison Express Maroc</div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-2xl font-bold font-serif-heading text-[#1E4D2B]">BPF / GMP</div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-0.5">Normes Pharmaceutiques</div>
          </div>
        </div>
      </div>
    </section>
  );
};
