import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../app.config';

const PULSE_INTERVAL = 45000;

export function AIPulseIndicator({ className = '', label = 'AI insight available' }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    const restartAnimation = () => {
      setIsAnimating(false);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    };

    intervalRef.current = setInterval(restartAnimation, PULSE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span
      className={`relative inline-flex h-2 w-2 ${className}`}
      aria-label={label}
      role="status"
    >
      {isAnimating && (
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
          style={{ backgroundColor: COLORS.PRIMARY }}
          aria-hidden="true"
        />
      )}
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: COLORS.PRIMARY }}
        aria-hidden="true"
      />
    </span>
  );
}

AIPulseIndicator.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
};