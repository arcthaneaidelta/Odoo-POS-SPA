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
  Order
} from '../types';

export const initialGuests: Guest[] = [
  {
    id: 'gst_001',
    name: 'Sofia Alatorre',
    roomNumber: '214',
    reservationRef: 'RES-CM-9821',
    stayStatus: 'in-house',
    arrivalDate: '2026-10-18',
    departureDate: '2026-10-24',
    folioBalanceMxn: 4850,
    email: 'sofia.alatorre@curatedtravel.com',
    phone: '+52 55 4912 8840',
    vipTier: 'Ocean Villa Suite'
  },
  {
    id: 'gst_002',
    name: 'David Miller',
    roomNumber: '108',
    reservationRef: 'RES-CM-9844',
    stayStatus: 'in-house',
    arrivalDate: '2026-10-19',
    departureDate: '2026-10-23',
    folioBalanceMxn: 1240,
    email: 'david.miller@techpartners.io',
    phone: '+1 415 892 4410',
    vipTier: 'Standard Guest'
  },
  {
    id: 'gst_003',
    name: 'Camila & Mateo Wright',
    roomNumber: '321',
    reservationRef: 'RES-CM-9799',
    stayStatus: 'in-house',
    arrivalDate: '2026-10-17',
    departureDate: '2026-10-25',
    folioBalanceMxn: 6420,
    email: 'c.wright@wrightarch.design',
    phone: '+1 310 740 9923',
    vipTier: 'Founders Circle'
  },
  {
    id: 'gst_004',
    name: 'Elena Rostova',
    roomNumber: '406',
    reservationRef: 'RES-CM-9860',
    stayStatus: 'in-house',
    arrivalDate: '2026-10-20',
    departureDate: '2026-10-26',
    folioBalanceMxn: 3180,
    email: 'elena.rostova@luxuryvillas.ch',
    phone: '+41 79 382 1190',
    vipTier: 'Ocean Villa Suite'
  },
  {
    id: 'gst_005',
    name: 'Marcus Vance',
    roomNumber: '112',
    reservationRef: 'RES-CM-9902',
    stayStatus: 'arriving',
    arrivalDate: '2026-10-21',
    departureDate: '2026-10-27',
    folioBalanceMxn: 0,
    email: 'marcus.vance@vancemedia.com',
    phone: '+1 646 552 9011',
    vipTier: 'Standard Guest'
  },
  {
    id: 'gst_006',
    name: 'Isabella Fontana',
    roomNumber: '501',
    reservationRef: 'RES-CM-9710',
    stayStatus: 'departed',
    arrivalDate: '2026-10-14',
    departureDate: '2026-10-20',
    folioBalanceMxn: 0,
    email: 'i.fontana@milanoarts.it',
    phone: '+39 02 8734 9901',
    vipTier: 'Founders Circle'
  }
];

export const initialOutlets: Outlet[] = [
  {
    id: 'out_restaurant',
    name: 'Marea Terraza Restaurant',
    nameEs: 'Restaurante Terraza Marea',
    type: 'restaurant',
    status: 'open',
    terminalName: 'TERRAZA-POS-01',
    activeOrdersCount: 4,
    description: 'Baja-Mediterranean oceanfront dining with fresh Pacific catch and wood-fired stone ovens.',
    descriptionEs: 'Gastronomía frente al mar inspirada en Baja y el Mediterráneo con pesca fresca del Pacífico.'
  },
  {
    id: 'out_bar',
    name: 'El Mirador Agave Bar',
    nameEs: 'Bar El Mirador Agave',
    type: 'bar',
    status: 'open',
    terminalName: 'MIRADOR-BAR-01',
    activeOrdersCount: 2,
    description: 'Rare mezcals, craft cocktails, and sunset tapas overlooking the Sea of Cortez.',
    descriptionEs: 'Mezcales artesanales, coctelería de autor y tapas al atardecer frente al Mar de Cortés.'
  },
  {
    id: 'out_beach',
    name: 'Las Rocas Beach Club',
    nameEs: 'Club de Playa Las Rocas',
    type: 'pool_beach',
    status: 'open',
    terminalName: 'ROCAS-BEACH-01',
    activeOrdersCount: 3,
    description: 'Chilled coconuts, ceviches, and barefoot coastal luxury by the infinity pool.',
    descriptionEs: 'Cocos frescos, ceviches frescos y lujo relajado junto a la piscina infinita.'
  },
  {
    id: 'out_boutique',
    name: 'La Colección Boutique',
    nameEs: 'Boutique La Colección',
    type: 'boutique',
    status: 'open',
    terminalName: 'BOUTIQUE-POS-01',
    activeOrdersCount: 1,
    description: 'Curated Mexican artisanal linens, hand-blown glass, local ceramics, and resort wear.',
    descriptionEs: 'Linos artesanales mexicanos, vidrio soplado, cerámica local y prendas de resort.'
  }
];

