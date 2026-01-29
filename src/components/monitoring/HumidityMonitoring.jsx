// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts'

// const HumidityMonitoring = ({ value, data }) => {
//   // ✅ sanitize value
//   const safeValue = Number(value)
//   const displayValue = Number.isFinite(safeValue) ? safeValue : 0

//   // ✅ guard data
//   const safeData = Array.isArray(data) ? data : []

//   const chartData = safeData.slice(-20).map((d, index) => ({
//     index,
//     value: Number(d?.humidity) || 0,
//   }))

//   return (
//     <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
//       <h2 className="text-sm font-semibold mb-1 text-white">
//         Humidity Monitoring
//       </h2>

//       <div className="flex flex-col items-center justify-center flex-1 min-h-0">
//         <div className="text-5xl font-bold text-green-500 mb-2">
//           {displayValue.toFixed(1)}
//         </div>

//         <div className="w-full flex-1 min-h-0" style={{ maxHeight: '80px' }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={chartData}
//               margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
//               <XAxis hide />
//               <YAxis hide />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: '#2d2d2d',
//                   border: '1px solid #404040',
//                   borderRadius: '4px',
//                   color: '#fff',
//                   fontSize: '12px',
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#22c55e"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default HumidityMonitoring

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts'

// const HumidityMonitoring = ({ value, data }) => {
//   // ✅ sanitize latest value
//   const safeValue = Number(value)
//   const displayValue = Number.isFinite(safeValue) ? safeValue : 0

//   // ✅ guard & sort data by time (oldest → newest)
//   const sortedData = Array.isArray(data)
//     ? [...data].sort(
//         (a, b) =>
//           new Date(a.timestamp || a.ts) - new Date(b.timestamp || b.ts)
//       )
//     : []

//   // ✅ take the latest 20 points
//   const recentData = sortedData.slice(-20)

//   // ✅ prepare chart data
//   const chartData = recentData.map((d, index) => ({
//     index,
//     value: Number(d?.humidity) || 0,
//     time: d.timestamp || d.ts,
//   }))

//   return (
//     <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
//       <h2 className="text-sm font-semibold mb-1 text-white">
//         Humidity Monitoring
//       </h2>

//       <div className="flex flex-col items-center justify-center flex-1 min-h-0">
//         {/* ✅ latest value always shown */}
//         <div className="text-5xl font-bold text-green-500 mb-2">
//           {displayValue.toFixed(1)}
//         </div>

//         <div className="w-full flex-1 min-h-0" style={{ maxHeight: '80px' }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={chartData}
//               key={chartData[chartData.length - 1]?.time}
//               margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
//               <XAxis hide />
//               <YAxis hide />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: '#2d2d2d',
//                   border: '1px solid #404040',
//                   borderRadius: '4px',
//                   color: '#fff',
//                   fontSize: '12px',
//                 }}
//                 formatter={(val) => [`${Number(val).toFixed(1)} %`, 'Humidity']}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#22c55e"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default HumidityMonitoring

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const HumidityMonitoring = ({ value, data }) => {
  const safeValue = Number(value)
  const displayValue = Number.isFinite(safeValue) ? safeValue : 0

  // ✅ sort data (oldest → newest)
  const sortedData = Array.isArray(data)
    ? [...data].sort(
        (a, b) =>
          new Date(a.timestamp || a.ts) - new Date(b.timestamp || b.ts)
      )
    : []

  // ✅ take last 20 points
  const recentData = sortedData.slice(-20)

  const chartData = recentData.map((d, index) => ({
    index,
    value: Number(d?.humidity) || 0,
  }))

  // ✅ calculate dynamic Y-axis range
  const values = chartData.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)

  // small padding so line doesn’t touch edges
  const padding = Math.max((max - min) * 0.2, 0.5)

  const yMin = min - padding
  const yMax = max + padding

  return (
    <div className="bg-panel-bg border border-panel-border rounded p-2 h-full flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold mb-1 text-white">
        Humidity Monitoring
      </h2>

      <div className="flex flex-col items-center justify-center flex-1 min-h-0">
        <div className="text-5xl font-bold text-green-500 mb-2">
          {displayValue.toFixed(1)}
        </div>

        <div className="w-full flex-1 min-h-0" style={{ maxHeight: '80px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              key={chartData[chartData.length - 1]?.index}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis hide />

              {/* 🔥 THIS IS THE KEY FIX */}
              <YAxis
                domain={[yMin, yMax]}
                hide
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#2d2d2d',
                  border: '1px solid #404040',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val) => [`${Number(val).toFixed(2)} %`, 'Humidity']}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default HumidityMonitoring
