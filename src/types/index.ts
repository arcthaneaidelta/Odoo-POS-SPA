export type Language = 'en' | 'es';
export type Currency = 'MXN' | 'USD';

export interface Guest {
  id: string;
  name: string;
  roomNumber: string;
  reservationRef: string;
  stayStatus: 'in-house' | 'arriving' | 'departed' | 'vip';
  arrivalDate: string;
  departureDate: string;
  folioBalanceMxn: number;
  email: string;
  phone: string;
  vipTier?: 'Founders Circle' | 'Ocean Villa Suite' | 'Standard Guest';
}

export interface Outlet {
  id: string;
  name: string;
  nameEs: string;
  type: 'restaurant' | 'bar' | 'pool_beach' | 'boutique';
  status: 'open' | 'closed';
  terminalName: string;
  activeOrdersCount: number;
  description: string;
  descriptionEs: string;
}

export type ProductCategory = 'food' | 'cocktails' | 'wine_beverages' | 'desserts' | 'spa_retail' | 'boutique';

export interface Product {
  id: string;
  outletId: string;
  category: ProductCategory;
  name: string;
  nameEs: string;
  priceMxn: number;
  description: string;
  descriptionEs: string;
  image?: string;
  isAvailable: boolean;
  preparationStation?: 'kitchen' | 'bar' | 'boutique';
}

export interface OrderModifier {
  id: string;
  name: string;
  nameEs: string;
  priceMxn: number;
}

export interface OrderLine {
  id: string;
  productId: string;
  productName: string;
  productNameEs?: string;
  quantity: number;
  unitPriceMxn: number;
  selectedModifiers: OrderModifier[];
  notes?: string;
  subtotalMxn: number;
}

export type OrderStatus = 'new' | 'in_preparation' | 'ready' | 'served' | 'paid';
export type PaymentMethodType = 'cash' | 'digital' | 'room_charge';

export interface Order {
  id: string;
  orderNumber: string;
  outletId: string;
  outletName: string;
  tableNumber?: string;
  serverName: string;
  lines: OrderLine[];
  subtotalMxn: number;
  taxMxn: number; // 16% IVA
  serviceChargeMxn: number;
  tipMxn: number;
  totalMxn: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethodType;
  guestId?: string;
  guestName?: string;
  roomNumber?: string;
  createdAt: string;
  elapsedMinutes?: number;
  kitchenNotes?: string;
  splitBills?: SplitBill[];
}

export interface SplitBill {
  id: string;
  title: string;
  lines: OrderLine[];
  totalMxn: number;
  isPaid: boolean;
  paymentMethod?: PaymentMethodType;
}

export type TableStatus = 'available' | 'seated' | 'ordering' | 'served' | 'bill_requested';

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  serverName: string;
  guestsCount: number;
  totalAmountMxn: number;
  section: 'Terrace Ocean View' | 'Pergola Garden' | 'Bar Lounge';
}

export interface SpaTreatmentAddOn {
  id: string;
  name: string;
  nameEs: string;
  priceMxn: number;
  durationMinutes: number;
}

export interface SpaTreatment {
  id: string;
  name: string;
  nameEs: string;
  durationMinutes: number;
  priceMxn: number;
  description: string;
  descriptionEs: string;
  category: 'Massage' | 'Facial' | 'Couples' | 'Recovery';
  addOns: SpaTreatmentAddOn[];
}

export interface Therapist {
  id: string;
  name: string;
  specialties: string[];
  isAvailable: boolean;
  workingHours: { start: string; end: string };
}

export interface TreatmentRoom {
  id: string;
  name: string;
  type: 'standard' | 'couples' | 'ocean_cabin';
  isAvailable: boolean;
}

export type SpaBookingStatus = 'pending_deposit' | 'confirmed' | 'checked_in' | 'in_treatment' | 'completed' | 'cancelled';

export interface SpaBooking {
  id: string;
  bookingRef: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  treatmentId: string;
  treatmentName: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  therapistId: string;
  therapistName: string;
  roomId: string;
  roomName: string;
  addOnIds: string[];
  totalPriceMxn: number;
  depositPaidMxn: number;
  remainingBalanceMxn: number;
  status: SpaBookingStatus;
  depositPaymentId?: string;
  folioPostingId?: string;
  posOrderId?: string;
  notes?: string;
}

export type FolioPostingStatus = 'queued' | 'posting' | 'posted' | 'failed' | 'requires_review';

export interface FolioPosting {
  id: string;
  postingRef: string;
  guestId: string;
  guestName: string;
  roomNumber: string;
  sourceOutlet: string;
  transactionRef: string;
  amountMxn: number;
  currency: Currency;
  status: FolioPostingStatus;
  lastAttempt: string;
  simulatedFailureReason?: string;
  retryCount: number;
  idempotencyKey: string;
  simulatedPmsAmountMxn?: number; // for reconciliation testing
}

export type PaymentSource = 'spa_deposit' | 'public_spa_booking' | 'pos_digital' | 'payment_link';
export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  paymentRef: string;
  guestId?: string;
  guestName: string;
  source: PaymentSource;
  amountMxn: number;
  currency: Currency;
  paymentMethod: 'card' | 'apple_pay' | 'room_charge' | 'cash';
  status: PaymentStatus;
  providerRef: string; // e.g. ch_3M5qJ...
  createdAt: string;
  bookingId?: string;
  orderId?: string;
  reconciliationStatus: 'matched' | 'mismatch' | 'pending';
  mismatchReason?: string;
}

export type InvoiceStatus = 'draft' | 'awaiting_validation' | 'simulated_timbrado' | 'issued' | 'failed';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  sourceRef: string; // POS or Spa ref
  guestName: string;
  rfc: string;
  legalName: string;
  postalCode: string;
  taxRegime: string; // e.g. 601, 605, 612
  cfdiUse: string; // e.g. G03 - Gastos en general
  paymentMethod: 'PUE' | 'PPD'; // Pago en una sola exhibición / Pago en parcialidades o diferido
  paymentForm: '01' | '04' | '28'; // 01-Efectivo, 04-Tarjeta de crédito, 28-Tarjeta de débito
  subtotalMxn: number;
  ivaMxn: number; // 16% IVA
  totalMxn: number;
  currency: Currency;
  status: InvoiceStatus;
  createdAt: string;
  simulatedUuid?: string;
  validationErrors?: string[];
}

export interface DemoSettings {
  exchangeRateUsdMxn: number; // e.g. 18.5
  defaultCurrency: Currency;
  serviceChargePercent: number; // e.g. 10%
  taxRatePercent: number; // 16% IVA
  spaCleanupBufferMinutes: number; // e.g. 15
  language: Language;
  businessDate: string; // "2026-10-21"
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  type: 'pos' | 'spa' | 'folio' | 'payment' | 'invoice';
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  status?: string;
  linkRoute?: string;
}