export const initialProducts: Product[] = [
  // Restaurant items
  {
    id: 'prd_001',
    outletId: 'out_restaurant',
    category: 'food',
    name: 'Baja Fish Tacos',
    nameEs: 'Tacos de Pescado Estilo Baja',
    priceMxn: 285,
    description: 'Crispy local sea bass, fermented cabbage slaw, chipotle crema, handmade blue corn tortillas.',
    descriptionEs: 'Robalo local crujiente, ensalada de col fermentada, crema de chipotle y tortillas de maíz azul.',
    isAvailable: true,
    preparationStation: 'kitchen'
  },
  {
    id: 'prd_002',
    outletId: 'out_restaurant',
    category: 'food',
    name: 'Grilled Pacific Octopus',
    nameEs: 'Pulpo del Pacífico a las Brasas',
    priceMxn: 420,
    description: 'Charred octopus, roasted poblano chimichurri, fingerling potatoes, smoked sea salt.',
    descriptionEs: 'Pulpo al carbón, chimichurri de poblano tatemado, papas cambray y sal marina ahumada.',
    isAvailable: true,
    preparationStation: 'kitchen'
  },
  {
    id: 'prd_003',
    outletId: 'out_restaurant',
    category: 'food',
    name: 'Coastal Sea Scallop Ceviche',
    nameEs: 'Ceviche Costero de Callo de Hacha',
    priceMxn: 310,
    description: 'Fresh scallops, key lime, serrano chile, compressed watermelon, cucumber ribbon.',
    descriptionEs: 'Callo de hacha fresco, limón criollo, chile serrano, sandía comprimida y pepino persa.',
    isAvailable: true,
    preparationStation: 'kitchen'
  },
  {
    id: 'prd_004',
    outletId: 'out_restaurant',
    category: 'food',
    name: 'Sonoran Wood-Fired Ribeye',
    nameEs: 'Ribeye Sonorense a la Leña',
    priceMxn: 680,
    description: 'Prime cut grilled over mesquite wood, bone marrow butter, blistered padrón peppers.',
    descriptionEs: 'Corte selecto sonorense a la leña de mezquite, mantequilla de tuétano y pimientos padrón.',
    isAvailable: true,
    preparationStation: 'kitchen'
  },
  // Bar & Cocktails
  {
    id: 'prd_005',
    outletId: 'out_bar',
    category: 'cocktails',
    name: 'Mezcal Marea Margarita',
    nameEs: 'Margarita Marea de Mezcal',
    priceMxn: 240,
    description: 'Espadín artisanal mezcal, freshly squeezed lime, organic agave, black volcanic salt rim.',
    descriptionEs: 'Mezcal artesanal Espadín, jugo de limón fresco, agave orgánico y sal volcánica negra.',
    isAvailable: true,
    preparationStation: 'bar'
  },
  {
    id: 'prd_006',
    outletId: 'out_bar',
    category: 'cocktails',
    name: 'Damiana Citrus Paloma',
    nameEs: 'Paloma Cítrica de Damiana',
    priceMxn: 230,
    description: 'Blanco tequila, wild Baja damiana liqueur, ruby red grapefruit, pink peppercorn.',
    descriptionEs: 'Tequila blanco, licor de damiana silvestre de Baja, toronja ruby y pimienta rosa.',
    isAvailable: true,
    preparationStation: 'bar'
  },
  {
    id: 'prd_007',
    outletId: 'out_bar',
    category: 'wine_beverages',
    name: 'Valle de Guadalupe Nebbiolo (Glass)',
    nameEs: 'Nebbiolo Valle de Guadalupe (Copa)',
    priceMxn: 340,
    description: 'Boutique Mexican red vintage with notes of dried plum, cacao, and desert terroir.',
    descriptionEs: 'Vino tinto de autor de Baja con notas de ciruela deshidratada, cacao y terruño desértico.',
    isAvailable: true,
    preparationStation: 'bar'
  },
  // Pool & Beach
  {
    id: 'prd_008',
    outletId: 'out_beach',
    category: 'wine_beverages',
    name: 'Fresh Coconut Water',
    nameEs: 'Agua de Coco Natural Servida en Fruto',
    priceMxn: 110,
    description: 'Chilled fresh young coconut harvested locally in Todos Santos, served whole.',
    descriptionEs: 'Coco tierno frío cosechado localmente en Todos Santos, servido entero.',
    isAvailable: true,
    preparationStation: 'bar'
  },
  {
    id: 'prd_009',
    outletId: 'out_beach',
    category: 'food',
    name: 'Baja Tropical Fruit Plate',
    nameEs: 'Platón de Frutas Tropicales de Temporada',
    priceMxn: 165,
    description: 'Papaya, sweet mango, dragon fruit, lime zest, organic chia seeds, wildflower honey.',
    descriptionEs: 'Papaya, mango dulce, pitahaya, ralladura de limón, chía orgánica y miel de flores.',
    isAvailable: true,
    preparationStation: 'kitchen'
  },
  {
    id: 'prd_010',
    outletId: 'out_restaurant',
    category: 'desserts',
    name: 'Churros de Canela con Cajeta',
    nameEs: 'Churros Artesanales con Cajeta',
    priceMxn: 190,
    description: 'Hand-piped Mexican cinnamon churros, warm goat milk cajeta, Oaxacan chocolate dip.',
    descriptionEs: 'Churros frescos espolvoreados con canela, cajeta de Celaya tibia y salsa de chocolate de Oaxaca.',
    isAvailable: true,
    preparationStation: 'kitchen'
  },
  // Boutique & Spa Retail
  {
    id: 'prd_011',
    outletId: 'out_boutique',
    category: 'spa_retail',
    name: 'Signature Desert Botanicals Massage Oil',
    nameEs: 'Aceite de Masaje Botánica del Desierto',
    priceMxn: 680,
    description: 'Organic cold-pressed jojoba infused with wild Baja sage, rosemary, and bergamot.',
    descriptionEs: 'Jojoba orgánica prensada en frío con infusión de salvia de Baja, romero y bergamota.',
    isAvailable: true,
    preparationStation: 'boutique'
  },
  {
    id: 'prd_012',
    outletId: 'out_boutique',
    category: 'boutique',
    name: 'Casa Marea Resort Linen Tote',
    nameEs: 'Bolso Playero de Lino Casa Marea',
    priceMxn: 490,
    description: 'Heavyweight organic stone-washed linen tote with hand-stitched leather straps.',
    descriptionEs: 'Bolso de lino orgánico lavado a la piedra con correas de piel cosidas a mano.',
    isAvailable: true,
    preparationStation: 'boutique'
  },
  {
    id: 'prd_013',
    outletId: 'out_boutique',
    category: 'boutique',
    name: 'Baja Ceramic Coffee Tumbler',
    nameEs: 'Vaso Cerámico Artesanal de Café',
    priceMxn: 580,
    description: 'Hand-thrown terracotta and volcanic clay cup made by artisans in San José del Cabo.',
    descriptionEs: 'Taza de terracota y barro volcánico hecha a mano por artesanos en San José del Cabo.',
    isAvailable: true,
    preparationStation: 'boutique'
  }
];

