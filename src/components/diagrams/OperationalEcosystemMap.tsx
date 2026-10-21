import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  SunMedium,
  ShoppingBag,
  Sparkles,
  CreditCard,
  Building,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EcosystemNode {
  id: string;
  name: string;
  nameEs: string;
  category: string;
  categoryEs: string;
  route: string;
  icon: React.ReactNode;
  summary: string;
  summaryEs: string;
  details: string;
  detailsEs: string;
  xPercent: number;
  yPercent: number;
}

export const OperationalEcosystemMap: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useApp();
  const isEs = settings.language === 'es';

  const NODES: EcosystemNode[] = [
    {
      id: 'res_pos',
      name: 'Restaurant POS',
      nameEs: 'TPV de Restaurante',
      category: 'Dining Outlets',
      categoryEs: 'Centros de Consumo',
      route: '/app/restaurant',
      icon: <Utensils size={20} color="#496C68" />,
      summary: 'Table floor plans, course pacing, and direct kitchen tickets.',
      summaryEs: 'Planos de mesas interactivos, tiempos de servicio y comandas directas.',
      details: 'High-speed order entry with split-check allocation and instant room charge routing.',
      detailsEs: 'Captura ágil de órdenes con división de cuentas y cargos inmediatos a habitación.',
      xPercent: 18,
      yPercent: 26
    },
    {
      id: 'beach_pos',
      name: 'Pool & Beach POS',
      nameEs: 'TPV Piscina y Playa',
      category: 'Outdoor Outlets',
      categoryEs: 'Áreas Exteriores',
      route: '/app/pos',
      icon: <SunMedium size={20} color="#B47D68" />,
      summary: 'Cabana mobile ordering with quick guest name identification.',
      summaryEs: 'Servicio en cabañas con identificación rápida de huéspedes.',
      details: 'Direct sync across beach terminals even with variable resort Wi-Fi connectivity.',
      detailsEs: 'Sincronización directa en áreas de playa con tolerancia a intermitencias de red.',
      xPercent: 42,
      yPercent: 18
    },
    {
      id: 'boutique_pos',
      name: 'Boutique POS',
      nameEs: 'TPV de Boutique',
      category: 'Retail',
      categoryEs: 'Boutique Artesanal',
      route: '/app/pos',
      icon: <ShoppingBag size={20} color="#496C68" />,
      summary: 'Mexican artisanal retail and instant USD/MXN pricing.',
      summaryEs: 'Venta minorista de piezas artesanales con conversión inmediata USD/MXN.',
      details: 'Supports multi-currency settlement, barcode lookups, and combined room-charge receipts.',
      detailsEs: 'Permite liquidación multimoneda, códigos de barra y cargos combinados a folio.',
      xPercent: 78,
      yPercent: 26
    },
    {
      id: 'spa_sched',
      name: 'Spa Scheduling',
      nameEs: 'Agenda y Recursos de Spa',
      category: 'Wellness',
      categoryEs: 'Bienestar y Salud',
      route: '/app/spa',
      icon: <Sparkles size={20} color="#496C68" />,
      summary: 'Therapist & room calendar with mandatory sanitation buffers.',
      summaryEs: 'Calendario de cabinas y terapeutas con tiempo de sanitización obligatorio.',
      details: 'Automatic overlap prevention, 50% deposit capture, and 1-click balance transfer to POS.',
      detailsEs: 'Prevención estricta de empalmes, captura de anticipo del 50% y envío de saldo a TPV.',
      xPercent: 20,
      yPercent: 72
    },
    {
      id: 'pms_folios',
      name: 'Guest Room Folios',
      nameEs: 'Folios de Habitación (PMS)',
      category: 'Core Property Sync',
      categoryEs: 'Sincronización PMS Central',
      route: '/app/folios',
      icon: <Building size={20} color="#496C68" />,
      summary: 'Centralized guest folio posting with idempotent retry safety.',
      summaryEs: 'Cargos consolidados a folio con reintentos idempotentes seguros.',
      details: 'Maintains unique posting references across outlets to completely eliminate duplicate charges.',
      detailsEs: 'Mantiene claves idempotentes únicas para evitar cualquier cobro duplicado en el PMS.',
      xPercent: 50,
      yPercent: 50
    },
    {
      id: 'digital_pay',
      name: 'Digital Payments',
      nameEs: 'Pagos Digitales Stripe',
      category: 'Fintech & Bookings',
      categoryEs: 'Cobros y Anticipos',
      route: '/app/payments',
      icon: <CreditCard size={20} color="#B47D68" />,
      summary: 'Stripe deposits, payment links, and end-of-day bank reconciliation.',
      summaryEs: 'Anticipos Stripe, enlaces de pago demo y conciliación bancaria.',
      details: 'Automated settlement reconciliation identifying discrepancies between card processors and folios.',
      detailsEs: 'Auditoría automática que detecta discrepancias entre procesadores y libros contables.',
      xPercent: 78,
      yPercent: 72
    },
    {
      id: 'cfdi_invoice',
      name: 'CFDI 4.0 Invoicing',
      nameEs: 'Facturación CFDI 4.0',
      category: 'SAT Compliance',
      categoryEs: 'Cumplimiento Fiscal SAT',
      route: '/app/invoicing',
      icon: <FileCheck2 size={20} color="#48765C" />,
      summary: 'Mexican fiscal compliance, RFC validation, and timbrado preview.',
      summaryEs: 'Cumplimiento fiscal mexicano, validación de RFC y vista previa timbrada.',
      details: 'Converts any paid POS order or spa folio into compliant SAT XML/PDF structures with IVA separation.',
      detailsEs: 'Convierte consumos pagados en facturas con desglose de IVA y catálogos vigentes del SAT.',
      xPercent: 50,
      yPercent: 86
    }
  ];

  const [selectedNode, setSelectedNode] = useState<EcosystemNode>(NODES[4]); // default to Room Folios

  return (
    <div style={{ marginTop: 'var(--space-8)' }}>
      {/* Node selector buttons on mobile / desktop map view */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginBottom: 'var(--space-6)'
        }}
      >
        {NODES.map(node => {
          const isSelected = selectedNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '14px 10px',
                background: isSelected ? '#FFFFFF' : 'var(--surface-secondary)',
                border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ marginBottom: 6 }}>{node.icon}</div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  lineHeight: 1.2
                }}
              >
                {isEs ? node.nameEs : node.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details Editorial Panel */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-8)',
          alignItems: 'center'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-primary-light)',
              color: 'var(--accent-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 12
            }}
          >
            {selectedNode.icon}
            {isEs ? selectedNode.categoryEs : selectedNode.category}
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              color: 'var(--text-primary)',
              marginBottom: 8
            }}
          >
            {isEs ? selectedNode.nameEs : selectedNode.name}
          </h3>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontWeight: 500,
              marginBottom: 10
            }}
          >
            {isEs ? selectedNode.summaryEs : selectedNode.summary}
          </p>

          <p
            style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 20
            }}
          >
            {isEs ? selectedNode.detailsEs : selectedNode.details}
          </p>

          <button
            onClick={() => navigate(selectedNode.route)}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <span>{isEs ? 'Explorar Módulo Operativo' : 'Launch Interactive Demo Screen'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Operational Context Card */}
        <div
          style={{
            background: 'var(--bg-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              {isEs ? 'Flujo de Sincronización' : 'Data Continuity Metric'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--state-success)' }}>
              100% {isEs ? 'Sincronizado' : 'Shared State'}
            </span>
          </div>

          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-primary)',
              padding: '12px 14px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: 12
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
              {isEs ? 'Arquitectura Propuesta Odoo' : 'Proposed Odoo Architecture'}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--accent-primary)' }}>
              {selectedNode.id === 'res_pos' && 'pos_restaurant · owl_floor_screen · kitchen_order'}
              {selectedNode.id === 'beach_pos' && 'pos_mobile · offline_db · guest_quick_charge'}
              {selectedNode.id === 'boutique_pos' && 'pos_retail · multi_currency_mxn_usd · barcode'}
              {selectedNode.id === 'spa_sched' && 'calendar_resource · slot_buffer_clean · deposit_flow'}
              {selectedNode.id === 'pms_folios' && 'pms_connector · idempotent_uuid · guest_account'}
              {selectedNode.id === 'digital_pay' && 'payment_stripe · webhook_audit · reconciliation'}
              {selectedNode.id === 'cfdi_invoice' && 'l10n_mx_edi · sat_catalog · cfdi_40_xml'}
            </div>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {isEs
              ? 'Todos los datos se reflejan de forma inmediata entre el TPV, el spa, la habitación y la contabilidad.'
              : 'All transactions update shared in-memory records locally so you can trace the guest journey from booking to folio.'}
          </p>
        </div>
      </div>
    </div>
  );
};
