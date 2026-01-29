// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// const HumidityTemperatureTimeSeries = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
//         <h2 className="text-sm font-semibold mb-1 text-white">temperature-humidity</h2>
//         <div className="flex-1 flex items-center justify-center text-gray-400">
//           No data available
//         </div>
//       </div>
//     )
//   }

//   const chartData = data.slice(-20).map(d => ({
//     time: d.time || '',
//     humidity: d.humidity || 0,
//     temperature: d.temperature || 0,
//   }))

//   return (
//     <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
//       <h2 className="text-sm font-semibold mb-1 text-white">temperature-humidity</h2>
      
//       <div className="flex-1 min-h-0">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
//             <XAxis 
//               dataKey="time" 
//               stroke="#888"
//               tick={{ fill: '#888', fontSize: 10 }}
//             />
//             <YAxis 
//               domain={['dataMin - 5', 'dataMax + 5']}
//               stroke="#888"
//               tick={{ fill: '#888', fontSize: 10 }}
//             />
//             <Tooltip 
//               contentStyle={{ 
//                 backgroundColor: '#2d2d2d', 
//                 border: '1px solid #404040',
//                 borderRadius: '4px',
//                 color: '#fff',
//                 fontSize: '12px'
//               }}
//             />
//             <Legend 
//               wrapperStyle={{ color: '#888', fontSize: '10px' }}
//               iconSize={10}
//             />
//             <Line 
//               type="monotone" 
//               dataKey="humidity" 
//               stroke="#22c55e" 
//               strokeWidth={2}
//               dot={false}
//               name="Humidity (%)"
//             />
//             <Line 
//               type="monotone" 
//               dataKey="temperature" 
//               stroke="#f59e0b" 
//               strokeWidth={2}
//               dot={false}
//               name="Temperature (°C)"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }

// export default HumidityTemperatureTimeSeries

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const HumidityTemperatureTimeSeries = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
        <h2 className="text-sm font-semibold mb-1 text-white">
          temperature-humidity
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  // ✅ Sort strictly by timestamp (oldest → newest)
  const sortedData = [...data]
    .filter(d => d.timestamp)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    )

  // ✅ Take latest 20 points
  const recentData = sortedData.slice(-20)

  const chartData = recentData.map(d => ({
    time: d.timestamp,
    humidity: Number(d.humidity) || 0,
    temperature: Number(d.temperature) || 0,
  }))

  // ✅ Separate ranges for humidity & temperature
  const humidityValues = chartData.map(d => d.humidity)
  const temperatureValues = chartData.map(d => d.temperature)

  const hMin = Math.min(...humidityValues)
  const hMax = Math.max(...humidityValues)
  const tMin = Math.min(...temperatureValues)
  const tMax = Math.max(...temperatureValues)

  // ✅ Dynamic padding (percentage-based)
  const hPadding = Math.max((hMax - hMin) * 0.2, 1)
  const tPadding = Math.max((tMax - tMin) * 0.2, 0.5)

  return (
    <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold mb-1 text-white">
        temperature-humidity
      </h2>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            key={chartData[chartData.length - 1]?.time}
            margin={{ top: 5, right: 10, bottom: 20, left: 10 }}
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

            {/* ✅ Humidity Y-axis */}
            <YAxis
              yAxisId="humidity"
              domain={[hMin - hPadding, hMax + hPadding]}
              stroke="#22c55e"
              tick={{ fill: '#22c55e', fontSize: 10 }}
              label={{
                value: 'Humidity (%)',
                angle: -90,
                position: 'insideLeft',
                fill: '#22c55e',
                style: { fontSize: '10px' },
              }}
            />

            {/* ✅ Temperature Y-axis */}
            <YAxis
              yAxisId="temperature"
              orientation="right"
              domain={[tMin - tPadding, tMax + tPadding]}
              stroke="#f59e0b"
              tick={{ fill: '#f59e0b', fontSize: 10 }}
              label={{
                value: 'Temperature (°C)',
                angle: 90,
                position: 'insideRight',
                fill: '#f59e0b',
                style: { fontSize: '10px' },
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#2d2d2d',
                border: '1px solid #404040',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val, dataKey) => {
                if (dataKey === 'humidity') {
                  return [`${val.toFixed(1)} %`, 'Humidity']
                }
                if (dataKey === 'temperature') {
                  return [`${val.toFixed(1)} °C`, 'Temperature']
                }
                return val
              }}
            />

            <Legend wrapperStyle={{ color: '#888', fontSize: '10px' }} />

            <Line
              yAxisId="humidity"
              type="monotone"
              dataKey="humidity"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              name="Humidity"
            />

            <Line
              yAxisId="temperature"
              type="monotone"
              dataKey="temperature"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              name="Temperature"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default HumidityTemperatureTimeSeries
