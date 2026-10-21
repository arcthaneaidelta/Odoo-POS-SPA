import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Button } from '../common/Button';
import { useDemo } from '../../context/DemoContext';
import { Menu, X, ArrowRight, Play, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { navigate } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Platform Features', href: '#features' },
    { label: 'Automated Workflows', href: '#workflows' },
    { label: 'Execution Simulator', href: '#simulator' },
    { label: 'Yield ROI', href: '#roi' },
    { label: 'Pricing Plans', href: '#pricing' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #E2E8F0',
        transition: 'all 200ms ease',
      }}
    >
      <div
        className="container-marketing"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Brand Logo */}
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <BrandLogo size="md" showBadge />
        </div>

        {/* Desktop Nav Items */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#475569',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0D4E43')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.85rem',
          }}
          className="desktop-actions"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/simulator')}
            iconLeft={<Play size={14} color="#10B981" />}
          >
            Live Simulator
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard')}
            iconRight={<ArrowRight size={15} />}
          >
            Launch Prototype
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            color: '#0F172A',
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#334155',
                padding: '0.4rem 0',
              }}
            >
              {link.label}
            </a>
          ))}
          <div
            style={{
              paddingTop: '0.75rem',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/simulator');
              }}
              iconLeft={<Play size={14} color="#10B981" />}
            >
              Live Simulator
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              iconRight={<ArrowRight size={15} />}
            >
              Launch Prototype
            </Button>
          </div>
        </div>
      )}

      {/* Inline style hook for media query */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
