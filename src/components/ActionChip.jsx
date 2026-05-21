import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useUI } from '../context/UIProvider';
import { logChipClick } from '../services/logger';

const VARIANT_STYLES = {
  primary: {
    base: 'bg-[#0070C0] text-white border-[#0070C0] hover:bg-[#005a9e] hover:border-[#005a9e] focus:ring-[#0070C0]',
    icon: 'text-white',
  },
  secondary: {
    base: 'bg-white text-[#323130] border-[#EDEBE9] hover:bg-gray-50 hover:border-gray-300 focus:ring-[#0070C0]',
    icon: 'text-[#605E5C]',
  },
  insight: {
    base: 'bg-[#E8F4FD] text-[#004578] border-[#B3D9F2] hover:bg-[#D1E8F7] hover:border-[#7AB8E0] focus:ring-[#0070C0]',
    icon: 'text-[#0070C0]',
  },
};

export function ActionChip({ label, onClick, variant = 'primary', icon, ariaLabel, className = '' }) {
  const { openChatDrawer, setChatInputPrefill } = useUI();

  const handleClick = useCallback(() => {
    logChipClick(label, variant);

    openChatDrawer();
    setChatInputPrefill(label);

    if (onClick) {
      onClick(label);
    }
  }, [label, onClick, openChatDrawer, setChatInputPrefill, variant]);

  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel || `Action: ${label}`}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
        rounded-full border transition-all duration-150 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-1
        active:scale-95
        ${styles.base}
        ${className}
      `}
    >
      {icon && (
        <span className={`text-sm leading-none ${styles.icon}`} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="truncate max-w-[180px]">{label}</span>
    </button>
  );
}

ActionChip.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'insight']),
  icon: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};