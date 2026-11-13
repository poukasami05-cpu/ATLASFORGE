import React, { useState, useEffect, useCallback } from 'react';
import {
  Server,
  CheckCircle2,
  RefreshCw,
  Box,
  Truck,
  DollarSign,
  FileSpreadsheet,
  ExternalLink,
  Play,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  Package,
  LogOut,
  PlusCircle,
  AlertTriangle,
  X,
  UploadCloud,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { SpacesellerWebhook, Order } from '../types';
import { INITIAL_WEBHOOK_LOGS } from '../data/mockData';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logoutGoogle,
  TARGET_MERCHANT_EMAIL,
} from '../services/googleAuthService';
import {
  getSyncedSheetLogs,
  getSavedSpreadsheetConfig,
  saveSpreadsheetConfig,
  getSpreadsheetMetadata,
  createAtlasForgeSpreadsheet,
  readSheetRows,
  appendPayloadsToGoogleSheet,
  formatOrderForGoogleSheets,
  markLocalLogsSynced,
  SpreadsheetMetadata,
  GoogleSheetOrderPayload,
} from '../services/googleSheetsService';

const EVENT_LABELS: Record<SpacesellerWebhook['event'], { title: string; badge: string }> = {
  'order.created': { title: 'Nouvelle Commande Reçue', badge: 'Commande Validée' },
  'order.confirmed': { title: 'Confirmation Téléphonique', badge: 'Confirmée' },
  'order.shipped': { title: 'Colis Expédié (Bouskoura)', badge: 'En Transit' },
  'order.delivered': { title: 'Colis Livré au Client', badge: 'Livrée' },
  'cod.collected': { title: 'Paiement COD Encaissé', badge: 'Encaissée' },
  'inventory.updated': { title: 'Mise à Jour du Stock', badge: 'Stock Synchronisé' },
};

type PendingMutation =
  | { type: 'create_sheet' }
  | { type: 'append_test'; payload: GoogleSheetOrderPayload }
  | { type: 'sync_pending'; payloads: GoogleSheetOrderPayload[]; orderIds: string[] };

