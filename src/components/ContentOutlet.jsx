import React from 'react';
import PropTypes from 'prop-types';
import { TABS } from '../app.config';

const TAB_PANELS = {
  overview: React.lazy(() => import('../tabs/OverviewPanel')),
  infrastructure: React.lazy(() => import('../tabs/InfrastructurePanel')),
  security: React.lazy(() => import('../tabs/SecurityPanel')),
  applications: React.lazy(() => import('../tabs/ApplicationsPanel')),
  compliance: React.lazy(() => import('../tabs/CompliancePanel')),
  budget: React.lazy(() => import('../tabs/BudgetPanel')),
  team: React.lazy(() => import('../tabs/TeamPanel')),
  reports: React.lazy(() => import('../tabs/ReportsPanel')),
};

export function ContentOutlet({ activeTab, className = '' }) {
  const PanelComponent = TAB_PANELS[activeTab];

  if (!PanelComponent) {
    return (
      <div
        className={`p-6 ${className}`}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <p className="text-gray-500 text-sm">Panel not found for tab: {activeTab}</p>
      </div>
    );
  }

  return (
    <div
      className={className}
      role="tabpanel"
      id={`tabpanel-${activeTab}`}
      aria-labelledby={`tab-${activeTab}`}
    >
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="h-8 w-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" aria-hidden="true" />
          </div>
        }
      >
        <PanelComponent />
      </React.Suspense>
    </div>
  );
}

ContentOutlet.propTypes = {
  activeTab: PropTypes.string.isRequired,
  className: PropTypes.string,
};