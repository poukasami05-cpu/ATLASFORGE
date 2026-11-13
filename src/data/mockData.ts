import { Product, MoroccanCity, SpacesellerWebhook } from '../types';

export const FLAGSHIP_PRODUCT: Product = {
  id: 'atlas-protein-250',
  sku: 'AF-PM-250G',
  name: 'Protéine Musculaire',
  tagline: 'Isolat de Whey Ultra-Pur 250g | 100% Bio-Disponible',
  weightGrams: 250,
  weightLabel: '250g',
  priceMAD: 299,
  compareAtPriceMAD: 369,
  spacesellerSku: 'SP-ATLAS-PM250-WHEY',
  totalWarehouseStock: 480,
  description:
    'Formule athlétique de haute précision conçue pour stimuler l’hypertrophie musculaire et accélérer la régénération cellulaire. Conçue avec un isolat de lactosérum natif ultra-filtré à basse température, sans sucre ajouté, assurant une miscibilité instantanée et une assimilation rapide.',
  scientificFormula: 'Hydrolyzed Native Whey Isolate (CFM 93%) + L-Glutamine Micronisée + BCAA 4:1:1 Fermentés',
  flavors: [
    {
      id: 'chocolat-intense',
      name: 'Chocolat Noir Brut',
      tasteProfile: 'Cacao hollandais torréfié sans amertume, arômes naturels de fève pure',
      accentColor: '#10B981', // Forest Green AtlasForge signature
      accentGlow: 'rgba(16, 185, 129, 0.4)',
      inStock: true,
      stockUnits: 195,
    },
    {
      id: 'vanille-bourbon',
      name: 'Vanille Bourbon',
      tasteProfile: 'Notes soyeuses de gousse de Madagascar, texture veloutée ultra-onctueuse',
      accentColor: '#34D399',
      accentGlow: 'rgba(52, 211, 153, 0.35)',
      inStock: true,
      stockUnits: 142,
    },
    {
      id: 'matcha-energie',
      name: 'Matcha Uji & Menthe',
      tasteProfile: 'Matcha de cérémonie japonais antioxydant, fraîcheur vivifiante',
      accentColor: '#059669',
      accentGlow: 'rgba(5, 150, 105, 0.45)',
      inStock: true,
      stockUnits: 143,
    },
  ],
  nutritionFacts: [
    { label: 'Protéines Pures', amount: '24.2g', dailyValue: '48%', highlight: true },
    { label: 'BCAA Naturels (4:1:1)', amount: '5.6g', dailyValue: '26%', highlight: true },
    { label: 'L-Glutamine', amount: '4.4g', dailyValue: '-', highlight: false },
    { label: 'Énergie / Calories', amount: '108 kcal', dailyValue: '5%', highlight: false },
    { label: 'Glucides totaux', amount: '0.6g', dailyValue: '<1%', highlight: false },
    { label: 'Dont Sucres ajoutés', amount: '0.0g', dailyValue: '0%', highlight: true },
    { label: 'Lipides', amount: '0.4g', dailyValue: '<1%', highlight: false },
    { label: 'Dont Acides Gras Saturés', amount: '0.1g', dailyValue: '<1%', highlight: false },
    { label: 'Sodium & Électrolytes', amount: '110mg', dailyValue: '4%', highlight: false },
  ],
  keyBenefits: [
    {
      title: 'Synthèse Musculaire Maximale',
      description: 'Ratio BCAA 4:1:1 riche en L-Leucine activant directement la voie anabolique mTOR.',
      icon: 'Zap',
    },
    {
      title: 'Micro-Filtration CFM Native',
      description: 'Filtration membranaire à froid préservant les fractions peptidiques et immunoglobulines.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Digestibilité & Zéro Ballonnement',
      description: 'Teneur résiduelle en lactose inférieure à 0.2%, enrichie en complexe enzymatique végétal.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Packaging Ergonomique 250g',
      description: 'Format nomade compact idéal pour 10 entraînements intensifs, fraîcheur hermétique garantie.',
      icon: 'Package',
    },
  ],
};

