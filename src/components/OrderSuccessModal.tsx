import React, { useEffect } from 'react';
import { CheckCircle2, Truck, PhoneCall, Leaf, AlertTriangle } from 'lucide-react';
import { SyncResult } from '../services/googleSheetsService';
import { Order } from '../types';
import { getProductDisplayMeta } from '../data/mockData';
import confetti from 'canvas-confetti';

interface OrderSuccessModalProps {
  order: Order | null;
  sync?: SyncResult | null;
  onClose: () => void;
  onOpenSpacesellerHub: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, sync, onClose }) => {
  const failed = !!sync && !sync.success;

  useEffect(() => {
    if (order && !failed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1E4D2B', '#B9F26B', '#0B2A1A', '#FFFFFF'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [order, failed]);

  if (!order) return null;

  // Commande NON transmise : on le dit clairement au client (son panier est gardé pour réessayer)
  if (failed) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-[#0F1A14]">Commande non envoyée</h2>
          <p className="text-sm text-slate-600">
            Un problème de connexion a empêché l’envoi de ta commande. Ton panier est gardé : réessaie dans quelques
            instants.
          </p>
          <p dir="rtl" lang="ar" className="text-sm text-slate-600">
            وقع مشكل فالاتصال وما تصيفطاتش الطلبية ديالك. السلة ديالك باقة، عاود جرب من بعد شوية.
          </p>
          {sync?.reason && <p className="text-[10px] text-slate-400 font-mono break-words">{sync.reason}</p>}
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full py-3 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative my-8">
        <div className="p-6 text-center border-b border-slate-200 bg-[#F2F5F1] flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-1.5 shadow-sm mx-auto flex items-center justify-center">
              <img
                src={
                  order.items[0]?.imageFallback ||
                  getProductDisplayMeta(order.items[0]?.productId || 'atlas-protein-250').image
                }
                alt="AtlasForge"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1E4D2B] text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#1E4D2B] uppercase tracking-widest flex items-center justify-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Commande reçue</span>
          </span>
          <h2 className="text-2xl font-black text-[#0F1A14] mt-1">Merci {order.customer.fullName} !</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            Ta commande <strong className="text-slate-900">{order.id}</strong> est bien reçue. On t’appelle très vite pour
            la confirmer.
          </p>
          <p dir="rtl" lang="ar" className="text-sm text-slate-600 mt-1">
            توصلنا بالطلبية ديالك، غادي نعيطو ليك قريب باش نأكدوها.
          </p>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Récapitulatif */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">N° de commande</span>
              <span className="text-[#1E4D2B] font-bold text-sm">{order.id}</span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-slate-500">Livraison</span>
              <span className="text-slate-800">{order.customer.city} · 24–48h</span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-slate-500">À payer au livreur</span>
              <span className="text-[#1E4D2B] font-bold">{order.totalMAD} DH (espèces)</span>
            </div>
          </div>

          {/* Étapes */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-start gap-2.5">
              <PhoneCall className="w-4 h-4 text-[#1E4D2B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-[12px]">1. Confirmation par téléphone</p>
                <p className="text-[11px] text-slate-500">
                  On t’appelle au <span className="font-bold text-[#1E4D2B]">{order.customer.phone}</span> pour confirmer
                  ta commande et ton adresse.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#1E4D2B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-[12px]">2. Livraison et paiement</p>
                <p className="text-[11px] text-slate-500">
                  Le livreur t’appelle avant de passer. Tu paies en espèces à la réception.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};
