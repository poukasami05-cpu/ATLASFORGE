/**
 * AtlasForge Sports Nutrition - Storefront Application
 * Nouveau design (vert & blanc, luxe + sport).
 *
 * - La boutique : <Storefront /> (src/components/Hero.tsx)
 * - L'espace marchand (Google Sheets / Spaceseller) : ouvrir le site avec #spaceseller
 *   à la fin de l'adresse, ou cliquer « Espace marchand » en bas de page.
 */

import React, { useEffect, useState } from 'react';
import { Storefront } from './components/Hero';
import { SpacesellerHub } from './components/SpacesellerHub';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CartItem, Order } from './types';
import { SyncResult } from './services/googleSheetsService';
import { ArrowLeft } from 'lucide-react';
import { initMetaPixel, trackPixel } from './services/metaPixel';

const isMerchantHash = () => typeof window !== 'undefined' && window.location.hash === '#spaceseller';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [orderSync, setOrderSync] = useState<SyncResult | null>(null);
  const [showMerchant, setShowMerchant] = useState<boolean>(isMerchantHash());

  // Meta Pixel (pubs Facebook / Instagram)
  useEffect(() => {
    initMetaPixel();
  }, []);

  // Espace marchand : visible seulement avec #spaceseller (les clients ne le voient pas)
  useEffect(() => {
    const onHash = () => {
      setShowMerchant(isMerchantHash());
      if (isMerchantHash()) window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const openMerchant = () => {
    window.location.hash = 'spaceseller';
  };

  const closeMerchant = () => {
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setShowMerchant(false);
    window.scrollTo({ top: 0 });
  };

  const mergeIntoCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.productId === newItem.productId &&
          it.flavorId === newItem.flavorId &&
          it.purchaseType === newItem.purchaseType
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], quantity: copy[existingIdx].quantity + newItem.quantity };
        return copy;
      }
      return [...prev, newItem];
    });
  };

  const handleAddToCart = (newItem: CartItem) => {
    mergeIntoCart(newItem);
    trackPixel('AddToCart', { content_ids: [newItem.productId], value: newItem.priceMAD * newItem.quantity, currency: 'MAD' });
    setIsCartOpen(true);
  };

  // Achat direct (bouton « اطلب الباك دابا ») : on ouvre directement le formulaire de commande
  const handleBuyNow = (newItem: CartItem) => {
    mergeIntoCart(newItem);
    trackPixel('InitiateCheckout', { content_ids: [newItem.productId], value: newItem.priceMAD * newItem.quantity, currency: 'MAD' });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], quantity: newQty };
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceedToCheckoutFromCart = () => {
    setIsCartOpen(false);
    if (cartItems.length > 0) setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order: Order, sync: SyncResult | null) => {
    setConfirmedOrder(order);
    setOrderSync(sync);
    if (!sync || sync.success) {
      trackPixel('Purchase', {
        value: order.totalMAD,
        currency: 'MAD',
        content_ids: order.items.map((it) => it.productId),
        content_type: 'product',
        num_items: order.items.reduce((a, it) => a + it.quantity, 0),
      });
    }
    // Si la commande n'a pas pu être envoyée, on garde le panier pour que le client réessaie
    if (!sync || sync.success) setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-[#0F1A14] flex flex-col selection:bg-[#1E4D2B] selection:text-white">
      {showMerchant ? (
        <main className="flex-1">
          <div className="bg-[#0B2A1A] px-5 md:px-12 py-4">
            <button
              type="button"
              onClick={closeMerchant}
              className="text-white font-semibold text-sm flex items-center gap-2 cursor-pointer hover:opacity-80"
            >
              <ArrowLeft className="w-4 h-4" /> Retour à la boutique
            </button>
          </div>
          <SpacesellerHub />
        </main>
      ) : (
        <Storefront cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
      )}

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderSuccessModal
        order={confirmedOrder}
        sync={orderSync}
        onClose={() => {
          setConfirmedOrder(null);
          setOrderSync(null);
        }}
        onOpenSpacesellerHub={openMerchant}
      />
    </div>
  );
}
