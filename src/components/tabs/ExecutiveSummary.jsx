import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useData } from '../../context/DataContext';
import { ChartWrapper } from '../charts/ChartWrapper';
import { PerformanceTable } from '../PerformanceTable';
import { InsightPanel } from '../InsightPanel';
import { QuickActionBar } from '../QuickActionBar';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorBoundary } from '../ErrorBoundary';
import { EmptyState } from '../EmptyState';

function RadarChartSection({ radarData }) {
  if (!radarData || !radarData.dimensions || !radarData.regions) {
    return (
      <EmptyState
        title="No radar data"
        message="Regional performance radar data is not available."
        icon="📊"
      />
    );
  }

  const chartData = useMemo(() => {
    return radarData.dimensions.map((dimension, index) => {
      const entry = { dimension };
      radarData.regions.forEach((region) => {
        entry[region.name] = region.data[index];
      });
      return entry;
    });
  }, [radarData]);

  const chartOptions = {
    dimensions: radarData.dimensions,
    datasets: radarData.regions.map((region) => ({
      name: region.name,
      dataKey: region.name,
      color: getRegionColor(region.name),
    })),
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    height: 350,
  };

  return (
    <section aria-label="Regional performance radar comparison">
      <h3 className="text-base font-semibold text-[#323130] mb-4">
        Regional Performance Comparison
      </h3>
      <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
        <ChartWrapper
          chartType="radar"
          data={chartData}
          options={chartOptions}
          title="Regional Performance Radar"
        />
      </div>
    </section>
  );
}

RadarChartSection.propTypes = {
  radarData: PropTypes.shape({
    dimensions: PropTypes.arrayOf(PropTypes.string),
    regions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number),
      })
    ),
  }),
};

function getRegionColor(regionName) {
  const colorMap = {
    Europe: '#4F46E5',
    Americas: '#059669',
    'India (CoE)': '#D97706',
    APAC: '#DC2626',
    'Middle East & Africa': '#7C3AED',
  };
  return colorMap[regionName] || '#605E5C';
}

export function ExecutiveSummary({ className = '' }) {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingSpinner label="Loading executive summary data..." className={className} />;
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`} role="alert">
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
      <div className={`p-6 ${className}`} role="status">
        <EmptyState
          title="No data available"
          message="Executive summary data is not available at this time."
          icon="📭"
        />
      </div>
    );
  }

  const executiveSummary = data.executiveSummary;
  const radarData = executiveSummary?.radarData;
  const regions = executiveSummary?.regions || [];
  const aiSummary = executiveSummary?.aiSummary;
  const quickActions = executiveSummary?.quickActions || [];

  return (
    <ErrorBoundary title="Executive Summary Error" fallbackMessage="An error occurred while rendering the Executive Summary tab.">
      <div className={`p-6 space-y-8 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <RadarChartSection radarData={radarData} />

            <section aria-label="Executive performance summary table">
              <h3 className="text-base font-semibold text-[#323130] mb-4">
                Executive Performance Summary
              </h3>
              <PerformanceTable regions={regions} />
            </section>
          </div>

          <div className="space-y-6">
            {aiSummary && (
              <InsightPanel
                confidence={aiSummary.confidence || 'high'}
                strategicPriorities={aiSummary.strategicPriorities || []}
                executiveActions={aiSummary.executiveActions || []}
                insightBoxes={aiSummary.insightBoxes || []}
                title="Executive Intelligence"
              />
            )}

            {quickActions.length > 0 && (
              <QuickActionBar
                actions={quickActions}
                title="Recommended Actions"
              />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

ExecutiveSummary.propTypes = {
  className: PropTypes.string,
};

export default ExecutiveSummary;