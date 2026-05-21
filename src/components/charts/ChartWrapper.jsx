import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';
import { ErrorBoundary } from '../ErrorBoundary';
import { LoadingSpinner } from '../LoadingSpinner';
import { EmptyState } from '../EmptyState';
import {
  CHART_MARGINS,
  CHART_GRID,
  CHART_AXIS,
  CHART_TOOLTIP,
  CHART_LEGEND,
  CHART_ANIMATION,
  CHART_COLORS,
  BAR_SIZE,
  DONUT_INNER_RATIO,
  LINE_DOT,
  AREA_OPACITY,
} from '../../chart.config';

const CHART_TYPES = {
  BAR: 'bar',
  LINE: 'line',
  RADAR: 'radar',
  DOUGHNUT: 'doughnut',
  DUAL_AXIS: 'dual-axis',
};

function ChartErrorFallback({ message }) {
  return (
    <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-lg border border-gray-200" role="alert">
      <div className="text-center p-4">
        <div className="text-2xl mb-2" aria-hidden="true">📊</div>
        <p className="text-sm text-gray-500">{message || 'Chart could not be rendered.'}</p>
      </div>
    </div>
  );
}

ChartErrorFallback.propTypes = {
  message: PropTypes.string,
};

function ChartSkeleton({ height }) {
  return (
    <div
      className="bg-gray-50 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center"
      style={{ height: height || 300 }}
      aria-hidden="true"
    >
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200" />
        <div className="h-3 w-32 mx-auto bg-gray-200 rounded" />
      </div>
    </div>
  );
}

ChartSkeleton.propTypes = {
  height: PropTypes.number,
};

function useChartResize(containerRef) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  return dimensions;
}

function BarChartComponent({ data, options }) {
  const { xKey = 'name', yKey = 'value', color, colors, showGrid, showLegend, showTooltip, barSize, height } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  const chartColors = colors || (color ? [color] : CHART_COLORS.categorical);

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <BarChart data={data} margin={CHART_MARGINS}>
        {showGrid !== false && <CartesianGrid {...CHART_GRID} />}
        <XAxis dataKey={xKey} {...CHART_AXIS} />
        <YAxis {...CHART_AXIS} />
        {showTooltip !== false && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend !== false && <Legend {...CHART_LEGEND} />}
        <Bar
          dataKey={yKey}
          fill={chartColors[0] || CHART_COLORS.primary}
          barSize={barSize || BAR_SIZE}
          radius={[4, 4, 0, 0]}
          {...CHART_ANIMATION}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

BarChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    xKey: PropTypes.string,
    yKey: PropTypes.string,
    color: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string),
    showGrid: PropTypes.bool,
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    barSize: PropTypes.number,
    height: PropTypes.number,
  }),
};

function LineChartComponent({ data, options }) {
  const { xKey = 'name', yKey = 'value', color, showGrid, showLegend, showTooltip, height, dot } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  const lineColor = color || CHART_COLORS.primary;

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <LineChart data={data} margin={CHART_MARGINS}>
        {showGrid !== false && <CartesianGrid {...CHART_GRID} />}
        <XAxis dataKey={xKey} {...CHART_AXIS} />
        <YAxis {...CHART_AXIS} />
        {showTooltip !== false && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend !== false && <Legend {...CHART_LEGEND} />}
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={dot !== false ? { ...LINE_DOT, fill: lineColor, stroke: lineColor } : false}
          activeDot={{ r: 6, fill: lineColor, stroke: '#fff', strokeWidth: 2 }}
          {...CHART_ANIMATION}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

LineChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    xKey: PropTypes.string,
    yKey: PropTypes.string,
    color: PropTypes.string,
    showGrid: PropTypes.bool,
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    height: PropTypes.number,
    dot: PropTypes.bool,
  }),
};

function RadarChartComponent({ data, options }) {
  const { dimensions = [], datasets = [], showLegend, showTooltip, height } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  const chartData = data;
  const chartDatasets = datasets;

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <RadarChart data={chartData} margin={CHART_MARGINS}>
        <PolarGrid stroke={CHART_GRID.stroke} strokeDasharray={CHART_GRID.strokeDasharray} />
        <PolarAngleAxis dataKey="dimension" {...CHART_AXIS} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} {...CHART_AXIS} />
        {showTooltip !== false && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend !== false && <Legend {...CHART_LEGEND} />}
        {chartDatasets.map((dataset, index) => (
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
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    height: PropTypes.number,
  }),
};

