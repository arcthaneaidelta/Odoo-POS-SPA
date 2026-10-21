import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, Compass, Layers, ListChecks, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink, Button } from '../components/ui/Button';
import { Accordion, Reveal } from '../components/ui/Interactive';
import { Botanical } from '../components/BrandLogo';
import { ServiceDrawer, SERVICE_ICONS } from '../components/public/Services';
import { PortalPreview } from '../components/public/PortalPreview';
import { useEnterPortal } from '../components/Transitions';
import { FAQS, JOURNEY, SERVICES, type ServiceDef } from '../content/site';
import { formatLongDate, nextWeekday, toISODate } from '../lib/dates';

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setInView(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return [ref, inView] as const;
}

function Hero() {
  const enter = useEnterPortal();
  const [ref, inView] = useInView<HTMLElement>();
  const sampleDate = formatLongDate(toISODate(nextWeekday(new Date(), 5, 4)));
  return (
    <section ref={ref} className={`hero ${inView ? '' : 'is-paused'}`} aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__sun" />
        <Botanical className="hero__leaf hero__leaf--a" />
        <Botanical className="hero__leaf hero__leaf--b" />
        <Botanical className="hero__leaf hero__leaf--c" stroke="#D5C3A8" />
        <div className="hero__grain" />
      </div>
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__rise" style={{ animationDelay: '60ms' }}>Private Concierge Recovery Care</p>
          <h1 id="hero-title" className="display hero__title hero__rise" style={{ animationDelay: '140ms' }}>
            A more <em>supported path</em> through life&rsquo;s transitions.
          </h1>
          <p className="hero__lead hero__rise" style={{ animationDelay: '240ms' }}>
            Personalized, non-clinical care management and navigation designed to bring clarity, coordination, and thoughtful support to the recovery journey.
          </p>
          <div className="hero__ctas hero__rise" style={{ animationDelay: '340ms' }}>
            <ButtonLink to="/contact#consultation" size="lg" iconAfter={<ArrowRight size={18} />}>
              Begin With a Conversation
            </ButtonLink>
            <Button variant="secondary" size="lg" onClick={() => enter('client')}>
              Explore the Client Experience
            </Button>
          </div>
          <p className="hero__trust hero__rise" style={{ animationDelay: '440ms' }}>
            Personalized guidance. Thoughtful coordination. Care that meets you where you are.
          </p>
        </div>

        <div className="hero__visual">
          <div className="hero__ring" aria-hidden="true" />
          <div className="hero__frame">
            <img src="/images/hero-interior.jpg" width={860} height={1147} alt="A quiet, sunlit corner with a linen armchair, a cup of tea, and a sprig of eucalyptus." fetchPriority="high" decoding="async" />
          </div>
          <div className="float-card float-card--appt">
            <span className="float-card__icon"><CalendarDays size={18} aria-hidden="true" /></span>
            <div>
              <p className="float-card__label">Sample upcoming consultation</p>
              <p className="float-card__title">Introductory planning session</p>
              <p className="float-card__meta">{sampleDate} · 10:30 AM</p>
            </div>
          </div>
          <div className="float-card float-card--note">
            <Quote size={16} aria-hidden="true" />
            <p>&ldquo;Your next steps are ready when you are.&rdquo;</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: Compass, title: 'Personalized Guidance', body: 'Support shaped around your priorities, not a standard script.' },
    { icon: Layers, title: 'Thoughtful Coordination', body: 'Appointments, documents, and tasks kept in step with each other.' },
    { icon: ListChecks, title: 'Clear Next Steps', body: 'Always know what comes next and who to ask.' },
  ];
  return (
    <section className="trust" aria-label="Our principles">
      <div className="container trust__grid">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 90}>
            <div className="trust__item">
              <it.icon size={26} strokeWidth={1.4} aria-hidden="true" />
              <div>
                <h2>{it.title}</h2>
                <p>{it.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Approach() {
  const cards = [
    { title: 'Personalized Navigation', body: 'A clearer view of priorities, next steps, and available resources.', img: '/images/approach-navigation.jpg', alt: 'An open planning notebook with a pen and an olive sprig on linen.' },
    { title: 'Coordinated Planning', body: 'Appointments, tasks, documents, and agreed next steps in one organized place.', img: '/images/approach-coordination.jpg', alt: 'A tidy desk by a bright window with folders and a small fern.' },
    { title: 'Ongoing Guidance', body: 'A consistent point of contact for non-clinical coordination and administrative support.', img: '', alt: '' },
  ];
  return (
    <section className="section" id="approach" aria-labelledby="approach-title">
      <div className="container">
        <Reveal>
          <div className="section__head">
            <p className="eyebrow">Our approach</p>
            <h2 id="approach-title" className="display section__title">Support that brings the pieces together.</h2>
            <p className="section__lead">
              Recovery can involve more than a single appointment or service. Havenwell helps clients navigate the practical details, coordinate next steps, and stay organized throughout their individual journey.
            </p>
          </div>
        </Reveal>
        <div className="approach">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <article className="acard">
                <div className="acard__media">
                  {c.img ? (
                    <img src={c.img} alt={c.alt} loading="lazy" decoding="async" width={900} height={672} />
                  ) : (
                    <div className="acard__art" aria-hidden="true">
                      <Botanical stroke="#879B88" />
                    </div>
                  )}
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const [active, setActive] = useState<ServiceDef | null>(null);
  return (
    <section className="section section--white" id="services" aria-labelledby="services-title">
      <div className="container">
        <Reveal>
          <div className="section__head section__head--split">
            <div>
              <p className="eyebrow">Services</p>
              <h2 id="services-title" className="display section__title">Practical help, thoughtfully delivered.</h2>
            </div>
            <p className="section__lead">Non-clinical coordination and navigation, organized around what matters to you.</p>
          </div>
        </Reveal>
        <div className="svc-grid">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            return (
              <Reveal key={s.id} delay={(i % 3) * 80}>
                <article className="svc">
                  <span className="svc-icon"><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></span>
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                  <button type="button" className="link-btn" onClick={() => setActive(s)} aria-label={`Learn more about ${s.title}`}>
                    Learn More <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
      <ServiceDrawer service={active} onClose={() => setActive(null)} />
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section" id="how-it-works" aria-labelledby="how-title">
      <div className="container">
        <Reveal>
          <div className="section__head">
            <p className="eyebrow">How it works</p>
            <h2 id="how-title" className="display section__title">Four steady steps, at your pace.</h2>
          </div>
        </Reveal>
        <ol className="journey">
          {JOURNEY.map((j, i) => (
            <li key={j.n}>
              <Reveal delay={i * 110}>
                <div className="journey__step">
                  <span className="journey__n">{j.n}</span>
                  <span className="journey__dot" aria-hidden="true" />
                  <h3>{j.title}</h3>
                  <p>{j.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="center">
          <ButtonLink variant="secondary" to="/how-it-works" iconAfter={<ArrowRight size={16} />}>
            See the full client journey
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function PreviewSection() {
  const enter = useEnterPortal();
  return (
    <section className="section section--sand" id="portal" aria-labelledby="portal-title">
      <div className="container preview">
        <Reveal>
          <div className="preview__copy">
            <p className="eyebrow">Client portal</p>
            <h2 id="portal-title" className="display section__title">Everything in one calm, organized place.</h2>
            <p className="section__lead">
              Onboarding, agreements, payments, scheduling, messages, your roadmap, and documents — shown here as a live, interactive preview you can step inside.
            </p>
            <div style={{ marginTop: 28 }}>
              <Button size="lg" onClick={() => enter('client')} iconAfter={<ArrowRight size={18} />}>
                Explore the Client Portal
              </Button>
            </div>
            <p className="muted small" style={{ marginTop: 14 }}>Demo only. All names, dates, and amounts are fictional.</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <PortalPreview onOpen={() => enter('client')} />
        </Reveal>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container faq">
        <Reveal>
          <div>
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="display section__title">Good questions, plainly answered.</h2>
            <p className="section__lead">If something isn&rsquo;t covered here, we&rsquo;re glad to talk it through.</p>
            <div style={{ marginTop: 24 }}>
              <Link to="/contact" className="link-btn">Get in touch <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Accordion items={FAQS.map((f) => ({ q: f.q, a: f.a }))} />
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <Botanical className="cta__leaf cta__leaf--l" />
      <Botanical className="cta__leaf cta__leaf--r" />
      <div className="container">
        <Reveal>
          <div className="cta__inner">
            <h2 id="cta-title" className="display">You don&rsquo;t have to organize every next step alone.</h2>
            <p>Let&rsquo;s start with a conversation about the support and coordination that would be most useful to you.</p>
            <div className="cta__actions">
              <ButtonLink to="/contact#consultation" size="lg">Book an Introductory Consultation</ButtonLink>
              <Link to="/contact" className="link-btn">Questions? Get in Touch <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Landing() {
  useEffect(() => {
    document.title = 'Havenwell Concierge — Thoughtful guidance. A more supported recovery.';
  }, []);
  return (
    <>
      <Hero />
      <TrustStrip />
      <Approach />
      <ServicesSection />
      <HowItWorks />
      <PreviewSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
