import { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  FileCheck2,
  CreditCard,
  Calendar,
  MessageSquare,
  Milestone,
  CheckSquare2,
  FolderClosed,
  Bell,
  Menu,
  RotateCcw,
  ShieldAlert,
  LogOut,
  User
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { useDemo } from '../../state/DemoProvider';
import { unreadTotal, onboardingProgress } from '../../state/selectors';
import { Popover } from '../ui/Interactive';
import { ConfirmationDialog, Sheet } from '../ui/Dialog';
import { useToast } from '../ui/Toast';
import { formatRelative } from '../../lib/dates';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number | string;
}

export function PortalLayout() {
  const { state, dispatch } = useDemo();
  const location = useLocation();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const unread = unreadTotal(state);
  const progress = onboardingProgress(state);

  const navItems: NavItem[] = [
    { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/portal/onboarding', label: 'My Onboarding', icon: Sparkles, badge: progress < 100 ? `${progress}%` : undefined },
    { to: '/portal/forms', label: 'Forms', icon: ClipboardList },
    { to: '/portal/agreements', label: 'Agreements', icon: FileCheck2 },
    { to: '/portal/payments', label: 'Payments', icon: CreditCard },
    { to: '/portal/schedule', label: 'Schedule', icon: Calendar },
    { to: '/portal/messages', label: 'Messages', icon: MessageSquare, badge: unread > 0 ? unread : undefined },
    { to: '/portal/roadmap', label: 'My Roadmap', icon: Milestone },
    { to: '/portal/tasks', label: 'Tasks', icon: CheckSquare2 },
    { to: '/portal/documents', label: 'Documents', icon: FolderClosed },
  ];

  const handleReset = () => {
    dispatch({ type: 'RESET' });
    setResetOpen(false);
    toast({ tone: 'info', title: 'Demo State Reset', message: 'All demo data has been restored to default values.' });
  };

  const getPageTitle = () => {
    const item = navItems.find((n) => location.pathname.startsWith(n.to));
    return item ? item.label : 'Client Portal';
  };

  const sidebarContent = (
    <div className="portal-sidebar-inner">
      <div className="portal-sidebar-brand">
        <Link to="/" aria-label="Go to landing page">
          <BrandLogo compact />
        </Link>
        <span className="demo-chip">Demo Mode</span>
      </div>

      <nav className="portal-nav" aria-label="Client Portal Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `portal-nav-link ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className={`portal-nav-badge ${item.to === '/portal/messages' ? 'is-alert' : ''}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="portal-sidebar-foot">
        <div className="portal-user-card">
          <div className="portal-avatar">{state.profile.initials}</div>
          <div className="portal-user-meta">
            <strong>{state.profile.name}</strong>
            <small>Client Account</small>
          </div>
        </div>

        <div className="portal-foot-actions">
          <button
            type="button"
            className="portal-foot-btn"
            onClick={() => setResetOpen(true)}
            title="Reset demo data"
          >
            <RotateCcw size={14} />
            <span>Reset Demo</span>
          </button>
          <Link to="/admin" className="portal-foot-btn portal-foot-btn--admin" title="Switch to Operations Dashboard">
            <ShieldAlert size={14} />
            <span>Operations View</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="portal-shell">
      {/* Desktop Sidebar */}
      <aside className="portal-sidebar">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="portal-main">
        {/* Top Utility Bar */}
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            <button
              type="button"
              className="portal-menu-trigger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="portal-breadcrumbs">
              <span className="portal-breadcrumb-root">Portal</span>
              <span className="portal-breadcrumb-sep">/</span>
              <span className="portal-breadcrumb-current">{getPageTitle()}</span>
            </div>
          </div>

          <div className="portal-topbar-right">
            {/* Notifications Popover */}
            <Popover
              triggerLabel="Activity Notifications"
              trigger={
                <span className="portal-topbar-icon-wrap">
                  <Bell size={18} />
                  {state.activity.length > 0 && <span className="portal-topbar-badge" />}
                </span>
              }
              align="right"
              panelClassName="portal-notif-panel"
            >
              {(close) => (
                <div>
                  <div className="portal-notif-header">
                    <strong>Recent Activity</strong>
                    <small>{state.activity.length} updates</small>
                  </div>
                  <div className="portal-notif-list">
                    {state.activity.slice(0, 5).map((act) => (
                      <Link
                        key={act.id}
                        to={act.link}
                        className="portal-notif-item"
                        onClick={close}
                      >
                        <p>{act.text}</p>
                        <time>{formatRelative(act.ts)}</time>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Popover>

            {/* Profile Menu Popover */}
            <Popover
              triggerLabel="Account Profile"
              trigger={
                <span className="portal-avatar-btn">
                  <span className="portal-avatar portal-avatar--sm">{state.profile.initials}</span>
                </span>
              }
              align="right"
            >
              {(close) => (
                <div className="portal-profile-dropdown">
                  <div className="portal-profile-info">
                    <strong>{state.profile.name}</strong>
                    <span>{state.profile.email}</span>
                  </div>
                  <div className="portal-profile-sep" />
                  <Link
                    to="/portal/forms"
                    className="menu-item"
                    onClick={close}
                  >
                    <User size={15} />
                    <span>My Profile & Intake</span>
                  </Link>
                  <button
                    type="button"
                    className="menu-item"
                    onClick={() => {
                      close();
                      setResetOpen(true);
                    }}
                  >
                    <RotateCcw size={15} />
                    <span>Reset Demo State</span>
                  </button>
                  <Link
                    to="/"
                    className="menu-item"
                    onClick={close}
                  >
                    <LogOut size={15} />
                    <span>Exit to Public Site</span>
                  </Link>
                </div>
              )}
            </Popover>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="portal-content page-enter">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      <Sheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Havenwell Portal"
        description="Private Client Navigation"
      >
        <div className="portal-mobile-menu">
          {sidebarContent}
        </div>
      </Sheet>

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Demo Data?"
        message="This will restore all simulated onboarding progress, tasks, appointments, invoices, and messages to their initial presentation state."
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        danger
      />
    </div>
  );
}
