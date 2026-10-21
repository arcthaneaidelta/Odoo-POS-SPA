import { formDef } from '../content/forms';
import { formatLongDate, formatTime } from '../lib/dates';
import { createSeed } from './seed';
import type {
  Activity,
  ActivityKind,
  Appointment,
  DemoState,
  FormId,
  FormValues,
  Message,
  OnboardingState,
  Session,
  Task,
  TaskStatus,
} from './types';

export type Action =
  | { type: 'LOGIN'; role: Session['role'] }
  | { type: 'LOGOUT' }
  | { type: 'RESET' }
  | { type: 'TASK_SET'; id: string; status: TaskStatus }
  | { type: 'FORM_SAVE'; id: FormId; values: FormValues; submit: boolean }
  | { type: 'ONBOARDING_PATCH'; patch: Partial<OnboardingState> }
  | { type: 'ONBOARDING_COMPLETE' }
  | { type: 'AGREEMENT_REVIEW'; id: string }
  | { type: 'AGREEMENT_ACK'; id: string; name: string }
  | { type: 'PAY'; id: string; method: string }
  | { type: 'PAY_DECLINED'; id: string; method: string }
  | { type: 'APPT_BOOK'; appt: Omit<Appointment, 'id' | 'status'> }
  | { type: 'APPT_RESCHEDULE'; id: string; date: string; start: string; end: string }
  | { type: 'APPT_CANCEL'; id: string }
  | { type: 'MSG_SEND'; convId: string; text: string; attachment?: Message['attachment'] }
  | { type: 'MSG_RECEIVE'; convId: string; text: string; read: boolean }
  | { type: 'MSG_READ'; convId: string }
  | { type: 'OPS_TOGGLE'; id: string }
  | { type: 'ADMIN_ADD_TASK'; clientId: string; title: string; due: string }
  | { type: 'ADMIN_TOGGLE_TASK'; clientId: string; taskId: string }
  | { type: 'ADMIN_SCHEDULE'; clientId: string; title: string; date: string; start: string };

