import React from 'react';
import PropTypes from 'prop-types';

export function LoadingSpinner({ size = 'md', label = 'Loading...', className = '' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[200px] ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`${sizeClasses[size]} rounded-full border-gray-200 border-t-blue-600 animate-spin`}
        aria-hidden="true"
      />
      {label && (
        <span className="mt-3 text-sm text-gray-500">{label}</span>
      )}
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  label: PropTypes.string,
  className: PropTypes.string,
};