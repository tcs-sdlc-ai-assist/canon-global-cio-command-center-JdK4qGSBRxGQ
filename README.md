# Canon CIO Command Center

Enterprise IT Operations Dashboard — a static frontend MVP for the Canon CIO to monitor business impact, operations, risk & governance, innovation, partnerships, and strategic performance across global regions.

## Overview

The Canon CIO Command Center provides a unified, real-time view of IT operations and strategic initiatives. Built as a single-page application with mock data, it demonstrates the vision for a comprehensive CIO dashboard with AI-powered insights, predictive analytics, and executive decision support.

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite 5** | Build tool and dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **Recharts** | Charting and data visualization |
| **React Router DOM 6** | Client-side routing (future use) |
| **Vitest** | Unit testing framework |
| **Testing Library** | Component testing utilities |
| **PropTypes** | Runtime prop validation |
| **clsx** | Conditional class name utility |

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+

## Getting Started

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000) with hot module replacement.

### Build for production

```bash
npm run build
```

Outputs to `dist/` with optimized bundles and source maps.

### Preview production build

```bash
npm run preview
```

### Run tests

```bash
npm test
```

Runs all tests with Vitest in headless mode.

### Watch tests

```bash
npm run test:watch
```

## Project Structure

```
src/
├── App.jsx                          # Root component with auth routing
├── App.test.jsx                     # App integration tests
├── app.config.js                    # Application-wide constants (brand, colors, tabs, navigation)
├── chart.config.js                  # Recharts configuration (colors, grids, tooltips, legends)
├── index.css                        # Tailwind imports and global styles
├── main.jsx                         # Entry point — renders <App /> in StrictMode
├── setupTests.js                    # Test setup (jest-dom matchers)
├── components/
│   ├── ActionChip.jsx               # Clickable chip that opens chat drawer
│   ├── AIPulseIndicator.jsx         # Animated pulse dot for AI insights
│   ├── AppShell.jsx                 # Main authenticated layout (header, tabs, content, chat, toasts, modal)
│   ├── ContentOutlet.jsx            # Lazy-loaded tab panel renderer (legacy)
│   ├── EmptyState.jsx               # Empty/no-data placeholder component
│   ├── ErrorBoundary.jsx            # Class-based error boundary with retry
│   ├── ExportButton.jsx             # CSV export button with loading state
│   ├── Header.jsx                   # Top navigation bar with user info and logout
│   ├── InsightPanel.jsx             # AI intelligence panel with priorities, actions, insight boxes
│   ├── LoadingSpinner.jsx           # Animated loading spinner with label
│   ├── LoginPage.jsx                # Mock login form with validation
│   ├── LoginPage.test.jsx           # Login page tests
│   ├── MetricCard.jsx               # KPI card with value, trend, insight, category border
│   ├── MetricCard.test.jsx          # Metric card tests
│   ├── PerformanceTable.jsx         # Regional performance summary table
│   ├── PredictiveModal.jsx          # Full-screen predictive analysis modal
│   ├── QuickActionBar.jsx           # AI-recommended quick action chips
│   ├── StatusBadge.jsx              # Status indicator (excellent/good/warning/critical)
│   ├── TabContentRenderer.jsx       # Tab panel renderer with loading/error/empty states
│   ├── TabNavigation.jsx            # Horizontal tab bar with keyboard navigation
│   ├── Toast.jsx                    # Individual toast notification
│   ├── ToastContainer.jsx           # Toast stack container
│   ├── charts/
│   │   ├── BarChartComponent.jsx    # Bar chart wrapper (legacy)
│   │   ├── ChartWrapper.jsx         # Unified chart component (bar, line, radar, doughnut, dual-axis)
│   │   ├── DoughnutChartComponent.jsx # Doughnut chart wrapper (legacy)
│   │   ├── DualAxisChartComponent.jsx # Dual-axis chart wrapper (legacy)
│   │   ├── LineChartComponent.jsx   # Line chart wrapper (legacy)
│   │   └── RadarChartComponent.jsx  # Radar chart wrapper (legacy)
│   ├── chat/
│   │   ├── AIChatDrawer.jsx         # Floating chat drawer with toggle button
│   │   ├── AIChatDrawer.test.jsx    # Chat drawer tests
│   │   ├── ChatInput.jsx            # Chat input with auto-resize and character limit
│   │   └── ChatMessage.jsx          # Chat message bubble (user/assistant)
│   └── tabs/
│       ├── BusinessImpact.jsx       # Business Impact tab content
│       ├── ExecutiveSummary.jsx     # Executive Summary tab content
│       ├── Innovation.jsx           # Innovation tab content
│       ├── Operations.jsx           # Operations tab content
│       ├── Partnerships.jsx         # Partnerships tab content
│       ├── RiskGovernance.jsx       # Risk & Governance tab content
│       └── StrategicCommand.jsx     # Strategic Command tab content
├── context/
│   ├── AuthContext.jsx              # Authentication state and login/logout
│   ├── DataContext.jsx              # Dashboard data loading with retry
│   └── UIProvider.jsx               # UI state (chat drawer, toasts, predictive modal)
├── data/
│   ├── ai-chat-responses.json       # Chat response patterns
│   ├── business-impact.json         # Business impact metrics and chart data
│   ├── executive-summary.json       # Regional performance and radar data
│   ├── innovation.json              # Innovation metrics and portfolio distribution
│   ├── operations.json              # Operations metrics and incident trends
│   ├── partnerships.json            # Partnership metrics, timeline, and AI summary
│   ├── predictive-analysis.json     # Forecast metrics, scenarios, and risks
│   ├── risk-governance.json         # Risk & governance metrics
│   ├── strategic-command.json       # Strategic metrics, trends, and AI summary
│   └── user.json                    # Static user profile
└── services/
    ├── chatEngine.js                # Keyword-based chat response matching
    ├── chatEngine.test.js           # Chat engine tests
    ├── csvGenerator.js              # CSV generation and download
    └── logger.js                    # Structured logging with levels
```