export const initialTables: RestaurantTable[] = [
  {
    id: 'tbl_01',
    number: 'Table 01',
    capacity: 4,
    status: 'seated',
    serverName: 'Elena Ruiz',
    guestsCount: 2,
    totalAmountMxn: 1420,
    section: 'Terrace Ocean View',
    currentOrderId: 'ord_demo_01'
  },
  {
    id: 'tbl_02',
    number: 'Table 02',
    capacity: 2,
    status: 'available',
    serverName: 'Mateo Solís',
    guestsCount: 0,
    totalAmountMxn: 0,
    section: 'Pergola Garden'
  },
  {
    id: 'tbl_03',
    number: 'Table 03',
    capacity: 6,
    status: 'ordering',
    serverName: 'Sofia Navarro',
    guestsCount: 4,
    totalAmountMxn: 2150,
    section: 'Terrace Ocean View'
  },
  {
    id: 'tbl_04',
    number: 'Table 04',
    capacity: 2,
    status: 'bill_requested',
    serverName: 'Lucía Ortega',
    guestsCount: 2,
    totalAmountMxn: 1890,
    section: 'Pergola Garden'
  },
  {
    id: 'tbl_05',
    number: 'Table 05',
    capacity: 4,
    status: 'served',
    serverName: 'Elena Ruiz',
    guestsCount: 3,
    totalAmountMxn: 2860,
    section: 'Terrace Ocean View'
  },
  {
    id: 'tbl_06',
    number: 'Table 06',
    capacity: 8,
    status: 'available',
    serverName: 'Mateo Solís',
    guestsCount: 0,
    totalAmountMxn: 0,
    section: 'Pergola Garden'
  },
  {
    id: 'tbl_07',
    number: 'Table 07',
    capacity: 2,
    status: 'available',
    serverName: 'Lucía Ortega',
    guestsCount: 0,
    totalAmountMxn: 0,
    section: 'Bar Lounge'
  },
  {
    id: 'tbl_08',
    number: 'Table 08',
    capacity: 4,
    status: 'seated',
    serverName: 'Sofia Navarro',
    guestsCount: 2,
    totalAmountMxn: 1120,
    section: 'Bar Lounge'
  }
];

