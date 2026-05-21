import React from 'react';
import PropTypes from 'prop-types';
import { useData } from '../context/DataContext';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

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

export function TabContentRenderer({ activeTab, className = '' }) {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return (
      <div className={className}>
        <LoadingSpinner label="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <EmptyState
          title="Failed to load data"
          message={error}
          icon="⚠️"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={className}>
        <EmptyState
          title="No data available"
          message="Dashboard data is not available at this time."
          icon="📭"
        />
      </div>
    );
  }

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
    <ErrorBoundary title="Tab Error" fallbackMessage="An error occurred while rendering this section.">
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
          <PanelComponent data={data} />
        </React.Suspense>
      </div>
    </ErrorBoundary>
  );
}

TabContentRenderer.propTypes = {
  activeTab: PropTypes.string.isRequired,
  className: PropTypes.string,
};