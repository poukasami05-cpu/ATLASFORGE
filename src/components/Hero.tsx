/**
 * AtlasForge – Storefront (nouveau design vert & blanc, luxe + sport)
 * Toutes les sections de la page d'accueil sont dans ce fichier
 * (gardé sous le nom Hero.tsx pour ne pas avoir à créer de nouveau fichier).
 */

import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, MapPin, Check, ChevronRight, Plus } from 'lucide-react';
import {
  FLAGSHIP_PRODUCT,
  COLLAGEN_PRODUCT,
  MEGA_MASS_PRODUCT,
  PACK_DUO_PRODUCT,
  PACK_SANTE_PRODUCT,
  PACK_SANTE_IMAGE,
} from '../data/mockData';
import { CartItem, Product } from '../types';

// ---------------------------------------------------------------------------
// Images (fond gris des photos → blanc avec brightness, puis "multiply" sur la carte)
// ---------------------------------------------------------------------------
const IMG = {
  protein: { src: '/assets/aistudio/bazili_c898db13.png', filter: 'brightness(1.12)' },
  collagen: { src: '/assets/aistudio/Gemini_Generated_Image_kd9pffkd9pffkd9p_2bc27242.jpg', filter: 'brightness(1.18)' },
  megamass: { src: '/assets/aistudio/914166009_992279166760564_2026284814750205857_n_e33294fe.png', filter: 'brightness(1.03)' },
  packDuo: { src: '/assets/atlasforge-pack-duo.jpg', filter: 'none' },
};

const ACCENT = '#B9F26B';
const FREE_SHIPPING_MAD = 500;

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Meknès', 'Agadir', 'Kénitra', 'Oujda', 'Mohammedia'];

const pct = (p: Product) => Math.round((1 - p.priceMAD / p.compareAtPriceMAD) * 100);
const saving = (p: Product) => p.compareAtPriceMAD - p.priceMAD;

const makeItem = (p: Product, flavorIndex = 0, imageFallback?: string): CartItem => ({
  productId: p.id,
  flavorId: p.flavors[flavorIndex].id,
  flavorName: p.flavors[flavorIndex].name,
  weightLabel: p.weightLabel,
  priceMAD: p.priceMAD,
  quantity: 1,
  purchaseType: 'one-time',
  imageFallback,
});

interface StorefrontProps {
  cartCount: number;
  onOpenCart: () => void;
  onAddToCart: (item: CartItem) => void;
}

// ---------------------------------------------------------------------------
// Petits éléments réutilisables
// ---------------------------------------------------------------------------
const Kicker: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span className={`text-[13px] font-bold tracking-[0.14em] uppercase ${light ? 'text-[#C9D8C8]' : 'text-[#1E4D2B]'}`}>{children}</span>
);

const Serif: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`af-serif italic font-normal normal-case tracking-[-0.01em] ${className}`}>{children}</span>
);

