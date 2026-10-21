import type { AppointmentKind, StageDef } from '../state/types';

export const STAGES: StageDef[] = [
  {
    id: 'consult',
    title: 'Initial Consultation',
    description: 'An introductory conversation to understand your goals, priorities, and the coordination support that would help most.',
  },
  {
    id: 'info',
    title: 'Information and Preferences',
    description: 'Sharing your preferences, reviewing the proposed service arrangement, and confirming how we will stay in touch.',
  },
  {
    id: 'planning',
    title: 'Planning and Coordination',
    description: 'Organizing appointments, gathering resources, and preparing a clear coordination checklist.',
  },
  {
    id: 'support',
    title: 'Ongoing Support',
    description: 'Checking in regularly, updating next steps as things change, and keeping everything in one place.',
  },
];

export const APPOINTMENT_TYPES: { kind: AppointmentKind; title: string; minutes: number; blurb: string }[] = [
  { kind: 'intro', title: 'Introductory Consultation', minutes: 30, blurb: 'A first conversation to talk through goals and coordination needs.' },
  { kind: 'planning', title: 'Planning Session', minutes: 45, blurb: 'Work through priorities and shape your roadmap together.' },
  { kind: 'checkin', title: 'Coordination Check-in', minutes: 20, blurb: 'A short touchpoint to update tasks and next steps.' },
];

export interface ServiceDef {
  id: string;
  icon: 'compass' | 'map' | 'calendar' | 'folder' | 'clipboard' | 'heart';
  title: string;
  short: string;
  long: string;
  includes: string[];
}

export const SERVICES: ServiceDef[] = [
  {
    id: 'consultation',
    icon: 'compass',
    title: 'Initial Consultation and Needs Discovery',
    short: 'A relaxed first conversation to understand your goals, priorities, and the logistics on your mind.',
    long: 'We begin by listening. In a short introductory conversation, we talk through what is currently on your plate, where coordination would feel most helpful, and how you prefer to work together.',
    includes: ['A 30-minute introductory conversation', 'A summary of priorities we identify together', 'Suggested next steps in plain language'],
  },
  {
    id: 'roadmap',
    icon: 'map',
    title: 'Personalized Recovery Roadmap',
    short: 'A clear, organized view of the next steps we have identified together.',
    long: 'Your roadmap turns a long list of things to remember into a calm sequence of stages. It is a planning and coordination overview, never a clinical treatment plan.',
    includes: ['A staged, easy-to-follow roadmap', 'Tasks linked to forms, documents, and appointments', 'Regular updates as your priorities change'],
  },
  {
    id: 'scheduling',
    icon: 'calendar',
    title: 'Appointment and Schedule Coordination',
    short: 'Keep appointments, reminders, and follow-ups organized in one dependable place.',
    long: 'We help you keep track of what is happening and when, with reminders and rescheduling that fit around your life. We do not replace your providers, and we do not make clinical decisions.',
    includes: ['One shared view of upcoming appointments', 'Reminders in your preferred channel', 'Help with rescheduling logistics'],
  },
  {
    id: 'documents',
    icon: 'folder',
    title: 'Resource and Document Organization',
    short: 'Everything you share and receive is organized for easy reference.',
    long: 'Agreements, checklists, resource guides, and invoices are kept together in your secure client space so you are never searching through email.',
    includes: ['A categorized document library', 'Shared planning resources', 'Easy previews and downloads'],
  },
  {
    id: 'admin',
    icon: 'clipboard',
    title: 'Administrative Navigation Support',
    short: 'Practical help with the paperwork and logistics that can pile up.',
    long: 'From organizing forms to preparing questions in advance, we help you move through administrative steps with more confidence. We do not provide legal, financial, or medical advice.',
    includes: ['Form preparation and organization', 'Checklists for upcoming steps', 'A consistent point of contact'],
  },
  {
    id: 'ongoing',
    icon: 'heart',
    title: 'Ongoing Concierge Coordination',
    short: 'A steady point of contact for non-clinical coordination as things evolve.',
    long: 'Over time, we stay alongside you with regular check-ins and messages, updating your roadmap and keeping next steps clear. The pace is always yours to set.',
    includes: ['Regular coordination check-ins', 'Secure-style messaging with your concierge team', 'Roadmap and task updates'],
  },
];

