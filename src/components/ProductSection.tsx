import React, { useState } from 'react';
import { Product, FlavorOption, CartItem } from '../types';
import { ThreeProductViewer } from './ThreeProductViewer';
import {
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  Leaf,
  Droplets,
  Zap,
  Box,
  Flame,
  ArrowRight,
  X,
  Package,
} from 'lucide-react';

interface ProductSectionProps {
  proteinProduct: Product;
  collagenProduct: Product;
  megaMassProduct: Product;
  packDuoProduct: Product;
  activeFlavor: FlavorOption;
  onFlavorChange: (flavor: FlavorOption) => void;
  onAddToCart: (item: CartItem) => void;
  onQuickCheckout: (item: CartItem) => void;
  onAddDuoBundle: () => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  proteinProduct,
  collagenProduct,
  megaMassProduct,
  packDuoProduct,
  activeFlavor,
  onFlavorChange,
  onAddToCart,
  onQuickCheckout,
  onAddDuoBundle,
}) => {
  const [collagenFlavor, setCollagenFlavor] = useState<FlavorOption>(collagenProduct.flavors[0]);
  const [megaMassFlavor, setMegaMassFlavor] = useState<FlavorOption>(megaMassProduct.flavors[0]);
  const [packFlavor, setPackFlavor] = useState<FlavorOption>(packDuoProduct.flavors[0]);
  const [proteinQty, setProteinQty] = useState<number>(1);
  const [collagenQty, setCollagenQty] = useState<number>(1);
  const [megaMassQty, setMegaMassQty] = useState<number>(1);
  const [show3dModal, setShow3dModal] = useState<boolean>(false);
  const [proteinAddedNotice, setProteinAddedNotice] = useState<boolean>(false);
  const [collagenAddedNotice, setCollagenAddedNotice] = useState<boolean>(false);
  const [megaMassAddedNotice, setMegaMassAddedNotice] = useState<boolean>(false);
  const [packAddedNotice, setPackAddedNotice] = useState<boolean>(false);

  const handleAddProtein = () => {
    onAddToCart({
      productId: proteinProduct.id,
      flavorId: activeFlavor.id,
      flavorName: activeFlavor.name,
      weightLabel: proteinProduct.weightLabel,
      priceMAD: proteinProduct.priceMAD,
      quantity: proteinQty,
      purchaseType: 'one-time',
      imageFallback: '/assets/aistudio/image_789e9c1a.png',
    });
    setProteinAddedNotice(true);
    setTimeout(() => setProteinAddedNotice(false), 2200);
  };

  const handleQuickBuyProtein = () => {
    onQuickCheckout({
      productId: proteinProduct.id,
      flavorId: activeFlavor.id,
      flavorName: activeFlavor.name,
      weightLabel: proteinProduct.weightLabel,
      priceMAD: proteinProduct.priceMAD,
      quantity: proteinQty,
      purchaseType: 'one-time',
      imageFallback: '/assets/aistudio/image_789e9c1a.png',
    });
  };

  const handleAddCollagen = () => {
    onAddToCart({
      productId: collagenProduct.id,
      flavorId: collagenFlavor.id,
      flavorName: collagenFlavor.name,
      weightLabel: collagenProduct.weightLabel,
      priceMAD: collagenProduct.priceMAD,
      quantity: collagenQty,
      purchaseType: 'one-time',
      imageFallback: '/assets/aistudio/Gemini_Generated_Image_kd9pffkd9pffkd9p_2bc27242.jpg',
    });
    setCollagenAddedNotice(true);
    setTimeout(() => setCollagenAddedNotice(false), 2200);
  };

  const handleQuickBuyCollagen = () => {
    onQuickCheckout({
      productId: collagenProduct.id,
      flavorId: collagenFlavor.id,
      flavorName: collagenFlavor.name,
      weightLabel: collagenProduct.weightLabel,
      priceMAD: collagenProduct.priceMAD,
      quantity: collagenQty,
      purchaseType: 'one-time',
      imageFallback: '/assets/aistudio/Gemini_Generated_Image_kd9pffkd9pffkd9p_2bc27242.jpg',
    });
  };

  const handleAddMegaMass = () => {
    onAddToCart({
      productId: megaMassProduct.id,
      flavorId: megaMassFlavor.id,
      flavorName: megaMassFlavor.name,
      weightLabel: megaMassProduct.weightLabel,
      priceMAD: megaMassProduct.priceMAD,
      quantity: megaMassQty,
      purchaseType: 'one-time',
      imageFallback: '/assets/aistudio/914166009_992279166760564_2026284814750205857_n_e33294fe.png',
    });
    setMegaMassAddedNotice(true);
    setTimeout(() => setMegaMassAddedNotice(false), 2200);
  };

  const handleQuickBuyMegaMass = () => {
    onQuickCheckout({
      productId: megaMassProduct.id,
      flavorId: megaMassFlavor.id,
      flavorName: megaMassFlavor.name,
      weightLabel: megaMassProduct.weightLabel,
      priceMAD: megaMassProduct.priceMAD,
      quantity: megaMassQty,
      purchaseType: 'one-time',
      imageFallback: '/assets/aistudio/914166009_992279166760564_2026284814750205857_n_e33294fe.png',
    });
  };

  const handleAddPackDuo = () => {
    onAddToCart({
      productId: packDuoProduct.id,
      flavorId: packFlavor.id,
      flavorName: packFlavor.name,
      weightLabel: packDuoProduct.weightLabel,
      priceMAD: packDuoProduct.priceMAD,
      quantity: 1,
      purchaseType: 'one-time',
      imageFallback: '/assets/atlasforge-pack-duo.jpg',
    });
    setPackAddedNotice(true);
    setTimeout(() => setPackAddedNotice(false), 2200);
  };

  const handleQuickBuyPackDuo = () => {
    onQuickCheckout({
      productId: packDuoProduct.id,
      flavorId: packFlavor.id,
      flavorName: packFlavor.name,
      weightLabel: packDuoProduct.weightLabel,
      priceMAD: packDuoProduct.priceMAD,
      quantity: 1,
      purchaseType: 'one-time',
      imageFallback: '/assets/atlasforge-pack-duo.jpg',
    });
  };

  return (
    <section id="product" className="py-16 md:py-24 bg-[#F5F5F7] border-t border-slate-200/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E4D2B] uppercase tracking-widest mb-1.5">
              <Leaf className="w-3.5 h-3.5" />
              <span>CATALOGUE OFFICIEL ATLASFORGE · NUTRITION BIO ATHLÉTIQUE 250G</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14171A] font-serif-heading">
              Catalogue Officiel &amp; Pack Duo
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-sans-body mt-2 max-w-2xl">
              Une gamme bio-athlétique complète : Protéine Musculaire (Isolat CFM), Collagen Marine, Mega Mass (5-en-1) et notre Pack Duo Vital Boost &amp; Collagen à 419 MAD.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-800 font-bold">Fulfillment Spaceseller.ma</span>
            <span className="text-slate-300">·</span>
            <span className="text-[#1E4D2B] font-bold">Hub Bouskoura 24h</span>
          </div>
        </div>

        {/* 1. Fitness Athlete Visual Context Banner */}
        <div className="mb-12 relative rounded-3xl overflow-hidden border border-slate-300/80 shadow-xl bg-slate-900 group">
          <div className="relative aspect-[21/9] min-h-[280px] sm:min-h-[380px] w-full overflow-hidden">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_8zyd998zyd998zyd.jpg"
              alt="AtlasForge Athlete Visual Context - Protéine Musculaire & Collagen Marine"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Gradient Vignette to enhance text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

            {/* Overlaid Headline & Live Badges */}
            <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10 text-white">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-[#1E4D2B]/85 text-white px-3 py-1 rounded-full backdrop-blur-md mb-2 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FORMULE ATHLÉTIQUE COMPLÈTE · 250G</span>
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-serif-heading text-white drop-shadow-md">
                  L-performannç dyalk b tariqa s-hiha w bio
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl font-sans mt-1 drop-shadow-sm">
                  L'association parfaite entre hypertrophie musculaire ultra-rapide (Isolat 96% d'absorption) et régénération cellulaire des articulations, tendons et ligaments.
                </p>
              </div>

              {/* Bio-Marker Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-left">
                  <span className="text-[10px] text-emerald-400 font-mono block">Muscle Repair Speed</span>
                  <span className="text-xs font-bold text-white font-mono">CFM Isolate 93%</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-left">
                  <span className="text-[10px] text-teal-400 font-mono block">Joint Health Markers</span>
                  <span className="text-xs font-bold text-white font-mono">Peptides &lt; 2000 Da</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Professional Side-by-Side 2x2 Catalog Grid (3 Products + Pack Duo) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
          {/* PRODUCT 1: Protéine Musculaire (250g · Flacon Noir) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            {/* Top Accent Pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="bg-[#14171A] text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>FLACON NOIR SIGNATURE · 250G</span>
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                <span>24.2g Isolat CFM</span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#14171A] font-serif-heading">
                AtlasForge {proteinProduct.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
                Isolat de lactosérum natif ultra-pur filtré à basse température, sans sucre ajouté ni solvant chimique.
              </p>
            </div>

            {/* Packshot Image Container with 3D Trigger */}
            <div className="relative w-full aspect-square max-h-[320px] my-5 flex items-center justify-center bg-gradient-to-b from-[#FAF9F7] to-[#F1F3F5] rounded-2xl p-4 border border-slate-100 overflow-hidden">
              <img
                src="/assets/aistudio/image_789e9c1a.png"
                alt="AtlasForge Protéine Musculaire 250g - Flacon officiel noir"
                className="max-h-full max-w-[85%] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setShow3dModal(true)}
                className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-800 hover:text-[#1E4D2B] text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
                title="Inspecter le flacon en 3D 360°"
              >
                <Box className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>Voir en 3D (360°)</span>
              </button>
            </div>

            {/* 3 Key Benefits */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center font-mono">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-slate-900">24.2g</span>
                <span className="text-[10px] text-slate-500">Protéines Pures</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-slate-900">5.6g</span>
                <span className="text-[10px] text-slate-500">BCAA 4:1:1</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-[#1E4D2B]">0%</span>
                <span className="text-[10px] text-slate-500">Sucre Ajouté</span>
              </div>
            </div>

            {/* Flavor Selector */}
            <div className="my-4">
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono tracking-wider mb-2">
                Saveur Protéine :
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {proteinProduct.flavors.map((flavor) => {
                  const isSelected = flavor.id === activeFlavor.id;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => onFlavorChange(flavor)}
                      className={`px-2 py-1.5 rounded-xl border text-[11px] font-semibold transition-all truncate text-center ${
                        isSelected
                          ? 'border-[#1E4D2B] bg-[#1E4D2B] text-white shadow-xs'
                          : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {flavor.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing & Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-[#14171A] font-mono tabular-nums">
                    {proteinProduct.priceMAD} MAD
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono ml-2">
                    {proteinProduct.compareAtPriceMAD} MAD
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#1E4D2B] bg-[#1E4D2B]/10 px-2.5 py-0.5 rounded-full">
                  Paiement Cash (COD)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickBuyProtein}
                  className="py-3 px-4 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Commander Protéine</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleAddProtein}
                  className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>{proteinAddedNotice ? '✓ Ajouté !' : 'Ajouter au Panier'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT 2: Collagen Marine (250g · Flacon Blanc Bio) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            {/* Top Accent Pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="bg-white border border-slate-300 text-slate-900 text-[11px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#1E4D2B]" />
                <span>FLACON BLANC BIO · 250G</span>
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full font-bold border border-teal-200">
                <Droplets className="w-3 h-3 text-teal-700" />
                <span>9.8g Peptides &lt;2000Da</span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#14171A] font-serif-heading">
                AtlasForge {collagenProduct.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
                Collagène marin hydrolysé Type I & III d'élite : protection articulaire (Mafasel), ligaments, éclat cutané et anti-rides.
              </p>
            </div>

            {/* Packshot Image Container */}
            <div className="relative w-full aspect-square max-h-[320px] my-5 flex items-center justify-center bg-gradient-to-b from-[#FAF9F7] via-[#F4F4F6] to-[#ECEEF1] rounded-2xl p-4 border border-slate-100 overflow-hidden">
              <img
                src="/assets/aistudio/Gemini_Generated_Image_kd9pffkd9pffkd9p_2bc27242.jpg"
                alt="AtlasForge Collagen Marine 250g - Flacon officiel blanc"
                className="max-h-full max-w-[85%] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 text-slate-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                <span>0% Odeur de poisson</span>
              </div>
            </div>

            {/* 3 Key Benefits */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center font-mono">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-slate-900">9.8g</span>
                <span className="text-[10px] text-slate-500">Peptides Marins</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-slate-900">Type I & III</span>
                <span className="text-[10px] text-slate-500">Mafasel & Peau</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-[#1E4D2B]">100%</span>
                <span className="text-[10px] text-slate-500">Pureté Naturelle</span>
              </div>
            </div>

            {/* Flavor Selector */}
            <div className="my-4">
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono tracking-wider mb-2">
                Saveur Collagène :
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {collagenProduct.flavors.map((flavor) => {
                  const isSelected = flavor.id === collagenFlavor.id;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => setCollagenFlavor(flavor)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all truncate text-center ${
                        isSelected
                          ? 'border-[#1E4D2B] bg-[#1E4D2B] text-white shadow-xs'
                          : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {flavor.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing & Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-[#14171A] font-mono tabular-nums">
                    {collagenProduct.priceMAD} MAD
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono ml-2">
                    {collagenProduct.compareAtPriceMAD} MAD
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#1E4D2B] bg-[#1E4D2B]/10 px-2.5 py-0.5 rounded-full">
                  Paiement Cash (COD)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickBuyCollagen}
                  className="py-3 px-4 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Commander Collagène</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleAddCollagen}
                  className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>{collagenAddedNotice ? '✓ Ajouté !' : 'Ajouter au Panier'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT 3: Mega Mass (125g · Prise de Masse & Force) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            {/* Top Accent Pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="bg-[#1E4D2B] text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                <span>NOUVEAU MASS & FORCE · {megaMassProduct.weightLabel}</span>
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                <Zap className="w-3 h-3 text-[#1E4D2B]" />
                <span>Whey 70% + Créatine 10%</span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#14171A] font-serif-heading">
                AtlasForge {megaMassProduct.name}
              </h3>
              <p dir="rtl" className="text-xs sm:text-sm text-slate-600 font-sans mt-1 text-right">
                مكمّل بروتين لزيادة الوزن والكتلة العضلية : 70% واي، 15% كولاجين، 10% كرياتين، 3% حلبة، 2% فيتامين C (ستيفيا 0% سكر).
              </p>
            </div>

            {/* Packshot Image Container */}
            <div className="relative w-full aspect-square max-h-[320px] my-5 flex items-center justify-center bg-white rounded-2xl p-4 border border-slate-100 overflow-hidden">
              <img
                src="/assets/aistudio/914166009_992279166760564_2026284814750205857_n_e33294fe.png"
                alt="AtlasForge Mega Mass 250g - مكمّل بروتين لزيادة الوزن والكتلة العضلية"
                className="max-h-full max-w-[85%] object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <a
                href="#megamass"
                className="absolute bottom-3 left-3 bg-white/95 hover:bg-white text-slate-800 hover:text-[#1E4D2B] text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs transition-colors"
              >
                <span>✦ Détails & Composition %</span>
              </a>
            </div>

            {/* 3 Key Benefits */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center font-mono">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-slate-900">70%</span>
                <span className="text-[10px] text-slate-500">Whey Protéine</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-slate-900">10% + 15%</span>
                <span className="text-[10px] text-slate-500">Créatine + Collagène</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-[#1E4D2B]">3% + 2%</span>
                <span className="text-[10px] text-slate-500">Hliba + Vit C</span>
              </div>
            </div>

            {/* Flavor Selector */}
            <div className="my-4">
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono tracking-wider mb-2">
                Saveur Mega Mass :
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {megaMassProduct.flavors.map((flavor) => {
                  const isSelected = flavor.id === megaMassFlavor.id;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => setMegaMassFlavor(flavor)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all truncate text-center cursor-pointer ${
                        isSelected
                          ? 'border-[#1E4D2B] bg-[#1E4D2B] text-white shadow-xs'
                          : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {flavor.name.split(' &')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing & Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-[#14171A] font-mono tabular-nums">
                    {megaMassProduct.priceMAD} MAD
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono ml-2">
                    {megaMassProduct.compareAtPriceMAD} MAD
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#1E4D2B] bg-[#1E4D2B]/10 px-2.5 py-0.5 rounded-full">
                  Paiement Cash (COD)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickBuyMegaMass}
                  className="py-3 px-4 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Commander Mass</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleAddMegaMass}
                  className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>{megaMassAddedNotice ? '✓ Ajouté !' : 'Ajouter au Panier'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT 4: PACK DUO (Collagen Marine 250g + Vital Boost Protein 250g - Background Removed) */}
          <div id="pack-duo" className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#1E4D2B]/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            {/* Top Accent Pill */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="bg-gradient-to-r from-[#14171A] to-[#1E4D2B] text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>PACK DUO OFFICIEL · -179 MAD</span>
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                <Sparkles className="w-3 h-3 text-[#1E4D2B]" />
                <span>2 × 250g Synergie</span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#14171A] font-serif-heading">
                {packDuoProduct.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
                Collagen Marine 250g (peau, cheveux, ongles & articulations) + Vital Boost Protein 250g (énergie, muscles & performance).
              </p>
            </div>

            {/* Clean Isolated Studio Cutout Image (Background Removed) */}
            <div className="relative w-full aspect-square max-h-[320px] my-5 flex items-center justify-center bg-white rounded-2xl p-4 border border-slate-100 overflow-hidden">
              <img
                src="/assets/atlasforge-pack-duo.jpg"
                alt="Pack Duo AtlasForge Collagen Marine et Vital Boost Protein sans arrière-plan"
                className="max-h-full max-w-[94%] object-contain transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#1E4D2B] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-xs">
                ÉCONOMISEZ 179 MAD
              </div>
            </div>

            {/* 3 Key Benefits */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center font-mono">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-slate-900">2 × 250g</span>
                <span className="text-[10px] text-slate-500">Pack Complet</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-slate-900">Muscles + Peau</span>
                <span className="text-[10px] text-slate-500">&amp; Articulations</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="block text-xs font-bold text-[#1E4D2B]">419 MAD</span>
                <span className="text-[10px] text-slate-500">Au lieu de 598</span>
              </div>
            </div>

            {/* Pack Flavor Combination Selector */}
            <div className="my-4">
              <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono tracking-wider mb-2">
                Saveurs du Pack (Protéine + Collagène) :
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {packDuoProduct.flavors.map((flavor) => {
                  const isSelected = flavor.id === packFlavor.id;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => setPackFlavor(flavor)}
                      className={`px-2 py-1.5 rounded-xl border text-[11px] font-semibold transition-all truncate text-center cursor-pointer ${
                        isSelected
                          ? 'border-[#1E4D2B] bg-[#1E4D2B] text-white shadow-xs'
                          : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {flavor.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing & Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-[#1E4D2B] font-mono tabular-nums">
                    {packDuoProduct.priceMAD} MAD
                  </span>
                  <span className="text-xs text-slate-400 line-through font-mono ml-2">
                    {packDuoProduct.compareAtPriceMAD} MAD
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#1E4D2B] bg-[#1E4D2B]/10 px-2.5 py-0.5 rounded-full">
                  Paiement Cash (COD)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickBuyPackDuo}
                  className="py-3 px-4 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Commander le Pack</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleAddPackDuo}
                  className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>{packAddedNotice ? '✓ Ajouté !' : 'Ajouter au Panier'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Power of the Duo Pack (Synergy Box) */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#14171A] via-[#1A211D] to-[#14171A] text-white border border-[#1E4D2B]/40 shadow-2xl overflow-hidden">
          {/* Subtle botanical glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1E4D2B]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>OFFRE PACK DUO RECOMMANDÉ (-179 MAD)</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-heading">
                Pack Duo Vital Boost & Collagen (Protéine + Collagène)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Pourquoi choisir ? Vital Boost Protein bâtit la masse musculaire et booste l’énergie tandis que Collagen Marine fortifie peau, ongles, cheveux et articulations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="text-center sm:text-right">
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  419 MAD
                </div>
                <div className="text-xs text-slate-400 line-through font-mono">
                  598 MAD · Économisez 179 MAD
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickBuyPackDuo}
                className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-[#1E4D2B] hover:from-emerald-500 hover:to-[#163a20] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Commander le Pack Duo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Orbit Model Modal */}
      {show3dModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-[#1E4D2B]" />
                <h4 className="font-bold text-slate-900 font-serif-heading text-sm">
                  Inspection 3D Interactive · AtlasForge Protéine 250g
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShow3dModal(false)}
                className="p-1.5 text-slate-400 hover:text-black rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <ThreeProductViewer
                activeFlavor={activeFlavor}
                allFlavors={proteinProduct.flavors}
                onFlavorChange={onFlavorChange}
                onOpenOrderModal={() => {
                  setShow3dModal(false);
                  handleQuickBuyProtein();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
