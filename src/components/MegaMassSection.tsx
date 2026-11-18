import React, { useState } from 'react';
import { Product, FlavorOption, CartItem } from '../types';
import {
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
  Package,
  Flame,
  ChevronRight,
  Leaf,
  Info,
  Clock,
  AlertTriangle,
  Dumbbell,
  HeartPulse,
} from 'lucide-react';

interface MegaMassSectionProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  onQuickCheckout: (item: CartItem) => void;
  onAddTrioBundle?: () => void;
}

const MEGA_MASS_INGREDIENTS = [
  { name: 'بروتين مصل الحليب (Whey Protein)', pct: '70.00%', width: '70%', role: 'بناء الكتلة العضلية وزيادة الوزن', color: 'bg-[#1E4D2B]' },
  { name: 'كولاجين (Collagène)', pct: '15.00%', width: '15%', role: 'دعم المفاصل، الأنسجة والبشرة', color: 'bg-emerald-600' },
  { name: 'كرياتين (Créatine)', pct: '10.00%', width: '10%', role: 'تعزيز القوة البدنية والطاقة', color: 'bg-emerald-500' },
  { name: 'خلاصة الحلبة (Extrait de Fenugrec)', pct: '3.00%', width: '6%', role: 'فتح الشهية وتحسين الهضم', color: 'bg-teal-600' },
  { name: 'فيتامين C', pct: '2.00%', width: '4%', role: 'دعم المناعة وتسريع الاستشفاء', color: 'bg-amber-600' },
];

