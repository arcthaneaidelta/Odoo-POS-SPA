import { useEffect, useState } from 'react';
import { ArrowRight, CalendarCheck, CircleCheck, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botanical } from '../components/BrandLogo';
import { Button, ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Interactive';
import { SERVICE_ICONS, ServiceDrawer } from '../components/public/Services';
import { SelectField, TextAreaField, TextField } from '../components/ui/Fields';
import { BRAND } from '../content/brand';
import { JOURNEY, SERVICES, type ServiceDef } from '../content/site';

function useTitle(t: string) {
  useEffect(() => {
    document.title = `${t} — Havenwell Concierge`;
  }, [t]);
}

function SubHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="subhero">
      <Botanical className="hero__leaf hero__leaf--c" stroke="#D5C3A8" />
      <div className="container" style={{ position: 'relative' }}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display">{title}</h1>
        <p className="section__lead">{lead}</p>
      </div>
    </section>
  );
}

export function ServicesPage() {
  useTitle('Services');
  const [active, setActive] = useState<ServiceDef | null>(null);
  return (
    <>
      <SubHero
        eyebrow="Services"
        title="Support that fits around your life."
        lead="Every service is non-clinical and focused on coordination, organization, and navigation. Here is what working together can include."
      />
      <section className="container" aria-label="Service details">
        {SERVICES.map((s) => {
          const Icon = SERVICE_ICONS[s.icon];
          return (
            <Reveal key={s.id}>
              <article className="svc-detail" id={s.id}>
                <div>
                  <span className="svc-icon"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span>
                  <h2>{s.title}</h2>
                </div>
                <div>
                  <p className="section__lead" style={{ marginTop: 0 }}>{s.long}</p>
                  <ul className="ticks" style={{ marginTop: 16 }}>
                    {s.includes.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  <button type="button" className="link-btn" style={{ marginTop: 16 }} onClick={() => setActive(s)}>
                    Learn More <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </article>
            </Reveal>
          );
        })}
        <div className="callout not-clinical">
          Havenwell is a non-clinical service. It does not provide medical advice, diagnosis, or treatment, and it does not guarantee any outcome.
        </div>
        <div className="center" style={{ paddingBottom: 96 }}>
          <ButtonLink to="/contact#consultation" size="lg">Begin With a Conversation</ButtonLink>
        </div>
      </section>
      <ServiceDrawer service={active} onClose={() => setActive(null)} />
    </>
  );
}

const WHAT_YOU_DO = [
  ['Share your goals and what feels most pressing.', 'Ask any questions you have about how this works.'],
  ['Complete a few short forms at your own pace.', 'Review the sample service arrangement.'],
  ['Review priorities and your roadmap with your concierge.', 'Add or adjust tasks as things change.'],
  ['Check your portal when it suits you.', 'Message the team for non-urgent questions.'],
];
const WHAT_WE_DO = [
  ['Listen first and summarize what we heard.', 'Suggest a clear next step.'],
  ['Organize your preferences and documents.', 'Explain each agreement in plain language.'],
  ['Turn priorities into a staged, readable plan.', 'Link tasks to forms, documents, and appointments.'],
  ['Keep your roadmap and tasks current.', 'Coordinate scheduling and follow-ups.'],
];

export function HowItWorksPage() {
  useTitle('How It Works');
  return (
    <>
      <SubHero eyebrow="How it works" title="A clear journey, from first conversation onward." lead="Four steady steps. You always know what is happening, what is next, and where to find help." />
      <section className="container journey-long" aria-label="Client journey">
        {JOURNEY.map((j, i) => (
          <Reveal key={j.n}>
            <div className="jl">
              <span className="jl__n">{j.n}</span>
              <div>
                <h2>{j.title}</h2>
                <p className="section__lead" style={{ marginTop: 8 }}>{j.body}</p>
                <div className="jl__cols">
                  <div>
                    <h3>What you do</h3>
                    <ul className="ticks">{WHAT_YOU_DO[i].map((t) => <li key={t}>{t}</li>)}</ul>
                  </div>
                  <div>
                    <h3>What we do</h3>
                    <ul className="ticks">{WHAT_WE_DO[i].map((t) => <li key={t}>{t}</li>)}</ul>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
        <div className="center" style={{ paddingBottom: 96, gap: 12, flexWrap: 'wrap' }}>
          <ButtonLink to="/contact#consultation" size="lg">Book an Introductory Consultation</ButtonLink>
          <ButtonLink to="/portal/login" size="lg" variant="secondary">Explore the Client Portal</ButtonLink>
        </div>
      </section>
    </>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactPage() {
  useTitle('Contact');
  const [form, setForm] = useState({ name: '', email: '', phone: '', time: '', topic: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = 'Please tell us your name.';
    if (!form.email.trim()) err.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(form.email.trim())) err.email = 'That email address doesn’t look quite right.';
    if (!form.time) err.time = 'Choose a time of day that suits you.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setDone(true);
    }, 900);
  };

  return (
    <>
      <SubHero eyebrow="Contact" title="Let’s start with a conversation." lead="Tell us a little about what would be helpful. There is no obligation, and no medical details are needed." />
      <div className="container contact-grid">
        <section className="card contact-card" id="consultation" aria-labelledby="consult-title" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
          {done ? (
            <div className="success" role="status">
              <div className="success__mark"><CalendarCheck size={28} aria-hidden="true" /></div>
              <h2>Thank you, {form.name.split(' ')[0] || 'friend'}.</h2>
              <p>
                In a real deployment, your request would reach the concierge team. In this demo nothing was sent anywhere — your entries stay in this browser tab only.
              </p>
              <div className="row" style={{ justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <Button variant="secondary" onClick={() => { setDone(false); setForm({ name: '', email: '', phone: '', time: '', topic: '', message: '' }); }}>Send another request</Button>
                <ButtonLink to="/portal/login">Explore the Client Portal</ButtonLink>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 id="consult-title" className="display" style={{ fontSize: 36, marginBottom: 6 }}>Book an introductory consultation</h2>
              <p className="muted" style={{ marginBottom: 28 }}>A relaxed 30-minute conversation. Demo form — nothing is sent.</p>
              <div className="form-grid">
                <TextField label="Your name" required value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" placeholder="Full name" />
                <TextField label="Email address" required type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" placeholder="name@example.com" />
                <TextField label="Phone (optional)" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="(555) 010-0100" />
                <SelectField label="Best time of day" required value={form.time} onChange={set('time')} error={errors.time} options={['Mornings', 'Midday', 'Afternoons', 'Evenings']} />
                <div className="full">
                  <SelectField label="What would you like to talk about?" value={form.topic} onChange={set('topic')} options={['Understanding how the service works', 'Organizing appointments and tasks', 'Keeping documents together', 'Something else']} />
                </div>
                <div className="full">
                  <TextAreaField label="Anything you would like us to know?" value={form.message} onChange={set('message')} help="Please keep this non-sensitive. Do not share medical details." />
                </div>
              </div>
              <div style={{ marginTop: 28 }}>
                <Button type="submit" size="lg" loading={sending} iconAfter={<ArrowRight size={18} />}>Request a Consultation</Button>
              </div>
            </form>
          )}
        </section>
        <aside className="card card--sage" aria-label="Contact details">
          <h2 className="display" style={{ fontSize: 30 }}>Prefer to reach out?</h2>
          <p className="muted" style={{ marginTop: 6, color: '#465247' }}>Fictional demo details, shown for layout only.</p>
          <ul className="info-list" style={{ marginTop: 16 }}>
            <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
            <li><Phone size={18} aria-hidden="true" /><a href={`tel:${BRAND.phoneHref}`}>{BRAND.phone}</a></li>
            <li><MapPin size={18} aria-hidden="true" /><span>{BRAND.address}</span></li>
            <li><CircleCheck size={18} aria-hidden="true" /><span>Non-clinical service. Not for emergencies or urgent medical needs.</span></li>
          </ul>
          <p style={{ marginTop: 16, fontSize: 14 }}>
            Curious what it feels like to be a client? <Link to="/portal/login" className="link-btn">Explore the portal</Link>
          </p>
        </aside>
      </div>
    </>
  );
}

export function NotFoundPage() {
  useTitle('Page not found');
  return (
    <div className="notfound">
      <h1 className="display">This page wandered off.</h1>
      <p className="muted">The page you were looking for doesn’t exist in this demo. Let’s get you back on a familiar path.</p>
      <div className="row" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <ButtonLink to="/">Back to the home page</ButtonLink>
        <ButtonLink to="/portal/dashboard" variant="secondary">Open the client portal</ButtonLink>
      </div>
    </div>
  );
}
