import React, { useState } from 'react';
import { ProcessStepper } from '../timeline/ProcessStepper';
import { Button } from '../common/Button';
import { useDemo } from '../../context/DemoContext';
import { SIMULATION_SCENARIOS } from '../../constants/scenarios';
import { Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { SimulationScenarioId } from '../../types';

export const WorkflowVisualizer: React.FC = () => {
  const { navigate, runScenario } = useDemo();
  const [activeTab, setActiveTab] = useState<SimulationScenarioId>('flash_booking');

  const scenario = SIMULATION_SCENARIOS.find((s) => s.id === activeTab) || SIMULATION_SCENARIOS[0];

  const handleSimulate = () => {
    navigate('/simulator');
    setTimeout(() => {
      runScenario(activeTab);
    }, 300);
  };

  return (
    <section
      id="workflows"
      style={{
        padding: '5rem 0',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="container-marketing">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0D4E43',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '0.65rem',
            }}
          >
            Deterministic Pipeline
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0F172A',
              marginBottom: '1rem',
            }}
          >
            Step-by-step autonomous execution graphs
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6 }}>
            Every reservation event triggers a verified multi-agent DAG pipeline.
            Inspect the live status transitions below or simulate them directly.
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}
        >
          {SIMULATION_SCENARIOS.map((s) => {
            const isSelected = activeTab === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                style={{
                  padding: '0.6rem 1.15rem',
                  borderRadius: '9999px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  backgroundColor: isSelected ? '#0D4E43' : '#F8FAFC',
                  color: isSelected ? '#FFFFFF' : '#475569',
                  border: isSelected ? '1px solid #0D4E43' : '1px solid #E2E8F0',
                  boxShadow: isSelected ? '0 4px 12px rgba(13, 78, 67, 0.25)' : 'none',
                  transition: 'all 150ms ease',
                }}
              >
                {s.title.split(':')[1] || s.title}
              </button>
            );
          })}
        </div>

        {/* Visualizer Card Layout */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Description & Simulation CTA */}
          <div>
            <div
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                marginBottom: '1rem',
              }}
            >
              {scenario.category}
            </div>

            <h3
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
              }}
            >
              {scenario.title}
            </h3>

            <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              {scenario.shortDescription}
            </p>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                Guaranteed Outcome & Yield Impact
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#16A34A', fontWeight: 600 }}>
                {scenario.expectedOutcome.alertGenerated}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <Button
                variant="emerald"
                size="md"
                onClick={handleSimulate}
                iconLeft={<Play size={16} />}
              >
                Simulate Execution Now
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/workflows')}
                iconRight={<ArrowRight size={15} />}
              >
                Workflow Studio
              </Button>
            </div>
          </div>

          {/* Right Column: Process Stepper matching Reference Image 4 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '1.75rem',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            }}
          >
            <ProcessStepper
              steps={scenario.steps.map((st, i) => ({
                id: `step-${i}`,
                title: st.title,
                status: st.status,
                statusLabel: st.statusLabel,
                agentName: st.agentName,
                avatarText: st.agentName.includes('Sarah') ? 'SL' : 'A',
                timestamp: `Step ${i + 1}`,
                detail: st.impactSummary,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
