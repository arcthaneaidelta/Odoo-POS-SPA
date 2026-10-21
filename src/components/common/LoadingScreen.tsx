import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { Check, ShieldCheck, Zap } from 'lucide-react';

interface LoadingScreenProps {
  onFinish: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(12);
  const [stepText, setStepText] = useState('Initializing deterministic sandbox engine...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(45);
      setStepText('Connecting headless browser proxy fleet (6 residential nodes)...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(78);
      setStepText('Calibrating cross-channel overbooking arbitration matrix...');
    }, 850);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStepText('Deterministic simulation engine ready.');
    }, 1250);

    const t4 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onFinish, 350);
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onFinish, 200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#082F28',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(13, 78, 67, 0.6) 0%, #061F1A 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Brand Icon Glow Effect */}
        <div
          style={{
            position: 'relative',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-18px',
              borderRadius: '50%',
              backgroundColor: 'rgba(52, 211, 153, 0.15)',
              filter: 'blur(16px)',
              animation: 'pulseGlow 2.5s ease-in-out infinite',
            }}
          />
          <BrandLogo size="lg" light showBadge />
        </div>

        <p
          style={{
            fontSize: '0.95rem',
            color: '#A7F3D0',
            fontWeight: 500,
            marginBottom: '1.75rem',
            letterSpacing: '0.02em',
          }}
        >
          Autonomous Reservation & Multi-Channel Workflow Engine
        </p>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#10B981',
              boxShadow: '0 0 12px #34D399',
              borderRadius: '9999px',
              transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* Dynamic Status Text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: '0.78rem',
            color: '#6EE7B7',
            marginBottom: '2rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stepText}
          </span>
          <span style={{ fontWeight: 600, marginLeft: '0.5rem' }}>{progress}%</span>
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: '0.78rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Zap size={14} color="#34D399" /> Sub-second Sync
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#34D399" /> Anti-Bot Bypass
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Check size={14} color="#34D399" /> 100% Deterministic
          </span>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          style={{
            fontSize: '0.82rem',
            color: 'rgba(255, 255, 255, 0.8)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '0.45rem 1.1rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          Enter Prototype Directly →
        </button>
      </div>
    </div>
  );
};
