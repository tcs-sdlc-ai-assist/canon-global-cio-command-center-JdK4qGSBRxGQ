import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { TABS, COLORS } from '../app.config';
import { logTabSwitch } from '../services/logger';

export function TabNavigation({ activeTab, onTabChange, className = '' }) {
  const tabListRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (currentIndex + 1) % TABS.length;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = TABS.length - 1;
          break;
        default:
          return;
      }

      const newTabId = TABS[newIndex].id;
      if (newTabId !== activeTab) {
        onTabChange(newTabId);
        logTabSwitch(newTabId, activeTab);
      }

      const tabElements = tabListRef.current?.querySelectorAll('[role="tab"]');
      if (tabElements && tabElements[newIndex]) {
        tabElements[newIndex].focus();
      }
    },
    [activeTab, onTabChange]
  );

  const handleTabClick = useCallback(
    (tabId) => {
      if (tabId !== activeTab) {
        onTabChange(tabId);
        logTabSwitch(tabId, activeTab);
      }
    },
    [activeTab, onTabChange]
  );

  return (
    <nav
      className={`bg-white border-b border-[#EDEBE9] ${className}`}
      role="navigation"
      aria-label="Dashboard tabs"
    >
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Dashboard sections"
        onKeyDown={handleKeyDown}
        className="flex overflow-x-auto scrollbar-hide -mb-px"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0070C0]
                ${
                  isActive
                    ? 'border-[#0070C0] text-[#0070C0]'
                    : 'border-transparent text-[#605E5C] hover:text-[#323130] hover:border-gray-300'
                }
              `}
            >
              <span className="text-base" aria-hidden="true">
                {getTabIcon(tab.icon)}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function getTabIcon(iconName) {
  const icons = {
    dashboard: '📊',
    server: '🖥️',
    shield: '🛡️',
    apps: '📱',
    checklist: '✅',
    currency: '💰',
    people: '👥',
    chart: '📈',
  };
  return icons[iconName] || '📋';
}