import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
  Booking,
  BrowserWorker,
  DashboardMetrics,
  TaskItem,
  Workflow,
  ActivityEvent,
  AppNotification,
  SimulationScenarioId,
  BookingStatus,
} from '../types';
import {
  INITIAL_BOOKINGS,
  INITIAL_METRICS,
  INITIAL_TASKS,
  INITIAL_WORKFLOWS,
  INITIAL_WORKERS,
  INITIAL_ACTIVITY,
} from '../constants/seedData';
import { SIMULATION_SCENARIOS } from '../constants/scenarios';

// Storage Key
const LOCAL_STORAGE_KEY = 'reserva_flow_state_v2.4';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface SimulationRunState {
  activeScenarioId: SimulationScenarioId | null;
  currentStepIndex: number;
  isRunning: boolean;
  isPaused: boolean;
  speedMultiplier: number;
  logs: string[];
  completedCount: number;
}

export interface AppState {
  currentRoute: string;
  metrics: DashboardMetrics;
  bookings: Booking[];
  workflows: Workflow[];
  workers: BrowserWorker[];
  tasks: TaskItem[];
  activity: ActivityEvent[];
  notifications: AppNotification[];
  toasts: ToastItem[];
  simulationState: SimulationRunState;
  selectedBookingId: string | null;
  selectedWorkflowId: string | null;
  globalSearchQuery: string;
  isSidebarOpen: boolean;
  hasSeenLoadingScreen: boolean;
}

type Action =
  | { type: 'NAVIGATE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_SIDEBAR'; payload?: boolean }
  | { type: 'DISMISS_LOADING_SCREEN' }
  | { type: 'ADD_TOAST'; payload: Omit<ToastItem, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'> }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'ADD_TASK'; payload: Omit<TaskItem, 'id'> }
  | { type: 'UPDATE_BOOKING_STATUS'; payload: { id: string; status: BookingStatus; label?: string } }
  | { type: 'ADD_BOOKING'; payload: Omit<Booking, 'id' | 'bookingNumber'> }
  | { type: 'DELETE_BOOKING'; payload: string }
  | { type: 'SELECT_BOOKING'; payload: string | null }
  | { type: 'SELECT_WORKFLOW'; payload: string | null }
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'TOGGLE_WORKFLOW_ACTIVE'; payload: string }
  | { type: 'UPDATE_WORKER_STATUS'; payload: { id: string; status: BrowserWorker['status'] } }
  | { type: 'ADD_ACTIVITY_EVENT'; payload: Omit<ActivityEvent, 'id' | 'timestamp'> }
  | { type: 'START_SIMULATION'; payload: { scenarioId: SimulationScenarioId } }
  | { type: 'ADVANCE_SIMULATION_STEP'; payload: { stepIndex: number; logMessage: string } }
  | { type: 'PAUSE_RESUME_SIMULATION' }
  | { type: 'SET_SIMULATION_SPEED'; payload: number }
  | { type: 'COMPLETE_SIMULATION'; payload: { scenarioId: SimulationScenarioId } }
  | { type: 'RESET_SIMULATION' }
  | { type: 'RESET_ENTIRE_STATE' }
  | { type: 'LOAD_STORED_STATE'; payload: Partial<AppState> };

const initialSimulationState: SimulationRunState = {
  activeScenarioId: null,
  currentStepIndex: 0,
  isRunning: false,
  isPaused: false,
  speedMultiplier: 1,
  logs: ['[System] Engine initialized. Select any of the 4 scenarios to begin deterministic execution.'],
  completedCount: 0,
};

