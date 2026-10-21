import { STAGES } from '../content/site';
import { todayISO } from '../lib/dates';
import type { AdminClient, Appointment, DemoState, StageDef, Task } from './types';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  statusLabel: string;
  link: string;
}

export function getChecklist(s: DemoState): ChecklistItem[] {
  const intake = s.forms['client-info'].status === 'completed';
  const agreement = s.agreements.find((a) => a.id === 'ag-services')?.status === 'completed';
  const paid = s.invoices.every((i) => i.status === 'paid');
  const planned = s.appointments.some((a) => a.kind === 'planning' && a.status === 'upcoming');
  return [
    { id: 'consult', label: 'Initial consultation', done: s.onboardingChecklistConsultDone, statusLabel: 'Completed', link: '/portal/schedule' },
    { id: 'intake', label: 'Intake questionnaire', done: intake, statusLabel: intake ? 'Completed' : 'Ready to complete', link: '/portal/forms' },
    { id: 'agreement', label: 'Service agreement', done: !!agreement, statusLabel: agreement ? 'Completed' : 'Needs review', link: '/portal/agreements' },
    { id: 'payment', label: 'Payment setup', done: paid, statusLabel: paid ? 'Completed' : 'Ready to complete', link: '/portal/payments' },
    { id: 'planning', label: 'Introductory planning session', done: planned, statusLabel: planned ? 'Scheduled' : 'Needs scheduling', link: '/portal/schedule' },
  ];
}

export function onboardingProgress(s: DemoState): number {
  const items = getChecklist(s);
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

const apptKey = (a: Appointment) => `${a.date}T${a.start}`;

export function upcomingAppointments(s: DemoState): Appointment[] {
  const today = todayISO();
  return s.appointments.filter((a) => a.status === 'upcoming' && a.date >= today).sort((a, b) => apptKey(a).localeCompare(apptKey(b)));
}

export function pastAppointments(s: DemoState): Appointment[] {
  const today = todayISO();
  return s.appointments
    .filter((a) => a.status === 'completed' || a.status === 'cancelled' || (a.status === 'upcoming' && a.date < today))
    .sort((a, b) => apptKey(b).localeCompare(apptKey(a)));
}

export function nextAppointment(s: DemoState): Appointment | undefined {
  return upcomingAppointments(s)[0];
}

export function outstandingBalance(s: DemoState): number {
  return s.invoices.filter((i) => i.status === 'outstanding').reduce((sum, i) => sum + i.amount, 0);
}

export function unreadTotal(s: DemoState): number {
  return s.conversations.reduce((sum, c) => sum + c.unread, 0);
}

export function openTasks(s: DemoState): Task[] {
  return s.tasks.filter((t) => t.status !== 'done').sort((a, b) => a.due.localeCompare(b.due));
}

export type StageStatus = 'completed' | 'current' | 'upcoming';
export interface StageView {
  def: StageDef;
  tasks: Task[];
  done: number;
  total: number;
  status: StageStatus;
  target: string;
}

export function getStages(s: DemoState): StageView[] {
  let currentAssigned = false;
  return STAGES.map((def) => {
    const tasks = s.tasks.filter((t) => t.stageId === def.id).sort((a, b) => a.due.localeCompare(b.due));
    const done = tasks.filter((t) => t.status === 'done').length;
    let status: StageStatus;
    if (tasks.length > 0 && done === tasks.length) status = 'completed';
    else if (!currentAssigned) {
      status = 'current';
      currentAssigned = true;
    } else status = 'upcoming';
    const target = tasks.reduce((max, t) => (t.due > max ? t.due : max), tasks[0]?.due ?? todayISO());
    return { def, tasks, done, total: tasks.length, status, target };
  });
}

export function roadmapProgress(s: DemoState): number {
  if (!s.tasks.length) return 0;
  return Math.round((s.tasks.filter((t) => t.status === 'done').length / s.tasks.length) * 100);
}

export function getAdminClients(s: DemoState): AdminClient[] {
  const checklist = getChecklist(s);
  const next = nextAppointment(s);
  const stage = getStages(s).find((x) => x.status === 'current');
  const lastConv = s.conversations[0];
  const alex: AdminClient = {
    id: 'alex',
    name: s.profile.name,
    initials: s.profile.initials,
    email: s.profile.email,
    progress: onboardingProgress(s),
    nextAppointment: next ? { title: next.title, date: next.date, start: next.start } : null,
    agreement: s.agreements.find((a) => a.id === 'ag-services')?.status ?? 'ready',
    payment: s.invoices.some((i) => i.status === 'outstanding') ? 'outstanding' : 'paid',
    stage: stage?.def.title ?? 'Ongoing Support',
    tasks: s.tasks.map((t) => ({ id: t.id, title: t.title, done: t.status === 'done', due: t.due })),
    checklist: checklist.map((c) => ({ label: c.label, done: c.done })),
    activity: s.activity.slice(0, 4).map((a) => a.text),
    unread: unreadTotal(s),
    lastMessage: lastConv?.messages[lastConv.messages.length - 1]?.text ?? '',
  };
  return [alex, ...s.adminClients];
}