export const initialSpaTreatments: SpaTreatment[] = [
  {
    id: 'trt_001',
    name: 'Desert Stone Massage',
    nameEs: 'Masaje con Piedras Calientes del Desierto',
    durationMinutes: 90,
    priceMxn: 2400,
    category: 'Massage',
    description: 'Smooth volcanic river basalt heated in desert sage oils to release deep myofascial tension.',
    descriptionEs: 'Basalto volcánico de río calentado en aceites de salvia del desierto para liberar tensión profunda.',
    addOns: [
      { id: 'adn_01', name: 'Desert Botanical Aromatherapy', nameEs: 'Aromaterapia Botánica', priceMxn: 350, durationMinutes: 10 },
      { id: 'adn_02', name: 'Extended Scalp Release (15 min)', nameEs: 'Masaje Craneal Extendido', priceMxn: 450, durationMinutes: 15 },
      { id: 'adn_03', name: 'Wild Jojoba & Copal Oil Upgrade', nameEs: 'Mejora a Aceite de Copal y Jojoba', priceMxn: 280, durationMinutes: 0 }
    ]
  },
  {
    id: 'trt_002',
    name: 'Signature Relaxation',
    nameEs: 'Masaje Relajante Exclusivo Casa Marea',
    durationMinutes: 60,
    priceMxn: 1850,
    category: 'Massage',
    description: 'Harmonious long-stroke Swedish technique balancing nervous flow with calming sea salt compresses.',
    descriptionEs: 'Técnica sueca de movimientos continuos que equilibra el sistema nervioso con compresas de sal marina.',
    addOns: [
      { id: 'adn_01', name: 'Desert Botanical Aromatherapy', nameEs: 'Aromaterapia Botánica', priceMxn: 350, durationMinutes: 10 },
      { id: 'adn_04', name: 'Herbal Tea Ceremony in Suite', nameEs: 'Ceremonia de Té de Hierbas', priceMxn: 180, durationMinutes: 10 }
    ]
  },
  {
    id: 'trt_003',
    name: 'Ocean Ritual Facial',
    nameEs: 'Facial Ritual del Océano',
    durationMinutes: 75,
    priceMxn: 2100,
    category: 'Facial',
    description: 'Marine algae enzymes, lymphatic drainage massage, and cooling jade stone hydration treatment.',
    descriptionEs: 'Enzimas de algas marinas, drenaje linfático facial y terapia hidratante con cuarzo jade frío.',
    addOns: [
      { id: 'adn_02', name: 'Extended Neck & Shoulder Focus', nameEs: 'Enfoque en Cuello y Hombros', priceMxn: 450, durationMinutes: 15 }
    ]
  },
  {
    id: 'trt_004',
    name: "Couples' Escape Sanctuary",
    nameEs: "Escapada en Pareja en Suite Privada",
    durationMinutes: 90,
    priceMxn: 4200,
    category: 'Couples',
    description: 'Side-by-side bespoke restorative massages in the private Ocean View Cabin with agave champagne.',
    descriptionEs: 'Masajes personalizados en pareja en la Cabaña con vista al mar, acompañados de champaña y frutos.',
    addOns: [
      { id: 'adn_01', name: 'Desert Botanical Aromatherapy', nameEs: 'Aromaterapia Botánica', priceMxn: 350, durationMinutes: 10 },
      { id: 'adn_04', name: 'Private Plunge Pool Herbal Soak', nameEs: 'Inmersión Herbal en Tina Privada', priceMxn: 650, durationMinutes: 20 }
    ]
  },
  {
    id: 'trt_005',
    name: 'Express Recovery Massage',
    nameEs: 'Masaje de Recuperación Express',
    durationMinutes: 30,
    priceMxn: 1100,
    category: 'Recovery',
    description: 'Targeted shoulder, back, and neck therapeutic alignment designed for rapid relief.',
    descriptionEs: 'Alineación terapéutica enfocada en espalda, cuello y hombros para un alivio inmediato.',
    addOns: [
      { id: 'adn_03', name: 'Arnica Cooling Balm', nameEs: 'Bálsamo Calmante de Árnica', priceMxn: 200, durationMinutes: 0 }
    ]
  }
];

