/**
 * AtlasForge Sports Nutrition - Google Sheets API v4 & Spaceseller.ma Sync Service
 *
 * Connects directly to Google Sheets via OAuth access token (for authenticated merchant sessions)
 * and supports optional Google Apps Script webhook fallback for anonymous storefront visitors.
 */

import { Order } from '../types';
import { getAccessToken } from './googleAuthService';
import { getProductDisplayMeta, ALL_PRODUCTS } from '../data/mockData';

// ============================================================================
// ⚙️ CONFIGURATION (beddel hna ila bghiti)
// ============================================================================

/** URL dyal Google Apps Script (…/exec) – kaykhdem l ga3 l'clients 24h/24 */
export const GOOGLE_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbzR06vw0VXz705KvAnw_Bp1jlGe2My2_WWocxYVGSZAKKrMWRRYMSJWtnAiXiLn3aMAiw/exec';

/** SKU dyal kol produit KIF MA HOWA F SPACESELLER. Pack = liste dyal SKU. */
export const SPACESELLER_SKU_MAP: Record<string, string | string[]> = {
  'atlas-protein-250': 'pro-testo250g', // Protéine Musculaire 250g
  'atlas-collagen-250': 'collagen-prodre', // Collagen Marine 250g
  'atlas-mega-mass-125': 'gainpro250g', // Mega Mass 250g
  // Pack Duo = 2 produits → 2 lignes (le prix total va sur la 1ère ligne)
  'atlas-pack-duo-500': ['pro-testo250g', 'collagen-prodre'],
};

// ============================================================================

export interface GoogleSheetOrderPayload {
  date: string;
  orderId: string;
  spacesellerRef: string;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  productsSummary: string;
  totalQuantity: number;
  subtotalMAD: number;
  shippingMAD: number;
  totalMAD: number;
  paymentMethod: string;
  status: string;
  /** Lignes prêtes au format Spaceseller (1 ligne par produit) */
  spacesellerRows?: Array<Array<string | number>>;
}

export interface SpreadsheetMetadata {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: Array<{ sheetId: number; title: string }>;
}

const STORAGE_KEY_URL = 'atlasforge_google_sheets_webhook_url';
const STORAGE_KEY_SPREADSHEET_ID = 'atlasforge_google_spreadsheet_id';
const STORAGE_KEY_SHEET_TITLE = 'atlasforge_google_sheet_title';
const STORAGE_KEY_SYNC_LOGS = 'atlasforge_google_sheets_synced_logs';

/** Colonnes EXACTES lues par Spaceseller (A → I) */
export const SPACESELLER_HEADERS = [
  'date_order',
  'full_name',
  'phone',
  'address',
  'sku',
  'qte',
  'price',
  'note',
  'delivery_note',
];

/** (ancien format 15 colonnes – gardé pour référence) */
export const SHEET_HEADERS = [
  'Date & Heure',
  'N° Commande',
  'Réf Spaceseller',
  'N° Suivi (Tracking)',
  'Nom du Client',
  'Téléphone WhatsApp',
  'Ville',
  'Adresse de Livraison',
  'Produits & Saveurs',
  'Quantité Totale',
  'Sous-Total (MAD)',
  'Frais Livraison (MAD)',
  'Total à Payer (MAD)',
  'Mode Paiement',
  'Statut Commande',
];

/** Event fired whenever the local order queue changes (used for auto-refresh). */
export const ORDERS_UPDATED_EVENT = 'atlasforge:orders-updated';

const notifyOrdersUpdated = () => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(ORDERS_UPDATED_EVENT));
  } catch {
    // ignore
  }
};

/**
 * The URL that is baked into the site (works for EVERY visitor).
 * Priority: GOOGLE_SHEETS_WEBHOOK_URL (en haut de ce fichier)  →  VITE_GOOGLE_SHEETS_WEBHOOK_URL (.env)
 */
