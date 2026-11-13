import React from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Truck, ShoppingBag, Leaf } from 'lucide-react';
import { CartItem } from '../types';

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
  if (!isOpen) return null;

  const subtotalMAD = items.reduce((acc, item) => acc + item.priceMAD * item.quantity, 0);
  const freeShippingThresholdMAD = 500;
  const missingForFreeShipping = Math.max(0, freeShippingThresholdMAD - subtotalMAD);
  const freeShippingProgress = Math.min(100, Math.round((subtotalMAD / freeShippingThresholdMAD) * 100));
  const shippingFeeMAD = subtotalMAD >= freeShippingThresholdMAD || items.length === 0 ? 0 : 35;
  const totalMAD = subtotalMAD + shippingFeeMAD;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#FAFAFA]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1E4D2B]" />
              <h2 className="text-base font-bold text-[#14171A] font-serif-heading">
                Votre Panier AtlasForge
              </h2>
              <span className="text-xs text-slate-500 font-mono">({items.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-4 bg-[#F4F7F4] border-b border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5 font-sans-body">
              <span className="text-slate-700 font-medium">
                {missingForFreeShipping === 0 ? (
                  <span className="text-[#1E4D2B] font-bold">✓ Livraison Gratuite Débloquée !</span>
                ) : (
                  <>
                    Plus que <strong className="text-slate-900 font-bold">{missingForFreeShipping} MAD</strong> pour la livraison gratuite
                  </>
                )}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#1E4D2B]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E4D2B] rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAFAFA]">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1 font-serif-heading">Votre panier est vide</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5 font-sans-body">
                  Découvrez notre isolat de haute pureté Protéine Musculaire 250g.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#1E4D2B] hover:bg-[#163a20] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Découvrir la Protéine 250g
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.flavorId}-${idx}`}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl flex gap-3.5 shadow-xs"
                >
                  {/* Miniature Product Bottle */}
                  <div className="w-16 h-16 rounded-xl bg-[#FAF9F7] border border-slate-200 flex items-center justify-center shrink-0 p-1 overflow-hidden">
                    <img
                      src={
                        item.imageFallback ||
                        (item.productId === 'atlas-collagen-250'
                          ? '/assets/aistudio/Gemini_Generated_Image_kd9pffkd9pffkd9p_2bc27242.jpg'
                          : '/assets/aistudio/image_789e9c1a.png')
                      }
                      alt={item.productId === 'atlas-collagen-250' ? 'Collagen Marine 250g' : 'AtlasForge Protéine 250g'}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate font-serif-heading">
                        {item.productId === 'atlas-collagen-250' ? 'Collagen Marine' : 'Protéine Musculaire'} · {item.flavorName}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors"
                        aria-label="Supprimer cet article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mb-2 font-mono">
                      {item.purchaseType === 'subscription' ? 'Abonnement (-15%)' : 'Achat unique'} · 250g
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-black text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-black text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900 tabular-nums font-mono">
                        {item.priceMAD * item.quantity} MAD
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white">
              <div className="space-y-1.5 text-xs text-slate-600 mb-4 font-sans-body">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="text-slate-900 font-mono tabular-nums">{subtotalMAD} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison Maroc (Spaceseller)</span>
                  <span className="text-slate-900 font-mono tabular-nums">
                    {shippingFeeMAD === 0 ? (
                      <span className="text-[#1E4D2B] font-bold">Gratuite</span>
                    ) : (
                      `${shippingFeeMAD} MAD`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200 font-serif-heading">
                  <span>Total à payer à la livraison</span>
                  <span className="text-[#1E4D2B] font-mono tabular-nums text-base">
                    {totalMAD} MAD
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#1E4D2B]/20 flex items-center justify-center gap-2 cursor-pointer mb-3"
              >
                <span>Commander (Paiement à la livraison)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 text-center font-mono">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#1E4D2B]" /> Expédié sous 24h
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#1E4D2B]" /> COD Garanti Spaceseller
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
