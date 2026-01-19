'use client';

import { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  minDate?: string;
  placeholder?: string;
  disabled?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DatePicker({
  value,
  onChange,
  minDate,
  placeholder = 'Select date',
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const d = new Date(value);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDateObj = minDate ? new Date(minDate) : today;
  minDateObj.setHours(0, 0, 0, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = selectedDate.toISOString().split('T')[0];
    onChange(dateStr);
    setIsOpen(false);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date < minDateObj;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const isDisabled = isDateDisabled(day);
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0];
    const isSelected = value === dateStr;
    const isToday = dateStr === today.toISOString().split('T')[0];

    days.push(
      <button
        key={day}
        type="button"
        className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
        onClick={() => !isDisabled && handleDateClick(day)}
        disabled={isDisabled}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="date-picker" ref={containerRef}>
      <button
        type="button"
        className={`date-picker-trigger ${value ? 'has-value' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{value ? formatDisplayDate(value) : placeholder}</span>
        {value && (
          <button
            type="button"
            className="clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          >
            ×
          </button>
        )}
      </button>

      {isOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <button type="button" className="nav-btn" onClick={prevMonth}>
              ‹
            </button>
            <span className="month-year">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button type="button" className="nav-btn" onClick={nextMonth}>
              ›
            </button>
          </div>

          <div className="calendar-days-header">
            {DAYS.map((day) => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {days}
          </div>
        </div>
      )}

      <style jsx>{`
        .date-picker {
          position: relative;
          width: 100%;
        }
        .date-picker-trigger {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
          cursor: pointer;
          font-size: var(--font-size-base);
          color: var(--muted);
          transition: all var(--transition-fast);
        }
        .date-picker-trigger:hover:not(:disabled) {
          border-color: var(--primary);
        }
        .date-picker-trigger:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .date-picker-trigger.has-value {
          color: var(--foreground);
        }
        .date-picker-trigger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .date-picker-trigger span {
          flex: 1;
          text-align: left;
        }
        .clear-btn {
          padding: 0;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--muted);
          font-size: 1.25rem;
          line-height: 1;
        }
        .clear-btn:hover {
          color: var(--error);
        }
        .calendar-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: var(--spacing-xs);
          padding: var(--spacing-md);
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 100;
        }
        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }
        .nav-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1.25rem;
          color: var(--foreground);
          border-radius: var(--radius-sm);
        }
        .nav-btn:hover {
          background: var(--bg-secondary);
        }
        .month-year {
          font-weight: var(--font-weight-semibold);
        }
        .calendar-days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          margin-bottom: var(--spacing-xs);
        }
        .day-header {
          text-align: center;
          font-size: var(--font-size-xs);
          color: var(--muted);
          font-weight: var(--font-weight-medium);
          padding: var(--spacing-xs);
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          cursor: pointer;
          font-size: var(--font-size-sm);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .calendar-day:not(.empty):not(.disabled):hover {
          background: var(--bg-secondary);
        }
        .calendar-day.selected {
          background: var(--primary);
          color: white;
        }
        .calendar-day.today:not(.selected) {
          border: 1px solid var(--primary);
        }
        .calendar-day.disabled {
          color: var(--muted-light);
          cursor: not-allowed;
        }
        .calendar-day.empty {
          cursor: default;
        }
      `}</style>
    </div>
  );
}
