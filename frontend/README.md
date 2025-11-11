# Frontend - Energy Efficiency Tracker

Modern React application to visualize and manage building energy efficiency data.

## 🚀 Features

- **Intuitive interface** with modern design
- **Validated forms** for data input
- **Interactive dashboard** with real-time metrics
- **Dynamic charts** with Recharts
- **Responsive design** for mobile and desktop
- **Efficient state management**
- **API integration** with Axios

## 📦 Technologies

- **React 18.2.0** - UI Framework
- **Vite 5.0.11** - Build tool and dev server
- **Recharts 2.10.4** - Charts library
- **Axios 1.6.5** - HTTP client
- **CSS3** - Custom styles

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm
- Backend running on `http://localhost:8000`

### Steps

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

4. **Run in development mode:**

```bash
npm run dev
```

Application will be available at: `http://localhost:5173`

5. **Build for production:**

```bash
npm run build
```

Files will be generated in `dist/`

6. **Preview the build:**

```bash
npm run preview
```

## 🏗️ Project Structure

```
frontend/src/
├── components/
│   ├── EfficiencyCalculator/
│   │   ├── index.jsx                # Main component
│   │   ├── CalculatorForm.jsx       # Building form
│   │   ├── PeriodInput.jsx          # Period input
│   │   └── EfficiencyCalculator.css # Styles
│   │
│   ├── EfficiencyDashboard/
│   │   ├── index.jsx                # Main component
│   │   ├── SummaryCards.jsx         # Summary cards
│   │   ├── PeriodBreakdown.jsx      # Period breakdown
│   │   ├── EfficiencyChart.jsx      # Charts
│   │   └── EfficiencyDashboard.css  # Styles
│   │
│   └── BuildingSelector/
│       ├── index.jsx                # Building selector
│       └── BuildingSelector.css     # Styles
│
├── services/
│   └── api.js                       # API client
│
├── App.jsx                          # Root component
├── App.css                          # App styles
├── main.jsx                         # Entry point
└── index.css                        # Global styles
```

## 🎨 Main Components

### 1. EfficiencyCalculator

**Purpose:** Form to calculate energy efficiency

**Props:**
- `onCalculationComplete(result)` - Callback when calculation completes

**Features:**
- Form validation
- Sample data loading
- Input for 3 operational periods
- Error handling
- Loading states

**Usage:**
```jsx
<EfficiencyCalculator 
  onCalculationComplete={(result) => console.log(result)}
/>
```

### 2. EfficiencyDashboard

**Purpose:** Metrics and results visualization

**Props:**
- `buildingId` - Building ID to display
- `initialData` - Initial data (optional)

**Features:**
- Summary cards with KPIs
- Interactive charts (bar and pie)
- Detailed period breakdown
- Visual consumption comparison
- Data refresh

**Usage:**
```jsx
<EfficiencyDashboard 
  buildingId="60f7b3b3e4b0f3d4c8b4567a"
  initialData={calculationResult}
/>
```

### 3. BuildingSelector

**Purpose:** Building selector to view information

**Props:**
- `onBuildingSelect(buildingId)` - Callback on building selection

**Features:**
- ObjectId validation
- Sample buildings
- Search by ID
- User-friendly UI

**Usage:**
```jsx
<BuildingSelector 
  onBuildingSelect={(id) => console.log(id)}
/>
```

### 4. SummaryCards

**Purpose:** Cards with main metrics

**Props:**
- `summary` - Object with summary data

**Features:**
- KPI visualization
- Dynamic colors based on grade
- Representative icons
- Responsive layout

### 5. PeriodBreakdown

**Purpose:** Detailed breakdown by period

**Props:**
- `periods` - Array of periods with metrics

**Features:**
- Cards per period
- Savings metrics
- Comparison bars
- Performance grades

### 6. EfficiencyChart

**Purpose:** Graphical data visualization

**Props:**
- `periods` - Array of periods to graph

**Features:**
- Bar chart: Comparison of improvements
- Pie chart: Savings distribution
- Custom tooltips
- Responsive

## 🔌 API Service

### `services/api.js`

Axios client configured to communicate with the backend.

