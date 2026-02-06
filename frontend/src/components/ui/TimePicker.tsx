'use client';

import { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  value: string | null;
  onChange: (time: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  disabled = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isPM, setIsPM] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      const is12HourPM = hours >= 12;
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      setSelectedHour(hour12);
      setSelectedMinute(minutes);
      setIsPM(is12HourPM);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 15, 30, 45];

  const handleTimeSelect = () => {
    let hour24 = selectedHour;
    if (isPM && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    } else if (!isPM && selectedHour === 12) {
      hour24 = 0;
    }
    const timeStr = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}:00`;
    onChange(timeStr);
    setIsOpen(false);
  };

  const formatDisplayTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const is12HourPM = hours >= 12;
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${is12HourPM ? 'PM' : 'AM'}`;
  };

  return (
    <div className="time-picker" ref={containerRef}>
      <button
        type="button"
        className={`time-picker-trigger ${value ? 'has-value' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{value ? formatDisplayTime(value) : placeholder}</span>
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
        <div className="time-dropdown">
          <div className="time-section">
            <label>Hour</label>
            <div className="time-options">
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  className={`time-option ${selectedHour === hour ? 'selected' : ''}`}
                  onClick={() => setSelectedHour(hour)}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>

          <div className="time-section">
            <label>Minute</label>
            <div className="time-options minutes">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  className={`time-option ${selectedMinute === minute ? 'selected' : ''}`}
                  onClick={() => setSelectedMinute(minute)}
                >
                  :{minute.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <div className="time-section">
            <label>Period</label>
            <div className="time-options period">
              <button
                type="button"
                className={`time-option ${!isPM ? 'selected' : ''}`}
                onClick={() => setIsPM(false)}
              >
                AM
              </button>
              <button
                type="button"
                className={`time-option ${isPM ? 'selected' : ''}`}
                onClick={() => setIsPM(true)}
              >
                PM
              </button>
            </div>
          </div>

          <button type="button" className="confirm-btn" onClick={handleTimeSelect}>
            Set Time
          </button>
        </div>
      )}

      {/* T048 - Enhanced TimePicker styling */}
      <style jsx>{`
        .time-picker {
          position: relative;
          width: 100%;
        }
        .time-picker-trigger {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          width: 100%;
          padding: var(--spacing-md);
          height: var(--input-height);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
          cursor: pointer;
          font-size: var(--font-size-base);
          color: var(--muted);
          transition: all var(--transition-fast) var(--ease-out-expo);
        }
        .time-picker-trigger:hover:not(:disabled) {
          border-color: var(--primary);
          background: var(--bg-secondary);
        }
        .time-picker-trigger:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--shadow-input-focus);
        }
        .time-picker-trigger.has-value {
          color: var(--foreground);
        }
        .time-picker-trigger:disabled {
          opacity: var(--opacity-disabled);
          cursor: not-allowed;
          background: var(--bg-secondary);
        }
        .time-picker-trigger span {
          flex: 1;
          text-align: left;
        }
        .time-picker-trigger svg {
          color: var(--muted);
          transition: color var(--transition-fast);
        }
        .time-picker-trigger:hover svg {
          color: var(--primary);
        }
        .clear-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          padding: 0;
          border: none;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          cursor: pointer;
          color: var(--muted);
          font-size: 14px;
          line-height: 1;
          transition: all var(--transition-fast);
        }
        .clear-btn:hover {
          background: var(--error-light);
          color: var(--error);
        }
        .time-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: var(--spacing-xs);
          padding: var(--spacing-md);
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-modal);
          z-index: var(--z-dropdown);
          animation: dropdownIn 0.2s var(--ease-out-expo);
        }
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .time-section {
          margin-bottom: var(--spacing-md);
        }
        .time-section:last-of-type {
          margin-bottom: var(--spacing-lg);
        }
        .time-section label {
          display: block;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          color: var(--muted);
          margin-bottom: var(--spacing-sm);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .time-options {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--spacing-xs);
        }
        .time-options.minutes {
          grid-template-columns: repeat(4, 1fr);
        }
        .time-options.period {
          grid-template-columns: repeat(2, 1fr);
        }
        .time-option {
          padding: var(--spacing-sm);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
          cursor: pointer;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          transition: all var(--transition-fast) var(--ease-out-expo);
        }
        .time-option:hover {
          border-color: var(--primary);
          background: var(--primary-light);
          color: var(--primary);
        }
        .time-option.selected {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: var(--shadow-button);
        }
        .confirm-btn {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          border-radius: var(--radius-md);
          background: var(--primary);
          color: white;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-fast) var(--ease-out-expo);
          box-shadow: var(--shadow-button);
        }
        .confirm-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
