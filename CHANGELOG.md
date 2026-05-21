# Changelog

## [1.0.0] - 2025-01-15

### Added

#### Core Architecture
- React 18 single-page application with Vite 5 build tool
- Context-based state management with three providers (AuthContext, DataContext, UIProvider)
- Lazy-loaded tab panels with React.Suspense for code splitting
- Error boundaries with retry capability for graceful error handling
- PropTypes runtime validation across all components
- Structured logging service with multiple log levels (INFO, WARN, ERROR, EVENT)

#### Authentication
- Mock authentication system with email/password validation
- Login page with form validation, loading states, and error handling
- Default credentials: martin.deweerdt@canon.com / any password
- Logout functionality with state cleanup

#### Dashboard Tabs
- **Overview** — Strategic Command view with cross-domain metrics and performance trends
- **Infrastructure** — Operations metrics, incident trends, and system health
- **Security** — Risk & Governance metrics, compliance scores, and cybersecurity posture
- **Applications** — Business Impact metrics and value creation charts
- **Compliance** — Risk & Governance deep dive
- **Budget & Resources** — Business Impact cost metrics
- **Team** — Innovation metrics and skills readiness
- **Reports** — Executive Summary with regional performance comparison

#### Data Visualization
- Five chart types via unified ChartWrapper component (bar, line, radar, doughnut, dual-axis)
- Recharts integration with consistent styling from chart.config.js
- Responsive containers with ResizeObserver for dynamic sizing
- Chart skeleton loading states and error fallbacks
- Animation support with configurable duration and easing

#### AI Command Assistant
- Floating chat drawer accessible from any tab
- Keyword-based response matching engine with 13+ intent patterns
- Welcome message with suggestion chips (Q4 Board Summary, TCS Partnership, Regional Performance)
- Typing indicator during AI response processing
- Unread message count badge on toggle button
- Auto-resize textarea with 1000 character limit
- Keyboard navigation (Escape to close, Enter to send)

#### Predictive Analysis
- Full-screen modal with 8 forecast metrics (revenue, cost, innovation, AI, security, availability, transformation, sustainability)
- Three scenario analyses (optimistic, baseline, conservative) with probability weights
- Key risks with impact levels and mitigation strategies
- Confidence badges and impact badges with color coding
- Focus trap and keyboard navigation (Escape to close, Tab cycling)

#### Data Export
- CSV generation from all dashboard metrics
- Download with date-stamped filename
- Loading state with spinner during export
- Success/error toast notifications
- Proper CSV escaping for special characters

#### UI Components
- MetricCard with trend arrows, AI insight dots, category border colors, and hover effects
- StatusBadge with four states (excellent, good, warning, critical)
- ActionChip with three variants (primary, secondary, insight)
- QuickActionBar for strategic recommendations
- InsightPanel with confidence badges, strategic priorities, and executive actions
- PerformanceTable with regional comparison and score color coding
- Toast notifications with four types (success, error, info, warning) and auto-dismiss
- LoadingSpinner with three sizes (sm, md, lg)
- EmptyState with customizable icon, title, and message
- AIPulseIndicator with periodic animation restart

#### Accessibility
- Semantic HTML with proper ARIA roles and labels
- Keyboard navigation for tabs (ArrowLeft/ArrowRight, Home, End)
- Focus management for modals and drawers
- Screen reader announcements for dynamic content
- Proper aria-live regions for chat and notifications

#### Testing
- Vitest test runner with jsdom environment
- Component tests for LoginPage, MetricCard, AIChatDrawer, and App
- Service tests for chatEngine with comprehensive keyword matching
- Test coverage thresholds at 80% (branches, functions, lines, statements)
- Mocked contexts and services for isolated component testing

### Technical Details

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS 3 with Urbanist font
- **Charts**: Recharts (via ChartWrapper abstraction)
- **Routing**: React Router DOM 6 (prepared for future use)
- **Testing**: Vitest 1.0.0 with Testing Library
- **State Management**: React Context API (3 contexts)
- **Data Source**: Static JSON files under src/data/

### Known Limitations

- All dashboard data is static JSON — no backend API integration
- Chat responses use keyword matching, not AI/ML
- Authentication is mock-only with no real credential validation
- No persistent state — data resets on page refresh
- No real-time updates or WebSocket connections
- Limited to desktop viewports (no mobile optimization)
- No internationalization/i18n support
- No dark mode support
- No offline capability or service worker
- No performance monitoring or analytics integration

### Project Structure

```
src/
├── App.jsx                          # Root component with auth routing
├── app.config.js                    # Application-wide constants
├── chart.config.js                  # Recharts configuration
├── index.css                        # Tailwind imports and global styles
├── main.jsx                         # Entry point
├── components/                      # 25+ React components
├── context/                         # 3 context providers
├── data/                            # 9 JSON data files
├── services/                        # 3 service modules
└── tabs/                            # 8 tab panel components
```

### Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Watch tests
npm run test:watch
```

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+