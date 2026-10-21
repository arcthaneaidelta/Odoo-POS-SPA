import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import {
  getChecklist,
  onboardingProgress,
  nextAppointment,
  openTasks,
  getStages,
  outstandingBalance,
  unreadTotal
} from '../../state/selectors';
import { greeting, formatLongDate, formatTimeRange, dueLabel } from '../../lib/dates';
import { Button, ButtonLink } from '../../components/ui/Button';
import { ProgressRing, StatusBadge } from '../../components/ui/Feedback';
import { ConfirmationDialog } from '../../components/ui/Dialog';
import { useToast } from '../../components/ui/Toast';

export default function Dashboard() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const progress = onboardingProgress(state);
  const checklist = getChecklist(state);
  const appt = nextAppointment(state);
  const tasks = openTasks(state).slice(0, 4);
  const stages = getStages(state);
  const balance = outstandingBalance(state);
  const unread = unreadTotal(state);
  const latestMessage = state.conversations[0]?.messages.slice(-1)[0];

  const [cancelApptOpen, setCancelApptOpen] = useState(false);

  const handleCompleteTask = (id: string) => {
    dispatch({ type: 'TASK_SET', id, status: 'done' });
    toast({ tone: 'success', title: 'Task Completed', message: 'Your roadmap and dashboard have updated.' });
  };

  const handleCancelAppointment = () => {
    if (appt) {
      dispatch({ type: 'APPT_CANCEL', id: appt.id });
      setCancelApptOpen(false);
      toast({ tone: 'info', title: 'Appointment Cancelled', message: 'You can reschedule whenever you are ready.' });
    }
  };

  return (
    <div className="dash-container">
      {/* 6.1 Welcome Banner */}
      <section className="dash-welcome card card--sage">
        <div className="dash-welcome-text">
          <p className="eyebrow">Personalized Client Space</p>
          <h1 className="dash-greeting display">
            {greeting()}, {state.profile.firstName}.
          </h1>
          <p className="dash-welcome-sub">
            Let's take a look at what's ahead and make your next steps a little easier.
          </p>
          <div className="dash-welcome-actions">
            <ButtonLink to="/portal/roadmap" size="md" iconAfter={<ArrowRight size={15} />}>
              View My Roadmap
            </ButtonLink>
            <ButtonLink to="/portal/schedule" variant="secondary" size="md">
              Check Appointments
            </ButtonLink>
          </div>
        </div>

        <div className="dash-welcome-visual" aria-hidden="true">
          <div className="dash-visual-badge">
            <Sparkles size={22} />
            <span>Care Navigation</span>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="dash-grid">
        {/* Left Column (Primary Focus) */}
        <div className="dash-col-primary">
          {/* 6.2 Getting Started Card */}
          <section className="card">
            <div className="card__head">
              <div>
                <h2 className="card__title">Your onboarding is underway</h2>
                <p className="small muted">Complete these key steps to personalize your support.</p>
              </div>
              <StatusBadge tone={progress === 100 ? 'sage' : 'sand'}>
                {progress === 100 ? 'Complete' : `${progress}% Ready`}
              </StatusBadge>
            </div>

            <div className="dash-onboarding-body">
              <div className="dash-onboarding-ring">
                <ProgressRing value={progress} size={110} stroke={8} label="Onboarding completion" />
              </div>

              <div className="dash-checklist">
                {checklist.map((item) => (
                  <Link key={item.id} to={item.link} className="dash-checklist-item">
                    <span className={`checklist-icon ${item.done ? 'is-done' : ''}`} aria-hidden="true">
                      {item.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </span>
                    <span className={`checklist-label ${item.done ? 'is-struck' : ''}`}>
                      {item.label}
                    </span>
                    <span className="checklist-status small muted">
                      {item.statusLabel}
                      <ChevronRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="dash-card-footer">
              <Link to="/portal/onboarding" className="link-btn small">
                Open full onboarding wizard <ArrowRight size={14} />
              </Link>
            </div>
          </section>

          {/* 6.4 Next Steps / Tasks */}
          <section className="card">
            <div className="card__head">
              <div>
                <h2 className="card__title">Next Steps</h2>
                <p className="small muted">Prioritized actions identified with your concierge.</p>
              </div>
              <ButtonLink to="/portal/tasks" variant="ghost" size="sm">
                All Tasks ({state.tasks.length})
              </ButtonLink>
            </div>

            {tasks.length === 0 ? (
              <p className="muted small" style={{ padding: '16px 0' }}>
                All current tasks are completed! Review your roadmap for upcoming milestones.
              </p>
            ) : (
              <div className="dash-task-list">
                {tasks.map((task) => (
                  <div key={task.id} className="dash-task-item">
                    <button
                      type="button"
                      className="dash-task-toggle"
                      onClick={() => handleCompleteTask(task.id)}
                      aria-label={`Mark "${task.title}" complete`}
                      title="Mark complete"
                    >
                      <Circle size={18} />
                    </button>
                    <div className="dash-task-info">
                      <strong>{task.title}</strong>
                      <span className="small muted">{task.description}</span>
                    </div>
                    <div className="dash-task-meta">
                      <span className="small muted">{dueLabel(task.due)}</span>
                      <Link to={task.link} className="btn btn--sm btn--secondary">
                        {task.linkLabel}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 6.5 Roadmap Snapshot */}
          <section className="card">
            <div className="card__head">
              <div>
                <h2 className="card__title">Roadmap Overview</h2>
                <p className="small muted">Four staged milestones guiding your coordination.</p>
              </div>
              <ButtonLink to="/portal/roadmap" variant="ghost" size="sm">
                Expand Roadmap
              </ButtonLink>
            </div>

            <div className="dash-roadmap-steps">
              {stages.map((stg) => (
                <div key={stg.def.id} className={`dash-roadmap-stage is-${stg.status}`}>
                  <div className="stage-marker">
                    {stg.status === 'completed' ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span>{stg.done}/{stg.total}</span>
                    )}
                  </div>
                  <div className="stage-text">
                    <strong>{stg.def.title}</strong>
                    <small className="muted">{stg.status === 'current' ? 'In Progress' : stg.status === 'completed' ? 'Completed' : 'Upcoming'}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Quick Actions & Notifications) */}
        <div className="dash-col-secondary">
          {/* 6.3 Upcoming Appointment */}
          <section className="card card--appt">
            <div className="card__head">
              <span className="eyebrow" style={{ marginBottom: 0 }}>Upcoming Session</span>
              <CalendarDays size={18} className="muted" />
            </div>

            {appt ? (
              <div className="dash-appt-body">
                <h3 className="dash-appt-title">{appt.title}</h3>
                <div className="dash-appt-time">
                  <Clock size={16} />
                  <span>{formatLongDate(appt.date)}</span>
                </div>
                <div className="dash-appt-meta small muted">
                  {formatTimeRange(appt.start, appt.end)} · {appt.method}
                </div>

                <div className="dash-appt-actions">
                  <ButtonLink to="/portal/schedule" size="sm" variant="primary">
                    View Details
                  </ButtonLink>
                  <ButtonLink to="/portal/schedule" size="sm" variant="secondary">
                    Reschedule
                  </ButtonLink>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCancelApptOpen(true)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="dash-no-appt">
                <p className="muted small">You currently have no upcoming sessions scheduled.</p>
                <ButtonLink to="/portal/schedule" size="sm" variant="secondary" style={{ marginTop: '12px' }}>
                  Book a Consultation Session
                </ButtonLink>
              </div>
            )}
          </section>

          {/* 6.7 Recent Message Preview */}
          <section className="card">
            <div className="card__head">
              <h2 className="card__title">Recent Message</h2>
              {unread > 0 && <StatusBadge tone="sand">{unread} New</StatusBadge>}
            </div>

            {latestMessage ? (
              <div className="dash-msg-preview">
                <div className="dash-msg-sender">
                  <div className="portal-avatar portal-avatar--sm">CT</div>
                  <div>
                    <strong>Concierge Care Team</strong>
                    <span className="small muted">Direct Coordination</span>
                  </div>
                </div>
                <blockquote className="dash-msg-quote">
                  "{latestMessage.text}"
                </blockquote>
                <ButtonLink to="/portal/messages" size="sm" variant="secondary" block icon={<MessageSquare size={14} />}>
                  Open Messages
                </ButtonLink>
              </div>
            ) : (
              <p className="small muted">No recent messages.</p>
            )}
          </section>

          {/* Financial summary / invoices */}
          <section className="card">
            <div className="card__head">
              <h2 className="card__title">Billing & Invoices</h2>
              <StatusBadge tone={balance > 0 ? 'sand' : 'sage'}>
                {balance > 0 ? `$${balance} Due` : 'Current'}
              </StatusBadge>
            </div>
            <p className="small muted">
              {balance > 0
                ? `You have $${balance} in pending invoices for coordination services.`
                : 'All current concierge packages are paid in full.'}
            </p>
            <div style={{ marginTop: '14px' }}>
              <ButtonLink to="/portal/payments" size="sm" variant="secondary" block>
                {balance > 0 ? 'Review & Pay Demo Invoice' : 'View Billing History'}
              </ButtonLink>
            </div>
          </section>

          {/* 6.6 Recent Activity Feed */}
          <section className="card">
            <div className="card__head">
              <h2 className="card__title">Activity Feed</h2>
            </div>
            <div className="dash-activity-feed">
              {state.activity.slice(0, 4).map((act) => (
                <Link key={act.id} to={act.link} className="dash-activity-item">
                  <div className="dash-activity-dot" />
                  <div className="dash-activity-text">
                    <p>{act.text}</p>
                    <time className="small muted">{new Date(act.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Appointment Cancellation Dialog */}
      <ConfirmationDialog
        open={cancelApptOpen}
        onClose={() => setCancelApptOpen(false)}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this scheduled session? Your concierge team will be notified, and you can rebook at any time."
        confirmLabel="Confirm Cancellation"
        cancelLabel="Keep Appointment"
        danger
      />
    </div>
  );
}