export const getBuiltInWebhookUrl = (): string => {
  const fromConfig = (GOOGLE_SHEETS_WEBHOOK_URL || '').trim();
  if (fromConfig) return fromConfig;
  return ((import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '').trim();
};

/**
 * URL used by this browser. A URL saved from the merchant panel (localStorage)
 * only applies to THIS browser — useful for testing before putting it in the config.
 */
export const getGoogleSheetsWebhookUrl = (): string => {
  if (typeof window === 'undefined') return getBuiltInWebhookUrl();
  const stored = localStorage.getItem(STORAGE_KEY_URL);
  if (stored && stored.trim()) return stored.trim();
  return getBuiltInWebhookUrl();
};

export const isValidAppsScriptUrl = (url: string): boolean =>
  /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec\/?$/.test(url.trim());

/**
 * Google Sheets A1 notation: tab names with spaces / special chars MUST be wrapped
 * in single quotes, and inner quotes doubled.  Feuille 1  →  'Feuille 1'!A1
 */
export const a1Range = (sheetTitle: string, cells: string): string =>
  `'${sheetTitle.replace(/'/g, "''")}'!${cells}`;

/** Prevent formula injection (a client typing "=IMPORTXML(...)" as their name). */
const safeCell = (value: string | number): string | number => {
  if (typeof value !== 'string') return value;
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
};

export const setGoogleSheetsWebhookUrl = (url: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
};

export const getSavedSpreadsheetConfig = (): { spreadsheetId: string; sheetTitle: string } => {
  if (typeof window === 'undefined') return { spreadsheetId: '', sheetTitle: '' };
  return {
    spreadsheetId: localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID) || '',
    sheetTitle: localStorage.getItem(STORAGE_KEY_SHEET_TITLE) || '',
  };
};

export const saveSpreadsheetConfig = (spreadsheetId: string, sheetTitle: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, spreadsheetId.trim());
  localStorage.setItem(STORAGE_KEY_SHEET_TITLE, sheetTitle.trim());
};

export const extractSpreadsheetId = (urlOrId: string): string => {
  const trimmed = urlOrId.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : trimmed;
};

export const getSyncedSheetLogs = (): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const recordLocalSync = (entry: any) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getSyncedSheetLogs();
    const updated = [entry, ...current].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_SYNC_LOGS, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  notifyOrdersUpdated();
};