const getInitialState = (): AppState => {
  return {
    currentRoute: '/',
    metrics: INITIAL_METRICS,
    bookings: INITIAL_BOOKINGS,
    workflows: INITIAL_WORKFLOWS,
    workers: INITIAL_WORKERS,
    tasks: INITIAL_TASKS,
    activity: INITIAL_ACTIVITY,
    notifications: [
      {
        id: 'notif-1',
        title: 'Anti-Bot Sentinel Active',
        message: '6 residential workers online. Captcha bypass rate at 99.4%.',
        timestamp: '10 mins ago',
        type: 'success',
        isRead: false,
      },
      {
        id: 'notif-2',
        title: 'New High-Yield Booking Direct',
        message: 'Baroness Vivienne DuPont confirmed €11,400 stay via Direct engine.',
        timestamp: '35 mins ago',
        type: 'info',
        isRead: false,
      },
    ],
    toasts: [],
    simulationState: initialSimulationState,
    selectedBookingId: null,
    selectedWorkflowId: null,
    globalSearchQuery: '',
    isSidebarOpen: true,
    hasSeenLoadingScreen: false,
  };
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentRoute: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, globalSearchQuery: action.payload };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isSidebarOpen: action.payload !== undefined ? action.payload : !state.isSidebarOpen,
      };

    case 'DISMISS_LOADING_SCREEN':
      return { ...state, hasSeenLoadingScreen: true };

    case 'ADD_TOAST': {
      const newToast: ToastItem = {
        ...action.payload,
        id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      };
      return { ...state, toasts: [...state.toasts, newToast] };
    }

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    case 'ADD_NOTIFICATION': {
      const newNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        timestamp: 'Just now',
        isRead: false,
        ...action.payload,
      };
      return { ...state, notifications: [newNotif, ...state.notifications] };
    }

    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };

    case 'TOGGLE_TASK': {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      return {
        ...state,
        tasks: updatedTasks,
        metrics: {
          ...state.metrics,
          tasksCompleted: completedCount,
          activeTasks: updatedTasks.length,
        },
      };
    }

    case 'ADD_TASK': {
      const newTask: TaskItem = {
        ...action.payload,
        id: 'task-' + Date.now(),
      };
      const updated = [newTask, ...state.tasks];
      return {
        ...state,
        tasks: updated,
        metrics: {
          ...state.metrics,
          activeTasks: updated.length,
        },
      };
    }

    case 'UPDATE_BOOKING_STATUS': {
      const { id, status, label } = action.payload;
      const updated = state.bookings.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status,
            statusLabel: label || (status === 'confirmed' ? 'Bestätigt' : status === 'cancelled' ? 'Storniert' : 'In Progress'),
          };
        }
        return b;
      });
      return { ...state, bookings: updated };
    }

    case 'ADD_BOOKING': {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const newBooking: Booking = {
        ...action.payload,
        id: 'book-' + Date.now(),
        bookingNumber: `RES-${randNum}`,
      };
      const updatedBookings = [newBooking, ...state.bookings];
      return {
        ...state,
        bookings: updatedBookings,
        metrics: {
          ...state.metrics,
          totalBookingsCount: state.metrics.totalBookingsCount + 1,
          totalYearRevenue: state.metrics.totalYearRevenue + newBooking.totalAmount,
          revenueToday: state.metrics.revenueToday + newBooking.totalAmount,
        },
      };
    }

    case 'DELETE_BOOKING': {
      const filtered = state.bookings.filter((b) => b.id !== action.payload);
      return {
        ...state,
        bookings: filtered,
        metrics: {
          ...state.metrics,
          totalBookingsCount: Math.max(0, state.metrics.totalBookingsCount - 1),
        },
      };
    }

    case 'SELECT_BOOKING':
      return { ...state, selectedBookingId: action.payload };

    case 'SELECT_WORKFLOW':
      return { ...state, selectedWorkflowId: action.payload };

    case 'ADD_WORKFLOW':
      return { ...state, workflows: [action.payload, ...state.workflows] };

    case 'TOGGLE_WORKFLOW_ACTIVE':
      return {
        ...state,
        workflows: state.workflows.map((wf) =>
          wf.id === action.payload ? { ...wf, isActive: !wf.isActive } : wf
        ),
      };

    case 'UPDATE_WORKER_STATUS':
      return {
        ...state,
        workers: state.workers.map((w) =>
          w.id === action.payload.id ? { ...w, status: action.payload.status } : w
        ),
      };

    case 'ADD_ACTIVITY_EVENT': {
      const newEvent: ActivityEvent = {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        ...action.payload,
      };
      return { ...state, activity: [newEvent, ...state.activity.slice(0, 40)] };
    }

    case 'START_SIMULATION':
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          activeScenarioId: action.payload.scenarioId,
          currentStepIndex: 0,
          isRunning: true,
          isPaused: false,
          logs: [
            `[Engine] Initiating simulation scenario: ${action.payload.scenarioId.toUpperCase()}`,
            `[Cluster] Dispatching agents and binding to local sandbox bus...`,
          ],
        },
      };

    case 'ADVANCE_SIMULATION_STEP':
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          currentStepIndex: action.payload.stepIndex,
          logs: [...state.simulationState.logs, action.payload.logMessage],
        },
      };

    case 'PAUSE_RESUME_SIMULATION':
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          isPaused: !state.simulationState.isPaused,
        },
      };

    case 'SET_SIMULATION_SPEED':
      return {
        ...state,
        simulationState: {
          ...state.simulationState,
          speedMultiplier: action.payload,
        },
      };

    case 'COMPLETE_SIMULATION': {
      const scenario = SIMULATION_SCENARIOS.find((s) => s.id === action.payload.scenarioId);
      let updatedBookings = [...state.bookings];
      let updatedMetrics = { ...state.metrics };

      if (scenario) {
        if (scenario.expectedOutcome.newBookingCreated) {
          const rand = Math.floor(10000 + Math.random() * 90000);
          const fullBooking: Booking = {
            id: 'book-sim-' + Date.now(),
            bookingNumber: `RES-${rand}`,
            guestName: scenario.expectedOutcome.newBookingCreated.guestName || 'VIP Guest',
            guestEmail: scenario.expectedOutcome.newBookingCreated.guestEmail || 'vip@reservaflow.io',
            guestPhone: scenario.expectedOutcome.newBookingCreated.guestPhone || '+1 555 902 1100',
            unit: scenario.expectedOutcome.newBookingCreated.unit || 'Son Felipe · Penthouse',
            platform: scenario.expectedOutcome.newBookingCreated.platform || 'Direct',
            status: scenario.expectedOutcome.newBookingCreated.status || 'confirmed',
            statusLabel: scenario.expectedOutcome.newBookingCreated.statusLabel || 'Bestätigt',
            bookedDate: scenario.expectedOutcome.newBookingCreated.bookedDate || '2026-10-21',
            checkInDate: scenario.expectedOutcome.newBookingCreated.checkInDate || '2026-12-23',
            checkOutDate: scenario.expectedOutcome.newBookingCreated.checkOutDate || '2027-01-02',
            nights: scenario.expectedOutcome.newBookingCreated.nights || 7,
            guestsCount: scenario.expectedOutcome.newBookingCreated.guestsCount || 2,
            totalAmount: scenario.expectedOutcome.newBookingCreated.totalAmount || 5200,
            commissionAmount: scenario.expectedOutcome.newBookingCreated.commissionAmount || 0,
            cleaningFee: scenario.expectedOutcome.newBookingCreated.cleaningFee || 180,
            notes: scenario.expectedOutcome.newBookingCreated.notes,
          };
          updatedBookings = [fullBooking, ...updatedBookings];
        }

        if (scenario.expectedOutcome.bookingStatusChange) {
          const { bookingId, newStatus } = scenario.expectedOutcome.bookingStatusChange;
          updatedBookings = updatedBookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  status: newStatus,
                  statusLabel: newStatus === 'confirmed' ? 'Bestätigt' : 'Storniert',
                }
              : b
          );
        }

        const delta = scenario.expectedOutcome.metricChanges;
        if (delta.revenueDelta) {
          updatedMetrics.totalYearRevenue += delta.revenueDelta;
          updatedMetrics.revenueToday += delta.revenueDelta;
        }
        if (delta.occupancyDelta) {
          updatedMetrics.occupancyRate = Math.min(100, updatedMetrics.occupancyRate + delta.occupancyDelta);
        }
      }

      return {
        ...state,
        bookings: updatedBookings,
        metrics: updatedMetrics,
        simulationState: {
          ...state.simulationState,
          isRunning: false,
          isPaused: false,
          currentStepIndex: scenario ? scenario.steps.length : 4,
          completedCount: state.simulationState.completedCount + 1,
          logs: [
            ...state.simulationState.logs,
            `[Done] Execution completed successfully. Synchronized changes across Bookings, Metrics, and Activity.`,
          ],
        },
      };
    }

    case 'RESET_SIMULATION':
      return {
        ...state,
        simulationState: {
          ...initialSimulationState,
          completedCount: state.simulationState.completedCount,
        },
      };

    case 'RESET_ENTIRE_STATE':
      return getInitialState();

    case 'LOAD_STORED_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

