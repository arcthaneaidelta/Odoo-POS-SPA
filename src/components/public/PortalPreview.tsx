import { CalendarDays, Check, FileText, MessageSquare } from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import { getStages, nextAppointment, onboardingProgress, openTasks } from '../../state/selectors';
import { formatLongDate, formatTimeRange, greeting } from '../../lib/dates';
import { Emblem } from '../BrandLogo';
import { ProgressRing } from '../ui/Feedback';

/** A real, rendered miniature of the client dashboard (not a screenshot). Reads from the same demo state. */
export function PortalPreview({ onOpen }: { onOpen: () => void }) {
  const { state } = useDemo();
  const progress = onboardingProgress(state);
  const appt = nextAppointment(state);
  const tasks = openTasks(state).slice(0, 3);
  const stages = getStages(state);
  const conv = state.conversations[0];
  const last = conv.messages[conv.messages.length - 1];
  const doc = state.documents.find((d) => d.id === 'doc-checklist') ?? state.documents[0];

  return (
    <div className="pp" onClick={onOpen} aria-hidden="true">
      <div className="pp__chrome">
        <span /><span /><span />
        <div className="pp__url">havenwell.demo/portal/dashboard</div>
      </div>
      <div className="pp__body">
        <div className="pp__side">
          <Emblem size={26} />
          {['Dashboard', 'Onboarding', 'Forms', 'Agreements', 'Payments', 'Schedule', 'Messages', 'Roadmap'].map((l, i) => (
            <div key={l} className={`pp__nav ${i === 0 ? 'is-active' : ''}`}>{l}</div>
          ))}
        </div>
        <div className="pp__main">
          <div className="pp__welcome">
            <p className="display pp__hello">{greeting()}, {state.profile.firstName}.</p>
            <p>Your next steps, all in one place.</p>
          </div>
          <div className="pp__grid">
            <div className="pp__card pp__progress">
              <ProgressRing value={progress} size={78} stroke={7} label="Onboarding progress" />
              <div>
                <strong>Your onboarding is underway</strong>
                <span>{tasks.length ? `${tasks.length} next steps ready` : 'All steps complete'}</span>
              </div>
            </div>
            <div className="pp__card pp__appt">
              <CalendarDays size={16} />
              <div>
                <strong>{appt ? appt.title : 'No upcoming appointment'}</strong>
                {appt && <span>{formatLongDate(appt.date)} · {formatTimeRange(appt.start, appt.end)}</span>}
              </div>
            </div>
            <div className="pp__card pp__tasks">
              <strong>Next steps</strong>
              {tasks.map((t) => (
                <div key={t.id} className="pp__task"><i /> {t.title}</div>
              ))}
            </div>
            <div className="pp__card pp__road">
              <strong>Roadmap</strong>
              <div className="pp__steps">
                {stages.map((s) => (
                  <div key={s.def.id} className={`pp__step is-${s.status}`}>
                    <b>{s.status === 'completed' ? <Check size={10} strokeWidth={3} /> : null}</b>
                    <span>{s.def.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pp__card pp__msg">
              <MessageSquare size={15} />
              <div>
                <strong>{conv.title}</strong>
                <span>{last.text.slice(0, 74)}…</span>
              </div>
            </div>
            <div className="pp__card pp__doc">
              <FileText size={15} />
              <div>
                <strong>{doc.title}</strong>
                <span>PDF · Planning Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
