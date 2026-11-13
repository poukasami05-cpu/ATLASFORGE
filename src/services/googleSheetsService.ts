/**
 * AtlasForge Sports Nutrition - Google Sheets API v4 & Spaceseller.ma Sync Service
 *
 * Connects directly to Google Sheets via OAuth access token (for authenticated merchant sessions)
 * and supports optional Google Apps Script webhook fallback for anonymous storefront visitors.
 */

import { Order } from '../types';
import { getAccessToken } from './googleAuthService';

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

export const getGoogleSheetsWebhookUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_KEY_URL);
  if (stored && stored.trim()) return stored.trim();
  return (import.meta as any).env?.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';
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
};

export const markLocalLogsSynced = (orderIds: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getSyncedSheetLogs();
    const updated = current.map((entry: any) =>
      orderIds.includes(entry.orderId) ? { ...entry, status: 'synced_google_sheet' } : entry
    );
    localStorage.setItem(STORAGE_KEY_SYNC_LOGS, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
};

/**
 * Transforms an AtlasForge Order into Google Sheets tabular row payload
 */
export const formatOrderForGoogleSheets = (order: Order): GoogleSheetOrderPayload => {
  const productsFormatted = order.items
    .map(
      (it) =>
        `${it.productId === 'atlas-collagen-250' ? 'Collagen Marine' : 'Protéine Musculaire'} (${it.flavorName}) × ${it.quantity}`
    )
    .join(' + ');

  const totalQty = order.items.reduce((acc, it) => acc + it.quantity, 0);

  const now = new Date();
  const dateFormatted = now.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Africa/Casablanca',
  });

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
  };
};

const payloadToRow = (payload: GoogleSheetOrderPayload): Array<string | number> => [
  payload.date,
  payload.orderId,
  payload.spacesellerRef,
  payload.trackingNumber,
  payload.customerName,
  `'${payload.customerPhone}`,
  payload.city,
  payload.address,
  payload.productsSummary,
  payload.totalQuantity,
  payload.subtotalMAD,
  payload.shippingMAD,
  payload.totalMAD,
  payload.paymentMethod,
  payload.status,
];

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
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:O1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [SHEET_HEADERS],
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
  const range = `${sheetTitle}!A1:O100`;
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
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetTitle}!A1:A1`)}`,
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
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetTitle}!A1:O1`)}?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: [SHEET_HEADERS] }),
        }
      );
    }
  }

  const rows = payloads.map(payloadToRow);
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetTitle}!A1`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
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

/**
 * Transmits a new checkout order to Google Sheets (1P API when authenticated, or webhook fallback)
 */
export const syncOrderToGoogleSheets = async (
  order: Order
): Promise<{
  success: boolean;
  mode: 'google_api' | 'webhook' | 'local_fallback';
  message: string;
  payload: GoogleSheetOrderPayload;
}> => {
  const payload = formatOrderForGoogleSheets(order);
  const accessToken = getAccessToken();
  const { spreadsheetId, sheetTitle } = getSavedSpreadsheetConfig();
  const webhookUrl = getGoogleSheetsWebhookUrl();

  const logEntry = {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    orderId: order.id,
    customerName: order.customer.fullName,
    totalMAD: order.totalMAD,
    endpoint: spreadsheetId ? `Google Sheet (${spreadsheetId})` : webhookUrl || 'File locale en attente',
    status: 'pending_sync',
    payload,
  };

  // 1. Direct 1P Google Sheets API v4 when user is signed in and spreadsheet is linked
  if (accessToken && spreadsheetId && sheetTitle) {
    try {
      await appendPayloadsToGoogleSheet(accessToken, spreadsheetId, sheetTitle, [payload]);
      logEntry.status = 'synced_google_sheet';
      recordLocalSync(logEntry);
      return {
        success: true,
        mode: 'google_api',
        message: 'Commande ajoutée directement dans votre Google Sheet connecté.',
        payload,
      };
    } catch (apiErr) {
      console.warn('Direct Google Sheets API append failed, checking fallback:', apiErr);
    }
  }

  // 2. Fallback to Apps Script webhook if configured
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      logEntry.status = 'synced_google_sheet';
      recordLocalSync(logEntry);

      return {
        success: true,
        mode: 'webhook',
        message: 'Commande transmise à Google Sheets & file d’attente Spaceseller.ma.',
        payload,
      };
    } catch (error) {
      console.warn('Google Sheets Webhook submission warning:', error);
    }
  }

  // 3. Save locally so merchant can push pending orders in 1 click once signed in
  recordLocalSync(logEntry);
  return {
    success: true,
    mode: 'local_fallback',
    message: 'Commande enregistrée. Connectez-vous avec Google dans la section Google Sheets pour la synchroniser.',
    payload,
  };
};
