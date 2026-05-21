import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useUI } from '../context/UIProvider';
import { Toast } from './Toast';

const MAX_VISIBLE_TOASTS = 5;

export function ToastContainer({ className = '' }) {
  const { toasts, removeToast } = useUI();

  const handleDismiss = useCallback(
    (id) => {
      removeToast(id);
    },
    [removeToast]
  );

  if (!toasts || toasts.length === 0) {
    return null;
  }

  const visibleToasts = toasts.slice(-MAX_VISIBLE_TOASTS);

  return (
    <div
      className={`fixed top-14 right-4 z-[100] flex flex-col gap-2 pointer-events-none ${className}`}
      aria-live="polite"
      aria-label="Notifications"
    >
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
          <Toast
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onDismiss={handleDismiss}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
}

ToastContainer.propTypes = {
  className: PropTypes.string,
};