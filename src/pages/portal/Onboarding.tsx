import { useState } from 'react';
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useDemo } from '../../state/DemoProvider';
import { Button, ButtonLink } from '../../components/ui/Button';
import { TextField, SelectField, TextAreaField, RadioCards, CheckboxField } from '../../components/ui/Fields';
import { Stepper } from '../../components/ui/Fields';
import { TIMEZONE_OPTIONS, CONTACT_TIME_OPTIONS } from '../../content/forms';
import { useToast } from '../../components/ui/Toast';

const STEPS = [
  'Welcome',
  'About You',
  'Preferences',
  'Intake Review',
  'Service Agreement',
  'Confirmation'
];

export default function Onboarding() {
  const { state, dispatch } = useDemo();
  const { toast } = useToast();

  const [step, setStep] = useState(state.onboarding.step || 0);

  // Step 2 Form State
  const [about, setAbout] = useState({
    preferredName: state.onboarding.about.preferredName || state.profile.name,
    email: state.onboarding.about.email || state.profile.email,
    phone: state.onboarding.about.phone || '(555) 010-0100',
    method: state.onboarding.about.method || 'Portal message',
    contactTime: state.onboarding.about.contactTime || 'Mornings',
    timezone: state.onboarding.about.timezone || 'Pacific Time (PT)',
    supportNotes: state.onboarding.about.supportNotes || ''
  });

  // Step 3 Preferences State
  const [prefs, setPrefs] = useState({
    channel: state.onboarding.prefs.channel || 'Portal message',
    window: state.onboarding.prefs.window || 'Mornings',
    notes: state.onboarding.prefs.notes || 'Please keep messages concise and coordinated in the portal.'
  });

  // Step 5 Agreement Checkbox
  const [agreementChecked, setAgreementChecked] = useState(state.onboarding.agreementChecked || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nextStep = () => {
    if (step === 1) {
      const errs: Record<string, string> = {};
      if (!about.preferredName.trim()) errs.preferredName = 'Please enter your preferred name.';
      if (!about.email.trim()) errs.email = 'Please provide your email address.';
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      dispatch({ type: 'ONBOARDING_PATCH', patch: { about } });
    }

    if (step === 2) {
      dispatch({ type: 'ONBOARDING_PATCH', patch: { prefs } });
    }

    if (step === 4) {
      if (!agreementChecked) {
        setErrors({ agreement: 'Please acknowledge the sample agreement before proceeding.' });
        return;
      }
      dispatch({ type: 'ONBOARDING_PATCH', patch: { agreementChecked: true } });
      dispatch({ type: 'ONBOARDING_COMPLETE' });
      toast({ tone: 'success', title: 'Onboarding Complete', message: 'Your client space is fully personalized.' });
    }

    setErrors({});
    const n = Math.min(STEPS.length - 1, step + 1);
    setStep(n);
  };

  const prevStep = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="onboarding-page">
      <header className="onboarding-header">
        <p className="eyebrow">Interactive Client Onboarding</p>
        <h1 className="display" style={{ fontSize: '36px' }}>Let's get your client space ready.</h1>
        <p className="page-desc">
          A few simple steps will help us organize your preferences, communication channels, and next steps.
        </p>
      </header>

      {/* Stepper Navigation */}
      <div className="onboarding-stepper card" style={{ padding: '20px 24px', marginBottom: '28px' }}>
        <Stepper steps={STEPS} current={step} onStep={(s) => setStep(s)} />
      </div>

      {/* Step Content */}
      <div className="card onboarding-card">
        {/* STEP 1: Welcome */}
        {step === 0 && (
          <div className="onboarding-step-body">
            <div className="step-icon-wrap" aria-hidden="true">
              <HeartHandshake size={36} />
            </div>
            <h2 className="display" style={{ fontSize: '28px', marginTop: '12px' }}>Welcome to Havenwell Concierge</h2>
            <p className="muted" style={{ maxWidth: '58ch', margin: '12px auto 24px' }}>
              We are honored to support your path. In this brief onboarding, we will gather how you like to communicate, who your key contacts are, and ensure your private roadmap is tailored specifically to you.
            </p>
            <div className="callout callout--privacy" style={{ maxWidth: '54ch', margin: '0 auto 28px' }}>
              <ShieldCheck size={20} />
              <span>
                <strong>Your privacy matters:</strong> All details in this prototype are simulated locally in your browser. No medical histories or real records are collected.
              </span>
            </div>
            <Button size="lg" onClick={nextStep} iconAfter={<ArrowRight size={18} />}>
              Get Started
            </Button>
          </div>
        )}

        {/* STEP 2: About You */}
        {step === 1 && (
          <div className="onboarding-step-form">
            <h2 className="display" style={{ fontSize: '26px', marginBottom: '8px' }}>About You</h2>
            <p className="small muted" style={{ marginBottom: '24px' }}>
              Basic contact coordinates for your dedicated care coordinator.
            </p>

            <div className="form-grid">
              <TextField
                label="Preferred Name"
                required
                value={about.preferredName}
                onChange={(v) => setAbout({ ...about, preferredName: v })}
                error={errors.preferredName}
                placeholder="What should we call you?"
              />
              <TextField
                label="Email Address"
                required
                type="email"
                value={about.email}
                onChange={(v) => setAbout({ ...about, email: v })}
                error={errors.email}
                placeholder="name@example.com"
              />
              <TextField
                label="Phone Number"
                type="tel"
                value={about.phone}
                onChange={(v) => setAbout({ ...about, phone: v })}
                placeholder="(555) 000-0000"
              />
              <SelectField
                label="Time Zone"
                required
                value={about.timezone}
                onChange={(v) => setAbout({ ...about, timezone: v })}
                options={TIMEZONE_OPTIONS}
              />
              <div className="full">
                <TextAreaField
                  label="General support notes"
                  value={about.supportNotes}
                  onChange={(v) => setAbout({ ...about, supportNotes: v })}
                  placeholder="Any logistical or scheduling routines we should keep in mind?"
                  help="Please keep notes non-sensitive. Avoid entering medical diagnostics."
                />
              </div>
            </div>

            <div className="onboarding-actions row row--between" style={{ marginTop: '32px' }}>
              <Button variant="ghost" onClick={prevStep} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button onClick={nextStep} iconAfter={<ArrowRight size={16} />}>
                Continue to Preferences
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Preferences */}
        {step === 2 && (
          <div className="onboarding-step-form">
            <h2 className="display" style={{ fontSize: '26px', marginBottom: '8px' }}>Communication Preferences</h2>
            <p className="small muted" style={{ marginBottom: '24px' }}>
              Choose how and when you prefer your concierge team to coordinate with you.
            </p>

            <div className="stack" style={{ gap: '20px' }}>
              <RadioCards
                legend="Preferred Communication Channel"
                required
                options={['Portal message', 'Phone', 'Email']}
                value={prefs.channel}
                onChange={(v) => setPrefs({ ...prefs, channel: v })}
                descriptions={{
                  'Portal message': 'Direct, secure communication through your private Havenwell portal inbox.',
                  'Phone': 'Voice check-ins and phone calls during scheduled coordination windows.',
                  'Email': 'Written updates and appointment confirmations sent to your inbox.'
                }}
              />

              <SelectField
                label="Preferred Contact Window"
                required
                value={prefs.window}
                onChange={(v) => setPrefs({ ...prefs, window: v })}
                options={CONTACT_TIME_OPTIONS}
              />

              <TextAreaField
                label="Coordination Notes"
                value={prefs.notes}
                onChange={(v) => setPrefs({ ...prefs, notes: v })}
                placeholder="For example: Prefer portal notifications over text messages; mornings are quietest."
              />
            </div>

            <div className="onboarding-actions row row--between" style={{ marginTop: '32px' }}>
              <Button variant="ghost" onClick={prevStep} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button onClick={nextStep} iconAfter={<ArrowRight size={16} />}>
                Review Intake
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Intake Review */}
        {step === 3 && (
          <div className="onboarding-step-form">
            <h2 className="display" style={{ fontSize: '26px', marginBottom: '8px' }}>Review Your Information</h2>
            <p className="small muted" style={{ marginBottom: '24px' }}>
              Please confirm your details before reviewing the sample service agreement.
            </p>

            <div className="review-cards-grid">
              <div className="review-card">
                <div className="review-card-head row row--between">
                  <strong>Personal Information</strong>
                  <button type="button" className="link-btn small" onClick={() => setStep(1)}>
                    Edit
                  </button>
                </div>
                <ul className="review-list">
                  <li><span className="muted">Preferred Name:</span> {about.preferredName}</li>
                  <li><span className="muted">Email:</span> {about.email}</li>
                  <li><span className="muted">Phone:</span> {about.phone || 'Not provided'}</li>
                  <li><span className="muted">Time Zone:</span> {about.timezone}</li>
                </ul>
              </div>

              <div className="review-card">
                <div className="review-card-head row row--between">
                  <strong>Coordination Preferences</strong>
                  <button type="button" className="link-btn small" onClick={() => setStep(2)}>
                    Edit
                  </button>
                </div>
                <ul className="review-list">
                  <li><span className="muted">Preferred Channel:</span> {prefs.channel}</li>
                  <li><span className="muted">Contact Window:</span> {prefs.window}</li>
                  <li><span className="muted">Notes:</span> {prefs.notes || 'None'}</li>
                </ul>
              </div>
            </div>

            <div className="onboarding-actions row row--between" style={{ marginTop: '32px' }}>
              <Button variant="ghost" onClick={prevStep} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button onClick={nextStep} iconAfter={<ArrowRight size={16} />}>
                Proceed to Service Agreement
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Service Agreement */}
        {step === 4 && (
          <div className="onboarding-step-form">
            <h2 className="display" style={{ fontSize: '26px', marginBottom: '8px' }}>Service Agreement Review</h2>
            <p className="small muted" style={{ marginBottom: '20px' }}>
              Review the terms of our non-clinical concierge care management service.
            </p>

            <div className="agreement-scroll-box">
              <h3>Concierge Care Management & Navigation Agreement (Demo)</h3>
              <p>
                <strong>1. Non-Clinical Scope:</strong> Havenwell Concierge provides non-clinical coordination, scheduling logistics, document organization, and resource navigation. Our team does not provide medical advice, diagnosis, treatment, or crisis intervention.
              </p>
              <p>
                <strong>2. Client Collaboration:</strong> The client agrees to provide accurate non-clinical preferences and promptly notify the concierge of any changes to scheduled appointments or contact details.
              </p>
              <p>
                <strong>3. Cancellation & Rescheduling:</strong> Sessions may be rescheduled or cancelled through the client portal with reasonable notice.
              </p>
              <p>
                <strong>4. Demonstration Disclaimer:</strong> This portal is a demonstration prototype. All forms, invoices, and documents are local simulations.
              </p>
            </div>

            <div style={{ marginTop: '20px' }}>
              <CheckboxField
                label={
                  <span>
                    I acknowledge that I have reviewed the sample Concierge Care Management Agreement and understand the non-clinical nature of the service.
                  </span>
                }
                checked={agreementChecked}
                onChange={setAgreementChecked}
                error={errors.agreement}
              />
            </div>

            <div className="onboarding-actions row row--between" style={{ marginTop: '32px' }}>
              <Button variant="ghost" onClick={prevStep} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button onClick={nextStep} iconAfter={<ArrowRight size={16} />}>
                Complete Onboarding
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: Confirmation */}
        {step === 5 && (
          <div className="onboarding-step-body">
            <div className="success__mark" aria-hidden="true">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="display" style={{ fontSize: '32px' }}>Your onboarding steps are complete!</h2>
            <p className="muted" style={{ maxWidth: '52ch', margin: '12px auto 24px' }}>
              Everything has been organized. Your preferences are saved, the sample agreement is acknowledged, and your personalized recovery roadmap is ready.
            </p>

            <div className="row" style={{ justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <ButtonLink to="/portal/dashboard" size="lg">
                Go to My Dashboard
              </ButtonLink>
              <ButtonLink to="/portal/roadmap" variant="secondary" size="lg">
                Inspect My Roadmap
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
