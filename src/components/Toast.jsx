import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../app.config';

const TOAST_TYPE_STYLES = {
  success: {
    backgroundColor: '#DFF6DD',
    borderColor: '#A7E0A5',
    iconColor: '#107C10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    backgroundColor: '#FDE7E9',
    borderColor: '#F7B7BB',
    iconColor: '#D13438',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  info: {
    backgroundColor: '#E8F4FD',
    borderColor: '#B3D9F2',
    iconColor: '#0070C0',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    backgroundColor: '#FFF4CE',
    borderColor: '#FFE68F',
    iconColor: '#FF8C00',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
};

export function Toast({ id, type = 'info', title, message, onDismiss, duration = 4000, className = '' }) {
  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss(id);
    }
  }, [id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleDismiss]);

  const style = TOAST_TYPE_STYLES[type] || TOAST_TYPE_STYLES.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 ease-out animate-slide-in ${className}`}
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex-shrink-0 mt-0.5" style={{ color: style.iconColor }} aria-hidden="true">
        {style.icon}
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-[#323130] mb-0.5">{title}</p>
        )}
        {message && (
          <p className="text-sm text-[#605E5C] leading-relaxed">{message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-md text-[#605E5C] hover:text-[#323130] hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-1 transition-colors"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  title: PropTypes.string,
  message: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  duration: PropTypes.number,
  className: PropTypes.string,
};