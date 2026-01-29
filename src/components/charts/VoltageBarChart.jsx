// import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// const VoltageBarChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
//         <h2 className="text-sm font-semibold mb-1 text-white">Voltage-Temperature</h2>
//         <div className="flex-1 flex items-center justify-center text-gray-400">
//           No data available
//         </div>
//       </div>
//     )
//   }

//   const chartData = data.slice(-10).map(d => ({
//     time: d.time ? d.time.split(':').slice(0, 2).join(':') : '',
//     voltage: d.voltage || 0,
//     temperature: d.temperature || 0,
//   }))

//   // Calculate ranges for normalization
//   const voltageValues = chartData.map(d => d.voltage).filter(v => !isNaN(v))
//   const temperatureValues = chartData.map(d => d.temperature).filter(v => !isNaN(v))
  
//   if (voltageValues.length === 0 || temperatureValues.length === 0) {
//     return (
//       <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
//         <h2 className="text-sm font-semibold mb-1 text-white">Voltage-Temperature</h2>
//         <div className="flex-1 flex items-center justify-center text-gray-400">
//           Insufficient data
//         </div>
//       </div>
//     )
//   }

//   const voltageMin = Math.min(...voltageValues)
//   const voltageMax = Math.max(...voltageValues)
//   const temperatureMin = Math.min(...temperatureValues)
//   const temperatureMax = Math.max(...temperatureValues)
  
//   // Normalize to 0-100 scale for visual comparison while preserving actual ranges
//   const voltageRange = voltageMax - voltageMin || 0.1
//   const temperatureRange = temperatureMax - temperatureMin || 1
  
//   // Normalize data for visualization (0-100 scale)
//   const normalizedData = chartData.map(d => ({
//     ...d,
//     voltageNormalized: voltageRange > 0 ? ((d.voltage - voltageMin) / voltageRange) * 100 : 50,
//     temperatureNormalized: temperatureRange > 0 ? ((d.temperature - temperatureMin) / temperatureRange) * 100 : 50,
//   }))

//   return (
//     <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
//       <h2 className="text-sm font-semibold mb-1 text-white">Voltage-Temperature</h2>
      
//       <div className="flex-1 min-h-0">
//         <ResponsiveContainer width="100%" height="100%">
//           <ComposedChart data={normalizedData} margin={{ top: 5, right: 30, bottom: 20, left: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
//             <XAxis 
//               dataKey="time" 
//               stroke="#888"
//               tick={{ fill: '#888', fontSize: 10 }}
//             />
//             <YAxis 
//               yAxisId="voltage"
//               stroke="#ef4444"
//               tick={{ fill: '#ef4444', fontSize: 10 }}
//               label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: '#ef4444', style: { fontSize: '10px' } }}
//               domain={[0, 100]}
//               tickFormatter={(value) => {
//                 // Convert normalized value back to actual voltage for display
//                 const actualValue = voltageMin + (value / 100) * voltageRange
//                 return actualValue.toFixed(2)
//               }}
//             />
//             <YAxis 
//               yAxisId="temperature"
//               orientation="right"
//               stroke="#f59e0b"
//               tick={{ fill: '#f59e0b', fontSize: 10 }}
//               label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight', fill: '#f59e0b', style: { fontSize: '10px' } }}
//               domain={[0, 100]}
//               tickFormatter={(value) => {
//                 // Convert normalized value back to actual temperature for display
//                 const actualValue = temperatureMin + (value / 100) * temperatureRange
//                 return actualValue.toFixed(1)
//               }}
//             />
//             <Tooltip 
//               contentStyle={{ 
//                 backgroundColor: '#2d2d2d', 
//                 border: '1px solid #404040',
//                 borderRadius: '4px',
//                 color: '#fff',
//                 fontSize: '12px'
//               }}
//               formatter={(value, name, props) => {
//                 if (name === 'Voltage') {
//                   return [`${props.payload.voltage.toFixed(3)} V`, 'Voltage']
//                 }
//                 if (name === 'Temperature') {
//                   return [`${props.payload.temperature.toFixed(1)} °C`, 'Temperature']
//                 }
//                 return [value, name]
//               }}
//             />
//             <Legend 
//               wrapperStyle={{ color: '#888', fontSize: '10px' }}
//               iconSize={10}
//             />
//             <Bar 
//               yAxisId="voltage"
//               dataKey="voltageNormalized" 
//               fill="#ef4444" 
//               name="Voltage"
//             />
//             <Line 
//               yAxisId="temperature"
//               type="monotone"
//               dataKey="temperatureNormalized" 
//               stroke="#f59e0b" 
//               strokeWidth={2}
//               dot={false}
//               name="Temperature"
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }

