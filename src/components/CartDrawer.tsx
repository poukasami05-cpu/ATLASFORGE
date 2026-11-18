import React, { useEffect } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { getProductDisplayMeta } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  // Lock background scroll & handle Escape key smoothly across all devices
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalMAD = items.reduce((acc, item) => acc + item.priceMAD * item.quantity, 0);
  const freeShippingThresholdMAD = 500;
  const missingForFreeShipping = Math.max(0, freeShippingThresholdMAD - subtotalMAD);
  const freeShippingProgress = Math.min(100, Math.round((subtotalMAD / freeShippingThresholdMAD) * 100));
  const shippingFeeMAD = subtotalMAD >= freeShippingThresholdMAD || items.length === 0 ? 0 : 35;
  const totalMAD = subtotalMAD + shippingFeeMAD;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Responsive Drawer Container: Full width on narrow phones, capped cleanly on tablet & desktop */}
          <div className="fixed inset-y-0 right-0 flex max-w-full w-full sm:w-auto justify-end pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-[420px] md:w-[448px] max-w-full h-[100dvh] bg-white border-l border-slate-200 flex flex-col shadow-2xl pointer-events-auto"
            >
              {/* Header */}
              <div className="px-4 py-3.5 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-3 bg-[#FAFAFA] shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <ShoppingBag className="w-5 h-5 text-[#1E4D2B] shrink-0" />
                  <h2 className="text-sm sm:text-base font-bold text-[#14171A] font-serif-heading truncate">
                    Votre Panier AtlasForge
                  </h2>
                  <span className="text-xs font-bold text-[#1E4D2B] bg-[#1E4D2B]/10 px-2 py-0.5 rounded-full font-mono shrink-0 tabular-nums">
                    {totalUnits}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors shrink-0 cursor-pointer"
                  aria-label="Fermer le panier"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="px-4 py-3 sm:p-4 bg-[#F4F7F4] border-b border-slate-200 shrink-0">
                <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs mb-1.5 font-sans-body">
                  <span className="text-slate-700 font-medium leading-snug">
                    {missingForFreeShipping === 0 && items.length > 0 ? (
                      <span className="text-[#1E4D2B] font-bold">✓ Livraison Gratuite Débloquée !</span>
                    ) : (
                      <>
                        Plus que <strong className="text-slate-900 font-bold">{missingForFreeShipping} MAD</strong> pour la livraison gratuite
                      </>
                    )}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#1E4D2B] shrink-0 tabular-nums">
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1E4D2B] rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4 bg-[#FAFAFA]">
                {items.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 px-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 font-serif-heading">
                      Votre panier est vide (0)
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5 font-sans-body leading-relaxed">
                      Découvrez nos formules bio AtlasForge : Protéine Musculaire, Collagen Marine, Mega Mass et Pack Duo.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        const el = document.getElementById('product');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-[#1E4D2B] hover:bg-[#163a20] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Découvrir le Catalogue
                    </button>
                  </div>
                ) : (
                  items.map((item, idx) => {
                    const meta = getProductDisplayMeta(item.productId);
                    return (
                      <div
                        key={`${item.productId}-${item.flavorId}-${idx}`}
                        className="p-3 sm:p-3.5 bg-white border border-slate-200 rounded-xl flex items-start gap-3 shadow-xs"
                      >
                        {/* Miniature Product Bottle */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#FAF9F7] border border-slate-200 flex items-center justify-center shrink-0 p-1 overflow-hidden">
                          <img
                            src={item.imageFallback || meta.image}
                            alt={`${meta.name} ${item.weightLabel || meta.defaultWeight}`}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 font-serif-heading leading-snug line-clamp-2">
                              {meta.name} · {item.flavorName}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 -mr-1 transition-colors shrink-0 cursor-pointer"
                              aria-label="Supprimer cet article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-slate-500 mb-2.5 font-mono">
                            {item.purchaseType === 'subscription' ? 'Abonnement (-15%)' : 'Achat unique'} · {item.weightLabel || meta.defaultWeight}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 px-1 py-0.5">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-600 hover:text-black text-xs font-bold cursor-pointer"
                                aria-label="Diminuer la quantité"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-slate-800 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-slate-600 hover:text-black text-xs font-bold cursor-pointer"
                                aria-label="Augmenter la quantité"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums font-mono shrink-0">
                              {item.priceMAD * item.quantity} MAD
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Summary & Checkout CTA */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-white shrink-0">
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3.5 font-sans-body">
                    <div className="flex justify-between gap-2">
                      <span>Sous-total</span>
                      <span className="text-slate-900 font-mono tabular-nums font-medium">{subtotalMAD} MAD</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Livraison Maroc (Spaceseller)</span>
                      <span className="text-slate-900 font-mono tabular-nums">
                        {shippingFeeMAD === 0 ? (
                          <span className="text-[#1E4D2B] font-bold">Gratuite</span>
                        ) : (
                          `${shippingFeeMAD} MAD`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline gap-2 text-xs sm:text-sm font-bold text-slate-900 pt-2 border-t border-slate-200 font-serif-heading">
                      <span>Total à payer à la livraison</span>
                      <span className="text-[#1E4D2B] font-mono tabular-nums text-sm sm:text-base shrink-0">
                        {totalMAD} MAD
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onProceedToCheckout}
                    className="w-full py-3 sm:py-3.5 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-2 cursor-pointer mb-2.5"
                  >
                    <span>Commander (Paiement à la livraison)</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-slate-500 text-center font-mono">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-[#1E4D2B] shrink-0" /> Expédié sous 24h
                    </span>
                    <span aria-hidden="true" className="hidden xs:inline">·</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#1E4D2B] shrink-0" /> COD Garanti Spaceseller
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
