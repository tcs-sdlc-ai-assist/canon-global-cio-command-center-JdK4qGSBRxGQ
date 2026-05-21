import { COLORS } from './app.config';

/** @type {import('recharts').CSSObject} */
export const CHART_FONTS = {
  fontFamily: "'Urbanist', 'Segoe UI', -apple-system, sans-serif",
  fontSize: 12,
};

/** Color palette for chart series */
export const CHART_COLORS = {
  primary: COLORS.PRIMARY,
  secondary: COLORS.SECONDARY,
  success: COLORS.SUCCESS,
  warning: COLORS.WARNING,
  danger: COLORS.DANGER,
  neutral: COLORS.NEUTRAL,
  /** Sequential palette for categorical data */
  categorical: [
    COLORS.PRIMARY,
    COLORS.SECONDARY,
    COLORS.SUCCESS,
    COLORS.WARNING,
    COLORS.DANGER,
    '#6264A7',
    '#CA5010',
    '#498205',
    '#8764B8',
    '#038387',
  ],
  /** Diverging palette for heatmaps and ranges */
  diverging: [
    '#D13438',
    '#E74856',
    '#F3F2F1',
    '#00A4EF',
    '#0070C0',
  ],
};

/** Grid style configuration */
export const CHART_GRID = {
  strokeDasharray: '3 3',
  stroke: COLORS.BORDER,
  strokeWidth: 1,
  vertical: false,
};

/** Axis style configuration */
export const CHART_AXIS = {
  tick: {
    ...CHART_FONTS,
    fill: COLORS.TEXT_SECONDARY,
  },
  axisLine: {
    stroke: COLORS.BORDER,
    strokeWidth: 1,
  },
  tickLine: {
    stroke: COLORS.BORDER,
    strokeWidth: 1,
  },
};

/** Tooltip style configuration */
export const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: COLORS.SURFACE,
    border: `1px solid ${COLORS.BORDER}`,
    borderRadius: 4,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    ...CHART_FONTS,
  },
  labelStyle: {
    fontWeight: 600,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
};

/** Legend style configuration */
export const CHART_LEGEND = {
  wrapperStyle: {
    ...CHART_FONTS,
    color: COLORS.TEXT_SECONDARY,
  },
  iconType: 'circle',
  iconSize: 8,
  verticalAlign: 'bottom',
};

/** Default chart margins */
export const CHART_MARGINS = {
  top: 10,
  right: 10,
  bottom: 5,
  left: 0,
};

/** Responsive container aspect ratio (width/height) */
export const CHART_ASPECT_RATIO = 16 / 9;

/** Animation configuration */
export const CHART_ANIMATION = {
  isAnimationActive: true,
  animationDuration: 500,
  animationEasing: 'ease-out',
};

/** Bar chart default bar size */
export const BAR_SIZE = 24;

/** Donut/Radial chart inner radius ratio (relative to outer radius) */
export const DONUT_INNER_RATIO = 0.6;

/** Line chart default dot configuration */
export const LINE_DOT = {
  r: 4,
  strokeWidth: 2,
  fill: COLORS.SURFACE,
};

/** Area chart default fill opacity */
export const AREA_OPACITY = 0.15;