// export default VoltageBarChart

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const VoltageBarChart = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
        <h2 className="text-sm font-semibold mb-1 text-white">
          Voltage-Temperature
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  // ✅ 1. SORT DATA BY TIME (oldest → newest)
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a.timestamp || a.ts) - new Date(b.timestamp || b.ts)
  )

  // ✅ 2. TAKE THE NEWEST N POINTS
  const recentData = sortedData.slice(-10) // change to -100 if needed

  // ✅ 3. PREPARE CHART DATA
  const chartData = recentData.map(d => ({
    time: d.timestamp || d.ts,
    voltage: Number(d.voltage) || 0,
    temperature: Number(d.temperature) || 0,
  }))

  const voltageValues = chartData.map(d => d.voltage)
  const temperatureValues = chartData.map(d => d.temperature)

  const voltageMin = Math.max(Math.min(...voltageValues)-0.5, 0)
  const voltageMax = Math.min(Math.max(...voltageValues)+0.5, 35)
  const temperatureMin = Math.max(Math.min(...temperatureValues)-0.5, 0)
  const temperatureMax = Math.min(Math.max(...temperatureValues)+0.5, 60)

  const voltageRange = voltageMax - voltageMin || 0.1
  const temperatureRange = temperatureMax - temperatureMin || 1

  // ✅ 4. NORMALIZE DATA (0–100)
  const normalizedData = chartData.map(d => ({
    ...d,
    voltageNormalized:
      ((d.voltage - voltageMin) / voltageRange) * 100,
    temperatureNormalized:
      ((d.temperature - temperatureMin) / temperatureRange) * 100,
  }))

  return (
    <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold mb-1 text-white">
        Voltage-Temperature
      </h2>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={normalizedData}
            key={normalizedData[normalizedData.length - 1]?.time}
            margin={{ top: 5, right: 30, bottom: 20, left: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />

            <XAxis
              dataKey="time"
              stroke="#888"
              tick={{ fill: '#888', fontSize: 10 }}
              tickFormatter={t =>
                new Date(t).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              }
            />

            <YAxis
              yAxisId="voltage"
              stroke="#ef4444"
              domain={[0, 100]}
              tickFormatter={v =>
                (voltageMin + (v / 100) * voltageRange).toFixed(2)
              }
            />

            <YAxis
              yAxisId="temperature"
              orientation="right"
              stroke="#f59e0b"
              domain={[0, 100]}
              tickFormatter={v =>
                (temperatureMin + (v / 100) * temperatureRange).toFixed(1)
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#2d2d2d',
                border: '1px solid #404040',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value, name, props) => {
                if (name === 'Voltage') {
                  return [`${props.payload.voltage.toFixed(3)} V`, 'Voltage']
                }
                if (name === 'Temperature') {
                  return [
                    `${props.payload.temperature.toFixed(1)} °C`,
                    'Temperature',
                  ]
                }
                return value
              }}
            />

            <Legend wrapperStyle={{ color: '#888', fontSize: '10px' }} />

            <Bar
              yAxisId="voltage"
              dataKey="voltageNormalized"
              fill="#ef4444"
              name="Voltage"
            />

            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temperatureNormalized"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Temperature"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default VoltageBarChart
