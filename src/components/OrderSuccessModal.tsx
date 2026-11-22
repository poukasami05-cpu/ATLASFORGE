import React, { useEffect } from 'react';
import { CheckCircle2, Truck, Package, ExternalLink, Leaf, FileSpreadsheet, AlertTriangle } from 'lucide-react';
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

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  sync,
  onClose,
  onOpenSpacesellerHub,
}) => {
  useEffect(() => {
    if (order) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1E4D2B', '#2E7D32', '#14171A', '#FAFAFA'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative my-8">
        <div className="p-6 text-center border-b border-slate-200 bg-[#FAFAFA] flex flex-col items-center">
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
          <span className="text-[11px] font-mono font-bold text-[#1E4D2B] uppercase tracking-widest flex items-center justify-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>EXPÉDITION EN COURS · SPACESELLER.MA</span>
          </span>
          <h2 className="text-xl font-bold text-[#14171A] font-serif-heading mt-1">
            Commande #{order.id} Confirmée !
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-sans-body">
            Merci <strong className="text-slate-900 font-bold">{order.customer.fullName}</strong>. Votre commande officielle AtlasForge est en cours de préparation au Hub de Bouskoura.
          </p>
        </div>

        <div className="p-6 space-y-4 text-xs font-sans-body">
          {/* Tracking Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Numéro de Suivi Spaceseller</span>
              <span className="text-[#1E4D2B] font-bold text-sm">{order.trackingNumber}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Bordereau AWB Transport</span>
              <span className="text-slate-800 font-bold">{order.awbNumber}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Destination</span>
              <span className="text-slate-800">{order.customer.city} · 24h Express</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Montant COD exigible au livreur</span>
              <span className="text-[#1E4D2B] font-bold">{order.totalMAD} MAD (Espèces)</span>
            </div>
          </div>

          {/* Statut réel Google Sheets */}
          {sync && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                sync.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              {sync.success ? (
                <FileSpreadsheet className="w-4 h-4 shrink-0 mt-0.5 text-[#1E4D2B]" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-[11px]">
                  {sync.success
                    ? sync.confirmed
                      ? '✓ Ajoutée dans Google Sheets'
                      : '✓ Envoyée à Google Sheets (non confirmée)'
                    : '⏳ En attente de synchronisation Google Sheets'}
                </p>
                <p className="text-[10px] opacity-80">{sync.message}</p>
                {!sync.success && sync.reason && (
                  <p className="text-[10px] opacity-80">
                    <strong>Raison :</strong> {sync.reason}
                  </p>
                )}
                {!sync.success && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSpacesellerHub();
                    }}
                    className="mt-1 text-[10px] font-bold underline text-amber-900 cursor-pointer"
                  >
                    Ouvrir l’espace Google Sheets →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Delivery Process steps */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-start gap-2.5">
              <Package className="w-4 h-4 text-[#1E4D2B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">1. Emballage hermétique à Bouskoura</p>
                <p className="text-[10px] text-slate-500">Protection thermique de l'isolat 250g.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#1E4D2B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">2. Prise en charge par le coursier</p>
                <p className="text-[10px] text-slate-500">
                  Le livreur vous appellera au <span className="font-mono text-[#1E4D2B] font-bold">{order.customer.phone}</span> pour convenir du moment de livraison.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSpacesellerHub();
              }}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors border border-slate-300 flex items-center justify-center gap-1.5"
            >
              <span>Suivi Spaceseller Hub</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#1E4D2B]" />
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold rounded-xl transition-colors shadow-xs"
            >
              Continuer la Navigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
