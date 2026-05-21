import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CHART_MARGINS,
  CHART_GRID,
  CHART_AXIS,
  CHART_TOOLTIP,
  CHART_LEGEND,
  CHART_ANIMATION,
  CHART_COLORS,
  BAR_SIZE,
} from '../../chart.config';
import { EmptyState } from '../EmptyState';

export function BarChartComponent({ data, options = {} }) {
  const {
    xKey = 'name',
    datasets = [],
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    height,
    barSize,
    stacked = false,
  } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  if (!datasets || datasets.length === 0) {
    return <EmptyState title="No datasets" message="No datasets configured for this chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <BarChart data={data} margin={CHART_MARGINS}>
        {showGrid && <CartesianGrid {...CHART_GRID} />}
        <XAxis dataKey={xKey} {...CHART_AXIS} />
        <YAxis {...CHART_AXIS} />
        {showTooltip && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend && <Legend {...CHART_LEGEND} />}
        {datasets.map((dataset, index) => (
          <Bar
            key={dataset.name || index}
            dataKey={dataset.dataKey || 'value'}
            name={dataset.name}
            fill={dataset.color || CHART_COLORS.categorical[index % CHART_COLORS.categorical.length]}
            barSize={barSize || BAR_SIZE}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
            {...CHART_ANIMATION}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

BarChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    xKey: PropTypes.string,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        dataKey: PropTypes.string,
        color: PropTypes.string,
      })
    ),
    showGrid: PropTypes.bool,
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    height: PropTypes.number,
    barSize: PropTypes.number,
    stacked: PropTypes.bool,
  }),
};