export const SpacesellerHub: React.FC = () => {
  const [logs, setLogs] = useState<SpacesellerWebhook[]>(INITIAL_WEBHOOK_LOGS);
  const [activeTab, setActiveTab] = useState<'googlesheets' | 'console' | 'architecture'>('googlesheets');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<SpacesellerWebhook | null>(INITIAL_WEBHOOK_LOGS[0]);

  // Google Workspace Auth State
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Google Sheets State
  const [spreadsheetInput, setSpreadsheetInput] = useState<string>('');
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [selectedSheetTitle, setSelectedSheetTitle] = useState<string>('');
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [sheetsLoading, setSheetsLoading] = useState<boolean>(false);
  const [sheetsFeedback, setSheetsFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [localLogs, setLocalLogs] = useState<any[]>([]);

  // Explicit Confirmation Modal for Mutating Operations
  const [pendingMutation, setPendingMutation] = useState<PendingMutation | null>(null);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const loadSpreadsheetData = useCallback(async (token: string, idOrUrl: string, preferredTab?: string) => {
    setSheetsLoading(true);
    setSheetsFeedback(null);
    try {
      const meta = await getSpreadsheetMetadata(token, idOrUrl);
      setMetadata(meta);
      const tab =
        preferredTab && meta.sheets.some((s) => s.title === preferredTab)
          ? preferredTab
          : meta.sheets[0]?.title || '';
      setSelectedSheetTitle(tab);
      if (tab) {
        saveSpreadsheetConfig(meta.spreadsheetId, tab);
        const rows = await readSheetRows(token, meta.spreadsheetId, tab);
        setSheetRows(rows);
      }
    } catch (err: any) {
      setSheetsFeedback({
        type: 'error',
        text: err?.message || 'Impossible d’accéder à ce Google Sheet. Vérifiez le lien ou vos permissions.',
      });
    } finally {
      setSheetsLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = getSavedSpreadsheetConfig();
    if (saved.spreadsheetId) {
      setSpreadsheetInput(saved.spreadsheetId);
    }
    setLocalLogs(getSyncedSheetLogs());

    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setNeedsAuth(false);
        setAuthError(null);
        if (saved.spreadsheetId) {
          loadSpreadsheetData(token, saved.spreadsheetId, saved.sheetTitle);
        }
      },
      (user) => {
        setGoogleUser(user);
        setNeedsAuth(true);
      }
    );

    return () => unsubscribe();
  }, [loadSpreadsheetData]);

  useEffect(() => {
    setLocalLogs(getSyncedSheetLogs());
  }, [activeTab]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setNeedsAuth(false);
        const saved = getSavedSpreadsheetConfig();
        if (saved.spreadsheetId) {
          await loadSpreadsheetData(res.accessToken, saved.spreadsheetId, saved.sheetTitle);
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'La connexion Google a été annulée ou refusée.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setNeedsAuth(true);
    setMetadata(null);
    setSheetRows([]);
    setSheetsFeedback(null);
  };

  const handleConfirmMutation = async () => {
    if (!pendingMutation) return;
    const token = getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setPendingMutation(null);
      setAuthError('Votre session Google a expiré. Veuillez vous reconnecter.');
      return;
    }

    setIsMutating(true);
    setSheetsFeedback(null);
    try {
      if (pendingMutation.type === 'create_sheet') {
        const created = await createAtlasForgeSpreadsheet(token);
        setMetadata(created);
        setSpreadsheetInput(created.spreadsheetId);
        const firstTab = created.sheets[0]?.title || 'Commandes';
        setSelectedSheetTitle(firstTab);
        const rows = await readSheetRows(token, created.spreadsheetId, firstTab);
        setSheetRows(rows);
        setSheetsFeedback({
          type: 'success',
          text: `Feuille « ${created.title} » créée et connectée avec succès à ${googleUser?.email || TARGET_MERCHANT_EMAIL}.`,
        });
      } else if (pendingMutation.type === 'append_test') {
        if (!metadata || !selectedSheetTitle) throw new Error('Veuillez d’abord sélectionner un Google Sheet.');
        await appendPayloadsToGoogleSheet(token, metadata.spreadsheetId, selectedSheetTitle, [
          pendingMutation.payload,
        ]);
        const rows = await readSheetRows(token, metadata.spreadsheetId, selectedSheetTitle);
        setSheetRows(rows);
        setSheetsFeedback({
          type: 'success',
          text: `Commande test (${pendingMutation.payload.orderId}) ajoutée dans l’onglet « ${selectedSheetTitle} ».`,
        });
      } else if (pendingMutation.type === 'sync_pending') {
        if (!metadata || !selectedSheetTitle) throw new Error('Veuillez d’abord sélectionner un Google Sheet.');
        await appendPayloadsToGoogleSheet(token, metadata.spreadsheetId, selectedSheetTitle, pendingMutation.payloads);
        markLocalLogsSynced(pendingMutation.orderIds);
        setLocalLogs(getSyncedSheetLogs());
        const rows = await readSheetRows(token, metadata.spreadsheetId, selectedSheetTitle);
        setSheetRows(rows);
        setSheetsFeedback({
          type: 'success',
          text: `${pendingMutation.payloads.length} commande(s) synchronisée(s) vers « ${metadata.title} ».`,
        });
      }
    } catch (err: any) {
      setSheetsFeedback({
        type: 'error',
        text: err?.message || 'Une erreur est survenue lors de la mise à jour de Google Sheets.',
      });
    } finally {
      setIsMutating(false);
      setPendingMutation(null);
    }
  };

  const triggerSimulation = (eventType: SpacesellerWebhook['event']) => {
    setSimulating(true);
    setTimeout(() => {
      const randomOrderId = `ATLAS-${Math.floor(1000 + Math.random() * 9000)}`;
      const trackingCode = `SP-MA-${Math.floor(100000 + Math.random() * 900000)}`;

      let payload: Record<string, any> = {};
      if (eventType === 'order.created') {
        payload = {
          orderId: randomOrderId,
          destinationCity: 'Rabat - Souissi',
          customerName: 'Karim Bennani',
          customerPhone: '+212 661-234567',
          codAmountMAD: 299.0,
        };
      } else if (eventType === 'order.shipped') {
        payload = {
          orderId: randomOrderId,
          awb: `AWB-${trackingCode}`,
          hub: 'Spaceseller Bouskoura Central 01',
        };
      } else if (eventType === 'cod.collected') {
        payload = {
          orderId: randomOrderId,
          amountCollectedMAD: 299.0,
          collectedBy: 'Livreur Spaceseller Casablanca',
        };
      } else {
        payload = {
          warehouse: 'Bouskoura Casablanca',
          quantityOnHand: 479,
        };
      }

      const newEvent: SpacesellerWebhook = {
        id: `SUIVI-${Date.now().toString().slice(-6)}`,
        event: eventType,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        payload,
      };

      setLogs((prev) => [newEvent, ...prev]);
      setSelectedLog(newEvent);
      setSimulating(false);
    }, 350);
  };

  const pendingOrders = localLogs.filter((l) => l.status !== 'synced_google_sheet' && l.payload);

  return (
    <section id="spaceseller" className="py-20 bg-[#F4F5F7] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1E4D2B] uppercase tracking-widest mb-1.5">
              <Server className="w-4 h-4" />
              <span>SPACESELLER.MA · GOOGLE SHEETS & LOGISTIQUE MAROC</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#14171A] tracking-tight font-serif-heading">
              Centre Logistique & Google Sheets
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl font-sans-body">
              Connectez votre compte Google (<strong className="text-slate-900">{TARGET_MERCHANT_EMAIL}</strong>) pour synchroniser vos commandes Cash on Delivery directement avec Google Sheets et <strong className="text-slate-900">spaceseller.ma</strong>.
            </p>
          </div>

          {/* Navigation Pill tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shadow-xs shrink-0">
            <button
              onClick={() => setActiveTab('googlesheets')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'googlesheets'
                  ? 'bg-[#1E4D2B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets</span>
              <span className={`w-2 h-2 rounded-full ${needsAuth ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'console'
                  ? 'bg-[#1E4D2B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suivi des Expéditions
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-[#1E4D2B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Comment ça marche
            </button>
          </div>
        </div>

        {/* TAB 1: GOOGLE SHEETS DIRECT CONNECTION */}
        {activeTab === 'googlesheets' && (
          <div className="space-y-6 animate-fade-in">
            {/* Account Connection Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#1E4D2B] flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif-heading">
                      Connexion Officielle Google Sheets
                    </h3>
                    <p className="text-xs text-slate-500 font-sans-body">
                      Compte cible : <strong className="text-slate-800">{TARGET_MERCHANT_EMAIL}</strong> · Synchronisation directe des commandes COD AtlasForge.
                    </p>
                  </div>
                </div>

                {needsAuth ? (
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={handleGoogleLogin}
                    className="gsi-material-button shrink-0"
                  >
                    <div className="gsi-material-button-state" />
                    <div className="gsi-material-button-content-wrapper">
                      <div className="gsi-material-button-icon">
                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          style={{ display: 'block' }}
                        >
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                          />
                          <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                          />
                          <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents">
                        {isLoggingIn ? 'Connexion en cours...' : 'Sign in with Google'}
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
                    {googleUser?.photoURL && (
                      <img
                        src={googleUser.photoURL}
                        alt={googleUser.displayName || 'Google Account'}
                        className="w-7 h-7 rounded-full border border-emerald-300"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 leading-tight">
                        {googleUser?.email || TARGET_MERCHANT_EMAIL}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold">● Connecté à Google Sheets</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleLogout}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Déconnecter le compte Google"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {authError}
                </div>
              )}

              {!needsAuth && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {/* Link Existing Sheet or Create New Sheet */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                    <div className="lg:col-span-6 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Lien ou ID de votre Google Sheet :
                      </label>
                      <input
                        type="text"
                        placeholder="Collez le lien https://docs.google.com/spreadsheets/d/..."
                        value={spreadsheetInput}
                        onChange={(e) => setSpreadsheetInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#1E4D2B] focus:bg-white"
                      />
                    </div>

                    <div className="lg:col-span-6 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={sheetsLoading || !spreadsheetInput.trim()}
                        onClick={() => {
                          const token = getAccessToken();
                          if (!token) {
                            setNeedsAuth(true);
                            return;
                          }
                          loadSpreadsheetData(token, spreadsheetInput);
                        }}
                        className="px-4 py-2.5 bg-[#14171A] hover:bg-black text-white font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {sheetsLoading ? 'Chargement...' : 'Charger le Sheet'}
                      </button>

                      <button
                        type="button"
                        disabled={sheetsLoading}
                        onClick={() => setPendingMutation({ type: 'create_sheet' })}
                        className="px-4 py-2.5 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Créer un nouveau Sheet</span>
                      </button>
                    </div>
                  </div>

                  {/* Connected Spreadsheet Info & Actions */}
                  {metadata && (
                    <div className="p-4 bg-[#FAF9F7] border border-emerald-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 font-serif-heading">{metadata.title}</span>
                          <a
                            href={metadata.spreadsheetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-[#1E4D2B] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Ouvrir dans Google Sheets</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span>Onglet actif :</span>
                          <select
                            value={selectedSheetTitle}
                            onChange={(e) => {
                              const newTab = e.target.value;
                              setSelectedSheetTitle(newTab);
                              saveSpreadsheetConfig(metadata.spreadsheetId, newTab);
                              const token = getAccessToken();
                              if (token) {
                                readSheetRows(token, metadata.spreadsheetId, newTab).then(setSheetRows).catch(() => {});
                              }
                            }}
                            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                          >
                            {metadata.sheets.map((s) => (
                              <option key={s.sheetId} value={s.title}>
                                {s.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const sampleOrder: Order = {
                              id: `ATLAS-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
                              spacesellerReference: `SP-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
                              trackingNumber: `SP-MA-${Math.floor(100000 + Math.random() * 900000)}`,
                              awbNumber: `AWB-SP-CAS-9941`,
                              customer: {
                                fullName: 'Mehdi Bennani (Test)',
                                phone: '06 61 23 45 67',
                                email: '',
                                address: 'Quartier Racine, Résidence Atlas',
                                city: 'Casablanca',
                              },
                              items: [
                                {
                                  productId: 'atlas-protein-250',
                                  flavorId: 'chocolat-intense',
                                  flavorName: 'Chocolat Noir Brut',
                                  weightLabel: '250g',
                                  priceMAD: 299,
                                  quantity: 1,
                                  purchaseType: 'one-time',
                                },
                              ],
                              subtotalMAD: 299,
                              shippingMAD: 0,
                              discountMAD: 0,
                              totalMAD: 299,
                              paymentMethod: 'cod',
                              fulfillmentStatus: 'synced_spaceseller',
                              spacesellerSyncStatus: 'synced',
                              lastSyncTimestamp: new Date().toISOString(),
                              createdAt: new Date().toISOString(),
                            };
                            setPendingMutation({
                              type: 'append_test',
                              payload: formatOrderForGoogleSheets(sampleOrder),
                            });
                          }}
                          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#1E4D2B] border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Ajouter Ligne Test</span>
                        </button>

                        {pendingOrders.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setPendingMutation({
                                type: 'sync_pending',
                                payloads: pendingOrders.map((l) => l.payload),
                                orderIds: pendingOrders.map((l) => l.orderId),
                              })
                            }
                            className="px-3.5 py-2 bg-[#1E4D2B] hover:bg-[#163a20] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Synchroniser ({pendingOrders.length})</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const token = getAccessToken();
                            if (token) {
                              loadSpreadsheetData(token, metadata.spreadsheetId, selectedSheetTitle);
                            }
                          }}
                          className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer"
                          title="Actualiser les données du Google Sheet"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {sheetsFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold border ${
                        sheetsFeedback.type === 'success'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      {sheetsFeedback.text}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Rows from Google Sheets (if connected) */}
            {!needsAuth && metadata && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-serif-heading">
                      Aperçu en Direct : {metadata.title} ({selectedSheetTitle})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Lignes actuellement enregistrées dans votre feuille Google Sheets.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E4D2B]">
                    {Math.max(0, sheetRows.length - 1)} commande(s)
                  </span>
                </div>

                {sheetRows.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Cette feuille est actuellement vide. Cliquez sur « Ajouter Ligne Test » ou validez une commande.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans-body">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                          {(sheetRows[0] || []).slice(0, 8).map((header, idx) => (
                            <th key={idx} className="p-2.5 whitespace-nowrap">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sheetRows.slice(1).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                            {row.slice(0, 8).map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5 whitespace-nowrap text-slate-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Local Storefront Orders Queue */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif-heading">
                    Commandes Boutiques Récentes ({localLogs.length})
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Commandes passées depuis le formulaire COD prêtes pour Google Sheets et spaceseller.ma.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLocalLogs(getSyncedSheetLogs())}
                  className="p-1.5 text-slate-500 hover:text-black rounded-lg transition-colors cursor-pointer"
                  title="Actualiser"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {localLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 font-sans-body">
                  Aucune commande récente enregistrée sur cette session. Passez une commande pour la voir apparaître ici.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans-body">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                        <th className="p-2.5">Date & Heure</th>
                        <th className="p-2.5">N° Commande</th>
                        <th className="p-2.5">Client</th>
                        <th className="p-2.5">WhatsApp</th>
                        <th className="p-2.5">Ville & Adresse</th>
                        <th className="p-2.5">Produit(s)</th>
                        <th className="p-2.5">Montant COD</th>
                        <th className="p-2.5">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {localLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">{log.payload?.date}</td>
                          <td className="p-2.5 font-bold text-[#1E4D2B] whitespace-nowrap font-mono">{log.orderId}</td>
                          <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">{log.customerName}</td>
                          <td className="p-2.5 text-slate-700 whitespace-nowrap font-mono">{log.payload?.customerPhone}</td>
                          <td className="p-2.5 text-slate-600 max-w-xs truncate">
                            {log.payload?.city} · {log.payload?.address}
                          </td>
                          <td className="p-2.5 text-slate-800 max-w-xs truncate">
                            {log.payload?.productsSummary}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap font-mono">{log.totalMAD} MAD</td>
                          <td className="p-2.5 whitespace-nowrap">
                            {log.status === 'synced_google_sheet' ? (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                ✓ Synchronisée
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                En attente de sync
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SUIVI DES EXPÉDITIONS */}
        {activeTab === 'console' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Partenaire Logistique</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-base font-bold text-slate-900 font-serif-heading">spaceseller.ma</div>
                <div className="text-[11px] text-[#1E4D2B] font-bold mt-1">Hub Bouskoura actif · 24h/48h</div>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Stock Disponible (250g)</span>
                  <Box className="w-4 h-4 text-[#1E4D2B]" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">840 flacons</div>
                <div className="text-[11px] text-slate-500 mt-1">Protéine (480) · Collagène (360)</div>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Expéditions en Cours</span>
                  <Truck className="w-4 h-4 text-[#1E4D2B]" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">28 colis</div>
                <div className="text-[11px] text-[#1E4D2B] font-bold mt-1">Casa (16) · Rabat (7) · Marrakech (5)</div>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Paiement à la Livraison</span>
                  <DollarSign className="w-4 h-4 text-[#1E4D2B]" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">100% COD</div>
                <div className="text-[11px] text-slate-500 mt-1">Payez en espèces après vérification</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-serif-heading">
                    <span>Activité Récente des Expéditions</span>
                    <span className="text-[10px] font-mono bg-[#1E4D2B]/10 text-[#1E4D2B] font-bold px-2 py-0.5 rounded">
                      En Direct · Maroc
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-sans-body">
                    Consultez l’état des commandes préparées et livrées par nos coursiers dans tout le Royaume.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={simulating}
                    onClick={() => triggerSimulation('order.created')}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    + Simuler Commande
                  </button>
                  <button
                    disabled={simulating}
                    onClick={() => triggerSimulation('order.shipped')}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    + Simuler Expédition
                  </button>
                  <button
                    disabled={simulating}
                    onClick={() => triggerSimulation('cod.collected')}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    + Simuler Livraison COD
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                    Dernières opérations ({logs.length})
                  </div>
                  {logs.map((log) => {
                    const isSelected = selectedLog?.id === log.id;
                    const meta = EVENT_LABELS[log.event] || { title: log.event, badge: 'Confirmé' };
                    return (
                      <button
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs cursor-pointer ${
                          isSelected
                            ? 'border-[#1E4D2B] bg-[#1E4D2B]/5 text-slate-900 shadow-xs'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#1E4D2B] font-serif-heading">{meta.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-mono">{log.payload?.orderId || 'Stock Hub Bouskoura'}</span>
                          <span className="text-emerald-700 font-semibold">{meta.badge}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="lg:col-span-7 bg-[#FAF9F7] border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                  {selectedLog ? (
                    <div className="space-y-5">
                      <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1E4D2B] text-white flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-slate-900 font-serif-heading">
                              {(EVENT_LABELS[selectedLog.event] || { title: 'Mise à jour logistique' }).title}
                            </h4>
                            <p className="text-xs text-slate-500 font-mono">
                              Référence : {selectedLog.payload?.orderId || selectedLog.id}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-[#1E4D2B] px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{(EVENT_LABELS[selectedLog.event] || { badge: 'Validé' }).badge}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {selectedLog.payload?.recipientCity || selectedLog.payload?.destinationCity ? (
                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                            <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Destination</span>
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#1E4D2B]" />
                              {selectedLog.payload.recipientCity || selectedLog.payload.destinationCity}
                            </span>
                          </div>
                        ) : (
                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                            <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Entrepôt d’expédition</span>
                            <span className="font-bold text-slate-900 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#1E4D2B]" />
                              {selectedLog.payload?.hub || selectedLog.payload?.warehouse || 'Hub Bouskoura, Casablanca'}
                            </span>
                          </div>
                        )}

                        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Horodatage</span>
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-[#1E4D2B]" />
                            {new Date(selectedLog.timestamp).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {(selectedLog.payload?.paymentCollectedMAD || selectedLog.payload?.codAmountMAD || selectedLog.payload?.amountCollectedMAD) && (
                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                            <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Montant COD</span>
                            <span className="font-extrabold text-[#1E4D2B] text-sm font-mono">
                              {selectedLog.payload.paymentCollectedMAD || selectedLog.payload.codAmountMAD || selectedLog.payload.amountCollectedMAD} MAD (Espèces)
                            </span>
                          </div>
                        )}

                        {(selectedLog.payload?.spacesellerTracking || selectedLog.payload?.awb) && (
                          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                            <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Suivi Transporteur</span>
                            <span className="font-bold text-slate-900 font-mono">
                              {selectedLog.payload.spacesellerTracking || selectedLog.payload.awb}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center gap-2.5 text-xs text-emerald-950">
                        <ShieldCheck className="w-4 h-4 text-[#1E4D2B] shrink-0" />
                        <span>
                          Expédition suivie et assurée par <strong>spaceseller.ma</strong> avec contrôle qualité avant remise au client.
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROCESSUS DE LIVRAISON */}
        {activeTab === 'architecture' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 font-serif-heading mb-2">
              Votre Commande de Bout en Bout au Maroc
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-3xl font-sans-body">
              De la validation sur la boutique AtlasForge jusqu’à la réception de votre flacon 250g entre vos mains via spaceseller.ma.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-mono text-[#1E4D2B] font-bold block mb-2">ÉTAPE 01</span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-serif-heading">Commande Rapide</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans-body">
                  Choisissez votre Protéine Musculaire ou Collagen Marine 250g, renseignez votre nom, WhatsApp et ville sans carte bancaire.
                </p>
              </div>

              <div className="p-5 bg-[#1E4D2B]/5 border border-[#1E4D2B]/30 rounded-xl">
                <span className="text-xs font-mono text-[#1E4D2B] font-bold block mb-2">ÉTAPE 02</span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-serif-heading">Google Sheets & Hub</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans-body">
                  Votre commande est ajoutée dans Google Sheets et transmise à l’entrepôt Spaceseller à Bouskoura pour préparation.
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-mono text-[#1E4D2B] font-bold block mb-2">ÉTAPE 03</span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-serif-heading">Livraison Express 24h/48h</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans-body">
                  Le coursier vous contacte par téléphone pour fixer l’heure de remise à domicile ou sur votre lieu de travail.
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-mono text-[#1E4D2B] font-bold block mb-2">ÉTAPE 04</span>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-serif-heading">Paiement à la Réception</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans-body">
                  Vous vérifiez l’intégrité de votre flacon scellé avant de régler le montant en dirhams en espèces au livreur.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Explicit Confirmation Dialog for Google Sheets Mutating Operations */}
      {pendingMutation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-serif-heading">
                  Confirmer la modification Google Sheets
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingMutation(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed font-sans-body">
              {pendingMutation.type === 'create_sheet' && (
                <p>
                  Voulez-vous créer une nouvelle feuille Google Sheet intitulée{' '}
                  <strong className="text-slate-900">« AtlasForge Commandes COD (spaceseller.ma) »</strong> sur votre compte{' '}
                  <strong className="text-slate-900">{googleUser?.email || TARGET_MERCHANT_EMAIL}</strong> avec les 15 colonnes de commande ?
                </p>
              )}

              {pendingMutation.type === 'append_test' && (
                <div className="space-y-1.5">
                  <p>
                    Voulez-vous ajouter cette ligne test dans l’onglet{' '}
                    <strong className="text-slate-900">« {selectedSheetTitle} »</strong> du document{' '}
                    <strong className="text-slate-900">« {metadata?.title} »</strong> ?
                  </p>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-0.5">
                    <p><strong>N° Commande :</strong> {pendingMutation.payload.orderId}</p>
                    <p><strong>Client :</strong> {pendingMutation.payload.customerName} ({pendingMutation.payload.city})</p>
                    <p><strong>Montant COD :</strong> {pendingMutation.payload.totalMAD} MAD</p>
                  </div>
                </div>
              )}

              {pendingMutation.type === 'sync_pending' && (
                <p>
                  Voulez-vous ajouter <strong className="text-slate-900">{pendingMutation.payloads.length} commande(s)</strong> en attente dans l’onglet{' '}
                  <strong className="text-slate-900">« {selectedSheetTitle} »</strong> de{' '}
                  <strong className="text-slate-900">« {metadata?.title} »</strong> ?
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isMutating}
                onClick={() => setPendingMutation(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isMutating}
                onClick={handleConfirmMutation}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1E4D2B] hover:bg-[#163a20] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isMutating ? 'Exécution...' : 'Confirmer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