let counter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}${(counter++).toString(36)}`;

function push(state: DemoState, kind: ActivityKind, text: string, link: string): DemoState {
  const entry: Activity = { id: uid('act'), kind, text, link, ts: new Date().toISOString() };
  return { ...state, activity: [entry, ...state.activity].slice(0, 30) };
}

function markDone(tasks: Task[], ids: string[]): Task[] {
  return tasks.map((t) => (ids.includes(t.id) && t.status !== 'done' ? { ...t, status: 'done' } : t));
}

function completeForm(state: DemoState, id: FormId, values: FormValues): DemoState {
  const forms = {
    ...state.forms,
    [id]: { id, status: 'completed' as const, values, updatedAt: new Date().toISOString() },
  };
  let tasks = state.tasks;
  if (id === 'comm-prefs') tasks = markDone(tasks, ['task-comm']);
  if (Object.values(forms).every((f) => f.status === 'completed')) tasks = markDone(tasks, ['task-forms']);
  return push({ ...state, forms, tasks }, 'form', `An intake form was completed: ${formDef(id).title}`, '/portal/forms');
}

function ackAgreement(state: DemoState, id: string, name: string): DemoState {
  const agreements = state.agreements.map((a) =>
    a.id === id ? { ...a, status: 'completed' as const, acknowledgedBy: name, acknowledgedAt: new Date().toISOString() } : a,
  );
  const target = state.agreements.find((a) => a.id === id);
  const tasks = id === 'ag-services' ? markDone(state.tasks, ['task-agreement']) : state.tasks;
  return push({ ...state, agreements, tasks }, 'agreement', `Demo agreement acknowledged: ${target?.title ?? 'Agreement'}`, '/portal/agreements');
}

export function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, session: { role: action.role, startedAt: new Date().toISOString() } };
    case 'LOGOUT':
      return { ...state, session: null };
    case 'RESET':
      return { ...createSeed(), session: state.session };

    case 'TASK_SET': {
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task) return state;
      const next = { ...state, tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, status: action.status } : t)) };
      return action.status === 'done' && task.status !== 'done' ? push(next, 'task', `Task completed: ${task.title}`, '/portal/tasks') : next;
    }

    case 'FORM_SAVE': {
      if (action.submit) return completeForm(state, action.id, action.values);
      const forms = {
        ...state.forms,
        [action.id]: { id: action.id, status: 'draft' as const, values: action.values, updatedAt: new Date().toISOString() },
      };
      const tasks = state.tasks.map((t) => (t.id === 'task-forms' && t.status === 'todo' ? { ...t, status: 'in-progress' as const } : t));
      return { ...state, forms, tasks };
    }

    case 'ONBOARDING_PATCH':
      return { ...state, onboarding: { ...state.onboarding, ...action.patch } };

    case 'ONBOARDING_COMPLETE': {
      const { about, prefs } = state.onboarding;
      let next = completeForm(state, 'client-info', {
        preferredName: about.preferredName,
        email: about.email,
        phone: about.phone,
        timezone: about.timezone,
        notes: about.supportNotes,
      });
      next = completeForm(next, 'comm-prefs', {
        method: prefs.channel || about.method,
        time: prefs.window || about.contactTime,
        reminders: [],
        notes: prefs.notes,
      });
      const ag = next.agreements.find((a) => a.id === 'ag-services');
      if (ag && ag.status !== 'completed') next = ackAgreement(next, 'ag-services', about.preferredName || 'Demo client');
      next = { ...next, onboarding: { ...next.onboarding, step: 5, completed: true } };
      return push(next, 'task', 'Your onboarding steps were completed', '/portal/dashboard');
    }

    case 'AGREEMENT_REVIEW':
      return {
        ...state,
        agreements: state.agreements.map((a) => (a.id === action.id && a.status === 'awaiting' ? { ...a, status: 'ready' as const } : a)),
      };
    case 'AGREEMENT_ACK':
      return ackAgreement(state, action.id, action.name);

    case 'PAY': {
      const inv = state.invoices.find((i) => i.id === action.id);
      if (!inv || inv.status === 'paid') return state;
      const now = new Date().toISOString();
      const hasReceipt = state.documents.some((d) => d.id === `doc-receipt-${inv.id}`);
      const documents = hasReceipt
        ? state.documents
        : [
            {
              id: `doc-receipt-${inv.id}`,
              title: `Receipt ${inv.id}`,
              filename: `Receipt ${inv.id}.pdf`,
              category: 'Invoices' as const,
              added: now.slice(0, 10),
              size: '58 KB',
              description: `Demo receipt for ${inv.title}. No real payment was processed.`,
              sections: [
                { heading: `Receipt ${inv.id}`, body: `${inv.title}. Amount: $${inv.amount}. Method: ${action.method}. Status: Paid (simulated).` },
                { heading: 'Notice', body: 'This receipt is a fictional demo. No real payment was processed.' },
              ],
            },
            ...state.documents,
          ];
      const next: DemoState = {
        ...state,
        documents,
        invoices: state.invoices.map((i) => (i.id === inv.id ? { ...i, status: 'paid', paidAt: now, method: action.method } : i)),
        transactions: [{ id: uid('txn'), invoiceId: inv.id, amount: inv.amount, date: now, method: action.method, status: 'succeeded' }, ...state.transactions],
      };
      return push(next, 'payment', `Demo payment recorded for invoice ${inv.id}`, '/portal/payments');
    }
    case 'PAY_DECLINED': {
      const inv = state.invoices.find((i) => i.id === action.id);
      if (!inv) return state;
      const next: DemoState = {
        ...state,
        transactions: [{ id: uid('txn'), invoiceId: inv.id, amount: inv.amount, date: new Date().toISOString(), method: action.method, status: 'declined' }, ...state.transactions],
      };
      return push(next, 'payment', `A demo payment attempt for ${inv.id} was declined`, '/portal/payments');
    }

    case 'APPT_BOOK': {
      const appt: Appointment = { ...action.appt, id: uid('appt'), status: 'upcoming' };
      const tasks = appt.kind === 'checkin' ? markDone(state.tasks, ['task-followup']) : state.tasks;
      return push({ ...state, appointments: [...state.appointments, appt], tasks }, 'appointment', `Appointment booked: ${appt.title}, ${formatLongDate(appt.date)} at ${formatTime(appt.start)}`, '/portal/schedule');
    }
    case 'APPT_RESCHEDULE':
      return push(
        {
          ...state,
          appointments: state.appointments.map((a) => (a.id === action.id ? { ...a, date: action.date, start: action.start, end: action.end, status: 'upcoming' as const } : a)),
        },
        'appointment',
        'Your appointment details were updated',
        '/portal/schedule',
      );
    case 'APPT_CANCEL': {
      const a = state.appointments.find((x) => x.id === action.id);
      return push(
        { ...state, appointments: state.appointments.map((x) => (x.id === action.id ? { ...x, status: 'cancelled' as const } : x)) },
        'appointment',
        `Appointment cancelled: ${a?.title ?? 'Appointment'}`,
        '/portal/schedule',
      );
    }

    case 'MSG_SEND': {
      const msg: Message = { id: uid('msg'), from: 'client', text: action.text, ts: new Date().toISOString(), attachment: action.attachment };
      return { ...state, conversations: state.conversations.map((c) => (c.id === action.convId ? { ...c, messages: [...c.messages, msg], unread: 0 } : c)) };
    }
    case 'MSG_RECEIVE': {
      const msg: Message = { id: uid('msg'), from: 'team', text: action.text, ts: new Date().toISOString() };
      const conv = state.conversations.find((c) => c.id === action.convId);
      const next = {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.convId ? { ...c, messages: [...c.messages, msg], unread: action.read ? 0 : c.unread + 1 } : c,
        ),
      };
      return action.read ? next : push(next, 'message', `A new message is available from ${conv?.title ?? 'your team'}`, '/portal/messages');
    }
    case 'MSG_READ':
      return { ...state, conversations: state.conversations.map((c) => (c.id === action.convId ? { ...c, unread: 0 } : c)) };

    case 'OPS_TOGGLE':
      return { ...state, opsTasks: state.opsTasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)) };

    case 'ADMIN_ADD_TASK': {
      if (action.clientId === 'alex') {
        const task: Task = {
          id: uid('task'),
          title: action.title,
          description: 'Added by your concierge team (demo).',
          due: action.due,
          stageId: 'planning',
          status: 'todo',
          priority: 'medium',
          link: '/portal/tasks',
          linkLabel: 'Open tasks',
        };
        return push({ ...state, tasks: [...state.tasks, task] }, 'task', `A new task was added: ${action.title}`, '/portal/tasks');
      }
      return {
        ...state,
        adminClients: state.adminClients.map((c) =>
          c.id === action.clientId ? { ...c, tasks: [...c.tasks, { id: uid('t'), title: action.title, done: false, due: action.due }] } : c,
        ),
      };
    }
    case 'ADMIN_TOGGLE_TASK': {
      if (action.clientId === 'alex') {
        const t = state.tasks.find((x) => x.id === action.taskId);
        if (!t) return state;
        return reducer(state, { type: 'TASK_SET', id: t.id, status: t.status === 'done' ? 'todo' : 'done' });
      }
      return {
        ...state,
        adminClients: state.adminClients.map((c) =>
          c.id === action.clientId ? { ...c, tasks: c.tasks.map((t) => (t.id === action.taskId ? { ...t, done: !t.done } : t)) } : c,
        ),
      };
    }
    case 'ADMIN_SCHEDULE': {
      if (action.clientId === 'alex') {
        const [h, m] = action.start.split(':').map(Number);
        const end = `${String(Math.floor((h * 60 + m + 20) / 60)).padStart(2, '0')}:${String((h * 60 + m + 20) % 60).padStart(2, '0')}`;
        return reducer(state, {
          type: 'APPT_BOOK',
          appt: { title: action.title, kind: 'checkin', date: action.date, start: action.start, end, method: 'Video call (demo link)' },
        });
      }
      return {
        ...state,
        adminClients: state.adminClients.map((c) =>
          c.id === action.clientId ? { ...c, nextAppointment: { title: action.title, date: action.date, start: action.start }, activity: [`Appointment scheduled: ${action.title}`, ...c.activity] } : c,
        ),
      };
    }
    default:
      return state;
  }
}