export const initialTherapists: Therapist[] = [
  {
    id: 'thp_01',
    name: 'Elena Ruiz',
    specialties: ['Deep Tissue', 'Desert Stone Massage', 'Signature Relaxation'],
    isAvailable: true,
    workingHours: { start: '09:00', end: '18:00' }
  },
  {
    id: 'thp_02',
    name: 'Mateo Solís',
    specialties: ['Sports Recovery', 'Express Recovery', 'Myofascial Alignment'],
    isAvailable: true,
    workingHours: { start: '10:00', end: '19:00' }
  },
  {
    id: 'thp_03',
    name: 'Sofia Navarro',
    specialties: ['Ocean Ritual Facial', 'Dermal Care', 'Lymphatic Drainage'],
    isAvailable: true,
    workingHours: { start: '09:00', end: '17:00' }
  },
  {
    id: 'thp_04',
    name: 'Lucía Ortega',
    specialties: ["Couples' Escape", 'Aromatherapy', 'Reflexology'],
    isAvailable: true,
    workingHours: { start: '11:00', end: '20:00' }
  }
];

export const initialTreatmentRooms: TreatmentRoom[] = [
  { id: 'rm_01', name: 'Treatment Room 01 (Travertine)', type: 'standard', isAvailable: true },
  { id: 'rm_02', name: 'Treatment Room 02 (Garden Alcove)', type: 'standard', isAvailable: true },
  { id: 'rm_03', name: "Couples' Suite (Terracotta)", type: 'couples', isAvailable: true },
  { id: 'rm_04', name: 'Ocean View Cabin (Cliffside)', type: 'ocean_cabin', isAvailable: true }
];

export const initialSpaBookings: SpaBooking[] = [
  {
    id: 'spabk_001',
    bookingRef: 'SPA-2026-1044',
    guestId: 'gst_001',
    guestName: 'Sofia Alatorre',
    guestEmail: 'sofia.alatorre@curatedtravel.com',
    guestPhone: '+52 55 4912 8840',
    treatmentId: 'trt_002',
    treatmentName: 'Signature Relaxation',
    durationMinutes: 60,
    date: '2026-10-21',
    startTime: '10:00',
    endTime: '11:00',
    therapistId: 'thp_01',
    therapistName: 'Elena Ruiz',
    roomId: 'rm_01',
    roomName: 'Treatment Room 01 (Travertine)',
    addOnIds: ['adn_01'],
    totalPriceMxn: 2200,
    depositPaidMxn: 1000,
    remainingBalanceMxn: 1200,
    status: 'checked_in', // Perfect for completing Scenario B!
    depositPaymentId: 'pay_001',
    notes: 'Guest prefers medium pressure and desert sage aromatherapy.'
  },
  {
    id: 'spabk_002',
    bookingRef: 'SPA-2026-1045',
    guestId: 'gst_002',
    guestName: 'David Miller',
    guestEmail: 'david.miller@techpartners.io',
    guestPhone: '+1 415 892 4410',
    treatmentId: 'trt_001',
    treatmentName: 'Desert Stone Massage',
    durationMinutes: 90,
    date: '2026-10-21',
    startTime: '14:00',
    endTime: '15:30',
    therapistId: 'thp_02',
    therapistName: 'Mateo Solís',
    roomId: 'rm_02',
    roomName: 'Treatment Room 02 (Garden Alcove)',
    addOnIds: [],
    totalPriceMxn: 2400,
    depositPaidMxn: 1200,
    remainingBalanceMxn: 1200,
    status: 'confirmed',
    depositPaymentId: 'pay_002'
  },
  {
    id: 'spabk_003',
    bookingRef: 'SPA-2026-1046',
    guestId: 'gst_003',
    guestName: 'Camila & Mateo Wright',
    guestEmail: 'c.wright@wrightarch.design',
    guestPhone: '+1 310 740 9923',
    treatmentId: 'trt_004',
    treatmentName: "Couples' Escape Sanctuary",
    durationMinutes: 90,
    date: '2026-10-21',
    startTime: '16:00',
    endTime: '17:30',
    therapistId: 'thp_04',
    therapistName: 'Lucía Ortega',
    roomId: 'rm_04',
    roomName: 'Ocean View Cabin (Cliffside)',
    addOnIds: ['adn_04'],
    totalPriceMxn: 4850,
    depositPaidMxn: 2000,
    remainingBalanceMxn: 2850,
    status: 'pending_deposit'
  }
];