export const MegaMassSection: React.FC<MegaMassSectionProps> = ({
  product,
  onAddToCart,
  onQuickCheckout,
}) => {
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorOption>(product.flavors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'usage'>('benefits');
  const [showNutrition, setShowNutrition] = useState<boolean>(true);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const unitPrice = product.priceMAD;

  const handleAddToCart = () => {
    onAddToCart({
      productId: product.id,
      flavorId: selectedFlavor.id,
      flavorName: selectedFlavor.name,
      weightLabel: product.weightLabel,
      priceMAD: unitPrice,
      quantity,
      purchaseType: 'one-time',
      imageFallback: '/assets/aistudio/Gemini_Generated_Image_1qnusy1qnusy1qnu_0d9ff216.jpg',
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2400);
  };

  const handleInstantBuy = () => {
    onQuickCheckout({
      productId: product.id,
      flavorId: selectedFlavor.id,
      flavorName: selectedFlavor.name,
      weightLabel: product.weightLabel,
      priceMAD: unitPrice,
      quantity,
      purchaseType: 'one-time',
      imageFallback: '/assets/aistudio/Gemini_Generated_Image_1qnusy1qnusy1qnu_0d9ff216.jpg',
    });
  };

  return (
    <section id="megamass" className="py-16 md:py-24 bg-[#FAFAFA] border-t border-slate-200/90 relative overflow-hidden">
      {/* Soft bio aura */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/35 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E4D2B]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E4D2B] uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E4D2B] animate-pulse" />
              <Leaf className="w-3.5 h-3.5" />
              <span>NOUVEAUTÉ PRISE DE MASSE & FORCE · 0% SUCRE AJOUTÉ (STEVIA)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14171A] font-serif-heading">
              AtlasForge Mega Mass <span className="text-[#1E4D2B]">{product.weightLabel}</span>
            </h2>
            <p dir="rtl" className="text-sm sm:text-base font-bold text-slate-700 mt-2">
              مكمّل بروتين لزيادة الوزن والكتلة العضلية بشكل طبيعي ومتوازن — 70% واي بروتين + 15% كولاجين + 10% كرياتين + 3% خلاصة الحلبة + 2% فيتامين C
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
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

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Packshot + Arabic Formula & Benefits Showcase */}
          <div className="lg:col-span-7 space-y-6">
            {/* Official Product Showcase */}
            <div className="relative w-full h-[460px] sm:h-[520px] bg-gradient-to-b from-white via-[#F8FAF9] to-[#EFF3F0] rounded-2xl border border-slate-200 shadow-md flex items-center justify-center p-6 sm:p-10 group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,77,43,0.08)_0%,transparent_70%)] pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-5 left-5 z-20">
                <span className="text-[11px] font-mono font-bold text-[#1E4D2B] bg-white/95 px-3 py-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>FORMULE 5-EN-1 · STEVIA NATURELLE</span>
                </span>
              </div>

              <div className="absolute top-5 right-5 z-20">
                <span className="text-[11px] font-mono font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-emerald-700" />
                  <span>0% Sucre Ajouté</span>
                </span>
              </div>

              {/* Official Product Jar Image */}
              <img
                src="/assets/aistudio/Gemini_Generated_Image_1qnusy1qnusy1qnu_0d9ff216.jpg"
                alt="AtlasForge Mega Mass - مكمّل بروتين لزيادة الوزن والكتلة العضلية"
                className="max-h-[88%] max-w-[90%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.16)] transition-transform duration-500 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Bottom Interactive Hotspots */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E4D2B]" />
                  <span className="font-semibold text-slate-900 font-serif-heading">Flacon Blanc {product.weightLabel}</span>
                  <span className="text-slate-300 font-mono">·</span>
                  <span className="text-[#1E4D2B] font-bold">زيادة الوزن والكتلة العضلية</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveHotspot(
                        activeHotspot === 'fenugrec'
                          ? null
                          : 'خلاصة الحلبة (3%) تساعد على تحفيز الشهية وزيادة تناول السعرات الحرارية بشكل طبيعي ومتوازن دون دهون ضارة.'
                      )
                    }
                    className="text-[11px] font-semibold text-[#1E4D2B] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    🌿 خلاصة الحلبة 3%
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveHotspot(
                        activeHotspot === 'creatine'
                          ? null
                          : 'الكرياتين (10%) مع بروتين مصل الحليب (70%) يعززان القوة البدنية والأداء في تمارين المقاومة ورفع الأثقال.'
                      )
                    }
                    className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    ⚡ كرياتين 10% + واي 70%
                  </button>
                </div>
              </div>

              {activeHotspot && (
                <div dir="rtl" className="absolute bottom-16 left-6 right-6 z-30 p-3.5 bg-white/98 border border-[#1E4D2B]/40 rounded-xl shadow-xl text-xs text-slate-800 backdrop-blur-md">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-relaxed">{activeHotspot}</p>
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(null)}
                      className="text-slate-400 hover:text-slate-900 text-xs font-bold p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Arabic Info Tabs: Benefits / Exact Formula / Usage & Warnings */}
            <div dir="rtl" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 text-right">
              {/* Sub-navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('benefits')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'benefits'
                      ? 'bg-[#1E4D2B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ✅ الفوائد الرئيسية (5 في 1)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ingredients')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'ingredients'
                      ? 'bg-[#1E4D2B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🧪 المكونات الأساسية (%)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('usage')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === 'usage'
                      ? 'bg-[#1E4D2B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🥛 طريقة الاستخدام والتحذيرات
                </button>
              </div>

              {/* TAB 1: Main Benefits */}
              {activeTab === 'benefits' && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FAF9F7] p-4 rounded-xl border border-slate-200">
                    مصمم خصيصًا للرياضيين والأشخاص الذين يسعون لاكتساب وزن صحي وبناء كتلة عضلية قوية. يجمع هذا المكمّل بين بروتين مصل الحليب عالي الجودة، الكولاجين، الكرياتين، خلاصة الحلبة، وفيتامين C في تركيبة متكاملة تدعم النمو العضلي، وتزيد الطاقة، وتعزز صحة المفاصل والاستشفاء العضلي.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <h4 className="text-sm font-bold text-[#14171A] flex items-center gap-1.5">
                        <span>💥 زيادة الوزن (70% Whey)</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        يحتوي على بروتين مصل الحليب (70%) الغني بالأحماض الأمينية الأساسية التي تدعم بناء الألياف العضلية وتحفّز النمو بطريقة طبيعية ومتوازنة.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <h4 className="text-sm font-bold text-[#14171A] flex items-center gap-1.5">
                        <span>⚡ تعزيز القوة والطاقة (10% كرياتين)</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        يحتوي على الكرياتين (10%) الذي يزيد من القوة البدنية، ويُحسّن الأداء في تمارين المقاومة ورفع الأثقال.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <h4 className="text-sm font-bold text-[#14171A] flex items-center gap-1.5">
                        <span>🦴 دعم المفاصل والبشرة (15% كولاجين)</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        يحتوي على الكولاجين (15%) الذي يدعم صحة المفاصل والأنسجة الضامة، ويساعد في تحسين مظهر البشرة ومرونتها.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <h4 className="text-sm font-bold text-[#14171A] flex items-center gap-1.5">
                        <span>🌿 فتح الشهية وتحسين الهضم (3% حلبة)</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        تساعد خلاصة الحلبة (3%) على تحفيز الشهية وزيادة تناول السعرات الحرارية، مما يُساهم في اكتساب الوزن بشكل طبيعي ومتوازن.
                      </p>
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                      <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                        <span>🛡️ دعم المناعة وتسريع الاستشفاء العضلي (2% فيتامين C)</span>
                      </h4>
                      <p className="text-xs text-emerald-900/90 leading-relaxed">
                        مدعّم بـ فيتامين C (2%) الذي يعزز جهاز المناعة ويُقلل من الإجهاد التأكسدي ويساعد على التعافي بعد التمارين.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Exact Ingredient Percentages */}
              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {MEGA_MASS_INGREDIENTS.map((ing, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{ing.name}</span>
                          <span className="font-mono font-extrabold text-[#1E4D2B] text-sm">{ing.pct}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${ing.color} rounded-full`} style={{ width: ing.width }} />
                        </div>
                        <p className="text-[11px] text-slate-600">{ing.role}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs">
                      <span className="font-bold text-emerald-950 block mb-0.5">🍃 نكهات طبيعية 100%</span>
                      <span className="text-emerald-900/80">مذاق سلس وطبيعي مثالي مع الماء أو الحليب كامل الدسم.</span>
                    </div>
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs">
                      <span className="font-bold text-emerald-950 block mb-0.5">🌱 ستيفيا (Stevia)</span>
                      <span className="text-emerald-900/80">محلي طبيعي خالٍ من السكر المضاف (0% سكر مكرر).</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Usage & Warnings */}
              {activeTab === 'usage' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#FAF9F7] border border-emerald-200 rounded-xl space-y-2">
                    <h4 className="text-sm font-bold text-[#1E4D2B] flex items-center gap-2">
                      <span>🥛 طريقة الاستخدام الموصى بها</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      اخلط ملعقة واحدة (حوالي <strong>40 غرام</strong>) مع <strong>300 – 350 مل</strong> من الماء أو الحليب كامل الدسم.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-800 font-semibold">
                      يُفضل تناوله مرتين يوميًا — بعد التمرين أو بين الوجبات للحصول على أفضل النتائج الملموسة والسريعة.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                    <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>⚠️ التحذيرات والاحتياطات</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-950/90 list-disc list-inside">
                      <li>لا يُستخدم كبديل للوجبات الرئيسية.</li>
                      <li>يُحفظ في مكان بارد وجاف بعيدًا عن الرطوبة وأشعة الشمس.</li>
                      <li>يُنصح باستشارة مختص في حال وجود حالات صحية خاصة أو أمراض مزمنة.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Conversion Box (COD Checkout) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold tracking-wider text-[#1E4D2B] uppercase font-mono bg-[#1E4D2B]/10 px-2 py-0.5 rounded">
                  Mass & Force 5-en-1 · {product.weightLabel}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Disponible au Maroc</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#14171A] font-serif-heading">
                AtlasForge Mega Mass
              </h3>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-900 font-mono">4.95/5</span>
                <span className="text-slate-400 font-mono text-xs">·</span>
                <span className="text-xs text-slate-600">Prise de masse propre & force</span>
              </div>
            </div>

            {/* Arabic Hook */}
            <div dir="rtl" className="p-3.5 bg-gradient-to-l from-emerald-50/90 to-teal-50/60 border border-emerald-200/80 rounded-xl text-xs space-y-1.5 text-right">
              <p className="font-bold text-emerald-950 text-sm">
                💪 تركيبة متكاملة لزيادة الوزن وبناء العضلات
              </p>
              <p className="text-slate-700 leading-relaxed">
                70% واي بروتين + 15% كولاجين + 10% كرياتين + 3% خلاصة الحلبة لفتح الشهية + 2% فيتامين C. خالٍ من السكر المضاف ومحلى طبيعيًا بستيفيا.
              </p>
            </div>

            {/* Price Banner */}
            <div className="p-4 rounded-xl border-2 border-[#1E4D2B] bg-[#1E4D2B]/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 font-serif-heading">
                  AtlasForge Mega Mass ({product.weightLabel})
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  Complément Alimentaire · Stevia 0% Sucre
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#1E4D2B] font-mono tabular-nums">
                  {unitPrice} MAD
                </span>
                <div className="text-[11px] text-slate-400 line-through font-mono">
                  {product.compareAtPriceMAD} MAD
                </div>
              </div>
            </div>

            {/* Flavor Selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                  Saveur Naturelle :
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
                      type="button"
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
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
                        <p className="text-[10px] text-slate-500 truncate">0% Sucre (Stevia)</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                Quantité :
              </span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-black font-bold text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-black font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block font-mono">Total à régler au livreur :</span>
                <span className="text-xl font-extrabold text-[#14171A] font-mono tabular-nums">
                  {unitPrice * quantity} MAD
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#1E4D2B] bg-emerald-100/70 px-2.5 py-1 rounded-full font-mono">
                Expédition 24h Spaceseller
              </span>
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

            {/* CTA Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleInstantBuy}
                className="w-full py-4 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Commander Mega Mass · {unitPrice * quantity} MAD (COD)</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>{addedNotice ? '✓ Ajouté au Panier !' : 'Ajouter au Panier AtlasForge'}</span>
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
                <span>0% Sucre ajouté · Stevia pure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>Avec Hlib / Eau (40g / dose)</span>
              </div>
            </div>

            {/* Analytical Composition Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowNutrition(!showNutrition)}
                className="text-xs text-[#1E4D2B] hover:underline font-bold flex items-center gap-1 font-mono cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>
                  {showNutrition ? 'Masquer la composition analytique' : 'Voir la composition exacte (%)'}
                </span>
              </button>

              {showNutrition && (
                <div dir="rtl" className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-right">
                  <div className="flex justify-between font-bold border-b border-slate-200 pb-1 text-slate-800">
                    <span>المكون الأساسي</span>
                    <span>النسبة</span>
                  </div>
                  {product.nutritionFacts.map((fact, idx) => (
                    <div key={idx} className="flex justify-between py-0.5 text-slate-600 border-b border-slate-100 last:border-0">
                      <span>{fact.label}</span>
                      <span className="font-bold text-slate-900 font-mono">{fact.amount}</span>
                    </div>
                  ))}
                  <div className="text-[11px] text-slate-500 pt-1">
                    🥛 طريقة الاستخدام: 40 غرام مع 300-350 مل ماء أو حليب كامل الدسم، مرتين يوميًا.
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