export const JOURNEY = [
  { n: '01', title: 'Connect', body: "Begin with an introductory consultation to understand the client's goals and coordination needs." },
  { n: '02', title: 'Get Organized', body: 'Complete intake forms, review the proposed service arrangement, and establish priorities.' },
  { n: '03', title: 'Build Your Roadmap', body: 'Organize tasks, resources, appointments, and next steps into a clear plan.' },
  { n: '04', title: 'Move Forward With Support', body: 'Use the portal to stay informed, review documents, manage appointments, and communicate with the concierge team.' },
];

export const FAQS = [
  {
    q: 'What does concierge recovery care management mean?',
    a: 'It means personalized, non-clinical coordination and navigation. Your concierge helps you organize appointments, documents, tasks, and next steps so the practical side of recovery feels clearer. It is not medical care or treatment.',
  },
  {
    q: 'What happens during the initial consultation?',
    a: 'It is a relaxed conversation, usually about 30 minutes. We talk about your goals and what coordination support would be most useful. There is no obligation to continue, and you will not be asked for medical records.',
  },
  {
    q: 'How does the client portal work?',
    a: 'The portal is a private space for onboarding, forms, agreements, payments, scheduling, messages, your roadmap, tasks, and documents. This site is a demo, so everything you try is simulated and stored only in your browser.',
  },
  {
    q: 'Can I review my appointments and documents online?',
    a: 'Yes. In the portal you can see upcoming and past appointments, reschedule or cancel in the demo, and preview shared documents in one organized library.',
  },
  {
    q: 'How are service agreements and payments handled?',
    a: 'The final process depends on the business and the tools it uses. In this demo you can review a sample agreement and simulate a payment. No real signature, legal agreement, or payment is ever created.',
  },
  {
    q: 'Is this a clinical or medical service?',
    a: 'No. Havenwell is a non-clinical coordination and navigation service. It does not diagnose, treat, or supervise care, and it does not promise any particular outcome.',
  },
];

export const AGREEMENT_SECTIONS = [
  {
    heading: '1. Service description',
    body: 'Havenwell Concierge provides private-pay, non-clinical care management and navigation support. Services focus on organization, scheduling coordination, document management, and administrative guidance. (Illustrative demo content.)',
  },
  {
    heading: '2. Scope of services',
    body: 'Included: an introductory consultation, a personalized coordination roadmap, appointment and task coordination, and access to the client portal. Not included: medical advice, clinical assessment, diagnosis, treatment, crisis services, or legal and financial advice.',
  },
  {
    heading: '3. Responsibilities',
    body: 'The concierge team will respond to messages during stated business hours and keep your roadmap current. The client agrees to share accurate, non-sensitive coordination details and to let the team know when priorities change.',
  },
  {
    heading: '4. Payment terms',
    body: 'Fees are described on each invoice and are due by the stated due date. Amounts shown in this demo are placeholders and will be replaced by the business with its actual fees.',
  },
  {
    heading: '5. Cancellation policy (placeholder)',
    body: 'Placeholder: appointments may be rescheduled or cancelled with reasonable notice. The business will define its own notice period and any fees before launch.',
  },
  {
    heading: '6. Privacy-related notice (placeholder)',
    body: 'Placeholder: this section will describe how client information is handled once the business confirms its tools and policies. This demo makes no claims about security certifications or regulatory compliance.',
  },
];

export const PRIVACY_TEXT = [
  { heading: 'Sample privacy notice', body: 'This is sample placeholder text for demonstration only. It has not been reviewed or approved by legal counsel and does not describe any real data practices.' },
  { heading: 'Information in this demo', body: 'Everything you enter in this prototype stays in your own browser through local storage. Nothing is sent to a server, and you can erase it at any time with Reset Demo.' },
  { heading: 'Before launch', body: 'The business will replace this page with a notice that reflects its real tools, policies, and applicable obligations.' },
];

export const TERMS_TEXT = [
  { heading: 'Sample terms of service', body: 'This is sample placeholder text for demonstration only. It has not been reviewed or approved by legal counsel and is not a binding agreement.' },
  { heading: 'Nature of the service', body: 'The service described in this demo is non-clinical coordination and navigation. It does not provide medical advice, diagnosis, or treatment.' },
  { heading: 'Before launch', body: 'The business will provide its own terms of service, reviewed by an appropriate professional, before any real client uses the platform.' },
];
