import React, { useState } from 'react';
import { Product, FlavorOption, CartItem } from '../types';
import {
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
  HeartHandshake,
  Package,
  Droplets,
  Star,
  ChevronRight,
  Leaf,
  Info,
  Clock,
  ExternalLink,
  Flame,
} from 'lucide-react';

interface CollagenSectionProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  onQuickCheckout: (item: CartItem) => void;
  onAddDuoBundle?: () => void;
}

export const CollagenSection: React.FC<CollagenSectionProps> = ({
  product,
  onAddToCart,
  onQuickCheckout,
  onAddDuoBundle,
}) => {
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorOption>(product.flavors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [purchaseOption, setPurchaseOption] = useState<'single' | 'duo'>('single');
  const [showNutrition, setShowNutrition] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'benefits' | 'science' | 'usage'>('benefits');
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const singlePrice = product.priceMAD; // 299 MAD
  const duoPrice = 499; // Duo Pack discount (299 + 299 = 598 -> 499 MAD)

  const handleAddToCart = () => {
    if (purchaseOption === 'duo' && onAddDuoBundle) {
      onAddDuoBundle();
    } else {
      onAddToCart({
        productId: product.id,
        flavorId: selectedFlavor.id,
        flavorName: selectedFlavor.name,
        weightLabel: product.weightLabel,
        priceMAD: singlePrice,
        quantity,
        purchaseType: 'one-time',
        imageFallback: '/assets/aistudio/Gemini_Generated_Image_kd9pffkd9pffkd9p_2bc27242.jpg',
      });
    }

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2400);
  };

  const handleInstantBuy = () => {
    if (purchaseOption === 'duo' && onAddDuoBundle) {
      onAddDuoBundle();
    } else {
      onQuickCheckout({
        productId: product.id,
        flavorId: selectedFlavor.id,
        flavorName: selectedFlavor.name,
        weightLabel: product.weightLabel,
        priceMAD: singlePrice,
        quantity,
        purchaseType: 'one-time',
        imageFallback: '/assets/aistudio/Gemini_Generated_Image_kd9pffkd9pffkd9p_2bc27242.jpg',
      });
    }
  };

  return (
    <section id="collagen" className="py-16 md:py-24 bg-[#FAF9F6] border-t border-slate-200/90 relative overflow-hidden">
      {/* Bio Watermark / Gradient background aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Top Eyebrow & Badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E4D2B] uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E4D2B] animate-pulse" />
              <Leaf className="w-3.5 h-3.5" />
              <span>NOUVEAUTÉ EXCLUSIVE ATLASFORGE · FORMULE MARINE BIO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14171A] font-serif-heading">
              Collagen Marine <span className="text-[#1E4D2B]">250g</span>
            </h2>
            <p className="text-sm sm:text-base font-semibold text-slate-700 mt-2 font-serif-heading">
              Ssiha dyal l-jild, l-ch3r, l-aðafr w l-mafasel f montaaj wahed !
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs text-slate-600 font-mono flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
              <span className="text-[#1E4D2B] font-bold">SKU SPACESELLER :</span>
              <span>{product.spacesellerSku}</span>
            </div>
            <div className="text-xs text-emerald-800 font-mono font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Livraison 24h Casablanca / Rabat</span>
            </div>
          </div>
        </div>

        {/* 2-Column High-Converting Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Premium Packshot Showcase with Hotspots & Benefits */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full h-[480px] sm:h-[560px] bg-gradient-to-b from-white via-[#F8FAF9] to-[#F0F4F2] rounded-2xl border border-slate-200 shadow-md flex items-center justify-center p-6 sm:p-10 group overflow-hidden">
              {/* Radial glow for clean white container */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,77,43,0.08)_0%,transparent_70%)] pointer-events-none" />

              {/* Verified Origin Watermark */}
              <div className="absolute top-5 left-5 z-20">
                <span className="text-[11px] font-mono font-bold text-[#1E4D2B] bg-white/95 px-3 py-1 rounded-xl border border-slate-200 shadow-xs backdrop-blur-xs flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>100% PEPTIDES DE COLLAGÈNE HYDROLYSÉ</span>
                </span>
              </div>

              {/* Stock Badge Top Right */}
              <div className="absolute top-5 right-5 z-20">
                <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 shadow-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Stock limité Bouskoura</span>
                </span>
              </div>

              {/* Main Official Product Packshot */}
              <img
                src="/assets/aistudio/Gemini_Generated_Image_kd9pffkd9pffkd9p_2bc27242.jpg"
                alt="AtlasForge Collagen Marine 250g - Flacon blanc et logo vert"
                className="max-h-[88%] max-w-[92%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Interactive Inspection Hotspots */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm backdrop-blur-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E4D2B]" />
                  <span className="font-semibold text-slate-900 font-serif-heading">Flacon Blanc 250g Anti-Humidité</span>
                  <span className="text-slate-300 font-mono">·</span>
                  <span className="text-[#1E4D2B] font-mono text-[11px] font-bold">كولاجين بحري متحلل</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setActiveHotspot(
                        activeHotspot === 'absorption'
                          ? null
                          : 'Micro-peptides < 2000 Daltons : franchissent la barrière intestinale en moins de 15 minutes pour nourrir directement les chondrocytes et fibroblastes.'
                      )
                    }
                    className="text-[11px] font-semibold text-[#1E4D2B] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    ✦ Absorption &lt; 2000 Da
                  </button>
                  <button
                    onClick={() =>
                      setActiveHotspot(
                        activeHotspot === 'taste'
                          ? null
                          : 'Technologie de désodorisation enzymatique naturelle : zéro goût de poisson, miscibilité 100% limpide dans l’eau froide, café ou jus.'
                      )
                    }
                    className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    ✦ Zéro Arrière-Goût
                  </button>
                </div>
              </div>

              {/* Hotspot Floating Explainer */}
              {activeHotspot && (
                <div className="absolute bottom-16 left-6 right-6 z-30 p-3.5 bg-white/98 border border-[#1E4D2B]/40 rounded-xl shadow-xl text-xs text-slate-800 backdrop-blur-md animate-fade-in">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-relaxed">{activeHotspot}</p>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="text-slate-400 hover:text-slate-900 text-xs font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4 Pillars of Persuasion Cards (Darija + Scientific Authority) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1E4D2B] mx-auto flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-serif-heading">Mafasel & Awtar</h4>
                <p className="text-[10px] text-slate-500 leading-tight">Soulagement des genoux & cartilages sportifs.</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1E4D2B] mx-auto flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-serif-heading">Nadhara dyal L-Jild</h4>
                <p className="text-[10px] text-slate-500 leading-tight">Élasticité cutanée, hydratation & anti-rides.</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1E4D2B] mx-auto flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-serif-heading">Ch3r & Aðafr</h4>
                <p className="text-[10px] text-slate-500 leading-tight">Kératine densifiée, moins de chute & casse.</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#1E4D2B] mx-auto flex items-center justify-center font-bold">
                  <Droplets className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-serif-heading">Peptides &lt;2000Da</h4>
                <p className="text-[10px] text-slate-500 leading-tight">Assimilation 1.5x plus rapide que le bovin.</p>
              </div>
            </div>

            {/* Verified Testimonial Quote */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-serif-heading font-bold text-slate-700">
                DR
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="text-[11px] text-slate-500 font-mono ml-1 font-bold">5.0 / 5 · Avis vérifié</span>
                </div>
                <p className="text-slate-700 italic">
                  « Kayen ferq kbir m3a l-collagène l-3adi. Had l-collagène marin kydoub f l-ma f 5 secondes bla ri7a. Mafasel dyali t7assno bzaf f l-musculation w l-bachra bdat kaban fiha l-élasticité. »
                </p>
                <p className="text-[11px] font-bold text-slate-900 mt-1 font-sans">
                  — Dr. Sophia K., Spécialiste Nutrition Sportive (Casablanca)
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Persuasive Conversion Box (PDP & Checkout trigger) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            {/* Title & Moroccan Pitch */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold tracking-wider text-[#1E4D2B] uppercase font-mono bg-[#1E4D2B]/10 px-2 py-0.5 rounded">
                  Collagène Marin Type I & III · 250g
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>32 vendus aujourd'hui</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#14171A] font-serif-heading">
                AtlasForge Collagen Marine
              </h1>

              <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-900 font-mono">4.96/5</span>
                <span className="text-slate-400 font-mono text-xs">·</span>
                <span className="text-xs text-slate-600">210+ sportifs satisfaits au Maroc</span>
              </div>
            </div>

            {/* Darija Marketing Hook */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border border-emerald-200/70 rounded-xl text-xs space-y-1.5">
              <p className="font-bold text-emerald-950 font-serif-heading text-sm">
                3lach Collagen Marine AtlasForge houwa l-khiyar l-awwal ?
              </p>
              <p className="text-slate-700 leading-relaxed font-sans-body">
                Kola dose fiha <strong className="text-emerald-950 font-bold">9.8g dyal collagène pur</strong> extrait de poissons sauvages. Kysa3dek bach thmi mafasel dyalek mn l-ihtikak, t3awed trabet les tissus l-mousaba, w t3ti l-bachra dyalek muruna w chabab tabi3i.
              </p>
            </div>

            {/* Purchase Choice Selector: Single 250g vs DUO PACK (Cross-sell boost) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                Choisissez votre formule :
              </label>

              {/* Option 1: Single Jar 250g */}
              <div
                onClick={() => setPurchaseOption('single')}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  purchaseOption === 'single'
                    ? 'border-[#1E4D2B] bg-[#1E4D2B]/5 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      purchaseOption === 'single' ? 'border-[#1E4D2B]' : 'border-slate-300'
                    }`}
                  >
                    {purchaseOption === 'single' && <div className="w-2 h-2 rounded-full bg-[#1E4D2B]" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 font-serif-heading">
                      1x Collagen Marine (250g)
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Cure 25 jours · 1 scoop/jour
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#1E4D2B] font-mono tabular-nums">299 MAD</span>
                  <div className="text-[10px] text-slate-400 line-through">379 MAD</div>
                </div>
              </div>

              {/* Option 2: PACK DUO PERFORMANCE & BEAUTÉ (Protéine + Collagen) */}
              <div
                onClick={() => setPurchaseOption('duo')}
                className={`relative p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  purchaseOption === 'duo'
                    ? 'border-[#1E4D2B] bg-[#1E4D2B]/5 shadow-xs'
                    : 'border-amber-300/80 hover:border-amber-400 bg-amber-50/40'
                }`}
              >
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-600 to-[#1E4D2B] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider shadow-xs">
                  🔥 PACK DUO RECOMMANDÉ (-100 MAD)
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      purchaseOption === 'duo' ? 'border-[#1E4D2B]' : 'border-slate-300'
                    }`}
                  >
                    {purchaseOption === 'duo' && <div className="w-2 h-2 rounded-full bg-[#1E4D2B]" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 font-serif-heading">
                      Pack Duo : Protéine (250g) + Collagène (250g)
                    </p>
                    <p className="text-[11px] text-[#1E4D2B] font-semibold font-mono">
                      Muscles + Articulations & Peau · Livraison Gratuite
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#1E4D2B] font-mono tabular-nums">499 MAD</span>
                  <div className="text-[10px] text-slate-400 line-through">598 MAD</div>
                </div>
              </div>
            </div>

            {/* Flavor Selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                  Saveur du Collagène :
                </span>
                <span className="text-[11px] text-[#1E4D2B] font-semibold font-mono">
                  {selectedFlavor.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {product.flavors.map((flavor) => {
                  const isSelected = flavor.id === selectedFlavor.id;
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-[#1E4D2B] bg-[#1E4D2B]/5 ring-1 ring-[#1E4D2B]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                        style={{ backgroundColor: flavor.accentColor }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate font-serif-heading">
                          {flavor.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {flavor.id === 'collagen-neutre' ? 'Sans odeur' : '+ Vitamine C'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector for Single Purchase */}
            {purchaseOption === 'single' && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                  Quantité :
                </span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-black font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-black font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block font-mono">Total à régler au livreur :</span>
                <span className="text-xl font-extrabold text-[#14171A] font-mono tabular-nums">
                  {purchaseOption === 'duo' ? duoPrice : singlePrice * quantity} MAD
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-[#1E4D2B] bg-emerald-100/70 px-2.5 py-1 rounded-full font-mono">
                  {purchaseOption === 'duo' ? 'Livraison Gratuite' : 'Expédition 24h Spaceseller'}
                </span>
              </div>
            </div>

            {/* Moroccan Urgency Banner */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-amber-950 font-semibold font-sans">
                  Tawssil sari3 f l-Maghrib 24h/48h عبر <strong>spaceseller.ma</strong>
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#1E4D2B] font-mono bg-white px-2 py-0.5 rounded shadow-2xs shrink-0">
                Cash On Delivery
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleInstantBuy}
                className="w-full py-4 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>
                  {purchaseOption === 'duo'
                    ? 'Commander le Pack Duo · 499 MAD (COD)'
                    : `Commander Collagen Marine · ${singlePrice * quantity} MAD (COD)`}
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>
                  {addedNotice ? '✓ Ajouté au Panier !' : 'Ajouter au Panier AtlasForge'}
                </span>
              </button>
            </div>

            {/* Guarantee Checklist */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-sans">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>Paiement en espèces au livreur</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>Vérification colis avant paiement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>Collagène pur sans solvant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>Garantie résultat 30 jours</span>
              </div>
            </div>

            {/* Toggle Nutrition Facts */}
            <div className="pt-1">
              <button
                onClick={() => setShowNutrition(!showNutrition)}
                className="text-xs text-[#1E4D2B] hover:underline font-bold flex items-center gap-1 font-mono"
              >
                <Info className="w-3.5 h-3.5" />
                <span>
                  {showNutrition ? 'Masquer la fiche nutritionnelle' : 'Voir la composition analytique (10g / dose)'}
                </span>
              </button>

              {showNutrition && (
                <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 animate-fade-in font-mono">
                  <div className="flex justify-between font-bold border-b border-slate-200 pb-1 text-slate-800">
                    <span>Nutriment actif</span>
                    <span>Teneur / dose (10g)</span>
                  </div>
                  {product.nutritionFacts.map((fact, idx) => (
                    <div key={idx} className="flex justify-between py-0.5 text-slate-600 border-b border-slate-100 last:border-0">
                      <span>{fact.label}</span>
                      <span className="font-bold text-slate-900">{fact.amount}</span>
                    </div>
                  ))}
                  <div className="text-[10px] text-slate-500 pt-1 font-sans">
                    *Conseil d'utilisation : 1 doseur (10g) le matin ou après l'entraînement dans un grand verre d'eau, jus frais ou café.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
