import type { FormId } from '../state/types';

export type FieldType = 'text' | 'email' | 'tel' | 'select' | 'radio' | 'checkboxes' | 'textarea' | 'checkbox';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
}

export interface FormDef {
  id: FormId;
  title: string;
  description: string;
  minutes: number;
  fields: FieldDef[];
}

const TIMEZONES = ['Pacific Time (PT)', 'Mountain Time (MT)', 'Central Time (CT)', 'Eastern Time (ET)', 'Other'];
const TIMES = ['Mornings', 'Midday', 'Afternoons', 'Evenings', 'No preference'];

export const FORM_DEFS: FormDef[] = [
  {
    id: 'client-info',
    title: 'Client Information Form',
    description: 'Basic contact details so your concierge team can reach you.',
    minutes: 4,
    fields: [
      { name: 'preferredName', label: 'Preferred name', type: 'text', required: true, placeholder: 'How should we address you?' },
      { name: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'name@example.com' },
      { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '(555) 010-0100' },
      { name: 'timezone', label: 'Time zone', type: 'select', required: true, options: TIMEZONES },
      { name: 'notes', label: 'Anything else we should know?', type: 'textarea', help: 'Please keep this non-sensitive. Do not share medical details.' },
    ],
  },
  {
    id: 'comm-prefs',
    title: 'Communication Preferences',
    description: 'Tell us how and when you would like to hear from us.',
    minutes: 3,
    fields: [
      { name: 'method', label: 'Preferred communication method', type: 'radio', required: true, options: ['Phone', 'Email', 'Portal message'] },
      { name: 'time', label: 'Preferred contact time', type: 'select', required: true, options: TIMES },
      { name: 'reminders', label: 'Appointment reminders', type: 'checkboxes', options: ['Day before', 'Morning of', 'One hour before'] },
      { name: 'notes', label: 'Notes on communication', type: 'textarea', placeholder: 'For example: please avoid calls during work hours.' },
    ],
  },
  {
    id: 'service-prefs',
    title: 'Service Preferences',
    description: 'Help us shape the coordination support that would be most useful.',
    minutes: 5,
    fields: [
      {
        name: 'interests',
        label: 'Areas where you would like support',
        type: 'checkboxes',
        required: true,
        options: ['Organizing appointments', 'Keeping documents together', 'Understanding next steps', 'Administrative paperwork', 'Regular check-ins'],
      },
      { name: 'pace', label: 'Preferred pace', type: 'radio', required: true, options: ['Gentle and steady', 'Balanced', 'Focused and efficient'] },
      { name: 'notes', label: 'Anything else that would help us?', type: 'textarea' },
    ],
  },
  {
    id: 'acknowledgment',
    title: 'Client Acknowledgment',
    description: 'Confirm that you understand the non-clinical nature of the service.',
    minutes: 2,
    fields: [
      { name: 'nonClinical', label: 'I understand this is a non-clinical coordination service and not medical care.', type: 'checkbox', required: true },
      { name: 'demo', label: 'I understand this is a demonstration with fictional content.', type: 'checkbox', required: true },
      { name: 'typedName', label: 'Type your name to acknowledge', type: 'text', required: true, placeholder: 'Your name' },
    ],
  },
  {
    id: 'coordination-prefs',
    title: 'Coordination Preferences',
    description: 'Share how you prefer to plan appointments and receive updates.',
    minutes: 4,
    fields: [
      { name: 'format', label: 'Preferred meeting format', type: 'radio', required: true, options: ['Video call', 'Phone call', 'In person (where available)'] },
      { name: 'lead', label: 'How much notice do you like for scheduling?', type: 'select', required: true, options: ['Same week', 'A few days', 'One week', 'Two weeks or more'] },
      { name: 'priority', label: 'First priority to organize', type: 'select', options: ['Upcoming appointments', 'Important documents', 'Questions to prepare', 'Daily routine logistics'] },
      { name: 'notes', label: 'Notes for your concierge', type: 'textarea' },
    ],
  },
];

export const formDef = (id: FormId) => FORM_DEFS.find((f) => f.id === id)!;

export const TIMEZONE_OPTIONS = TIMEZONES;
export const CONTACT_TIME_OPTIONS = TIMES;
