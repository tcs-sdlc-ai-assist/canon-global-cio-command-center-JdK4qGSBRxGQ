import React from 'react';
import PropTypes from 'prop-types';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
  AREA_OPACITY,
} from '../../chart.config';
import { EmptyState } from '../EmptyState';

export function RadarChartComponent({ data, options = {} }) {
  const {
    dimensions = [],
    datasets = [],
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    height,
  } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  if (!dimensions || dimensions.length === 0) {
    return <EmptyState title="No dimensions" message="No dimensions configured for this chart." />;
  }

  if (!datasets || datasets.length === 0) {
    return <EmptyState title="No datasets" message="No datasets configured for this chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <RadarChart data={data} margin={CHART_MARGINS}>
        {showGrid && (
          <PolarGrid
            stroke={CHART_GRID.stroke}
            strokeDasharray={CHART_GRID.strokeDasharray}
            strokeWidth={CHART_GRID.strokeWidth}
          />
        )}
        <PolarAngleAxis
          dataKey="dimension"
          tick={CHART_AXIS.tick}
          axisLine={CHART_AXIS.axisLine}
          tickLine={CHART_AXIS.tickLine}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={CHART_AXIS.tick}
          axisLine={CHART_AXIS.axisLine}
          tickLine={CHART_AXIS.tickLine}
        />
        {showTooltip && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend && <Legend {...CHART_LEGEND} />}
        {datasets.map((dataset, index) => (
          <Radar
            key={dataset.name || index}
            name={dataset.name}
            dataKey={dataset.dataKey || 'value'}
            stroke={dataset.color || CHART_COLORS.categorical[index % CHART_COLORS.categorical.length]}
            fill={dataset.color || CHART_COLORS.categorical[index % CHART_COLORS.categorical.length]}
            fillOpacity={AREA_OPACITY}
            strokeWidth={2}
            {...CHART_ANIMATION}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}

RadarChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    dimensions: PropTypes.arrayOf(PropTypes.string),
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
  }),
};