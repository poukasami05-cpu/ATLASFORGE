import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Truck, CheckCircle2, DollarSign, Lock, Leaf, Sparkles, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, CustomerDetails, MoroccanCity, Order, PaymentMethod } from '../types';
import { MOROCCAN_CITIES, getProductDisplayMeta } from '../data/mockData';
import { syncOrderToGoogleSheets, SyncResult } from '../services/googleSheetsService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderPlaced: (order: Order, sync: SyncResult | null) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderPlaced,
}) => {
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Casablanca',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Layout Stability: Prevent background scrolling and scrollbar jitter
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const subtotalMAD = items.reduce((acc, item) => acc + item.priceMAD * item.quantity, 0);
  const shippingFeeMAD = subtotalMAD >= 500 ? 0 : 35;
  const totalMAD = subtotalMAD + shippingFeeMAD;

  const selectedCityInfo = MOROCCAN_CITIES.find((c) => c.name === customer.city) || MOROCCAN_CITIES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setErrorMsg('Veuillez renseigner votre nom, téléphone WhatsApp et adresse au Maroc.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const orderRef = `ATLAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingCode = `SP-MA-${Math.floor(100000 + Math.random() * 900000)}`;
    const awb = `AWB-SP-CAS-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderRef,
      spacesellerReference: `SP-${orderRef}`,
      trackingNumber: trackingCode,
      awbNumber: awb,
      customer,
      items,
      subtotalMAD,
      shippingMAD: shippingFeeMAD,
      discountMAD: 0,
      totalMAD,
      paymentMethod,
      fulfillmentStatus: 'synced_spaceseller',
      spacesellerSyncStatus: 'synced',
      lastSyncTimestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Synchronisation vers Google Sheets (Webhook 24h/24 → API directe → file locale)
    let syncResult: SyncResult | null = null;
    try {
      syncResult = await syncOrderToGoogleSheets(newOrder);
      if (!syncResult.success) {
        newOrder.spacesellerSyncStatus = 'pending';
      }
    } catch (syncErr) {
      console.warn('Sync notice:', syncErr);
      newOrder.spacesellerSyncStatus = 'failed';
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder, syncResult);
      onClose();
    }, 450);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop with smooth blur and fade-in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="min-h-full flex items-center justify-center p-3 sm:p-5 relative pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{
                type: 'spring',
                damping: 26,
                stiffness: 320,
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative my-6 pointer-events-auto"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-[#FAF9F7] to-white flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#1E4D2B] uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>COMMANDE SÉCURISÉE · SPACESELLER.MA</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#14171A] font-serif-heading mt-0.5">
                    Commander AtlasForge
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  aria-label="Fermer la fenêtre"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                {/* Banner: Fast COD & Bouskoura Hub */}
                <div className="bg-[#FAF9F7] p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-950 font-semibold font-mono">
                    <Sparkles className="w-4 h-4 text-[#1E4D2B]" />
                    <span>⚡ Commande Express COD</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-emerald-800 font-sans hidden sm:inline">Paiement en espèces à la livraison</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1E4D2B] bg-[#1E4D2B]/10 px-2 py-0.5 rounded-full font-mono shrink-0">
                    Hub Bouskoura 24h
                  </span>
                </div>

                {/* Visual Order Items Summary */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Produit(s) commandé(s) :
                  </span>
                  <div className="flex flex-col gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    {items.map((it, i) => {
                      const meta = getProductDisplayMeta(it.productId);
                      return (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center p-0.5 shrink-0">
                            <img
                              src={it.imageFallback || meta.image}
                              alt={`${meta.name} - ${it.flavorName}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate font-serif-heading">
                              {meta.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {it.weightLabel || meta.defaultWeight} · {it.flavorName} (×{it.quantity})
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#1E4D2B] font-mono shrink-0">
                          {it.priceMAD * it.quantity} MAD
                        </span>
                      </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Simple Moroccan Form Fields */}
                <div className="space-y-3 pt-1">
                  {/* Field 1: Nom Complet */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 font-serif-heading">
                      1. Nom & Prénom <span className="text-[#1E4D2B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex : Mehdi Bennani"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1E4D2B] focus:bg-white text-sm transition-colors"
                    />
                  </div>

                  {/* Field 2: WhatsApp Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 font-serif-heading">
                      2. Numéro de Téléphone WhatsApp <span className="text-[#1E4D2B]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="ex : 06 61 23 45 67"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1E4D2B] focus:bg-white font-mono text-sm transition-colors"
                    />
                    <span className="text-[10px] text-slate-500 font-sans-body mt-1 block">
                      Le coursier vous appellera avant de vous livrer le colis.
                    </span>
                  </div>

                  {/* Field 3: City & Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 font-serif-heading">
                      3. Ville & Adresse de Livraison au Maroc <span className="text-[#1E4D2B]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="sm:col-span-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1E4D2B] font-semibold"
                      >
                        {MOROCCAN_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name} ({c.deliveryTimeDays})
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        required
                        placeholder="Quartier, Rue, N° d'immeuble / résidence..."
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="sm:col-span-2 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1E4D2B] focus:bg-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery Guarantee */}
                <div className="p-3 rounded-xl border border-[#1E4D2B] bg-[#1E4D2B]/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-5 h-5 text-[#1E4D2B] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 font-serif-heading">
                        Paiement en Espèces à la Livraison (COD)
                      </p>
                      <p className="text-[11px] text-slate-600 font-sans-body">
                        Vérifiez votre flacon avant de donner l'argent au livreur.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#1E4D2B] text-white px-2 py-0.5 rounded font-mono shrink-0">
                    ✓ Garanti
                  </span>
                </div>

                {/* Pricing Breakdown */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-sans-body space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Sous-total articles :</span>
                    <span className="font-mono tabular-nums text-slate-900 font-bold">{subtotalMAD} MAD</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Délai de livraison ({customer.city}) :</span>
                    <span className="text-[#1E4D2B] font-bold">{selectedCityInfo.deliveryTimeDays}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pb-1.5 border-b border-slate-200">
                    <span>Frais d'expédition Spaceseller :</span>
                    <span className="font-mono tabular-nums text-slate-900">
                      {shippingFeeMAD === 0 ? (
                        <strong className="text-[#1E4D2B]">Gratuits (Offre Spéciale)</strong>
                      ) : (
                        `${shippingFeeMAD} MAD`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 font-serif-heading">
                    <span>Total à payer au livreur :</span>
                    <span className="text-[#1E4D2B] font-mono text-base tabular-nums">{totalMAD} MAD</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 sm:py-4 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'Transmission vers Google Sheets & Spaceseller.ma...'
                        : `Valider la Commande · ${totalMAD} MAD (COD)`}
                    </span>
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2 font-mono">
                    En validant, votre commande est automatiquement transmise à Google Sheets et au Hub Spaceseller à Bouskoura pour expédition sous 24h.
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-mono">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Synchronisation directe Google Sheets & Spaceseller.ma active</span>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