export const COLLAGEN_PRODUCT: Product = {
  id: 'atlas-collagen-250',
  sku: 'AF-CM-250G',
  name: 'Collagen Marine',
  tagline: 'Ssiha dyal l-jild, l-ch3r, l-aðafr w l-mafasel f montaaj wahed !',
  weightGrams: 250,
  weightLabel: '250g',
  priceMAD: 299,
  compareAtPriceMAD: 379,
  spacesellerSku: 'SP-ATLAS-CM250-MAR',
  totalWarehouseStock: 360,
  description:
    'Ssiha dyal l-jild, l-ch3r, l-aðafr w l-mafasel f montaaj wahed ! Formule d’élite à base de collagène marin hydrolysé Type I & III pur. Conçu pour soulager l’usure des articulations chez les athlètes, booster l’élasticité de la peau et fortifier ongles et cheveux. Assimilation cellulaire rapide supérieure à 95% sans goût désagréable.',
  scientificFormula: 'Hydrolyzed Marine Collagen Peptides (< 2000 Da) Type I & III + Zinc Chélaté + Vitamine C Bio-Active',
  flavors: [
    {
      id: 'collagen-neutre',
      name: 'Neutre Bio-Pure',
      tasteProfile: 'Zéro goût ni odeur résiduelle de poisson, dissolution cristalline instantanée dans eau, café ou shake',
      accentColor: '#1E4D2B',
      accentGlow: 'rgba(30, 77, 43, 0.35)',
      inStock: true,
      stockUnits: 210,
    },
    {
      id: 'collagen-citron-vitc',
      name: 'Citron Zeste & Vitamine C',
      tasteProfile: 'Infusion fraîche de citron méditerranéen bio stimulant naturellement la synthèse endogène de collagène',
      accentColor: '#2E7D32',
      accentGlow: 'rgba(46, 125, 50, 0.4)',
      inStock: true,
      stockUnits: 150,
    },
  ],
  nutritionFacts: [
    { label: 'Collagène Marin Hydrolysé', amount: '9.8g', dailyValue: '98%', highlight: true },
    { label: 'Protéines Peptidiques', amount: '9.2g', dailyValue: '18%', highlight: true },
    { label: 'Glycine, Proline & Hydroxyproline', amount: '4.8g', dailyValue: '-', highlight: true },
    { label: 'Vitamine C Bio-Active', amount: '80mg', dailyValue: '100%', highlight: true },
    { label: 'Zinc Chélaté', amount: '10mg', dailyValue: '100%', highlight: false },
    { label: 'Glucides & Sucres', amount: '0.0g', dailyValue: '0%', highlight: true },
    { label: 'Lipides & Graisses', amount: '0.0g', dailyValue: '0%', highlight: false },
    { label: 'Calories', amount: '38 kcal', dailyValue: '<2%', highlight: false },
    { label: 'Sodium', amount: '18mg', dailyValue: '<1%', highlight: false },
  ],
  keyBenefits: [
    {
      title: 'Maintien & Régénération Articulaire (Mafasel)',
      description: 'Soulage l’usure des genoux et articulations soumises aux charges intenses et accélère la réparation tendineuse.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Éclat, Jeunesse & Élasticité (L-Jild)',
      description: 'Hydrate les couches profondes de la peau, estompe les ridules et procure un teint tonifié et lumineux.',
      icon: 'Sparkles',
    },
    {
      title: 'Solidité Cheveux & Ongles (Ch3r & Aðafr)',
      description: 'Nourrit la racine du cheveu et renforce la matrice de kératine pour stopper le dédoublement des ongles.',
      icon: 'Zap',
    },
    {
      title: 'Biodisponibilité Éclair < 2000 Daltons',
      description: 'Micro-peptides hydrolysés assimilés 1.5x plus vite que le collagène bovin conventionnel, sans inconfort gastrique.',
      icon: 'HeartHandshake',
    },
  ],
};

export const ALL_PRODUCTS: Product[] = [FLAGSHIP_PRODUCT, COLLAGEN_PRODUCT];

export const MOROCCAN_CITIES: MoroccanCity[] = [
  { name: 'Casablanca', region: 'Grand Casablanca', deliveryTimeDays: '24h Express', codAvailable: true },
  { name: 'Rabat', region: 'Rabat-Salé-Kénitra', deliveryTimeDays: '24h Express', codAvailable: true },
  { name: 'Marrakech', region: 'Marrakech-Safi', deliveryTimeDays: '24h-48h', codAvailable: true },
  { name: 'Tanger', region: 'Tanger-Tétouan-Al Hoceïma', deliveryTimeDays: '24h-48h', codAvailable: true },
  { name: 'Fès', region: 'Fès-Meknès', deliveryTimeDays: '48h', codAvailable: true },
  { name: 'Meknès', region: 'Fès-Meknès', deliveryTimeDays: '48h', codAvailable: true },
  { name: 'Agadir', region: 'Souss-Massa', deliveryTimeDays: '48h', codAvailable: true },
  { name: 'Kénitra', region: 'Rabat-Salé-Kénitra', deliveryTimeDays: '24h-48h', codAvailable: true },
  { name: 'Oujda', region: 'Oriental', deliveryTimeDays: '48h-72h', codAvailable: true },
  { name: 'Mohammedia', region: 'Grand Casablanca', deliveryTimeDays: '24h Express', codAvailable: true },
];

export const INITIAL_WEBHOOK_LOGS: SpacesellerWebhook[] = [
  {
    id: 'evt_sp_99182',
    event: 'order.delivered',
    timestamp: '2026-11-08T12:45:00Z',
    status: 'delivered',
    payload: {
      orderId: 'ATLAS-7821',
      spacesellerTracking: 'SP-MA-8819024',
      recipientCity: 'Casablanca - Maarif',
      paymentCollectedMAD: 598.0,
      collectedVia: 'Cash On Delivery (Amana / Spaceseller Courier)',
      deliveredAt: '2026-11-08T12:44:18Z',
    },
  },
  {
    id: 'evt_sp_99181',
    event: 'order.shipped',
    timestamp: '2026-11-08T10:15:22Z',
    status: 'acknowledged',
    payload: {
      orderId: 'ATLAS-7820',
      awb: 'AWB-SP-CAS-99120',
      carrier: 'Spaceseller Logistics Hub Bouskoura',
      estimatedDelivery: '2026-11-09',
    },
  },
  {
    id: 'evt_sp_99180',
    event: 'inventory.updated',
    timestamp: '2026-11-08T08:00:00Z',
    status: 'delivered',
    payload: {
      sku: 'SP-ATLAS-PM250-WHEY',
      warehouse: 'Casablanca Center 01',
      quantityOnHand: 480,
      reserved: 24,
      availableForSale: 456,
    },
  },
];