export const initialFolioPostings: FolioPosting[] = [
  {
    id: 'fol_001',
    postingRef: 'FOL-2026-0891',
    guestId: 'gst_001',
    guestName: 'Sofia Alatorre',
    roomNumber: '214',
    sourceOutlet: 'Marea Terraza Restaurant',
    transactionRef: 'ORD-2026-4412',
    amountMxn: 1850,
    currency: 'MXN',
    status: 'posted',
    lastAttempt: '2026-10-21 13:42:10',
    retryCount: 0,
    idempotencyKey: 'idem_fol_001_8921',
    simulatedPmsAmountMxn: 1850
  },
  {
    id: 'fol_002',
    postingRef: 'FOL-2026-0892',
    guestId: 'gst_002',
    guestName: 'David Miller',
    roomNumber: '108',
    sourceOutlet: 'Las Rocas Beach Club',
    transactionRef: 'ORD-2026-4415',
    amountMxn: 890,
    currency: 'MXN',
    status: 'posted',
    lastAttempt: '2026-10-21 14:15:30',
    retryCount: 0,
    idempotencyKey: 'idem_fol_002_4415',
    simulatedPmsAmountMxn: 890
  },
  {
    id: 'fol_003',
    postingRef: 'FOL-2026-0893',
    guestId: 'gst_004',
    guestName: 'Elena Rostova',
    roomNumber: '406',
    sourceOutlet: 'La Colección Boutique',
    transactionRef: 'ORD-2026-4419',
    amountMxn: 1750,
    currency: 'MXN',
    status: 'failed', // Ready for Scenario C: PMS failure inspection and retry!
    lastAttempt: '2026-10-21 15:10:04',
    simulatedFailureReason: 'PMS Gateway Timeout: Opera Cloud PMS listener socket unresponsive (EAI_AGAIN 504)',
    retryCount: 1,
    idempotencyKey: 'idem_fol_003_4419',
    simulatedPmsAmountMxn: 0
  },
  {
    id: 'fol_004',
    postingRef: 'FOL-2026-0894',
    guestId: 'gst_003',
    guestName: 'Camila & Mateo Wright',
    roomNumber: '321',
    sourceOutlet: 'El Mirador Agave Bar',
    transactionRef: 'ORD-2026-4422',
    amountMxn: 2420,
    currency: 'MXN',
    status: 'queued',
    lastAttempt: '2026-10-21 16:02:18',
    retryCount: 0,
    idempotencyKey: 'idem_fol_004_4422'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'pay_001',
    paymentRef: 'PAY-2026-5510',
    guestId: 'gst_001',
    guestName: 'Sofia Alatorre',
    source: 'public_spa_booking',
    amountMxn: 1000,
    currency: 'MXN',
    paymentMethod: 'card',
    status: 'succeeded',
    providerRef: 'pi_3Nx809CasaMarea01',
    createdAt: '2026-10-20 18:30:12',
    bookingId: 'spabk_001',
    reconciliationStatus: 'matched'
  },
  {
    id: 'pay_002',
    paymentRef: 'PAY-2026-5511',
    guestId: 'gst_002',
    guestName: 'David Miller',
    source: 'spa_deposit',
    amountMxn: 1200,
    currency: 'MXN',
    paymentMethod: 'apple_pay',
    status: 'succeeded',
    providerRef: 'pi_3Nx810CasaMarea02',
    createdAt: '2026-10-21 09:15:40',
    bookingId: 'spabk_002',
    reconciliationStatus: 'matched'
  },
  {
    id: 'pay_003',
    paymentRef: 'PAY-2026-5512',
    guestId: 'gst_004',
    guestName: 'Elena Rostova',
    source: 'payment_link',
    amountMxn: 3200,
    currency: 'MXN',
    paymentMethod: 'card',
    status: 'succeeded',
    providerRef: 'pi_3Nx815CasaMarea03',
    createdAt: '2026-10-21 11:42:00',
    reconciliationStatus: 'mismatch', // Ready for Scenario D!
    mismatchReason: 'Provider settled MXN 3,180 (bank fee withholding discrepancy of MXN 20)'
  },
  {
    id: 'pay_004',
    paymentRef: 'PAY-2026-5513',
    guestId: 'gst_003',
    guestName: 'Camila & Mateo Wright',
    source: 'pos_digital',
    amountMxn: 1650,
    currency: 'MXN',
    paymentMethod: 'card',
    status: 'pending',
    providerRef: 'pi_3Nx820CasaMarea04',
    createdAt: '2026-10-21 15:50:22',
    reconciliationStatus: 'pending'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'FAC-CM-2026-0041',
    sourceRef: 'ORD-2026-4412',
    guestName: 'Sofia Alatorre',
    rfc: 'ALAS880415HR4',
    legalName: 'SOFIA ALATORRE SERVICIOS CORPORATIVOS SA DE CV',
    postalCode: '23405',
    taxRegime: '601 - General de Ley Personas Morales',
    cfdiUse: 'G03 - Gastos en general',
    paymentMethod: 'PUE',
    paymentForm: '04', // Tarjeta de crédito
    subtotalMxn: 1594.83,
    ivaMxn: 255.17,
    totalMxn: 1850.00,
    currency: 'MXN',
    status: 'issued',
    createdAt: '2026-10-21 14:05:00',
    simulatedUuid: 'DEMO-7A8B9C0D-1E2F-4A3B-8C9D-0E1F2A3B4C5D'
  },
  {
    id: 'inv_002',
    invoiceNumber: 'FAC-CM-2026-0042',
    sourceRef: 'ORD-2026-4415',
    guestName: 'David Miller',
    rfc: 'XAXX010101000',
    legalName: 'PUBLICO EN GENERAL',
    postalCode: '23400',
    taxRegime: '616 - Sin obligaciones fiscales',
    cfdiUse: 'S01 - Sin efectos fiscales',
    paymentMethod: 'PUE',
    paymentForm: '04',
    subtotalMxn: 767.24,
    ivaMxn: 122.76,
    totalMxn: 890.00,
    currency: 'MXN',
    status: 'awaiting_validation',
    createdAt: '2026-10-21 15:00:00'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord_demo_01',
    orderNumber: 'ORD-2026-4412',
    outletId: 'out_restaurant',
    outletName: 'Marea Terraza Restaurant',
    tableNumber: 'Table 01',
    serverName: 'Elena Ruiz',
    lines: [
      {
        id: 'ln_01',
        productId: 'prd_001',
        productName: 'Baja Fish Tacos',
        quantity: 2,
        unitPriceMxn: 285,
        selectedModifiers: [],
        subtotalMxn: 570
      },
      {
        id: 'ln_02',
        productId: 'prd_005',
        productName: 'Mezcal Marea Margarita',
        quantity: 2,
        unitPriceMxn: 240,
        selectedModifiers: [],
        subtotalMxn: 480
      },
      {
        id: 'ln_03',
        productId: 'prd_002',
        productName: 'Grilled Pacific Octopus',
        quantity: 1,
        unitPriceMxn: 420,
        selectedModifiers: [],
        subtotalMxn: 420
      }
    ],
    subtotalMxn: 1470,
    taxMxn: 235.20,
    serviceChargeMxn: 147,
    tipMxn: 220,
    totalMxn: 1850,
    status: 'paid',
    paymentMethod: 'room_charge',
    guestId: 'gst_001',
    guestName: 'Sofia Alatorre',
    roomNumber: '214',
    createdAt: '2026-10-21 13:20:00'
  },
  {
    id: 'ord_kitchen_01',
    orderNumber: 'ORD-2026-4428',
    outletId: 'out_restaurant',
    outletName: 'Marea Terraza Restaurant',
    tableNumber: 'Table 05',
    serverName: 'Elena Ruiz',
    lines: [
      {
        id: 'ln_k1',
        productId: 'prd_004',
        productName: 'Sonoran Wood-Fired Ribeye',
        quantity: 2,
        unitPriceMxn: 680,
        selectedModifiers: [],
        notes: 'Cook medium-rare, extra charred asparagus.',
        subtotalMxn: 1360
      },
      {
        id: 'ln_k2',
        productId: 'prd_003',
        productName: 'Coastal Sea Scallop Ceviche',
        quantity: 1,
        unitPriceMxn: 310,
        selectedModifiers: [],
        notes: 'Gluten allergy, separate prep surface.',
        subtotalMxn: 310
      }
    ],
    subtotalMxn: 1670,
    taxMxn: 267.20,
    serviceChargeMxn: 167,
    tipMxn: 0,
    totalMxn: 2104.20,
    status: 'in_preparation',
    createdAt: '2026-10-21 16:15:00',
    elapsedMinutes: 14,
    kitchenNotes: 'Table 5 requesting main courses together with wine pairings.'
  },
  {
    id: 'ord_bar_01',
    orderNumber: 'ORD-2026-4429',
    outletId: 'out_bar',
    outletName: 'El Mirador Agave Bar',
    tableNumber: 'Table 08',
    serverName: 'Lucía Ortega',
    lines: [
      {
        id: 'ln_b1',
        productId: 'prd_006',
        productName: 'Damiana Citrus Paloma',
        quantity: 2,
        unitPriceMxn: 230,
        selectedModifiers: [],
        subtotalMxn: 460
      },
      {
        id: 'ln_b2',
        productId: 'prd_005',
        productName: 'Mezcal Marea Margarita',
        quantity: 2,
        unitPriceMxn: 240,
        selectedModifiers: [],
        subtotalMxn: 480
      }
    ],
    subtotalMxn: 940,
    taxMxn: 150.40,
    serviceChargeMxn: 94,
    tipMxn: 0,
    totalMxn: 1184.40,
    status: 'new',
    createdAt: '2026-10-21 16:24:00',
    elapsedMinutes: 3,
    kitchenNotes: 'Bar station ticket: Serve with fresh dehydrated grapefruit wheels.'
  }
];

