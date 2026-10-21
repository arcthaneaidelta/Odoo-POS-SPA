// ============================================================================
// RESERVA FLOW — Complete TypeScript Domain Types
// ============================================================================

export type BookingStatus = 'confirmed' | 'cancelled' | 'in_progress' | 'awaiting_review' | 'blocked';
export type PlatformChannel = 'Direct' | 'Booking.com' | 'Airbnb' | 'OpenTable' | 'Resy' | 'Agoda' | 'Traveloka';

export interface Booking {
  id: string;
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  unit: string;
  platform: PlatformChannel;
  status: BookingStatus;
  statusLabel: string; // e.g. "Bestätigt", "Storniert", "Booked"
  bookedDate: string; // YYYY-MM-DD
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  guestsCount: number;
  totalAmount: number; // in EUR/USD
  commissionAmount: number;
  cleaningFee: number;
  notes?: string;
  automatedWorkflowId?: string;
  sourceSessionId?: string;
}

export type StepStatus = 'completed' | 'in_progress' | 'awaiting_review' | 'blocked' | 'pending';

export interface WorkflowStep {
  id: string;
  title: string;
  agentName: string;
  agentRole?: string;
  timestamp?: string;
  status: StepStatus;
  statusLabel: string;
  detail?: string;
  durationMs?: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  channel: PlatformChannel;
  triggerType: 'webhook' | 'schedule' | 'overbooking_alert' | 'waitlist_event' | 'manual';
  executionStrategy: 'headless_browser' | 'direct_api' | 'hybrid';
  isActive: boolean;
  priority: 'critical' | 'high' | 'normal';
  successRate: number; // e.g. 99.4
  totalExecutions: number;
  avgDurationSec: number;
  createdAt: string;
  steps: WorkflowStep[];
}

export interface BrowserWorker {
  id: string;
  workerName: string;
  status: 'idle' | 'booking' | 'solving_captcha' | 'reconnecting' | 'error';
  ipAddress: string;
  proxyLocation: string;
  proxyType: 'Residential ISP' | 'Datacenter' | 'Mobile 5G';
  latencyMs: number;
  targetPlatform: PlatformChannel;
  activeTaskId?: string;
  captchaBypassedToday: number;
  cpuUsage: number;
  memoryUsage: number;
}

export type SimulationScenarioId = 'flash_booking' | 'channel_conflict' | 'antibot_challenge' | 'cancellation_recovery';

export interface SimulationScenario {
  id: SimulationScenarioId;
  title: string;
  shortDescription: string;
  category: 'Speed & Yield' | 'Conflict Resolution' | 'Security & Anti-Bot' | 'Occupancy Recovery';
  estimatedDurationMs: number;
  steps: {
    stepIndex: number;
    title: string;
    agentName: string;
    status: StepStatus;
    statusLabel: string;
    logMessage: string;
    delayMs: number;
    impactSummary: string;
  }[];
  expectedOutcome: {
    bookingStatusChange?: { bookingId: string; newStatus: BookingStatus };
    newBookingCreated?: Partial<Booking>;
    metricChanges: {
      revenueDelta?: number;
      occupancyDelta?: number;
      tasksDelta?: number;
    };
    alertGenerated?: string;
  };
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  category: 'workflow' | 'booking' | 'security' | 'conflict' | 'system';
  actor: string;
  actorType: 'bot' | 'human' | 'channel_manager' | 'security_guard';
  status: 'success' | 'warning' | 'error' | 'info';
  details: string;
  meta?: Record<string, any>;
}

export interface DashboardMetrics {
  occupancyRate: number; // e.g. 87
  occupancyRateDelta: string; // "+5 vs last week"
  checkInsToday: number; // e.g. 24
  checkInsProcessed: number; // 12
  checkInsPending: number; // 12
  revenueToday: number; // e.g. 5820
  revenueTodayDelta: string; // "+12% vs yesterday"
  activeTasks: number; // 7
  tasksOverdue: number; // 3
  tasksCompleted: number; // 4
  totalYearRevenue: number; // 145450
  totalBookingsCount: number; // 574
  cancelledCount: number; // 117
  totalNights: number; // 1735
  totalCommissionsSaved: number; // 68201.76
  totalCleaningFees: number; // 24533.00
  platformDistribution: {
    direct: number;
    bookingCom: number;
    agoda: number;
    traveloka: number;
    airbnb: number;
  };
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  roomUnit: string;
  assignee: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
}
