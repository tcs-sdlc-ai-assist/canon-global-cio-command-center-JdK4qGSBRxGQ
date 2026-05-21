import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useData } from '../../context/DataContext';
import { MetricCard } from '../MetricCard';
import { ChartWrapper } from '../charts/ChartWrapper';
import { InsightPanel } from '../InsightPanel';
import { QuickActionBar } from '../QuickActionBar';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorBoundary } from '../ErrorBoundary';
import { EmptyState } from '../EmptyState';
import { COLORS } from '../../app.config';

function MetricGroup({ title, metrics = [], className = '' }) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section className={className} aria-label={title}>
      <h3 className="text-base font-semibold text-[#323130] mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            trend={metric.trend}
            insight={metric.insight}
            category={metric.category}
          />
        ))}
      </div>
    </section>
  );
}

MetricGroup.propTypes = {
  title: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      prefix: PropTypes.string,
      suffix: PropTypes.string,
      trend: PropTypes.shape({
        direction: PropTypes.oneOf(['up', 'down', 'stable']).isRequired,
        percentage: PropTypes.number.isRequired,
        label: PropTypes.string,
      }),
      insight: PropTypes.string,
      category: PropTypes.oneOf(['business', 'operations', 'risk', 'innovation', 'partnership']),
    })
  ),
  className: PropTypes.string,
};

function PerformanceTrendsChart({ data }) {
  if (!data || !data.months || !data.datasets) {
    return <EmptyState title="No trend data" message="Performance trend data is not available." />;
  }

  const chartData = useMemo(() => {
    return data.months.map((month, index) => {
      const entry = { name: month };
      data.datasets.forEach((dataset) => {
        entry[dataset.name] = dataset.data[index];
      });
      return entry;
    });
  }, [data]);

  const chartOptions = {
    xKey: 'name',
    datasets: data.datasets.map((dataset) => ({
      name: dataset.name,
      dataKey: dataset.name,
      color: dataset.color,
    })),
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    height: 300,
  };

  return (
    <section aria-label="Strategic performance trends">
      <h3 className="text-base font-semibold text-[#323130] mb-4">Strategic Performance Trends</h3>
      <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
        <ChartWrapper
          chartType="line"
          data={chartData}
          options={chartOptions}
          title="Performance Trends (Year-to-Date)"
        />
      </div>
    </section>
  );
}

PerformanceTrendsChart.propTypes = {
  data: PropTypes.shape({
    months: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.number),
        color: PropTypes.string,
      })
    ),
  }),
};

export function StrategicCommand({ className = '' }) {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingSpinner label="Loading strategic command data..." className={className} />;
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
          message="Strategic command data is not available at this time."
          icon="📭"
        />
      </div>
    );
  }

  const strategicCommand = data.strategicCommand;
  const businessImpact = data.businessImpact;
  const riskGovernance = data.riskGovernance;
  const innovation = data.innovation;

  const businessMetrics = businessImpact?.metrics || [];
  const riskMetrics = riskGovernance?.metrics || [];
  const innovationMetrics = innovation?.metrics || [];

  const performanceTrends = strategicCommand?.performanceTrends;
  const quickActions = strategicCommand?.quickActions || [];
  const aiSummary = strategicCommand?.aiSummary;

  return (
    <ErrorBoundary title="Strategic Command Error" fallbackMessage="An error occurred while rendering the Strategic Command tab.">
      <div className={`p-6 space-y-8 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <MetricGroup
              title="Business Impact & Value Creation"
              metrics={businessMetrics}
            />

            <MetricGroup
              title="Risk & Governance"
              metrics={riskMetrics}
            />

            <MetricGroup
              title="Innovation & Future Readiness"
              metrics={innovationMetrics}
            />

            <PerformanceTrendsChart data={performanceTrends} />
          </div>

          <div className="space-y-6">
            {aiSummary && (
              <InsightPanel
                confidence={aiSummary.confidence || 'high'}
                strategicPriorities={aiSummary.strategicPriorities || []}
                executiveActions={aiSummary.executiveActions || []}
                title="AI Intelligence Summary"
              />
            )}

            {quickActions.length > 0 && (
              <QuickActionBar
                actions={quickActions}
                title="Strategic Recommendations"
              />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

StrategicCommand.propTypes = {
  className: PropTypes.string,
};

export default StrategicCommand;