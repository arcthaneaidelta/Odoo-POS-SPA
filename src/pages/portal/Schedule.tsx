import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Plus
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import type { Appointment, AppointmentKind } from '../../state/types';
import { PageHeader, StatusBadge } from '../../components/ui/Feedback';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmationDialog } from '../../components/ui/Dialog';
import { RadioCards } from '../../components/ui/Fields';
import { APPOINTMENT_TYPES } from '../../content/site';
import {
  formatLongDate,
  formatTimeRange,
  toISODate,
  addDays,
  addMinutes
} from '../../lib/dates';
import { useToast } from '../../components/ui/Toast';

export default function Schedule() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);

  // Booking Wizard State
  const [selectedKind, setSelectedKind] = useState<AppointmentKind>('intro');
  const [selectedDate, setSelectedDate] = useState(toISODate(addDays(new Date(), 2)));
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [meetingMethod, setMeetingMethod] = useState('Video call (demo link)');

  const upcoming = state.appointments.filter((a) => a.status === 'upcoming');
  const past = state.appointments.filter((a) => a.status !== 'upcoming');

  const selectedDef = APPOINTMENT_TYPES.find((t) => t.kind === selectedKind) || APPOINTMENT_TYPES[0];

  const handleConfirmBooking = () => {
    const end = addMinutes(selectedTime, selectedDef.minutes);

    if (reschedulingAppt) {
      dispatch({
        type: 'APPT_RESCHEDULE',
        id: reschedulingAppt.id,
        date: selectedDate,
        start: selectedTime,
        end
      });
      toast({
        tone: 'success',
        title: 'Appointment Rescheduled',
        message: `${reschedulingAppt.title} updated to ${formatLongDate(selectedDate)} at ${selectedTime}.`
      });
      setReschedulingAppt(null);
    } else {
      dispatch({
        type: 'APPT_BOOK',
        appt: {
          title: selectedDef.title,
          kind: selectedKind,
          date: selectedDate,
          start: selectedTime,
          end,
          method: meetingMethod,
          notes: 'Booked via client portal.'
        }
      });
      toast({
        tone: 'success',
        title: 'Appointment Confirmed',
        message: `${selectedDef.title} scheduled for ${formatLongDate(selectedDate)}.`
      });
    }
    setBookingOpen(false);
  };

  const handleOpenReschedule = (appt: Appointment) => {
    setReschedulingAppt(appt);
    setSelectedKind(appt.kind);
    setSelectedDate(appt.date);
    setSelectedTime(appt.start);
    setMeetingMethod(appt.method);
    setBookingOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!cancellingAppt) return;
    dispatch({ type: 'APPT_CANCEL', id: cancellingAppt.id });
    toast({
      tone: 'info',
      title: 'Appointment Cancelled',
      message: `${cancellingAppt.title} has been cancelled in demo state.`
    });
    setCancellingAppt(null);
  };

  return (
    <div className="portal-page-container">
      <PageHeader
        eyebrow="Appointment Scheduling"
        title="Sessions & Consultations"
        description="Book new planning touchpoints, review upcoming consultations, or reschedule sessions."
        actions={
          <Button
            onClick={() => {
              setReschedulingAppt(null);
              setBookingOpen(true);
            }}
            icon={<Plus size={16} />}
          >
            Book New Session
          </Button>
        }
      />

      {/* Upcoming Appointments */}
      <section className="card" style={{ marginBottom: '28px' }}>
        <div className="card__head">
          <h2 className="card__title">Upcoming Sessions</h2>
          <span className="small muted">{upcoming.length} scheduled</span>
        </div>

        {upcoming.length === 0 ? (
          <p className="small muted" style={{ padding: '16px 0' }}>
            No upcoming sessions. Click "Book New Session" to schedule a consultation or check-in.
          </p>
        ) : (
          <div className="appointments-list stack" style={{ gap: '14px' }}>
            {upcoming.map((appt) => (
              <div key={appt.id} className="appointment-card-item row row--between">
                <div className="appointment-details">
                  <div className="row" style={{ gap: '10px' }}>
                    <CalendarDays size={18} className="muted" />
                    <strong>{appt.title}</strong>
                    <StatusBadge tone="sage">Confirmed</StatusBadge>
                  </div>
                  <div className="small muted" style={{ marginTop: '4px' }}>
                    <span className="row" style={{ gap: '6px' }}>
                      <Clock size={13} />
                      {formatLongDate(appt.date)} · {formatTimeRange(appt.start, appt.end)}
                    </span>
                  </div>
                  <div className="small muted" style={{ marginTop: '2px' }}>
                    Meeting method: {appt.method}
                  </div>
                </div>

                <div className="appointment-actions row" style={{ gap: '10px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenReschedule(appt)}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCancellingAppt(appt)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Appointments */}
      <section className="card">
        <div className="card__head">
          <h2 className="card__title">Past & Cancelled Sessions</h2>
        </div>

        <div className="past-appointments-list stack" style={{ gap: '10px' }}>
          {past.map((appt) => (
            <div key={appt.id} className="row row--between small" style={{ padding: '8px 0', borderBottom: '1px solid var(--mist)' }}>
              <div>
                <strong>{appt.title}</strong>
                <span className="muted"> · {formatLongDate(appt.date)}</span>
              </div>
              <StatusBadge tone={appt.status === 'completed' ? 'neutral' : 'alert'}>
                {appt.status === 'completed' ? 'Completed' : 'Cancelled'}
              </StatusBadge>
            </div>
          ))}
        </div>
      </section>

      {/* Booking / Rescheduling Modal */}
      {bookingOpen && (
        <Modal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          title={reschedulingAppt ? `Reschedule ${reschedulingAppt.title}` : 'Book a Concierge Session'}
          description="Select your preferred session type, date, and simulated time slot."
          size="md"
          footer={
            <>
              <Button variant="ghost" onClick={() => setBookingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmBooking}>
                {reschedulingAppt ? 'Confirm Reschedule' : 'Confirm Demo Booking'}
              </Button>
            </>
          }
        >
          <div className="booking-modal-body stack" style={{ gap: '20px' }}>
            {/* Step 1: Appointment Type */}
            {!reschedulingAppt && (
              <RadioCards
                legend="Select Session Type"
                required
                options={APPOINTMENT_TYPES.map((t) => t.title)}
                value={selectedDef.title}
                onChange={(title) => {
                  const found = APPOINTMENT_TYPES.find((t) => t.title === title);
                  if (found) setSelectedKind(found.kind);
                }}
                descriptions={Object.fromEntries(
                  APPOINTMENT_TYPES.map((t) => [t.title, `${t.minutes} mins · ${t.blurb}`])
                )}
              />
            )}

            {/* Step 2: Date Picker */}
            <div className="field">
              <label className="field__label">Select Date</label>
              <input
                type="date"
                className="input"
                value={selectedDate}
                min={toISODate(new Date())}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Step 3: Available Time Slots */}
            <RadioCards
              legend="Available Time Slots (Demo Availability)"
              required
              options={['09:30', '10:30', '13:00', '14:30', '16:00']}
              value={selectedTime}
              onChange={setSelectedTime}
            />

            {/* Step 4: Meeting Method */}
            <RadioCards
              legend="Preferred Format"
              required
              options={[
                'Video call (demo link)',
                'Phone call',
                'In-person coordination session'
              ]}
              value={meetingMethod}
              onChange={setMeetingMethod}
            />
          </div>
        </Modal>
      )}

      {/* Cancellation Dialog */}
      <ConfirmationDialog
        open={!!cancellingAppt}
        onClose={() => setCancellingAppt(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Session?"
        message={`Are you sure you want to cancel "${cancellingAppt?.title}"? This is a local demo action.`}
        confirmLabel="Confirm Cancellation"
        cancelLabel="Keep Session"
        danger
      />
    </div>
  );
}