function DoughnutChartComponent({ data, options }) {
  const { nameKey = 'name', valueKey = 'value', colors, showLegend, showTooltip, height, innerRadius } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  const chartColors = colors || CHART_COLORS.categorical;

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <PieChart margin={CHART_MARGINS}>
        {showTooltip !== false && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend !== false && <Legend {...CHART_LEGEND} />}
        <Pie
          data={data}
          nameKey={nameKey}
          dataKey={valueKey}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius || `${DONUT_INNER_RATIO * 50}%`}
          outerRadius="80%"
          paddingAngle={2}
          {...CHART_ANIMATION}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || chartColors[index % chartColors.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

DoughnutChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    nameKey: PropTypes.string,
    valueKey: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string),
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    height: PropTypes.number,
    innerRadius: PropTypes.string,
  }),
};

function DualAxisChartComponent({ data, options }) {
  const {
    xKey = 'name',
    leftYKey = 'value',
    rightYKey = 'value2',
    leftColor,
    rightColor,
    showGrid,
    showLegend,
    showTooltip,
    height,
  } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  const leftLineColor = leftColor || CHART_COLORS.primary;
  const rightBarColor = rightColor || CHART_COLORS.secondary;

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <ComposedChart data={data} margin={CHART_MARGINS}>
        {showGrid !== false && <CartesianGrid {...CHART_GRID} />}
        <XAxis dataKey={xKey} {...CHART_AXIS} />
        <YAxis yAxisId="left" {...CHART_AXIS} />
        <YAxis yAxisId="right" orientation="right" {...CHART_AXIS} />
        {showTooltip !== false && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend !== false && <Legend {...CHART_LEGEND} />}
        <Bar
          yAxisId="left"
          dataKey={leftYKey}
          fill={leftLineColor}
          barSize={BAR_SIZE}
          radius={[4, 4, 0, 0]}
          {...CHART_ANIMATION}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey={rightYKey}
          stroke={rightBarColor}
          strokeWidth={2}
          dot={{ ...LINE_DOT, fill: rightBarColor, stroke: rightBarColor }}
          activeDot={{ r: 6, fill: rightBarColor, stroke: '#fff', strokeWidth: 2 }}
          {...CHART_ANIMATION}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

DualAxisChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    xKey: PropTypes.string,
    leftYKey: PropTypes.string,
    rightYKey: PropTypes.string,
    leftColor: PropTypes.string,
    rightColor: PropTypes.string,
    showGrid: PropTypes.bool,
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    height: PropTypes.number,
  }),
};

const chartRenderers = {
  [CHART_TYPES.BAR]: BarChartComponent,
  [CHART_TYPES.LINE]: LineChartComponent,
  [CHART_TYPES.RADAR]: RadarChartComponent,
  [CHART_TYPES.DOUGHNUT]: DoughnutChartComponent,
  [CHART_TYPES.DUAL_AXIS]: DualAxisChartComponent,
};

export function ChartWrapper({
  chartType,
  data,
  options = {},
  className = '',
  isLoading = false,
  error = null,
  height,
  title,
}) {
  const containerRef = useRef(null);
  const dimensions = useChartResize(containerRef);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setIsReady(true);
    }
  }, [dimensions]);

  if (!chartType || !chartRenderers[chartType]) {
    return (
      <ChartErrorFallback message={`Unknown chart type: "${chartType}". Supported types: ${Object.values(CHART_TYPES).join(', ')}.`} />
    );
  }

  if (error) {
    return <ChartErrorFallback message={error} />;
  }

  if (isLoading) {
    return <ChartSkeleton height={height} />;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <EmptyState title={title || 'No chart data'} message="No data available for this chart." />;
  }

  const ChartComponent = chartRenderers[chartType];

  return (
    <ErrorBoundary title="Chart Error" fallbackMessage="An error occurred while rendering this chart.">
      <div
        ref={containerRef}
        className={`relative w-full ${className}`}
        role="img"
        aria-label={title || `${chartType} chart`}
        style={{ minHeight: height || 300 }}
      >
        {title && (
          <h4 className="text-sm font-semibold text-[#323130] mb-3">{title}</h4>
        )}
        {!isReady && <ChartSkeleton height={height} />}
        <div style={{ visibility: isReady ? 'visible' : 'hidden', height: isReady ? 'auto' : 0 }}>
          <ChartComponent data={data} options={{ ...options, height }} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

ChartWrapper.propTypes = {
  chartType: PropTypes.oneOf(Object.values(CHART_TYPES)).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object,
  ]).isRequired,
  options: PropTypes.shape({
    xKey: PropTypes.string,
    yKey: PropTypes.string,
    nameKey: PropTypes.string,
    valueKey: PropTypes.string,
    leftYKey: PropTypes.string,
    rightYKey: PropTypes.string,
    color: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string),
    leftColor: PropTypes.string,
    rightColor: PropTypes.string,
    dimensions: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(PropTypes.object),
    showGrid: PropTypes.bool,
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    barSize: PropTypes.number,
    innerRadius: PropTypes.string,
    dot: PropTypes.bool,
    height: PropTypes.number,
  }),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  height: PropTypes.number,
  title: PropTypes.string,
};