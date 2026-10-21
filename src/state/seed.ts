import { addDays, isoDaysAgo, nextWeekday, toISODate } from '../lib/dates';
import type { DemoDocument, DemoState, FormId, FormRecord, Task } from './types';

export const STATE_VERSION = 3;

const dayISO = (offset: number) => toISODate(addDays(new Date(), offset));

function seedDocuments(): DemoDocument[] {
  return [
    {
      id: 'doc-welcome',
      title: 'Welcome and Getting Started',
      filename: 'Welcome and Getting Started.pdf',
      category: 'Getting Started',
      added: dayISO(-14),
      size: '184 KB',
      description: 'A short orientation to your client space and what to expect in the first weeks.',
      sections: [
        { heading: 'Welcome', body: 'We are glad to be supporting you. This guide explains how your client space is organized and how the concierge team works alongside you.' },
        { heading: 'What to expect', body: 'You will complete a few simple forms, review a sample service arrangement, and begin shaping a roadmap of next steps. You set the pace.' },
        { heading: 'How to reach us', body: 'Use Messages in your portal for non-urgent questions. This service is non-clinical and is not designed for emergencies or urgent medical needs.' },
      ],
    },
    {
      id: 'doc-agreement',
      title: 'Service Agreement — Demo',
      filename: 'Service Agreement — Demo.pdf',
      category: 'Service Agreements',
      added: dayISO(-2),
      size: '212 KB',
      description: 'A sample agreement describing scope, responsibilities, and general terms. Illustrative only.',
      sections: [
        { heading: 'Scope of services', body: 'Non-clinical coordination and navigation support, including consultation, roadmap planning, scheduling coordination, and document organization.' },
        { heading: 'Payment terms', body: 'Placeholder fees are listed on invoices. The business will define its real terms before launch.' },
        { heading: 'Important note', body: 'This document is a fictional sample. It is not a legal agreement and has not been reviewed by legal counsel.' },
      ],
    },
    {
      id: 'doc-preferences',
      title: 'Personal Preferences Summary',
      filename: 'Personal Preferences Summary.pdf',
      category: 'Shared Documents',
      added: dayISO(-5),
      size: '96 KB',
      description: 'A summary of the communication and service preferences you shared.',
      sections: [
        { heading: 'Communication', body: 'Preferred method: Portal message. Preferred time: Mornings. Reminders: the day before an appointment.' },
        { heading: 'Support priorities', body: 'Organizing appointments, keeping documents together, and understanding next steps.' },
        { heading: 'Pace', body: 'Gentle and steady, with short check-ins.' },
      ],
    },
    {
      id: 'doc-checklist',
      title: 'Coordination Checklist',
      filename: 'Coordination Checklist.pdf',
      category: 'Planning Resources',
      added: dayISO(-1),
      size: '128 KB',
      description: 'A simple checklist for preparing for upcoming appointments and conversations.',
      sections: [
        { heading: 'Before each appointment', body: 'Confirm the date and time. Write down two or three questions. Gather any documents you would like to discuss. Note any transportation or scheduling needs.' },
        { heading: 'After each appointment', body: 'Capture key takeaways in your own words. Add follow-up items to your task list. Let your concierge know if anything should change in your roadmap.' },
        { heading: 'Weekly review', body: 'Spend ten minutes reviewing tasks, upcoming dates, and messages. Adjust priorities if your week looks different than expected.' },
      ],
    },
    {
      id: 'doc-resource',
      title: 'Resource Guide — Planning Your Week',
      filename: 'Resource Guide — Planning Your Week.pdf',
      category: 'Planning Resources',
      added: dayISO(-3),
      size: '156 KB',
      description: 'A gentle guide for organizing time, reminders, and priorities around your commitments.',
      sections: [
        { heading: 'Start with what is fixed', body: 'List the appointments and commitments that cannot move. Everything else can be arranged around them.' },
        { heading: 'Leave room', body: 'Allow a little buffer before and after important appointments so the day feels less rushed.' },
        { heading: 'Keep one list', body: 'A single, shared task list is easier to maintain than many scattered notes. Your portal task list is designed for this.' },
      ],
    },
    {
      id: 'doc-invoice-1001',
      title: 'Invoice HW-1001',
      filename: 'Invoice HW-1001.pdf',
      category: 'Invoices',
      added: dayISO(-18),
      size: '64 KB',
      description: 'Consultation and planning package — $250. Paid.',
      sections: [
        { heading: 'Invoice HW-1001', body: 'Consultation and planning package. Amount: $250. Status: Paid.' },
        { heading: 'Notice', body: 'This invoice is a fictional demo. No real payment was processed.' },
      ],
    },
  ];
}