const FlavorPills: React.FC<{ product: Product; value: number; onChange: (i: number) => void; dark?: boolean }> = ({
  product,
  value,
  onChange,
  dark,
}) => (
  <div className="flex flex-wrap gap-1.5">
    {product.flavors.map((f, i) => {
      const on = i === value;
      const cls = dark
        ? on
          ? 'bg-white text-[#0B2A1A] border-white'
          : 'bg-transparent text-[#C9D8C8] border-white/30 hover:border-white/60'
        : on
        ? 'bg-[#0F1A14] text-white border-[#0F1A14]'
        : 'bg-white text-[#0F1A14] border-[#D5DDD4] hover:border-[#0F1A14]';
      return (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(i)}
          aria-pressed={on}
          className={`h-9 px-3.5 rounded-full border text-[13px] font-semibold cursor-pointer transition-colors ${cls}`}
        >
          {f.name}
        </button>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// Storefront
// ---------------------------------------------------------------------------
export const Storefront: React.FC<StorefrontProps> = ({ cartCount, onOpenCart, onAddToCart }) => {
  const [flavor, setFlavor] = useState<Record<string, number>>({});
  const [goal, setGoal] = useState<string>('muscle');
  const [faqOpen, setFaqOpen] = useState<number>(0);

  const fIdx = (id: string) => flavor[id] ?? 0;
  const setF = (id: string) => (i: number) => setFlavor((prev) => ({ ...prev, [id]: i }));

  const singles = [
    { p: FLAGSHIP_PRODUCT, img: IMG.protein, kicker: 'Whey isolat · 250g', badge: 'Best-seller', desc: 'Isolat de whey ultra-pur, BCAA 4:1:1 et L-Glutamine. Sans sucre ajouté.' },
    { p: COLLAGEN_PRODUCT, img: IMG.collagen, kicker: 'Peau · Articulations · 250g', badge: 'Beauté', desc: 'Peptides de collagène marin type I & III, avec zinc et vitamine C.' },
    { p: MEGA_MASS_PRODUCT, img: IMG.megamass, kicker: 'Prise de masse · 250g', badge: 'Prise de masse', desc: 'Whey 70%, créatine 10%, collagène 15% et fenugrec 3%.' },
  ];

  const GOALS = [
    { id: 'muscle', label: 'Prendre du muscle', hint: 'Récupération et volume', p: FLAGSHIP_PRODUCT, img: IMG.protein, why: 'Isolat de whey riche en BCAA 4:1:1 et L-Glutamine, pour récupérer vite après chaque séance.' },
    { id: 'mass', label: 'Prendre du poids', hint: 'Masse et appétit', p: MEGA_MASS_PRODUCT, img: IMG.megamass, why: '70% whey, 10% créatine, 15% collagène et 3% fenugrec pour une prise de masse progressive.' },
    { id: 'skin', label: 'Peau, cheveux, articulations', hint: 'Beauté et mobilité', p: COLLAGEN_PRODUCT, img: IMG.collagen, why: 'Peptides de collagène marin type I et III, avec zinc et vitamine C.' },
    { id: 'health', label: 'Énergie et immunité', hint: 'Fatigue, défenses, sommeil', p: PACK_SANTE_PRODUCT, img: { src: PACK_SANTE_IMAGE, filter: 'none' }, dark: true, why: 'Zinc, Fer + Vitamine C et Magnésium en gummies : les 3 essentiels du quotidien pour 199 DH.' },
    { id: 'all', label: 'Muscles + articulations', hint: 'Le combo complet', p: PACK_DUO_PRODUCT, img: IMG.packDuo, why: 'Vital Boost Protein + Collagen Marine dans une seule commande, et 179 DH d’économie.' },
  ];
  const rec = GOALS.find((g) => g.id === goal) || GOALS[0];

  const FAQ = [
    { q: 'Comment je paie ?', a: 'En espèces, au livreur, quand tu reçois ton colis. Aucune carte bancaire n’est demandée sur le site.' },
    { q: 'En combien de temps je reçois ma commande ?', a: 'En 24 à 48h dans la plupart des villes du Maroc. Le livreur t’appelle avant de passer.' },
    { q: 'Combien coûte la livraison ?', a: `35 DH, et gratuite dès ${FREE_SHIPPING_MAD} DH d’achat.` },
    { q: 'Comment je confirme ma commande ?', a: 'Après ta commande, on t’appelle sur ton numéro pour confirmer l’adresse et l’heure de livraison.' },
  ];

  const marqueeItems = ['Protéine', 'Collagen Marine', 'Mega Mass', 'Pack Duo', 'Pack Santé', 'Paiement à la livraison'];

  return (
    <div className="af-body w-full bg-white text-[#0F1A14]">
      {/* Announcement */}
      <div className="bg-[#0B2A1A] text-[#E8EFE7] text-[13px] font-medium tracking-[0.02em] px-4 py-2.5 flex flex-wrap justify-center gap-x-5 gap-y-1 text-center">
        <span>
          <strong style={{ color: ACCENT }}>Livraison GRATUITE</strong> dès {FREE_SHIPPING_MAD} DH
        </span>
        <span aria-hidden="true" className="opacity-40">•</span>
        <span>Livraison 24–48h partout au Maroc</span>
        <span aria-hidden="true" className="opacity-40 hidden sm:inline">•</span>
        <span className="hidden sm:inline">Paiement à la livraison</span>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E6EAE5] px-5 md:px-12">
        <nav className="max-w-[1320px] mx-auto h-[76px] flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3 no-underline text-[#0F1A14]">
            <span className="w-10 h-10 rounded-xl bg-[#1E4D2B] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M2 20L9 7l4 6 3-4 6 11H2z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="af-display font-extrabold text-[22px] tracking-[-0.02em]">AtlasForge</span>
          </a>
          <div className="hidden md:flex gap-8 text-[15px] font-medium">
            <a href="#produits" className="text-[#0F1A14] hover:text-[#1E4D2B]">Produits</a>
            <a href="#packs" className="text-[#0F1A14] hover:text-[#1E4D2B]">Packs</a>
            <a href="#science" className="text-[#0F1A14] hover:text-[#1E4D2B]">Formules</a>
            <a href="#livraison" className="text-[#0F1A14] hover:text-[#1E4D2B]">Livraison</a>
            <a href="#faq" className="text-[#0F1A14] hover:text-[#1E4D2B]">FAQ</a>
          </div>
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Ouvrir le panier"
            className="h-[46px] px-5 rounded-full bg-[#0F1A14] text-white font-semibold text-sm flex items-center gap-2.5 cursor-pointer"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            <span>Panier</span>
            <span
              className="min-w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center px-1.5 text-[#0B2A1A]"
              style={{ background: ACCENT }}
            >
              {cartCount}
            </span>
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden bg-[#0B2A1A] text-white px-5 md:px-12 py-16 md:py-24">
        <div aria-hidden="true" className="absolute -right-[200px] -top-[180px] w-[720px] h-[720px] rounded-full border border-[#E8EFE7]/10" />
        <div aria-hidden="true" className="absolute -right-[90px] -top-[70px] w-[500px] h-[500px] rounded-full border border-[#E8EFE7]/10" />
        <div className="relative max-w-[1320px] mx-auto grid md:grid-cols-2 gap-12 md:gap-14 items-center">
          <div className="flex flex-col gap-7">
            <div className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase text-[#C9D8C8]">
              <span className="w-7 h-0.5" style={{ background: ACCENT }} />
              <span>Sports nutrition · Made for Morocco</span>
            </div>
            <h1 className="af-display m-0 font-black uppercase leading-[0.92] tracking-[-0.045em] text-[54px] sm:text-[78px] xl:text-[104px]">
              Forgé
              <br />
              dans <Serif className="tracking-[-0.02em]"><span style={{ color: ACCENT }}>l’Atlas.</span></Serif>
            </h1>
            <p className="m-0 max-w-[500px] text-lg md:text-[19px] leading-relaxed text-[#C9D8C8]">
              Protéine, collagène, prise de masse et santé au quotidien. Des formules propres, livrées chez toi en 24–48h. Tu
              paies à la livraison.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a
                href="#produits"
                className="h-[58px] px-7 rounded-full font-bold text-base text-[#0B2A1A] flex items-center gap-2.5 hover:opacity-90"
                style={{ background: ACCENT }}
              >
                Voir les produits <ArrowRight className="w-[18px] h-[18px]" />
              </a>
              <a
                href="#packs"
                className="h-[58px] px-7 rounded-full border-[1.5px] border-white/35 text-white font-semibold text-base flex items-center hover:border-white"
              >
                Packs dès {PACK_SANTE_PRODUCT.priceMAD} DH
              </a>
            </div>
            <div className="flex flex-wrap gap-8 pt-4 border-t border-[#E8EFE7]/15">
              {[
                ['COD', 'Paiement à la livraison'],
                ['24–48h', 'Partout au Maroc'],
                ['5', 'Produits & packs'],
              ].map(([big, small]) => (
                <div key={big} className="flex flex-col gap-1">
                  <span className="af-display font-extrabold text-[28px]">{big}</span>
                  <span className="text-[13px] text-[#9FB5A0]">{small}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trio */}
          <div className="relative w-full max-w-[580px] mx-auto aspect-square">
            <div aria-hidden="true" className="absolute inset-0 rounded-full bg-[#F2F5F1]" />
            <div aria-hidden="true" className="absolute -inset-[22px] rounded-full border border-[#E8EFE7]/20" />
            <div className="absolute inset-0 flex items-center justify-center px-[6%]">
              <div className="af-float2 relative z-[1] w-[32%] -mr-[7%] mt-[10%] mix-blend-multiply">
                <img
                  className="block w-full aspect-square object-cover"
                  style={{ filter: IMG.collagen.filter }}
                  src={IMG.collagen.src}
                  alt="Collagen Marine AtlasForge"
                />
              </div>
              <div className="af-float relative z-[2] w-[48%] mix-blend-multiply">
                <img
                  className="block w-full"
                  style={{ filter: IMG.protein.filter }}
                  src={IMG.protein.src}
                  alt="Protéine Musculaire AtlasForge"
                />
              </div>
              <div className="af-float3 relative z-[1] w-[34%] -ml-[7%] mt-[10%] mix-blend-multiply">
                <img
                  className="block w-full"
                  style={{ filter: IMG.megamass.filter, transform: 'scale(1.3)' }}
                  src={IMG.megamass.src}
                  alt="Mega Mass AtlasForge"
                />
              </div>
            </div>
            <div
              className="absolute -right-1.5 top-[4%] z-[3] w-24 h-24 md:w-28 md:h-28 rounded-full text-[#0B2A1A] flex flex-col items-center justify-center text-center -rotate-[10deg] shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
              style={{ background: ACCENT }}
            >
              <span className="text-[11px] font-extrabold uppercase tracking-[0.06em]">Jusqu’à</span>
              <span className="af-display font-black text-[26px] md:text-[30px] leading-none">-{pct(PACK_DUO_PRODUCT)}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden whitespace-nowrap py-4 text-[#0B2A1A]" style={{ background: ACCENT }}>
        <div className="af-marquee items-center af-display font-black text-2xl uppercase tracking-[-0.01em]">
          {[0, 1].map((k) => (
            <div key={k} aria-hidden={k === 1} className="inline-flex gap-9 items-center pr-9">
              {marqueeItems.map((t) => (
                <React.Fragment key={t}>
                  <span>{t}</span>
                  <span aria-hidden="true">✦</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div className="bg-white border-b border-[#E6EAE5] px-5 md:px-12 py-4">
        <div className="max-w-[1320px] mx-auto flex flex-wrap gap-x-5 gap-y-2 items-center justify-center text-sm text-[#4A5A4F]">
          <span className="font-bold text-[#0F1A14] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1E4D2B]" /> On livre à
          </span>
          {CITIES.map((c) => (
            <span key={c}>{c}</span>
          ))}
          <span className="font-semibold text-[#1E4D2B]">+ tout le Maroc</span>
        </div>
      </div>

      {/* 01 · PRODUITS */}
      <section id="produits" className="scroll-mt-24 bg-white px-5 md:px-12 pt-16 md:pt-28 pb-10 md:pb-16">
        <div className="max-w-[1320px] mx-auto flex flex-col gap-11">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div className="flex flex-col gap-3.5 max-w-[640px]">
              <Kicker>01 · Nos produits</Kicker>
              <h2 className="af-display m-0 font-black leading-[0.98] tracking-[-0.04em] text-[40px] md:text-[60px]">
                Choisis ta <Serif className="text-[#1E4D2B]">formule.</Serif>
              </h2>
            </div>
            <p className="m-0 max-w-[360px] text-base leading-relaxed text-[#4A5A4F]">
              Choisis ta saveur, commande en 30 secondes. Le livreur t’appelle avant de passer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {singles.map(({ p, img, kicker, badge, desc }) => (
              <article
                key={p.id}
                className="af-card flex flex-col gap-[18px] p-3.5 pb-5 rounded-[30px] bg-white border border-[#E1E8E0]"
              >
                <div className="relative aspect-square rounded-[22px] bg-[#F2F5F1] overflow-hidden flex items-center justify-center">
                  <img
                    src={img.src}
                    alt={`Pot AtlasForge ${p.name}`}
                    className="w-[90%] h-[90%] object-contain mix-blend-multiply"
                    style={{ filter: img.filter, objectFit: p.id === COLLAGEN_PRODUCT.id ? 'cover' : 'contain' }}
                  />
                  <span className="absolute left-3.5 top-3.5 text-xs font-extrabold tracking-[0.04em] px-3 py-[7px] rounded-full bg-[#0B2A1A] text-white">
                    {badge}
                  </span>
                  <span
                    className="absolute right-3.5 top-3.5 text-xs font-extrabold px-3 py-[7px] rounded-full text-[#0B2A1A]"
                    style={{ background: ACCENT }}
                  >
                    -{pct(p)}%
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 px-1.5">
                  <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#4A5A4F]">{kicker}</span>
                  <h3 className="af-display m-0 font-extrabold text-[26px] tracking-[-0.02em]">{p.name}</h3>
                  <p className="m-0 text-[15px] leading-normal text-[#4A5A4F]">{desc}</p>
                </div>
                <div className="px-1.5">
                  <FlavorPills product={p} value={fIdx(p.id)} onChange={setF(p.id)} />
                </div>
                <div className="flex flex-col gap-3 px-1.5 mt-auto">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="flex items-baseline gap-2">
                      <span className="af-display font-black text-[30px]">{p.priceMAD} DH</span>
                      <span className="text-[15px] text-[#6B776F] line-through">{p.compareAtPriceMAD} DH</span>
                    </span>
                    <span className="text-xs font-extrabold px-2.5 py-[5px] rounded-full bg-[#E3F1DF] text-[#1E4D2B]">
                      Économise {saving(p)} DH
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddToCart(makeItem(p, fIdx(p.id), img.src))}
                    className="w-full h-[54px] rounded-full bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-[15px] flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-[18px] h-[18px]" /> Ajouter au panier
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 02 · PACKS */}
      <section id="packs" className="scroll-mt-24 bg-white px-5 md:px-12 pt-10 pb-16 md:pb-28">
        <div className="max-w-[1320px] mx-auto flex flex-col gap-11">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div className="flex flex-col gap-3.5 max-w-[640px]">
              <Kicker>02 · Nos packs</Kicker>
              <h2 className="af-display m-0 font-black leading-[0.98] tracking-[-0.04em] text-[40px] md:text-[60px]">
                Plus de produits, <Serif className="text-[#1E4D2B]">moins cher.</Serif>
              </h2>
            </div>
            <p className="m-0 max-w-[360px] text-base leading-relaxed text-[#4A5A4F]">
              Deux packs pensés pour aller ensemble, à un prix unique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pack Duo */}
            <article className="af-card bg-[#F2F5F1] rounded-[36px] overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden flex items-center justify-center bg-[#F2F5F1]">
                <img src={IMG.packDuo.src} alt="Pack Duo : Vital Boost Protein et Collagen Marine" className="w-[78%] h-auto mix-blend-multiply" />
                <span className="absolute left-5 top-5 text-xs font-extrabold tracking-[0.06em] uppercase px-3.5 py-2 rounded-full bg-[#0B2A1A] text-white">
                  Meilleure vente
                </span>
                <span className="absolute right-5 top-5 text-[13px] font-black px-3.5 py-2 rounded-full text-[#0B2A1A]" style={{ background: ACCENT }}>
                  -{pct(PACK_DUO_PRODUCT)}%
                </span>
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-[18px] flex-1">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#1E4D2B]">Muscles & articulations</span>
                  <h3 className="af-display m-0 font-black text-[36px] tracking-[-0.03em]">Pack Duo</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
                  <span className="flex-1 bg-white rounded-2xl px-3.5 py-3 text-sm font-semibold flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E4D2B] shrink-0" />
                    Vital Boost Protein 250g
                  </span>
                  <Plus aria-hidden="true" className="self-center w-5 h-5 text-[#6B776F] shrink-0" />
                  <span className="flex-1 bg-white rounded-2xl px-3.5 py-3 text-sm font-semibold flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E4D2B] shrink-0" />
                    Collagen Marine 250g
                  </span>
                </div>
                <FlavorPills product={PACK_DUO_PRODUCT} value={fIdx(PACK_DUO_PRODUCT.id)} onChange={setF(PACK_DUO_PRODUCT.id)} />
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <span className="flex flex-col gap-0.5">
                    <span className="flex items-baseline gap-2.5">
                      <span className="af-display font-black text-[44px] tracking-[-0.03em]">{PACK_DUO_PRODUCT.priceMAD} DH</span>
                      <span className="text-[17px] text-[#6B776F] line-through">{PACK_DUO_PRODUCT.compareAtPriceMAD} DH</span>
                    </span>
                    <span className="text-[13px] font-bold text-[#1E4D2B]">Tu économises {saving(PACK_DUO_PRODUCT)} DH</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(makeItem(PACK_DUO_PRODUCT, fIdx(PACK_DUO_PRODUCT.id), IMG.packDuo.src))}
                    className="h-14 px-7 rounded-full bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-[15px] cursor-pointer transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </article>

            {/* Pack Santé */}
            <article className="af-card bg-[#0B2A1A] text-white rounded-[36px] overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0B2A1A]">
                <img
                  src={PACK_SANTE_IMAGE}
                  alt="Pack Santé : Zinc, Fer + Vitamine C et Magnésium Complex Gummies"
                  className="w-full h-full object-cover block"
                  style={{ objectPosition: 'center 70%' }}
                />
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[30%] bg-linear-to-b from-[#0B2A1A] to-transparent" />
                <span className="absolute left-5 top-5 text-xs font-extrabold tracking-[0.06em] uppercase px-3.5 py-2 rounded-full text-[#0B2A1A]" style={{ background: ACCENT }}>
                  Nouveau
                </span>
                <span className="absolute right-5 top-5 text-xs font-bold tracking-[0.06em] uppercase px-3.5 py-2 rounded-full border border-white/40 text-white">
                  3 produits
                </span>
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-[18px] flex-1">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold tracking-[0.12em] uppercase" style={{ color: ACCENT }}>
                    Énergie, défenses & sommeil
                  </span>
                  <h3 className="af-display m-0 font-black text-[36px] tracking-[-0.03em] flex flex-wrap items-baseline gap-x-3.5">
                    Pack Santé
                    <span dir="rtl" lang="ar" className="font-sans font-bold text-xl text-[#C9D8C8] tracking-normal">
                      باك الصحة المتكامل
                    </span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    ['Zn', 'Zinc · 30 caps', 'Immunité, peau, cheveux'],
                    ['Fe', 'Fer + Vit. C · 30 caps', 'Globules rouges, défenses'],
                    ['Mg', 'Magnésium · 25 gummies', 'Stress, sommeil, muscles'],
                  ].map(([sym, name, sub]) => (
                    <span key={sym} className="bg-white/[0.07] border border-[#E8EFE7]/15 rounded-2xl px-3.5 py-3 flex flex-col gap-0.5">
                      <span className="af-display font-black text-lg" style={{ color: ACCENT }}>{sym}</span>
                      <span className="text-sm font-semibold">{name}</span>
                      <span className="text-xs text-[#C9D8C8]">{sub}</span>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                  <span className="flex flex-col gap-0.5">
                    <span className="af-display font-black text-[44px] tracking-[-0.03em]">{PACK_SANTE_PRODUCT.priceMAD} DH</span>
                    <span className="text-[13px] font-bold" style={{ color: ACCENT }}>Les 3 produits, un seul prix</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(makeItem(PACK_SANTE_PRODUCT, 0, PACK_SANTE_IMAGE))}
                    className="h-14 px-7 rounded-full text-[#0B2A1A] font-extrabold text-[15px] cursor-pointer hover:opacity-90"
                    style={{ background: ACCENT }}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Goal finder */}
      <section className="bg-white px-5 md:px-12 pb-16 md:pb-28">
        <div className="max-w-[1320px] mx-auto bg-[#F2F5F1] rounded-[40px] p-5 md:p-14">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div className="flex flex-col gap-5">
              <Kicker>Trouve ton produit en 5 secondes</Kicker>
              <h2 className="af-display m-0 font-black leading-[0.98] tracking-[-0.04em] text-[40px] md:text-[60px]">
                Quel est ton <Serif className="text-[#1E4D2B]">objectif ?</Serif>
              </h2>
              <div className="flex flex-col gap-2.5">
                {GOALS.map((g) => {
                  const on = g.id === goal;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id)}
                      aria-pressed={on}
                      className={`w-full min-h-[66px] px-5 py-3.5 rounded-[18px] border flex items-center justify-between gap-3 cursor-pointer transition-colors text-left ${
                        on ? 'bg-[#0B2A1A] text-white border-[#0B2A1A]' : 'bg-white text-[#0F1A14] border-[#D5DDD4] hover:border-[#0F1A14]'
                      }`}
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="af-display font-extrabold text-lg">{g.label}</span>
                        <span className="text-[13px] opacity-75">{g.hint}</span>
                      </span>
                      <ChevronRight className="w-5 h-5 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-[32px] p-5 md:p-7 flex flex-wrap gap-6 items-center border border-[#E1E8E0]">
              <div
                className="flex-[1_1_220px] aspect-square rounded-3xl overflow-hidden flex items-center justify-center"
                style={{ background: rec.dark ? '#0B2A1A' : '#F2F5F1' }}
              >
                <img
                  src={rec.img.src}
                  alt={`AtlasForge ${rec.p.name}`}
                  className={rec.dark ? 'w-full h-full object-cover' : 'w-[90%] h-[90%] object-contain mix-blend-multiply'}
                  style={{ filter: rec.img.filter, objectPosition: rec.dark ? 'center 70%' : undefined }}
                />
              </div>
              <div className="flex-[1_1_240px] flex flex-col gap-3.5">
                <span className="self-start text-xs font-extrabold tracking-[0.08em] uppercase px-3 py-[7px] rounded-full bg-[#0B2A1A]" style={{ color: ACCENT }}>
                  Recommandé pour toi
                </span>
                <h3 className="af-display m-0 font-black text-[34px] tracking-[-0.03em]">{rec.p.name}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-[#4A5A4F]">{rec.why}</p>
                <span className="flex items-baseline gap-2.5">
                  <span className="af-display font-black text-[32px]">{rec.p.priceMAD} DH</span>
                  {rec.p.compareAtPriceMAD > rec.p.priceMAD && (
                    <span className="text-[15px] text-[#6B776F] line-through">{rec.p.compareAtPriceMAD} DH</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => onAddToCart(makeItem(rec.p, 0, rec.img.src))}
                  className="h-14 rounded-full bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-base cursor-pointer transition-colors"
                >
                  Commander · {rec.p.priceMAD} DH
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 · SCIENCE */}
      <section id="science" className="scroll-mt-24 bg-[#F2F5F1] px-5 md:px-12 py-16 md:py-28">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="flex flex-col gap-[22px]">
            <Kicker>03 · Ce qu’il y a dedans</Kicker>
            <h2 className="af-display m-0 font-black leading-[0.98] tracking-[-0.04em] text-[40px] md:text-[60px]">
              Des formules <Serif className="text-[#1E4D2B]">transparentes.</Serif>
            </h2>
            <p className="m-0 text-[17px] leading-relaxed text-[#4A5A4F] max-w-[520px]">
              Chaque pot affiche exactement ce qu’il contient. Pas de mélange caché, pas de sucre ajouté.
            </p>
            <div className="bg-white rounded-3xl p-7 flex flex-col gap-1.5 max-w-[520px] border border-[#E1E8E0]">
              <span className="text-xs font-bold tracking-[0.1em] uppercase text-[#4A5A4F]">Formule Protéine Musculaire</span>
              <span className="af-display font-bold text-[19px] leading-snug">
                Isolat de whey natif (CFM 93%) + L-Glutamine micronisée + BCAA 4:1:1
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { big: '70%', t: 'Whey protéine', d: 'Dans Mega Mass, pour construire la masse musculaire.', cls: 'bg-[#0B2A1A] text-white', bigColor: ACCENT, dColor: 'text-[#C9D8C8]' },
              { big: '10%', t: 'Créatine', d: 'Plus de force sur les séries lourdes.', cls: 'bg-white border border-[#E1E8E0]', bigColor: '#1E4D2B', dColor: 'text-[#4A5A4F]' },
              { big: '15%', t: 'Collagène', d: 'Pour les articulations et les tendons.', cls: 'bg-white border border-[#E1E8E0]', bigColor: '#1E4D2B', dColor: 'text-[#4A5A4F]' },
              { big: '4:1:1', t: 'Ratio BCAA', d: 'Riche en leucine, dans la Protéine Musculaire.', cls: 'bg-[#1E4D2B] text-white', bigColor: '#FFFFFF', dColor: 'text-[#C9D8C8]' },
            ].map((c) => (
              <div key={c.t} className={`rounded-3xl p-7 flex flex-col gap-3 min-h-[210px] ${c.cls}`}>
                <span className="af-display font-black text-[56px] leading-none" style={{ color: c.bigColor }}>{c.big}</span>
                <span className="font-semibold text-base">{c.t}</span>
                <span className={`text-sm leading-normal ${c.dColor}`}>{c.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · LIVRAISON */}
      <section id="livraison" className="scroll-mt-24 bg-white px-5 md:px-12 py-16 md:py-28">
        <div className="max-w-[1320px] mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-3.5 items-center text-center">
            <Kicker>04 · Comment ça marche</Kicker>
            <h2 className="af-display m-0 font-black leading-[0.98] tracking-[-0.04em] text-[40px] md:text-[60px]">
              Tu paies <Serif className="text-[#1E4D2B]">quand tu reçois.</Serif>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['1', 'Tu commandes', 'Nom, téléphone, ville. C’est tout. Aucune carte bancaire.'],
              ['2', 'On t’appelle', 'On te contacte pour confirmer l’adresse et l’heure de livraison.'],
              ['3', 'Tu paies à la porte', 'En espèces, à la réception du colis. Livré en 24–48h.'],
            ].map(([n, t, d], i) => (
              <div key={n} className={`border border-[#E1E8E0] rounded-3xl p-8 flex flex-col gap-4 ${i === 2 ? 'bg-[#F2F5F1]' : ''}`}>
                <span
                  className="w-[52px] h-[52px] rounded-2xl af-display font-black text-[22px] flex items-center justify-center"
                  style={i === 2 ? { background: ACCENT, color: '#0B2A1A' } : { background: '#0B2A1A', color: ACCENT }}
                >
                  {n}
                </span>
                <h3 className="af-display m-0 font-extrabold text-[22px]">{t}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-[#4A5A4F]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 · FAQ */}
      <section id="faq" className="scroll-mt-24 bg-white px-5 md:px-12 pb-16 md:pb-28">
        <div className="max-w-[1320px] mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          <div className="flex flex-col gap-4">
            <Kicker>05 · Questions fréquentes</Kicker>
            <h2 className="af-display m-0 font-black leading-[0.98] tracking-[-0.04em] text-[40px] md:text-[60px]">
              Tout ce qu’il faut <Serif className="text-[#1E4D2B]">savoir.</Serif>
            </h2>
            <p className="m-0 text-base leading-relaxed text-[#4A5A4F] max-w-[420px]">
              Livraison, paiement, confirmation : les réponses aux questions qu’on nous pose le plus.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ.map((f, i) => {
              const open = faqOpen === i;
              return (
                <div key={f.q} className="border border-[#E1E8E0] rounded-[20px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? -1 : i)}
                    aria-expanded={open}
                    className="w-full min-h-16 px-[22px] py-[18px] bg-transparent flex items-center justify-between gap-4 cursor-pointer text-left af-display font-bold text-lg text-[#0F1A14]"
                  >
                    <span>{f.q}</span>
                    <span
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold transition-transform ${
                        open ? 'bg-[#0B2A1A] text-white rotate-45' : 'bg-[#F2F5F1] text-[#0F1A14]'
                      }`}
                    >
                      +
                    </span>
                  </button>
                  {open && <p className="m-0 px-[22px] pb-5 text-[15px] leading-relaxed text-[#4A5A4F]">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-[#1E4D2B] text-white text-center px-5 md:px-12 py-20 md:py-32">
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/10" />
        <div className="relative max-w-[900px] mx-auto flex flex-col items-center gap-7">
          <h2 className="af-display m-0 font-black uppercase leading-[0.92] tracking-[-0.045em] text-[54px] sm:text-[78px] xl:text-[104px]">
            Prêt à
            <br />
            <Serif><span style={{ color: ACCENT }}>forger ?</span></Serif>
          </h2>
          <p className="m-0 text-lg leading-relaxed text-[#D6E3D5] max-w-[520px]">
            Commande aujourd’hui, reçois en 24–48h, paie à la livraison.
          </p>
          <a
            href="#produits"
            className="h-[62px] px-9 rounded-full text-[#0B2A1A] font-extrabold text-[17px] flex items-center gap-2.5 hover:opacity-90"
            style={{ background: ACCENT }}
          >
            Choisir mon produit <ArrowRight className="w-[18px] h-[18px]" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B2A1A] text-[#C9D8C8] px-5 md:px-12 pt-14 pb-24 md:pb-10">
        <div className="max-w-[1320px] mx-auto flex flex-col gap-10">
          <div className="flex flex-wrap justify-between gap-8">
            <div className="flex flex-col gap-3 max-w-[340px]">
              <span className="af-display font-black text-[28px] text-white tracking-[-0.02em]">AtlasForge</span>
              <span className="text-sm leading-relaxed">Nutrition sportive et santé au quotidien, pour le Maroc. Paiement à la livraison.</span>
            </div>
            <div className="flex flex-wrap gap-14 text-sm">
              <div className="flex flex-col gap-2.5">
                <span className="text-white font-bold">Produits</span>
                <a href="#produits" className="text-[#C9D8C8] hover:text-white">Protéine Musculaire</a>
                <a href="#produits" className="text-[#C9D8C8] hover:text-white">Collagen Marine</a>
                <a href="#produits" className="text-[#C9D8C8] hover:text-white">Mega Mass</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-white font-bold">Packs</span>
                <a href="#packs" className="text-[#C9D8C8] hover:text-white">Pack Duo</a>
                <a href="#packs" className="text-[#C9D8C8] hover:text-white">Pack Santé</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-white font-bold">Aide</span>
                <a href="#livraison" className="text-[#C9D8C8] hover:text-white">Livraison</a>
                <a href="#livraison" className="text-[#C9D8C8] hover:text-white">Paiement</a>
                <a href="#faq" className="text-[#C9D8C8] hover:text-white">FAQ</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E8EFE7]/15 pt-6 text-[13px] text-[#9FB5A0] flex flex-wrap justify-between gap-4">
            <span>© 2026 AtlasForge Sports Nutrition</span>
            <span>Complément alimentaire. Ne remplace pas une alimentation variée.</span>
            <a href="#spaceseller" className="text-[#9FB5A0] hover:text-white">Espace marchand</a>
          </div>
        </div>
      </footer>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#E1E8E0] px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(11,42,26,0.10)]">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-[#4A5A4F]">Packs dès</span>
          <span className="af-display font-black text-[22px]">{PACK_SANTE_PRODUCT.priceMAD} DH</span>
        </div>
        <a href="#produits" className="h-[50px] px-6 rounded-full bg-[#1E4D2B] text-white font-bold text-[15px] flex items-center">
          Commander
        </a>
      </div>
    </div>
  );
};
