/**
 * AtlasForge Sports Nutrition & Spaceseller.ma Types
 */

export interface FlavorOption {
  id: string;
  name: string;
  tasteProfile: string;
  accentColor: string; // Hex color for label accent in 3D & UI
  accentGlow: string;
  inStock: boolean;
  stockUnits: number;
}

export interface NutritionFact {
  label: string;
  amount: string;
  dailyValue?: string;
  highlight?: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  weightGrams: number;
  weightLabel: string;
  priceMAD: number;
  compareAtPriceMAD: number;
  flavors: FlavorOption[];
  nutritionFacts: NutritionFact[];
  keyBenefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  description: string;
  scientificFormula: string;
  spacesellerSku: string;
  totalWarehouseStock: number;
}

export interface CartItem {
  productId: string;
  flavorId: string;
  flavorName: string;
  weightLabel: string;
  priceMAD: number;
  quantity: number;
  purchaseType: 'one-time' | 'subscription';
  imageFallback?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export type PaymentMethod = 'cod' | 'card';

export interface Order {
  id: string;
  spacesellerReference: string;
  trackingNumber: string;
  awbNumber: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotalMAD: number;
  shippingMAD: number;
  discountMAD: number;
  totalMAD: number;
  paymentMethod: PaymentMethod;
  fulfillmentStatus: 'unfulfilled' | 'synced_spaceseller' | 'processing' | 'out_for_delivery' | 'delivered';
  spacesellerSyncStatus: 'synced' | 'pending' | 'failed';
  lastSyncTimestamp: string;
  createdAt: string;
}

export interface SpacesellerWebhook {
  id: string;
  event: 'order.created' | 'order.confirmed' | 'order.shipped' | 'order.delivered' | 'inventory.updated' | 'cod.collected';
  timestamp: string;
  status: 'delivered' | 'acknowledged' | 'processing';
  payload: Record<string, any>;
}

export interface MoroccanCity {
  name: string;
  region: string;
  deliveryTimeDays: string;
  codAvailable: boolean;
}