function seedTasks(): Task[] {
  const t = (
    id: string,
    stageId: Task['stageId'],
    title: string,
    description: string,
    due: number,
    status: Task['status'],
    priority: Task['priority'],
    link: string,
    linkLabel: string,
  ): Task => ({ id, stageId, title, description, due: dayISO(due), status, priority, link, linkLabel });
  return [
    t('task-c1', 'consult', 'Introductory conversation', 'Talk through goals and how we can help.', -9, 'done', 'medium', '/portal/schedule', 'View appointments'),
    t('task-c2', 'consult', 'Share initial priorities', 'Note what matters most right now.', -9, 'done', 'medium', '/portal/roadmap', 'View roadmap'),
    t('task-c3', 'consult', 'Agree on next steps', 'Confirm the first few steps together.', -8, 'done', 'low', '/portal/roadmap', 'View roadmap'),
    t('task-forms', 'info', 'Complete your remaining forms', 'A few short forms help us organize your preferences.', 4, 'in-progress', 'medium', '/portal/forms', 'Open forms'),
    t('task-agreement', 'info', 'Review the service agreement', 'Take your time reading the sample agreement.', 2, 'todo', 'high', '/portal/agreements', 'Review agreement'),
    t('task-comm', 'info', 'Complete the communication preferences form', 'Tell us how and when you like to hear from us.', 3, 'todo', 'high', '/portal/forms', 'Open forms'),
    t('task-session', 'planning', 'Confirm the planning session', 'Check the date and time of your upcoming session.', 6, 'todo', 'medium', '/portal/schedule', 'View appointment'),
    t('task-resource', 'planning', 'Review the resource document', 'Read the short guide to planning your week.', 8, 'todo', 'low', '/portal/documents', 'Open documents'),
    t('task-checklist', 'planning', 'Prepare a coordination checklist', 'Use the checklist to prepare for upcoming conversations.', 10, 'todo', 'low', '/portal/documents', 'Open documents'),
    t('task-outstanding', 'support', 'Review outstanding tasks', 'A quick look at what is still open.', 14, 'todo', 'low', '/portal/tasks', 'Open tasks'),
    t('task-update', 'support', 'Update next steps', 'Adjust the roadmap as priorities evolve.', 18, 'todo', 'low', '/portal/roadmap', 'View roadmap'),
    t('task-followup', 'support', 'Schedule a follow-up conversation', 'Book a short coordination check-in.', 21, 'todo', 'medium', '/portal/schedule', 'Book a time'),
  ];
}

