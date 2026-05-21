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

function PartnershipTimelineChart({ data }) {
  if (!data || !data.years || !data.investment || !data.valueDelivered) {
    return <EmptyState title="No timeline data" message="Partnership timeline data is not available." />;
  }

  const chartData = useMemo(() => {
    return data.years.map((year, index) => ({
      name: year,
      investment: data.investment[index] || 0,
      valueDelivered: data.valueDelivered[index] || 0,
    }));
  }, [data]);

  const chartOptions = {
    xKey: 'name',
    leftYKey: 'investment',
    rightYKey: 'valueDelivered',
    leftColor: '#0070C0',
    rightColor: '#107C10',
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    height: 300,
  };

  return (
    <section aria-label="Partnership investment and value timeline chart">
      <h3 className="text-base font-semibold text-[#323130] mb-4">Partnership Investment & Value Timeline</h3>
      <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
        <ChartWrapper
          chartType="dual-axis"
          data={chartData}
          options={chartOptions}
          title="Investment vs Value Delivered (€ millions)"
        />
      </div>
    </section>
  );
}

PartnershipTimelineChart.propTypes = {
  data: PropTypes.shape({
    years: PropTypes.arrayOf(PropTypes.string),
    investment: PropTypes.arrayOf(PropTypes.number),
    valueDelivered: PropTypes.arrayOf(PropTypes.number),
    unit: PropTypes.string,
  }),
};

export function Partnerships({ className = '' }) {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingSpinner label="Loading partnership data..." className={className} />;
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
          message="Partnership data is not available at this time."
          icon="📭"
        />
      </div>
    );
  }

  const partnerships = data.partnerships;
  const metrics = partnerships?.metrics || [];
  const timeline = partnerships?.timeline;
  const aiSummary = partnerships?.aiSummary;

  const insightBoxes = [];
  const executiveActions = [];

  if (aiSummary) {
    if (aiSummary.performanceExcellence) {
      insightBoxes.push({
        id: 'prt-insight-performance',
        title: aiSummary.performanceExcellence.title || 'Performance Excellence',
        narrative: aiSummary.performanceExcellence.narrative || '',
        metrics: aiSummary.performanceExcellence.metrics || {},
        actions: aiSummary.performanceExcellence.actions || [],
      });
    }

    if (aiSummary.expansionOpportunity) {
      insightBoxes.push({
        id: 'prt-insight-expansion',
        title: aiSummary.expansionOpportunity.title || 'Expansion Opportunity',
        narrative: aiSummary.expansionOpportunity.narrative || '',
        metrics: aiSummary.expansionOpportunity.metrics || {},
        actions: aiSummary.expansionOpportunity.actions || [],
      });
    }

    if (aiSummary.actionChips && Array.isArray(aiSummary.actionChips)) {
      aiSummary.actionChips.forEach((chip) => {
        executiveActions.push({
          id: chip.id || `prt-ea-${chip.label}`,
          label: chip.label,
          icon: chip.icon,
        });
      });
    }
  }

  return (
    <ErrorBoundary title="Partnerships Error" fallbackMessage="An error occurred while rendering the Partnerships tab.">
      <div className={`p-6 space-y-8 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <MetricGroup
              title="Partnership Metrics"
              metrics={metrics}
            />

            <PartnershipTimelineChart data={timeline} />
          </div>

          <div className="space-y-6">
            <InsightPanel
              confidence="high"
              strategicPriorities={[
                'Maximize TCS partnership ROI through contract renegotiation and expanded scope.',
                'Accelerate joint AI/ML initiatives to capture 340% ROI potential.',
              ]}
              executiveActions={executiveActions}
              insightBoxes={insightBoxes}
              title="Partnership Intelligence"
            />

            <QuickActionBar
              actions={[
                { id: 'prt-qa-1', label: 'Business Case', variant: 'primary' },
                { id: 'prt-qa-2', label: 'Contract Strategy', variant: 'secondary' },
                { id: 'prt-qa-3', label: 'Board Approval', variant: 'secondary' },
              ]}
              title="Recommended Actions"
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

Partnerships.propTypes = {
  className: PropTypes.string,
};

export default Partnerships;