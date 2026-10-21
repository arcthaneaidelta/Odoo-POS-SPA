import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';

export const TimelineCalendar: React.FC = () => {
  const { state, dispatch } = useDemo();
  const [filterPeriod, setFilterPeriod] = useState<'This Month' | 'Next Month'>('This Month');

  const days = [
    { day: 'Mon', num: 30, isCurrentMonth: false },
    { day: 'Tue', num: 31, isCurrentMonth: false },
    { day: 'Wed', num: 'April 1', isCurrentMonth: true },
    { day: 'Thu', num: 2, isCurrentMonth: true },
    { day: 'Fri', num: 3, isCurrentMonth: true },
    { day: 'Sat', num: 4, isCurrentMonth: true },
    { day: 'Sun', num: 5, isCurrentMonth: true },
    { day: 'Mon', num: 6, isCurrentMonth: true },
    { day: 'Tue', num: 7, isCurrentMonth: true },
    { day: 'Wed', num: 8, isCurrentMonth: true },
    { day: 'Thu', num: 9, isCurrentMonth: true },
    { day: 'Fri', num: 10, isCurrentMonth: true },
    { day: 'Sat', num: 11, isCurrentMonth: true },
    { day: 'Sun', num: 12, isCurrentMonth: true },
  ];

  // Visual schedule bars positioned matching Reference Image 1
  const reservations = [
    {
      id: 'book-101',
      guest: 'Mr. Eug Helsinki',
      room: 'Room 305',
      startCol: 3,
      span: 4,
      color: '#0D4E43',
    },
    {
      id: 'book-102',
      guest: 'Mrs. Madonna Tan',
      room: 'Room 140',
      startCol: 2,
      span: 3,
      color: '#1B7F6F',
    },
    {
      id: 'book-103',
      guest: 'Mr. Nolan Hojlund',
      room: 'Room 142',
      startCol: 2,
      span: 3,
      color: '#0D4E43',
    },
    {
      id: 'book-105',
      guest: 'Mrs. Mariah Salsa',
      room: 'Room 32',
      startCol: 7,
      span: 3,
      color: '#1B7F6F',
    },
    {
      id: 'book-106',
      guest: 'Mr. Walter White',
      room: 'Room 287',
      startCol: 10,
      span: 3,
      color: '#0D4E43',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Calendar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>
          Booking Schedule
        </h3>

        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value as any)}
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
          <option value="Next Month">Next Month</option>
        </select>
      </div>

      {/* Calendar Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '700px' }}>
          {/* Days Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${days.length}, 1fr)`,
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '0.65rem',
              textAlign: 'center',
            }}
          >
            {days.map((d, index) => (
              <div key={index} style={{ padding: '0 0.25rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                  {d.day}
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: d.isCurrentMonth ? '#0F172A' : '#94A3B8',
                    fontWeight: 700,
                    marginTop: '0.2rem',
                  }}
                >
                  {d.num}
                </div>
              </div>
            ))}
          </div>

          {/* Schedule Canvas */}
          <div
            style={{
              position: 'relative',
              height: '190px',
              padding: '0.85rem 0',
              backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent calc(100% / 14 - 1px), #F1F5F9 calc(100% / 14 - 1px), #F1F5F9 calc(100% / 14))',
            }}
          >
            {reservations.map((res, index) => {
              const leftPercent = (res.startCol / days.length) * 100;
              const widthPercent = (res.span / days.length) * 100 - 1.5;
              const topOffset = index * 34 + 6;

              return (
                <div
                  key={res.id}
                  onClick={() => dispatch({ type: 'SELECT_BOOKING', payload: res.id })}
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    top: `${topOffset}px`,
                    height: '28px',
                    backgroundColor: res.color,
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    padding: '0 0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                    transition: 'all 150ms ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(13, 78, 67, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.12)';
                  }}
                  title={`${res.guest} · ${res.room} (Click to inspect)`}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {res.guest}
                  </span>
                  <span style={{ opacity: 0.8, fontSize: '0.65rem', marginLeft: '0.4rem' }}>
                    {res.room}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