## Authentication

The MVP uses mock authentication. Any valid email format and password combination will work.

**Default credentials for demo:**
- Email: `martin.deweerdt@canon.com`
- Password: any value (e.g., `password123`)

## Key Features

### Dashboard Tabs
- **Overview** — Strategic Command view with cross-domain metrics and performance trends
- **Infrastructure** — Operations metrics, incident trends, and system health
- **Security** — Risk & Governance metrics, compliance scores, and cybersecurity posture
- **Applications** — Business Impact metrics and value creation charts
- **Compliance** — Risk & Governance deep dive
- **Budget & Resources** — Business Impact cost metrics
- **Team** — Innovation metrics and skills readiness
- **Reports** — Executive Summary with regional performance comparison

### AI Command Assistant
Floating chat drawer accessible from any tab. Ask questions about dashboard metrics, regional performance, partnerships, and strategic insights. Supports natural language queries with keyword matching.

### Predictive Analysis
Full-screen modal with forecast metrics, scenario analysis (optimistic/baseline/conservative), and key risks with mitigations.

### Data Export
Export all dashboard metrics as CSV with a single click. Includes loading state and success/error notifications.

## Architecture Decisions

### Static Data
All dashboard data is stored in JSON files under `src/data/`. This enables rapid prototyping without backend dependencies. The `DataContext` loads all data files in parallel on authentication.

### Context-Based State Management
Three React contexts manage global state:
- **AuthContext** — Authentication state and user profile
- **DataContext** — Dashboard data loading, caching, and retry
- **UIProvider** — UI state (chat drawer, toasts, predictive modal)

### Lazy-Loaded Tab Panels
Each tab panel is lazy-loaded using `React.lazy()` and `React.Suspense` to reduce initial bundle size. Tab panels receive data via the `useData` hook.

### Chart Abstraction
The `ChartWrapper` component provides a unified interface for five chart types (bar, line, radar, doughnut, dual-axis) with consistent styling from `chart.config.js`.

### Accessibility
- Semantic HTML with proper ARIA roles and labels
- Keyboard navigation for tabs (ArrowLeft/ArrowRight, Home, End)
- Focus management for modals and drawers
- Screen reader announcements for dynamic content

## Environment Variables

This static frontend requires no environment variables. All configuration is handled via constants in `src/app.config.js`.

If you need to add environment variables in the future, define them in `.env` with the `VITE_` prefix (e.g., `VITE_API_URL=https://api.example.com`).

## License

Internal use — Canon Inc.