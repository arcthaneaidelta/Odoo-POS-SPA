import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Globe,
  Coins,
  CheckCircle,
  AlertTriangle,
  User,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OperationsHeaderProps {
  onOpenMobileMenu: () => void;
}

export const OperationsHeader: React.FC<OperationsHeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    t,
    settings,
    setLanguage,
    displayCurrency,
    setDisplayCurrency,
    guests,
    orders,
    folioPostings,
    activityFeed,
    formatPrice
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items for global search
  const filteredGuests = searchQuery.trim()
    ? guests.filter(
        g =>
          g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.roomNumber.includes(searchQuery) ||
          g.reservationRef.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredOrders = searchQuery.trim()
    ? orders.filter(
        o =>
          o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.guestName && o.guestName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredFolios = searchQuery.trim()
    ? folioPostings.filter(
        f =>
          f.postingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.roomNumber.includes(searchQuery)
      )
    : [];

  const hasResults =
    filteredGuests.length > 0 || filteredOrders.length > 0 || filteredFolios.length > 0;

  // Breadcrumb mapping
  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path === '/app') return t('overviewTitle');
    if (path === '/app/pos') return t('posTitle');
    if (path === '/app/restaurant') return t('floorPlanTitle');
    if (path === '/app/spa') return t('spaTitle');
    if (path === '/app/guests') return t('menuGuests');
    if (path === '/app/folios') return t('foliosTitle');
    if (path === '/app/payments') return t('paymentsTitle');
    if (path === '/app/invoicing') return t('invoicingTitle');
    if (path === '/app/reports') return t('menuReports');
    if (path === '/app/settings') return t('menuSettings');
    return 'Resort Operations';
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button
          onClick={onOpenMobileMenu}
          className="btn-icon"
          style={{ display: 'flex', alignItems: 'center' }}
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>CASA MAREA</span>
            <span>/</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Ops</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.0625rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.2
            }}
          >
            {getBreadcrumbTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Global Search */}
      <div ref={searchRef} style={{ position: 'relative', width: '320px', maxWidth: '100%', margin: '0 var(--space-4)' }} className="search-box-desktop">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search
            size={16}
            color="var(--text-secondary)"
            style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder={settings.language === 'es' ? 'Buscar huésped, habitación, folio u orden...' : 'Search guest, room, folio or order...'}
            style={{
              width: '100%',
              paddingLeft: '36px',
              paddingRight: '12px',
              paddingTop: '7px',
              paddingBottom: '7px',
              fontSize: '0.8125rem',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>

        {/* Global Search Results Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '380px',
              overflowY: 'auto',
              zIndex: 100,
              padding: '8px'
            }}
          >
            {!hasResults ? (
              <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {settings.language === 'es' ? 'No se encontraron resultados.' : 'No matching records found.'}
              </div>
            ) : (
              <>
                {filteredGuests.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '4px 8px', textTransform: 'uppercase' }}>
                      {settings.language === 'es' ? 'Huéspedes' : 'Guests'}
                    </div>
                    {filteredGuests.map(g => (
                      <div
                        key={g.id}
                        onClick={() => {
                          navigate('/app/guests');
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8125rem'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div>
                          <strong>{g.name}</strong> · Rm {g.roomNumber}
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{g.reservationRef} · {g.vipTier}</div>
                        </div>
                        <ArrowRight size={14} color="var(--accent-primary)" />
                      </div>
                    ))}
                  </div>
                )}

                {filteredFolios.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '4px 8px', textTransform: 'uppercase' }}>
                      {settings.language === 'es' ? 'Cargos a Folio' : 'Folio Charges'}
                    </div>
                    {filteredFolios.map(f => (
                      <div
                        key={f.id}
                        onClick={() => {
                          navigate('/app/folios');
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8125rem'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div>
                          <strong>{f.postingRef}</strong> · Rm {f.roomNumber} ({f.guestName})
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{f.sourceOutlet} · {formatPrice(f.amountMxn)}</div>
                        </div>
                        <span className={`badge ${f.status === 'posted' ? 'badge-success' : f.status === 'failed' ? 'badge-error' : 'badge-warning'}`}>
                          {f.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredOrders.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '4px 8px', textTransform: 'uppercase' }}>
                      {settings.language === 'es' ? 'Órdenes' : 'Orders'}
                    </div>
                    {filteredOrders.map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          navigate('/app/pos');
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8125rem'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div>
                          <strong>{o.orderNumber}</strong> ({o.outletName})
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                            {o.lines.length} items · {formatPrice(o.totalMxn)}
                          </div>
                        </div>
                        <span className="badge badge-teal">{o.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Business Date Pill */}
        <div
          style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            backgroundColor: 'var(--surface-secondary)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            whiteSpace: 'nowrap'
          }}
          className="business-date-pill"
        >
          📅 {settings.language === 'es' ? '21 Oct 2026' : 'Oct 21, 2026'}
        </div>

        {/* Currency Switcher MXN / USD */}
        <button
          onClick={() => setDisplayCurrency(displayCurrency === 'MXN' ? 'USD' : 'MXN')}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px' }}
          title={settings.language === 'es' ? 'Cambiar Moneda de Visualización' : 'Toggle Display Currency'}
        >
          <Coins size={14} color="var(--accent-primary)" />
          <span style={{ fontWeight: 600 }}>{displayCurrency}</span>
        </button>

        {/* Language Selector EN / ES */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px' }}
          >
            <Globe size={14} />
            <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{settings.language}</span>
          </button>

          {showLangMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '4px',
                zIndex: 100,
                minWidth: '120px'
              }}
            >
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowLangMenu(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 10px',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: settings.language === 'en' ? 'var(--accent-primary-light)' : 'transparent',
                  color: settings.language === 'en' ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: settings.language === 'en' ? 600 : 400
                }}
              >
                English (US)
              </button>
              <button
                onClick={() => {
                  setLanguage('es');
                  setShowLangMenu(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 10px',
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: settings.language === 'es' ? 'var(--accent-primary-light)' : 'transparent',
                  color: settings.language === 'es' ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: settings.language === 'es' ? 600 : 400
                }}
              >
                Español (MX)
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon"
            style={{ position: 'relative' }}
            aria-label="Operational Notifications"
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--accent-warm)'
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                padding: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{settings.language === 'es' ? 'Eventos Operativos' : 'Operational Events'}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Live Sync</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '280px', overflowY: 'auto' }}>
                {activityFeed.slice(0, 4).map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.linkRoute) navigate(item.linkRoute);
                      setShowNotifications(false);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-main)',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span>{settings.language === 'es' ? item.titleEs : item.title}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {settings.language === 'es' ? item.descriptionEs : item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Demo Environment Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-primary-light)',
            border: '1px solid rgba(73, 108, 104, 0.2)',
            color: 'var(--accent-primary)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}
          className="demo-pill-desktop"
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--state-success)' }} />
          DEMO DATA
        </div>

        {/* User Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            paddingLeft: 8,
            borderLeft: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}
          >
            <User size={16} />
          </div>
          <div style={{ display: 'none' }} className="user-name-desktop">
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.2 }}>Director General</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Odoo 20 Admin</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .search-box-desktop { display: none !important; }
          .business-date-pill { display: none !important; }
        }
        @media (min-width: 1200px) {
          .user-name-desktop { display: block !important; }
        }
      `}</style>
    </header>
  );
};