**Available functions:**

```javascript
// Health check
checkHealth()

// Calculate efficiency
calculateEfficiency(data)

// Get building calculations
getBuildingCalculations(buildingId)

// Get calculations by period
getBuildingPeriodCalculations(buildingId, period)

// Get building summary
getBuildingSummary(buildingId)
```

**Usage example:**

```javascript
import { calculateEfficiency } from './services/api';

const data = {
  building_id: '60f7b3b3e4b0f3d4c8b4567a',
  measure_name: 'HVAC Upgrade',
  periods: [...]
};

try {
  const result = await calculateEfficiency(data);
  console.log(result);
} catch (error) {
  console.error('Error:', error);
}
```

## 🎨 Design System

### CSS Variables

```css
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --background: #f8fafc;
  --card-background: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
```

### Utility Classes

```css
.btn              /* Base button */
.btn-primary      /* Primary button */
.card             /* Card */
.loading          /* Loading spinner */
.error-message    /* Error message */
.success-message  /* Success message */
.grid-2           /* 2-column grid */
.grid-3           /* 3-column grid */
```

## 📊 Data Visualization

### Bar Chart

Shows comparison of efficiency improvements by period:
- Electric Improvement (%)
- Gas Improvement (%)
- Overall Improvement (%)

### Pie Chart

Shows cost savings distribution across periods:
- Business Hours
- After Hours
- Weekend

## 🔄 Data Flow

```
User enters data
      ↓
Frontend validation
      ↓
POST /api/efficiency/calculate
      ↓
Backend processes and saves
      ↓
Response with results
      ↓
Dashboard displays data
      ↓
Charts rendered
```

## 🎯 UX Features

### Loading States

- Spinner during calculations
- Visual indicators on buttons
- Skeleton loaders (future)

### Error Handling

- Descriptive messages
- Real-time validation
- Optional automatic retry

### Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 1024px
- Adaptive grid
- Touch-friendly

## 🧪 Testing (Future)

```bash
npm test
```

Proposed structure:
```
tests/
├── components/
│   ├── EfficiencyCalculator.test.jsx
│   ├── EfficiencyDashboard.test.jsx
│   └── BuildingSelector.test.jsx
└── services/
    └── api.test.js
```

## 🚀 Build and Deployment

### Production Build

```bash
npm run build
```

Included optimizations:
- Code minification
- Tree shaking
- Code splitting
- Asset compression

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run build

# Upload dist/ folder
netlify deploy --prod --dir=dist
```

### Production Environment Variables

Configure in hosting service:

```
VITE_API_URL=https://api-production.com
```

## 📱 Screenshots

### Efficiency Calculator
![Calculator](docs/screenshots/calculator.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Building Selector
![Selector](docs/screenshots/selector.png)

## 🔧 Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
```

## 🐛 Troubleshooting

### Error: Cannot connect to API

**Solution:**
1. Verify backend is running
2. Check `VITE_API_URL` in `.env`
3. Verify CORS in backend

### Error: Module not found

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot reload not working

**Solution:**
```bash
# Restart server
npm run dev
```

## 📦 Available Scripts

```json
{
  "dev": "vite",              // Development mode
  "build": "vite build",      // Production build
  "preview": "vite preview",  // Build preview
  "lint": "eslint ."          // Linter
}
```

## 🤝 Contributing

### Style Guide

- Use functional components
- Hooks for state and effects
- PropTypes or TypeScript (future)
- CSS Modules or Styled Components (optional)

### Naming Conventions

- Components: PascalCase
- Files: PascalCase for components
- CSS: same name as component
- Functions: camelCase

## 📚 Resources

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Recharts Docs](https://recharts.org/)
- [Axios Docs](https://axios-http.com/)

## 📝 Roadmap

- [ ] TypeScript migration
- [ ] Unit tests
- [ ] E2E tests with Playwright
- [ ] Dark mode
- [ ] Export to CSV/PDF
- [ ] Internationalization (i18n)
- [ ] PWA support
- [ ] Offline mode

---

**Version:** 1.0.0  
**React:** 18.2.0  
**Vite:** 5.0.11

