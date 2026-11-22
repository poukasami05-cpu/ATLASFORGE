/**
 * AtlasForge Sports Nutrition - Storefront Application
 * Classic & Bio-inspired Sports Nutrition Architecture
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { BrandStory } from './components/BrandStory';
import { ReviewsSection } from './components/ReviewsSection';
import { ScienceSection } from './components/ScienceSection';
import { SpacesellerHub } from './components/SpacesellerHub';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { StickyBuyBar } from './components/StickyBuyBar';
import { Footer } from './components/Footer';
import { CollagenSection } from './components/CollagenSection';
import { MegaMassSection } from './components/MegaMassSection';
import { FLAGSHIP_PRODUCT, COLLAGEN_PRODUCT, MEGA_MASS_PRODUCT, PACK_DUO_PRODUCT } from './data/mockData';
import { CartItem, FlavorOption, Order } from './types';
import { SyncResult } from './services/googleSheetsService';
import { Leaf } from 'lucide-react';

export default function App() {
  const [activeFlavor, setActiveFlavor] = useState<FlavorOption>(FLAGSHIP_PRODUCT.flavors[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [orderSync, setOrderSync] = useState<SyncResult | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.productId === newItem.productId &&
          it.flavorId === newItem.flavorId &&
          it.purchaseType === newItem.purchaseType
      );
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuickCheckout = (item: CartItem) => {
    handleAddToCart(item);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAddDuoBundle = () => {
    const packItem: CartItem = {
      productId: PACK_DUO_PRODUCT.id,
      flavorId: PACK_DUO_PRODUCT.flavors[0].id,
      flavorName: PACK_DUO_PRODUCT.flavors[0].name,
      weightLabel: PACK_DUO_PRODUCT.weightLabel,
      priceMAD: PACK_DUO_PRODUCT.priceMAD,
      quantity: 1,
      purchaseType: 'one-time',
      imageFallback: '/assets/atlasforge-pack-duo.jpg',
    };
    setCartItems([packItem]);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckoutFromCart = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order: Order, sync: SyncResult | null) => {
    setConfirmedOrder(order);
    setOrderSync(sync);
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#14171A] flex flex-col selection:bg-[#1E4D2B] selection:text-white">
      {/* Top Banner */}
      <div className="bg-[#1E4D2B] text-white py-2 px-4 text-center text-xs font-medium flex items-center justify-center gap-1.5 font-sans-body">
        <Leaf className="w-3.5 h-3.5" />
        <span>
          <strong>AtlasForge Bio-Luxe :</strong> Protéine Musculaire, Collagen Marine & Mega Mass · Expédition 24h via <strong>spaceseller.ma</strong> (Paiement à la livraison)
        </span>
      </div>

      {/* Top Bar Contract Navbar */}
      <Navbar
        cartItemCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Campaign (Mega Mass Flagship) */}
        <Hero
          onExploreProduct={() => handleNavigate('product')}
          onOpenSpaceseller={() => handleNavigate('spaceseller')}
          onOpenOrderModal={() =>
            handleQuickCheckout({
              productId: MEGA_MASS_PRODUCT.id,
              flavorId: MEGA_MASS_PRODUCT.flavors[0].id,
              flavorName: MEGA_MASS_PRODUCT.flavors[0].name,
              weightLabel: MEGA_MASS_PRODUCT.weightLabel,
              priceMAD: MEGA_MASS_PRODUCT.priceMAD,
              quantity: 1,
              purchaseType: 'one-time',
              imageFallback: '/assets/aistudio/914166009_992279166760564_2026284814750205857_n_e33294fe.png',
            })
          }
          onExploreCollagen={() => handleNavigate('collagen')}
          onExploreMegaMass={() => handleNavigate('megamass')}
        />

        {/* 2. Flagship Triple Product Section (Side-by-Side with Athlete Context) */}
        <ProductSection
          proteinProduct={FLAGSHIP_PRODUCT}
          collagenProduct={COLLAGEN_PRODUCT}
          megaMassProduct={MEGA_MASS_PRODUCT}
          packDuoProduct={PACK_DUO_PRODUCT}
          activeFlavor={activeFlavor}
          onFlavorChange={setActiveFlavor}
          onAddToCart={handleAddToCart}
          onQuickCheckout={handleQuickCheckout}
          onAddDuoBundle={handleAddDuoBundle}
        />

        {/* 3. Dedicated Collagen Marine Section */}
        <CollagenSection
          product={COLLAGEN_PRODUCT}
          onAddToCart={handleAddToCart}
          onQuickCheckout={handleQuickCheckout}
          onAddDuoBundle={handleAddDuoBundle}
        />

        {/* 3b. Dedicated Mega Mass Section (Prise de Masse & Force) */}
        <MegaMassSection
          product={MEGA_MASS_PRODUCT}
          onAddToCart={handleAddToCart}
          onQuickCheckout={handleQuickCheckout}
        />

        {/* 4. Brand Story: Bio & Pure Sports Nutrition */}
        <BrandStory />

        {/* 4. Verified Moroccan Customer & Athlete Reviews */}
        <ReviewsSection />

        {/* 5. Scientific Formulation & CFM Micro-Filtration */}
        <ScienceSection />

        {/* 6. Spaceseller.ma Logistics & Delivery Hub */}
        <SpacesellerHub />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Sticky Conversion Buy Bar (Desktop & Mobile) */}
      <StickyBuyBar
        productPriceMAD={FLAGSHIP_PRODUCT.priceMAD}
        compareAtPriceMAD={FLAGSHIP_PRODUCT.compareAtPriceMAD}
        activeFlavor={activeFlavor}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

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
        items={
          cartItems.length > 0
            ? cartItems
            : [
                {
                  productId: FLAGSHIP_PRODUCT.id,
                  flavorId: activeFlavor.id,
                  flavorName: activeFlavor.name,
                  weightLabel: '250g',
                  priceMAD: FLAGSHIP_PRODUCT.priceMAD,
                  quantity: 1,
                  purchaseType: 'one-time',
                },
              ]
        }
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderSuccessModal
        order={confirmedOrder}
        sync={orderSync}
        onClose={() => {
          setConfirmedOrder(null);
          setOrderSync(null);
        }}
        onOpenSpacesellerHub={() => handleNavigate('spaceseller')}
      />
    </div>
  );
}
