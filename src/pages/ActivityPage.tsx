import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useDemo } from '../context/DemoContext';
import {
  Activity,
  Filter,
  Search,
  Download,
  Shield,
  Bot,
  User,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { state, addToast } = useDemo();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = state.activity.filter((ev) => {
    if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.actor.toLowerCase().includes(q) ||
        ev.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAudit = () => {
    addToast('Audit Log Exported', 'Downloaded cryptographic activity history JSON.', 'success');
  };

  const getActorIcon = (type: string) => {
    switch (type) {
      case 'bot':
        return <Bot size={15} color="#0D4E43" />;
      case 'channel_manager':
        return <Zap size={15} color="#0284C7" />;
      case 'security_guard':
        return <Shield size={15} color="#16A34A" />;
      default:
        return <User size={15} color="#64748B" />;
    }
  };

  return (
    <DashboardLayout
      title="Activity History & Audit Trail"
      subtitle="Real-time chronological event stream of all agent operations, proxy rotations, and booking state transitions"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Controls Toolbar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Events' },
              { id: 'workflow', label: 'Workflows' },
              { id: 'booking', label: 'Bookings' },
              { id: 'conflict', label: 'Conflicts' },
              { id: 'security', label: 'Anti-Bot & Proxies' },
              { id: 'system', label: 'System' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: selectedCategory === cat.id ? '#0D4E43' : '#F1F5F9',
                  color: selectedCategory === cat.id ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Filter events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.35rem 0.75rem 0.35rem 2rem',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportAudit}
              iconLeft={<Download size={14} />}
            >
              Export JSON
            </Button>
          </div>
        </div>

        {/* Chronological Stream */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEvents.map((ev, index) => (
              <div
                key={ev.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                }}
              >
                {/* Actor Avatar */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {getActorIcon(ev.actorType)}
                </div>

                {/* Event Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>
                        {ev.title}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: ev.status === 'success' ? '#DCFCE7' : '#FEF3C7',
                          color: ev.status === 'success' ? '#15803D' : '#B45309',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                        }}
                      >
                        {ev.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                      <Clock size={13} />
                      {ev.timestamp}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#475569', marginTop: '0.3rem', lineHeight: 1.45 }}>
                    {ev.details}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748B' }}>
                    <span>Actor: <strong>{ev.actor}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
