/**
 * Application-wide configuration constants
 * @module app.config
 */

/** Brand information */
export const BRAND = {
  NAME: 'Canon CIO Command Center',
  SHORT_NAME: 'CIO Command Center',
  TAGLINE: 'Enterprise IT Operations Dashboard',
};

/** User information (static for MVP) */
export const USER = {
  NAME: 'John Smith',
  ROLE: 'CIO',
  EMAIL: 'john.smith@canon.com',
  AVATAR_URL: null,
};

/** Color theme constants */
export const COLORS = {
  PRIMARY: '#0070C0',
  SECONDARY: '#00A4EF',
  SUCCESS: '#107C10',
  WARNING: '#FF8C00',
  DANGER: '#D13438',
  NEUTRAL: '#605E5C',
  BACKGROUND: '#F3F2F1',
  SURFACE: '#FFFFFF',
  TEXT_PRIMARY: '#323130',
  TEXT_SECONDARY: '#605E5C',
  BORDER: '#EDEBE9',
};

/** Tab definitions */
export const TABS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'infrastructure', label: 'Infrastructure', icon: 'server' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'applications', label: 'Applications', icon: 'apps' },
  { id: 'compliance', label: 'Compliance', icon: 'checklist' },
  { id: 'budget', label: 'Budget & Resources', icon: 'currency' },
  { id: 'team', label: 'Team', icon: 'people' },
  { id: 'reports', label: 'Reports', icon: 'chart' },
];

/** Default tab ID */
export const DEFAULT_TAB_ID = 'overview';

/** Navigation configuration */
export const NAVIGATION = {
  SIDEBAR_WIDTH: 260,
  HEADER_HEIGHT: 48,
  TRANSITION_DURATION: 200,
};

/** API configuration (placeholder for future use) */
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || '',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

/** Application metadata */
export const APP_META = {
  VERSION: '1.0.0',
  BUILD_DATE: '2024-01-15',
  ENVIRONMENT: import.meta.env.MODE || 'development',
};