interface DemoContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  navigate: (route: string) => void;
  addToast: (title: string, message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  runScenario: (scenarioId: SimulationScenarioId) => void;
  resetAllData: () => void;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.bookings) && parsed.metrics) {
          return {
            ...getInitialState(),
            ...parsed,
            toasts: [],
            simulationState: initialSimulationState,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored Reserva Flow demo state, falling back to seed.', e);
    }
    return getInitialState();
  });

  // Save to LocalStorage on meaningful state changes
  useEffect(() => {
    try {
      const stateToPersist = {
        metrics: state.metrics,
        bookings: state.bookings,
        workflows: state.workflows,
        workers: state.workers,
        tasks: state.tasks,
        activity: state.activity,
        hasSeenLoadingScreen: state.hasSeenLoadingScreen,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.error('Failed to save Reserva Flow state to localStorage:', e);
    }
  }, [
    state.metrics,
    state.bookings,
    state.workflows,
    state.workers,
    state.tasks,
    state.activity,
    state.hasSeenLoadingScreen,
  ]);

  const navigate = useCallback((route: string) => {
    dispatch({ type: 'NAVIGATE', payload: route });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const addToast = useCallback((title: string, message: string, type: ToastItem['type'] = 'info') => {
    dispatch({ type: 'ADD_TOAST', payload: { title, message, type } });
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    dispatch({ type: 'RESET_ENTIRE_STATE' });
    addToast('Demo State Reset', 'Restored pristine seed data, workflows, and metrics.', 'success');
  }, [addToast]);

  // Central Deterministic Scenario Runner with step timers
  const runScenario = useCallback(
    (scenarioId: SimulationScenarioId) => {
      const scenario = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) return;

      dispatch({ type: 'START_SIMULATION', payload: { scenarioId } });
      addToast('Scenario Launched', `Running: ${scenario.title}`, 'info');

      // Add to activity
      dispatch({
        type: 'ADD_ACTIVITY_EVENT',
        payload: {
          title: `Simulation Started: ${scenario.title}`,
          category: 'workflow',
          actor: 'Simulation Sandbox Engine',
          actorType: 'bot',
          status: 'info',
          details: scenario.shortDescription,
        },
      });

      let cumulativeDelay = 0;
      scenario.steps.forEach((step, index) => {
        cumulativeDelay += step.delayMs / (state.simulationState.speedMultiplier || 1);
        setTimeout(() => {
          dispatch({
            type: 'ADVANCE_SIMULATION_STEP',
            payload: {
              stepIndex: index + 1,
              logMessage: `[Step ${index + 1}/${scenario.steps.length}] ${step.title}: ${step.logMessage}`,
            },
          });
        }, cumulativeDelay);
      });

      // Complete simulation and apply state transformations
      setTimeout(() => {
        dispatch({ type: 'COMPLETE_SIMULATION', payload: { scenarioId } });
        addToast(
          'Simulation Finished',
          scenario.expectedOutcome.alertGenerated || 'Execution completed with 100% success.',
          'success'
        );
        dispatch({
          type: 'ADD_ACTIVITY_EVENT',
          payload: {
            title: `Simulation Completed: ${scenario.title}`,
            category: 'workflow',
            actor: 'Simulation Engine',
            actorType: 'bot',
            status: 'success',
            details: scenario.expectedOutcome.alertGenerated || 'All steps executed successfully.',
          },
        });
      }, cumulativeDelay + 400);
    },
    [addToast, state.simulationState.speedMultiplier]
  );

  return (
    <DemoContext.Provider
      value={{
        state,
        dispatch,
        navigate,
        addToast,
        removeToast,
        runScenario,
        resetAllData,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextValue => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
