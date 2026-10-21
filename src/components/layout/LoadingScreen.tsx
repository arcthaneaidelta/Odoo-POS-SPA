import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const PHRASES = [
  'Preparing your resort experience',
  'Synchronizing the day ahead',
  'Setting the stage for seamless service'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const phraseTimer = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % PHRASES.length);
    }, 400);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 25;
      });
    }, 200);

    const completeTimer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onComplete, 300);
    }, 1250);

    return () => {
      clearInterval(phraseTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#F7F5F0',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 300ms ease-out',
        opacity: fadingOut ? 0 : 1,
        pointerEvents: fadingOut ? 'none' : 'auto'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 420, padding: 24 }}>
        {/* Minimal Horizon & Sun Line Art */}
        <div style={{ marginBottom: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="72" height="48" viewBox="0 0 72 48" fill="none">
            {/* Soft Sun */}
            <circle cx="36" cy="20" r="9" fill="#B47D68" opacity="0.85" />
            {/* Horizon gentle ocean wave */}
            <path
              d="M10 34 C 22 28, 32 38, 44 32 C 54 28, 62 34, 66 34"
              stroke="#496C68"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Secondary subtle wave line */}
            <path
              d="M18 41 C 28 37, 38 43, 48 39 C 56 36, 60 40, 64 40"
              stroke="#A4B2A0"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: '#292D2C',
            marginBottom: 6,
            textTransform: 'uppercase'
          }}
        >
          CASA MAREA
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            letterSpacing: '0.24em',
            color: '#777A73',
            textTransform: 'uppercase',
            marginBottom: 36,
            fontWeight: 500
          }}
        >
          RESORT OPERATIONS
        </p>

        {/* Fine Progress Line */}
        <div
          style={{
            width: '180px',
            height: '2px',
            backgroundColor: '#E4E0D8',
            borderRadius: '2px',
            margin: '0 auto 20px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: '#496C68',
              width: `${progress}%`,
              transition: 'width 250ms ease-out'
            }}
          />
        </div>

        {/* Rotating subtle phrase */}
        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: '0.9375rem',
            color: '#777A73',
            minHeight: '1.5rem',
            transition: 'opacity 200ms ease'
          }}
        >
          {PHRASES[phraseIndex]}
        </p>
      </div>
    </div>
  );
};