export const markLocalLogsSynced = (orderIds: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getSyncedSheetLogs();
    const updated = current.map((entry: any) =>
      orderIds.includes(entry.orderId) ? { ...entry, status: 'synced_google_sheet', error: undefined } : entry
    );
    localStorage.setItem(STORAGE_KEY_SYNC_LOGS, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  notifyOrdersUpdated();
};

/** SKU(s) Spaceseller d'un produit (config → fiche produit → id). Un pack = plusieurs SKU. */
export const getSpacesellerSkus = (productId: string, flavorId?: string): string[] => {
  const pick = (v: string | string[] | undefined): string[] =>
    (Array.isArray(v) ? v : v ? [v] : []).map((x) => x.trim()).filter(Boolean);
  const byFlavor = flavorId ? pick(SPACESELLER_SKU_MAP[`${productId}:${flavorId}`]) : [];
  if (byFlavor.length) return byFlavor;
  const byProduct = pick(SPACESELLER_SKU_MAP[productId]);
  if (byProduct.length) return byProduct;
  const product = ALL_PRODUCTS.find((p) => p.id === productId) as any;
  return [product?.spacesellerSku || productId];
};

/** "+212 6 61-23 45 67" → "0661234567" */
export const normalizeMoroccanPhone = (raw: string): string => {
  let digits = String(raw || '').replace(/[^\d+]/g, '');
  if (digits.startsWith('+212')) digits = '0' + digits.slice(4);
  else if (digits.startsWith('00212')) digits = '0' + digits.slice(5);
  else if (digits.startsWith('212') && digits.length === 12) digits = '0' + digits.slice(3);
  return digits.replace(/\+/g, '');
};

const formatCasablancaDate = (d: Date): string => {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Africa/Casablanca',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '00';
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}:${get('second')}`;
};

/**
 * Builds Spaceseller rows: date_order | full_name | phone | address | sku | qte | price | note | delivery_note
 * 1 ligne par produit. price = total de la ligne (+ frais de livraison sur la 1ère ligne),
 * donc la somme des lignes = montant COD à encaisser.
 */
export const buildSpacesellerRows = (order: Order, date: string): Array<Array<string | number>> => {
  const address = [order.customer.address, order.customer.city].filter(Boolean).join(', ');
  const phone = normalizeMoroccanPhone(order.customer.phone);
  const rows: Array<Array<string | number>> = [];
  order.items.forEach((it, idx) => {
    const lineTotal = it.priceMAD * it.quantity + (idx === 0 ? order.shippingMAD : 0);
    getSpacesellerSkus(it.productId, it.flavorId).forEach((sku, k) => {
      rows.push([
        date,
        order.customer.fullName,
        phone,
        address,
        sku,
        it.quantity,
        k === 0 ? lineTotal : 0, // pack : tout le prix sur le 1er produit
        `Réf ${order.id} · ${it.flavorName}${k > 0 ? ' (pack)' : ''}`,
        order.customer.notes || '',
      ]);
    });
  });
  return rows;
};

/**
 * Transforms an AtlasForge Order into Google Sheets tabular row payload
 */
export const formatOrderForGoogleSheets = (order: Order): GoogleSheetOrderPayload => {
  const productsFormatted = order.items
    .map(
      (it) =>
        `${getProductDisplayMeta(it.productId).name} (${it.flavorName}) × ${it.quantity}`
    )
    .join(' + ');

  const totalQty = order.items.reduce((acc, it) => acc + it.quantity, 0);

  const dateFormatted = formatCasablancaDate(new Date());

  return {
    date: dateFormatted,
    orderId: order.id,
    spacesellerRef: order.spacesellerReference,
    trackingNumber: order.trackingNumber,
    customerName: order.customer.fullName,
    customerPhone: order.customer.phone,
    city: order.customer.city,
    address: order.customer.address,
    productsSummary: productsFormatted,
    totalQuantity: totalQty,
    subtotalMAD: order.subtotalMAD,
    shippingMAD: order.shippingMAD,
    totalMAD: order.totalMAD,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Confirmée · Prêt pour Spaceseller.ma Hub Bouskoura',
    spacesellerRows: buildSpacesellerRows(order, dateFormatted),
  };
};

/** Rows written in the Sheet (Spaceseller format). Old queued orders get a best-effort row. */
const payloadToRows = (payload: GoogleSheetOrderPayload): Array<Array<string | number>> => {
  const rows =
    payload.spacesellerRows && payload.spacesellerRows.length
      ? payload.spacesellerRows
      : [
          [
            payload.date,
            payload.customerName,
            normalizeMoroccanPhone(payload.customerPhone),
            payload.city ? `${payload.address}, ${payload.city}` : payload.address,
            payload.productsSummary,
            payload.totalQuantity,
            payload.totalMAD,
            `Réf ${payload.orderId}`,
            '',
          ],
        ];
  // col 2 = phone: forced as text so the leading 0 is kept
  return rows.map((r) => r.map((v, i) => (i === 2 ? `'${v}` : safeCell(v))));
};

/**
 * Fetch spreadsheet metadata and real tab names (never hardcoding "Sheet1")
 */