export const initialActivityFeed: ActivityFeedItem[] = [
  {
    id: 'act_001',
    timestamp: '16:24',
    type: 'pos',
    title: 'New Drink Order Queued',
    titleEs: 'Nueva Orden de Bar en Cola',
    description: 'El Mirador Bar #ORD-2026-4429 sent 4 drinks to the service station.',
    descriptionEs: 'Bar El Mirador #ORD-2026-4429 envió 4 cocteles a la barra.',
    linkRoute: '/app/pos'
  },
  {
    id: 'act_002',
    timestamp: '16:02',
    type: 'folio',
    title: 'Room Charge Queued',
    titleEs: 'Cargo a Habitación en Cola',
    description: 'Room 321 (Camila & Mateo Wright) pending PMS sync for MXN 2,420.',
    descriptionEs: 'Habitación 321 pendiente de sincronización PMS por MXN 2,420.',
    linkRoute: '/app/folios'
  },
  {
    id: 'act_003',
    timestamp: '15:10',
    type: 'folio',
    title: 'PMS Posting Timeout Warning',
    titleEs: 'Alerta de Tiempo de Espera en PMS',
    description: 'Folio FOL-2026-0893 for Room 406 failed gateway handshake. Manual retry ready.',
    descriptionEs: 'Folio FOL-2026-0893 para Habitación 406 requiere reintento seguro.',
    status: 'failed',
    linkRoute: '/app/folios'
  },
  {
    id: 'act_004',
    timestamp: '14:05',
    type: 'invoice',
    title: 'CFDI 4.0 Invoice Issued',
    titleEs: 'Factura CFDI 4.0 Emitida',
    description: 'FAC-CM-2026-0041 validated for Sofia Alatorre (RFC: ALAS880415HR4).',
    descriptionEs: 'FAC-CM-2026-0041 validada para Sofia Alatorre (RFC: ALAS880415HR4).',
    linkRoute: '/app/invoicing'
  },
  {
    id: 'act_005',
    timestamp: '10:00',
    type: 'spa',
    title: 'Spa Guest Checked In',
    titleEs: 'Huésped de Spa Registrado',
    description: 'Sofia Alatorre checked in for Signature Relaxation with therapist Elena Ruiz.',
    descriptionEs: 'Sofia Alatorre inició servicio de Masaje Relajante con Elena Ruiz.',
    linkRoute: '/app/spa'
  }
];

export const initialSettings: DemoSettings = {
  exchangeRateUsdMxn: 18.50,
  defaultCurrency: 'MXN',
  serviceChargePercent: 10,
  taxRatePercent: 16,
  spaCleanupBufferMinutes: 15,
  language: 'en',
  businessDate: '2026-10-21'
};
