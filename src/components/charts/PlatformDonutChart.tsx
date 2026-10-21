import React, { useState } from 'react';

interface PlatformDonutChartProps {
  className?: string;
}

export const PlatformDonutChart: React.FC<PlatformDonutChartProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState<'This Month' | 'This Quarter' | 'This Year'>('This Month');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // Default to Direct (index 0)

  const platforms = [
    { name: 'Direct', count: 218, color: '#0D4E43', percent: 52.2 },
    { name: 'Airbnb', count: 109, color: '#136154', percent: 26.1 },
    { name: 'Booking.com', count: 44, color: '#34D399', percent: 10.5 },
    { name: 'Traveloka', count: 24, color: '#6EE7B7', percent: 5.7 },
    { name: 'Agoda', count: 23, color: '#A7F3D0', percent: 5.5 },
  ];

  const total = platforms.reduce((acc, p) => acc + p.count, 0);

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div
      className={className}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
          Booking by Platform
        </h3>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#334155',
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '0.3rem 0.65rem',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="This Month">This Month ⌵</option>
          <option value="This Quarter">This Quarter</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      {/* Chart & Legend Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          flex: 1,
        }}
      >
        {/* Donut SVG Container */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, margin: '0 auto' }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: 'rotate(-90deg)' }}
          >
            {platforms.map((platform, index) => {
              const dashoffset = circumference - (platform.percent / 100) * circumference;
              const rotation = (accumulatedPercent / 100) * 360;
              accumulatedPercent += platform.percent;

              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={platform.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={platform.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={dashoffset}
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${rotation}deg)`,
                    transition: 'all 200ms ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                />
              );
            })}
          </svg>

          {/* Center Callout Badge matching CheckinOs */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                backgroundColor: '#0D4E43',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                textAlign: 'center',
                boxShadow: '0 4px 10px rgba(13, 78, 67, 0.25)',
                maxWidth: '92px',
                lineHeight: 1.25,
              }}
            >
              {hoveredIndex !== null ? (
                <>
                  <span style={{ color: '#34D399', display: 'block', fontSize: '0.78rem' }}>
                    {platforms[hoveredIndex].percent}%
                  </span>
                  {platforms[hoveredIndex].name}
                </>
              ) : (
                <>
                  <span style={{ color: '#34D399', display: 'block', fontSize: '0.78rem' }}>
                    43.8%
                  </span>
                  Direct
                </>
              )}
            </div>
          </div>
        </div>

        {/* Legend Column matching CheckinOs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', minWidth: '130px' }}>
          {platforms.map((platform, idx) => (
            <div
              key={platform.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: hoveredIndex === idx ? '#0F172A' : '#475569',
                fontWeight: hoveredIndex === idx ? 700 : 500,
                cursor: 'pointer',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: platform.color,
                  flexShrink: 0,
                }}
              />
              <span>{platform.name}</span>
              <span style={{ color: '#94A3B8', marginLeft: 'auto', fontSize: '0.75rem' }}>
                ({platform.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