export const getSpreadsheetMetadata = async (
  accessToken: string,
  urlOrId: string
): Promise<SpreadsheetMetadata> => {
  const spreadsheetId = extractSpreadsheetId(urlOrId);
  if (!spreadsheetId) {
    throw new Error('Identifiant ou lien Google Sheet invalide.');
  }

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,spreadsheetUrl,sheets.properties(sheetId,title)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Erreur Google Sheets (${res.status})`);
  }

  const data = await res.json();
  return {
    spreadsheetId,
    title: data.properties?.title || 'Feuille Google Sheet',
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId ?? 0,
      title: s.properties?.title || 'Onglet',
    })),
  };
};

/**
 * Create a new dedicated AtlasForge Orders spreadsheet in the authenticated user's Google account
 */
export const createAtlasForgeSpreadsheet = async (
  accessToken: string
): Promise<SpreadsheetMetadata> => {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'AtlasForge Commandes COD (spaceseller.ma)',
      },
      sheets: [
        {
          properties: {
            title: 'Commandes',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Impossible de créer la feuille Google Sheet.');
  }

  const created = await createRes.json();
  const spreadsheetId: string = created.spreadsheetId;
  const sheetTitle = created.sheets?.[0]?.properties?.title || 'Commandes';

  // Populate clean column headers
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(a1Range(sheetTitle, 'A1:I1'))}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [SPACESELLER_HEADERS],
      }),
    }
  );

  saveSpreadsheetConfig(spreadsheetId, sheetTitle);

  return {
    spreadsheetId,
    title: created.properties?.title || 'AtlasForge Commandes COD (spaceseller.ma)',
    spreadsheetUrl: created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    sheets: [{ sheetId: created.sheets?.[0]?.properties?.sheetId ?? 0, title: sheetTitle }],
  };
};

/**
 * Read existing rows from the connected Google Sheet
 */
export const readSheetRows = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string
): Promise<string[][]> => {
  const range = a1Range(sheetTitle, 'A1:O500');
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Impossible de lire les lignes du Google Sheet.');
  }

  const data = await res.json();
  return data.values || [];
};

/**
 * Append one or more formatted order payloads directly to Google Sheets API v4
 */
export const appendPayloadsToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  payloads: GoogleSheetOrderPayload[]
): Promise<void> => {
  // Check if sheet is empty and add headers first if needed
  const checkRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(a1Range(sheetTitle, 'A1:A1'))}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (checkRes.ok) {
    const checkData = await checkRes.json();
    if (!checkData.values || checkData.values.length === 0) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(a1Range(sheetTitle, 'A1:I1'))}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: [SPACESELLER_HEADERS] }),
        }
      );
    }
  }

  const rows = payloads.flatMap(payloadToRows);
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(a1Range(sheetTitle, 'A1'))}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: rows }),
    }
  );

  if (!appendRes.ok) {
    const errData = await appendRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Erreur lors de l’ajout dans Google Sheets.');
  }
};

export type SyncMode = 'google_api' | 'webhook' | 'local_fallback';

export interface SyncResult {
  success: boolean; // true ONLY when the row really reached Google Sheets
  mode: SyncMode;
  confirmed: boolean; // true when Google answered "ok"
  message: string;
  reason?: string; // why it stayed pending (shown to the merchant)
  payload: GoogleSheetOrderPayload;
}

/**
 * Send payloads to the Apps Script web app.
 * Uses Content-Type text/plain (no CORS preflight) so we CAN read Google's answer.
 */
export const postToWebhook = async (
  webhookUrl: string,
  payloads: GoogleSheetOrderPayload[]
): Promise<{ confirmed: boolean; added?: number }> => {
  const body = JSON.stringify({ orders: payloads });
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`Apps Script a répondu ${res.status}`);
    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        "Réponse inattendue d'Apps Script. Vérifiez « Qui a accès : Tout le monde » dans le déploiement."
      );
    }
    if (!data?.ok) throw new Error(data?.error || 'Apps Script a refusé la commande.');
    return { confirmed: true, added: data.added };
  } catch (err) {
    // Network/CORS error: last attempt in "no-cors" (fire & forget, cannot read the answer).
    if (err instanceof TypeError) {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
      });
      return { confirmed: false };
    }
    throw err;
  }
};

/** Checks the Apps Script deployment WITHOUT writing any row (safe with Spaceseller). */
export const pingWebhook = async (webhookUrl: string): Promise<{ ok: boolean; sheet?: string }> => {
  const res = await fetch(webhookUrl, { method: 'GET', redirect: 'follow' });
  const text = await res.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Réponse inattendue. Vérifiez « Qui a accès : Tout le monde » dans le déploiement Apps Script.");
  }
  if (!data?.ok) throw new Error(data?.error || 'Apps Script ne répond pas correctement.');
  return { ok: true, sheet: data.sheet };
};

/**
 * Transmits a new checkout order to Google Sheets.
 * 1) Webhook (works for every visitor, 24h/24)  2) Direct API (merchant signed in)  3) local queue
 * Always tells the truth about where the order went.
 */
export const syncOrderToGoogleSheets = async (order: Order): Promise<SyncResult> => {
  const payload = formatOrderForGoogleSheets(order);
  const accessToken = getAccessToken();
  const { spreadsheetId, sheetTitle } = getSavedSpreadsheetConfig();
  const webhookUrl = getGoogleSheetsWebhookUrl();
  const reasons: string[] = [];

  const logEntry: any = {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    orderId: order.id,
    customerName: order.customer.fullName,
    totalMAD: order.totalMAD,
    endpoint: webhookUrl ? 'Webhook Apps Script' : spreadsheetId ? `Google Sheet (${spreadsheetId})` : 'File locale',
    status: 'pending_sync',
    payload,
  };

  // 1. Webhook — the 24h/24 path that works for anonymous customers
  if (webhookUrl) {
    try {
      const { confirmed } = await postToWebhook(webhookUrl, [payload]);
      logEntry.status = 'synced_google_sheet';
      logEntry.mode = 'webhook';
      logEntry.confirmed = confirmed;
      recordLocalSync(logEntry);
      return {
        success: true,
        mode: 'webhook',
        confirmed,
        message: confirmed
          ? 'Commande ajoutée dans Google Sheets (Apps Script 24h/24).'
          : 'Commande envoyée à Apps Script (réponse non lisible, vérifiez le Sheet).',
        payload,
      };
    } catch (err: any) {
      reasons.push(`Webhook : ${err?.message || 'échec de l’envoi'}`);
    }
  } else {
    reasons.push('Aucun Webhook Apps Script configuré (les clients ne peuvent pas écrire dans le Sheet).');
  }

  // 2. Direct Google Sheets API — only when the merchant is signed in on THIS tab
  if (accessToken && spreadsheetId && sheetTitle) {
    try {
      await appendPayloadsToGoogleSheet(accessToken, spreadsheetId, sheetTitle, [payload]);
      logEntry.status = 'synced_google_sheet';
      logEntry.mode = 'google_api';
      logEntry.confirmed = true;
      recordLocalSync(logEntry);
      return {
        success: true,
        mode: 'google_api',
        confirmed: true,
        message: `Commande ajoutée dans votre Google Sheet (onglet « ${sheetTitle} »).`,
        payload,
      };
    } catch (apiErr: any) {
      reasons.push(`Google Sheets API : ${apiErr?.message || 'erreur inconnue'}`);
    }
  } else if (!accessToken) {
    reasons.push('Session Google non connectée dans cet onglet.');
  } else {
    reasons.push('Aucun Google Sheet chargé dans le Centre Logistique.');
  }

  // 3. Local queue (only on THIS device)
  const reason = reasons.join(' · ');
  logEntry.error = reason;
  recordLocalSync(logEntry);
  return {
    success: false,
    mode: 'local_fallback',
    confirmed: false,
    message: 'Commande enregistrée localement, en attente de synchronisation Google Sheets.',
    reason,
    payload,
  };
};
