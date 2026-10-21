export type StageId = 'consult' | 'info' | 'planning' | 'support';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  due: string;
  stageId: StageId;
  status: TaskStatus;
  priority: Priority;
  link: string;
  linkLabel: string;
}

export interface StageDef {
  id: StageId;
  title: string;
  description: string;
}

export type FormId = 'client-info' | 'comm-prefs' | 'service-prefs' | 'acknowledgment' | 'coordination-prefs';
export type FormStatus = 'todo' | 'draft' | 'completed';
export type FormValue = string | string[] | boolean;
export type FormValues = Record<string, FormValue>;

export interface FormRecord {
  id: FormId;
  status: FormStatus;
  values: FormValues;
  updatedAt: string;
}

export type AgreementStatus = 'awaiting' | 'ready' | 'completed';
export interface Agreement {
  id: string;
  title: string;
  version: string;
  issued: string;
  status: AgreementStatus;
  summary: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export type InvoiceStatus = 'paid' | 'outstanding';
export interface Invoice {
  id: string;
  title: string;
  description: string;
  lineItems: { label: string; amount: number }[];
  amount: number;
  issued: string;
  due: string;
  status: InvoiceStatus;
  paidAt?: string;
  method?: string;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  status: 'succeeded' | 'declined';
}

export type AppointmentKind = 'intro' | 'planning' | 'checkin';
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';
export interface Appointment {
  id: string;
  title: string;
  kind: AppointmentKind;
  date: string;
  start: string;
  end: string;
  method: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface Message {
  id: string;
  from: 'client' | 'team';
  text: string;
  ts: string;
  attachment?: { name: string; docId: string };
}

export interface Conversation {
  id: string;
  title: string;
  role: string;
  initials: string;
  unread: number;
  messages: Message[];
}

export type DocCategory = 'Getting Started' | 'Service Agreements' | 'Planning Resources' | 'Invoices' | 'Shared Documents';
export interface DemoDocument {
  id: string;
  title: string;
  filename: string;
  category: DocCategory;
  added: string;
  description: string;
  size: string;
  sections: { heading: string; body: string }[];
}

export type ActivityKind = 'document' | 'appointment' | 'message' | 'form' | 'payment' | 'task' | 'agreement';
export interface Activity {
  id: string;
  text: string;
  ts: string;
  link: string;
  kind: ActivityKind;
}

export interface OnboardingState {
  step: number;
  about: {
    preferredName: string;
    email: string;
    phone: string;
    method: string;
    contactTime: string;
    timezone: string;
    supportNotes: string;
  };
  prefs: {
    channel: string;
    window: string;
    notes: string;
  };
  agreementChecked: boolean;
  completed: boolean;
}

export interface Session {
  role: 'client' | 'admin';
  startedAt: string;
}

export interface AdminClient {
  id: string;
  name: string;
  initials: string;
  email: string;
  progress: number;
  nextAppointment: { title: string; date: string; start: string } | null;
  agreement: AgreementStatus;
  payment: 'paid' | 'outstanding' | 'none';
  stage: string;
  tasks: { id: string; title: string; done: boolean; due: string }[];
  checklist: { label: string; done: boolean }[];
  activity: string[];
  unread: number;
  lastMessage: string;
}

export interface OpsTask {
  id: string;
  title: string;
  detail: string;
  done: boolean;
  clientId?: string;
}

export interface DemoState {
  v: number;
  session: Session | null;
  profile: { name: string; firstName: string; email: string; initials: string };
  onboardingChecklistConsultDone: boolean;
  onboarding: OnboardingState;
  forms: Record<FormId, FormRecord>;
  agreements: Agreement[];
  invoices: Invoice[];
  transactions: Transaction[];
  appointments: Appointment[];
  conversations: Conversation[];
  tasks: Task[];
  documents: DemoDocument[];
  activity: Activity[];
  adminClients: AdminClient[];
  opsTasks: OpsTask[];
}
