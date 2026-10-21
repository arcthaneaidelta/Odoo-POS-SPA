import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Guest,
  Outlet,
  Product,
  RestaurantTable,
  SpaTreatment,
  Therapist,
  TreatmentRoom,
  SpaBooking,
  FolioPosting,
  Payment,
  Invoice,
  DemoSettings,
  ActivityFeedItem,
  Order,
  OrderLine,
  OrderModifier,
  TableStatus,
  SpaBookingStatus,
  PaymentMethodType,
  Currency,
  Language,
  FolioPostingStatus
} from '../types';
import {
  initialGuests,
  initialOutlets,
  initialProducts,
  initialTables,
  initialSpaTreatments,
  initialTherapists,
  initialTreatmentRooms,
  initialSpaBookings,
  initialFolioPostings,
  initialPayments,
  initialInvoices,
  initialOrders,
  initialActivityFeed,
  initialSettings
} from '../data/initialData';
import { translations, TranslationKey } from '../i18n/translations';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  // State
  guests: Guest[];
  outlets: Outlet[];
  products: Product[];
  tables: RestaurantTable[];
  treatments: SpaTreatment[];
  therapists: Therapist[];
  rooms: TreatmentRoom[];
  spaBookings: SpaBooking[];
  folioPostings: FolioPosting[];
  payments: Payment[];
  invoices: Invoice[];
  orders: Order[];
  activityFeed: ActivityFeedItem[];
  settings: DemoSettings;
  currentOrderLines: OrderLine[];
  currentOutletId: string;
  selectedTableId: string | null;
  tipPercent: number;
  customTipAmount: number;
  displayCurrency: Currency;
  toasts: ToastItem[];
  activeModalOrder: Order | null;

  // Formatting & Translation
  t: (key: TranslationKey) => string;
  formatPrice: (amountMxn: number) => string;
  convertCurrency: (amountMxn: number) => number;
  setLanguage: (lang: Language) => void;
  setDisplayCurrency: (curr: Currency) => void;

  // Toast
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // POS
  setCurrentOutletId: (outletId: string) => void;
  addToCurrentOrder: (product: Product, modifiers?: OrderModifier[], notes?: string) => void;
  updateOrderLineQuantity: (lineId: string, quantity: number) => void;
  removeFromCurrentOrder: (lineId: string) => void;
  clearCurrentOrder: () => void;
  setTipPercent: (percent: number) => void;
  setCustomTipAmount: (amount: number) => void;
  checkoutOrder: (
    method: PaymentMethodType,
    guestId?: string,
    cashGiven?: number
  ) => Promise<{ order: Order; folioPosting?: FolioPosting; payment?: Payment }>;
  setActiveModalOrder: (order: Order | null) => void;

  // Tables
  setSelectedTableId: (tableId: string | null) => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;

  // Spa
  checkResourceAvailability: (
    date: string,
    startTime: string,
    durationMinutes: number,
    therapistId: string,
    roomId: string,
    excludeBookingId?: string
  ) => { available: boolean; reason?: string };
  createSpaBooking: (bookingData: Omit<SpaBooking, 'id' | 'bookingRef'>) => Promise<SpaBooking>;
  updateSpaBookingStatus: (bookingId: string, status: SpaBookingStatus) => void;
  sendSpaBalanceToPos: (bookingId: string) => void;

  // PMS Folios
  simulatePmsFailure: (postingId: string) => void;
  retryFolioPosting: (postingId: string) => Promise<boolean>;

  // Payments & Stripe
  generatePaymentLink: (bookingId: string, amountMxn: number) => { linkUrl: string; payment: Payment };
  simulatePaymentStatusChange: (paymentId: string, status: 'succeeded' | 'failed') => void;
  runDemoReconciliation: () => { matchedCount: number; mismatchCount: number; pendingCount: number };

  // Invoicing
  validateCfdi: (rfc: string, legalName: string, postalCode: string, taxRegime: string) => { valid: boolean; errors: string[] };
  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'status'>) => Promise<Invoice>;
  simulateTimbrado: (invoiceId: string) => Promise<Invoice>;

  // Settings & Reset
  updateSettings: (newSettings: Partial<DemoSettings>) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'casa_marea_demo_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or localStorage
  const loadState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse local storage, falling back to initial data', e);
    }
    return null;
  };

  const saved = loadState();

  const [guests, setGuests] = useState<Guest[]>(saved?.guests || initialGuests);
  const [outlets, setOutlets] = useState<Outlet[]>(saved?.outlets || initialOutlets);
  const [products] = useState<Product[]>(saved?.products || initialProducts);
  const [tables, setTables] = useState<RestaurantTable[]>(saved?.tables || initialTables);
  const [treatments] = useState<SpaTreatment[]>(saved?.treatments || initialSpaTreatments);
  const [therapists] = useState<Therapist[]>(saved?.therapists || initialTherapists);
  const [rooms] = useState<TreatmentRoom[]>(saved?.rooms || initialTreatmentRooms);
  const [spaBookings, setSpaBookings] = useState<SpaBooking[]>(saved?.spaBookings || initialSpaBookings);
  const [folioPostings, setFolioPostings] = useState<FolioPosting[]>(saved?.folioPostings || initialFolioPostings);
  const [payments, setPayments] = useState<Payment[]>(saved?.payments || initialPayments);
  const [invoices, setInvoices] = useState<Invoice[]>(saved?.invoices || initialInvoices);
  const [orders, setOrders] = useState<Order[]>(saved?.orders || initialOrders);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(saved?.activityFeed || initialActivityFeed);
  const [settings, setSettings] = useState<DemoSettings>(saved?.settings || initialSettings);

  // Transient POS state
  const [currentOrderLines, setCurrentOrderLines] = useState<OrderLine[]>([]);
  const [currentOutletId, setCurrentOutletId] = useState<string>('out_restaurant');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTipAmount, setCustomTipAmount] = useState<number>(0);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(saved?.settings?.defaultCurrency || 'MXN');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      const payload = {
        guests,
        outlets,
        products,
        tables,
        treatments,
        therapists,
        rooms,
        spaBookings,
        folioPostings,
        payments,
        invoices,
        orders,
        activityFeed,
        settings
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [guests, outlets, products, tables, treatments, therapists, rooms, spaBookings, folioPostings, payments, invoices, orders, activityFeed, settings]);

  // Translation helper
  const t = (key: TranslationKey): string => {
    const lang = settings.language || 'en';
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const setLanguage = (lang: Language) => {
    setSettings(prev => ({ ...prev, language: lang }));
    addToast('info', lang === 'es' ? 'Idioma Actualizado' : 'Language Updated', lang === 'es' ? 'Interfaz configurada en Español de México.' : 'Interface configured to English.');
  };

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(item => item.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(item => item.id !== id));
  };

  // Currency Converter & Formatter
  const convertCurrency = (amountMxn: number): number => {
    if (displayCurrency === 'USD') {
      return Number((amountMxn / settings.exchangeRateUsdMxn).toFixed(2));
    }
    return amountMxn;
  };

  const formatPrice = (amountMxn: number): string => {
    if (displayCurrency === 'USD') {
      const usd = amountMxn / settings.exchangeRateUsdMxn;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(usd);
    }
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amountMxn);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setGuests(initialGuests);
    setOutlets(initialOutlets);
    setTables(initialTables);
    setSpaBookings(initialSpaBookings);
    setFolioPostings(initialFolioPostings);
    setPayments(initialPayments);
    setInvoices(initialInvoices);
    setOrders(initialOrders);
    setActivityFeed(initialActivityFeed);
    setSettings(initialSettings);
    setCurrentOrderLines([]);
    setSelectedTableId(null);
    setActiveModalOrder(null);
    addToast('info', t('resetDemo'), 'All operational records restored to baseline demo state.');
  };

  // POS Actions
  const addToCurrentOrder = (product: Product, modifiers: OrderModifier[] = [], notes: string = '') => {
    setCurrentOrderLines(prev => {
      const existingIndex = prev.findIndex(
        l => l.productId === product.id && JSON.stringify(l.selectedModifiers) === JSON.stringify(modifiers) && l.notes === notes
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        const item = copy[existingIndex];
        const newQty = item.quantity + 1;
        copy[existingIndex] = {
          ...item,
          quantity: newQty,
          subtotalMxn: newQty * item.unitPriceMxn
        };
        return copy;
      } else {
        const modTotal = modifiers.reduce((acc, m) => acc + m.priceMxn, 0);
        const unitPrice = product.priceMxn + modTotal;
        const newLine: OrderLine = {
          id: 'line_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          productId: product.id,
          productName: product.name,
          productNameEs: product.nameEs,
          quantity: 1,
          unitPriceMxn: unitPrice,
          selectedModifiers: modifiers,
          notes,
          subtotalMxn: unitPrice
        };
        return [...prev, newLine];
      }
    });
    addToast('success', 'Item Added', `${product.name} added to current check.`);
  };

  const updateOrderLineQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCurrentOrder(lineId);
      return;
    }
    setCurrentOrderLines(prev =>
      prev.map(line =>
        line.id === lineId
          ? {
              ...line,
              quantity,
              subtotalMxn: quantity * line.unitPriceMxn
            }
          : line
      )
    );
  };

  const removeFromCurrentOrder = (lineId: string) => {
    setCurrentOrderLines(prev => prev.filter(line => line.id !== lineId));
  };

  const clearCurrentOrder = () => {
    setCurrentOrderLines([]);
    setCustomTipAmount(0);
  };

  // Checkout order
  const checkoutOrder = async (
    method: PaymentMethodType,
    guestId?: string,
    cashGiven?: number
  ): Promise<{ order: Order; folioPosting?: FolioPosting; payment?: Payment }> => {
    const subtotal = currentOrderLines.reduce((acc, l) => acc + l.subtotalMxn, 0);
    const tax = Number((subtotal * (settings.taxRatePercent / 100)).toFixed(2));
    const serviceCharge = Number((subtotal * (settings.serviceChargePercent / 100)).toFixed(2));
    const tip = customTipAmount > 0 ? customTipAmount : Number((subtotal * (tipPercent / 100)).toFixed(2));
    const total = Number((subtotal + tax + serviceCharge + tip).toFixed(2));

    const outlet = outlets.find(o => o.id === currentOutletId) || outlets[0];
    const table = tables.find(t => t.id === selectedTableId);
    const guest = guests.find(g => g.id === guestId);

    const orderNumber = `ORD-2026-${Math.floor(4500 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      outletId: outlet.id,
      outletName: outlet.name,
      tableNumber: table?.number,
      serverName: table?.serverName || 'Staff Terminal',
      lines: [...currentOrderLines],
      subtotalMxn: subtotal,
      taxMxn: tax,
      serviceChargeMxn: serviceCharge,
      tipMxn: tip,
      totalMxn: total,
      status: 'paid',
      paymentMethod: method,
      guestId: guest?.id,
      guestName: guest?.name,
      roomNumber: guest?.roomNumber,
      createdAt: '2026-10-21 16:30:00'
    };

    let newFolio: FolioPosting | undefined;
    let newPayment: Payment | undefined;

    // Handle Room Charge (Scenario A)
    if (method === 'room_charge' && guest) {
      const postingRef = `FOL-2026-${Math.floor(9000 + Math.random() * 900)}`;
      newFolio = {
        id: 'fol_' + Date.now(),
        postingRef,
        guestId: guest.id,
        guestName: guest.name,
        roomNumber: guest.roomNumber,
        sourceOutlet: outlet.name,
        transactionRef: orderNumber,
        amountMxn: total,
        currency: 'MXN',
        status: 'posted',
        lastAttempt: '2026-10-21 16:30:05',
        retryCount: 0,
        idempotencyKey: `idem_pos_${orderNumber}_${Date.now()}`,
        simulatedPmsAmountMxn: total
      };

      setFolioPostings(prev => [newFolio!, ...prev]);

      // Update Guest Folio Balance
      setGuests(prev =>
        prev.map(g =>
          g.id === guest.id ? { ...g, folioBalanceMxn: g.folioBalanceMxn + total } : g
        )
      );

      // Add to Activity Feed
      setActivityFeed(prev => [
        {
          id: 'act_' + Date.now(),
          timestamp: '16:30',
          type: 'folio',
          title: 'Room Charge Synchronized',
          titleEs: 'Cargo a Habitación Sincronizado',
          description: `Room ${guest.roomNumber} (${guest.name}) charged MXN ${total.toLocaleString()} from ${outlet.name}.`,
          descriptionEs: `Habitación ${guest.roomNumber} (${guest.name}) cargada con MXN ${total.toLocaleString()} desde ${outlet.nameEs}.`,
          linkRoute: '/app/folios'
        },
        ...prev
      ]);
    } else if (method === 'digital') {
      const payRef = `PAY-2026-${Math.floor(5600 + Math.random() * 400)}`;
      newPayment = {
        id: 'pay_' + Date.now(),
        paymentRef: payRef,
        guestId: guest?.id,
        guestName: guest?.name || 'Walk-in Guest',
        source: 'pos_digital',
        amountMxn: total,
        currency: 'MXN',
        paymentMethod: 'card',
        status: 'succeeded',
        providerRef: `pi_3Nx999${Math.random().toString(36).substr(2, 6)}`,
        createdAt: '2026-10-21 16:30:00',
        orderId: newOrder.id,
        reconciliationStatus: 'matched'
      };
      setPayments(prev => [newPayment!, ...prev]);
    }

    // Update table status if table was selected
    if (selectedTableId) {
      setTables(prev =>
        prev.map(tbl =>
          tbl.id === selectedTableId
            ? { ...tbl, status: 'available', totalAmountMxn: 0, currentOrderId: undefined }
            : tbl
        )
      );
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCurrentOrder();
    setActiveModalOrder(newOrder);

    addToast(
      'success',
      'Checkout Confirmed',
      method === 'room_charge'
        ? `Charge of ${formatPrice(total)} posted to Room ${guest?.roomNumber} folio.`
        : `Payment of ${formatPrice(total)} completed successfully.`
    );

    return { order: newOrder, folioPosting: newFolio, payment: newPayment };
  };

  // Table actions
  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables(prev =>
      prev.map(t => (t.id === tableId ? { ...t, status } : t))
    );
  };

  // Spa Conflict Detection Engine (PRD Section 9.4)
  const checkResourceAvailability = (
    date: string,
    startTime: string,
    durationMinutes: number,
    therapistId: string,
    roomId: string,
    excludeBookingId?: string
  ): { available: boolean; reason?: string } => {
    const parseTimeMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const requestedStart = parseTimeMinutes(startTime);
    const requestedEnd = requestedStart + durationMinutes;
    const buffer = settings.spaCleanupBufferMinutes; // 15 min buffer

    const therapist = therapists.find(t => t.id === therapistId);
    if (therapist) {
      const workStart = parseTimeMinutes(therapist.workingHours.start);
      const workEnd = parseTimeMinutes(therapist.workingHours.end);
      if (requestedStart < workStart || requestedEnd > workEnd) {
        return {
          available: false,
          reason: `Therapist ${therapist.name} working hours are ${therapist.workingHours.start} to ${therapist.workingHours.end}.`
        };
      }
    }

    // Check overlaps with other bookings on the same date
    for (const b of spaBookings) {
      if (b.status === 'cancelled') continue;
      if (excludeBookingId && b.id === excludeBookingId) continue;
      if (b.date !== date) continue;

      const existingStart = parseTimeMinutes(b.startTime);
      // Existing booking occupies until endTime + buffer
      const existingBlockedEnd = parseTimeMinutes(b.endTime) + buffer;
      const requestedBlockedEnd = requestedEnd + buffer;

      const hasOverlap = requestedStart < existingBlockedEnd && requestedBlockedEnd > existingStart;

      if (hasOverlap) {
        if (b.therapistId === therapistId) {
          return {
            available: false,
            reason: `Therapist conflict: ${b.therapistName} is occupied with booking ${b.bookingRef} until ${b.endTime} (+${buffer}m sanitation).`
          };
        }
        if (b.roomId === roomId) {
          return {
            available: false,
            reason: `Room conflict: ${b.roomName} is reserved for booking ${b.bookingRef} until ${b.endTime} (+${buffer}m sanitation).`
          };
        }
      }
    }

    return { available: true };
  };

  // Spa Booking Creation
  const createSpaBooking = async (
    bookingData: Omit<SpaBooking, 'id' | 'bookingRef'>
  ): Promise<SpaBooking> => {
    const bookingRef = `SPA-2026-${Math.floor(1100 + Math.random() * 800)}`;
    const newBooking: SpaBooking = {
      ...bookingData,
      id: 'spabk_' + Date.now(),
      bookingRef
    };

    // If deposit paid, create a payment record
    if (newBooking.depositPaidMxn > 0) {
      const payRef = `PAY-2026-${Math.floor(5700 + Math.random() * 300)}`;
      const depositPayment: Payment = {
        id: 'pay_' + Date.now(),
        paymentRef: payRef,
        guestId: newBooking.guestId,
        guestName: newBooking.guestName,
        source: 'public_spa_booking',
        amountMxn: newBooking.depositPaidMxn,
        currency: 'MXN',
        paymentMethod: 'card',
        status: 'succeeded',
        providerRef: `pi_3NxSpa${Math.random().toString(36).substr(2, 6)}`,
        createdAt: '2026-10-21 16:32:00',
        bookingId: newBooking.id,
        reconciliationStatus: 'matched'
      };
      newBooking.depositPaymentId = depositPayment.id;
      setPayments(prev => [depositPayment, ...prev]);
    }

    setSpaBookings(prev => [newBooking, ...prev]);

    setActivityFeed(prev => [
      {
        id: 'act_' + Date.now(),
        timestamp: '16:32',
        type: 'spa',
        title: 'New Spa Booking Confirmed',
        titleEs: 'Nueva Cita de Spa Confirmada',
        description: `${newBooking.guestName} booked ${newBooking.treatmentName} with ${newBooking.therapistName}.`,
        descriptionEs: `${newBooking.guestName} reservó ${newBooking.treatmentName} con ${newBooking.therapistName}.`,
        linkRoute: '/app/spa'
      },
      ...prev
    ]);

    addToast(
      'success',
      'Appointment Confirmed',
      `Booking ${bookingRef} scheduled for ${newBooking.guestName}.`
    );

    return newBooking;
  };

  // Update Spa Booking Status
  const updateSpaBookingStatus = (bookingId: string, status: SpaBookingStatus) => {
    setSpaBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status } : b))
    );
    addToast('info', 'Status Updated', `Spa booking marked as ${status.replace('_', ' ')}.`);
  };

  // Send Spa Balance to POS (Scenario B: Step 9-11)
  const sendSpaBalanceToPos = (bookingId: string) => {
    const booking = spaBookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Create an OrderLine with the remaining balance
    const spaBalanceLine: OrderLine = {
      id: 'line_spa_' + Date.now(),
      productId: 'prd_spa_balance',
      productName: `Spa Balance: ${booking.treatmentName} (#${booking.bookingRef})`,
      productNameEs: `Saldo de Spa: ${booking.treatmentName} (#${booking.bookingRef})`,
      quantity: 1,
      unitPriceMxn: booking.remainingBalanceMxn,
      selectedModifiers: [],
      notes: `Therapist: ${booking.therapistName} · Room: ${booking.roomName}`,
      subtotalMxn: booking.remainingBalanceMxn
    };

    setCurrentOrderLines([spaBalanceLine]);
    setCurrentOutletId('out_restaurant'); // Route to POS
    addToast(
      'success',
      'Balance Sent to POS',
      `Remaining balance of ${formatPrice(booking.remainingBalanceMxn)} routed to checkout.`
    );
  };

  // PMS Failure Simulation (Scenario C)
  const simulatePmsFailure = (postingId: string) => {
    setFolioPostings(prev =>
      prev.map(f =>
        f.id === postingId
          ? {
              ...f,
              status: 'failed',
              lastAttempt: '2026-10-21 16:35:12',
              simulatedFailureReason:
                'PMS Socket Exception: Opera Cloud PMS listener socket unresponsive (EAI_AGAIN 504 Gateway Timeout)',
              simulatedPmsAmountMxn: 0
            }
          : f
      )
    );
    addToast(
      'error',
      'Simulated PMS Failure Triggered',
      'Folio posting flagged with simulated 504 Gateway Timeout. Inspect details and retry safely.'
    );
  };

  // PMS Idempotent Retry (Scenario C)
  const retryFolioPosting = async (postingId: string): Promise<boolean> => {
    const posting = folioPostings.find(f => f.id === postingId);
    if (!posting) return false;

    // Show temporary "posting" state
    setFolioPostings(prev =>
      prev.map(f => (f.id === postingId ? { ...f, status: 'posting' } : f))
    );

    // Simulate safe API handshake
    await new Promise(res => setTimeout(res, 800));

    setFolioPostings(prev =>
      prev.map(f =>
        f.id === postingId
          ? {
              ...f,
              status: 'posted',
              retryCount: f.retryCount + 1,
              lastAttempt: '2026-10-21 16:36:00',
              simulatedFailureReason: undefined,
              simulatedPmsAmountMxn: f.amountMxn
            }
          : f
      )
    );

    addToast(
      'success',
      'Idempotent Retry Successful',
      `Folio ${posting.postingRef} posted cleanly using stable idempotency key ${posting.idempotencyKey}. No duplicate created.`
    );
    return true;
  };

  // Payment Link Generator (Scenario D)
  const generatePaymentLink = (
    bookingId: string,
    amountMxn: number
  ): { linkUrl: string; payment: Payment } => {
    const booking = spaBookings.find(b => b.id === bookingId);
    const linkRef = `plink_cm_${Math.random().toString(36).substr(2, 8)}`;
    const linkUrl = `https://pay.casamarea.com/l/${linkRef}`;

    const newPayment: Payment = {
      id: 'pay_' + Date.now(),
      paymentRef: `PAY-2026-${Math.floor(5800 + Math.random() * 200)}`,
      guestId: booking?.guestId,
      guestName: booking?.guestName || 'Valued Guest',
      source: 'payment_link',
      amountMxn,
      currency: 'MXN',
      paymentMethod: 'card',
      status: 'pending',
      providerRef: `pi_demo_${linkRef}`,
      createdAt: '2026-10-21 16:38:00',
      bookingId,
      reconciliationStatus: 'pending'
    };

    setPayments(prev => [newPayment, ...prev]);

    addToast(
      'success',
      'Demo Payment Link Generated',
      `Simulated link created for ${formatPrice(amountMxn)}. Ready for settlement simulation.`
    );

    return { linkUrl, payment: newPayment };
  };

  const simulatePaymentStatusChange = (paymentId: string, status: 'succeeded' | 'failed') => {
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status,
              reconciliationStatus: status === 'succeeded' ? 'matched' : 'mismatch'
            }
          : p
      )
    );
    addToast(
      status === 'succeeded' ? 'success' : 'error',
      'Payment Status Updated',
      `Payment marked as ${status}.`
    );
  };

  // Payment Demo Reconciliation (Scenario D)
  const runDemoReconciliation = () => {
    const matched = payments.filter(p => p.reconciliationStatus === 'matched').length;
    const mismatches = payments.filter(p => p.reconciliationStatus === 'mismatch').length;
    const pending = payments.filter(p => p.reconciliationStatus === 'pending').length;

    addToast(
      'info',
      'Reconciliation Audit Complete',
      `Audited ${payments.length} transactions: ${matched} matched, ${mismatches} discrepancy flagged, ${pending} pending settlement.`
    );

    return { matchedCount: matched, mismatchCount: mismatches, pendingCount: pending };
  };

  // CFDI 4.0 Validation & Creation (Scenario E)
  const validateCfdi = (
    rfc: string,
    legalName: string,
    postalCode: string,
    taxRegime: string
  ): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rfcRegex = /^([A-ZÑ&]{3,4})\d{6}([A-V1-9][A-Z1-9][0-9A])?$/i;

    if (!rfc || !rfc.trim()) {
      errors.push('RFC is required.');
    } else if (!rfcRegex.test(rfc.trim()) && rfc.trim() !== 'XAXX010101000') {
      errors.push('Invalid RFC format. Must be 12 characters (moral) or 13 characters (física).');
    }

    if (!legalName || legalName.trim().length < 3) {
      errors.push('Legal Name (Razón Social) must be at least 3 characters.');
    }

    if (!postalCode || !/^\d{5}$/.test(postalCode.trim())) {
      errors.push('Fiscal Postal Code must be exactly 5 numeric digits.');
    }

    if (!taxRegime || !taxRegime.trim()) {
      errors.push('Tax Regime (Régimen Fiscal) must be selected.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const createInvoice = async (
    data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'status'>
  ): Promise<Invoice> => {
    const invoiceNumber = `FAC-CM-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: Invoice = {
      ...data,
      id: 'inv_' + Date.now(),
      invoiceNumber,
      status: 'awaiting_validation',
      createdAt: '2026-10-21 16:40:00'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    addToast(
      'success',
      'Draft Invoice Created',
      `Invoice ${invoiceNumber} created and awaiting CFDI 4.0 validation.`
    );
    return newInvoice;
  };

  const simulateTimbrado = async (invoiceId: string): Promise<Invoice> => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error('Invoice not found');

    // Show simulated stamping delay
    setInvoices(prev =>
      prev.map(i => (i.id === invoiceId ? { ...i, status: 'simulated_timbrado' } : i))
    );

    await new Promise(res => setTimeout(res, 700));

    const simulatedUuid = `DEMO-${Math.random().toString(36).substr(2, 8).toUpperCase()}-4A3B-8C9D-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;

    const updated: Invoice = {
      ...inv,
      status: 'issued',
      simulatedUuid
    };

    setInvoices(prev => prev.map(i => (i.id === invoiceId ? updated : i)));

    setActivityFeed(prev => [
      {
        id: 'act_' + Date.now(),
        timestamp: '16:42',
        type: 'invoice',
        title: 'CFDI 4.0 Simulated Timbrado',
        titleEs: 'Timbrado Simulado CFDI 4.0',
        description: `Invoice ${inv.invoiceNumber} certified with demo UUID: ${simulatedUuid}.`,
        descriptionEs: `Factura ${inv.invoiceNumber} timbrada con UUID demo: ${simulatedUuid}.`,
        linkRoute: '/app/invoicing'
      },
      ...prev
    ]);

    addToast(
      'success',
      'Simulated Timbrado Completed',
      `CFDI 4.0 stamp applied to ${inv.invoiceNumber} (DEMO SAT Stamping).`
    );

    return updated;
  };

  const updateSettings = (newSettings: Partial<DemoSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('info', 'Settings Updated', 'Operational parameters modified.');
  };

  return (
    <AppContext.Provider
      value={{
        guests,
        outlets,
        products,
        tables,
        treatments,
        therapists,
        rooms,
        spaBookings,
        folioPostings,
        payments,
        invoices,
        orders,
        activityFeed,
        settings,
        currentOrderLines,
        currentOutletId,
        selectedTableId,
        tipPercent,
        customTipAmount,
        displayCurrency,
        toasts,
        activeModalOrder,
        t,
        formatPrice,
        convertCurrency,
        setLanguage,
        setDisplayCurrency,
        addToast,
        removeToast,
        setCurrentOutletId,
        addToCurrentOrder,
        updateOrderLineQuantity,
        removeFromCurrentOrder,
        clearCurrentOrder,
        setTipPercent,
        setCustomTipAmount,
        checkoutOrder,
        setActiveModalOrder,
        setSelectedTableId,
        updateTableStatus,
        checkResourceAvailability,
        createSpaBooking,
        updateSpaBookingStatus,
        sendSpaBalanceToPos,
        simulatePmsFailure,
        retryFolioPosting,
        generatePaymentLink,
        simulatePaymentStatusChange,
        runDemoReconciliation,
        validateCfdi,
        createInvoice,
        simulateTimbrado,
        updateSettings,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
