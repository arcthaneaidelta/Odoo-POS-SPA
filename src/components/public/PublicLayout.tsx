import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Mail, Menu, Phone, MapPin, ArrowRight } from 'lucide-react';
import { BrandLogo, Botanical } from '../BrandLogo';
import { ButtonLink, Button } from '../ui/Button';
import { Modal, Sheet } from '../ui/Dialog';
import { BRAND } from '../../content/brand';
import { PRIVACY_TEXT, TERMS_TEXT } from '../../content/site';

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > threshold));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [threshold]);
  return scrolled;
}

export function PublicNavbar() {
  const scrolled = useScrolled();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/#approach', label: 'Our Approach', active: pathname === '/' && hash === '#approach' },
    { to: '/services', label: 'Services', active: pathname === '/services' },
    { to: '/how-it-works', label: 'How It Works', active: pathname === '/how-it-works' },
    { to: '/portal/login', label: 'Client Portal', active: false },
  ];

  return (
    <>
      <header className={`pnav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="pnav__inner">
          <Link to="/" className="pnav__brand" aria-label={`${BRAND.name} home`}>
            <BrandLogo />
          </Link>
          <nav className="pnav__links" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className={`pnav__link ${l.active ? 'is-active' : ''}`} aria-current={l.active ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="pnav__cta">
            <ButtonLink to="/contact#consultation" size="md">
              Book a Consultation
            </ButtonLink>
          </div>
          <button type="button" className="pnav__burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menu" description={BRAND.tagline}>
        <nav className="mmenu" aria-label="Mobile">
          {links.map((l) => (
            <Link key={l.label} to={l.to} className="mmenu__link" onClick={() => setOpen(false)}>
              {l.label}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
          <ButtonLink to="/contact#consultation" size="lg" block onClick={() => setOpen(false)}>
            Book a Consultation
          </ButtonLink>
        </nav>
      </Sheet>
    </>
  );
}

export function PublicFooter({ onLegal }: { onLegal: (k: 'privacy' | 'terms') => void }) {
  return (
    <footer className="pfoot">
      <Botanical className="pfoot__leaf" stroke="#D5C3A8" />
      <div className="container">
        <div className="pfoot__grid">
          <div className="pfoot__brand">
            <BrandLogo />
            <p>{BRAND.tagline}</p>
            <p className="muted small">Personalized, non-clinical care management and navigation for a more supported recovery.</p>
          </div>
          <div>
            <h2 className="pfoot__h">Services</h2>
            <ul>
              <li><Link to="/services">All services</Link></li>
              <li><Link to="/services#roadmap">Recovery roadmap</Link></li>
              <li><Link to="/services#scheduling">Scheduling coordination</Link></li>
              <li><Link to="/services#documents">Document organization</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="pfoot__h">Explore</h2>
            <ul>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/contact#consultation">Book a consultation</Link></li>
              <li><Link to="/portal/login">Client Portal</Link></li>
              <li><Link to="/admin">Operations demo</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="pfoot__h">Contact (demo details)</h2>
            <ul className="pfoot__contact">
              <li><Mail size={15} aria-hidden="true" /><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
              <li><Phone size={15} aria-hidden="true" /><a href={`tel:${BRAND.phoneHref}`}>{BRAND.phone}</a></li>
              <li><MapPin size={15} aria-hidden="true" /><span>{BRAND.address}</span></li>
            </ul>
          </div>
        </div>
        <p className="pfoot__disclaimer">{BRAND.disclaimer}</p>
        <div className="pfoot__bottom">
          <p>© {new Date().getFullYear()} {BRAND.name}. Demonstration only.</p>
          <div className="row">
            <button type="button" className="link-btn" onClick={() => onLegal('privacy')}>Privacy Notice</button>
            <span aria-hidden="true" className="muted">·</span>
            <button type="button" className="link-btn" onClick={() => onLegal('terms')}>Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout() {
  const { pathname } = useLocation();
  const [legal, setLegal] = useState<null | 'privacy' | 'terms'>(null);
  const doc = legal === 'privacy' ? PRIVACY_TEXT : TERMS_TEXT;

  return (
    <div className="public">
      <PublicNavbar />
      <main id="main" key={pathname} className="page-enter">
        <Outlet />
      </main>
      <PublicFooter onLegal={setLegal} />
      <Modal
        open={legal !== null}
        onClose={() => setLegal(null)}
        title={legal === 'privacy' ? 'Privacy Notice (sample)' : 'Terms of Service (sample)'}
        description="Placeholder text for demonstration. Not reviewed or approved by legal counsel."
        footer={<Button onClick={() => setLegal(null)}>Close</Button>}
      >
        <div className="stack">
          {doc.map((s) => (
            <div key={s.heading}>
              <h3 style={{ fontSize: 16 }}>{s.heading}</h3>
              <p className="muted" style={{ marginTop: 4 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

