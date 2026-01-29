# Coal Mines Monitoring Dashboard

A professional React-based dashboard for monitoring coal mines data including voltage, humidity, temperature, and location (latitude/longitude) with timestamps.

## Features

- **Real-time Data Visualization**: Multiple chart types including scatter plots, line charts, and bar charts
- **Monitoring Gauges**: Visual gauges for humidity, temperature, and voltage
- **Location Tracking**: Interactive map showing mine locations with color-coded markers
- **Statistics Display**: Comprehensive statistics tables with max, min, mean, and difference calculations
- **Auto-refresh**: Automatic data refresh every 10 seconds
- **Responsive Design**: Works on desktop and tablet devices
- **Dark Theme**: Professional dark theme matching modern dashboard aesthetics

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Charting library for React
- **React Leaflet**: Map component for location visualization
- **Leaflet**: Open-source JavaScript library for mobile-friendly interactive maps

## Project Structure

```
coal-mines-project/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── TemperatureHumidityRelation.jsx
│   │   │   ├── HumidityTemperatureTimeSeries.jsx
│   │   │   └── VoltageBarChart.jsx
│   │   ├── monitoring/
│   │   │   ├── HumidityMonitoring.jsx
│   │   │   ├── VoltageTemperatureDisplay.jsx
│   │   │   └── GaugePanel.jsx
│   │   ├── maps/
│   │   │   └── LocationTracing.jsx
│   │   ├── Dashboard.jsx
│   │   └── Header.jsx
│   ├── utils/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## Building for Production

Build the project for production:

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run `netlify deploy` for draft, or `netlify deploy --prod` for production
3. Or connect your GitHub repository to Netlify for automatic deployments

### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run `npm run deploy`

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t coal-mines-dashboard .
docker run -p 80:80 coal-mines-dashboard
```

## Customization

### Connecting to Real API

Replace the mock data in `src/utils/mockData.js` with actual API calls:

```javascript
// Example API integration
export const fetchMineData = async () => {
  const response = await fetch('YOUR_API_ENDPOINT')
  const data = await response.json()
  return data
}
```

Then update `src/components/Dashboard.jsx` to use the real API:

```javascript
useEffect(() => {
  const fetchData = async () => {
    const newData = await fetchMineData()
    setData(newData)
  }
  
  fetchData()
  const interval = setInterval(fetchData, 10000)
  return () => clearInterval(interval)
}, [])
```

### Styling

Modify `tailwind.config.js` to customize colors, spacing, and other design tokens.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

