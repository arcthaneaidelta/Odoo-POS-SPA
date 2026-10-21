import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/common/Button';
import { useDemo } from '../context/DemoContext';
import {
  Settings,
  Key,
  Shield,
  Bell,
  Database,
  RotateCcw,
  CheckCircle2,
  Lock,
  Download,
  Upload,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { state, addToast, resetAllData } = useDemo();

  const [connectors, setConnectors] = useState([
    { id: 'direct', name: 'Direct Booking Engine', key: 'pk_live_direct_9921448', connected: true },
    { id: 'booking', name: 'Booking.com Channel API', key: 'bcom_api_token_encrypted', connected: true },
    { id: 'airbnb', name: 'Airbnb Partner Bridge', key: 'abnb_auth_oauth2_valid', connected: true },
    { id: 'opentable', name: 'OpenTable Hospitality Webhook', key: 'ot_webhook_secret_live', connected: true },
    { id: 'stripe', name: 'Stripe Vault Tokenizer (PCI-DSS)', key: 'sk_live_stripe_vault_token', connected: true },
    { id: 'cloudflare', name: 'Cloudflare Turnstile Biometric Solver', key: 'cf_turnstile_solver_key', connected: true },
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pmsSyncInterval, setPmsSyncInterval] = useState('30');

  const handleToggleConnector = (id: string, name: string) => {
    setConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c))
    );
    const target = connectors.find((c) => c.id === id);
    addToast(
      'Connector Updated',
      `${name} is now ${target?.connected ? 'Disabled' : 'Enabled & Active'}`,
      'info'
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Saved', 'Platform preferences updated successfully.', 'success');
  };

  const handleExportStateJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'RESERVA_FLOW_Demo_State.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('State Exported', 'Downloaded complete prototype localStorage snapshot.', 'success');
  };

  return (
    <DashboardLayout
      title="System Settings & Connectors"
      subtitle="Configure OTA integrations, proxy rotation frequency, and prototype persistence settings"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px' }}>
        {/* Connectors Section */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{ marginBottom: '1.5rem', paddingBottom: '0.85rem', borderBottom: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              Platform Connectors & API Gateways
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
              Credentials used by headless workers and webhook dispatchers
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {connectors.map((conn) => (
              <div
                key={conn.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: conn.connected ? '#DCFCE7' : '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Key size={16} color={conn.connected ? '#15803D' : '#64748B'} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{conn.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                      {conn.key.substring(0, 14)}•••••••••••
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: conn.connected ? '#15803D' : '#64748B',
                      backgroundColor: conn.connected ? '#DCFCE7' : '#F1F5F9',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {conn.connected ? 'Connected (200 OK)' : 'Disabled'}
                  </span>

                  <Button
                    variant={conn.connected ? 'secondary' : 'emerald'}
                    size="sm"
                    onClick={() => handleToggleConnector(conn.id, conn.name)}
                  >
                    {conn.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Preferences */}
        <form
          onSubmit={handleSaveSettings}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{ marginBottom: '1.5rem', paddingBottom: '0.85rem', borderBottom: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              Automation & Notification Rules
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
              Global thresholds and simulation engine preferences
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Opera Cloud PMS Sync Interval (Seconds)
              </label>
              <select
                value={pmsSyncInterval}
                onChange={(e) => setPmsSyncInterval(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              >
                <option value="15">15 Seconds (Real-time Drop Priority)</option>
                <option value="30">30 Seconds (Standard Hospitality)</option>
                <option value="60">60 Seconds (Low Network Footprint)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Default Currency Format
              </label>
              <select style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                <option>EUR (€) - European Luxury Hospitality</option>
                <option>USD ($) - North America</option>
                <option>GBP (£) - United Kingdom</option>
                <option>CHF (Fr.) - Swiss Alps Concierge</option>
              </select>
            </div>
          </div>

          <Button variant="primary" size="md" type="submit">
            Save Operational Preferences
          </Button>
        </form>

        {/* State Management & Factory Reset (PRD Rule 13) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #FECACA',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#991B1B' }}>
              Prototype Persistence & Demo Reset
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
              Manage browser localStorage cache, export demo state, or restore pristine seed data.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportStateJSON}
              iconLeft={<Download size={14} />}
            >
              Export Demo State JSON
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                resetAllData();
              }}
              iconLeft={<RotateCcw size={14} />}
            >
              Reset to Factory Seed Data
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