export function createSeed(): DemoState {
  const planningDate = toISODate(nextWeekday(new Date(), 5, 4));
  const rec = (id: FormId, status: FormRecord['status'], values: FormRecord['values'], ago: number): FormRecord => ({
    id,
    status,
    values,
    updatedAt: isoDaysAgo(ago, 11, 20),
  });

  return {
    v: STATE_VERSION,
    session: null,
    profile: { name: 'Alex Morgan', firstName: 'Alex', email: 'alex.morgan@havenwell-demo.test', initials: 'AM' },
    onboardingChecklistConsultDone: true,
    onboarding: {
      step: 0,
      about: { preferredName: '', email: '', phone: '', method: '', contactTime: '', timezone: '', supportNotes: '' },
      prefs: { channel: '', window: '', notes: '' },
      agreementChecked: false,
      completed: false,
    },
    forms: {
      'client-info': rec('client-info', 'completed', { preferredName: 'Alex', email: 'alex.morgan@havenwell-demo.test', phone: '(555) 010-0100', timezone: 'Pacific Time (PT)', notes: '' }, 5),
      'comm-prefs': rec('comm-prefs', 'todo', {}, 0),
      'service-prefs': rec('service-prefs', 'draft', { interests: ['Organizing appointments'], pace: 'Gentle and steady' }, 1),
      acknowledgment: rec('acknowledgment', 'todo', {}, 0),
      'coordination-prefs': rec('coordination-prefs', 'todo', {}, 0),
    },
    agreements: [
      { id: 'ag-services', title: 'Concierge Services Agreement', version: 'v1.0', issued: dayISO(-2), status: 'ready', summary: 'Describes the scope, responsibilities, and general terms of your concierge coordination.' },
      { id: 'ag-package', title: 'Consultation and Planning Package Agreement', version: 'v1.0', issued: dayISO(-20), status: 'completed', summary: 'Covers your introductory consultation and planning session.', acknowledgedBy: 'Alex Morgan', acknowledgedAt: isoDaysAgo(19, 10, 5) },
      { id: 'ag-privacy', title: 'Privacy and Communication Notice (Sample)', version: 'v0.9', issued: dayISO(-1), status: 'awaiting', summary: 'A placeholder notice about how messages and documents are handled.' },
    ],
    invoices: [
      { id: 'HW-1001', title: 'Consultation and planning package', description: 'Introductory consultation and a personalized planning session.', lineItems: [{ label: 'Introductory consultation', amount: 100 }, { label: 'Planning session', amount: 150 }], amount: 250, issued: dayISO(-20), due: dayISO(-13), status: 'paid', paidAt: isoDaysAgo(18, 9, 40), method: 'Demo card' },
      { id: 'HW-1002', title: 'Concierge coordination package', description: 'Ongoing coordination support, roadmap updates, and portal access.', lineItems: [{ label: 'Concierge coordination (first month)', amount: 350 }, { label: 'Roadmap and document organization', amount: 100 }], amount: 450, issued: dayISO(-3), due: dayISO(7), status: 'outstanding' },
    ],
    transactions: [{ id: 'txn-1001', invoiceId: 'HW-1001', amount: 250, date: isoDaysAgo(18, 9, 40), method: 'Demo card', status: 'succeeded' }],
    appointments: [
      { id: 'appt-planning', title: 'Your introductory planning session', kind: 'planning', date: planningDate, start: '10:30', end: '11:00', method: 'Video call (demo link)', status: 'upcoming', notes: 'We will review your priorities and shape the first version of your roadmap.' },
      { id: 'appt-intro', title: 'Introductory Consultation', kind: 'intro', date: dayISO(-8), start: '14:30', end: '15:00', method: 'Phone call', status: 'completed', notes: 'A first conversation about goals and coordination needs.' },
    ],
    conversations: [
      {
        id: 'c-concierge',
        title: 'Concierge Team',
        role: 'Your concierge team',
        initials: 'CT',
        unread: 1,
        messages: [
          { id: 'm1', from: 'team', text: 'Welcome to your client space, Alex. Message us here any time for non-urgent questions.', ts: isoDaysAgo(6, 9, 15) },
          { id: 'm2', from: 'client', text: 'Thank you. This is much easier to follow than I expected.', ts: isoDaysAgo(6, 9, 48) },
          { id: 'm3', from: 'team', text: "Hi Alex, I've organized the next steps from our introductory conversation. You can review the updated roadmap whenever you're ready.", ts: isoDaysAgo(1, 16, 10) },
        ],
      },
      {
        id: 'c-scheduling',
        title: 'Scheduling Support',
        role: 'Appointments and reminders',
        initials: 'SS',
        unread: 0,
        messages: [
          { id: 'm4', from: 'team', text: 'Your planning session is on the calendar. Would you like a reminder the morning before?', ts: isoDaysAgo(2, 11, 5) },
          { id: 'm5', from: 'client', text: 'A reminder the day before would be great.', ts: isoDaysAgo(2, 12, 30) },
        ],
      },
      {
        id: 'c-docs',
        title: 'Documents and Onboarding',
        role: 'Forms, agreements, and files',
        initials: 'DO',
        unread: 1,
        messages: [
          { id: 'm6', from: 'team', text: "I've added a simple coordination checklist to your documents. Have a look when you have a moment.", ts: isoDaysAgo(1, 10, 20), attachment: { name: 'Coordination Checklist.pdf', docId: 'doc-checklist' } },
        ],
      },
    ],
    tasks: seedTasks(),
    documents: seedDocuments(),
    activity: [
      { id: 'a1', kind: 'document', text: 'A new document was added: Coordination Checklist', ts: isoDaysAgo(1, 10, 20), link: '/portal/documents' },
      { id: 'a2', kind: 'message', text: 'A new message is available from your Concierge Team', ts: isoDaysAgo(1, 16, 10), link: '/portal/messages' },
      { id: 'a3', kind: 'appointment', text: 'Your appointment details were updated', ts: isoDaysAgo(2, 11, 0), link: '/portal/schedule' },
      { id: 'a4', kind: 'form', text: 'An intake form was completed: Client Information Form', ts: isoDaysAgo(5, 11, 20), link: '/portal/forms' },
    ],
    adminClients: [
      {
        id: 'taylor', name: 'Taylor Bennett', initials: 'TB', email: 'taylor.bennett@havenwell-demo.test', progress: 80,
        nextAppointment: { title: 'Planning Session', date: dayISO(3), start: '13:00' }, agreement: 'completed', payment: 'outstanding', stage: 'Planning and Coordination',
        tasks: [{ id: 'tt1', title: 'Confirm resource list', done: false, due: dayISO(4) }, { id: 'tt2', title: 'Share appointment preferences', done: true, due: dayISO(-1) }],
        checklist: [{ label: 'Initial consultation', done: true }, { label: 'Intake questionnaire', done: true }, { label: 'Service agreement', done: true }, { label: 'Payment setup', done: false }, { label: 'Planning session', done: true }],
        activity: ['Agreement acknowledged (demo)', 'Planning session scheduled', 'Invoice HW-1102 issued'], unread: 2, lastMessage: 'Could we move Friday to the afternoon?',
      },
      {
        id: 'jordan', name: 'Jordan Ellis', initials: 'JE', email: 'jordan.ellis@havenwell-demo.test', progress: 40,
        nextAppointment: null, agreement: 'ready', payment: 'none', stage: 'Information and Preferences',
        tasks: [{ id: 'jt1', title: 'Complete intake forms', done: false, due: dayISO(2) }, { id: 'jt2', title: 'Review service agreement', done: false, due: dayISO(3) }],
        checklist: [{ label: 'Initial consultation', done: true }, { label: 'Intake questionnaire', done: true }, { label: 'Service agreement', done: false }, { label: 'Payment setup', done: false }, { label: 'Planning session', done: false }],
        activity: ['Introductory consultation completed', 'Client Information Form submitted'], unread: 0, lastMessage: 'Thanks, I will review the agreement tonight.',
      },
      {
        id: 'casey', name: 'Casey Parker', initials: 'CP', email: 'casey.parker@havenwell-demo.test', progress: 100,
        nextAppointment: { title: 'Coordination Check-in', date: dayISO(5), start: '09:30' }, agreement: 'completed', payment: 'paid', stage: 'Ongoing Support',
        tasks: [{ id: 'ct1', title: 'Update next steps', done: false, due: dayISO(6) }],
        checklist: [{ label: 'Initial consultation', done: true }, { label: 'Intake questionnaire', done: true }, { label: 'Service agreement', done: true }, { label: 'Payment setup', done: true }, { label: 'Planning session', done: true }],
        activity: ['Roadmap updated', 'Invoice HW-1090 paid (demo)'], unread: 1, lastMessage: 'The updated checklist looks great.',
      },
    ],
    opsTasks: [
      { id: 'op1', title: 'Review pending intake forms', detail: '3 forms awaiting review', done: false },
      { id: 'op2', title: 'Follow up on unsigned demo agreements', detail: 'Jordan Ellis and 1 other', done: false, clientId: 'jordan' },
      { id: 'op3', title: 'Confirm upcoming consultations', detail: '4 this week', done: false },
      { id: 'op4', title: 'Prepare client resources', detail: 'Planning guides for new clients', done: false },
    ],
  };
}
